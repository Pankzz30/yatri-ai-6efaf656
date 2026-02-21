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
   HOTEL / BUILDING SILHOUETTE (horizon)
───────────────────────────────────────── */
const HotelSvg = () => (
  <motion.g
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
  >
    {/* Tall building */}
    <rect x="52" y="30" width="10" height="22" rx="0.8"
      stroke="hsl(220,14%,80%)" strokeWidth="0.8" fill="none" />
    <line x1="55" y1="33" x2="55" y2="34.5" stroke="hsl(220,14%,80%)" strokeWidth="0.5" />
    <line x1="58" y1="33" x2="58" y2="34.5" stroke="hsl(220,14%,80%)" strokeWidth="0.5" />
    <line x1="55" y1="37" x2="55" y2="38.5" stroke="hsl(220,14%,80%)" strokeWidth="0.5" />
    <line x1="58" y1="37" x2="58" y2="38.5" stroke="hsl(220,14%,80%)" strokeWidth="0.5" />
    <line x1="55" y1="41" x2="55" y2="42.5" stroke="hsl(220,14%,80%)" strokeWidth="0.5" />
    <line x1="58" y1="41" x2="58" y2="42.5" stroke="hsl(220,14%,80%)" strokeWidth="0.5" />
    {/* Short building */}
    <rect x="64" y="38" width="8" height="14" rx="0.8"
      stroke="hsl(220,14%,80%)" strokeWidth="0.8" fill="none" />
    <line x1="67" y1="41" x2="67" y2="42.5" stroke="hsl(220,14%,80%)" strokeWidth="0.5" />
    <line x1="69" y1="41" x2="69" y2="42.5" stroke="hsl(220,14%,80%)" strokeWidth="0.5" />
    <line x1="67" y1="45" x2="67" y2="46.5" stroke="hsl(220,14%,80%)" strokeWidth="0.5" />
    <line x1="69" y1="45" x2="69" y2="46.5" stroke="hsl(220,14%,80%)" strokeWidth="0.5" />
    {/* Flag on tall building */}
    <line x1="57" y1="26" x2="57" y2="30" stroke="hsl(220,14%,78%)" strokeWidth="0.6" />
    <path d="M57 26 L61 27.5 L57 29" fill={ACCENT} opacity="0.35" />
  </motion.g>
);

/* ─────────────────────────────────────────
   TRAIN (mid-ground, moves slowly L→R)
   Width ≈ 60px
───────────────────────────────────────── */
const TRAIN_LOOP = 7; // seconds

