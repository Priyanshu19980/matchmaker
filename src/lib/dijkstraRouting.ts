import { Player, Region, EdgeServer } from "./types";

export interface NetworkNode {
  id: string;
  name: string;
  type: "player_gateway" | "transit_router" | "edge_server";
  region: Region;
}

export interface NetworkEdge {
  u: string;
  v: string;
  latencyMs: number;
}

export interface DijkstraPathResult {
  sourceId: string;
  targetServerId: string;
  shortestDistanceMs: number;
  hops: string[];
}

export interface DijkstraStepTrace {
  step: number;
  currentNodeId: string;
  currentDistance: number;
  neighborEvaluated: string | null;
  edgeWeight: number | null;
  oldDistance: number | null;
  newDistance: number | null;
  relaxed: boolean;
  priorityQueueSnapshot: Array<{ id: string; dist: number }>;
  distancesSnapshot: Record<string, number>;
  visitedSnapshot: string[];
  description: string;
}

export const NODE_COORDINATES: Record<string, { x: number; y: number }> = {
  gw_india: { x: 220, y: 220 },
  srv_delhi: { x: 260, y: 130 },
  srv_mumbai: { x: 130, y: 310 },
  ixp_mumbai: { x: 130, y: 210 },
  ixp_chennai: { x: 250, y: 330 },

  gw_asia: { x: 440, y: 400 },
  ixp_singapore: { x: 360, y: 350 },
  srv_singapore: { x: 400, y: 440 },

  ixp_marseille: { x: 320, y: 170 },
  gw_eu: { x: 450, y: 150 },
  srv_frankfurt: { x: 530, y: 100 },
  ixp_london: { x: 420, y: 80 },

  ixp_atlantic: { x: 620, y: 120 },
  gw_na: { x: 700, y: 200 },
  srv_virginia: { x: 720, y: 300 },
};

export function getAllNetworkEdgesList(): Array<{ u: string; v: string; latency: number }> {
  return [
    { u: "gw_india", v: "srv_delhi", latency: 12 },
    { u: "gw_india", v: "ixp_mumbai", latency: 18 },
    { u: "ixp_mumbai", v: "srv_mumbai", latency: 4 },
    { u: "ixp_mumbai", v: "ixp_chennai", latency: 14 },
    { u: "ixp_chennai", v: "ixp_singapore", latency: 28 },
    { u: "gw_asia", v: "ixp_singapore", latency: 8 },
    { u: "ixp_singapore", v: "srv_singapore", latency: 3 },
    { u: "ixp_mumbai", v: "ixp_marseille", latency: 72 },
    { u: "ixp_marseille", v: "gw_eu", latency: 15 },
    { u: "gw_eu", v: "srv_frankfurt", latency: 4 },
    { u: "gw_eu", v: "ixp_london", latency: 12 },
    { u: "ixp_london", v: "ixp_atlantic", latency: 36 },
    { u: "ixp_atlantic", v: "gw_na", latency: 28 },
    { u: "gw_na", v: "srv_virginia", latency: 4 },
    { u: "ixp_singapore", v: "srv_virginia", latency: 145 },
    { u: "srv_delhi", v: "srv_mumbai", latency: 16 },
  ];
}

/**
 * Physical Network Backbone Graph:
 * Models Internet Exchange Points (IXPs), Fiber-Optic Subsea Cables, and Edge Datacenters.
 */
