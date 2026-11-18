import React from "react";
import {
  GamepadIcon,
  ZapIcon,
  ShieldIcon,
  ActivityIcon,
  AwardIcon,
  LayersIcon,
  BookOpenIcon,
  UsersIcon,
  ServerIcon,
  HomeIcon,
} from "../Icons";
import { ReachLogo } from "../common/ReachLogo";

export type ActiveView =
  | "landing"
  | "hub"
  | "batch"
  | "players"
  | "greedy"
  | "priority"
  | "graph"
  | "dijkstra"
  | "sorting"
  | "compare"
  | "docs";

interface AppSidebarProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  queueCount: number;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
  sub?: string;
}

interface NavSection {
  heading: string;
  items: NavItem[];
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeView,
  onSelectView,
  queueCount,
}) => {
  const navSections: NavSection[] = [
    {
      heading: "PORTAL & LEADERBOARDS",
      items: [
        { id: "landing", label: "Reach Portal & Leaderboards", icon: HomeIcon, badge: "PORTAL" },
      ],
    },
    {
      heading: "MATCHMAKING PLATFORM",
      items: [
        { id: "hub", label: "Match Engine & Queue", icon: GamepadIcon, badge: "LIVE" },
        { id: "batch", label: "Batch Multi-Match", icon: LayersIcon, badge: `${Math.floor(queueCount / 8)} Ready` },
        { id: "players", label: "Player Pool & Datasets", icon: UsersIcon, badge: `${queueCount}` },
      ],
    },
    {
      heading: "ALGORITHM LABS",
      items: [
        { id: "priority", label: "Priority Queue (Heap)", icon: ActivityIcon, sub: "Stage 1" },
        { id: "graph", label: "Graph Compatibility Lab", icon: ShieldIcon, sub: "Stage 2" },
        { id: "greedy", label: "Greedy Balancer Lab", icon: ZapIcon, sub: "Stage 3" },
        { id: "dijkstra", label: "Dijkstra Routing Lab", icon: ServerIcon, sub: "Stage 4" },
        { id: "sorting", label: "Sorting Benchmark Lab", icon: ServerIcon, sub: "Bench" },
        { id: "compare", label: "Strategy Comparison", icon: AwardIcon, sub: "Benchmark" },
      ],
    },
    {
      heading: "SPECIFICATIONS",
      items: [
        { id: "docs", label: "Engine Architecture & Specs", icon: BookOpenIcon, sub: "Proofs" },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-[#0c0f15] border-r border-[#1b2230] flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto font-mono text-xs select-none">
      <div>
        {/* Brand Header with Dual-Triangle Reach Logo */}
        <div className="p-4 border-b border-[#1b2230] bg-[#090c12]/80">
          <div className="flex items-center gap-3">
            <ReachLogo size={32} />
            <div>
              <h1 className="font-black text-white text-sm tracking-wider flex items-center">
                <span>MULTI-</span>
                <span className="text-[#ff2a6d]">MATCH</span>
              </h1>
              <p className="text-[10px] text-[#00f0d2] font-semibold uppercase tracking-tight">
                ESPORTS ENGINE
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="p-3 space-y-5">
          {navSections.map((section) => (
            <div key={section.heading} className="space-y-1">
              <div className="px-2 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                {section.heading}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectView(item.id as ActiveView)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left relative overflow-hidden group ${
                        isActive
                          ? "bg-[#00f0d2]/10 text-white border-l-2 border-[#00f0d2] font-bold shadow-[inset_0_0_15px_rgba(0,240,210,0.08)]"
                          : "text-slate-400 hover:text-white hover:bg-[#121620] border-l-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          size={15}
                          className={
                            isActive
                              ? "text-[#00f0d2] drop-shadow-[0_0_6px_#00f0d2]"
                              : "text-slate-500 group-hover:text-slate-300"
                          }
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                            isActive
                              ? "bg-[#00f0d2] text-[#0c0f15] font-black"
                              : "bg-[#181f2c] text-slate-300 border border-[#1f2737]"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {item.sub && !item.badge && (
                        <span className="text-[9px] text-slate-500">
                          {item.sub}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Footer */}
      <div className="p-3.5 border-t border-[#1b2230] bg-[#090c12]/90 text-[11px] space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase text-[#00f0d2] font-bold tracking-wider">
            REACH ENGINE v2.5
          </span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
            ONLINE
          </span>
        </div>
        <div className="text-slate-400 text-xs">
          4-Stage Algorithmic Engine
        </div>
      </div>
    </aside>
  );
};
