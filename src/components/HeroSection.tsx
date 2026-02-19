import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { MapPin, Clock, Wallet, ChevronDown, Sparkles, ArrowRight } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────
   MONSOON WAVE BACKGROUND
───────────────────────────────────────────────────────────────── */
const MonsoonWaves = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <svg viewBox="0 0 1440 560" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="wg1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(347,77%,50%)" stopOpacity="0.015" />
          <stop offset="50%" stopColor="hsl(347,77%,50%)" stopOpacity="0.03" />
          <stop offset="100%" stopColor="hsl(347,77%,50%)" stopOpacity="0.008" />
        </linearGradient>
        <linearGradient id="wg2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(220,14%,7%)" stopOpacity="0.01" />
          <stop offset="60%" stopColor="hsl(347,77%,50%)" stopOpacity="0.018" />
          <stop offset="100%" stopColor="hsl(220,14%,7%)" stopOpacity="0.005" />
        </linearGradient>
      </defs>
      <motion.path
        d="M-200 200 C100 160 300 240 600 200 C900 160 1100 240 1440 200 C1740 160 1900 240 2080 200 L2080 280 C1900 320 1740 240 1440 280 C1100 320 900 240 600 280 C300 320 100 240 -200 280 Z"
        fill="url(#wg1)"
        animate={{ x: [0, -300, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M-300 340 C0 305 250 375 560 340 C870 305 1080 375 1440 340 C1800 305 1980 375 2200 340 L2200 410 C1980 445 1800 375 1440 410 C1080 445 870 375 560 410 C250 445 0 375 -300 410 Z"
        fill="url(#wg2)"
        animate={{ x: [0, 240, 0] }}
        transition={{ duration: 36, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   MONUMENT SVGs — larger, clearly visible line art
───────────────────────────────────────────────────────────────── */
const TajMahal = () => (
  <svg viewBox="0 0 400 240" fill="none" className="w-full h-full" aria-hidden="true">
    <g stroke="hsl(347,77%,50%)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.55">
      {/* Central dome */}
      <motion.path
        d="M200 175 C200 155 200 150 200 150 C200 122 180 92 200 72 C220 92 200 122 200 150"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease: "easeInOut", delay: 0.1 }}
      />
      {/* Main arch body */}
      <motion.path
        d="M162 175 C162 138 146 115 165 98 C175 88 189 82 200 72 C211 82 225 88 235 98 C254 115 238 138 238 175"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.4, ease: "easeInOut", delay: 0.35 }}
      />
      {/* Left minaret */}
      <motion.path
        d="M120 175 L120 130 C120 118 116 112 120 106 C124 112 120 118 120 130"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: "easeInOut", delay: 0.7 }}
      />
      {/* Left minaret top */}
      <motion.path d="M116 106 C116 99 118 95 120 92 C122 95 124 99 124 106"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 1.1 }}
      />
      {/* Right minaret */}
      <motion.path
        d="M280 175 L280 130 C280 118 276 112 280 106 C284 112 280 118 280 130"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: "easeInOut", delay: 0.8 }}
      />
      {/* Right minaret top */}
      <motion.path d="M276 106 C276 99 278 95 280 92 C282 95 284 99 284 106"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 1.2 }}
      />
      {/* Platform steps */}
      <motion.path
        d="M140 175 L260 175 M134 182 L266 182 M126 189 L274 189"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: "easeInOut", delay: 1.5 }}
      />
      {/* Secondary arch details */}
      <motion.path
        d="M148 175 L148 145 C148 132 155 124 162 120 C169 116 180 114 200 114 C220 114 231 116 238 120 C245 124 252 132 252 145 L252 175"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 1.1 }}
      />
    </g>
  </svg>
);

