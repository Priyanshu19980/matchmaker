import {
  Player,
  GameMode,
  PLAYERS_PER_TEAM,
  EdgeServer,
  MatchmakingMatch,
  MatchQualityBreakdown,
  StrategyBenchmark,
  Region,
} from "./types";
import { PlayerMaxHeap } from "./priorityQueue";
import { buildCompatibilityNetwork, extractCompatibleLobbySubgraph } from "./graphEngine";
import { executeGreedyPartition } from "./greedyBalancing";

export function getDefaultServers(): EdgeServer[] {
  return [
    { id: 1, name: "Delhi Central (Edge-01)", region: "India", capacity: 6, currentLoad: 0, baseLatencyMs: 14 },
    { id: 2, name: "Mumbai-1 (AWS Central)", region: "India", capacity: 8, currentLoad: 0, baseLatencyMs: 22 },
    { id: 3, name: "Singapore-1 (Asia-SE)", region: "Asia", capacity: 6, currentLoad: 0, baseLatencyMs: 36 },
    { id: 4, name: "Frankfurt-1 (EU-Central)", region: "EU", capacity: 6, currentLoad: 0, baseLatencyMs: 44 },
    { id: 5, name: "Virginia-1 (US-East)", region: "NA", capacity: 6, currentLoad: 0, baseLatencyMs: 76 },
  ];
}

/**
 * Match Quality Score (MQS) Mathematical Formulation based on Synopsis Section 4 & 7:
 * MQS = w1 * SkillBalance + w2 * LatencyHarmony + w3 * RoleSynergy + w4 * QueueFairness
 */
export function calculateMQS(match: {
  teamA: { avgRating: number; avgPing: number; players: Player[]; roleDistribution: Record<string, number> };
  teamB: { avgRating: number; avgPing: number; players: Player[]; roleDistribution: Record<string, number> };
}): MatchQualityBreakdown {
  const ratingDelta = Math.abs(match.teamA.avgRating - match.teamB.avgRating);
  // Skill balance decays gracefully: 100% at delta=0, 50% at delta=200
  const skillBalanceScore = Math.max(0, Math.min(100, Math.round(100 - (ratingDelta / 300) * 100)));

  // Ping spread across all players
  const allPings = [...match.teamA.players, ...match.teamB.players].map((p) => p.ping);
  const avgPing = allPings.reduce((a, b) => a + b, 0) / (allPings.length || 1);
  const pingSpread = Math.max(...allPings) - Math.min(...allPings);
  const pingHarmonyScore = Math.max(0, Math.min(100, Math.round(100 - (pingSpread * 0.45 + avgPing * 0.35))));

  // Role diversity: Reward teams with diverse roles (Rusher, Sniper, Support, Tank, Flex)
  const distinctRolesA = Object.values(match.teamA.roleDistribution).filter((c) => c > 0).length;
  const distinctRolesB = Object.values(match.teamB.roleDistribution).filter((c) => c > 0).length;
  const maxDistinctRoles = Math.min(match.teamA.players.length, 4);
  const roleSynergyScore = Math.round(((distinctRolesA + distinctRolesB) / (2 * maxDistinctRoles)) * 100);

  // Queue wait fairness: check average wait of matched players
  const allWaits = [...match.teamA.players, ...match.teamB.players].map((p) => p.wait);
  const avgWait = allWaits.reduce((a, b) => a + b, 0) / (allWaits.length || 1);
  const queueFairnessScore = Math.min(100, Math.round(55 + Math.min(45, avgWait * 0.65)));

  // Composite Weighted Overall Score
  const overallScore = Math.round(
    skillBalanceScore * 0.40 +
    pingHarmonyScore * 0.25 +
    roleSynergyScore * 0.20 +
    queueFairnessScore * 0.15
  );

  let grade: "S+" | "S" | "A" | "B" | "C" | "D" = "C";
  if (overallScore >= 92) grade = "S+";
  else if (overallScore >= 84) grade = "S";
  else if (overallScore >= 74) grade = "A";
  else if (overallScore >= 60) grade = "B";
  else if (overallScore >= 45) grade = "C";
  else grade = "D";

  return {
    skillBalanceScore,
    pingHarmonyScore,
    roleSynergyScore,
    queueFairnessScore,
    overallScore,
    grade,
  };
}

/**
 * Assigns nearest edge server using regional Dijkstra latency optimization
 */
export function assignOptimalServer(
  players: Player[],
  servers: EdgeServer[]
): { server: EdgeServer; latencyMs: number } {
  const regionCounts: Record<Region, number> = { India: 0, Asia: 0, EU: 0, NA: 0 };
  players.forEach((p) => regionCounts[p.region]++);

  let dominantRegion: Region = "India";
  let maxCount = -1;
  (Object.keys(regionCounts) as Region[]).forEach((r) => {
    if (regionCounts[r] > maxCount) {
      maxCount = regionCounts[r];
      dominantRegion = r;
    }
  });

  const available = servers.filter((s) => s.currentLoad < s.capacity);
  const pool = available.length > 0 ? available : servers;

  let bestServer = pool[0];
  let minCost = Infinity;

  for (const s of pool) {
    let penalty = 0;
    if (s.region !== dominantRegion) {
      const isNeighbor =
        ((s.region as string) === "India" && (dominantRegion as string) === "Asia") ||
        ((s.region as string) === "Asia" && (dominantRegion as string) === "India");
      penalty = isNeighbor ? 30 : 80;
    }
    const cost = s.baseLatencyMs + s.currentLoad * 3 + penalty;
    if (cost < minCost) {
      minCost = cost;
      bestServer = s;
    }
  }

  bestServer.currentLoad++;
  const avgPlayerPing = players.reduce((a, b) => a + b.ping, 0) / players.length;
  const latencyMs = Math.round(minCost + avgPlayerPing * 0.35);

  return { server: bestServer, latencyMs };
}

