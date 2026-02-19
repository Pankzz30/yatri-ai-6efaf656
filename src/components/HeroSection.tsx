import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, MapPin, Clock, Wallet, ChevronDown } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────
   MONSOON WAVE BACKGROUND
   Very subtle animated SVG waves, slow horizontal drift
───────────────────────────────────────────────────────────────── */
const MonsoonWaves = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <svg
      viewBox="0 0 1440 560"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(347,77%,50%)" stopOpacity="0.03" />
          <stop offset="50%" stopColor="hsl(347,77%,50%)" stopOpacity="0.06" />
          <stop offset="100%" stopColor="hsl(347,77%,50%)" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(220,14%,7%)" stopOpacity="0.02" />
          <stop offset="60%" stopColor="hsl(347,77%,50%)" stopOpacity="0.04" />
          <stop offset="100%" stopColor="hsl(220,14%,7%)" stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {/* Wave 1 — slowest, topmost */}
      <motion.path
        d="M-200 200 C100 160 300 240 600 200 C900 160 1100 240 1440 200 C1740 160 1900 240 2080 200 L2080 280 C1900 320 1740 240 1440 280 C1100 320 900 240 600 280 C300 320 100 240 -200 280 Z"
        fill="url(#waveGrad1)"
        animate={{ x: [0, -300, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Wave 2 — medium, mid section */}
      <motion.path
        d="M-300 320 C0 285 250 355 560 320 C870 285 1080 355 1440 320 C1800 285 1980 355 2200 320 L2200 395 C1980 430 1800 360 1440 395 C1080 430 870 360 560 395 C250 430 0 360 -300 395 Z"
        fill="url(#waveGrad2)"
        animate={{ x: [0, 250, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Wave 3 — fastest, bottom section */}
      <motion.path
        d="M-100 430 C160 400 380 460 700 430 C1020 400 1200 460 1540 430 C1880 400 2000 460 2200 430 L2200 500 C2000 530 1880 470 1540 500 C1200 530 1020 470 700 500 C380 530 160 470 -100 500 Z"
        fill="url(#waveGrad1)"
        animate={{ x: [0, -180, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   MONUMENT SILHOUETTES — thin-stroke SVG line art, cycling
───────────────────────────────────────────────────────────────── */

// Taj Mahal minimal outline
const TajMahal = () => (
  <svg viewBox="0 0 280 180" fill="none" className="w-full h-full" aria-hidden="true">
    <g stroke="hsl(347,77%,50%)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.45">
      {/* Central dome */}
      <motion.path
        d="M140 130 C140 130 140 118 140 115 C140 95 125 72 140 58 C155 72 140 95 140 115"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
      />
      <motion.path
        d="M118 130 C118 105 108 90 120 78 C125 72 133 68 140 58 C147 68 155 72 160 78 C172 90 162 105 162 130"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
      />
      {/* Minarets */}
      <motion.path
        d="M90 130 L90 95 C90 85 86 80 90 75 C94 80 90 85 90 95"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.path
        d="M190 130 L190 95 C190 85 186 80 190 75 C194 80 190 85 190 95"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut", delay: 0.6 }}
      />
      {/* Arch and platform */}
      <motion.path
        d="M108 130 L108 110 C108 102 112 98 118 95 C124 92 132 91 140 91 C148 91 156 92 162 95 C168 98 172 102 172 110 L172 130"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: "easeInOut", delay: 0.8 }}
      />
      {/* Base platform */}
      <motion.path
        d="M75 130 L205 130 M72 135 L208 135 M68 140 L212 140"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: "easeInOut", delay: 1.2 }}
      />
      {/* Small domes on sides */}
      <motion.path
        d="M98 108 C98 102 95 99 98 97 C101 99 98 102 98 108"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 1.4 }}
      />
      <motion.path
        d="M182 108 C182 102 179 99 182 97 C185 99 182 102 182 108"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 1.5 }}
      />
    </g>
  </svg>
);

// Gateway of India minimal outline
const GatewayOfIndia = () => (
  <svg viewBox="0 0 280 180" fill="none" className="w-full h-full" aria-hidden="true">
    <g stroke="hsl(347,77%,50%)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.45">
      {/* Central arch */}
      <motion.path
        d="M110 140 L110 100 C110 80 122 68 140 68 C158 68 170 80 170 100 L170 140"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      {/* Arch inner */}
      <motion.path
        d="M118 140 L118 104 C118 88 127 78 140 78 C153 78 162 88 162 104 L162 140"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: "easeInOut", delay: 0.3 }}
      />
      {/* Towers */}
      <motion.path
        d="M92 140 L92 98 C92 94 94 90 98 88 L110 88"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.path
        d="M188 140 L188 98 C188 94 186 90 182 88 L170 88"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: "easeInOut", delay: 0.6 }}
      />
      {/* Tower tops with small domes */}
      <motion.path
        d="M86 98 C86 90 89 85 92 82 C95 85 98 90 98 98"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: "easeInOut", delay: 0.9 }}
      />
      <motion.path
        d="M182 98 C182 90 185 85 188 82 C191 85 194 90 194 98"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: "easeInOut", delay: 1.0 }}
      />
      {/* Decorative band */}
      <motion.path
        d="M86 98 L194 98 M88 104 L192 104"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut", delay: 1.2 }}
      />
      {/* Platform */}
      <motion.path
        d="M72 140 L208 140 M68 145 L212 145"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 1.5 }}
      />
    </g>
  </svg>
);

