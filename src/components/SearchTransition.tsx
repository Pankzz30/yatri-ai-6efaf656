import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type TransportType = "bus" | "train" | "flight" | "hotels";

interface SearchTransitionProps {
  active: boolean;
  type: TransportType;
  onComplete: () => void;
  duration?: number;
}

const LOADING_TEXTS: Record<TransportType, string[]> = {
  bus: [
    "Finding the best buses for you...",
    "Scanning 500+ operators...",
    "Almost there...",
  ],
  train: [
    "Checking IRCTC for live seats...",
    "Finding fastest routes...",
    "Locking in the best fares...",
  ],
  flight: [
    "Scanning airlines for best deals...",
    "Comparing 200+ flights...",
    "Securing premium fares...",
  ],
  hotels: [
    "Finding premium stays for you...",
    "Comparing 1000+ hotels...",
    "Locking in exclusive rates...",
  ],
};

/* ── Bus: Dark highway with moving road dividers ── */
function BusAnimation() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Road */}
      <div className="absolute bottom-[38%] left-0 right-0 h-[2px] bg-white/10" />
      <div className="absolute bottom-[42%] left-0 right-0 h-[2px] bg-white/10" />

      {/* Moving road dividers */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-[2px] w-8 bg-white/30 rounded-full"
          style={{ bottom: "40%", left: `${i * 10 - 10}%` }}
          animate={{ x: [0, -200] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.07,
          }}
        />
      ))}

      {/* Bus silhouette */}
      <motion.svg
        viewBox="0 0 120 50"
        className="w-32 h-16 relative z-10"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <rect x="10" y="10" width="90" height="30" rx="6" fill="hsl(347, 77%, 50%)" opacity="0.9" />
        <rect x="15" y="14" width="14" height="12" rx="2" fill="white" opacity="0.3" />
        <rect x="33" y="14" width="14" height="12" rx="2" fill="white" opacity="0.3" />
        <rect x="51" y="14" width="14" height="12" rx="2" fill="white" opacity="0.3" />
        <rect x="69" y="14" width="14" height="12" rx="2" fill="white" opacity="0.3" />
        <rect x="87" y="14" width="10" height="18" rx="2" fill="white" opacity="0.15" />
        {/* Wheels */}
        <motion.circle cx="30" cy="42" r="5" fill="white" opacity="0.6"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle cx="80" cy="42" r="5" fill="white" opacity="0.6"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
        />
      </motion.svg>

      {/* Headlight glow */}
      <motion.div
        className="absolute w-40 h-20 rounded-full"
        style={{
          bottom: "35%",
          right: "15%",
          background: "radial-gradient(ellipse, hsla(45,90%,70%,0.15) 0%, transparent 70%)",
        }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </div>
  );
}

