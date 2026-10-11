// Reusable peach SVG components matching the PeachWeb logo

export function PeachIcon({ size = 40, uid = '0' }) {
  // uid keeps gradient/clipPath IDs unique when multiple icons appear on one page
  const gId = `pw-grad-${uid}`
  const cId = `pw-clip-${uid}`
  const h = Math.round(size * 1.15)

  return (
    <svg width={size} height={h} viewBox="0 0 100 115" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={gId} cx="38%" cy="30%" r="70%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor="#F5AC6A" />
          <stop offset="40%"  stopColor="#E8853D" />
          <stop offset="100%" stopColor="#C96420" />
        </radialGradient>
        <clipPath id={cId}>
          <ellipse cx="50" cy="65" rx="44" ry="46" />
        </clipPath>
      </defs>

      {/* ── Peach body ── */}
      <ellipse cx="50" cy="65" rx="44" ry="46" fill={`url(#${gId})`} />

      {/* ── Globe-grid overlay, clipped to body ── */}
      <g clipPath={`url(#${cId})`} stroke="rgba(255,255,255,0.26)" strokeWidth="1.1" fill="none">
        {/* horizontal parallels */}
        <line x1="6"  y1="42" x2="94" y2="42" />
        <line x1="6"  y1="53" x2="94" y2="53" />
        <line x1="6"  y1="65" x2="94" y2="65" />
        <line x1="6"  y1="77" x2="94" y2="77" />
        <line x1="6"  y1="89" x2="94" y2="89" />
        <line x1="6"  y1="101" x2="94" y2="101" />
        {/* curved meridians */}
        <path d="M50 19 Q50 65 50 111" />
        <path d="M50 19 Q65 65 50 111" />
        <path d="M50 19 Q35 65 50 111" />
        <path d="M50 19 Q80 65 50 111" />
        <path d="M50 19 Q20 65 50 111" />
        <path d="M50 19 Q93 65 50 111" />
        <path d="M50 19 Q7  65 50 111" />
      </g>

      {/* ── Highlight ── */}
      <ellipse
        cx="34" cy="47" rx="17" ry="12"
        fill="rgba(255,255,255,0.27)"
        transform="rotate(-22 34 47)"
      />

      {/* ── Stem ── */}
      <line x1="50" y1="13" x2="50" y2="22" stroke="#5C3317" strokeWidth="3" strokeLinecap="round" />

      {/* ── Left leaf ── */}
      <path d="M49 19 C46 11 35 7 29 13 C37 13 45 17 49 19Z" fill="#56A040" />
      <path d="M49 19 C43 14 36 11 29 13" stroke="#3A7A25" strokeWidth="0.9" fill="none" />

      {/* ── Right leaf ── */}
      <path d="M51 19 C54 11 65 7 71 13 C63 13 55 17 51 19Z" fill="#3D8A2A" />
      <path d="M51 19 C57 14 64 11 71 13" stroke="#2A6A1A" strokeWidth="0.9" fill="none" />
    </svg>
  )
}

// Full horizontal logo: peach icon + "PeachWeb" serif text
export function PeachLogoFull({ iconSize = 36, textColor = '#A3431D', className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <PeachIcon size={iconSize} uid="logo" />
      <span
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontWeight: '700',
          fontSize: iconSize * 0.78 + 'px',
          color: textColor,
          letterSpacing: '-0.01em',
          lineHeight: 1,
        }}
      >
        PeachWeb
      </span>
    </div>
  )
}