// India Gate minimal outline
const IndiaGate = () => (
  <svg viewBox="0 0 280 180" fill="none" className="w-full h-full" aria-hidden="true">
    <g stroke="hsl(347,77%,50%)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.45">
      {/* Main arch */}
      <motion.path
        d="M115 140 L115 108 C115 88 125 74 140 70 C155 74 165 88 165 108 L165 140"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      {/* Inner opening */}
      <motion.path
        d="M126 140 L126 112 C126 96 132 84 140 80 C148 84 154 96 154 112 L154 140"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.7, ease: "easeInOut", delay: 0.3 }}
      />
      {/* Top block / entablature */}
      <motion.path
        d="M108 74 L172 74 L172 68 L108 68 Z"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 0.6 }}
      />
      {/* Top flame / ornament */}
      <motion.path
        d="M136 68 L136 60 C136 56 138 53 140 51 C142 53 144 56 144 60 L144 68"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.9 }}
      />
      {/* Decorative bands */}
      <motion.path
        d="M110 110 L114 110 M166 110 L170 110"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 1.1 }}
      />
      {/* Wide base / platform */}
      <motion.path
        d="M80 140 L200 140 M74 146 L206 146 M68 152 L212 152"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut", delay: 1.3 }}
      />
    </g>
  </svg>
);

const monuments = [
  { id: "taj", Component: TajMahal, label: "Taj Mahal, Agra" },
  { id: "gateway", Component: GatewayOfIndia, label: "Gateway of India, Mumbai" },
  { id: "indiagate", Component: IndiaGate, label: "India Gate, Delhi" },
];

