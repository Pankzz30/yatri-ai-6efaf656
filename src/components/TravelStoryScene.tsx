/**
 * TravelStoryScene
 * ─────────────────
 * Minimal line-art SVG travel story animation.
 *
 * Timeline (seconds):
 *   0.0 – scene fades in
 *   0.3 – person visible with suitcase
 *   1.1 – person dissolves (enters car)
 *   1.3 – wheels start spinning
 *   1.4 – car begins driving right
 *   2.8 – car settles, wheels stop
 */

import { motion, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";

/* ── Timing (ms) ── */
const T = {
  sceneIn:     100,
  personOut:   1100,
  wheelsStart: 1300,
  driveStart:  1400,
  driveEnd:    2800,
  wheelsStop:  3300,
};

/* ── Design tokens ── */
const STROKE      = "hsl(220,14%,18%)";
const STROKE_SOFT = "hsla(220,14%,18%,0.32)";
const ACCENT      = "hsl(347,77%,50%)";

/* ─────────────────────────────────────────
   WHEEL SPOKES — animated rotation
───────────────────────────────────────── */
const WheelSpokes = ({ cx, cy, spinning }: { cx: number; cy: number; spinning: boolean }) => {
  const ctrl = useAnimation();
  useEffect(() => {
    if (spinning) {
      ctrl.start({
        rotate: 360,
        transition: { duration: 0.65, repeat: Infinity, ease: "linear" },
      });
    } else {
      ctrl.stop();
    }
  }, [spinning, ctrl]);

  return (
    <motion.g style={{ originX: cx, originY: cy }} animate={ctrl}>
      {[0, 60, 120].map((deg) => {
        const r = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={cx + 3.8 * Math.cos(r)} y1={cy + 3.8 * Math.sin(r)}
            x2={cx + 8.0 * Math.cos(r)} y2={cy + 8.0 * Math.sin(r)}
            stroke={STROKE} strokeWidth="1.1" strokeLinecap="round"
          />
        );
      })}
    </motion.g>
  );
};

