import React from "react";
import { BookOpenIcon, AwardIcon, ShieldIcon, ActivityIcon, CheckCircleIcon, DownloadIcon } from "./Icons";

export const AcademicAdaDoc: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Official System Architecture Documentation Header Banner */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-800">
          <img
            src="/logo.jpg"
            alt="MULTI-MATCH"
            className="w-24 h-24 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/30 shrink-0"
          />
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold">
              4-STAGE ALGORITHMIC ENGINE • SPECIFICATIONS
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              MULTI-MATCH SYSTEM ARCHITECTURE
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Fair & Fast Multiplayer Game Matchmaking & Team Balancing Engine
            </p>
            <div className="pt-2">
              <a
                href="/MULTI-MATCH_Project_Brief.pdf"
                download="MULTI-MATCH_Project_Brief.pdf"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-orange-600/30"
              >
                <DownloadIcon size={13} />
                <span>Download Printable Project Brief (PDF)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs font-mono">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] text-cyan-400 font-bold block mb-1">STAGE 1 & 2</span>
            <strong className="text-white text-sm block">Heap & Graph Network</strong>
            <span className="text-slate-400 text-xs">Anti-starvation queue + compatibility clustering</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] text-fuchsia-400 font-bold block mb-1">STAGE 3</span>
            <strong className="text-white text-sm block">Greedy Team Balancer</strong>
            <span className="text-slate-400 text-xs">LPT Heuristic with Graham's 7/6 bound</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] text-emerald-400 font-bold block mb-1">STAGE 4</span>
            <strong className="text-white text-sm block">Dijkstra Edge Routing</strong>
            <span className="text-slate-400 text-xs">Low-latency regional edge node allocation</span>
          </div>
        </div>
      </div>

      {/* Section 1 & 2: Overview & Problem Statement */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-cyan-300 flex items-center gap-2">
          <BookOpenIcon size={20} />
          1 & 2. Project Overview & Problem Statement
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          In multiplayer online games, randomly matching players leads to severe algorithmic pathologies:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="p-3 bg-slate-950 rounded-xl border border-rose-900/40 flex items-start gap-2">
            <span className="text-rose-400 font-bold">✕</span>
            <span><strong>Highly Unbalanced Teams:</strong> Pros paired against novices, causing one-sided blowout matches.</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-rose-900/40 flex items-start gap-2">
            <span className="text-rose-400 font-bold">✕</span>
            <span><strong>High Latency & Poor Connectivity:</strong> Players from disparate regions matched onto distant servers.</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-rose-900/40 flex items-start gap-2">
            <span className="text-rose-400 font-bold">✕</span>
            <span><strong>Queue Starvation:</strong> Long-waiting players trapped without matchmaking priority.</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-rose-900/40 flex items-start gap-2">
            <span className="text-rose-400 font-bold">✕</span>
            <span><strong>Role Imbalance:</strong> Teams comprised entirely of fraggers/rushers with zero supports or tanks.</span>
          </div>
        </div>
      </div>

      {/* Section 5: Algorithms Used Detailed Theoretical Breakdown */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <h3 className="text-lg font-bold text-cyan-300 flex items-center gap-2">
          <ActivityIcon size={20} />
          5. Algorithmic Formulations & Complexity Analysis
        </h3>

        {/* Algorithm A: Greedy Algorithm */}
        <div className="p-4 bg-slate-950 rounded-xl border border-cyan-500/30 space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-cyan-200 text-sm">
              A. Greedy Team Balancing Algorithm (Main Algorithm)
            </h4>
            <span className="font-mono text-xs text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              Time: O(K log K) • Space: O(K)
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Theoretical Problem:</strong> Partitioning 2K players into two equal subsets of K players each such that |TotalSkill(Team A) - TotalSkill(Team B)| is minimized is a formulation of the NP-Complete Balanced Partition / Multiway Number Partitioning Problem.
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Greedy Heuristic (LPT Variant):</strong>
            1. Sort the 2K lobby players in descending order of skill rating (O(K log K)).
            2. For each player in sorted order, greedily place them into the team with the currently lower total/average rating (subject to capacity K).
          </p>
          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-cyan-300">
            {`// Greedy Partition Pseudocode
SORT(lobbyPlayers, descending by rating)
for player in lobbyPlayers:
    if TeamA.size < K and (TeamB.size >= K or TeamA.totalRating <= TeamB.totalRating):
        TeamA.insert(player)
    else:
        TeamB.insert(player)`}
          </div>
          <p className="text-xs text-slate-400">
            <strong>Approximation Guarantee:</strong> Graham’s partition theorem proves this greedy assignment achieves at worst a 7/6 ≈ 1.167 approximation factor, providing sub-millisecond execution while remaining near-optimal.
          </p>
        </div>

        {/* Algorithm B: Priority Queue */}
        <div className="p-4 bg-slate-950 rounded-xl border border-indigo-500/30 space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-indigo-200 text-sm">
              B. Dynamic Priority Queue (Starvation Prevention)
            </h4>
            <span className="font-mono text-xs text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
              Insert: O(log N) • ExtractMax: O(log N) • Heapify: O(N)
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Players in the queue are organized in a <strong>Binary Max-Heap</strong>. To prevent queue starvation where outliers are repeatedly bypassed, waiting time escalates priority dynamically:
          </p>
          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 text-center">
            Priority = (Wait × 2.0) + (Wait &gt; 45s ? (Wait - 45) × 4.0 : 0) + SkillBonus + PingBonus
          </div>
          <p className="text-xs text-slate-300">
            When a player has waited longer than 45 seconds, the exponential boost sifts them upwards in O(log N) steps to the root of the heap, ensuring they are chosen for the very next match lobby.
          </p>
        </div>

        {/* Algorithm C: Graph Algorithm */}
        <div className="p-4 bg-slate-950 rounded-xl border border-fuchsia-500/30 space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-fuchsia-200 text-sm">
              C. Graph Compatibility Algorithm
            </h4>
            <span className="font-mono text-xs text-fuchsia-400 bg-fuchsia-950 px-2 py-0.5 rounded border border-fuchsia-800">
              Construction: O(V²) • Search: O(V + E)
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Players are modeled as vertices V in an undirected weighted graph G = (V, E). An edge e = (u, v) exists if compatibility meets threshold θ:
          </p>
          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-fuchsia-300 text-center">
            W(u, v) = 0.35·RegionMatch + 0.35·SkillScore + 0.20·PingHarmony + 0.10·RoleSynergy
          </div>
          <p className="text-xs text-slate-300">
            Starting from the anchor vertex (extracted from the Priority Queue), the algorithm performs a greedy densest-neighborhood expansion to collect 2K mutually compatible players.
          </p>
        </div>

        {/* Algorithm D: Server Routing (Dijkstra) */}
        <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-emerald-200 text-sm">
              D. Dijkstra Min-Latency Server Assignment
            </h4>
            <span className="font-mono text-xs text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              Time: O((V + E) log V)
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Once a match lobby is formed, Dijkstra’s shortest path algorithm routes the match to the lowest-latency edge server (Delhi-FT-1, Mumbai-1, Singapore-1, Frankfurt-1, Virginia-1) considering geographic region and current server load.
          </p>
        </div>
      </div>

      {/* Section 7 & Time Complexity Master Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-cyan-300 mb-4 flex items-center gap-2">
          <AwardIcon size={20} />
          Asymptotic Time and Space Complexity Summary
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left border border-slate-800">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Subsystem / Operation</th>
                <th className="py-2.5 px-3">Algorithm Used</th>
                <th className="py-2.5 px-3 text-cyan-300">Time Complexity</th>
                <th className="py-2.5 px-3 text-emerald-300">Space Complexity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              <tr>
                <td className="py-2 px-3 font-semibold text-slate-200">Waiting Queue Maintenance</td>
                <td className="py-2 px-3 text-slate-400">Binary Max-Heap</td>
                <td className="py-2 px-3 text-cyan-400">O(log N) insert/extract</td>
                <td className="py-2 px-3 text-emerald-400">O(N)</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-slate-200">Heap Initialization</td>
                <td className="py-2 px-3 text-slate-400">Bottom-up BuildHeap</td>
                <td className="py-2 px-3 text-cyan-400">O(N)</td>
                <td className="py-2 px-3 text-emerald-400">O(N)</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-slate-200">Compatibility Graph Build</td>
                <td className="py-2 px-3 text-slate-400">Adjacency List Construction</td>
                <td className="py-2 px-3 text-cyan-400">O(V²)</td>
                <td className="py-2 px-3 text-emerald-400">O(V + E)</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-slate-200">Lobby Cluster Selection</td>
                <td className="py-2 px-3 text-slate-400">Greedy Subgraph Expansion</td>
                <td className="py-2 px-3 text-cyan-400">O(K · V)</td>
                <td className="py-2 px-3 text-emerald-400">O(K)</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-slate-200">Team Balancing (Main)</td>
                <td className="py-2 px-3 text-slate-400">Greedy LPT Partition</td>
                <td className="py-2 px-3 text-cyan-400">O(K log K)</td>
                <td className="py-2 px-3 text-emerald-400">O(K)</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-slate-200">Dedicated Server Routing</td>
                <td className="py-2 px-3 text-slate-400">Dijkstra Min-Latency</td>
                <td className="py-2 px-3 text-cyan-400">O((V + E) log V)</td>
                <td className="py-2 px-3 text-emerald-400">O(V)</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-slate-200">Match Quality Scoring</td>
                <td className="py-2 px-3 text-slate-400">Composite Multi-Pillar Index</td>
                <td className="py-2 px-3 text-cyan-400">O(K)</td>
                <td className="py-2 px-3 text-emerald-400">O(1)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
