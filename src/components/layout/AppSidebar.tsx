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
} from "../Icons";

export type ActiveView =
  | "hub"
  | "batch"
  | "players"
  | "greedy"
  | "priority"
  | "graph"
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
      heading: "MATCHMAKING PLATFORM",
      items: [
        { id: "hub", label: "Match Engine & Queue", icon: GamepadIcon, badge: "LIVE" },
        { id: "batch", label: "Batch Multi-Match", icon: LayersIcon, badge: `${Math.floor(queueCount / 8)} Ready` },
        { id: "players", label: "Player Datasets", icon: UsersIcon, badge: `${queueCount}` },
      ],
    },
    {
      heading: "ALGORITHM LABS",
      items: [
        { id: "greedy", label: "Greedy Balancer Lab", icon: ZapIcon, sub: "Stage 3" },
        { id: "priority", label: "Priority Queue (Heap)", icon: ActivityIcon, sub: "Stage 1" },
        { id: "graph", label: "Graph Compatibility Lab", icon: ShieldIcon, sub: "Stage 2" },
        { id: "sorting", label: "Sorting Benchmark Lab", icon: ServerIcon, sub: "Bench" },
        { id: "compare", label: "Strategy Comparison", icon: AwardIcon, sub: "Benchmark" },
      ],
    },
    {
      heading: "SPECIFICATIONS",
      items: [
        { id: "docs", label: "Engine Architecture", icon: BookOpenIcon, sub: "Docs & Proofs" },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto">
      <div>
        {/* Brand Header with Uploaded Logo */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="MULTI-MATCH Logo"
              className="w-12 h-12 rounded-xl object-cover border border-cyan-500/40 shadow-lg shadow-cyan-500/20"
            />
            <div>
              <h1 className="font-black text-white text-base tracking-wider flex items-center gap-1.5">
                MULTI-MATCH
              </h1>
              <p className="text-[10px] text-cyan-400 font-mono font-semibold uppercase tracking-tight">
                Fair & Fast Engine
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="p-3 space-y-5">
          {navSections.map((section) => (
            <div key={section.heading} className="space-y-1">
              <div className="px-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
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
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                        isActive
                          ? "bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10 font-semibold"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon size={15} className={isActive ? "text-cyan-400" : "text-slate-500"} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {item.badge}
                        </span>
                      )}
                      {item.sub && (
                        <span className="text-[9px] font-mono text-slate-500 hidden sm:inline">
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

      {/* Modern Platform Footer */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-900/40 text-[11px] space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider">
            MULTI-MATCH v2.4
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
            STABLE
          </span>
        </div>
        <div className="text-slate-300 font-medium text-xs">
          4-Stage Algorithmic Engine
        </div>
        <div className="text-slate-500 text-[10px] font-mono">
          Greedy • Heap • Graph • Dijkstra
        </div>
      </div>
    </aside>
  );
};
