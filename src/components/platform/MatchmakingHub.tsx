import React from "react";
import { MatchmakingMatch, GameMode, EdgeServer } from "../../lib/types";
import { PlayerCard } from "../PlayerCard";
import { MatchQualityBadge } from "../MatchQualityBadge";
import { GamepadIcon, RefreshIcon, ServerIcon, DownloadIcon, ActivityIcon, ShieldIcon } from "../Icons";

interface MatchmakingHubProps {
  currentMatch: MatchmakingMatch | null;
  matchHistory: MatchmakingMatch[];
  onGenerateNextMatch: () => void;
  onClearHistory: () => void;
  mode: GameMode;
  servers: EdgeServer[];
  queueCount: number;
}

export const MatchmakingHub: React.FC<MatchmakingHubProps> = ({
  currentMatch,
  matchHistory,
  onGenerateNextMatch,
  onClearHistory,
  mode,
  servers,
  queueCount,
}) => {
  const exportMatchJson = () => {
    if (!currentMatch) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentMatch, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `match_${currentMatch.id}.json`);
    dlAnchor.click();
  };

  return (
    <div className="space-y-6">
      {/* Platform Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              MATCHMAKING ENGINE READY • FACULTY OF TECHNOLOGY, DU
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              Automated Team Balancing Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Executes the 4-stage algorithmic pipeline: 
              <strong className="text-cyan-300"> 1. Priority Queue</strong> extract-max 
              <strong className="text-indigo-300"> → 2. Graph Compatibility</strong> clustering 
              <strong className="text-fuchsia-300"> → 3. Greedy Partition</strong> team balancing 
              <strong className="text-emerald-300"> → 4. Dijkstra</strong> low-latency server routing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <button
              onClick={onGenerateNextMatch}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <RefreshIcon size={16} />
              FORM NEXT {mode} MATCH
            </button>

            {currentMatch && (
              <button
                onClick={exportMatchJson}
                className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5"
                title="Download Match JSON"
              >
                <DownloadIcon size={14} /> JSON
              </button>
            )}
          </div>
        </div>
      </div>

      {currentMatch ? (
        <>
          {/* Match Quality Banner */}
          <MatchQualityBadge quality={currentMatch.quality} method="algorithm" />

          {/* Arena: Team Alpha vs Team Omega */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
            {/* Center VS Indicator */}
            <div className="hidden lg:flex absolute left-1/2 top-24 -translate-x-1/2 -translate-y-1/2 z-10 flex-col items-center pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-slate-950 border-2 border-indigo-500/60 shadow-xl shadow-indigo-500/20 flex items-center justify-center font-black text-xs text-indigo-300 tracking-wider">
                VS
              </div>
              <div className="mt-2 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border backdrop-blur-md bg-emerald-950/80 text-emerald-300 border-emerald-500/40">
                Δ {currentMatch.ratingDelta} MMR
              </div>
            </div>

            {/* TEAM ALPHA (BLUE) */}
            <div className="bg-slate-900/70 border border-sky-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-cyan-400" />
              <div className="flex justify-between items-center pb-3 mb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-sky-400" />
                    <h3 className="font-bold text-sky-200 text-base">{currentMatch.teamA.name}</h3>
                  </div>
                  <span className="text-xs text-slate-400">Total: {currentMatch.teamA.totalRating} MMR</span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400 block uppercase">Avg Skill</span>
                  <span className="text-lg font-bold text-sky-300">{currentMatch.teamA.avgRating} MMR</span>
                  <span className="text-xs text-emerald-400 block">{currentMatch.teamA.avgPing}ms latency</span>
                </div>
              </div>

              {/* Roles */}
              <div className="flex items-center gap-1.5 mb-3 text-xs">
                <span className="text-[10px] text-slate-500 font-mono">Composition:</span>
                {Object.entries(currentMatch.teamA.roleDistribution).map(([r, count]) =>
                  count > 0 ? (
                    <span key={r} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
                      {r}: <strong className="text-cyan-400">{count}</strong>
                    </span>
                  ) : null
                )}
              </div>

              <div className="space-y-2.5">
                {currentMatch.teamA.players.map((p) => (
                  <PlayerCard key={p.id} player={p} teamSide="alpha" />
                ))}
              </div>
            </div>

            {/* TEAM OMEGA (RED) */}
            <div className="bg-slate-900/70 border border-rose-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-red-400" />
              <div className="flex justify-between items-center pb-3 mb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-400" />
                    <h3 className="font-bold text-rose-200 text-base">{currentMatch.teamB.name}</h3>
                  </div>
                  <span className="text-xs text-slate-400">Total: {currentMatch.teamB.totalRating} MMR</span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400 block uppercase">Avg Skill</span>
                  <span className="text-lg font-bold text-rose-300">{currentMatch.teamB.avgRating} MMR</span>
                  <span className="text-xs text-emerald-400 block">{currentMatch.teamB.avgPing}ms latency</span>
                </div>
              </div>

              {/* Roles */}
              <div className="flex items-center gap-1.5 mb-3 text-xs">
                <span className="text-[10px] text-slate-500 font-mono">Composition:</span>
                {Object.entries(currentMatch.teamB.roleDistribution).map(([r, count]) =>
                  count > 0 ? (
                    <span key={r} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
                      {r}: <strong className="text-rose-400">{count}</strong>
                    </span>
                  ) : null
                )}
              </div>

              <div className="space-y-2.5">
                {currentMatch.teamB.players.map((p) => (
                  <PlayerCard key={p.id} player={p} teamSide="omega" />
                ))}
              </div>
            </div>
          </div>

          {/* Edge Server Allocation Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <ServerIcon className="text-indigo-400" size={18} />
                <h4 className="font-bold text-slate-100 text-sm">
                  Allocated Server: <span className="text-cyan-300">{currentMatch.assignedServer.name}</span>
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  Dijkstra Route: {currentMatch.effectiveLatencyMs}ms
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Region: {currentMatch.assignedServer.region}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {servers.map((s) => {
                const isSelected = currentMatch.assignedServer.id === s.id;
                return (
                  <div
                    key={s.id}
                    className={`p-2.5 rounded-xl border text-xs font-mono ${
                      isSelected
                        ? "border-cyan-500/60 bg-cyan-950/40 text-cyan-200"
                        : "border-slate-800 bg-slate-950 text-slate-400"
                    }`}
                  >
                    <div className="font-bold truncate">{s.name.split(" ")[0]}</div>
                    <div className="text-[10px] flex justify-between mt-1 text-slate-500">
                      <span>Base: {s.baseLatencyMs}ms</span>
                      <span>Load: {s.currentLoad}/{s.capacity}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800">
          <p className="text-slate-400 mb-4">No active match formed yet.</p>
          <button
            onClick={onGenerateNextMatch}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30"
          >
            Form Match from Queue
          </button>
        </div>
      )}

      {/* Match History Log */}
      {matchHistory.length > 0 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <ActivityIcon size={16} className="text-cyan-400" />
              Session Matches Log ({matchHistory.length} Matches Formed)
            </h4>
            <button
              onClick={onClearHistory}
              className="text-xs font-mono text-slate-400 hover:text-rose-400"
            >
              Clear Log
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {matchHistory.map((m) => (
              <div
                key={m.id}
                className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono"
              >
                <div>
                  <span className="font-bold text-cyan-400">{m.id}</span>
                  <span className="text-slate-500"> • </span>
                  <span className="text-slate-200 font-sans">{m.gameMode}</span>
                  <span className="text-slate-500"> • </span>
                  <span className="text-slate-400">Δ {m.ratingDelta} MMR</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 font-bold">
                    MQS: {m.quality.overallScore}% ({m.quality.grade})
                  </span>
                  <span className="text-indigo-300">{m.assignedServer.name.split(" ")[0]}</span>
                  <span className="text-slate-500">{m.executionTimeMs}ms</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
