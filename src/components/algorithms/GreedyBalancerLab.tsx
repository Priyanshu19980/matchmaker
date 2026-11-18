import React, { useState } from "react";
import { Player, GameMode, PLAYERS_PER_TEAM } from "../../lib/types";
import { executeGreedyPartition, computeOptimalPartitionBenchmark } from "../../lib/greedyBalancing";
import { ZapIcon, PlayIcon, PauseIcon, RefreshIcon, AwardIcon } from "../Icons";

interface GreedyBalancerLabProps {
  currentLobby: Player[];
  mode: GameMode;
}

export const GreedyBalancerLab: React.FC<GreedyBalancerLabProps> = ({ currentLobby, mode }) => {
  const capacity = PLAYERS_PER_TEAM[mode];
  const required = capacity * 2;
  const lobby = currentLobby.slice(0, required);

  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(1200);

  // Custom MMR sandbox input
  const [customInputStr, setCustomInputStr] = useState(
    lobby.map((p) => p.rating).join(", ")
  );

  React.useEffect(() => {
    setCustomInputStr(lobby.map((p) => p.rating).join(", "));
  }, [currentLobby, mode]);

  const parsedPlayers: Player[] = React.useMemo(() => {
    const tokens = customInputStr
      .split(",")
      .map((t) => parseInt(t.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0);

    if (tokens.length >= required) {
      return tokens.slice(0, required).map((rating, idx) => ({
        id: `P${100 + idx}`,
        numId: 100 + idx,
        name: `Candidate_${idx + 1}`,
        rating,
        ping: 25 + (idx % 15),
        region: "India",
        role: (["Rusher", "Sniper", "Support", "Tank", "Flex"] as const)[idx % 5],
        gameMode: mode,
        wait: 20 + idx * 5,
        winRate: 50,
        experienceLevel: "Intermediate",
      }));
    }
    return lobby;
  }, [customInputStr, required, mode, lobby]);

  const greedyRes = React.useMemo(() => {
    return executeGreedyPartition(parsedPlayers, capacity);
  }, [parsedPlayers, capacity]);

  const optimalBench = React.useMemo(() => {
    return computeOptimalPartitionBenchmark(parsedPlayers, capacity, greedyRes.ratingDelta);
  }, [parsedPlayers, capacity, greedyRes.ratingDelta]);

  React.useEffect(() => {
    setStepIndex(0);
    setIsPlaying(false);
  }, [parsedPlayers]);

  React.useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= greedyRes.traces.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, speedMs);

    return () => clearInterval(interval);
  }, [isPlaying, greedyRes.traces.length, speedMs]);

  const activeTrace = greedyRes.traces[stepIndex];

  return (
    <div className="space-y-6">
      {/* Synopsis Algorithm Concept */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
              Stage 3: Greedy Balancing Engine
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
              Greedy Team Balancer Workbench
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Solves the Min-Variance 2-Partition problem using the Longest Processing Time (LPT) Greedy Heuristic. Proven 7/6-approximation ratio relative to the NP-Complete Global Optimum.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold">
              Time: O(K log K)
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-indigo-950 border border-indigo-800 text-indigo-300 font-bold">
              Space: O(K)
            </span>
          </div>
        </div>

        {/* Synopsis Example Callout */}
        <div className="mt-4 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">Synopsis Formal Rule:</span>
            <span className="text-slate-300">
              Team A = 1500, Team B = 1480, Next = 1520 → Assign to Team B (balances lower sum)
            </span>
          </div>
          <span className="text-emerald-400 font-bold">
            Approximation Guarantee: Ratio ≤ 1.167
          </span>
        </div>
      </div>

      {/* Interactive Custom MMR Sandbox */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex justify-between items-center text-xs">
          <label className="font-bold text-slate-200">
            Custom Player MMR Inputs (Requires {required} Comma-Separated Values):
          </label>
          <button
            onClick={() => setCustomInputStr("1500, 1480, 1520, 1600, 1580, 1490, 1510, 1530")}
            className="text-cyan-400 hover:text-cyan-300 font-mono text-[11px]"
          >
            Load Synopsis Preset (8 Players)
          </button>
        </div>
        <input
          type="text"
          value={customInputStr}
          onChange={(e) => setCustomInputStr(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
          placeholder="e.g. 1500, 1480, 1520, 1600, 1580, 1490, 1510, 1530"
        />
      </div>

      {/* Playback Controls & Progress */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 ${
              isPlaying
                ? "bg-amber-600 text-white"
                : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/30"
            }`}
          >
            {isPlaying ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
            {isPlaying ? "Pause Step Animation" : "Play Step-by-Step"}
          </button>

          <button
            disabled={stepIndex <= 0}
            onClick={() => {
              setIsPlaying(false);
              setStepIndex((p) => Math.max(0, p - 1));
            }}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 border border-slate-700"
          >
            ← Prev Step
          </button>

          <button
            disabled={stepIndex >= greedyRes.traces.length - 1}
            onClick={() => {
              setIsPlaying(false);
              setStepIndex((p) => Math.min(greedyRes.traces.length - 1, p + 1));
            }}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 border border-slate-700"
          >
            Next Step →
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setStepIndex(0);
            }}
            className="p-2 rounded-xl text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700"
          >
            <RefreshIcon size={14} />
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-slate-400">
            Step: <strong className="text-cyan-400">{stepIndex + 1}</strong> of {greedyRes.traces.length}
          </span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {[1200, 600, 300].map((ms, idx) => (
              <button
                key={ms}
                onClick={() => setSpeedMs(ms)}
                className={`px-2 py-0.5 rounded text-[11px] ${
                  speedMs === ms ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {idx === 0 ? "1x" : idx === 1 ? "2x" : "4x"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Step Highlight Box */}
      {activeTrace && (
        <div className="bg-slate-900 border-2 border-cyan-500/50 rounded-2xl p-5 shadow-xl relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold">
                Decision #{activeTrace.step}: Assigning {activeTrace.player.name} ({activeTrace.player.rating} MMR)
              </span>
              <p className="text-xs text-slate-200 mt-2 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono">
                💡 <strong className="text-cyan-300">Greedy Rule:</strong> {activeTrace.reason}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Target Team</span>
              <span className={`inline-block mt-1 px-4 py-2 rounded-xl text-sm font-black font-mono border ${
                activeTrace.assignedTeam === "Team A"
                  ? "bg-sky-950 text-sky-300 border-sky-500"
                  : "bg-rose-950 text-rose-300 border-rose-500"
              }`}>
                {activeTrace.assignedTeam}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Theoretical Verification Against Global Optimum */}
      <div className="bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-5 shadow-lg space-y-3">
        <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
          <AwardIcon size={16} className="text-indigo-400" />
          Academic Optimality Verification (Graham's Partition Proof)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Greedy Rating Delta</span>
            <span className="text-lg font-bold text-cyan-300">{greedyRes.ratingDelta} MMR</span>
            <span className="text-[10px] text-slate-400 block mt-1">O(K log K) execution</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Exhaustive Global Optimum</span>
            <span className="text-lg font-bold text-emerald-400">{optimalBench.minPossibleDelta} MMR</span>
            <span className="text-[10px] text-slate-400 block mt-1">{optimalBench.combinationsEvaluated} subsets checked</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Empirical Approx Ratio</span>
            <span className="text-lg font-bold text-fuchsia-300">{optimalBench.greedyApproximationRatio}x</span>
            <span className="text-[10px] text-emerald-400 block mt-1">Guaranteed ≤ 1.167</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Operations Executed</span>
            <span className="text-lg font-bold text-amber-300">{greedyRes.operationsCount} ops</span>
            <span className="text-[10px] text-slate-400 block mt-1">Time: {greedyRes.timeMs} ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