const TrainSvg = () => (
  <g>
    {/* Engine */}
    <rect x="0" y="2" width="18" height="10" rx="1.5"
      stroke={STROKE} strokeWidth="0.9" fill="white" />
    {/* Chimney */}
    <rect x="3" y="-2" width="3" height="4" rx="0.6"
      stroke={STROKE} strokeWidth="0.7" fill="white" />
    {/* Cabin window */}
    <rect x="10" y="4" width="5" height="4" rx="0.8"
      stroke={ACCENT} strokeWidth="0.7" fill="none" opacity="0.6" />
    {/* Car 1 */}
    <rect x="20" y="3" width="16" height="9" rx="1.2"
      stroke={STROKE} strokeWidth="0.8" fill="white" />
    <line x1="24" y1="5" x2="24" y2="9" stroke="hsl(220,14%,82%)" strokeWidth="0.5" />
    <line x1="28" y1="5" x2="28" y2="9" stroke="hsl(220,14%,82%)" strokeWidth="0.5" />
    <line x1="32" y1="5" x2="32" y2="9" stroke="hsl(220,14%,82%)" strokeWidth="0.5" />
    {/* Car 2 */}
    <rect x="38" y="3" width="16" height="9" rx="1.2"
      stroke={STROKE} strokeWidth="0.8" fill="white" />
    <line x1="42" y1="5" x2="42" y2="9" stroke="hsl(220,14%,82%)" strokeWidth="0.5" />
    <line x1="46" y1="5" x2="46" y2="9" stroke="hsl(220,14%,82%)" strokeWidth="0.5" />
    <line x1="50" y1="5" x2="50" y2="9" stroke="hsl(220,14%,82%)" strokeWidth="0.5" />
    {/* Coupler lines */}
    <line x1="18" y1="8" x2="20" y2="8" stroke={STROKE} strokeWidth="0.6" />
    <line x1="36" y1="8" x2="38" y2="8" stroke={STROKE} strokeWidth="0.6" />
    {/* Wheels */}
    {[4, 12, 24, 32, 42, 50].map(wx => (
      <circle key={wx} cx={wx} cy="12" r="2" stroke={STROKE} strokeWidth="0.7" fill="white" />
    ))}
    {/* Red accent stripe on engine */}
    <line x1="1" y1="10" x2="17" y2="10" stroke={ACCENT} strokeWidth="0.8" opacity="0.55" />
  </g>
);

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
const TravelStoryScene = ({ className = "" }: { className?: string }) => {
  const ease = [0.4, 0.0, 0.6, 1.0] as [number,number,number,number];

  return (
    <div className={`relative w-full flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 -20 400 110"
        fill="none"
        className="w-full max-w-[440px] lg:max-w-full"
        aria-label="Car, train, airplane and hotel travel scene"
        style={{ overflow: "hidden" }}
      >
        {/* Sky */}
        <rect x="0" y="-20" width="400" height="82" fill="white" />

        {/* Rolling hills */}
        <path
          d="M0 50 Q60 36 120 50 Q180 64 240 46 Q290 30 360 46 Q380 52 400 46 L400 62 L0 62 Z"
          fill="hsl(220,14%,96%)"
        />

        {/* Hotel silhouette on horizon */}
        <HotelSvg />

        {/* Sun */}
        <circle cx="340" cy="18" r="7" stroke={ACCENT} strokeWidth="1.1" fill="none" opacity="0.32" />
        {[0,45,90,135,180,225,270,315].map(deg => {
          const r = deg * Math.PI / 180;
          return <line key={deg}
            x1={340 + 9.5*Math.cos(r)} y1={18 + 9.5*Math.sin(r)}
            x2={340 + 12*Math.cos(r)}  y2={18 + 12*Math.sin(r)}
            stroke={ACCENT} strokeWidth="0.9" strokeLinecap="round" opacity="0.25" />;
        })}

        {/* Train track (subtle dashes behind road) */}
        <line x1="0" y1="58" x2="400" y2="58" stroke="hsl(220,14%,86%)" strokeWidth="0.6" />
        <line x1="0" y1="60" x2="400" y2="60" stroke="hsl(220,14%,86%)" strokeWidth="0.6" />
        {Array.from({ length: 28 }).map((_, i) => (
          <line key={`tie-${i}`} x1={i * 15} y1="57.5" x2={i * 15} y2="60.5"
            stroke="hsl(220,14%,82%)" strokeWidth="0.5" />
        ))}

        {/* ── TRAIN — moves left→right slowly ── */}
        <motion.g
          initial={{ x: -80, y: 44 }}
          animate={{ x: 420, y: 44 }}
          transition={{
            x: {
              duration: TRAIN_LOOP,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
            },
            y: { duration: 0 },
          }}
        >
          <TrainSvg />
        </motion.g>

        {/* Road */}
        <rect x="0" y="62" width="400" height="16" fill="hsl(220,14%,93%)" />
        <line x1="0" y1="62" x2="400" y2="62" stroke={STROKE} strokeWidth="1.1" opacity="0.35" />
        {[8,55,102,149,196,243,290,337,384].map(x => (
          <line key={x} x1={x} y1="70" x2={x+20} y2="70"
            stroke="hsl(220,14%,76%)" strokeWidth="0.9" strokeLinecap="round" />
        ))}

        {/* ── AIRPLANE — flies right→left ── */}
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
