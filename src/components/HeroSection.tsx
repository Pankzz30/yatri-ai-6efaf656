import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Sparkles, ArrowRight, MapPin, Clock, Wallet, ChevronDown } from "lucide-react";

/* ── India map SVG (stylised outline with animated paths) ─────── */
const IndiaMap = () => (
  <svg viewBox="0 0 400 500" fill="none" className="w-full h-full" aria-hidden="true">
    <defs>
      <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="hsl(347,77%,50%)" stopOpacity="0.15" />
        <stop offset="100%" stopColor="hsl(347,77%,50%)" stopOpacity="0" />
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Background glow */}
    <ellipse cx="200" cy="260" rx="175" ry="215" fill="url(#mapGlow)" />

    {/* India silhouette */}
    <motion.path
      d="M185 40 C195 38 215 42 228 52 C248 65 258 80 262 95 C268 118 255 130 260 148
         C268 170 288 178 295 198 C305 228 298 258 285 280 C275 298 255 308 245 328
         C235 350 238 372 228 390 C218 408 200 420 188 438 C178 452 175 465 172 478
         C165 470 155 458 148 442 C140 422 142 400 132 382 C120 362 102 355 92 335
         C80 312 85 285 88 260 C92 232 108 210 112 185 C118 155 105 132 110 108
         C118 78 148 58 168 46 Z"
      stroke="hsl(347,77%,50%)"
      strokeWidth="2.5"
      fill="hsla(347,77%,50%,0.04)"
      strokeLinejoin="round"
      filter="url(#glow)"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 2.4, ease: "easeInOut", delay: 0.7 }}
    />

    {/* Animated dashed route lines */}
    {[
      "M172 130 Q210 160 225 210",
      "M225 210 Q240 260 228 310",
      "M172 130 Q145 180 145 230",
      "M145 230 Q148 280 172 330",
    ].map((d, i) => (
      <motion.path
        key={i}
        d={d}
        stroke="hsl(347,77%,50%)"
        strokeWidth="1.5"
        strokeDasharray="4 6"
        fill="none"
        opacity="0.45"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 1.5 + i * 0.22, ease: "easeOut" }}
      />
    ))}

    {/* Location pins with pulse rings */}
    {[
      { cx: 172, cy: 130, label: "Delhi" },
      { cx: 225, cy: 210, label: "Agra" },
      { cx: 145, cy: 230, label: "Jaipur" },
      { cx: 228, cy: 310, label: "Mumbai" },
      { cx: 172, cy: 390, label: "Goa" },
    ].map(({ cx, cy, label }, i) => (
      <motion.g
        key={label}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, delay: 1.9 + i * 0.14 }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        {/* Pulse ring */}
        <motion.circle
          cx={cx} cy={cy} r={6}
          stroke="hsl(347,77%,50%)"
          strokeWidth="1"
          fill="none"
          animate={{ r: [6, 15], opacity: [0.7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.35, ease: "easeOut" }}
        />
        <circle cx={cx} cy={cy} r="5.5" fill="hsl(347,77%,50%)" opacity="0.18" />
        <circle cx={cx} cy={cy} r="3.5" fill="hsl(347,77%,50%)" />
        <circle cx={cx} cy={cy} r="1.5" fill="white" />
        <text
          x={cx + 9}
          y={cy + 4}
          fontSize="9"
          fill="hsl(347,77%,40%)"
          fontWeight="700"
          fontFamily="Inter, sans-serif"
        >
          {label}
        </text>
      </motion.g>
    ))}
  </svg>
);

/* ── Smart Search Bar ─────────────────────────────────────────── */
const SmartSearch = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [duration, setDuration] = useState("");
  const [budget, setBudget] = useState("");

  return (
    <div className="w-full rounded-2xl border border-border bg-white/90 p-2 shadow-[0_8px_40px_hsla(347,77%,50%,0.10)] backdrop-blur-sm sm:rounded-3xl">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center">

        {/* From */}
        <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5 transition-colors hover:bg-secondary/60">
          <MapPin size={14} className="shrink-0 text-primary" />
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="From (city)"
            className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/60 outline-none"
          />
        </div>

        <div className="hidden h-5 w-px bg-border sm:block" />

        {/* To */}
        <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5 transition-colors hover:bg-secondary/60">
          <MapPin size={14} className="shrink-0 text-primary" />
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="To (destination)"
            className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/60 outline-none"
          />
        </div>

        <div className="hidden h-5 w-px bg-border sm:block" />

        {/* Duration */}
        <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5 transition-colors hover:bg-secondary/60">
          <Clock size={14} className="shrink-0 text-primary" />
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full cursor-pointer appearance-none bg-transparent text-sm font-medium text-foreground outline-none"
          >
            <option value="" disabled>Duration</option>
            <option value="weekend">Weekend (2–3 days)</option>
            <option value="week">Week (5–7 days)</option>
            <option value="long">Long trip (10+ days)</option>
          </select>
        </div>

        <div className="hidden h-5 w-px bg-border sm:block" />

        {/* Budget */}
        <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5 transition-colors hover:bg-secondary/60">
          <Wallet size={14} className="shrink-0 text-primary" />
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full cursor-pointer appearance-none bg-transparent text-sm font-medium text-foreground outline-none"
          >
            <option value="" disabled>Budget</option>
            <option value="budget">Budget (₹2k–5k/day)</option>
            <option value="balanced">Balanced (₹5k–10k/day)</option>
            <option value="premium">Premium (₹10k+/day)</option>
          </select>
        </div>

        {/* CTA */}
        <Link
          to="/register"
          className="btn-glow gradient-primary flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-[0_0_28px_hsla(347,77%,50%,0.4)] active:scale-95 sm:rounded-2xl sm:px-5"
        >
          <Sparkles size={14} />
          Plan Trip
        </Link>
      </div>
    </div>
  );
};

