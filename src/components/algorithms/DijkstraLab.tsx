import React, { useState, useMemo, useEffect } from "react";
import {
  runDijkstraWithDetailedTraces,
  NODE_COORDINATES,
  getAllNetworkEdgesList,
  NetworkNode,
} from "../../lib/dijkstraRouting";
import {
  ServerIcon,
  PlayIcon,
  PauseIcon,
  ActivityIcon,
  ZapIcon,
  WifiIcon,
  GitBranchIcon,
  ShieldCheckIcon,
  CrosshairIcon,
} from "../Icons";
import { ReachLogo } from "../common/ReachLogo";

// ─── Tactical Preset Scenarios ──────────────────────────────────────────────
const PRESET_SCENARIOS = [
  {
    id: "delhi",
    title: "India ISP → Delhi Edge",
    flag: "🇮🇳",
    src: "gw_india",
    tgt: "srv_delhi",
    tier: "LOCAL METRO FIBER",
    desc: "Direct dark fiber link to regional edge datacenter.",
    benchmark: "12ms",
  },
  {
    id: "singapore",
    title: "India → Singapore Edge",
    flag: "🌊",
    src: "gw_india",
    tgt: "srv_singapore",
    tier: "SUBSEA CABLE ROUTE",
    desc: "Transits Mumbai & Chennai IXP through Bay of Bengal cable.",
    benchmark: "60ms",
  },
  {
    id: "pacific",
    title: "Asia-SE → Virginia Datacenter",
    flag: "🌏",
    src: "gw_asia",
    tgt: "srv_virginia",
    tier: "TRANS-PACIFIC TRUNK",
    desc: "High-latency trans-oceanic transit to AWS US-East.",
    benchmark: "153ms",
  },
  {
    id: "atlantic",
    title: "Europe → US-East Datacenter",
    flag: "🇪🇺",
    src: "gw_eu",
    tgt: "srv_virginia",
    tier: "TRANS-ATLANTIC FIBER",
    desc: "Frankfurt → London → Atlantic Cable → Ashburn Gateway.",
    benchmark: "80ms",
  },
];

const SPEED_OPTIONS = [
  { label: "0.5×", ms: 1200 },
  { label: "1.0×", ms: 650 },
  { label: "2.0×", ms: 300 },
];