/* ─────────────────────────────────────────────────────────────────
   CYCLING MONUMENT DISPLAY
───────────────────────────────────────────────────────────────── */
const MonumentCycle = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % monuments.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const { Component, label } = monuments[current];

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Soft ambient glow */}
      <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl scale-110" />

      {/* Monument SVG with cross-fade */}
      <div className="relative w-64 h-44 sm:w-80 sm:h-56 lg:w-[22rem] lg:h-60">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <Component />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Monument label */}
      <AnimatePresence mode="wait">
        <motion.p
          key={`label-${current}`}
          className="mt-3 text-[11px] font-medium tracking-widest text-muted-foreground/60 uppercase"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {label}
        </motion.p>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="mt-4 flex gap-2">
        {monuments.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === current ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/30"
            }`}
            aria-label={`View ${monuments[i].label}`}
          />
        ))}
      </div>

      {/* Floating badges */}
      <motion.div
        className="absolute -top-3 -left-4 z-10 rounded-2xl border border-border bg-white px-3.5 py-2 shadow-[0_4px_20px_hsla(347,77%,50%,0.10)]"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="text-xs font-bold text-foreground">✈️ 50K+ Trips</p>
        <p className="text-[10px] text-muted-foreground">planned this month</p>
      </motion.div>

      <motion.div
        className="absolute -bottom-1 -right-4 z-10 rounded-2xl border border-border bg-white px-3.5 py-2 shadow-[0_4px_20px_hsla(347,77%,50%,0.10)]"
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <p className="text-xs font-bold text-foreground">⭐ 4.9 Rating</p>
        <p className="text-[10px] text-muted-foreground">by 12K travelers</p>
      </motion.div>

      <motion.div
        className="absolute top-1/2 -right-6 z-10 -translate-y-1/2 rounded-xl bg-primary px-3 py-1.5 shadow-md"
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <p className="text-[11px] font-bold text-white">🤖 AI Ready</p>
      </motion.div>
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
    <div className="w-full rounded-2xl border border-border bg-white/92 p-2 shadow-[0_8px_40px_hsla(347,77%,50%,0.08)] backdrop-blur-sm sm:rounded-3xl">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center">

        {/* From */}
        <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5 transition-colors hover:bg-secondary/60">
          <MapPin size={13} className="shrink-0 text-primary" />
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="From"
            className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/55 outline-none"
          />
        </div>

        <div className="hidden h-4 w-px bg-border sm:block" />

        {/* To */}
        <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5 transition-colors hover:bg-secondary/60">
          <MapPin size={13} className="shrink-0 text-primary" />
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Destination"
            className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/55 outline-none"
          />
        </div>

        <div className="hidden h-4 w-px bg-border sm:block" />

        {/* Duration */}
        <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5 transition-colors hover:bg-secondary/60">
          <Clock size={13} className="shrink-0 text-primary" />
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full cursor-pointer appearance-none bg-transparent text-sm font-medium text-foreground outline-none"
          >
            <option value="" disabled>Duration</option>
            <option value="weekend">Weekend (2–3 days)</option>
            <option value="week">Week (5–7 days)</option>
            <option value="long">Long (10+ days)</option>
          </select>
        </div>

        <div className="hidden h-4 w-px bg-border sm:block" />

        {/* Budget */}
        <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5 transition-colors hover:bg-secondary/60">
          <Wallet size={13} className="shrink-0 text-primary" />
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full cursor-pointer appearance-none bg-transparent text-sm font-medium text-foreground outline-none"
          >
            <option value="" disabled>Budget</option>
            <option value="budget">Budget (₹2k–5k)</option>
            <option value="balanced">Balanced (₹5k–10k)</option>
            <option value="premium">Premium (₹10k+)</option>
          </select>
        </div>

        {/* CTA */}
        <Link
          to="/register"
          className="gradient-primary flex shrink-0 items-center justify-center gap-1.5 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.03] hover:shadow-[0_0_24px_hsla(347,77%,50%,0.35)] active:scale-95 sm:rounded-2xl"
        >
          <Sparkles size={13} />
          Plan Trip
        </Link>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   TRUST BADGES
───────────────────────────────────────────────────────────────── */
const TrustBadge = ({ emoji, text }: { emoji: string; text: string }) => (
  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
    <span>{emoji}</span>
    {text}
  </span>
);

/* ─────────────────────────────────────────────────────────────────
   HERO SECTION — MAIN EXPORT
───────────────────────────────────────────────────────────────── */
const HeroSection = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 pt-24 pb-20">

      {/* ── Monsoon wave background ── */}
      <MonsoonWaves />

      {/* ── Dot grid ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        aria-hidden="true"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(347,77%,50%) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* ── Soft glow blobs ── */}
      <div className="pointer-events-none absolute -top-48 -left-40 h-[560px] w-[560px] rounded-full bg-primary/4 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[480px] w-[480px] rounded-full bg-primary/4 blur-[100px]" />

      {/* ── Two-column layout ── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">

          {/* ── LEFT: Copy ── */}
          <div className="order-2 lg:order-1">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[11px] font-semibold text-primary tracking-widest uppercase">
                <Sparkles size={10} />
                AI-Powered Indian Trip Planner
              </span>
            </motion.div>

            {/* Tagline — line 1 */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut", delay: 0.14 }}
              className="mb-2"
            >
              <h1 className="text-[2.85rem] font-extrabold leading-[1.06] tracking-tight text-foreground sm:text-6xl lg:text-[4rem]">
                <span className="block">Har Safar,</span>

                {/* Tagline line 2 — red highlight + animated underline */}
                <motion.span
                  className="relative mt-1 block w-fit"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.38 }}
                >
                  <span className="text-gradient">Ab Smart.</span>
                  <motion.span
                    className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-primary to-[hsl(355,90%,60%)]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: 0.72 }}
                    style={{ originX: 0 }}
                  />
                </motion.span>
              </h1>

              {/* English translation */}
              <motion.p
                className="mt-3 text-sm font-medium italic tracking-wide text-muted-foreground/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: 0.9 }}
              >
                Every journey, now smarter.
              </motion.p>
            </motion.div>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut", delay: 0.52 }}
              className="mb-8 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-[1.04rem]"
            >
              AI-powered personalized travel across India.{" "}
              <span className="font-semibold text-foreground/80">
                Budget-friendly. Nearby. Effortless.
              </span>
            </motion.p>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.68, ease: "easeOut", delay: 0.66 }}
              className="mb-6"
            >
              <SmartSearch />
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.82 }}
              className="mb-8 flex flex-wrap items-center gap-3"
            >
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="gradient-primary inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.03] hover:shadow-[0_8px_28px_hsla(347,77%,50%,0.35)]"
                >
                  <Sparkles size={14} />
                  Start Planning
                </Link>
              )}
              <a
                href="#destinations"
                className="group inline-flex items-center gap-2 rounded-2xl border border-primary/30 bg-white px-7 py-3.5 text-sm font-semibold text-primary transition-all hover:border-primary/50 hover:bg-primary/5"
              >
                Explore Destinations
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 1.0 }}
              className="flex flex-wrap gap-5"
            >
              <TrustBadge emoji="🗺️" text="500+ Destinations" />
              <TrustBadge emoji="⚡" text="Plans in seconds" />
              <TrustBadge emoji="💰" text="Any budget" />
              <TrustBadge emoji="🔒" text="Free to start" />
            </motion.div>
          </div>

          {/* ── RIGHT: Monument cycle ── */}
          <motion.div
            className="order-1 flex flex-col items-center justify-center lg:order-2"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, ease: "easeOut", delay: 0.8 }}
          >
            <MonumentCycle />
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.a
        href="#features"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.55 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground/45 transition-colors hover:text-primary"
        aria-label="Scroll down"
      >
        <span className="text-[9px] font-semibold uppercase tracking-widest">Scroll</span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown size={15} />
        </motion.div>
      </motion.a>

      {/* ── Bottom fade ── */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