/* ── Trust badges ────────────────────────────────────────────── */
const TrustBadge = ({ emoji, text }: { emoji: string; text: string }) => (
  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
    <span>{emoji}</span>
    {text}
  </span>
);

/* ── Main HeroSection ─────────────────────────────────────────── */
const HeroSection = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 pt-24 pb-20">

      {/* Background mesh */}
      <div className="pointer-events-none absolute inset-0 mesh-bg" />

      {/* Glow blobs */}
      <div className="pointer-events-none absolute -top-40 -left-32 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[90px]" />

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(347,77%,50%) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Two-column layout */}
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* ── LEFT: Copy ── */}
          <div className="order-2 lg:order-1">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary tracking-wide">
                <Sparkles size={11} />
                AI-Powered Indian Trip Planner
              </span>
            </motion.div>

            {/* Hindi tagline */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.12 }}
              className="mb-3"
            >
              <h1 className="text-[2.8rem] font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-6xl lg:text-[4rem]">
                <span className="block">Har Safar,</span>
                <span className="relative mt-1 block w-fit">
                  <span className="text-gradient">Ab Smart.</span>
                  {/* Animated red underline */}
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.65, ease: "easeOut", delay: 0.55 }}
                    style={{ originX: 0 }}
                    className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-primary to-[hsl(355,90%,60%)]"
                  />
                </span>
              </h1>
              <p className="mt-3 text-sm font-medium italic tracking-wide text-muted-foreground/70">
                Every journey, now smarter.
              </p>
            </motion.div>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.28 }}
              className="mb-8 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-[1.05rem]"
            >
              AI-powered personalized trip planning across India.{" "}
              <span className="font-semibold text-foreground/80">
                Budget-friendly. Nearby. Effortless.
              </span>
            </motion.p>

            {/* Smart Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
              className="mb-6"
            >
              <SmartSearch />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.54 }}
              className="mb-8 flex flex-wrap items-center gap-3"
            >
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="btn-glow gradient-primary inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all"
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
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.68 }}
              className="flex flex-wrap gap-5"
            >
              <TrustBadge emoji="🗺️" text="500+ Destinations" />
              <TrustBadge emoji="⚡" text="Plans in seconds" />
              <TrustBadge emoji="💰" text="Any budget" />
              <TrustBadge emoji="🔒" text="Free to start" />
            </motion.div>
          </div>

          {/* ── RIGHT: India map visual ── */}
          <motion.div
            className="order-1 flex items-center justify-center lg:order-2"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, ease: "easeOut", delay: 0.5 }}
          >
            <div className="relative w-64 sm:w-80 lg:w-96">
              {/* Ambient glow behind map */}
              <div className="absolute inset-0 scale-110 rounded-full bg-primary/8 blur-3xl" />

              {/* Floating stat: trips */}
              <motion.div
                className="absolute -top-4 -left-6 z-10 rounded-2xl border border-border bg-white px-3.5 py-2.5 shadow-[0_4px_20px_hsla(347,77%,50%,0.12)]"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <p className="text-xs font-bold text-foreground">✈️ 50K+ Trips</p>
                <p className="text-[10px] text-muted-foreground">planned this month</p>
              </motion.div>

              {/* Floating stat: rating */}
              <motion.div
                className="absolute -bottom-2 -right-4 z-10 rounded-2xl border border-border bg-white px-3.5 py-2.5 shadow-[0_4px_20px_hsla(347,77%,50%,0.12)]"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <p className="text-xs font-bold text-foreground">⭐ 4.9 Rating</p>
                <p className="text-[10px] text-muted-foreground">by 12K travelers</p>
              </motion.div>

              {/* Floating badge: AI Ready */}
              <motion.div
                className="absolute top-1/2 -right-8 z-10 -translate-y-1/2 rounded-2xl bg-primary px-3 py-2 shadow-lg"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <p className="text-xs font-bold text-white">🤖 AI Ready</p>
              </motion.div>

              {/* Map */}
              <IndiaMap />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#features"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground/50 transition-colors hover:text-primary"
        aria-label="Scroll down"
      >
        <span className="text-[10px] font-medium uppercase tracking-widest">Scroll</span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown size={16} />
        </motion.div>
      </motion.a>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
