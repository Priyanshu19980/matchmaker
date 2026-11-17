import { Player, GraphEdge, GameMode, PLAYERS_PER_TEAM } from "./types";

export interface PairwiseCompatibility {
  score: number; // 0 - 100
  skillDiff: number;
  pingDiff: number;
  sameRegion: boolean;
  roleSynergy: boolean;
}

/**
 * Pairwise compatibility mathematical formulation as stated in Synopsis Section 5.C:
 * Edge weight W(u, v) = 0.35 * RegionScore + 0.35 * SkillScore + 0.20 * PingScore + 0.10 * RoleScore
 */
export function calculateCompatibility(a: Player, b: Player): PairwiseCompatibility {
  const skillDiff = Math.abs(a.rating - b.rating);
  const pingDiff = Math.abs(a.ping - b.ping);
  const sameRegion = a.region === b.region;
  const roleSynergy = a.role !== b.role;

  // Region gate
  const regionScore = sameRegion ? 100 : 25;

  // Skill score: 100 if identical, decays as skillDiff grows
  const skillScore = Math.max(0, 100 - (skillDiff / 400) * 100);

  // Ping harmony score
  const avgPing = (a.ping + b.ping) / 2;
  const pingScore = Math.max(0, 100 - (pingDiff * 0.7 + avgPing * 0.3));

  // Role synergy (diverse roles complement each other)
  const roleScore = roleSynergy ? 100 : 65;

  const score = Math.round(
    regionScore * 0.35 +
    skillScore * 0.35 +
    pingScore * 0.20 +
    roleScore * 0.10
  );

  return { score, skillDiff, pingDiff, sameRegion, roleSynergy };
}

export interface CompatibilityNetwork {
  vertices: Player[];
  edges: GraphEdge[];
  adjacencyList: Map<string, Array<{ targetId: string; weight: number }>>;
  adjacencyMatrix: number[][]; // V x V matrix
  density: number;
  avgDegree: number;
  connectedComponentsCount: number;
}

/**
 * Constructs both Adjacency Matrix and Adjacency List representations: O(V²)
 */
export function buildCompatibilityNetwork(
  players: Player[],
  edgeThreshold = 55
): CompatibilityNetwork {
  const v = players.length;
  const edges: GraphEdge[] = [];
  const adjacencyList = new Map<string, Array<{ targetId: string; weight: number }>>();
  const adjacencyMatrix: number[][] = Array.from({ length: v }, () => Array(v).fill(0));

  players.forEach((p) => adjacencyList.set(p.id, []));

  for (let i = 0; i < v; i++) {
    for (let j = i + 1; j < v; j++) {
      const p1 = players[i];
      const p2 = players[j];
      const compat = calculateCompatibility(p1, p2);

      adjacencyMatrix[i][j] = compat.score;
      adjacencyMatrix[j][i] = compat.score;

      if (compat.score >= edgeThreshold) {
        const edge: GraphEdge = {
          u: p1.id,
          v: p2.id,
          weight: compat.score,
          skillDiff: compat.skillDiff,
          pingDiff: compat.pingDiff,
          sameRegion: compat.sameRegion,
          roleSynergy: compat.roleSynergy,
        };
        edges.push(edge);

        adjacencyList.get(p1.id)?.push({ targetId: p2.id, weight: compat.score });
        adjacencyList.get(p2.id)?.push({ targetId: p1.id, weight: compat.score });
      }
    }
  }

  // Calculate connected components using BFS
  let componentsCount = 0;
  const visited = new Set<string>();
  players.forEach((p) => {
    if (!visited.has(p.id)) {
      componentsCount++;
      const queue = [p.id];
      visited.add(p.id);
      while (queue.length > 0) {
        const curr = queue.shift()!;
        const neighbors = adjacencyList.get(curr) || [];
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor.targetId)) {
            visited.add(neighbor.targetId);
            queue.push(neighbor.targetId);
          }
        }
      }
    }
  });

  const maxPossibleEdges = (v * (v - 1)) / 2;
  const density = maxPossibleEdges > 0 ? Math.round((edges.length / maxPossibleEdges) * 100) / 100 : 0;
  const avgDegree = v > 0 ? Math.round(((2 * edges.length) / v) * 10) / 10 : 0;

  return {
    vertices: players,
    edges,
    adjacencyList,
    adjacencyMatrix,
    density,
    avgDegree,
    connectedComponentsCount: componentsCount,
  };
}

/**
 * Graph-Theoretic Lobby Selection Algorithm:
 * Finds a densest mutually-compatible subgraph cluster of size 2K.
 * Starting from an anchor player (e.g. Highest Priority Player from Priority Queue).
 */
export function extractCompatibleLobbySubgraph(
  pool: Player[],
  network: CompatibilityNetwork,
  mode: GameMode,
  anchorPlayer?: Player
): Player[] {
  const targetSize = PLAYERS_PER_TEAM[mode] * 2;
  if (pool.length <= targetSize) return [...pool];

  const anchor = anchorPlayer || pool[0];
  const selected: Player[] = [anchor];
  const candidatePool = new Set(pool.filter((p) => p.id !== anchor.id));

  while (selected.length < targetSize && candidatePool.size > 0) {
    let bestCandidate: Player | null = null;
    let maxClusterAffinity = -Infinity;

    for (const candidate of candidatePool) {
      let clusterCompatSum = 0;
      for (const member of selected) {
        const compat = calculateCompatibility(candidate, member);
        clusterCompatSum += compat.score;
      }

      const meanCompat = clusterCompatSum / selected.length;
      // Slight wait time acceleration factor
      const affinity = meanCompat + Math.min(12, candidate.wait * 0.1);

      if (affinity > maxClusterAffinity) {
        maxClusterAffinity = affinity;
        bestCandidate = candidate;
      }
    }

    if (bestCandidate) {
      selected.push(bestCandidate);
      candidatePool.delete(bestCandidate);
    } else {
      break;
    }
  }

  // Fallback to fill capacity if disconnected
  if (selected.length < targetSize && candidatePool.size > 0) {
    for (const remaining of candidatePool) {
      selected.push(remaining);
      if (selected.length === targetSize) break;
    }
  }

  return selected;
}
