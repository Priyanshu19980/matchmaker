import React from "react";

export const LandingLogo: React.FC<{ size?: number; className?: string }> = ({ size = 36, className = "" }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="logoOrangeLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff7a00" />
          <stop offset="100%" stopColor="#e14e00" />
        </linearGradient>
        <linearGradient id="logoOrangeRight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff9500" />
          <stop offset="100%" stopColor="#ff5500" />
        </linearGradient>
        <linearGradient id="logoWhiteCenter" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>

      {/* Left Wing of M */}
      <polygon points="6,50 18,14 26,14 18,50" fill="url(#logoOrangeLeft)" />

      {/* Left Incline */}
      <polygon points="18,14 32,38 38,38 26,14" fill="url(#logoWhiteCenter)" />

      {/* Right Incline */}
      <polygon points="38,38 32,38 46,14 54,14" fill="#ffffff" />

      {/* Right Wing of M */}
      <polygon points="46,14 54,14 46,50 38,50" fill="url(#logoOrangeRight)" />

      {/* Bottom Center Sharp Cut */}
      <polygon points="26,44 32,54 38,44 32,36" fill="#ff5500" />
    </svg>
  );
};
