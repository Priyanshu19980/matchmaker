import React from "react";

export const BronzeCrest: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <defs>
      <linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d97706" />
        <stop offset="50%" stopColor="#92400e" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
      <linearGradient id="bronzeBorder" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#451a03" />
      </linearGradient>
    </defs>
    {/* Outer Shield */}
    <path
      d="M24 4 L38 10 L38 24 C38 34 24 42 24 42 C24 42 10 34 10 24 L10 10 Z"
      fill="url(#bronzeGrad)"
      stroke="url(#bronzeBorder)"
      strokeWidth="2"
      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.6))"
    />
    {/* Inner Chevron Plates */}
    <path d="M16 16 L24 22 L32 16 L24 28 Z" fill="#b45309" opacity="0.8" />
    <path d="M18 24 L24 28 L30 24 L24 33 Z" fill="#f59e0b" />
    <circle cx="24" cy="22" r="2.5" fill="#fef3c7" />
  </svg>
);

export const SilverCrest: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <defs>
      <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f1f5f9" />
        <stop offset="40%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
      <linearGradient id="silverBorder" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>
    </defs>
    {/* Outer Winged Shield */}
    <path
      d="M24 3 L40 10 L39 25 C39 35 24 43 24 43 C24 43 9 35 9 25 L8 10 Z"
      fill="url(#silverGrad)"
      stroke="url(#silverBorder)"
      strokeWidth="2"
      filter="drop-shadow(0 2px 6px rgba(148,163,184,0.3))"
    />
    {/* Geometric wings */}
    <path d="M6 14 L12 12 L10 24 Z" fill="#94a3b8" />
    <path d="M42 14 L36 12 L38 24 Z" fill="#94a3b8" />
    {/* Inner Crystal Diamond */}
    <polygon points="24,12 32,22 24,34 16,22" fill="#cbd5e1" stroke="#ffffff" strokeWidth="1.2" />
    <polygon points="24,16 29,22 24,28 19,22" fill="#ffffff" />
  </svg>
);

export const GoldCrest: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <defs>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="35%" stopColor="#eab308" />
        <stop offset="70%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#854d0e" />
      </linearGradient>
      <linearGradient id="goldBorder" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fef9c3" />
        <stop offset="100%" stopColor="#713f12" />
      </linearGradient>
    </defs>
    {/* Outer Crest */}
    <path
      d="M24 2 L42 9 L40 26 C40 36 24 44 24 44 C24 44 8 36 8 26 L6 9 Z"
      fill="url(#goldGrad)"
      stroke="url(#goldBorder)"
      strokeWidth="2.2"
      filter="drop-shadow(0 0 8px rgba(234,179,8,0.4))"
    />
    {/* Double Wings */}
    <path d="M4 12 L12 9 L10 20 Z" fill="#eab308" />
    <path d="M44 12 L36 9 L38 20 Z" fill="#eab308" />
    {/* Center Star / Insignia */}
    <polygon points="24,11 27,19 35,20 29,26 31,34 24,29 17,34 19,26 13,20 21,19" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
  </svg>
);

export const DiamondCrest: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <defs>
      <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#bae6fd" />
        <stop offset="40%" stopColor="#38bdf8" />
        <stop offset="75%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#0369a1" />
      </linearGradient>
      <linearGradient id="diamondBorder" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#e0f2fe" />
        <stop offset="100%" stopColor="#075985" />
      </linearGradient>
    </defs>
    {/* Hexagonal Crystal Shield */}
    <path
      d="M24 2 L43 11 L39 28 C39 37 24 45 24 45 C24 45 9 37 9 28 L5 11 Z"
      fill="url(#diamondGrad)"
      stroke="url(#diamondBorder)"
      strokeWidth="2.2"
      filter="drop-shadow(0 0 10px rgba(56,189,248,0.5))"
    />
    {/* Faceted Crystal Layers */}
    <polygon points="24,7 36,17 31,33 24,38 17,33 12,17" fill="#0284c7" stroke="#7dd3fc" strokeWidth="1" />
    <polygon points="24,12 31,19 24,31 17,19" fill="#e0f2fe" />
  </svg>
);

export const MasterCrest: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <defs>
      <linearGradient id="masterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f5d0fe" />
        <stop offset="35%" stopColor="#c084fc" />
        <stop offset="75%" stopColor="#9333ea" />
        <stop offset="100%" stopColor="#581c87" />
      </linearGradient>
      <linearGradient id="masterBorder" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fdf4ff" />
        <stop offset="100%" stopColor="#3b0764" />
      </linearGradient>
    </defs>
    {/* Crown at top */}
    <polygon points="16,6 20,11 24,3 28,11 32,6 31,14 17,14" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
    {/* Royal Shield */}
    <path
      d="M24 10 L44 16 L40 31 C40 40 24 46 24 46 C24 46 8 40 8 31 L4 16 Z"
      fill="url(#masterGrad)"
      stroke="url(#masterBorder)"
      strokeWidth="2.2"
      filter="drop-shadow(0 0 12px rgba(168,85,247,0.6))"
    />
    {/* Inner Amethyst Shards */}
    <polygon points="24,17 33,25 24,39 15,25" fill="#7e22ce" stroke="#e9d5ff" strokeWidth="1.2" />
    <polygon points="24,21 29,26 24,34 19,26" fill="#fdf4ff" />
    <circle cx="24" cy="27" r="2" fill="#c084fc" />
  </svg>
);

export const RankCrestsGroup: React.FC<{ size?: number }> = ({ size = 34 }) => {
  return (
    <div className="inline-flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-black/60 backdrop-blur-md border border-slate-800 shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
      <div className="hover:scale-110 transition-transform cursor-pointer" title="Bronze (1000 - 1249 MMR)">
        <BronzeCrest size={size} />
      </div>
      <div className="hover:scale-110 transition-transform cursor-pointer" title="Silver (1250 - 1499 MMR)">
        <SilverCrest size={size} />
      </div>
      <div className="hover:scale-110 transition-transform cursor-pointer" title="Gold (1500 - 1799 MMR)">
        <GoldCrest size={size} />
      </div>
      <div className="hover:scale-110 transition-transform cursor-pointer" title="Diamond (1800 - 2099 MMR)">
        <DiamondCrest size={size} />
      </div>
      <div className="hover:scale-110 transition-transform cursor-pointer" title="Master / Radiant (2100+ MMR)">
        <MasterCrest size={size} />
      </div>
    </div>
  );
};
