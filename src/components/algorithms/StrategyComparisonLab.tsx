import React, { useState } from "react";
import { Player, GameMode } from "../../lib/types";
import { compareMatchmakingStrategies } from "../../lib/matchmakingPlatform";
import { AwardIcon, RefreshIcon, ActivityIcon, ShieldIcon } from "../Icons";

interface StrategyComparisonLabProps {
  players: Player[];
  mode: GameMode;
}

export const StrategyComparisonLab: React.FC<StrategyComparisonLabProps> = ({ players, mode }) => {
  const [benchmarks, setBenchmarks] = useState(() => compareMatchmakingStrategies(players, mode));
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setBenchmarks(compareMatchmakingStrategies(players, mode));
      setIsRefreshing(false);
    }, 150);
  };

  React.useEffect(() => {
    setBenchmarks(compareMatchmakingStrategies(players, mode));
  }, [players, mode]);

  const proposed = benchmarks[0];
  const random = benchmarks[1];

  const skillGain = random && proposed && random.avgSkillDelta > 0
    ? Math.round(((random.avgSkillDelta - proposed.avgSkillDelta) / random.avgSkillDelta) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Synopsis Concept Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
              Strategy Comparative Benchmarks
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
              Matchmaking Strategy Comparative Benchmark
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Empirical evaluation comparing the Proposed Multi-Stage Algorithmic Architecture against Naive Random Matchmaking and Skill-Only Greedy heuristics.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-5 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-cyan-600/25"
          >
            <RefreshIcon size={14} className={isRefreshing ? "animate-spin" : ""} />
            Re-Evaluate Strategies
          </button>
        </div>

        {/* Highlight Differential Callout */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-cyan-500/30">
            <span className="text-[10px] text-cyan-400 block uppercase">Skill Disparity Reduction</span>
            <span className="text-xl font-bold text-white">
              {skillGain > 0 ? `${skillGain}% More Balanced` : "Optimal Fairness"}
            </span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-emerald-500/30">
            <span className="text-[10px] text-emerald-400 block uppercase">Match Quality Premium</span>
            <span className="text-xl font-bold text-white">
              +{proposed ? proposed.avgMatchQuality - (random?.avgMatchQuality ?? 0) : 0} Points MQS
            </span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-indigo-500/30">
            <span className="text-[10px] text-indigo-400 block uppercase">Evaluation Pool</span>
            <span className="text-xl font-bold text-white">{players.length} Active Players</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {benchmarks.map((b, idx) => {
          const isProposed = idx === 0;
          return (
            <div
              key={b.strategyName}
              className={`rounded-3xl p-6 shadow-xl space-y-4 border ${
                isProposed
                  ? "bg-slate-900/90 border-cyan-500/60 shadow-cyan-500/10"
                  : "bg-slate-900/60 border-slate-800"
              }`}
            >
              <div className="flex justify-between items-start pb-3 border-b border-slate-800">
                <div>
                  <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${
                    isProposed ? "bg-cyan-950 text-cyan-300 border-cyan-700" : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}>
                    {isProposed ? "PROPOSED ARCHITECTURE" : "ALTERNATIVE"}
                  </span>
                  <h3 className="font-bold text-slate-100 text-sm mt-2 leading-snug">
                    {b.strategyName}
                  </h3>
                </div>
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Mean Skill Delta</span>
                  <strong className={isProposed ? "text-cyan-300 text-sm" : "text-rose-400"}>
                    Δ {b.avgSkillDelta} MMR
                  </strong>
                </div>

                <div className="flex justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Mean Ping Delta</span>
                  <strong className={isProposed ? "text-emerald-300 text-sm" : "text-amber-400"}>
                    {b.avgPingDelta} ms
                  </strong>
                </div>

                <div className="flex justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Match Quality Score</span>
                  <strong className={isProposed ? "text-cyan-400 text-base" : "text-slate-300"}>
                    {b.avgMatchQuality}%
                  </strong>
                </div>

                <div className="flex justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Matches Formed</span>
                  <strong className="text-slate-200">{b.matchesFormed} ({b.unmatchedPlayers} Tail)</strong>
                </div>

                <div className="flex justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Execution Time</span>
                  <strong className="text-slate-200">{b.executionTimeMs} ms</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
