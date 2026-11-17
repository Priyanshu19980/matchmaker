import React, { useState, useEffect } from "react";
import { Player, GameMode, EdgeServer, MatchmakingMatch } from "../lib/types";
import { getDUCollegiateDataset } from "../lib/datasets";
import { getDefaultServers, createSingleMatch } from "../lib/matchmakingPlatform";
import { AppSidebar, ActiveView } from "../components/layout/AppSidebar";
import { AppHeader } from "../components/layout/AppHeader";
import { MatchmakingHub } from "../components/platform/MatchmakingHub";
import { BatchMatchmaker } from "../components/platform/BatchMatchmaker";
import { PlayerPoolManager } from "../components/platform/PlayerPoolManager";
import { GreedyBalancerLab } from "../components/algorithms/GreedyBalancerLab";
import { PriorityQueueLab } from "../components/algorithms/PriorityQueueLab";
import { GraphCompatibilityLab } from "../components/algorithms/GraphCompatibilityLab";
import { SortingLab } from "../components/algorithms/SortingLab";
import { StrategyComparisonLab } from "../components/algorithms/StrategyComparisonLab";
import { AcademicAdaDoc } from "../components/AcademicAdaDoc";

const VIEW_TITLES: Record<ActiveView, string> = {
  hub: "Live Matchmaking Engine",
  batch: "Batch Multi-Match Platform",
  players: "Player Queue & Datasets Manager",
  greedy: "Greedy Balancer Lab (Section 5.A)",
  priority: "Priority Queue & Heap Lab (Section 5.B)",
  graph: "Graph Compatibility Lab (Section 5.C)",
  sorting: "Sorting Algorithms Benchmark (Section 5.D)",
  compare: "Strategy Comparison & Benchmarks (Section 8)",
  docs: "ADA Project Synopsis & Viva Documentation",
};

export default function Index() {
  const [activeView, setActiveView] = useState<ActiveView>("hub");
  const [mode, setMode] = useState<GameMode>("4v4");
  const [players, setPlayers] = useState<Player[]>(() => getDUCollegiateDataset());
  const [servers, setServers] = useState<EdgeServer[]>(() => getDefaultServers());
  const [currentMatch, setCurrentMatch] = useState<MatchmakingMatch | null>(null);
  const [matchHistory, setMatchHistory] = useState<MatchmakingMatch[]>([]);

  // Generate initial match
  const generateMatch = (pool = players, currentMode = mode) => {
    try {
      const freshServers = getDefaultServers();
      const res = createSingleMatch(pool, currentMode, freshServers, "proposed_greedy_graph");
      setCurrentMatch(res.match);
      setMatchHistory((prev) => [res.match, ...prev.slice(0, 9)]);
      setServers(freshServers);
    } catch (e) {
      console.error("Match error:", e);
    }
  };

  useEffect(() => {
    generateMatch(players, mode);
  }, [mode]);

  const handleSimulateTick = () => {
    const updated = players.map((p) => ({
      ...p,
      wait: p.wait + 10,
    }));
    setPlayers(updated);
    generateMatch(updated, mode);
  };

  const handleUpdatePlayers = (newPool: Player[]) => {
    setPlayers(newPool);
    generateMatch(newPool, mode);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Platform Sidebar */}
      <AppSidebar
        activeView={activeView}
        onSelectView={(v) => setActiveView(v)}
        queueCount={players.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          currentMode={mode}
          onModeChange={(m) => setMode(m)}
          queueSize={players.length}
          onSimulateTick={handleSimulateTick}
          activeViewTitle={VIEW_TITLES[activeView]}
        />

        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {activeView === "hub" && (
            <MatchmakingHub
              currentMatch={currentMatch}
              matchHistory={matchHistory}
              onGenerateNextMatch={() => generateMatch(players, mode)}
              onClearHistory={() => setMatchHistory([])}
              mode={mode}
              servers={servers}
              queueCount={players.length}
            />
          )}

          {activeView === "batch" && (
            <BatchMatchmaker players={players} mode={mode} servers={servers} />
          )}

          {activeView === "players" && (
            <PlayerPoolManager players={players} onUpdatePlayers={handleUpdatePlayers} />
          )}

          {activeView === "greedy" && (
            <GreedyBalancerLab
              currentLobby={
                currentMatch
                  ? [...currentMatch.teamA.players, ...currentMatch.teamB.players]
                  : players
              }
              mode={mode}
            />
          )}

          {activeView === "priority" && (
            <PriorityQueueLab players={players} onUpdatePlayers={handleUpdatePlayers} />
          )}

          {activeView === "graph" && (
            <GraphCompatibilityLab players={players} />
          )}

          {activeView === "sorting" && (
            <SortingLab players={players} />
          )}

          {activeView === "compare" && (
            <StrategyComparisonLab players={players} mode={mode} />
          )}

          {activeView === "docs" && <AcademicAdaDoc />}
        </main>

        <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500 font-mono">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Faculty of Technology, University of Delhi • CSE-B2</span>
            <span>Guide: <strong className="text-cyan-400">Dr. Juhi Jain</strong> | Priyanshu Kumar & Thulasi Harsha Vardhan</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
