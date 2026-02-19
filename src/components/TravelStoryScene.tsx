/**
 * TravelStoryScene
 * ─────────────────
 * Car drives left → right on a road.
 * Airplane flies right → left above (opposite direction).
 * 8-9 second loop, repeats infinitely.
 */

import { motion } from "framer-motion";

/* ── Design tokens ── */
const STROKE      = "hsl(220,14%,18%)";
const STROKE_SOFT = "hsla(220,14%,18%,0.28)";
const ACCENT      = "hsl(347,77%,50%)";

/* Inject wheel-spin CSS once */
const SPIN_ID = "yatri-wheel-spin";
if (typeof document !== "undefined" && !document.getElementById(SPIN_ID)) {
  const s = document.createElement("style");
  s.id = SPIN_ID;
  s.textContent = `
    @keyframes wheelSpin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    .ws {
      transform-box: fill-box;
      transform-origin: 50% 50%;
      animation: wheelSpin 0.4s linear infinite;
    }
  `;
  document.head.appendChild(s);
}

/* ── DURATION ── */
const LOOP_S = 9; // seconds per full cycle

/* ─────────────────────────────────────────
   CAR (faces right, width ≈ 108px)
───────────────────────────────────────── */
const CarSvg = () => (
  <g>
    {/* Body */}
    <path d="M2 34 L2 44 Q2 48 6 48 L106 48 Q110 48 110 44 L110 34 Z"
      stroke={STROKE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="white" />
    {/* Roof */}
    <path d="M18 34 C20 24 28 15 40 12 L76 12 C88 12 95 21 98 30 L104 34"
      stroke={STROKE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="white" />
    <path d="M98 30 L108 34" stroke={STROKE} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M18 34 L8 34"   stroke={STROKE} strokeWidth="1.6" strokeLinecap="round" />
    {/* Door crease */}
    <line x1="60" y1="34" x2="57" y2="14" stroke={STROKE_SOFT} strokeWidth="1.1" strokeLinecap="round" />
    {/* Windows */}
    <path d="M22 33 C24 24 31 15 40 13 L55 13 L53 33 Z"
      stroke={STROKE_SOFT} strokeWidth="1.2" fill="hsl(210,40%,97%)" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M65 33 L67 13 L76 13 C86 13 93 21 96 29 L94 33 Z"
      stroke={STROKE_SOFT} strokeWidth="1.2" fill="hsl(210,40%,97%)" strokeLinecap="round" strokeLinejoin="round" />
    {/* Headlight (right = front) */}
    <ellipse cx="108" cy="39" rx="4" ry="2.4" fill={ACCENT} opacity="0.85" />
    {/* Tail light */}
    <ellipse cx="4" cy="39" rx="3" ry="2" fill="hsl(0,80%,62%)" opacity="0.7" />
    {/* Rear wheel */}
    <circle cx="28" cy="48" r="9" stroke={STROKE} strokeWidth="1.6" fill="white" />
    <circle cx="28" cy="48" r="4" stroke={STROKE} strokeWidth="1.2" fill="none" />
    <g className="ws">
      <line x1="28" y1="40" x2="28" y2="56" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="21" y1="44.1" x2="35" y2="51.9" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="21" y1="51.9" x2="35" y2="44.1" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round" />
    </g>
    {/* Front wheel */}
    <circle cx="88" cy="48" r="9" stroke={STROKE} strokeWidth="1.6" fill="white" />
    <circle cx="88" cy="48" r="4" stroke={STROKE} strokeWidth="1.2" fill="none" />
    <g className="ws">
      <line x1="88" y1="40" x2="88" y2="56" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="81" y1="44.1" x2="95" y2="51.9" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="81" y1="51.9" x2="95" y2="44.1" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round" />
    </g>
  </g>
);

/* ─────────────────────────────────────────
   AIRPLANE (faces left — flying opposite to car)
   Width ≈ 70px, height ≈ 28px
───────────────────────────────────────── */
const PlaneSvg = () => (
  <g>
    {/* Fuselage */}
    <path d="M65 14 C60 14 10 12 2 14 C10 16 60 14 65 14 Z"
      stroke={STROKE} strokeWidth="1.4" fill="white" strokeLinecap="round" strokeLinejoin="round" />
    {/* Nose (faces left) */}
    <path d="M2 14 C-6 14 -10 14 -10 14" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" />
    {/* Tail fin */}
    <path d="M62 14 L68 4 L65 14" stroke={STROKE} strokeWidth="1.3" fill="white" strokeLinecap="round" strokeLinejoin="round" />
    {/* Tail stabiliser */}
    <path d="M62 14 L66 20 L63 14" stroke={STROKE} strokeWidth="1.2" fill="white" strokeLinecap="round" strokeLinejoin="round" />
    {/* Main wing */}
    <path d="M40 14 L50 2 L20 14 L50 14 Z"
      stroke={STROKE} strokeWidth="1.3" fill="hsl(210,40%,97%)" strokeLinecap="round" strokeLinejoin="round" />
    {/* Window row */}
    {[14, 22, 30, 38].map(x => (
      <rect key={x} x={x} y="11.5" width="5" height="4" rx="1.2"
        stroke={ACCENT} strokeWidth="0.9" fill="none" opacity="0.7" />
    ))}
    {/* Engine under wing */}
    <path d="M28 14 L26 18 Q30 20 34 18 L32 14"
      stroke={STROKE} strokeWidth="1.1" fill="hsl(220,14%,92%)" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
const TravelStoryScene = ({ className = "" }: { className?: string }) => {
  /*
    SVG canvas: 400 × 90
    Road at y=62. Car (wheels cy=48) at y-offset=14 → wheels on road.
    Car travels from x=-120 to x=420 (off-screen both sides).
    Plane travels from x=450 to x=-100 (opposite direction), at y≈16.
  */
  const ease = [0.4, 0.0, 0.6, 1.0] as [number,number,number,number];

  return (
    <div className={`relative w-full flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 -20 400 110"
        fill="none"
        className="w-full max-w-[440px] lg:max-w-full"
        aria-label="Car and airplane travel scene"
        style={{ overflow: "hidden" }}
      >
        {/* Sky */}
        <rect x="0" y="-20" width="400" height="82" fill="white" />

        {/* Rolling hills */}
        <path
          d="M0 50 Q60 36 120 50 Q180 64 240 46 Q290 30 360 46 Q380 52 400 46 L400 62 L0 62 Z"
          fill="hsl(220,14%,96%)"
        />

        {/* Sun */}
        <circle cx="340" cy="18" r="7" stroke={ACCENT} strokeWidth="1.1" fill="none" opacity="0.32" />
        {[0,45,90,135,180,225,270,315].map(deg => {
          const r = deg * Math.PI / 180;
          return <line key={deg}
            x1={340 + 9.5*Math.cos(r)} y1={18 + 9.5*Math.sin(r)}
            x2={340 + 12*Math.cos(r)}  y2={18 + 12*Math.sin(r)}
            stroke={ACCENT} strokeWidth="0.9" strokeLinecap="round" opacity="0.25" />;
        })}

        {/* Road */}
        <rect x="0" y="62" width="400" height="16" fill="hsl(220,14%,93%)" />
        <line x1="0" y1="62" x2="400" y2="62" stroke={STROKE} strokeWidth="1.1" opacity="0.35" />
        {[8,55,102,149,196,243,290,337,384].map(x => (
          <line key={x} x1={x} y1="70" x2={x+20} y2="70"
            stroke="hsl(220,14%,76%)" strokeWidth="0.9" strokeLinecap="round" />
        ))}

        {/* ── AIRPLANE — flies right→left, opposite to car ── */}
        <motion.g
          initial={{ x: 420, y: -12 }}
          animate={{ x: -100, y: -12 }}
          transition={{
            x: {
              duration: LOOP_S,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
            },
            y: { duration: 0 },
          }}
        >
          <PlaneSvg />
        </motion.g>

        {/* ── CAR — drives left→right ── */}
        <motion.g
          initial={{ x: -120, y: 14 }}
          animate={{ x: 420, y: 14 }}
          transition={{
            x: {
              duration: LOOP_S,
              ease: ease,
              repeat: Infinity,
              repeatType: "loop",
            },
            y: { duration: 0 },
          }}
        >
          <CarSvg />
        </motion.g>
      </svg>
    </div>
  );
};

export default TravelStoryScene;