export const DijkstraLab: React.FC = () => {
  const [sourceId, setSourceId] = useState<string>("gw_india");
  const [targetId, setTargetId] = useState<string>("srv_singapore");
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedIdx, setSpeedIdx] = useState<number>(1);

  // Run Dijkstra simulation
  const { pathResult, traces, allNodes } = useMemo(() => {
    return runDijkstraWithDetailedTraces(sourceId, targetId);
  }, [sourceId, targetId]);

  // Reset playback when endpoints change
  useEffect(() => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [sourceId, targetId]);

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStepIdx((prev) => {
        if (prev >= traces.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, SPEED_OPTIONS[speedIdx].ms);

    return () => clearInterval(interval);
  }, [isPlaying, traces.length, speedIdx]);

  const activeTrace = traces[currentStepIdx] || traces[0];
  const allEdges = useMemo(() => getAllNetworkEdgesList(), []);

  // Sets for fast path lookup
  const finalPathSet = useMemo(() => new Set(pathResult.hops), [pathResult.hops]);
  const finalEdgeSet = useMemo(() => {
    const s = new Set<string>();
    for (let i = 0; i < pathResult.hops.length - 1; i++) {
      const u = pathResult.hops[i];
      const v = pathResult.hops[i + 1];
      s.add(`${u}--${v}`);
      s.add(`${v}--${u}`);
    }
    return s;
  }, [pathResult.hops]);

  // Node styles
  const getNodeVisual = (type: NetworkNode["type"]) => {
    switch (type) {
      case "player_gateway":
        return {
          fill: "#0284c7",
          stroke: "#38bdf8",
          glow: "rgba(56, 189, 248, 0.4)",
          tag: "GATEWAY",
          icon: "🌐",
        };
      case "transit_router":
        return {
          fill: "#7c3aed",
          stroke: "#c084fc",
          glow: "rgba(192, 132, 252, 0.4)",
          tag: "IXP TRANSIT",
          icon: "⚡",
        };
      case "edge_server":
        return {
          fill: "#059669",
          stroke: "#34d399",
          glow: "rgba(52, 211, 153, 0.4)",
          tag: "EDGE SERVER",
          icon: "🖥",
        };
    }
  };

  const isCompleted = currentStepIdx === traces.length - 1;
  const progressPercent = Math.round(((currentStepIdx + 1) / traces.length) * 100);

  return (
    <div className="space-y-6 select-none font-sans pb-12">
      {/* =========================================================================
          COMMAND HEADER: Global Latency Routing & Fiber Operations
          ========================================================================= */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0a0d14] via-[#0f1422] to-[#0a0d14] border border-cyan-500/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.12)] overflow-hidden">
        {/* Background Tactical Grid & Scanner Radar */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(6, 182, 212, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.15) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121620] border border-[#00f0d2]/40 text-[#00f0d2] text-xs font-mono font-bold tracking-wider">
              <ReachLogo size={14} />
              STAGE 4: NETWORK INFRASTRUCTURE ROUTING
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
              <span>Dijkstra Shortest Path</span>
              <span className="text-[#00f0d2] drop-shadow-[0_0_12px_rgba(0,240,210,0.5)]">
                Routing Lab
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Computes single-source shortest latency paths across 15 physical backbone nodes and 16 fiber links.
              Dynamically allocates the lowest-ping edge datacenter using a Min-Priority Queue in <span className="text-cyan-400 font-mono font-bold">O(E + V log V)</span> time complexity.
            </p>
          </div>

          {/* Telemetry Stat Badges */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <div className="px-4 py-2.5 rounded-2xl bg-black/60 border border-cyan-500/30 text-center shadow-inner">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Complexity</span>
              <span className="text-cyan-400 font-black text-sm">O(E + V log V)</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-black/60 border border-emerald-500/30 text-center shadow-inner">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Optimal Latency</span>
              <span className="text-emerald-400 font-black text-sm">{pathResult.shortestDistanceMs}ms Ping</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-black/60 border border-orange-500/30 text-center shadow-inner">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Route Hops</span>
              <span className="text-orange-400 font-black text-sm">{pathResult.hops.length} Nodes</span>
            </div>
          </div>
        </div>

        {/* Preset Scenario Cards */}
        <div className="relative z-10 pt-5">
          <div className="flex items-center gap-2 mb-3">
            <CrosshairIcon size={14} className="text-orange-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Quick Test Scenarios:
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PRESET_SCENARIOS.map((preset) => {
              const isSelected = sourceId === preset.src && targetId === preset.tgt;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSourceId(preset.src);
                    setTargetId(preset.tgt);
                  }}
                  className={`p-3.5 rounded-2xl text-left border transition-all relative overflow-hidden group ${
                    isSelected
                      ? "bg-gradient-to-br from-orange-950/80 to-slate-900 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)] scale-[1.02]"
                      : "bg-black/50 border-white/5 hover:border-white/20 hover:bg-slate-900/40"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-base">{preset.flag}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? "bg-orange-500 text-black font-black"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {preset.benchmark}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">
                    {preset.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{preset.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================================
          CONTROLLER DECK: Source, Target, & Step Playback Toolbar
          ========================================================================= */}
      <div className="bg-[#0b0e14]/90 border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs backdrop-blur-md shadow-xl">
        {/* Source & Target Gateway Pickers */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-xl border border-white/5">
            <span className="text-[10px] text-cyan-400 uppercase font-bold">SOURCE:</span>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="bg-transparent text-cyan-300 font-bold focus:outline-none cursor-pointer"
            >
              <option value="gw_india" className="bg-slate-950 text-white">🇮🇳 India Central ISP Gateway</option>
              <option value="gw_asia" className="bg-slate-950 text-white">🌏 Southeast Asia Gateway</option>
              <option value="gw_eu" className="bg-slate-950 text-white">🇪🇺 Europe Central Gateway</option>
              <option value="gw_na" className="bg-slate-950 text-white">🌎 US East Fiber Gateway</option>
            </select>
          </div>

          <span className="text-slate-600 font-black">→</span>

          <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-xl border border-white/5">
            <span className="text-[10px] text-emerald-400 uppercase font-bold">DESTINATION:</span>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="bg-transparent text-emerald-300 font-bold focus:outline-none cursor-pointer"
            >
              <option value="srv_delhi" className="bg-slate-950 text-white">Delhi Central (Edge-01)</option>
              <option value="srv_mumbai" className="bg-slate-950 text-white">Mumbai-1 (AWS Central)</option>
              <option value="srv_singapore" className="bg-slate-950 text-white">Singapore-1 (Asia-SE)</option>
              <option value="srv_frankfurt" className="bg-slate-950 text-white">Frankfurt-1 (EU-Central)</option>
              <option value="srv_virginia" className="bg-slate-950 text-white">Virginia-1 (US-East)</option>
            </select>
          </div>
        </div>

        {/* Playback & Speed Deck */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentStepIdx(0)}
            className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 flex items-center justify-center transition-all"
            title="Reset to Step 0"
          >
            ⏮
          </button>
          <button
            onClick={() => setCurrentStepIdx((p) => Math.max(0, p - 1))}
            disabled={currentStepIdx === 0}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 disabled:opacity-40 transition-all font-bold"
          >
            ◀ Step
          </button>

          {/* Primary Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-6 py-2 rounded-full font-black flex items-center gap-2 shadow-lg transition-all text-xs ${
              isPlaying
                ? "reach-btn-pink"
                : "reach-btn-cyan"
            }`}
          >
            {isPlaying ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
            <span>{isPlaying ? "PAUSE" : isCompleted ? "REPLAY" : "PLAY NOW"}</span>
          </button>

          <button
            onClick={() => setCurrentStepIdx((p) => Math.min(traces.length - 1, p + 1))}
            disabled={isCompleted}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 disabled:opacity-40 transition-all font-bold"
          >
            Step ▶
          </button>
          <button
            onClick={() => setCurrentStepIdx(traces.length - 1)}
            className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 flex items-center justify-center transition-all"
            title="Jump to Final Shortest Path"
          >
            ⏭
          </button>

          {/* Speed Pills */}
          <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/5 ml-1">
            {SPEED_OPTIONS.map((spd, idx) => (
              <button
                key={spd.label}
                onClick={() => setSpeedIdx(idx)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                  speedIdx === idx
                    ? "bg-cyan-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {spd.label}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-slate-400 font-bold ml-2">
            Step <span className="text-cyan-400">{currentStepIdx + 1}</span> / {traces.length}
          </span>
        </div>
      </div>

      {/* =========================================================================
          LIVE STEP NARRATION & RELAXATION MATHEMATICAL DISPLAY
          ========================================================================= */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-950 via-[#0c121e] to-slate-950 border border-cyan-500/30 p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
          </span>
          <div>
            <div className="text-[10px] text-cyan-400 uppercase font-black">
              EXECUTION TRACE — STEP #{activeTrace.step} ({progressPercent}% Complete)
            </div>
            <div className="text-white text-xs sm:text-sm font-semibold mt-0.5">
              {activeTrace.description}
            </div>
          </div>
        </div>

        {/* Relaxation Formula Box */}
        {activeTrace.neighborEvaluated && (
          <div
            className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-bold ${
              activeTrace.relaxed
                ? "bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                : "bg-slate-900 border-slate-700 text-slate-400"
            }`}
          >
            <span>
              dist[{activeTrace.neighborEvaluated}] = min({activeTrace.oldDistance === Infinity ? "∞" : `${activeTrace.oldDistance}ms`}, {activeTrace.currentDistance} + {activeTrace.edgeWeight}ms) = {activeTrace.newDistance}ms
            </span>
            {activeTrace.relaxed ? (
              <span className="text-emerald-400 font-black">✓ RELAXED</span>
            ) : (
              <span className="text-slate-500">✗ UNCHANGED</span>
            )}
          </div>
        )}
      </div>

      {/* =========================================================================
          TACTICAL TOPOLOGY MAP: High-Contrast World Internet Backbone Canvas
          ========================================================================= */}
      <div className="relative rounded-3xl bg-[#070a10] border border-cyan-500/20 p-6 shadow-2xl overflow-hidden">
        {/* Header with Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <ActivityIcon size={16} className="text-cyan-400" />
            <span className="font-mono font-bold text-sm text-white uppercase tracking-wider">
              Physical Internet Topology Graph
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-sky-500 border border-sky-300 shadow-[0_0_8px_#38bdf8]" />
              <span className="text-slate-300">Player Gateway</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-500 border border-purple-300 shadow-[0_0_8px_#c084fc]" />
              <span className="text-slate-300">Core IXP Transit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300 shadow-[0_0_8px_#34d399]" />
              <span className="text-slate-300">Edge Server</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-1 bg-orange-500 rounded-full shadow-[0_0_8px_#ff7a00]" />
              <span className="text-orange-400 font-bold">Shortest Path</span>
            </div>
          </div>
        </div>

        {/* SVG Tactical Graph */}
        <div className="w-full overflow-x-auto py-4 flex justify-center">
          <svg
            width="880"
            height="500"
            viewBox="0 0 880 500"
            className="select-none max-w-full drop-shadow-2xl"
          >
            <defs>
              {/* Shortest Path Glow */}
              <filter id="dijkstraShortestGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              {/* Active Evaluation Pulse */}
              <filter id="evaluatingLinkGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              {/* Background Tactical Grid Pattern */}
              <pattern id="tacticalGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="0.8" fill="#334155" />
              </pattern>
            </defs>

            {/* Grid Backdrop */}
            <rect width="880" height="500" fill="url(#tacticalGrid)" rx="16" />

            {/* 1. Network Fiber Edges */}
            {allEdges.map((edge) => {
              const uCoord = NODE_COORDINATES[edge.u];
              const vCoord = NODE_COORDINATES[edge.v];
              if (!uCoord || !vCoord) return null;

              const isShortestPathEdge = finalEdgeSet.has(`${edge.u}--${edge.v}`);
              const isBeingEvaluated =
                (activeTrace.currentNodeId === edge.u && activeTrace.neighborEvaluated === edge.v) ||
                (activeTrace.currentNodeId === edge.v && activeTrace.neighborEvaluated === edge.u);

              // Midpoint for latency badge
              const midX = (uCoord.x + vCoord.x) / 2;
              const midY = (uCoord.y + vCoord.y) / 2;

              let strokeColor = "#1e293b";
              let strokeWidth = 1.5;
              let filter = undefined;

              if (isBeingEvaluated) {
                strokeColor = "#facc15"; // Neon Yellow when relaxing
                strokeWidth = 3.5;
                filter = "url(#evaluatingLinkGlow)";
              } else if (isShortestPathEdge) {
                strokeColor = "#ff7a00"; // Neon Orange when on optimal Dijkstra path
                strokeWidth = 3.5;
                filter = "url(#dijkstraShortestGlow)";
              }

              return (
                <g key={`${edge.u}-${edge.v}`}>
                  {/* Outer glow line for active paths */}
                  {(isShortestPathEdge || isBeingEvaluated) && (
                    <line
                      x1={uCoord.x}
                      y1={uCoord.y}
                      x2={vCoord.x}
                      y2={vCoord.y}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth + 4}
                      strokeOpacity="0.25"
                    />
                  )}

                  {/* Primary Cable Line */}
                  <line
                    x1={uCoord.x}
                    y1={uCoord.y}
                    x2={vCoord.x}
                    y2={vCoord.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={isBeingEvaluated ? "6 4" : isShortestPathEdge ? "8 4" : undefined}
                    filter={filter}
                    className={isBeingEvaluated ? "animate-pulse" : ""}
                  />

                  {/* Latency Tag Badge */}
                  <rect
                    x={midX - 16}
                    y={midY - 10}
                    width="32"
                    height="18"
                    rx="5"
                    fill="#020617"
                    stroke={isShortestPathEdge ? "#ff7a00" : isBeingEvaluated ? "#facc15" : "#334155"}
                    strokeWidth="1.2"
                  />
                  <text
                    x={midX}
                    y={midY + 3}
                    textAnchor="middle"
                    fill={isShortestPathEdge ? "#fdba74" : isBeingEvaluated ? "#fef08a" : "#94a3b8"}
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {edge.latency}ms
                  </text>
                </g>
              );
            })}

            {/* 2. Vertices / Nodes */}
            {allNodes.map((node) => {
              const coord = NODE_COORDINATES[node.id];
              if (!coord) return null;

              const visual = getNodeVisual(node.type);
              const isSource = node.id === sourceId;
              const isTarget = node.id === targetId;
              const isCurrentVisited = activeTrace.currentNodeId === node.id;
              const isNeighborEvaluated = activeTrace.neighborEvaluated === node.id;
              const isSettled = activeTrace.visitedSnapshot.includes(node.id);
              const isFinalPathNode = finalPathSet.has(node.id);

              const currentDistance = activeTrace.distancesSnapshot[node.id];

              let nodeRadius = 18;
              if (isCurrentVisited || isSource || isTarget) nodeRadius = 22;

              return (
                <g key={node.id} className="cursor-pointer group">
                  {/* Pulsing Beacon for currently extracted node */}
                  {isCurrentVisited && (
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r="34"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2"
                      opacity="0.7"
                      className="animate-ping"
                    />
                  )}

                  {/* Outer Selection Halo */}
                  {(isSource || isTarget) && (
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r={nodeRadius + 7}
                      fill="none"
                      stroke={isSource ? "#38bdf8" : "#34d399"}
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />
                  )}

                  {/* Main Node Hexagon/Circle */}
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r={nodeRadius}
                    fill={isCurrentVisited ? visual.fill : isSettled ? "#090d16" : "#040711"}
                    stroke={
                      isCurrentVisited
                        ? "#38bdf8"
                        : isNeighborEvaluated
                        ? "#facc15"
                        : isFinalPathNode
                        ? "#ff7a00"
                        : visual.stroke
                    }
                    strokeWidth={isFinalPathNode || isCurrentVisited ? 3 : 1.8}
                    style={{
                      filter: isCurrentVisited
                        ? "drop-shadow(0 0 10px rgba(56,189,248,0.7))"
                        : isFinalPathNode
                        ? "drop-shadow(0 0 8px rgba(255,122,0,0.6))"
                        : undefined,
                    }}
                  />

                  {/* Source / Target Flag Labels */}
                  {isSource && (
                    <text
                      x={coord.x}
                      y={coord.y - 28}
                      textAnchor="middle"
                      fill="#38bdf8"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      [START SOURCE]
                    </text>
                  )}
                  {isTarget && (
                    <text
                      x={coord.x}
                      y={coord.y - 28}
                      textAnchor="middle"
                      fill="#34d399"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      [TARGET SERVER]
                    </text>
                  )}

                  {/* Icon */}
                  <text
                    x={coord.x}
                    y={coord.y + 4}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {visual.icon}
                  </text>

                  {/* Node Name */}
                  <text
                    x={coord.x}
                    y={coord.y + 32}
                    textAnchor="middle"
                    fill={isFinalPathNode ? "#ffffff" : "#94a3b8"}
                    fontSize="10"
                    fontFamily="sans-serif"
                    fontWeight={isFinalPathNode ? "bold" : "normal"}
                  >
                    {node.name.split(" ")[0]}
                  </text>

                  {/* Current Settled Distance */}
                  <text
                    x={coord.x}
                    y={coord.y + 44}
                    textAnchor="middle"
                    fill={
                      currentDistance === Infinity
                        ? "#475569"
                        : isFinalPathNode
                        ? "#ff7a00"
                        : "#38bdf8"
                    }
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {currentDistance === Infinity ? "∞" : `${currentDistance}ms`}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* =========================================================================
          TELEMETRY & ALGORITHMIC INSPECTION DASHBOARD (3 High-Tech Columns)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        {/* Column 1: Min-Priority Queue (Heap) */}
        <div className="p-5 rounded-3xl bg-[#0a0d14] border border-white/10 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h3 className="font-bold text-white flex items-center gap-2">
              <ZapIcon size={14} className="text-cyan-400" />
              Min-Priority Queue (Heap)
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
              {activeTrace.priorityQueueSnapshot.length} in Heap
            </span>
          </div>

          <p className="text-[11px] text-slate-400 font-sans">
            Extract-Min extracts the lowest unsettled distance node in <code className="text-cyan-400 font-bold">O(log V)</code> time.
          </p>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {activeTrace.priorityQueueSnapshot.length > 0 ? (
              activeTrace.priorityQueueSnapshot.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    idx === 0
                      ? "bg-gradient-to-r from-cyan-950/80 to-slate-900 border-cyan-500 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                      : "bg-black/50 border-white/5 text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        idx === 0 ? "bg-cyan-500 text-slate-950 font-black" : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    <span className="font-bold">{item.id}</span>
                  </div>
                  <span className="font-black text-emerald-400">{item.dist}ms</span>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                Heap Empty — All Reachable Nodes Settled
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Distance Table (dist[v]) */}
        <div className="p-5 rounded-3xl bg-[#0a0d14] border border-white/10 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h3 className="font-bold text-white flex items-center gap-2">
              <GitBranchIcon size={14} className="text-emerald-400" />
              Distance Table (dist[v])
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
              {activeTrace.visitedSnapshot.length} / {allNodes.length} Settled
            </span>
          </div>

          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {allNodes.map((node) => {
              const d = activeTrace.distancesSnapshot[node.id];
              const isVisited = activeTrace.visitedSnapshot.includes(node.id);
              const isCurrent = activeTrace.currentNodeId === node.id;

              return (
                <div
                  key={node.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    isCurrent
                      ? "bg-sky-950/80 border-sky-500 text-sky-200"
                      : isVisited
                      ? "bg-slate-900/60 border-white/10 text-slate-300"
                      : "bg-black/40 border-white/5 text-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isVisited ? "bg-emerald-400 shadow-[0_0_6px_#34d399]" : "bg-slate-700"
                      }`}
                    />
                    <span className="font-bold">{node.id}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">{node.region}</span>
                    <span
                      className={`font-black ${
                        d === Infinity
                          ? "text-slate-600"
                          : d < 30
                          ? "text-emerald-400"
                          : "text-amber-400"
                      }`}
                    >
                      {d === Infinity ? "∞" : `${d}ms`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 3: Reconstructed Optimal Route & Math Proof */}
        <div className="p-5 rounded-3xl bg-[#0a0d14] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h3 className="font-bold text-white flex items-center gap-2">
              <ServerIcon size={14} className="text-orange-400" />
              Optimal Route Solution
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-950 text-orange-300 border border-orange-800 font-black">
              {pathResult.shortestDistanceMs}ms Optimal
            </span>
          </div>

          {/* Reconstructed Path */}
          <div className="p-3.5 rounded-2xl bg-black/60 border border-white/5 space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Global Fiber Route:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {pathResult.hops.map((hop, idx) => (
                <React.Fragment key={hop}>
                  <span className="px-2.5 py-1 rounded-xl bg-orange-950/80 border border-orange-500/50 text-orange-200 font-bold text-xs shadow-sm">
                    {hop}
                  </span>
                  {idx < pathResult.hops.length - 1 && (
                    <span className="text-slate-600 font-bold">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Mathematical Proof Guarantee */}
          <div className="p-3.5 rounded-2xl bg-black/60 border border-white/5 space-y-2 text-[11px] text-slate-300 font-sans">
            <div className="font-bold text-white font-mono flex items-center gap-1.5">
              <ShieldCheckIcon size={14} className="text-emerald-400" />
              Mathematical Invariant:
            </div>
            <p className="leading-relaxed text-slate-400">
              Because all fiber link weights w(u,v) ≥ 0, once node u is extracted from the Min-Heap, its distance dist[u] is proven globally optimal and will never be relaxed again.
            </p>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[10px] text-cyan-300">
              dist[v] = min(dist[v], dist[u] + weight(u, v))
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