const GatewayOfIndia = () => (
  <svg viewBox="0 0 400 240" fill="none" className="w-full h-full" aria-hidden="true">
    <g stroke="hsl(347,77%,50%)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.55">
      {/* Main arch */}
      <motion.path
        d="M152 185 L152 128 C152 100 168 84 200 84 C232 84 248 100 248 128 L248 185"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.4, ease: "easeInOut" }}
      />
      {/* Inner arch */}
      <motion.path
        d="M166 185 L166 136 C166 112 179 100 200 100 C221 100 234 112 234 136 L234 185"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.4 }}
      />
      {/* Left wing */}
      <motion.path
        d="M114 185 L114 120 C114 114 117 109 122 106 L152 106"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: "easeInOut", delay: 0.6 }}
      />
      {/* Right wing */}
      <motion.path
        d="M286 185 L286 120 C286 114 283 109 278 106 L248 106"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: "easeInOut", delay: 0.7 }}
      />
      {/* Left turret */}
      <motion.path
        d="M108 120 C108 108 112 101 114 96 C116 101 120 108 120 120"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 1.1 }}
      />
      {/* Right turret */}
      <motion.path
        d="M280 120 C280 108 284 101 286 96 C288 101 292 108 292 120"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 1.2 }}
      />
      {/* Horizontal band */}
      <motion.path
        d="M108 120 L292 120 M110 128 L290 128"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeInOut", delay: 1.4 }}
      />
      {/* Base */}
      <motion.path
        d="M96 185 L304 185 M90 192 L310 192"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut", delay: 1.8 }}
      />
    </g>
  </svg>
);

const IndiaGate = () => (
  <svg viewBox="0 0 400 240" fill="none" className="w-full h-full" aria-hidden="true">
    <g stroke="hsl(347,77%,50%)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.55">
      {/* Main arch legs */}
      <motion.path
        d="M158 185 L158 130 C158 104 172 88 200 82 C228 88 242 104 242 130 L242 185"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.4, ease: "easeInOut" }}
      />
      {/* Inner arch */}
      <motion.path
        d="M172 185 L172 138 C172 116 182 103 200 98 C218 103 228 116 228 138 L228 185"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.35 }}
      />
      {/* Top cornice */}
      <motion.path
        d="M148 88 L252 88 L252 80 L148 80 Z"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut", delay: 0.8 }}
      />
      {/* Flame / obelisk */}
      <motion.path
        d="M195 80 L195 66 C195 60 197 56 200 52 C203 56 205 60 205 66 L205 80"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 1.1 }}
      />
      {/* Flame tip */}
      <motion.path
        d="M198 52 C198 46 199 42 200 39 C201 42 202 46 202 52"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeInOut", delay: 1.4 }}
      />
      {/* Base steps */}
      <motion.path
        d="M110 185 L290 185 M102 192 L298 192 M94 199 L306 199"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeInOut", delay: 1.6 }}
      />
    </g>
  </svg>
);

const monuments = [
  { id: "taj", Component: TajMahal },
  { id: "gateway", Component: GatewayOfIndia },
  { id: "indiagate", Component: IndiaGate },
];

/* ─────────────────────────────────────────────────────────────────
   MONUMENT CYCLE — large, centered, no labels
───────────────────────────────────────────────────────────────── */
const MonumentCycle = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % monuments.length), 6000);
    return () => clearInterval(t);
  }, []);

  const { Component } = monuments[current];

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="relative w-full max-w-lg h-52 sm:h-64 lg:h-72">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          >
            <Component />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   SMART SEARCH BAR
