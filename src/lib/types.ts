// ============================================================================
// MULTI-MATCH: 4-STAGE ALGORITHMIC MATCHMAKING ENGINE DATA CONTRACTS
// Fair & Fast Multiplayer Team Balancing System
// ============================================================================

export type Region = "India" | "Asia" | "EU" | "NA";
export const REGIONS: Region[] = ["India", "Asia", "EU", "NA"];

export type PlayerRole = "Rusher" | "Sniper" | "Support" | "Tank" | "Flex";
export const ROLES: PlayerRole[] = ["Rusher", "Sniper", "Support", "Tank", "Flex"];

export type ExperienceLevel = "Beginner" | "Intermediate" | "Advanced" | "Pro";
export const EXPERIENCE_LEVELS: ExperienceLevel[] = ["Beginner", "Intermediate", "Advanced", "Pro"];

export type GameMode = "4v4" | "5v5" | "3v3" | "2v2";
export const GAME_MODES: GameMode[] = ["4v4", "5v5", "3v3", "2v2"];

export const PLAYERS_PER_TEAM: Record<GameMode, number> = {
  "2v2": 2,
  "3v3": 3,
  "4v4": 4,
  "5v5": 5,
};

/**
 * Player Schema explicitly defined in Section 6 of the Project Synopsis:
 * - Player ID: e.g. P102
 * - Skill Rating: e.g. 1520 (Elo / MMR)
 * - Latency (Ping): e.g. 35 ms
 * - Region: e.g. India
 * - Role: e.g. Rusher
 * - Game Mode: e.g. 4v4
 * - Waiting Time: e.g. 42 seconds
 * - Win Rate: e.g. 58%
 * - Experience Level: e.g. Intermediate
 */
export interface Player {
  id: string; // e.g. "P102"
  numId: number;
  name: string;
  rating: number; // MMR / Elo
  ping: number; // Latency in ms
  region: Region; // Geographic region
  role: PlayerRole; // Team role
  gameMode: GameMode; // Preferred matchmaking mode
  wait: number; // Elapsed queue waiting time in seconds
  winRate: number; // Win rate percentage (0 - 100)
  experienceLevel: ExperienceLevel;
  priorityScore?: number; // Dynamically computed priority
  joinedAt?: number;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
  totalRating: number;
  avgRating: number;
  avgPing: number;
  roleDistribution: Record<PlayerRole, number>;
  regionDistribution: Record<Region, number>;
}

export interface MatchQualityBreakdown {
  skillBalanceScore: number; // 0 - 100
  pingHarmonyScore: number; // 0 - 100
  roleSynergyScore: number; // 0 - 100
  queueFairnessScore: number; // 0 - 100
  overallScore: number; // 0 - 100 Composite Match Quality Score
  grade: "S+" | "S" | "A" | "B" | "C" | "D";
}

export interface EdgeServer {
  id: number;
  name: string;
  region: Region;
  capacity: number;
  currentLoad: number;
  baseLatencyMs: number;
}

export interface MatchmakingMatch {
  id: string;
  gameMode: GameMode;
  teamA: Team;
  teamB: Team;
  ratingDelta: number; // |avgRatingA - avgRatingB|
  pingDelta: number; // |avgPingA - avgPingB|
  quality: MatchQualityBreakdown;
  assignedServer: EdgeServer;
  effectiveLatencyMs: number;
  matchedAt: number;
  algorithmStrategy: "proposed_greedy_graph" | "pure_random" | "skill_only_greedy";
  executionTimeMs: number;
  dijkstraTrace?: {
    dominantGateway: string;
    shortestPathHops: string[];
    pathLatencyMs: number;
    playerCountPerRegion: Record<Region, number>;
  };
}

export interface GreedyStepTrace {
  step: number;
  player: Player;
  assignedTeam: "Team A" | "Team B";
  reason: string;
  teamASumBefore: number;
  teamBSumBefore: number;
  teamASumAfter: number;
  teamBSumAfter: number;
  teamACount: number;
  teamBCount: number;
}

export interface HeapTraceItem {
  operation: "insert" | "extract" | "heapify" | "age_tick";
  description: string;
  affectedIndices: number[];
  heapSnapshot: Array<{ id: string; priority: number }>;
}

export interface GraphEdge {
  u: string; // Player ID A
  v: string; // Player ID B
  weight: number; // Compatibility score (0 - 100)
  skillDiff: number;
  pingDiff: number;
  sameRegion: boolean;
  roleSynergy: boolean;
}

export interface SortingBenchmarkResult {
  algorithmName: string;
  timeMs: number;
  comparisonsCount: number;
  swapsCount: number;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface StrategyBenchmark {
  strategyName: string;
  avgSkillDelta: number;
  avgPingDelta: number;
  avgMatchQuality: number;
  executionTimeMs: number;
  matchesFormed: number;
  unmatchedPlayers: number;
}
