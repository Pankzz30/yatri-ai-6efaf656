/**
 * TravelStoryScene
 * ─────────────────
 * Minimal line-art SVG travel story animation.
 *
 * Key fixes vs previous version:
 * - motion.g must NOT have a static SVG "transform" attribute —
 *   framer-motion uses CSS transforms which conflict with SVG transform attr.
 *   Instead we use framer-motion's `initial` prop for the base offset.
 * - Wheel rotation uses CSS animation (keyframes) not framer-motion,
 *   because SVG transform-origin in framer-motion requires special handling.
 */

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

/* ── Timing (ms, relative to when startSignal fires) ── */
const T = {
  personOut:   2000,
  wheelsStart: 2200,
  driveStart:  2400,
  driveEnd:    4000,
  wheelsStop:  4600,
};

/* ── Design tokens ── */
const STROKE      = "hsl(220,14%,18%)";
const STROKE_SOFT = "hsla(220,14%,18%,0.32)";
const ACCENT      = "hsl(347,77%,50%)";

/* ─────────────────────────────────────────────────────
   CSS keyframe for wheel rotation — injected once
───────────────────────────────────────────────────── */
const SPIN_STYLE_ID = "yatri-wheel-spin";
if (typeof document !== "undefined" && !document.getElementById(SPIN_STYLE_ID)) {
  const style = document.createElement("style");
  style.id = SPIN_STYLE_ID;
  style.textContent = `
    @keyframes wheelSpin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    .wheel-spin {
      transform-box: fill-box;
      transform-origin: center;
      animation: wheelSpin 0.55s linear infinite;
    }
  `;
  document.head.appendChild(style);
}

