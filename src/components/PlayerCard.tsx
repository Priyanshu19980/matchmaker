import React from "react";
import { Player, PlayerRole, Region } from "../lib/types";
import { ZapIcon, ShieldIcon, CrosshairIcon, ClockIcon, WifiIcon } from "./Icons";

interface PlayerCardProps {
  player: Player;
  teamSide?: "alpha" | "omega" | "neutral";
  compact?: boolean;
}

const ROLE_COLORS: Record<PlayerRole, { bg: string; text: string; border: string }> = {
  Rusher: { bg: "bg-red-950/40", text: "text-red-400", border: "border-red-800/50" },
  Sniper: { bg: "bg-amber-950/40", text: "text-amber-400", border: "border-amber-800/50" },
  Support: { bg: "bg-emerald-950/40", text: "text-emerald-400", border: "border-emerald-800/50" },
  Tank: { bg: "bg-cyan-950/40", text: "text-cyan-400", border: "border-cyan-800/50" },
  Flex: { bg: "bg-purple-950/40", text: "text-purple-400", border: "border-purple-800/50" },
};

const REGION_FLAGS: Record<Region, string> = {
  India: "🇮🇳 India",
  Asia: "🌏 Asia-SE",
  EU: "🇪🇺 Europe",
  NA: "🌎 NA",
};

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, teamSide = "neutral", compact = false }) => {
  const roleStyle = ROLE_COLORS[player.role] || ROLE_COLORS.Flex;

  // Border & Glow based on team side
  let sideStyle = "border-slate-800 bg-slate-900/80 hover:border-slate-700";
  if (teamSide === "alpha") {
    sideStyle = "border-sky-500/30 bg-sky-950/20 hover:border-sky-500/50";
  } else if (teamSide === "omega") {
    sideStyle = "border-rose-500/30 bg-rose-950/20 hover:border-rose-500/50";
  }

  // Ping color
  const pingColor =
    player.ping < 35
      ? "text-emerald-400"
      : player.ping < 70
      ? "text-amber-400"
      : "text-rose-400";

  // MMR tier badge
  const ratingTier =
    player.rating >= 2100
      ? { label: "PRO", color: "text-fuchsia-400 bg-fuchsia-950/60 border-fuchsia-800/60" }
      : player.rating >= 1650
      ? { label: "ADV", color: "text-purple-400 bg-purple-950/60 border-purple-800/60" }
      : player.rating >= 1150
      ? { label: "MID", color: "text-cyan-400 bg-cyan-950/60 border-cyan-800/60" }
      : { label: "BEG", color: "text-slate-400 bg-slate-800 border-slate-700" };

  if (compact) {
    return (
      <div className={`flex items-center justify-between p-2 rounded-lg border ${sideStyle} text-xs transition-all`}>
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold text-slate-300">{player.id}</span>
          <span className="text-slate-200 font-medium">{player.name}</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}>
            {player.role}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-cyan-300">{player.rating}</span>
          <span className={`flex items-center gap-0.5 font-mono ${pingColor}`}>
            <WifiIcon size={11} /> {player.ping}ms
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-3 rounded-xl border ${sideStyle} shadow-sm backdrop-blur-sm transition-all relative overflow-hidden group`}>
      {/* Top row: ID, Name, Rank badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center font-mono font-bold text-[11px] text-cyan-400">
            {player.id}
          </span>
          <span className="font-bold text-slate-100 text-sm tracking-wide group-hover:text-cyan-300 transition-colors">
            {player.name}
          </span>
        </div>
        <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${ratingTier.color}`}>
          {ratingTier.label}
        </span>
      </div>

      {/* Middle row: Rating, Role, Region */}
      <div className="grid grid-cols-2 gap-2 my-2 py-2 border-y border-slate-800/80 text-xs">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Skill Rating</span>
          <span className="font-mono text-base font-bold text-cyan-300 flex items-center gap-1">
            {player.rating}
            <span className="text-[10px] text-slate-500 font-normal">MMR</span>
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Role</span>
          <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-semibold border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}>
            {player.role}
          </span>
        </div>
      </div>

      {/* Bottom row: Ping, Win Rate, Wait Time, Region */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
        <div className="flex items-center gap-1">
          <span className="text-slate-300">{REGION_FLAGS[player.region]}</span>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <span className={`flex items-center gap-0.5 ${pingColor}`}>
            <WifiIcon size={12} /> {player.ping}ms
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300 flex items-center gap-0.5">
            WR: <strong className="text-emerald-400">{player.winRate}%</strong>
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-amber-400 flex items-center gap-0.5">
            <ClockIcon size={11} /> {player.wait}s
          </span>
        </div>
      </div>
    </div>
  );
};
