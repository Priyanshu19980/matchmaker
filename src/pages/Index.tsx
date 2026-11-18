import React, { useState, useEffect } from "react";
import { Player, GameMode, EdgeServer, MatchmakingMatch, PLAYERS_PER_TEAM } from "../lib/types";
import { getDUCollegiateDataset, generateFreshQueue } from "../lib/datasets";
import { getDefaultServers, createSingleMatch } from "../lib/matchmakingPlatform";
import { playMatchFoundSound } from "../lib/soundEffects";
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
import { LandingPage } from "../components/landing/LandingPage";
import { DijkstraLab } from "../components/algorithms/DijkstraLab";

const VIEW_TITLES: Record<ActiveView, string> = {
  landing: "Landing Home Portal",
  hub: "Live Matchmaking Engine",
  batch: "Batch Multi-Match Platform",
  players: "Player Queue & Datasets Manager",
  priority: "Priority Queue & Heap Lab (Stage 1)",
  graph: "Graph Compatibility Lab (Stage 2)",
  greedy: "Greedy Balancer Lab (Stage 3)",
  dijkstra: "Dijkstra Routing Lab (Stage 4)",
  sorting: "Sorting Algorithms Benchmark",
  compare: "Strategy Comparison & Benchmarks",
  docs: "Engine Architecture & Algorithmic Specs",
};

