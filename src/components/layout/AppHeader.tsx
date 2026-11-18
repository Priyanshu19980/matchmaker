import React, { useState } from "react";
import { GameMode, GAME_MODES } from "../../lib/types";
import { ActivityIcon, ClockIcon, HomeIcon, ServerIcon } from "../Icons";
import { ReachLogo } from "../common/ReachLogo";

interface AppHeaderProps {
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  queueSize: number;
  onSimulateTick: () => void;
  activeViewTitle: string;
  onOpenLanding?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentMode,
  onModeChange,
  queueSize,
  onSimulateTick,
  activeViewTitle,
  onOpenLanding,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <header className="border-b border-[#1b2230] bg-[#0c0f15]/95 backdrop-blur-md px-6 py-3 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
      {/* View Title & Landing Portal Button */}
      <div className="flex items-center gap-3">
        {onOpenLanding && (
          <button
            onClick={onOpenLanding}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121620] hover:bg-[#181f2c] border border-[#1f2737] text-white hover:text-[#00f0d2] font-bold transition-all shadow-sm"
            title="Return to Public Portal & Leaderboard"
          >
            <ReachLogo size={16} />
            <span>PORTAL HOME</span>
          </button>
        )}

        <h2 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-2">
          {activeViewTitle}
        </h2>

        <span className="hidden lg:inline-flex items-center gap-1 text-[10px] uppercase px-2 py-0.5 rounded-full bg-[#00f0d2]/10 text-[#00f0d2] border border-[#00f0d2]/30 font-bold">
          <ActivityIcon size={11} /> 4-Stage Algorithmic Pipeline
        </span>
      </div>

      {/* Quick Controls */}
      <div className="flex items-center gap-3">
        {/* Game Mode Selector */}
        <div className="flex items-center gap-1 bg-[#121620] border border-[#1f2737] p-1 rounded-xl">
          <span className="text-[10px] text-slate-500 px-1.5 font-bold uppercase">Mode:</span>
          {GAME_MODES.map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                currentMode === m
                  ? "bg-[#00f0d2] text-[#0c0f15] font-black shadow-[0_0_12px_rgba(0,240,210,0.3)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Dynamic Starvation Simulation (+10s Wait) */}
        <button
          onClick={onSimulateTick}
          className="flex items-center gap-1.5 bg-[#121620] hover:bg-[#181f2c] text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-[#1f2737] transition-all"
          title="Simulate Queue Wait Time (+10s) to trigger Priority Queue anti-starvation re-ranking"
        >
          <ClockIcon size={12} className="text-[#ff2a6d]" />
          <span>+10s Wait</span>
        </button>

        {/* Live Queue Indicator */}
        <div className="bg-[#121620] border border-[#1f2737] px-3 py-1.5 rounded-xl flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f0d2] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f0d2]" />
          </span>
          <span className="text-slate-400">Queue:</span>
          <strong className="text-[#00f0d2] font-black">{queueSize}</strong>
        </div>

        {/* Profile Pill Widget (From Reach) */}
        <div
          className="relative hidden sm:flex items-center gap-2.5 pl-2 border-l border-[#1f2737] cursor-pointer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff2a6d] to-[#00f0d2] p-0.5">
              <div className="w-full h-full rounded-full bg-[#161c27] flex items-center justify-center text-xs font-bold">
                👨‍💻
              </div>
            </div>
            <span className="absolute -bottom-1 -left-1 w-3.5 h-3.5 rounded-full bg-[#ff2a6d] text-white text-[8px] font-black flex items-center justify-center">
              71
            </span>
          </div>
          <span className="text-xs font-bold text-white hidden md:inline">MottoDim</span>

          {showTooltip && (
            <div className="absolute top-10 right-0 w-48 p-2.5 rounded-xl bg-[#121620] border border-[#1f2737] shadow-2xl z-50 text-[10px] space-y-1">
              <div className="text-white font-bold flex justify-between">
                <span>Behavior Score:</span>
                <span className="text-[#00f0d2]">98 / 100</span>
              </div>
              <p className="text-slate-400 text-[9px] font-sans">
                Active in NA Region Sprint 2.
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
