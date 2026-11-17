import React, { useState } from "react";
import { Player, Region, PlayerRole, ExperienceLevel, REGIONS, ROLES, EXPERIENCE_LEVELS } from "../../lib/types";
import { getDUCollegiateDataset, getGlobalLadderDataset, getStarvationStressDataset, getExperience } from "../../lib/datasets";
import { PlusIcon, DownloadIcon, RefreshIcon, UsersIcon } from "../Icons";

interface PlayerPoolManagerProps {
  players: Player[];
  onUpdatePlayers: (players: Player[]) => void;
}

export const PlayerPoolManager: React.FC<PlayerPoolManagerProps> = ({ players, onUpdatePlayers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [rating, setRating] = useState(1520);
  const [ping, setPing] = useState(25);
  const [region, setRegion] = useState<Region>("India");
  const [role, setRole] = useState<PlayerRole>("Rusher");
  const [wait, setWait] = useState(42);
  const [winRate, setWinRate] = useState(58);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    const numId = 100 + players.length + Math.floor(Math.random() * 50);
    const newPlayer: Player = {
      id: `P${numId}`,
      numId,
      name: name.trim() || `Player_${numId}`,
      rating,
      ping,
      region,
      role,
      gameMode: "4v4",
      wait,
      winRate,
      experienceLevel: getExperience(rating),
    };

    onUpdatePlayers([newPlayer, ...players]);
    setShowAddForm(false);
    setName("");
  };

  const handleExportCsv = () => {
    const header = "Player ID,Name,Rating,Ping,Region,Role,GameMode,Wait,WinRate,ExperienceLevel\n";
    const rows = players
      .map(
        (p) =>
          `${p.id},"${p.name}",${p.rating},${p.ping},${p.region},${p.role},${p.gameMode},${p.wait},${p.winRate},${p.experienceLevel}`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `players_pool_${Date.now()}.csv`;
    a.click();
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(players, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `players_pool_${Date.now()}.json`;
    a.click();
  };

  const filtered = players.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRegion = regionFilter === "all" || p.region === regionFilter;
    const matchRole = roleFilter === "all" || p.role === roleFilter;
    return matchSearch && matchRegion && matchRole;
  });

  return (
    <div className="space-y-6">
      {/* Synopsis Concept Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
              ADA Synopsis • Section 6
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
              Player Pool & Datasets Platform
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Maintains the complete 9-attribute schema specified in Section 6: Player ID (P102), Skill Rating (MMR), Latency (Ping), Region, Role, Game Mode, Waiting Time, Win Rate, and Experience Level.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onUpdatePlayers(getDUCollegiateDataset())}
              className="px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 text-xs font-mono font-bold transition-all"
            >
              DU Campus Preset (32 Players)
            </button>
            <button
              onClick={() => onUpdatePlayers(getGlobalLadderDataset())}
              className="px-3 py-1.5 rounded-xl bg-indigo-950 border border-indigo-800 text-indigo-300 hover:bg-indigo-900 text-xs font-mono font-bold transition-all"
            >
              Global Ladder (48 Players)
            </button>
            <button
              onClick={() => onUpdatePlayers(getStarvationStressDataset())}
              className="px-3 py-1.5 rounded-xl bg-amber-950 border border-amber-800 text-amber-300 hover:bg-amber-900 text-xs font-mono font-bold transition-all"
            >
              Starvation Queue (Long Waits)
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <input
            type="text"
            placeholder="Search Player ID or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />

          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="all">All Regions</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="all">All Roles</option>
            {ROLES.map((ro) => (
              <option key={ro} value={ro}>{ro}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all font-mono shadow-md shadow-cyan-600/20"
          >
            <PlusIcon size={14} /> Add Player
          </button>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-medium border border-slate-700 font-mono"
          >
            <DownloadIcon size={14} /> CSV
          </button>
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-medium border border-slate-700 font-mono"
          >
            <DownloadIcon size={14} /> JSON
          </button>
        </div>
      </div>

      {/* Add Player Form Modal/Drawer */}
      {showAddForm && (
        <form onSubmit={handleAddPlayer} className="bg-slate-900 border-2 border-cyan-500/50 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <PlusIcon className="text-cyan-400" size={16} />
              Register Player into Matchmaking Queue
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-400 hover:text-white font-mono"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">Player Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priyanshu_K"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Skill Rating (MMR / Elo)</label>
              <input
                type="number"
                min={500}
                max={3000}
                value={rating}
                onChange={(e) => setRating(+e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Latency / Ping (ms)</label>
              <input
                type="number"
                min={5}
                max={250}
                value={ping}
                onChange={(e) => setPing(+e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Geographic Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as Region)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Team Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as PlayerRole)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
              >
                {ROLES.map((ro) => (
                  <option key={ro} value={ro}>{ro}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Elapsed Wait Time (s)</label>
              <input
                type="number"
                min={0}
                max={600}
                value={wait}
                onChange={(e) => setWait(+e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Win Rate (%)</label>
              <input
                type="number"
                min={10}
                max={99}
                value={winRate}
                onChange={(e) => setWinRate(+e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold p-2.5 rounded-xl transition-all shadow-md shadow-cyan-600/30"
              >
                Save to Queue
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Players Data Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Player ID</th>
                <th className="py-3 px-4 font-sans">Name</th>
                <th className="py-3 px-4">Skill (MMR)</th>
                <th className="py-3 px-4">Ping</th>
                <th className="py-3 px-4 font-sans">Region</th>
                <th className="py-3 px-4 font-sans">Role</th>
                <th className="py-3 px-4">Wait Time</th>
                <th className="py-3 px-4">Win Rate</th>
                <th className="py-3 px-4 font-sans">Experience Tier</th>
                <th className="py-3 px-4 text-right font-sans">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-cyan-400">{p.id}</td>
                  <td className="py-2.5 px-4 font-sans font-semibold text-slate-200">{p.name}</td>
                  <td className="py-2.5 px-4 font-bold text-white">{p.rating}</td>
                  <td className="py-2.5 px-4 text-emerald-400">{p.ping}ms</td>
                  <td className="py-2.5 px-4 font-sans text-slate-300">{p.region}</td>
                  <td className="py-2.5 px-4 font-sans text-cyan-300">{p.role}</td>
                  <td className="py-2.5 px-4 text-amber-400">{p.wait}s</td>
                  <td className="py-2.5 px-4 text-slate-200">{p.winRate}%</td>
                  <td className="py-2.5 px-4 font-sans">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {p.experienceLevel}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-sans">
                    <button
                      onClick={() => onUpdatePlayers(players.filter((item) => item.id !== p.id))}
                      className="text-rose-400 hover:text-rose-300"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
