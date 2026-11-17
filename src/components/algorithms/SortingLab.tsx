import React, { useState } from "react";
import { Player } from "../../lib/types";
import { runQuickSort, runMergeSort, runHeapSort, SortKey, SortOrder } from "../../lib/sortingAlgorithms";
import { ServerIcon, RefreshIcon, ActivityIcon } from "../Icons";

interface SortingLabProps {
  players: Player[];
}

export const SortingLab: React.FC<SortingLabProps> = ({ players }) => {
  const [sortKey, setSortKey] = useState<SortKey>("rating");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Run all 3 sorting algorithms
  const quick = runQuickSort(players, sortKey, orderSafe(sortOrder));
  const merge = runMergeSort(players, sortKey, orderSafe(sortOrder));
  const heap = runHeapSort(players, sortKey, orderSafe(sortOrder));

  function orderSafe(o: SortOrder): SortOrder {
    return o;
  }

  return (
    <div className="space-y-6">
      {/* Synopsis Concept Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
              ADA Synopsis • Section 5.D
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
              Sorting Algorithms Empirical Laboratory
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Compares classical Divide & Conquer and Heap-based sorting algorithms. Sorting enables pre-conditioning the player queue before greedy partitioning and priority extraction.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold">
              Time: O(N log N)
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-indigo-950 border border-indigo-800 text-indigo-300 font-bold">
              Array: {players.length} Items
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Sort Criterion:</span>
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 inline-flex">
              {(["rating", "wait", "ping", "priorityScore"] as SortKey[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setSortKey(k)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    sortKey === k ? "bg-cyan-600 text-white font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {k === "rating" ? "Skill Rating" : k === "wait" ? "Waiting Time" : k === "ping" ? "Ping (Latency)" : "Priority Score"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Order:</span>
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 inline-flex">
              <button
                onClick={() => setSortOrder("desc")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  sortOrder === "desc" ? "bg-cyan-600 text-white font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Descending (High → Low)
              </button>
              <button
                onClick={() => setSortOrder("asc")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  sortOrder === "asc" ? "bg-cyan-600 text-white font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Ascending (Low → High)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Shootout Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[quick.stats, merge.stats, heap.stats].map((stat) => (
          <div
            key={stat.algorithmName}
            className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 relative overflow-hidden"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <ServerIcon size={16} className="text-cyan-400" />
                {stat.algorithmName}
              </h3>
              <span className="font-mono text-xs text-cyan-300 font-bold">
                {stat.timeMs} ms
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400">Key Comparisons</span>
                <strong className="text-emerald-400">{stat.comparisonsCount} ops</strong>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400">Swaps / Moves</span>
                <strong className="text-amber-400">{stat.swapsCount} ops</strong>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400">Time Complexity</span>
                <strong className="text-cyan-300 text-[11px]">{stat.timeComplexity}</strong>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400">Space Complexity</span>
                <strong className="text-fuchsia-300 text-[11px]">{stat.spaceComplexity}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sorted Data Snapshot */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <h4 className="font-bold text-slate-200 text-xs uppercase font-mono tracking-wider">
          Sorted Output Vector (Top 12 Elements)
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 font-mono text-xs">
          {quick.sorted.slice(0, 12).map((p, idx) => (
            <div key={p.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 block">#{idx + 1}</span>
              <strong className="text-slate-200 text-xs block truncate">{p.name}</strong>
              <span className="text-cyan-400 font-bold block mt-0.5">
                {sortKey === "rating" ? `${p.rating} MMR` : sortKey === "wait" ? `${p.wait}s` : sortKey === "ping" ? `${p.ping}ms` : p.priorityScore}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
