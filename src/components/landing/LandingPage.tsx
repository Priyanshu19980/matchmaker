import React, { useState } from "react";
import { ReachLogo } from "../common/ReachLogo";
import {
  CrosshairIcon,
  ZapIcon,
  ActivityIcon,
  ServerIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  DownloadIcon,
  AwardIcon,
} from "../Icons";

interface LandingPageProps {
  onLaunchEngine: () => void;
  queueCount: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchEngine, queueCount }) => {
  const [activeTab, setActiveTab] = useState<"home" | "leaderboard" | "matches" | "dijkstra">("home");
  const [leaderboardFilter, setLeaderboardFilter] = useState<"fast" | "pinnacle">("fast");
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  // Mock Leaderboard Data replicating the exact REACH screenshot
  const leaderboardPlayers = [
    { rank: 1, name: "J.Storm.Moo.GG.Bet", winRate: "78.25%", record: "52-24", points: 66, prize: "$250", streak: "3W", isUser: false, avatar: "🧙" },
    { rank: 2, name: "Water", winRate: "74.00%", record: "48-21", points: 61, prize: "$140", streak: "1L", isUser: false, avatar: "🌊", promo: "In promotion window" },
    { rank: 3, name: "Monster", winRate: "72.00%", record: "48-21", points: 58, prize: "$120", streak: "2L", isUser: false, avatar: "👹" },
    { rank: 4, name: "MottoDim", winRate: "71.25%", record: "44-19", points: 52, prize: "$100", streak: "1W", isUser: true, avatar: "⚡" },
    { rank: 5, name: "BL.Argiss", winRate: "70.11%", record: "45-20", points: 52, prize: "$100", streak: "3W", isUser: false, avatar: "🛡", note: "Has risen 2 ranks in past 24h" },
    { rank: 6, name: "Snoop", winRate: "69.95%", record: "43-23", points: 50, prize: "$100", streak: "1L", isUser: false, avatar: "🎯" },
    { rank: 7, name: "NO!NO.Benny", winRate: "67.00%", record: "40-23", points: 48, prize: "$100", streak: "2L", isUser: false, avatar: "🔥", note: "Needs 4 points to enter promotion window" },
    { rank: 12, name: "superman64", winRate: "61.00%", record: "41-25", points: 43, prize: "-", streak: "2L", isUser: false, avatar: "🦸" },
    { rank: 18, name: "Kevin", winRate: "56.00%", record: "18-55", points: -20, prize: "-", streak: "2L", isUser: false, avatar: "🏹" },
  ];

  return (
    <div className="min-h-screen bg-[#0c0f15] text-slate-100 font-sans selection:bg-[#00f0d2]/30 selection:text-[#00f0d2] relative overflow-x-hidden">
      {/* =========================================================================
          REACH TOP NAVIGATION BAR (Exact Replica of Screenshots 1 & 2)
          ========================================================================= */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-[#0c0f15]/95 backdrop-blur-md border-b border-[#1b2230] transition-all">
        {/* Main Nav Row */}
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Navigation Tabs */}
          <nav className="flex items-center gap-8 text-xs font-bold uppercase tracking-wider font-mono">
            <button
              onClick={() => setActiveTab("home")}
              className={`transition-all pb-1 ${
                activeTab === "home" ? "reach-tab-active font-black" : "text-slate-400 hover:text-white"
              }`}
            >
              HOME
            </button>

            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`transition-all pb-1 ${
                activeTab === "leaderboard" ? "reach-tab-active font-black" : "text-slate-400 hover:text-white"
              }`}
            >
              LEADERBOARD
            </button>

            <button
              onClick={onLaunchEngine}
              className="text-slate-400 hover:text-white transition-all pb-1"
            >
              MATCHES
            </button>

            <button
              onClick={() => {
                window.location.hash = "#/dijkstra";
              }}
              className="text-slate-400 hover:text-[#00f0d2] transition-all pb-1 flex items-center gap-1.5"
            >
              <ServerIcon size={12} className="text-[#00f0d2]" />
              DIJKSTRA LAB
            </button>
          </nav>

          {/* Center: Dual-Triangle Reach Logo */}
          <div
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <ReachLogo size={36} showText={true} />
          </div>

          {/* Right: PLAY NOW Pill Button & User Profile Widget */}
          <div className="flex items-center gap-5">
            {/* Cyan "PLAY NOW" / "PLAY PASS" Button */}
            <button
              onClick={onLaunchEngine}
              className="hidden sm:inline-flex items-center gap-2 px-6 py-2 rounded-full reach-btn-cyan text-xs font-black"
            >
              <span>PLAY NOW</span>
            </button>

            {/* Profile Widget */}
            <div
              className="relative flex items-center gap-3 pl-3 border-l border-[#1f2737] cursor-pointer"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              {/* Avatar with Red/Magenta Level Badge */}
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#ff2a6d] to-[#00f0d2] p-0.5">
                  <div className="w-full h-full rounded-full bg-[#161c27] flex items-center justify-center text-sm font-bold">
                    👨‍💻
                  </div>
                </div>
                <span className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-[#ff2a6d] text-white text-[9px] font-black flex items-center justify-center font-mono shadow-sm">
                  71
                </span>
              </div>

              {/* Username & Rank Bar */}
              <div className="hidden md:block text-left font-mono">
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>MottoDim</span>
                  <span className="text-slate-500 text-[10px]">▼</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#00f0d2]" />
                  <div className="w-16 h-1 rounded-full bg-slate-800 overflow-hidden">
                    <div className="w-3/4 h-full bg-[#00f0d2] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Behavior Score Tooltip Popup */}
              {showTooltip && (
                <div className="absolute top-12 right-0 w-52 p-3 rounded-xl bg-[#121620] border border-[#1f2737] shadow-2xl z-50 text-[11px] font-mono space-y-1">
                  <div className="text-white font-bold flex items-center justify-between">
                    <span>Behavior Score:</span>
                    <span className="text-[#00f0d2]">98 / 100</span>
                  </div>
                  <p className="text-slate-400 text-[10px] leading-tight font-sans">
                    Click to view behavior guidelines & matchmaking queue priority.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sub-Header Ticker Bar (Exact to Reach screenshot) */}
        <div className="border-t border-[#161c26] bg-[#090c12]/90 py-1.5 px-6 font-mono text-[11px] text-slate-400">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00f0d2] animate-pulse" />
                <span className="text-slate-300 font-bold">912</span> games yesterday
              </span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="hidden sm:flex items-center gap-1.5">
                <span className="text-[#ff2a6d] font-bold">6pm EDT</span> session start time
              </span>
              <span className="hidden md:inline text-slate-600">•</span>
              <span className="hidden md:flex items-center gap-1.5">
                <span className="text-[#00f0d2] font-bold">{queueCount}</span> active waiting queue
              </span>
            </div>
            <div className="text-slate-400 text-[10px]">
              Welcome back to <span className="text-white font-bold">MULTI-MATCH</span>! Check the schedule below.
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          VIEW 1: HOME PAGE (Replicating media_1795024194234_2e4e2b76.png)
          ========================================================================= */}
      {activeTab === "home" && (
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
          {/* Hero Section Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
            {/* Left 7 Columns: Giant Heading & Subtitle */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-[1.08]">
                WELCOME TO <span className="text-[#ff2a6d] drop-shadow-[0_0_20px_rgba(255,42,109,0.6)]">MULTI-MATCH</span>, <br />
                THE SOLO LEAGUE WHERE <br />
                YOU GET DISCOVERED
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                Multi-Match brings you tournament-grade algorithmic matchmaking, anti-starvation priority queues, zero skill toxicity, and millisecond-accurate Dijkstra edge routing.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setActiveTab("leaderboard")}
                  className="px-8 py-3 rounded-full reach-btn-outline text-xs font-bold"
                >
                  SEE LEADERBOARD
                </button>

                <a
                  href="/MULTI-MATCH_Project_Brief.pdf"
                  download="MULTI-MATCH_Project_Brief.pdf"
                  className="px-6 py-3 rounded-full bg-[#121620] hover:bg-[#181f2c] border border-[#1f2737] text-slate-300 hover:text-white text-xs font-mono font-bold transition-all flex items-center gap-2"
                >
                  <DownloadIcon size={14} className="text-[#00f0d2]" />
                  <span>PDF Architecture Brief</span>
                </a>
              </div>
            </div>

            {/* Right 5 Columns: Reach Cards (Queue Offline/Live & Session Schedule) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Card 1: Queue Status Card */}
              <div className="reach-card p-6 border-l-4 border-l-[#00f0d2] shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-[#1b2230]">
                  <div className="flex items-center gap-3">
                    <ReachLogo size={24} />
                    <span className="font-mono font-black text-sm uppercase tracking-wider text-white">
                      QUEUE LIVE & READY
                    </span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00f0d2] animate-ping" />
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      Active Queue Pool
                    </span>
                    <span className="text-2xl font-black text-white font-mono">
                      {queueCount} Players
                    </span>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-[10px] text-slate-400 uppercase block">Next Batch Match</span>
                    <div className="text-xl font-black text-[#00f0d2] flex items-center gap-1">
                      <span>00</span>
                      <span className="text-slate-600">:</span>
                      <span>14</span>
                      <span className="text-[10px] text-slate-500 font-normal">SEC</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Session Schedule Card */}
              <div className="reach-card p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono font-bold text-sm text-white uppercase tracking-wider">
                    Session Schedule
                  </h3>
                  <span className="text-xs font-mono font-black text-[#ff2a6d]">
                    $2,000 prize pool
                  </span>
                </div>

                {/* Days Table */}
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between py-1.5 border-b border-[#181f2c]">
                    <span className="text-slate-400">Monday – Thursday</span>
                    <span className="px-2 py-0.5 rounded bg-[#ff2a6d]/20 text-[#ff2a6d] font-bold text-[11px] border border-[#ff2a6d]/40">
                      6pm – 1am
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-[#181f2c]">
                    <span className="text-slate-400">Friday</span>
                    <span className="px-2 py-0.5 rounded bg-[#ff2a6d]/20 text-[#ff2a6d] font-bold text-[11px] border border-[#ff2a6d]/40">
                      5pm – 2am
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-400">Saturday – Sunday</span>
                    <span className="px-2 py-0.5 rounded bg-[#ff2a6d]/20 text-[#ff2a6d] font-bold text-[11px] border border-[#ff2a6d]/40">
                      5pm – 2am
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] font-mono text-slate-500 block mb-3">
                    Next Sprint: Sprint 2 begins in 4 days
                  </span>

                  {/* Hot Magenta Action Button */}
                  <button
                    onClick={onLaunchEngine}
                    className="w-full py-3 rounded-full reach-btn-pink text-xs font-black shadow-lg"
                  >
                    ENTER LIVE ARENA
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Partner / Announcement Bar (Exact replica of ESL + DOTABUFF bar) */}
          <div className="reach-card p-5 flex flex-col md:flex-row items-center justify-between gap-4 border border-[#1f2737]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 font-black font-mono text-sm tracking-wider">
                <span className="text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700">ESL</span>
                <span className="text-slate-500">+</span>
                <span className="text-white px-2 py-0.5 rounded bg-[#ff2a6d] font-black">DOTABUFF</span>
              </div>
              <div className="hidden lg:block text-xs text-slate-300 font-sans">
                Multi-Match algorithm suite was engineered with collegiate esports datasets & verified by live peer graph clustering.
              </div>
            </div>

            <button
              onClick={onLaunchEngine}
              className="px-6 py-2.5 rounded-full reach-btn-cyan text-xs font-black shrink-0"
            >
              READ ARCHITECTURE SPEC
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: LEADERBOARD PAGE (Exact Replica of media_1795024176652_e10c9972.png)
          ========================================================================= */}
      {activeTab === "leaderboard" && (
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
          {/* Top Leaderboard Header Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 3 Cols: Division Card */}
            <div className="lg:col-span-3 reach-card p-5 border-t-4 border-t-[#00f0d2] space-y-3">
              <div className="w-full h-32 rounded-xl bg-gradient-to-br from-[#1e2636] to-[#0c0f15] border border-[#1f2737] flex flex-col items-center justify-center relative overflow-hidden">
                <span className="text-4xl mb-1">🧙</span>
                <span className="text-xs font-mono font-bold text-[#00f0d2]">DIVISION A</span>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Void Spirit's Battalion</h3>
                <p className="text-[11px] text-slate-400 font-mono">Division 1 • North America</p>
              </div>
              <div className="p-2 rounded-lg bg-[#090c12] border border-[#181f2c] flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Current Standing:</span>
                <span className="text-[#00f0d2] font-black">Rank #20</span>
              </div>
            </div>

            {/* Right 9 Cols: Leaderboard Header, Sprints, & Filters */}
            <div className="lg:col-span-9 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    My Leaderboard
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    NA Region, Current Sprint • Ranked by MMR Performance & Win Rate
                  </p>
                </div>

                {/* Filter Pill Buttons (Exact to screenshot) */}
                <div className="flex items-center gap-2 font-mono text-xs">
                  <button
                    onClick={() => setLeaderboardFilter("fast")}
                    className={`px-4 py-1.5 rounded-full font-bold uppercase transition-all ${
                      leaderboardFilter === "fast"
                        ? "bg-[#ff2a6d] text-white shadow-[0_0_15px_rgba(255,42,109,0.4)]"
                        : "bg-[#161c27] text-slate-400 hover:text-white border border-[#1f2737]"
                    }`}
                  >
                    MY FAST LEADERBOARD
                  </button>
                  <button
                    onClick={() => setLeaderboardFilter("pinnacle")}
                    className={`px-4 py-1.5 rounded-full font-bold uppercase transition-all ${
                      leaderboardFilter === "pinnacle"
                        ? "bg-[#ff2a6d] text-white shadow-[0_0_15px_rgba(255,42,109,0.4)]"
                        : "bg-[#161c27] text-slate-400 hover:text-white border border-[#1f2737]"
                    }`}
                  >
                    PINNACLE LEADERBOARD
                  </button>
                </div>
              </div>

              {/* Hot Magenta Sprint Progress Bar */}
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#ff2a6d] font-bold">Sprint 2</span>
                  <span className="text-slate-400">4 days, 12 hours remaining</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#181f2c] overflow-hidden">
                  <div className="w-3/5 h-full bg-[#ff2a6d] rounded-full shadow-[0_0_10px_#ff2a6d]" />
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              LEADERBOARD TABLE (Exact Replica with Highlights & Streaks)
              ========================================================================= */}
          <div className="reach-card overflow-hidden border border-[#1f2737] shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#181f2c] bg-[#090c12] text-slate-400 text-[11px] uppercase">
                    <th className="py-3 px-4 font-bold">Rank</th>
                    <th className="py-3 px-4 font-bold">Player</th>
                    <th className="py-3 px-4 font-bold">Win %</th>
                    <th className="py-3 px-4 font-bold">Record</th>
                    <th className="py-3 px-4 font-bold">Points</th>
                    <th className="py-3 px-4 font-bold">Prize</th>
                    <th className="py-3 px-4 font-bold">Streak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#181f2c]">
                  {leaderboardPlayers.map((player) => (
                    <tr
                      key={player.name}
                      className={`transition-colors relative ${
                        player.isUser
                          ? "bg-[#00f0d2]/10 border-y-2 border-[#00f0d2] font-bold text-white shadow-[inset_0_0_20px_rgba(0,240,210,0.1)]"
                          : "hover:bg-[#161c27]/60 text-slate-300"
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-3 px-4 font-black">
                        <div className="flex items-center gap-2">
                          <span className={player.rank <= 3 ? "text-[#ff2a6d]" : "text-slate-400"}>
                            #{player.rank}
                          </span>
                        </div>
                      </td>

                      {/* Player */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{player.avatar}</span>
                          <div>
                            <span className={`font-bold ${player.isUser ? "text-[#00f0d2]" : "text-white"}`}>
                              {player.name}
                            </span>
                            {player.isUser && (
                              <span className="ml-2 px-1.5 py-0.2 rounded bg-[#00f0d2] text-[#0c0f15] text-[9px] font-black uppercase">
                                YOU
                              </span>
                            )}
                            {player.promo && (
                              <span className="block text-[9px] text-[#00f0d2] font-normal">
                                {player.promo}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Win % */}
                      <td className="py-3 px-4 font-bold text-white">
                        {player.winRate}
                      </td>

                      {/* Record */}
                      <td className="py-3 px-4 text-slate-400">
                        {player.record}
                      </td>

                      {/* Points with Star */}
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-1 font-bold text-white">
                          <span className="text-[#00f0d2]">★</span>
                          <span>{player.points}</span>
                        </span>
                      </td>

                      {/* Prize */}
                      <td className="py-3 px-4 text-slate-300 font-bold">
                        {player.prize}
                      </td>

                      {/* Streak */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            player.streak.includes("W")
                              ? "bg-[#00f0d2]/20 text-[#00f0d2] border border-[#00f0d2]/40"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {player.streak}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          REACH FOOTER (Exact Replica of Screenshot 1)
          ========================================================================= */}
      <footer className="mt-24 border-t border-[#181f2c] bg-[#080a0f] py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Logo & Tagline */}
          <div className="space-y-3">
            <ReachLogo size={32} showText={true} />
            <p className="text-xs text-slate-500 font-sans leading-relaxed">
              Competitive 4-Stage Algorithmic Matchmaking Platform • Designed for fair play and millisecond edge server latency routing.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2 text-xs font-mono">
            <h4 className="text-white font-bold uppercase tracking-wider mb-3">Navigation</h4>
            <div><button onClick={() => setActiveTab("home")} className="text-slate-400 hover:text-white">Home</button></div>
            <div><button onClick={onLaunchEngine} className="text-slate-400 hover:text-white">Play Now</button></div>
            <div><button onClick={() => setActiveTab("leaderboard")} className="text-slate-400 hover:text-white">Leaderboards</button></div>
            <div><button onClick={() => { window.location.hash = "#/dijkstra"; }} className="text-slate-400 hover:text-white">Dijkstra Routing Lab</button></div>
          </div>

          {/* Col 3: More Info */}
          <div className="space-y-2 text-xs font-mono">
            <h4 className="text-white font-bold uppercase tracking-wider mb-3">Specifications</h4>
            <div className="text-slate-400">4-Stage Pipeline Proofs</div>
            <div className="text-slate-400">Min-Heap Starvation Rules</div>
            <div className="text-slate-400">Graph Clustering Metrics</div>
            <div className="text-slate-400">Dijkstra Shortest Path Lab</div>
          </div>

          {/* Col 4: Socials */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs font-mono mb-3">Social & Live</h4>
            <div className="flex items-center gap-3 text-slate-400">
              <span className="w-8 h-8 rounded-full bg-[#121620] border border-[#1f2737] flex items-center justify-center hover:text-white cursor-pointer">🎮</span>
              <span className="w-8 h-8 rounded-full bg-[#121620] border border-[#1f2737] flex items-center justify-center hover:text-white cursor-pointer">💬</span>
              <span className="w-8 h-8 rounded-full bg-[#121620] border border-[#1f2737] flex items-center justify-center hover:text-white cursor-pointer">🌐</span>
            </div>
            <div className="text-[10px] text-slate-600 font-mono">
              MULTI-MATCH™ • All rights reserved
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