/* ── Flight: Airplane with animated contrail ── */
function FlightAnimation() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Contrail lines */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute h-[1px] rounded-full"
          style={{
            top: `${46 + i * 4}%`,
            right: "50%",
            width: `${30 + i * 10}%`,
            background: `linear-gradient(90deg, transparent 0%, hsla(0,0%,100%,${0.08 + i * 0.04}) 100%)`,
          }}
          initial={{ scaleX: 0, originX: 1 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.3 + i * 0.15, ease: "easeOut" }}
        />
      ))}

      {/* Airplane */}
      <motion.svg
        viewBox="0 0 80 40"
        className="w-24 h-12 relative z-10"
        initial={{ x: 200, y: 30, opacity: 0, rotate: -8 }}
        animate={{ x: 0, y: 0, opacity: 1, rotate: -3 }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Fuselage */}
        <ellipse cx="40" cy="20" rx="30" ry="5" fill="white" opacity="0.8" />
        {/* Wings */}
        <polygon points="35,18 50,5 55,18" fill="hsl(347, 77%, 50%)" opacity="0.7" />
        <polygon points="35,22 50,35 55,22" fill="hsl(347, 77%, 50%)" opacity="0.5" />
        {/* Tail */}
        <polygon points="10,18 5,8 18,18" fill="hsl(347, 77%, 50%)" opacity="0.6" />
        {/* Nose */}
        <ellipse cx="70" cy="20" rx="4" ry="3" fill="white" opacity="0.6" />
        {/* Windows */}
        {[0, 1, 2, 3, 4].map((j) => (
          <circle key={j} cx={28 + j * 7} cy="19" r="1.2" fill="hsla(200,80%,70%,0.5)" />
        ))}
      </motion.svg>

      {/* Engine glow */}
      <motion.div
        className="absolute w-32 h-8 rounded-full"
        style={{
          top: "45%",
          left: "20%",
          background: "radial-gradient(ellipse, hsla(347,77%,50%,0.2) 0%, transparent 70%)",
        }}
        animate={{ opacity: [0.4, 0.8, 0.4], scaleX: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}

/* ── Train: Moving railway tracks ── */
function TrainAnimation() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Rails */}
      <div className="absolute bottom-[38%] left-0 right-0 h-[2px] bg-white/15" />
      <div className="absolute bottom-[44%] left-0 right-0 h-[2px] bg-white/15" />

      {/* Moving sleepers */}
      {[...Array(16)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[3px] bg-white/20 rounded-full"
          style={{
            height: "14px",
            bottom: "37%",
            left: `${i * 7 - 5}%`,
          }}
          animate={{ x: [0, -160] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.04,
          }}
        />
      ))}

      {/* Train */}
      <motion.svg
        viewBox="0 0 140 50"
        className="w-36 h-14 relative z-10"
        initial={{ x: -150, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Engine */}
        <rect x="80" y="8" width="50" height="28" rx="4" fill="white" opacity="0.8" />
        <rect x="125" y="12" width="8" height="20" rx="4" fill="hsl(347, 77%, 50%)" opacity="0.8" />
        {/* Red stripe */}
        <rect x="80" y="22" width="50" height="4" fill="hsl(347, 77%, 50%)" opacity="0.9" />
        {/* Windows */}
        <rect x="86" y="12" width="8" height="8" rx="1.5" fill="hsla(200,80%,70%,0.4)" />
        <rect x="98" y="12" width="8" height="8" rx="1.5" fill="hsla(200,80%,70%,0.4)" />
        <rect x="110" y="12" width="8" height="8" rx="1.5" fill="hsla(200,80%,70%,0.4)" />
        {/* Coach */}
        <rect x="20" y="10" width="56" height="26" rx="3" fill="white" opacity="0.5" />
        <rect x="20" y="24" width="56" height="3" fill="hsl(347, 77%, 50%)" opacity="0.6" />
        {[0, 1, 2, 3, 4].map((j) => (
          <rect key={j} x={26 + j * 10} y="14" width="6" height="7" rx="1" fill="hsla(200,80%,70%,0.3)" />
        ))}
        {/* Wheels */}
        {[35, 60, 95, 118].map((cx) => (
          <motion.circle key={cx} cx={cx} cy="40" r="4" fill="white" opacity="0.5"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.4, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </motion.svg>

      {/* Sparks */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-yellow-400/60"
          style={{ bottom: "43%", left: `${45 + i * 5}%` }}
          animate={{ opacity: [0, 1, 0], y: [0, -8, -16], x: [0, -10 * (i + 1)] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

/* ── Hotel: Skyline with glowing windows ── */
function HotelAnimation() {
  const buildings = [
    { x: 10, w: 20, h: 55 },
    { x: 35, w: 25, h: 70 },
    { x: 65, w: 18, h: 50 },
    { x: 88, w: 22, h: 65 },
    { x: 115, w: 15, h: 45 },
  ];

  return (
    <div className="relative w-full h-full flex items-end justify-center overflow-hidden pb-[30%]">
      <svg viewBox="0 0 150 80" className="w-48 h-24 relative z-10">
        {buildings.map((b, i) => (
          <g key={i}>
            <motion.rect
              x={b.x}
              y={80 - b.h}
              width={b.w}
              height={b.h}
              rx="2"
              fill="white"
              opacity="0.12"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              style={{ originY: "100%" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
            />
            {/* Glowing windows */}
            {[...Array(Math.floor(b.h / 10))].map((_, r) =>
              [...Array(Math.floor(b.w / 7))].map((__, c) => (
                <motion.rect
                  key={`${r}-${c}`}
                  x={b.x + 3 + c * 7}
                  y={80 - b.h + 5 + r * 10}
                  width="3"
                  height="4"
                  rx="0.5"
                  fill="hsl(45, 90%, 70%)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.8, 0.3, 0.9, 0.5] }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: 0.5 + Math.random() * 1.5,
                  }}
                />
              ))
            )}
          </g>
        ))}
        {/* Ground line */}
        <rect x="0" y="78" width="150" height="2" fill="white" opacity="0.08" />
      </svg>

      {/* City glow */}
      <motion.div
        className="absolute w-64 h-16 rounded-full"
        style={{
          bottom: "28%",
          background: "radial-gradient(ellipse, hsla(347,77%,50%,0.12) 0%, transparent 70%)",
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </div>
  );
}

const ANIMATIONS: Record<TransportType, React.FC> = {
  bus: BusAnimation,
  train: TrainAnimation,
  flight: FlightAnimation,
  hotels: HotelAnimation,
};

export default function SearchTransition({ active, type, onComplete, duration = 2800 }: SearchTransitionProps) {
  const [textIndex, setTextIndex] = useState(0);
  const texts = LOADING_TEXTS[type];

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % texts.length);
    }, duration / texts.length);
    return () => clearInterval(interval);
  }, [active, texts, duration]);

  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(onComplete, duration);
    return () => clearTimeout(timer);
  }, [active, onComplete, duration]);

  const Animation = ANIMATIONS[type];

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Subtle background grain */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: "128px 128px",
            }}
          />

          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 60%, hsla(347,77%,50%,0.08) 0%, transparent 60%)",
            }}
          />

          {/* Brand badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8 flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-1.5 backdrop-blur-sm"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-[hsl(347,77%,50%)] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
              Yatri AI
            </span>
          </motion.div>

          {/* Transport animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative w-72 h-40"
          >
            <Animation />
          </motion.div>

          {/* Loading text */}
          <div className="mt-10 h-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={textIndex}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.4 }}
                className="text-sm font-medium tracking-wide text-white/50"
              >
                {texts[textIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Progress bar */}
          <motion.div className="mt-6 h-[2px] w-48 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[hsl(347,77%,50%)] to-[hsl(355,90%,55%)]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: duration / 1000, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Bottom streak accents */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsla(347,77%,50%,0.3)] to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