/* ─────────────────────────────────────────
   CAR — minimal side-view sedan
───────────────────────────────────────── */
const Car = ({ spinning }: { spinning: boolean }) => (
  <g>
    {/* Chassis / lower body */}
    <path
      d="M2 34 L2 44 Q2 48 6 48 L106 48 Q110 48 110 44 L110 34 Z"
      stroke={STROKE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="white"
    />
    {/* Roofline */}
    <path
      d="M18 34 C20 24 28 15 40 12 L76 12 C88 12 95 21 98 30 L104 34"
      stroke={STROKE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="white"
    />
    {/* Hood slope */}
    <path d="M98 30 L108 34" stroke={STROKE} strokeWidth="1.6" strokeLinecap="round" />
    {/* Trunk slope */}
    <path d="M18 34 L8 34" stroke={STROKE} strokeWidth="1.6" strokeLinecap="round" />

    {/* Door crease */}
    <line x1="60" y1="34" x2="57" y2="14"
      stroke={STROKE_SOFT} strokeWidth="1.1" strokeLinecap="round" />

    {/* Rear window */}
    <path d="M22 33 C24 24 31 15 40 13 L55 13 L53 33 Z"
      stroke={STROKE_SOFT} strokeWidth="1.2" fill="hsl(210,40%,97%)"
      strokeLinecap="round" strokeLinejoin="round" />
    {/* Front window */}
    <path d="M65 33 L67 13 L76 13 C86 13 93 21 96 29 L94 33 Z"
      stroke={STROKE_SOFT} strokeWidth="1.2" fill="hsl(210,40%,97%)"
      strokeLinecap="round" strokeLinejoin="round" />

    {/* Headlight */}
    <ellipse cx="108" cy="39" rx="4" ry="2.4" fill={ACCENT} opacity="0.82" />
    {/* Tail light */}
    <ellipse cx="4" cy="39" rx="3" ry="2" fill="hsl(0,85%,60%)" opacity="0.7" />

    {/* Rear wheel */}
    <circle cx="28" cy="48" r="9" stroke={STROKE} strokeWidth="1.6" fill="white" />
    <circle cx="28" cy="48" r="4" stroke={STROKE} strokeWidth="1.2" fill="none" />
    <WheelSpokes cx={28} cy={48} spinning={spinning} />

    {/* Front wheel */}
    <circle cx="88" cy="48" r="9" stroke={STROKE} strokeWidth="1.6" fill="white" />
    <circle cx="88" cy="48" r="4" stroke={STROKE} strokeWidth="1.2" fill="none" />
    <WheelSpokes cx={88} cy={48} spinning={spinning} />
  </g>
);

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

    {/* Suitcase */}
    <rect x="17" y="14" width="11" height="15" rx="2.2"
      stroke={ACCENT} strokeWidth="1.3" fill="none" />
    {/* Handle */}
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
   MAIN COMPONENT
───────────────────────────────────────── */
const TravelStoryScene = ({ className = "" }: { className?: string }) => {
  const [sceneVisible,   setSceneVisible]   = useState(false);
  const [personVisible,  setPersonVisible]  = useState(true);
  const [wheelsSpinning, setWheelsSpinning] = useState(false);
  const [carOffset,      setCarOffset]      = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const s = (fn: () => void, ms: number) => { timers.push(setTimeout(fn, ms)); };

    s(() => setSceneVisible(true),    T.sceneIn);
    s(() => setPersonVisible(false),  T.personOut);
    s(() => setWheelsSpinning(true),  T.wheelsStart);
    s(() => setCarOffset(115),        T.driveStart);
    s(() => setWheelsSpinning(false), T.wheelsStop);

    return () => timers.forEach(clearTimeout);
  }, []);

  const driveDuration = (T.driveEnd - T.driveStart) / 1000;

  return (
    <motion.div
      className={`relative w-full flex items-center justify-center ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: sceneVisible ? 1 : 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      {/*
        SVG canvas: 340 × 80
        Road line at y=57. Car wheels at cy=48, so car group sits on road.
        Person placed to the left of car's initial position.
      */}
      <svg
        viewBox="0 0 340 80"
        fill="none"
        className="w-full max-w-[440px] lg:max-w-full"
        aria-label="Person and car travel scene"
        style={{ overflow: "visible" }}
      >
        {/* ── LANDSCAPE (behind everything) ── */}
        {/* Rolling hills */}
        <path
          d="M0 44 Q50 30 100 44 Q150 58 200 40 Q250 24 300 40 Q320 46 340 40 L340 57 L0 57 Z"
          fill="hsl(220,14%,97%)"
        />
        {/* Sun */}
        <circle cx="298" cy="16" r="6.5" stroke={ACCENT} strokeWidth="1" fill="none" opacity="0.38" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const r = (deg * Math.PI) / 180;
          return (
            <line key={deg}
              x1={298 + 8.5 * Math.cos(r)} y1={16 + 8.5 * Math.sin(r)}
              x2={298 + 10.5 * Math.cos(r)} y2={16 + 10.5 * Math.sin(r)}
              stroke={ACCENT} strokeWidth="0.85" strokeLinecap="round" opacity="0.3"
            />
          );
        })}

        {/* ── ROAD ── */}
        {/* Road fill */}
        <rect x="0" y="57" width="340" height="14" fill="hsl(220,14%,93%)" />
        {/* Road edge line */}
        <line x1="0" y1="57" x2="340" y2="57" stroke={STROKE} strokeWidth="1.3" opacity="0.5" />
        {/* Road dashes */}
        {[10, 50, 90, 130, 170, 210, 250, 290, 330].map((x) => (
          <line key={x}
            x1={x} y1="64" x2={x + 18} y2="64"
            stroke="hsl(220,14%,76%)" strokeWidth="0.9" strokeLinecap="round"
          />
        ))}

        {/* ── PERSON — standing left of parked car ── */}
        {/* Transform so person's feet align with y=57: person height ≈33px, bottom at y=32, offset to y=24 */}
        <g transform="translate(82, 24)">
          <Person visible={personVisible} />
        </g>

        {/* ── CAR — slides right when driving ── */}
        <motion.g
          animate={{ x: carOffset }}
          transition={{
            duration: driveDuration,
            ease: [0.22, 0.0, 0.18, 1.0],
          }}
          /* Car: wheels cy=48, road y=57, so car group at y=9 aligns wheels on road */
          transform="translate(100, 9)"
        >
          <Car spinning={wheelsSpinning} />
        </motion.g>
      </svg>
    </motion.div>
  );
};

export default TravelStoryScene;