/* ─────────────────────────────────────────
   PERSON — stick figure with suitcase
───────────────────────────────────────── */
const Person = ({ visible }: { visible: boolean }) => (
  <motion.g
    initial={{ opacity: 1 }}
    animate={{ opacity: visible ? 1 : 0 }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
  >
    {/* Head */}
    <circle cx="8" cy="5" r="4.5" stroke={STROKE} strokeWidth="1.4" fill="white" />
    {/* Body */}
    <line x1="8" y1="9.5" x2="8" y2="22" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" />
    {/* Left arm (toward suitcase) */}
    <path d="M8 13 L16 17" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" />
    {/* Right arm */}
    <path d="M8 13 L2 18" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" />
    {/* Legs */}
    <path d="M8 22 L4 32" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" />
    <path d="M8 22 L12 32" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" />

    {/* Suitcase body */}
    <rect x="17" y="14" width="11" height="15" rx="2.2"
      stroke={ACCENT} strokeWidth="1.3" fill="none" />
    {/* Suitcase handle */}
    <path d="M20 14 L20 11 L25 11 L25 14"
      stroke={ACCENT} strokeWidth="1.2" fill="none" strokeLinecap="round" />
    {/* Stripe */}
    <line x1="17" y1="21" x2="28" y2="21" stroke={ACCENT} strokeWidth="0.9" />
    {/* Wheels */}
    <circle cx="19.5" cy="29" r="1.2" stroke={STROKE} strokeWidth="1" fill="none" />
    <circle cx="25.5" cy="29" r="1.2" stroke={STROKE} strokeWidth="1" fill="none" />
  </motion.g>
);

/* ─────────────────────────────────────────
   CAR — minimal side-view sedan (pure SVG, no motion inside)
   Wheel spokes use CSS class for rotation.
───────────────────────────────────────── */
const Car = ({ spinning }: { spinning: boolean }) => (
  <g>
    {/* Chassis */}
    <path
      d="M2 34 L2 44 Q2 48 6 48 L106 48 Q110 48 110 44 L110 34 Z"
      stroke={STROKE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="white"
    />
    {/* Roofline */}
    <path
      d="M18 34 C20 24 28 15 40 12 L76 12 C88 12 95 21 98 30 L104 34"
      stroke={STROKE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="white"
    />
    <path d="M98 30 L108 34" stroke={STROKE} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M18 34 L8 34"  stroke={STROKE} strokeWidth="1.6" strokeLinecap="round" />

    {/* Door crease */}
    <line x1="60" y1="34" x2="57" y2="14"
      stroke={STROKE_SOFT} strokeWidth="1.1" strokeLinecap="round" />

    {/* Windows */}
    <path d="M22 33 C24 24 31 15 40 13 L55 13 L53 33 Z"
      stroke={STROKE_SOFT} strokeWidth="1.2" fill="hsl(210,40%,97%)"
      strokeLinecap="round" strokeLinejoin="round" />
    <path d="M65 33 L67 13 L76 13 C86 13 93 21 96 29 L94 33 Z"
      stroke={STROKE_SOFT} strokeWidth="1.2" fill="hsl(210,40%,97%)"
      strokeLinecap="round" strokeLinejoin="round" />

    {/* Headlight */}
    <ellipse cx="108" cy="39" rx="4" ry="2.4" fill={ACCENT} opacity="0.82" />
    {/* Tail light */}
    <ellipse cx="4"   cy="39" rx="3" ry="2"   fill="hsl(0,85%,60%)" opacity="0.7" />

    {/* ── Rear wheel ── */}
    <circle cx="28" cy="48" r="9" stroke={STROKE} strokeWidth="1.6" fill="white" />
    <circle cx="28" cy="48" r="4" stroke={STROKE} strokeWidth="1.2" fill="none" />
    {/* Rear spokes — use CSS class for spin */}
    <g className={spinning ? "wheel-spin" : undefined}
       style={{ transformOrigin: "28px 48px" }}>
      {[0, 60, 120].map((deg) => {
        const r = (deg * Math.PI) / 180;
        return (
          <line key={deg}
            x1={28 + 4 * Math.cos(r)} y1={48 + 4 * Math.sin(r)}
            x2={28 + 8 * Math.cos(r)} y2={48 + 8 * Math.sin(r)}
            stroke={STROKE} strokeWidth="1.2" strokeLinecap="round"
          />
        );
      })}
    </g>

    {/* ── Front wheel ── */}
    <circle cx="88" cy="48" r="9" stroke={STROKE} strokeWidth="1.6" fill="white" />
    <circle cx="88" cy="48" r="4" stroke={STROKE} strokeWidth="1.2" fill="none" />
    <g className={spinning ? "wheel-spin" : undefined}
       style={{ transformOrigin: "88px 48px" }}>
      {[0, 60, 120].map((deg) => {
        const r = (deg * Math.PI) / 180;
        return (
          <line key={deg}
            x1={88 + 4 * Math.cos(r)} y1={48 + 4 * Math.sin(r)}
            x2={88 + 8 * Math.cos(r)} y2={48 + 8 * Math.sin(r)}
            stroke={STROKE} strokeWidth="1.2" strokeLinecap="round"
          />
        );
      })}
    </g>
  </g>
);

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
const TravelStoryScene = ({
  className = "",
  startSignal = true,
}: {
  className?: string;
  startSignal?: boolean;
}) => {
  const [sceneVisible,   setSceneVisible]   = useState(false);
  const [personVisible,  setPersonVisible]  = useState(true);
  const [wheelsSpinning, setWheelsSpinning] = useState(false);
  // carX: how far the car has moved from its initial SVG position
  const [carX, setCarX] = useState(0);

  const hasStarted = useState(false);

  useEffect(() => {
    if (!startSignal || hasStarted[0]) return;
    hasStarted[1](true);

    const timers: ReturnType<typeof setTimeout>[] = [];
    const s = (fn: () => void, ms: number) => { timers.push(setTimeout(fn, ms)); };

    setSceneVisible(true);
    s(() => setPersonVisible(false),  T.personOut);
    s(() => setWheelsSpinning(true),  T.wheelsStart);
    s(() => setCarX(160),             T.driveStart);
    s(() => setWheelsSpinning(false), T.wheelsStop);

    return () => timers.forEach(clearTimeout);
  }, [startSignal]); // eslint-disable-line react-hooks/exhaustive-deps

  const driveDuration = (T.driveEnd - T.driveStart) / 1000;

  return (
    <motion.div
      className={`relative w-full flex items-center justify-center ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: sceneVisible ? 1 : 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      {/*
        Layout in SVG coords (viewBox 400×90):
          Road at y=62.
          Person: translate(10, 30) → feet at y=62. Spans x 10–41.
          Car parked: translate(60, 14) puts wheels(cy=48) at y=62.
            Car body x: 2–110, so SVG x: 62–170.
          Car drives +160 → final SVG x: 222–330 (centred in 400w canvas).
      */}
      <svg
        viewBox="0 0 400 90"
        fill="none"
        className="w-full max-w-[440px] lg:max-w-full"
        aria-label="Person and car travel scene"
        style={{ overflow: "visible" }}
      >
        {/* Sky */}
        <rect x="0" y="0" width="400" height="62" fill="white" />

        {/* Rolling hills */}
        <path
          d="M0 50 Q60 36 120 50 Q180 64 240 46 Q290 30 360 46 Q380 52 400 46 L400 62 L0 62 Z"
          fill="hsl(220,14%,96%)"
        />

        {/* Sun */}
        <circle cx="360" cy="20" r="7" stroke={ACCENT} strokeWidth="1.1" fill="none" opacity="0.35" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <line key={deg}
              x1={360 + 9.5 * Math.cos(rad)} y1={20 + 9.5 * Math.sin(rad)}
              x2={360 + 12  * Math.cos(rad)} y2={20 + 12  * Math.sin(rad)}
              stroke={ACCENT} strokeWidth="0.9" strokeLinecap="round" opacity="0.28"
            />
          );
        })}

        {/* Road fill */}
        <rect x="0" y="62" width="400" height="16" fill="hsl(220,14%,93%)" />
        {/* Road edge */}
        <line x1="0" y1="62" x2="400" y2="62" stroke={STROKE} strokeWidth="1.2" opacity="0.4" />
        {/* Road dashes */}
        {[8, 55, 102, 149, 196, 243, 290, 337, 384].map((x) => (
          <line key={x}
            x1={x} y1="70" x2={x + 20} y2="70"
            stroke="hsl(220,14%,76%)" strokeWidth="0.9" strokeLinecap="round"
          />
        ))}

        {/* ── PERSON — static <g>, no motion attrs → no conflict ── */}
        <g transform="translate(10, 30)">
          <Person visible={personVisible} />
        </g>

        {/*
          ── CAR ──
          CRITICAL: use framer-motion's `initial` for the base position
          instead of the SVG `transform` attribute. Mixing SVG transform
          attr + framer CSS transform causes the "stuck" bug.
          initial={{ x:60, y:14 }} sets the starting position correctly.
        */}
        <motion.g
          initial={{ x: 60, y: 14 }}
          animate={{ x: 60 + carX, y: 14 }}
          transition={{
            x: { duration: driveDuration, ease: [0.22, 0.0, 0.18, 1.0] },
            y: { duration: 0 },
          }}
        >
          <Car spinning={wheelsSpinning} />
        </motion.g>
      </svg>
    </motion.div>
  );
};

export default TravelStoryScene;