export function buildInternetTopologyGraph(): {
  nodes: Map<string, NetworkNode>;
  adjList: Map<string, Array<{ target: string; latency: number }>>;
} {
  const nodes = new Map<string, NetworkNode>();
  const adjList = new Map<string, Array<{ target: string; latency: number }>>();

  const addNode = (node: NetworkNode) => {
    nodes.set(node.id, node);
    if (!adjList.has(node.id)) adjList.set(node.id, []);
  };

  const addEdge = (u: string, v: string, latency: number) => {
    adjList.get(u)?.push({ target: v, latency });
    adjList.get(v)?.push({ target: u, latency });
  };

  // 1. Regional Player Gateways
  addNode({ id: "gw_india", name: "India Central ISP Gateway", type: "player_gateway", region: "India" });
  addNode({ id: "gw_asia", name: "Southeast Asia Regional Gateway", type: "player_gateway", region: "Asia" });
  addNode({ id: "gw_eu", name: "Europe Central Gateway (Frankfurt)", type: "player_gateway", region: "EU" });
  addNode({ id: "gw_na", name: "US East Fiber Gateway (Ashburn)", type: "player_gateway", region: "NA" });

  // 2. Core Transit Backbone Routers (IXPs & Subsea Cable Landings)
  addNode({ id: "ixp_mumbai", name: "Mumbai IXP Transit Core", type: "transit_router", region: "India" });
  addNode({ id: "ixp_chennai", name: "Chennai Subsea Cable Hub", type: "transit_router", region: "India" });
  addNode({ id: "ixp_singapore", name: "Equinix SG1 Asia Backbone", type: "transit_router", region: "Asia" });
  addNode({ id: "ixp_marseille", name: "Marseille Subsea Cable Interconnect", type: "transit_router", region: "EU" });
  addNode({ id: "ixp_london", name: "LINX London Core Exchange", type: "transit_router", region: "EU" });
  addNode({ id: "ixp_atlantic", name: "Trans-Atlantic Subsea Fiber Ring", type: "transit_router", region: "NA" });

  // 3. Edge Server Hosting Datacenters
  addNode({ id: "srv_delhi", name: "Delhi Central (Edge-01)", type: "edge_server", region: "India" });
  addNode({ id: "srv_mumbai", name: "Mumbai-1 (AWS Central)", type: "edge_server", region: "India" });
  addNode({ id: "srv_singapore", name: "Singapore-1 (Asia-SE)", type: "edge_server", region: "Asia" });
  addNode({ id: "srv_frankfurt", name: "Frankfurt-1 (EU-Central)", type: "edge_server", region: "EU" });
  addNode({ id: "srv_virginia", name: "Virginia-1 (US-East)", type: "edge_server", region: "NA" });

  // 4. Fiber Links (Distances / Latencies in ms)
  // Local In-Country Low-Latency Links:
  addEdge("gw_india", "srv_delhi", 12);
  addEdge("gw_india", "ixp_mumbai", 18);
  addEdge("ixp_mumbai", "srv_mumbai", 4);
  addEdge("ixp_mumbai", "ixp_chennai", 14);

  // Asian Regional Transit Links:
  addEdge("ixp_chennai", "ixp_singapore", 28);
  addEdge("gw_asia", "ixp_singapore", 8);
  addEdge("ixp_singapore", "srv_singapore", 3);

  // India <-> Europe Subsea Interconnect:
  addEdge("ixp_mumbai", "ixp_marseille", 72);
  addEdge("ixp_marseille", "gw_eu", 15);
  addEdge("gw_eu", "srv_frankfurt", 4);
  addEdge("gw_eu", "ixp_london", 12);

  // Europe <-> NA Trans-Atlantic Fiber:
  addEdge("ixp_london", "ixp_atlantic", 36);
  addEdge("ixp_atlantic", "gw_na", 28);
  addEdge("gw_na", "srv_virginia", 4);

  // Cross-Pacific / Extended Links:
  addEdge("ixp_singapore", "srv_virginia", 145);
  addEdge("srv_delhi", "srv_mumbai", 16);

  return { nodes, adjList };
}

/**
 * Classical Dijkstra's Algorithm Implementation:
 * Computes single-source shortest paths on the weighted graph using a Min-Priority Queue.
 * Time Complexity: O(E + V log V) with Min-Heap.
 */
export function runDijkstraShortestPath(
  sourceNodeId: string,
  targetNodeId: string
): DijkstraPathResult {
  const { nodes, adjList } = buildInternetTopologyGraph();

  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const visited = new Set<string>();

  // Min-Priority Queue items: { id, dist }
  const pq: Array<{ id: string; dist: number }> = [];

  nodes.forEach((_, nodeId) => {
    distances.set(nodeId, Infinity);
    previous.set(nodeId, null);
  });

  distances.set(sourceNodeId, 0);
  pq.push({ id: sourceNodeId, dist: 0 });

  while (pq.length > 0) {
    // Extract min distance node
    pq.sort((a, b) => a.dist - b.dist);
    const { id: u, dist: uDist } = pq.shift()!;

    if (visited.has(u)) continue;
    visited.add(u);

    if (u === targetNodeId) break;

    const neighbors = adjList.get(u) || [];
    for (const edge of neighbors) {
      const v = edge.target;
      if (visited.has(v)) continue;

      const alt = uDist + edge.latency;
      if (alt < (distances.get(v) ?? Infinity)) {
        distances.set(v, alt);
        previous.set(v, u);
        pq.push({ id: v, dist: alt });
      }
    }
  }

  // Reconstruct path
  const path: string[] = [];
  let curr: string | null = targetNodeId;
  while (curr !== null) {
    path.unshift(curr);
    curr = previous.get(curr) || null;
  }

  return {
    sourceId: sourceNodeId,
    targetServerId: targetNodeId,
    shortestDistanceMs: distances.get(targetNodeId) ?? 999,
    hops: path,
  };
}

