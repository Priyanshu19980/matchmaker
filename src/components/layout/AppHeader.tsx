import React from "react";
import { GameMode, GAME_MODES } from "../../lib/types";
import { ActivityIcon, RefreshIcon, ClockIcon } from "../Icons";

interface AppHeaderProps {
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  queueSize: number;
  onSimulateTick: () => void;
  activeViewTitle: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentMode,
  onModeChange,
  queueSize,
  onSimulateTick,
  activeViewTitle,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-6 py-3 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4">
      {/* View Title */}
      <div className="flex items-center gap-3">
        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
          {activeViewTitle}
        </h2>
        <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
          <ActivityIcon size={11} /> 4-Stage Engine • Fair & Fast
        </span>
      </div>

      {/* Quick Controls */}
      <div className="flex items-center gap-3 text-xs">
        {/* Game Mode Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <span className="text-[10px] text-slate-500 font-mono px-1">Mode:</span>
          {GAME_MODES.map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                currentMode === m
                  ? "bg-cyan-600 text-white shadow-sm shadow-cyan-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Dynamic Starvation Simulation (+10s Wait) */}
        <button
          onClick={onSimulateTick}
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all font-mono"
          title="Simulate Queue Wait Time (+10s) to trigger Priority Queue anti-starvation re-ranking"
        >
          <ClockIcon size={12} className="text-amber-400" />
          <span>+10s Wait</span>
        </button>

        {/* Queue Count */}
        <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-slate-400">Queue:</span>
          <strong className="text-emerald-400">{queueSize}</strong>
        </div>
      </div>
    </header>
  );
};
