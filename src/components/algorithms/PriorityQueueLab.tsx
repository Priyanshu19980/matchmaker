import React, { useState } from "react";
import { Player } from "../../lib/types";
import { PlayerMaxHeap, computePlayerPriority } from "../../lib/priorityQueue";
import { ActivityIcon, ClockIcon, ZapIcon, RefreshIcon } from "../Icons";

interface PriorityQueueLabProps {
  players: Player[];
  onUpdatePlayers: (players: Player[]) => void;
}

export const PriorityQueueLab: React.FC<PriorityQueueLabProps> = ({ players, onUpdatePlayers }) => {
  const [selectedNodeIdx, setSelectedNodeIdx] = useState<number>(0);

  const maxHeap = React.useMemo(() => {
    return new PlayerMaxHeap(players);
  }, [players]);

  const heapArray = maxHeap.toArray();
  const treeNodes = maxHeap.getVisualTreeNodes();

  const handleSimulateAging = (secs: number) => {
    const updated = players.map((p) => ({
      ...p,
      wait: p.wait + secs,
    }));
    onUpdatePlayers(updated);
  };

  const handleAddStarvingPlayer = () => {
    const nextId = 900 + Math.floor(Math.random() * 99);
    const starvingPlayer: Player = {
      id: `P${nextId}`,
      numId: nextId,
      name: `Starving_${nextId}`,
      rating: 1540,
      ping: 24,
      region: "India",
      role: "Rusher",
      gameMode: "4v4",
      wait: 120, // 2 minutes in queue!
      winRate: 54,
      experienceLevel: "Intermediate",
    };
    onUpdatePlayers([starvingPlayer, ...players]);
    setSelectedNodeIdx(0);
  };

  const selectedPlayer = heapArray[selectedNodeIdx];

  return (
    <div className="space-y-6">
      {/* Concept Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
              ADA Synopsis • Section 5.B
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
              Binary Max-Heap Priority Queue & Anti-Starvation Engine
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Maintains waiting players in a sequential Binary Max-Heap buffer. Dynamic aging formula guarantees that players waiting prolonged times escalate rapidly to the root (Index 0).
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold">
              Insert: O(log N)
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-indigo-950 border border-indigo-800 text-indigo-300 font-bold">
              ExtractMax: O(log N)
            </span>
          </div>
        </div>

        {/* Priority Formula Display */}
        <div className="mt-4 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">Mathematical Formulation:</span>
            <span className="text-slate-300">
              P = (Wait × 2.5) + (Wait &gt; 45s ? (Wait - 45)² × 0.15 : 0) + SkillComp + PingComp
            </span>
          </div>
          <span className="text-emerald-400 font-bold">Max-Heap Root = Next To Match</span>
        </div>
      </div>

      {/* Interactive Aging Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleSimulateAging(15)}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-600/20 font-mono"
          >
            <ClockIcon size={14} /> +15s Wait (Dynamic Aging)
          </button>

          <button
            onClick={handleAddStarvingPlayer}
            className="flex items-center gap-2 bg-fuchsia-600/20 hover:bg-fuchsia-600/30 text-fuchsia-300 border border-fuchsia-500/40 px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all"
          >
            <ZapIcon size={14} /> Inject Starving Player (120s Wait)
          </button>

          <button
            onClick={() => handleSimulateAging(-players[0].wait + 10)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl text-xs font-medium font-mono border border-slate-700"
          >
            <RefreshIcon size={14} /> Reset Wait Durations
          </button>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Queue Size: <strong className="text-cyan-300">{heapArray.length}</strong> Players in Max-Heap
        </div>
      </div>

      {/* Binary Heap Tree Visualization */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <ActivityIcon size={16} className="text-cyan-400" />
              Binary Max-Heap Tree Topology
            </h3>
            <p className="text-xs text-slate-400">
              Parent [i] &ge; Left Child [2i + 1] and Right Child [2i + 2]. Root at index 0.
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
            Top 3 Levels (15 Elements)
          </span>
        </div>

        {/* Tree Render */}
        <div className="flex flex-col items-center space-y-6 max-w-3xl mx-auto py-2">
          {/* Level 0 Root */}
          {heapArray[0] && (
            <div className="flex flex-col items-center">
              <button
                onClick={() => setSelectedNodeIdx(0)}
                className={`px-5 py-3 rounded-2xl border-2 transition-all shadow-xl text-center ${
                  selectedNodeIdx === 0
                    ? "border-cyan-400 bg-cyan-950/80 shadow-cyan-500/30 scale-105"
                    : "border-cyan-600/50 bg-slate-950 hover:border-cyan-400"
                }`}
              >
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                  Root Node [Idx 0] • Max Priority
                </span>
                <span className="font-bold text-slate-100 text-sm block">
                  {heapArray[0].name} ({heapArray[0].id})
                </span>
                <span className="font-mono text-xs font-bold text-emerald-400 block">
                  Priority: {heapArray[0].priorityScore}
                </span>
                <span className="text-[10px] font-mono text-amber-300">
                  Wait: {heapArray[0].wait}s {heapArray[0].wait > 45 && "🔥 Starving"}
                </span>
              </button>
            </div>
          )}

          {/* Level 1 (Indices 1 & 2) */}
          <div className="grid grid-cols-2 gap-8 sm:gap-24 w-full">
            {[1, 2].map((idx) => {
              const node = heapArray[idx];
              if (!node) return <div key={idx} />;
              const isSelected = selectedNodeIdx === idx;
              return (
                <div key={idx} className="flex flex-col items-center">
                  <button
                    onClick={() => setSelectedNodeIdx(idx)}
                    className={`w-full max-w-[220px] px-3.5 py-2.5 rounded-xl border transition-all text-center ${
                      isSelected
                        ? "border-sky-400 bg-sky-950/80 shadow-sky-500/30 scale-105"
                        : "border-slate-700 bg-slate-950 hover:border-slate-500"
                    }`}
                  >
                    <span className="text-[10px] font-mono text-slate-400 block">Node [Idx {idx}]</span>
                    <span className="font-bold text-slate-200 text-xs block truncate">
                      {node.name} ({node.id})
                    </span>
                    <span className="font-mono text-xs font-bold text-sky-400 block">
                      Score: {node.priorityScore}
                    </span>
                    <span className="text-[10px] font-mono text-amber-300">
                      Wait: {node.wait}s {node.wait > 45 && "🔥"}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Level 2 (Indices 3, 4, 5, 6) */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full">
            {[3, 4, 5, 6].map((idx) => {
              const node = heapArray[idx];
              if (!node) return <div key={idx} />;
              const isSelected = selectedNodeIdx === idx;
              return (
                <div key={idx} className="flex flex-col items-center">
                  <button
                    onClick={() => setSelectedNodeIdx(idx)}
                    className={`w-full px-2 py-2 rounded-xl border text-center transition-all ${
                      isSelected
                        ? "border-fuchsia-400 bg-fuchsia-950/80 scale-105"
                        : "border-slate-800 bg-slate-950 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-[9px] font-mono text-slate-500 block">[{idx}]</span>
                    <span className="font-semibold text-slate-300 text-[11px] block truncate">{node.id}</span>
                    <span className="font-mono text-[10px] text-fuchsia-300 font-bold block">
                      {node.priorityScore}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Element Detail */}
        {selectedPlayer && (
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div>
              <span className="text-[10px] uppercase text-slate-500 block">Inspected Node [Idx {selectedNodeIdx}]</span>
              <strong className="text-slate-100 text-sm">{selectedPlayer.name} ({selectedPlayer.id})</strong>
              <span className="text-cyan-400 block text-xs">{selectedPlayer.role} • {selectedPlayer.region}</span>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <span className="text-[10px] text-slate-500 block">Priority</span>
                <span className="text-emerald-400 font-bold text-base">{selectedPlayer.priorityScore}</span>
              </div>
              <div className="border-l border-slate-800 pl-3">
                <span className="text-[10px] text-slate-500 block">Wait Time</span>
                <span className="text-amber-300 font-bold text-base">{selectedPlayer.wait}s</span>
              </div>
              <div className="border-l border-slate-800 pl-3">
                <span className="text-[10px] text-slate-500 block">Rating</span>
                <span className="text-cyan-300 font-bold text-base">{selectedPlayer.rating} MMR</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sequential Memory Array View */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-2 font-mono">
          Contiguous Heap Array Buffer (Zero-Indexed Sequential Layout)
        </h4>
        <div className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar">
          {heapArray.map((p, i) => (
            <div
              key={p.id}
              onClick={() => setSelectedNodeIdx(i)}
              className={`shrink-0 w-16 p-2 rounded-lg border text-center cursor-pointer transition-all ${
                selectedNodeIdx === i
                  ? "border-cyan-400 bg-cyan-950/60"
                  : "border-slate-800 bg-slate-950 hover:border-slate-700"
              }`}
            >
              <span className="text-[9px] font-mono text-slate-500 block">[{i}]</span>
              <span className="font-mono font-bold text-xs text-slate-200 block truncate">{p.id}</span>
              <span className="font-mono text-[10px] text-cyan-400 font-semibold">{p.priorityScore}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
