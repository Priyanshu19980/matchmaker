import React from "react";
import { MatchQualityBreakdown } from "../lib/types";
import { AwardIcon, ActivityIcon, ShieldIcon, WifiIcon, ClockIcon } from "./Icons";

interface MatchQualityBadgeProps {
  quality: MatchQualityBreakdown;
  method?: string;
}

export const MatchQualityBadge: React.FC<MatchQualityBadgeProps> = ({ quality }) => {
  let gradeColor = "from-emerald-500 to-cyan-500 text-emerald-300 border-emerald-500/50 bg-emerald-950/40";
  if (quality.grade === "S+" || quality.grade === "S") {
    gradeColor = "from-cyan-400 via-sky-300 to-fuchsia-400 text-cyan-200 border-cyan-400/60 bg-cyan-950/40 shadow-cyan-500/20";
  } else if (quality.grade === "A") {
    gradeColor = "from-emerald-400 to-teal-300 text-emerald-200 border-emerald-400/60 bg-emerald-950/40";
  } else if (quality.grade === "B") {
    gradeColor = "from-amber-400 to-yellow-300 text-amber-200 border-amber-400/60 bg-amber-950/40";
  } else {
    gradeColor = "from-rose-500 to-red-400 text-rose-200 border-rose-500/60 bg-rose-950/40";
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <AwardIcon className="text-cyan-400" size={18} />
            <h3 className="font-bold text-slate-100 text-sm tracking-wide">
              Match Quality Score (MQS)
            </h3>
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full border bg-cyan-950/60 text-cyan-300 border-cyan-700/60">
              Multi-Pillar Index
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Composite fairness score evaluating skill delta, latency harmony, role synergy, and queue wait times.
          </p>
        </div>

        {/* Big Score Gauge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Overall Index</span>
            <span className="text-3xl font-black font-mono tracking-tight text-white">
              {quality.overallScore}
              <span className="text-sm font-normal text-slate-500">/100</span>
            </span>
          </div>
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl border shadow-lg ${gradeColor}`}
          >
            {quality.grade}
          </div>
        </div>
      </div>

      {/* 4 Pillars Breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
        {/* Skill Balance */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3">
          <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <ActivityIcon size={12} className="text-cyan-400" /> Skill Balance
            </span>
            <strong className="text-cyan-300">{quality.skillBalanceScore}%</strong>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-sky-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${quality.skillBalanceScore}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1.5 block font-mono">Δ MMR Minimization</span>
        </div>

        {/* Latency Harmony */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3">
          <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <WifiIcon size={12} className="text-emerald-400" /> Latency Harmony
            </span>
            <strong className="text-emerald-300">{quality.pingHarmonyScore}%</strong>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${quality.pingHarmonyScore}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1.5 block font-mono">Low Ping Spread</span>
        </div>

        {/* Role Synergy */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3">
          <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <ShieldIcon size={12} className="text-fuchsia-400" /> Role Diversity
            </span>
            <strong className="text-fuchsia-300">{quality.roleSynergyScore}%</strong>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-fuchsia-500 to-purple-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${quality.roleSynergyScore}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1.5 block font-mono">Rusher/Support/Tank/Sniper</span>
        </div>

        {/* Queue Fairness */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3">
          <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <ClockIcon size={12} className="text-amber-400" /> Queue Fairness
            </span>
            <strong className="text-amber-300">{quality.queueFairnessScore}%</strong>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${quality.queueFairnessScore}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1.5 block font-mono">Starvation Prevention</span>
        </div>
      </div>
    </div>
  );
};
