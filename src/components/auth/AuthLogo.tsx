const AuthLogo = () => (
  <div className="flex items-center gap-2.5">
    <div className="flex items-center justify-center rounded-xl bg-[#E11D48] shadow-md shadow-red-200 overflow-hidden" style={{ width: 36, height: 36 }}>
      <svg width="22" height="14" viewBox="0 0 120 72" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round">
        {/* Chassis */}
        <path d="M10 46 L10 54 Q10 58 14 58 L106 58 Q110 58 110 54 L110 46 Z" strokeWidth="9" />
        {/* Roofline */}
        <path d="M24 46 C26 38 32 26 42 22 L78 22 C88 22 94 30 96 38 L100 46" strokeWidth="9" />
        {/* Hood */}
        <path d="M96 38 L106 46" strokeWidth="9" />
        {/* Door crease */}
        <line x1="62" y1="46" x2="58" y2="28" strokeWidth="4" stroke="rgba(255,255,255,0.55)" />
        {/* Rear window */}
        <path d="M28 45 C30 38 35 28 42 24 L56 24 L54 45 Z" strokeWidth="4" stroke="rgba(255,255,255,0.7)" />
        {/* Front window */}
        <path d="M64 45 L66 24 L78 24 C87 24 92 32 94 40 L92 45 Z" strokeWidth="4" stroke="rgba(255,255,255,0.7)" />
        {/* Rear wheel */}
        <circle cx="30" cy="58" r="9" strokeWidth="8" />
        <circle cx="30" cy="58" r="4" strokeWidth="4" />
        {/* Front wheel */}
        <circle cx="90" cy="58" r="9" strokeWidth="8" />
        <circle cx="90" cy="58" r="4" strokeWidth="4" />
        {/* Headlight */}
        <ellipse cx="108" cy="50" rx="4.5" ry="3" stroke="rgba(255,248,200,0.9)" strokeWidth="3" />
        {/* Tail light */}
        <ellipse cx="12" cy="50" rx="4" ry="2.8" stroke="rgba(255,100,100,0.85)" strokeWidth="3" />
      </svg>
    </div>
    <div>
      <span className="text-xl font-bold tracking-tight text-[#111827]">Yatri</span>
      <span className="text-xl font-bold tracking-tight text-[#E11D48]"> AI</span>
    </div>
  </div>
);

export default AuthLogo;