───────────────────────────────────────────────────────────────── */
const SmartSearch = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [duration, setDuration] = useState("");
  const [budget, setBudget] = useState("");

  return (
    <div className="w-full rounded-2xl border border-border/70 bg-white/95 p-1.5 shadow-[0_4px_28px_hsla(347,77%,50%,0.07)] backdrop-blur-sm">
      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center">

        <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5 transition-colors hover:bg-secondary/50">
          <MapPin size={12} className="shrink-0 text-primary/70" />
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="From"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
          />
        </div>

        <div className="hidden h-3 w-px bg-border/60 sm:block" />

        <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5 transition-colors hover:bg-secondary/50">
          <MapPin size={12} className="shrink-0 text-primary/70" />
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Destination"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
          />
        </div>

        <div className="hidden h-3 w-px bg-border/60 sm:block" />

        <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5 transition-colors hover:bg-secondary/50">
          <Clock size={12} className="shrink-0 text-primary/70" />
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full cursor-pointer appearance-none bg-transparent text-sm text-foreground outline-none"
          >
            <option value="" disabled>Duration</option>
            <option value="weekend">Weekend (2–3 days)</option>
            <option value="week">Week (5–7 days)</option>
            <option value="long">Long (10+ days)</option>
          </select>
        </div>

        <div className="hidden h-3 w-px bg-border/60 sm:block" />

        <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5 transition-colors hover:bg-secondary/50">
          <Wallet size={12} className="shrink-0 text-primary/70" />
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full cursor-pointer appearance-none bg-transparent text-sm text-foreground outline-none"
          >
            <option value="" disabled>Budget</option>
            <option value="budget">Budget (₹2k–5k)</option>
            <option value="balanced">Balanced (₹5k–10k)</option>
            <option value="premium">Premium (₹10k+)</option>
          </select>
        </div>

        <Link
          to="/register"
          className="gradient-primary flex shrink-0 items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.03] hover:shadow-[0_0_20px_hsla(347,77%,50%,0.28)] active:scale-95"
        >
          <Sparkles size={12} />
          Plan Trip
        </Link>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   HERO SECTION — cinematic single-column
───────────────────────────────────────────────────────────────── */
const HeroSection = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 pt-24 pb-20">

      {/* Waves */}
      <MonsoonWaves />

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.012]"
        aria-hidden="true"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(347,77%,50%) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -top-56 -left-44 h-[480px] w-[480px] rounded-full bg-primary/[0.025] blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-44 -right-44 h-[400px] w-[400px] rounded-full bg-primary/[0.025] blur-[100px]" />

      {/* Content — single centered column */}
      <div className="relative z-10 mx-auto w-full max-w-3xl flex flex-col items-center text-center">

        {/* 1. Monument silhouette — primary visual */}
        <motion.div
          className="w-full mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
        >
          <MonumentCycle />
        </motion.div>

        {/* 2. Tagline */}
        <motion.h1
          className="text-[2rem] sm:text-[2.6rem] font-extrabold leading-tight tracking-tight text-foreground whitespace-nowrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.5 }}
        >
          Har Safar,{" "}
          <span className="relative inline-block text-primary">
            Ab Smart.
            <motion.span
              className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-primary"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 1.0 }}
              style={{ originX: 0 }}
            />
          </span>
        </motion.h1>

        {/* 4. Search bar */}
        <motion.div
          className="mt-8 w-full"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.95 }}
        >
          <SmartSearch />
        </motion.div>

        {/* 5. CTA buttons */}
        <motion.div
          className="mt-6 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 1.15 }}
        >
          {!isAuthenticated && (
            <Link
              to="/register"
              className="gradient-primary inline-flex items-center gap-2 rounded-2xl px-7 py-3 text-sm font-bold text-white shadow-md shadow-primary/15 transition-all hover:scale-[1.03] hover:shadow-[0_6px_24px_hsla(347,77%,50%,0.30)]"
            >
              <Sparkles size={13} />
              Start Planning
            </Link>
          )}
          <a
            href="#destinations"
            className="group inline-flex items-center gap-2 rounded-2xl border border-primary/25 bg-transparent px-7 py-3 text-sm font-semibold text-primary transition-all hover:border-primary/45 hover:bg-primary/5"
          >
            Explore Destinations
            <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#features"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground/35 transition-colors hover:text-primary/60"
        aria-label="Scroll down"
      >
        <span className="text-[9px] font-medium uppercase tracking-widest">Scroll</span>
        <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown size={14} />
        </motion.div>
      </motion.a>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
