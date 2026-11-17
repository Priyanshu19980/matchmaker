import React, { useState, useMemo } from "react";
import { Player, Region, PlayerRole } from "../../lib/types";
import { buildCompatibilityNetwork, calculateCompatibility } from "../../lib/graphEngine";
import { ShieldIcon, ActivityIcon, WifiIcon, ZapIcon } from "../Icons";

interface GraphCompatibilityLabProps {
  players: Player[];
}

const REGION_COLORS: Record<Region, string> = {
  India: "#38bdf8", // Sky blue
  Asia: "#34d399", // Emerald
  EU: "#a78bfa", // Purple
  NA: "#f472b6", // Pink
};

const ROLE_COLORS: Record<PlayerRole, string> = {
  Rusher: "#f87171",
  Sniper: "#fbbf24",
  Support: "#34d399",
  Tank: "#38bdf8",
  Flex: "#c084fc",
};

export const GraphCompatibilityLab: React.FC<GraphCompatibilityLabProps> = ({ players }) => {
  const [threshold, setThreshold] = useState(55);
  const [colorMode, setColorMode] = useState<"region" | "role">("region");
  const [selectedVertexId, setSelectedVertexId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"network" | "matrix">("network");

  const vizPlayers = useMemo(() => players.slice(0, 24), [players]);
  const network = useMemo(() => buildCompatibilityNetwork(vizPlayers, threshold), [vizPlayers, threshold]);

  // Spatial positions grouped by 4 regions
  const positions = useMemo(() => {
    const coords = new Map<string, { x: number; y: number }>();
    const regions: Region[] = ["India", "Asia", "EU", "NA"];
    const centers: Record<Region, { x: number; y: number }> = {
      India: { x: 220, y: 150 },
      Asia: { x: 620, y: 150 },
      EU: { x: 220, y: 380 },
      NA: { x: 620, y: 380 },
    };

    regions.forEach((r) => {
      const rPlayers = vizPlayers.filter((p) => p.region === r);
      rPlayers.forEach((p, idx) => {
        const angle = (2 * Math.PI * idx) / (rPlayers.length || 1);
        const radius = Math.min(95, 30 + rPlayers.length * 6);
        coords.set(p.id, {
          x: centers[r].x + Math.cos(angle) * radius,
          y: centers[r].y + Math.sin(angle) * radius,
        });
      });
    });

    return coords;
  }, [vizPlayers]);

  const selectedVertex = vizPlayers.find((p) => p.id === selectedVertexId);

  return (
    <div className="space-y-6">
      {/* Synopsis Concept Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
              ADA Synopsis • Section 5.C
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
              Player Compatibility Graph Engine
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Models players as graph vertices V. Weighted edges E(u, v) quantify compatibility based on Skill Difference, Latency (Ping) spread, Regional affinity, and Role synergy.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold">
              Build: O(V²)
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-indigo-950 border border-indigo-800 text-indigo-300 font-bold">
              Clustering: O(V + E)
            </span>
          </div>
        </div>

        {/* Mathematical Formulation Display */}
        <div className="mt-4 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">Compatibility Equation:</span>
            <span className="text-slate-300">
              W(u, v) = 0.35·RegionScore + 0.35·SkillScore + 0.20·PingScore + 0.10·RoleSynergy
            </span>
          </div>
          <span className="text-emerald-400 font-bold">
            Components Count: {network.connectedComponentsCount} (via BFS)
          </span>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Threshold Slider */}
        <div className="flex items-center gap-3 text-xs">
          <label className="font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
            Edge Threshold: <strong className="text-cyan-400 text-sm">{threshold}%</strong>
          </label>
          <input
            type="range"
            min={40}
            max={85}
            value={threshold}
            onChange={(e) => setThreshold(+e.target.value)}
            className="w-32 accent-cyan-400 cursor-pointer"
          />
        </div>

        {/* View Switcher (Network Canvas vs Adjacency Matrix) */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 inline-flex text-xs font-mono">
            <button
              onClick={() => setActiveTab("network")}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === "network" ? "bg-cyan-600 text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              Network Topology Canvas
            </button>
            <button
              onClick={() => setActiveTab("matrix")}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === "matrix" ? "bg-cyan-600 text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              Adjacency Matrix (V x V)
            </button>
          </div>
        </div>

        {/* Network Metrics Summary */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <span>Vertices: <strong className="text-cyan-300">{network.vertices.length}</strong></span>
          <span>Edges: <strong className="text-emerald-300">{network.edges.length}</strong></span>
          <span>Density: <strong className="text-fuchsia-300">{network.density}</strong></span>
        </div>
      </div>

      {activeTab === "network" ? (
        /* Network Canvas View */
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 shadow-2xl relative overflow-hidden">
          <div className="absolute top-4 left-6 flex items-center gap-4 text-xs font-mono text-slate-400 z-10">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> India Hub</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Asia Hub</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> EU Hub</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-pink-400" /> NA Hub</span>
          </div>

          <svg viewBox="0 0 840 500" className="w-full h-auto min-h-[460px]">
            {/* Regional Axes */}
            <line x1="420" y1="20" x2="420" y2="480" stroke="#1e293b" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="20" y1="250" x2="820" y2="250" stroke="#1e293b" strokeDasharray="4 4" strokeWidth="1" />

            {/* Regional Titles */}
            <text x="220" y="45" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="monospace">🇮🇳 INDIA REGION</text>
            <text x="620" y="45" textAnchor="middle" fill="#34d399" fontSize="12" fontWeight="bold" fontFamily="monospace">🌏 ASIA-SE REGION</text>
            <text x="220" y="275" textAnchor="middle" fill="#a78bfa" fontSize="12" fontWeight="bold" fontFamily="monospace">🇪🇺 EUROPE REGION</text>
            <text x="620" y="275" textAnchor="middle" fill="#f472b6" fontSize="12" fontWeight="bold" fontFamily="monospace">🌎 NORTH AMERICA</text>

            {/* Edges */}
            {network.edges.map((edge, i) => {
              const p1 = positions.get(edge.u);
              const p2 = positions.get(edge.v);
              if (!p1 || !p2) return null;

              const isHighlighted = selectedVertexId === edge.u || selectedVertexId === edge.v;

              return (
                <line
                  key={i}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={isHighlighted ? "#06b6d4" : edge.weight >= 75 ? "#38bdf8" : "#334155"}
                  strokeWidth={isHighlighted ? 2.2 : 1.0}
                  strokeOpacity={isHighlighted ? 0.95 : 0.35}
                />
              );
            })}

            {/* Vertices */}
            {vizPlayers.map((player) => {
              const pos = positions.get(player.id);
              if (!pos) return null;

              const isSelected = selectedVertexId === player.id;
              const nodeColor = colorMode === "region" ? REGION_COLORS[player.region] : ROLE_COLORS[player.role];

              return (
                <g
                  key={player.id}
                  onClick={() => setSelectedVertexId(isSelected ? null : player.id)}
                  className="cursor-pointer"
                >
                  {isSelected && (
                    <circle cx={pos.x} cy={pos.y} r={20} fill="none" stroke="#22d3ee" strokeWidth="2.5" />
                  )}

                  <circle cx={pos.x} cy={pos.y} r={12} fill={nodeColor} stroke="#0f172a" strokeWidth="2" />

                  <text x={pos.x} y={pos.y + 4} textAnchor="middle" fill="#0f172a" fontSize="8" fontWeight="bold" fontFamily="monospace">
                    {player.id}
                  </text>

                  <text x={pos.x} y={pos.y + 22} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                    {player.rating}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Inspected Vertex Panel */}
          {selectedVertex && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-900 border border-cyan-500/50 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              <div>
                <span className="text-[10px] text-cyan-400 block uppercase">Selected Vertex</span>
                <strong className="text-slate-100 text-sm">{selectedVertex.name} ({selectedVertex.id})</strong>
                <span className="text-slate-400 block">{selectedVertex.role} • {selectedVertex.region}</span>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[10px] text-slate-500 block">Rating</span>
                  <span className="text-cyan-300 font-bold">{selectedVertex.rating} MMR</span>
                </div>
                <div className="border-l border-slate-800 pl-3">
                  <span className="text-[10px] text-slate-500 block">Ping</span>
                  <span className="text-emerald-400 font-bold">{selectedVertex.ping} ms</span>
                </div>
                <div className="border-l border-slate-800 pl-3">
                  <span className="text-[10px] text-slate-500 block">Degree Centrality</span>
                  <span className="text-amber-400 font-bold">
                    {network.adjacencyList.get(selectedVertex.id)?.length ?? 0} Neighbors
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Adjacency Matrix View */
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl overflow-x-auto">
          <div className="mb-3 text-xs font-mono text-slate-400">
            Adjacency Matrix M[i][j]: Pairwise Compatibility Scores (0 to 100). Higher = More Compatible.
          </div>
          <table className="text-[10px] font-mono border-collapse">
            <thead>
              <tr>
                <th className="p-1 bg-slate-950 text-slate-500">Node</th>
                {vizPlayers.map((p) => (
                  <th key={p.id} className="p-1 text-slate-400 bg-slate-950 text-center w-8">
                    {p.id}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vizPlayers.map((p1, i) => (
                <tr key={p1.id}>
                  <td className="p-1 font-bold text-cyan-400 bg-slate-950">{p1.id}</td>
                  {vizPlayers.map((p2, j) => {
                    const weight = network.adjacencyMatrix[i][j];
                    const isSelf = i === j;
                    const isHigh = weight >= 75;
                    const isMedium = weight >= 55;

                    return (
                      <td
                        key={p2.id}
                        className={`p-1 text-center border border-slate-800/40 ${
                          isSelf
                            ? "bg-slate-950 text-slate-600"
                            : isHigh
                            ? "bg-cyan-950/70 text-cyan-300 font-bold"
                            : isMedium
                            ? "bg-slate-900 text-slate-300"
                            : "bg-slate-950/40 text-slate-600"
                        }`}
                        title={`${p1.id} <-> ${p2.id}: Compatibility ${weight}%`}
                      >
                        {isSelf ? "—" : weight}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