/**
 * Step-by-Step Interactive Dijkstra Execution Tracer for Laboratory Visualizer:
 * Yields discrete relaxation events, priority queue state, and distance maps.
 */
export function runDijkstraWithDetailedTraces(
  sourceNodeId: string,
  targetNodeId: string
): {
  pathResult: DijkstraPathResult;
  traces: DijkstraStepTrace[];
  allNodes: NetworkNode[];
} {
  const { nodes, adjList } = buildInternetTopologyGraph();
  const traces: DijkstraStepTrace[] = [];

  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const visited = new Set<string>();
  const pq: Array<{ id: string; dist: number }> = [];

  nodes.forEach((_, nodeId) => {
    distances.set(nodeId, Infinity);
    previous.set(nodeId, null);
  });

  distances.set(sourceNodeId, 0);
  pq.push({ id: sourceNodeId, dist: 0 });

  const getDistObj = () => {
    const obj: Record<string, number> = {};
    distances.forEach((v, k) => {
      obj[k] = v;
    });
    return obj;
  };

  traces.push({
    step: 0,
    currentNodeId: sourceNodeId,
    currentDistance: 0,
    neighborEvaluated: null,
    edgeWeight: null,
    oldDistance: null,
    newDistance: null,
    relaxed: false,
    priorityQueueSnapshot: [...pq],
    distancesSnapshot: getDistObj(),
    visitedSnapshot: [],
    description: `Initialized source node [${sourceNodeId}] with dist = 0ms. All other vertices set to ∞.`,
  });

  let stepCount = 1;

  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist);
    const { id: u, dist: uDist } = pq.shift()!;

    if (visited.has(u)) continue;
    visited.add(u);

    traces.push({
      step: stepCount++,
      currentNodeId: u,
      currentDistance: uDist,
      neighborEvaluated: null,
      edgeWeight: null,
      oldDistance: null,
      newDistance: null,
      relaxed: false,
      priorityQueueSnapshot: [...pq],
      distancesSnapshot: getDistObj(),
      visitedSnapshot: Array.from(visited),
      description: `Min-Heap extractMin() → Selected vertex [${u}] with shortest settled latency ${uDist}ms.`,
    });

    if (u === targetNodeId) {
      traces.push({
        step: stepCount++,
        currentNodeId: u,
        currentDistance: uDist,
        neighborEvaluated: null,
        edgeWeight: null,
        oldDistance: null,
        newDistance: null,
        relaxed: false,
        priorityQueueSnapshot: [...pq],
        distancesSnapshot: getDistObj(),
        visitedSnapshot: Array.from(visited),
        description: `Target edge datacenter [${targetNodeId}] finalized with optimal routing latency ${uDist}ms!`,
      });
      break;
    }

    const neighbors = adjList.get(u) || [];
    for (const edge of neighbors) {
      const v = edge.target;
      if (visited.has(v)) continue;

      const alt = uDist + edge.latency;
      const oldD = distances.get(v) ?? Infinity;
      const relaxed = alt < oldD;

      if (relaxed) {
        distances.set(v, alt);
        previous.set(v, u);
        pq.push({ id: v, dist: alt });
      }

      traces.push({
        step: stepCount++,
        currentNodeId: u,
        currentDistance: uDist,
        neighborEvaluated: v,
        edgeWeight: edge.latency,
        oldDistance: oldD === Infinity ? 9999 : oldD,
        newDistance: alt,
        relaxed,
        priorityQueueSnapshot: [...pq],
        distancesSnapshot: getDistObj(),
        visitedSnapshot: Array.from(visited),
        description: relaxed
          ? `Relaxation: dist[${u}] (${uDist}ms) + link (${edge.latency}ms) = ${alt}ms < ${oldD === Infinity ? '∞' : oldD + 'ms'}. Updated dist[${v}] and inserted to Min-Heap.`
          : `Checked link (${u} → ${v}): ${alt}ms ≥ current ${oldD}ms. No relaxation needed.`,
      });
    }
  }

  // Reconstruct path
  const path: string[] = [];
  let curr: string | null = targetNodeId;
  while (curr !== null) {
    path.unshift(curr);
    curr = previous.get(curr) || null;
  }

  return {
    pathResult: {
      sourceId: sourceNodeId,
      targetServerId: targetNodeId,
      shortestDistanceMs: distances.get(targetNodeId) ?? 999,
      hops: path,
    },
    traces,
    allNodes: Array.from(nodes.values()),
  };
}