export default function Index() {
  // User is ALWAYS redirected to landing page first
  const [activeView, setActiveView] = useState<ActiveView>("landing");
  const [mode, setMode] = useState<GameMode>("4v4");
  const [players, setPlayers] = useState<Player[]>(() => getDUCollegiateDataset());
  const [activeQueue, setActiveQueue] = useState<Player[]>(() => getDUCollegiateDataset());
  const [servers, setServers] = useState<EdgeServer[]>(() => getDefaultServers());
  const [currentMatch, setCurrentMatch] = useState<MatchmakingMatch | null>(null);
  const [matchHistory, setMatchHistory] = useState<MatchmakingMatch[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize hash routing; default ALWAYS to landing page on root or fresh visit
  useEffect(() => {
    const syncRouteFromHash = () => {
      const hash = window.location.hash.replace("#/", "").replace("#", "").trim();
      if (hash && hash in VIEW_TITLES) {
        setActiveView(hash as ActiveView);
      } else {
        setActiveView("landing");
      }
    };

    syncRouteFromHash();
    window.addEventListener("hashchange", syncRouteFromHash);
    return () => window.removeEventListener("hashchange", syncRouteFromHash);
  }, []);

  const navigateTo = (view: ActiveView) => {
    setActiveView(view);
    if (view === "landing") {
      window.location.hash = "#/";
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.hash = `#/${view}`;
    }
  };

  // Initialize initial match on mount for the engine
  useEffect(() => {
    try {
      const freshServers = getDefaultServers();
      const res = createSingleMatch(activeQueue, mode, freshServers, "proposed_greedy_graph");
      setCurrentMatch(res.match);
      setMatchHistory([res.match]);
      setActiveQueue(res.remainingPool);
      setServers(freshServers);
    } catch (e) {
      console.error("Initial match creation error:", e);
    }
  }, []);

  // Handle forming the next match sequentially from active queue
  const handleGenerateNextMatch = () => {
    setIsGenerating(true);
    try {
      const teamSize = PLAYERS_PER_TEAM[mode];
      const requiredLobby = teamSize * 2;
      let currentQueue = [...activeQueue];
      let didReplenish = false;

      // If active queue has fewer players than required for this mode, auto-replenish!
      if (currentQueue.length < requiredLobby) {
        const freshArrivals = generateFreshQueue(32, mode);
        currentQueue = [...currentQueue, ...freshArrivals];
        didReplenish = true;
      }

      const freshServers = getDefaultServers();
      const res = createSingleMatch(currentQueue, mode, freshServers, "proposed_greedy_graph");

      setCurrentMatch(res.match);
      setMatchHistory((prev) => [res.match, ...prev.slice(0, 19)]);
      setActiveQueue(res.remainingPool);
      setServers(freshServers);

      if (didReplenish) {
        setToastMessage(`⚡ Queue replenished with 32 fresh waiting candidates! Formed ${res.match.id} (${res.remainingPool.length} waiting)`);
      } else {
        setToastMessage(`✅ Formed ${mode} Match ${res.match.id} (Δ ${res.match.ratingDelta} MMR) • Remaining Queue: ${res.remainingPool.length}`);
      }

      playMatchFoundSound();
    } catch (e) {
      console.error("Match creation error:", e);
      // Fallback safety refill
      const fresh = generateFreshQueue(32, mode);
      const res = createSingleMatch(fresh, mode, getDefaultServers(), "proposed_greedy_graph");
      setCurrentMatch(res.match);
      setActiveQueue(res.remainingPool);
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
      }, 250);
    }
  };

  // Reset or refill the active queue
  const handleResetQueue = () => {
    const refreshed = players.length >= PLAYERS_PER_TEAM[mode] * 2 ? [...players] : generateFreshQueue(32, mode);
    setActiveQueue(refreshed);
    setToastMessage(`🔄 Queue replenished to ${refreshed.length} active players.`);
    try {
      const freshServers = getDefaultServers();
      const res = createSingleMatch(refreshed, mode, freshServers, "proposed_greedy_graph");
      setCurrentMatch(res.match);
      setActiveQueue(res.remainingPool);
      setServers(freshServers);
    } catch (e) {
      console.error(e);
    }
  };

  // Switch Game Mode (2v2, 3v3, 4v4, 5v5)
  const handleModeChange = (newMode: GameMode) => {
    setMode(newMode);
    const required = PLAYERS_PER_TEAM[newMode] * 2;
    let pool = activeQueue.length >= required ? [...activeQueue] : [...players];
    if (pool.length < required) {
      pool = generateFreshQueue(32, newMode);
    }

    try {
      const freshServers = getDefaultServers();
      const res = createSingleMatch(pool, newMode, freshServers, "proposed_greedy_graph");
      setCurrentMatch(res.match);
      setMatchHistory((prev) => [res.match, ...prev.slice(0, 19)]);
      setActiveQueue(res.remainingPool);
      setServers(freshServers);
      setToastMessage(`Switched mode to ${newMode} (Lobby: ${required} players). New match formed!`);
      playMatchFoundSound();
    } catch (e) {
      console.error(e);
    }
  };

  // Simulate +10s queue wait time aging (triggers starvation re-ranking)
  const handleSimulateTick = () => {
    const tickQueue = activeQueue.map((p) => ({
      ...p,
      wait: p.wait + 10,
    }));
    const tickPlayers = players.map((p) => ({
      ...p,
      wait: p.wait + 10,
    }));
    setActiveQueue(tickQueue);
    setPlayers(tickPlayers);
    setToastMessage(`⏱️ Simulated +10s queue wait time! Priority weights recalculated across all ${tickQueue.length} waiting players.`);
  };

  // Update master player pool (e.g. from Presets or Add Player form)
  const handleUpdatePlayers = (newPool: Player[]) => {
    setPlayers(newPool);
    setActiveQueue(newPool);
    try {
      const freshServers = getDefaultServers();
      const res = createSingleMatch(newPool, mode, freshServers, "proposed_greedy_graph");
      setCurrentMatch(res.match);
      setActiveQueue(res.remainingPool);
      setServers(freshServers);
      setToastMessage(`Loaded new player pool (${newPool.length} players). Formed initial match!`);
      playMatchFoundSound();
    } catch (e) {
      console.error(e);
    }
  };

  // =========================================================================
  // 1. SEPARATE LANDING PAGE (NO SIDEBAR - EXACT REPLICA OF THE IMAGE)
  // =========================================================================
  if (activeView === "landing") {
    return (
      <LandingPage
        onLaunchEngine={() => navigateTo("hub")}
        queueCount={activeQueue.length}
      />
    );
  }

  // =========================================================================
  // 2. MATCHMAKING PLATFORM / WORKSPACE (LEFT SIDEBAR DISPLAYED AFTER LANDING)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#0c0f15] text-slate-100 flex flex-col md:flex-row font-sans selection:bg-[#00f0d2]/30 selection:text-[#00f0d2]">
      {/* Platform Left Sidebar - ONLY displayed after leaving Landing Page */}
      <AppSidebar
        activeView={activeView}
        onSelectView={(v) => navigateTo(v)}
        queueCount={activeQueue.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          currentMode={mode}
          onModeChange={handleModeChange}
          queueSize={activeQueue.length}
          onSimulateTick={handleSimulateTick}
          activeViewTitle={VIEW_TITLES[activeView]}
          onOpenLanding={() => navigateTo("landing")}
        />

        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {activeView === "hub" && (
            <MatchmakingHub
              currentMatch={currentMatch}
              matchHistory={matchHistory}
              onGenerateNextMatch={handleGenerateNextMatch}
              onResetQueue={handleResetQueue}
              onClearHistory={() => setMatchHistory([])}
              mode={mode}
              servers={servers}
              queueCount={activeQueue.length}
              isGenerating={isGenerating}
              toastMessage={toastMessage}
            />
          )}

          {activeView === "batch" && (
            <BatchMatchmaker
              players={players}
              mode={mode}
              servers={servers}
            />
          )}

          {activeView === "players" && (
            <PlayerPoolManager
              players={players}
              onUpdatePlayers={handleUpdatePlayers}
            />
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
            <PriorityQueueLab
              players={activeQueue.length > 0 ? activeQueue : players}
              onUpdatePlayers={handleUpdatePlayers}
            />
          )}

          {activeView === "graph" && (
            <GraphCompatibilityLab
              players={activeQueue.length >= 8 ? activeQueue : players}
            />
          )}

          {activeView === "dijkstra" && <DijkstraLab />}

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
            <span>MULTI-MATCH™ • 4-Stage Algorithmic Matchmaking Engine</span>
            <span>Fair & Fast • Greedy Partitioning • Binary Max-Heap • Graph Clustering</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