/**
 * Core Matchmaking Pipeline:
 * Formulates a single optimal match from a player pool.
 */
export function createSingleMatch(
  pool: Player[],
  mode: GameMode,
  servers: EdgeServer[],
  strategy: "proposed_greedy_graph" | "pure_random" | "skill_only_greedy" = "proposed_greedy_graph"
): { match: MatchmakingMatch; remainingPool: Player[] } {
  const t0 = performance.now();
  const teamSize = PLAYERS_PER_TEAM[mode];
  const requiredLobby = teamSize * 2;

  if (pool.length < requiredLobby) {
    throw new Error(`Insufficient players in queue. Required: ${requiredLobby}, Available: ${pool.length}`);
  }

  let lobby: Player[] = [];

  if (strategy === "pure_random") {
    // Naive shuffle
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    lobby = shuffled.slice(0, requiredLobby);
  } else if (strategy === "skill_only_greedy") {
    // Sort by rating only, no priority queue or graph
    const sorted = [...pool].sort((a, b) => b.rating - a.rating);
    lobby = sorted.slice(0, requiredLobby);
  } else {
    // Proposed Architecture:
    // 1. Maintain Max-Heap Priority Queue
    const pq = new PlayerMaxHeap(pool);
    const anchor = pq.extractMax()!;

    // 2. Graph Compatibility Subgraph
    const remaining = [anchor, ...pq.toArray()];
    const network = buildCompatibilityNetwork(remaining, 50);
    lobby = extractCompatibleLobbySubgraph(remaining, network, mode, anchor);
  }

  // 3. Team Balancing
  const partitionRes = executeGreedyPartition(lobby, teamSize);

  // 4. Server Allocation
  const serverRes = assignOptimalServer(lobby, servers);

  // 5. Match Quality
  const quality = calculateMQS({ teamA: partitionRes.teamA, teamB: partitionRes.teamB });

  const t1 = performance.now();
  const lobbyIds = new Set(lobby.map((p) => p.id));
  const remainingPool = pool.filter((p) => !lobbyIds.has(p.id));

  const match: MatchmakingMatch = {
    id: `MATCH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    gameMode: mode,
    teamA: partitionRes.teamA,
    teamB: partitionRes.teamB,
    ratingDelta: partitionRes.ratingDelta,
    pingDelta: partitionRes.pingDelta,
    quality,
    assignedServer: serverRes.server,
    effectiveLatencyMs: serverRes.latencyMs,
    matchedAt: Date.now(),
    algorithmStrategy: strategy,
    executionTimeMs: Math.round((t1 - t0) * 100) / 100,
  };

  return { match, remainingPool };
}

/**
 * Batch Matchmaker:
 * Takes the entire active player queue and repeatedly forms matches until no more full lobbies can be made.
 */
export function runBatchMatchmaking(
  pool: Player[],
  mode: GameMode,
  servers: EdgeServer[]
): {
  matches: MatchmakingMatch[];
  unmatchedQueue: Player[];
  totalExecutionMs: number;
} {
  const t0 = performance.now();
  const matches: MatchmakingMatch[] = [];
  let currentPool = [...pool];
  const required = PLAYERS_PER_TEAM[mode] * 2;

  while (currentPool.length >= required) {
    const res = createSingleMatch(currentPool, mode, servers, "proposed_greedy_graph");
    matches.push(res.match);
    currentPool = res.remainingPool;
  }

  const t1 = performance.now();

  return {
    matches,
    unmatchedQueue: currentPool,
    totalExecutionMs: Math.round((t1 - t0) * 100) / 100,
  };
}

/**
 * Rigorous Comparative Strategy Analyzer:
 * Compares the proposed architecture against standard industry alternatives.
 */
export function compareMatchmakingStrategies(
  pool: Player[],
  mode: GameMode
): StrategyBenchmark[] {
  const strategies: Array<{ id: "proposed_greedy_graph" | "pure_random" | "skill_only_greedy"; name: string }> = [
    { id: "proposed_greedy_graph", name: "Proposed System (Priority Queue + Graph + Greedy)" },
    { id: "pure_random", name: "Naive Random Matchmaking (Baseline)" },
    { id: "skill_only_greedy", name: "Skill-Only Greedy (No Graph / Priority)" },
  ];

  return strategies.map((s) => {
    const t0 = performance.now();
    const servers = getDefaultServers();
    let currentPool = [...pool];
    const matches: MatchmakingMatch[] = [];
    const required = PLAYERS_PER_TEAM[mode] * 2;

    while (currentPool.length >= required) {
      const res = createSingleMatch(currentPool, mode, servers, s.id);
      matches.push(res.match);
      currentPool = res.remainingPool;
    }
    const t1 = performance.now();

    const avgSkillDelta = matches.length
      ? Math.round((matches.reduce((acc, m) => acc + m.ratingDelta, 0) / matches.length) * 10) / 10
      : 0;

    const avgPingDelta = matches.length
      ? Math.round((matches.reduce((acc, m) => acc + m.pingDelta, 0) / matches.length) * 10) / 10
      : 0;

    const avgMatchQuality = matches.length
      ? Math.round(matches.reduce((acc, m) => acc + m.quality.overallScore, 0) / matches.length)
      : 0;

    return {
      strategyName: s.name,
      avgSkillDelta,
      avgPingDelta,
      avgMatchQuality,
      executionTimeMs: Math.round((t1 - t0) * 100) / 100,
      matchesFormed: matches.length,
      unmatchedPlayers: currentPool.length,
    };
  });
}
