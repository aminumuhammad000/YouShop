import React from 'react';

export const YouShopLogoIcon = ({ width = 36, height = 36, className = "" }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Main Bag Body Gradient */}
        <linearGradient id="bagGrad" x1="10" y1="30" x2="150" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="40%" stopColor="#00D2C2" />
          <stop offset="70%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#8B2BE2" />
        </linearGradient>

        {/* Yellow Swoop Gradient */}
        <linearGradient id="swoopGrad" x1="10" y1="90" x2="150" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE600" />
          <stop offset="100%" stopColor="#FF9900" />
        </linearGradient>

        {/* Handle Gradient */}
        <linearGradient id="handleGrad" x1="50" y1="10" x2="110" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFB800" />
          <stop offset="100%" stopColor="#FF7A00" />
        </linearGradient>

        {/* Drop Shadow for Bag */}
        <filter id="shadow" x="0" y="0" width="160" height="160" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#8B2BE2" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Outer Glow / Shadow */}
      <g filter="url(#shadow)">
        {/* Handles */}
        <path
          d="M 52 50 C 52 20, 70 12, 80 12 C 90 12, 108 20, 108 50"
          stroke="url(#handleGrad)"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 64 50 C 64 28, 73 22, 80 22 C 87 22, 96 28, 96 50"
          stroke="url(#handleGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />

        {/* Bag Body Base */}
        <path
          d="M 32 50 
             L 128 50 
             C 134 50, 138 54, 139 60 
             L 148 136 
             C 149 144, 143 150, 135 150 
             L 25 150 
             C 17 150, 11 144, 12 136 
             L 21 60 
             C 22 54, 26 50, 32 50 Z"
          fill="url(#bagGrad)"
        />

        {/* Diagonal Swoop Stripe across Bag */}
        <path
          d="M 12 125 
             Q 60 100, 140 55 
             L 142 67 
             Q 60 115, 16 138 
             Z"
          fill="url(#swoopGrad)"
        />

        {/* Rivets on Handles */}
        <circle cx="52" cy="50" r="4.5" fill="#FFB800" stroke="#FFF" strokeWidth="1.5" />
        <circle cx="108" cy="50" r="4.5" fill="#FFB800" stroke="#FFF" strokeWidth="1.5" />
        <circle cx="64" cy="50" r="3.5" fill="#FFB800" stroke="#FFF" strokeWidth="1.5" />
        <circle cx="96" cy="50" r="3.5" fill="#FFB800" stroke="#FFF" strokeWidth="1.5" />
      </g>
    </svg>
  );
};

export const YouShopLogo = ({ iconSize = 36, fontSize = "1.35rem", showText = true }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <YouShopLogoIcon width={iconSize} height={iconSize} />
      {showText && (
        <span style={{ fontSize, fontWeight: 800, letterSpacing: '-0.5px', fontFamily: "'Inter', system-ui, sans-serif" }}>
          <span style={{ color: '#00D5C3' }}>You</span>
          <span style={{ color: '#8B2BE2' }}>Shop</span>
        </span>
      )}
    </div>
  );
};

export default YouShopLogo;
