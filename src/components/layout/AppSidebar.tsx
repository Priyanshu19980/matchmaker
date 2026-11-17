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
      heading: "ADA ALGORITHM LABS",
      items: [
        { id: "greedy", label: "Greedy Balancer Lab", icon: ZapIcon, sub: "Section 5.A" },
        { id: "priority", label: "Priority Queue (Heap)", icon: ActivityIcon, sub: "Section 5.B" },
        { id: "graph", label: "Graph Compatibility Lab", icon: ShieldIcon, sub: "Section 5.C" },
        { id: "sorting", label: "Sorting Benchmark Lab", icon: ServerIcon, sub: "Section 5.D" },
        { id: "compare", label: "Strategy Comparison", icon: AwardIcon, sub: "Section 8" },
      ],
    },
    {
      heading: "ACADEMIC & SYNOPSIS",
      items: [
        { id: "docs", label: "ADA Synopsis & Docs", icon: BookOpenIcon, sub: "DU FT • Juhi Jain" },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-md shadow-cyan-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-cyan-400 text-sm">
                DU
              </div>
            </div>
            <div>
              <h1 className="font-bold text-slate-100 text-sm tracking-wide flex items-center gap-1.5">
                MATCHMAKER <span className="text-cyan-400 font-mono text-xs">ADA</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-mono">
                Faculty of Technology, DU
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

      {/* Authors Academic Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/30 text-[11px] space-y-1">
        <div className="text-[10px] font-mono uppercase text-slate-500 font-bold">
          ADA Project Contributors
        </div>
        <div className="text-slate-200 font-medium truncate">
          Priyanshu Kumar • Harsha Vardhan
        </div>
        <div className="text-slate-400 text-[10px] font-mono flex items-center justify-between">
          <span>CSE-B2 • 3rd Sem</span>
          <span className="text-cyan-400 font-semibold">Dr. Juhi Jain</span>
        </div>
      </div>
    </aside>
  );
};
