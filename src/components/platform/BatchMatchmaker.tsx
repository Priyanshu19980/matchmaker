import React, { useState } from "react";
import { Player, GameMode, EdgeServer, MatchmakingMatch } from "../../lib/types";
import { runBatchMatchmaking, getDefaultServers } from "../../lib/matchmakingPlatform";
import { LayersIcon, RefreshIcon, AwardIcon, ShieldIcon, ServerIcon } from "../Icons";

interface BatchMatchmakerProps {
  players: Player[];
  mode: GameMode;
  servers: EdgeServer[];
}

export const BatchMatchmaker: React.FC<BatchMatchmakerProps> = ({ players, mode, servers }) => {
  const [batchResult, setBatchResult] = useState<{
    matches: MatchmakingMatch[];
    unmatchedQueue: Player[];
    totalExecutionMs: number;
  } | null>(() => runBatchMatchmaking(players, mode, getDefaultServers()));

  const [selectedMatch, setSelectedMatch] = useState<MatchmakingMatch | null>(
    batchResult?.matches[0] || null
  );

  const handleRunBatch = () => {
    const res = runBatchMatchmaking(players, mode, getDefaultServers());
    setBatchResult(res);
    setSelectedMatch(res.matches[0] || null);
  };

  React.useEffect(() => {
    handleRunBatch();
  }, [players, mode]);

  if (!batchResult) return null;

  const matches = batchResult.matches;
  const avgMqs = matches.length
    ? Math.round(matches.reduce((acc, m) => acc + m.quality.overallScore, 0) / matches.length)
    : 0;

  const avgDelta = matches.length
    ? Math.round((matches.reduce((acc, m) => acc + m.ratingDelta, 0) / matches.length) * 10) / 10
    : 0;

  return (
    <div className="space-y-6">
      {/* Concept Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-semibold">
              <LayersIcon size={13} />
              MULTI-LOBBY BATCH CONCURRENCY
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              Batch Matchmaking Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Processes the entire active queue into concurrent {mode} matches simultaneously. Continuously drains the Priority Queue, performs Graph Compatibility clustering for each match, executes Greedy Balancing, and load-balances across all regional edge servers.
            </p>
          </div>

          <button
            onClick={handleRunBatch}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-cyan-500/25 flex items-center gap-2"
          >
            <RefreshIcon size={14} /> Re-Execute Batch ({players.length} Players)
          </button>
        </div>
      </div>

      {/* Aggregate Batch Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
            Matches Formed
          </span>
          <span className="text-2xl font-black font-mono text-cyan-400">
            {matches.length} Matches
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">
            {matches.length * (mode === "4v4" ? 8 : mode === "5v5" ? 10 : mode === "3v3" ? 6 : 4)} Active Players
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
            Mean Skill Delta
          </span>
          <span className="text-2xl font-black font-mono text-emerald-400">
            Δ {avgDelta} MMR
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">
            Across All Concurrent Lobbies
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
            Mean Match Quality
          </span>
          <span className="text-2xl font-black font-mono text-fuchsia-400">
            {avgMqs}% (Grade S)
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">
            Multi-Pillar Fairness Index
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
            Batch Compute Time
          </span>
          <span className="text-2xl font-black font-mono text-amber-400">
            {batchResult.totalExecutionMs} ms
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">
            Tail Queue: {batchResult.unmatchedQueue.length} Players
          </span>
        </div>
      </div>

      {/* Formed Matches Grid */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
          <ShieldIcon size={16} className="text-cyan-400" />
          Concurrent Match Lobbies ({matches.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((m, idx) => {
            const isSelected = selectedMatch?.id === m.id;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedMatch(m)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? "border-cyan-500 bg-cyan-950/30 shadow-lg shadow-cyan-500/20 scale-[1.01]"
                    : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    LOBBY #{idx + 1} • {m.id}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                    MQS: {m.quality.overallScore}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 mb-3">
                  <div>
                    <span className="text-[9px] text-slate-500 block">Team Alpha</span>
                    <strong className="text-sky-300">{m.teamA.avgRating} MMR</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block">Team Omega</span>
                    <strong className="text-rose-300">{m.teamB.avgRating} MMR</strong>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] font-mono text-slate-400">
                  <span>Server: {m.assignedServer.name.split(" ")[0]}</span>
                  <span className="text-cyan-300">Δ {m.ratingDelta} MMR</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Match Inspector */}
      {selectedMatch && (
        <div className="bg-slate-900/90 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold block">
                Inspecting Match Roster
              </span>
              <h4 className="font-bold text-slate-100 text-base">
                {selectedMatch.id} • {selectedMatch.assignedServer.name}
              </h4>
            </div>
            <span className="font-mono text-xs px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500 font-bold">
              Grade {selectedMatch.quality.grade} ({selectedMatch.quality.overallScore}%)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-sky-500/30 space-y-2">
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-sky-300 font-bold">Team Alpha</span>
                <span className="text-slate-400">{selectedMatch.teamA.avgRating} MMR</span>
              </div>
              <div className="space-y-1.5">
                {selectedMatch.teamA.players.map((p) => (
                  <div key={p.id} className="flex justify-between text-xs font-mono p-1.5 bg-slate-900 rounded-lg">
                    <span className="text-slate-200">{p.name} ({p.role})</span>
                    <span className="text-cyan-400">{p.rating} MMR</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-rose-500/30 space-y-2">
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-rose-300 font-bold">Team Omega</span>
                <span className="text-slate-400">{selectedMatch.teamB.avgRating} MMR</span>
              </div>
              <div className="space-y-1.5">
                {selectedMatch.teamB.players.map((p) => (
                  <div key={p.id} className="flex justify-between text-xs font-mono p-1.5 bg-slate-900 rounded-lg">
                    <span className="text-slate-200">{p.name} ({p.role})</span>
                    <span className="text-rose-400">{p.rating} MMR</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
