import React from "react";

export const ReachLogo: React.FC<{ size?: number; className?: string; showText?: boolean }> = ({
  size = 32,
  className = "",
  showText = false,
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Dual Interlocking Neon Triangles (Cyan & Magenta from Reach) */}
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className="overflow-visible select-none">
        <defs>
          <filter id="reachCyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="reachPinkGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="cyanTri" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0d2" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="pinkTri" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff2a6d" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
        </defs>

        {/* Left Cyan Triangle */}
        <polygon
          points="20,12 36,44 4,44"
          fill="url(#cyanTri)"
          filter="url(#reachCyanGlow)"
          opacity="0.95"
        />

        {/* Right Magenta Triangle (Interlocking & overlapping) */}
        <polygon
          points="44,12 60,44 28,44"
          fill="url(#pinkTri)"
          filter="url(#reachPinkGlow)"
          opacity="0.9"
          style={{ mixBlendMode: "screen" }}
        />

        {/* Intersection highlight */}
        <polygon
          points="28,44 36,44 32,36"
          fill="#ffffff"
          opacity="0.9"
        />
      </svg>

      {showText && (
        <span className="font-black tracking-widest text-base sm:text-lg text-white uppercase font-sans flex items-center">
          <span>MULTI-</span>
          <span className="text-[#ff2a6d] drop-shadow-[0_0_10px_rgba(255,42,109,0.7)]">MATCH</span>
        </span>
      )}
    </div>
  );
};