const REGION_TO_GATEWAY: Record<Region, string> = {
  India: "gw_india",
  Asia: "gw_asia",
  EU: "gw_eu",
  NA: "gw_na",
};

const SERVER_ID_TO_NODE: Record<number, string> = {
  1: "srv_delhi",
  2: "srv_mumbai",
  3: "srv_singapore",
  4: "srv_frankfurt",
  5: "srv_virginia",
};

export interface OptimalServerDijkstraResult {
  server: EdgeServer;
  latencyMs: number;
  dijkstraTrace: {
    dominantGateway: string;
    shortestPathHops: string[];
    pathLatencyMs: number;
    playerCountPerRegion: Record<Region, number>;
  };
}

/**
 * Stage 4 Server Allocation via Dijkstra's Shortest Path Algorithm:
 * Evaluates candidate edge servers by computing Dijkstra shortest paths from each player's regional gateway.
 */
export function assignServerUsingDijkstra(
  players: Player[],
  servers: EdgeServer[]
): OptimalServerDijkstraResult {
  const regionCounts: Record<Region, number> = { India: 0, Asia: 0, EU: 0, NA: 0 };
  players.forEach((p) => regionCounts[p.region]++);

  // Find dominant region
  let dominantRegion: Region = "India";
  let maxPlayers = -1;
  (Object.keys(regionCounts) as Region[]).forEach((r) => {
    if (regionCounts[r] > maxPlayers) {
      maxPlayers = regionCounts[r];
      dominantRegion = r;
    }
  });

  const dominantGateway = REGION_TO_GATEWAY[dominantRegion] || "gw_india";
  const availableServers = servers.filter((s) => s.currentLoad < s.capacity);
  const candidatePool = availableServers.length > 0 ? availableServers : servers;

  let bestServer = candidatePool[0];
  let minAggregateLatency = Infinity;
  let bestDijkstraPath: DijkstraPathResult | null = null;

  for (const s of candidatePool) {
    const targetNodeId = SERVER_ID_TO_NODE[s.id] || "srv_delhi";

    // Run Dijkstra's Algorithm from the dominant player gateway to candidate edge server
    const dijkstraResult = runDijkstraShortestPath(dominantGateway, targetNodeId);

    // Cost function incorporates Dijkstra shortest-path latency + current load penalty
    const loadCost = s.currentLoad * 3;
    const aggregateCost = dijkstraResult.shortestDistanceMs + loadCost;

    if (aggregateCost < minAggregateLatency) {
      minAggregateLatency = aggregateCost;
      bestServer = s;
      bestDijkstraPath = dijkstraResult;
    }
  }

  bestServer.currentLoad++;
  const avgPlayerPing = players.reduce((a, b) => a + b.ping, 0) / (players.length || 1);
  const effectiveLatencyMs = Math.round(minAggregateLatency + avgPlayerPing * 0.25);

  return {
    server: bestServer,
    latencyMs: effectiveLatencyMs,
    dijkstraTrace: {
      dominantGateway,
      shortestPathHops: bestDijkstraPath?.hops || [dominantGateway, SERVER_ID_TO_NODE[bestServer.id]],
      pathLatencyMs: bestDijkstraPath?.shortestDistanceMs || 15,
      playerCountPerRegion: regionCounts,
    },
  };
}
