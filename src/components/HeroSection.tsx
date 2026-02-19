import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { MapPin, Clock, Wallet, ChevronDown, Sparkles, ArrowRight } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────
   MONSOON WAVE BACKGROUND — very subtle, calm drift
───────────────────────────────────────────────────────────────── */
const MonsoonWaves = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <svg viewBox="0 0 1440 560" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="wg1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(347,77%,50%)" stopOpacity="0.02" />
          <stop offset="50%" stopColor="hsl(347,77%,50%)" stopOpacity="0.04" />
          <stop offset="100%" stopColor="hsl(347,77%,50%)" stopOpacity="0.01" />
        </linearGradient>
        <linearGradient id="wg2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(220,14%,7%)" stopOpacity="0.015" />
          <stop offset="60%" stopColor="hsl(347,77%,50%)" stopOpacity="0.025" />
          <stop offset="100%" stopColor="hsl(220,14%,7%)" stopOpacity="0.008" />
        </linearGradient>
      </defs>
      <motion.path
        d="M-200 200 C100 160 300 240 600 200 C900 160 1100 240 1440 200 C1740 160 1900 240 2080 200 L2080 280 C1900 320 1740 240 1440 280 C1100 320 900 240 600 280 C300 320 100 240 -200 280 Z"
        fill="url(#wg1)"
        animate={{ x: [0, -300, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M-300 340 C0 305 250 375 560 340 C870 305 1080 375 1440 340 C1800 305 1980 375 2200 340 L2200 410 C1980 445 1800 375 1440 410 C1080 445 870 375 560 410 C250 445 0 375 -300 410 Z"
        fill="url(#wg2)"
        animate={{ x: [0, 240, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   MONUMENT SVGs — thin-stroke line art, minimal
───────────────────────────────────────────────────────────────── */
const TajMahal = () => (
  <svg viewBox="0 0 280 180" fill="none" className="w-full h-full" aria-hidden="true">
    <g stroke="hsl(347,77%,50%)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.35">
      <motion.path d="M140 130 C140 118 140 115 140 115 C140 95 125 72 140 58 C155 72 140 95 140 115"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.8, ease: "easeInOut" }} />
      <motion.path d="M118 130 C118 105 108 90 120 78 C125 72 133 68 140 58 C147 68 155 72 160 78 C172 90 162 105 162 130"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }} />
      <motion.path d="M90 130 L90 95 C90 85 86 80 90 75 C94 80 90 85 90 95"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeInOut", delay: 0.5 }} />
      <motion.path d="M190 130 L190 95 C190 85 186 80 190 75 C194 80 190 85 190 95"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeInOut", delay: 0.6 }} />
      <motion.path d="M108 130 L108 110 C108 102 112 98 118 95 C124 92 132 91 140 91 C148 91 156 92 162 95 C168 98 172 102 172 110 L172 130"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: "easeInOut", delay: 0.8 }} />
      <motion.path d="M75 130 L205 130 M72 135 L208 135 M68 140 L212 140"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: "easeInOut", delay: 1.2 }} />
      <motion.path d="M98 108 C98 102 95 99 98 97 C101 99 98 102 98 108"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: "easeInOut", delay: 1.4 }} />
      <motion.path d="M182 108 C182 102 179 99 182 97 C185 99 182 102 182 108"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: "easeInOut", delay: 1.5 }} />
    </g>
  </svg>
);

const GatewayOfIndia = () => (
  <svg viewBox="0 0 280 180" fill="none" className="w-full h-full" aria-hidden="true">
    <g stroke="hsl(347,77%,50%)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.35">
      <motion.path d="M110 140 L110 100 C110 80 122 68 140 68 C158 68 170 80 170 100 L170 140"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }} />
      <motion.path d="M118 140 L118 104 C118 88 127 78 140 78 C153 78 162 88 162 104 L162 140"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: "easeInOut", delay: 0.3 }} />
      <motion.path d="M92 140 L92 98 C92 94 94 90 98 88 L110 88"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: "easeInOut", delay: 0.5 }} />
      <motion.path d="M188 140 L188 98 C188 94 186 90 182 88 L170 88"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: "easeInOut", delay: 0.6 }} />
      <motion.path d="M86 98 C86 90 89 85 92 82 C95 85 98 90 98 98"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: "easeInOut", delay: 0.9 }} />
      <motion.path d="M182 98 C182 90 185 85 188 82 C191 85 194 90 194 98"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: "easeInOut", delay: 1.0 }} />
      <motion.path d="M86 98 L194 98 M88 104 L192 104"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeInOut", delay: 1.2 }} />
      <motion.path d="M72 140 L208 140 M68 145 L212 145"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: "easeInOut", delay: 1.5 }} />
    </g>
  </svg>
);

const IndiaGate = () => (
  <svg viewBox="0 0 280 180" fill="none" className="w-full h-full" aria-hidden="true">
    <g stroke="hsl(347,77%,50%)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.35">
      <motion.path d="M115 140 L115 108 C115 88 125 74 140 70 C155 74 165 88 165 108 L165 140"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }} />
      <motion.path d="M126 140 L126 112 C126 96 132 84 140 80 C148 84 154 96 154 112 L154 140"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.7, ease: "easeInOut", delay: 0.3 }} />
      <motion.path d="M108 74 L172 74 L172 68 L108 68 Z"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: "easeInOut", delay: 0.6 }} />
      <motion.path d="M136 68 L136 60 C136 56 138 53 140 51 C142 53 144 56 144 60 L144 68"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: "easeInOut", delay: 0.9 }} />
      <motion.path d="M80 140 L200 140 M74 146 L206 146 M68 152 L212 152"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeInOut", delay: 1.3 }} />
    </g>
  </svg>
);

const monuments = [
  { id: "taj", Component: TajMahal, label: "Taj Mahal · Agra" },
  { id: "gateway", Component: GatewayOfIndia, label: "Gateway of India · Mumbai" },
  { id: "indiagate", Component: IndiaGate, label: "India Gate · Delhi" },
];

/* ─────────────────────────────────────────────────────────────────
   MONUMENT CYCLE — clean, no popups
───────────────────────────────────────────────────────────────── */
const MonumentCycle = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % monuments.length), 5500);
    return () => clearInterval(t);
  }, []);

  const { Component, label } = monuments[current];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-60 h-40 sm:w-72 sm:h-52 lg:w-80 lg:h-56">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          >
            <Component />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Label */}
      <AnimatePresence mode="wait">
        <motion.p
          key={`label-${current}`}
          className="mt-4 text-[10px] font-medium tracking-[0.18em] text-muted-foreground/50 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {label}
        </motion.p>
      </AnimatePresence>

      {/* Minimal dot indicators */}
      <div className="mt-5 flex gap-1.5">
        {monuments.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === current ? "w-5 bg-primary/60" : "w-1.5 bg-muted-foreground/20"
            }`}
            aria-label={`View ${monuments[i].label}`}
          />
        ))}
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
          className="gradient-primary flex shrink-0 items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.03] hover:shadow-[0_0_20px_hsla(347,77%,50%,0.28)] active:scale-95 sm:rounded-xl"
        >
          <Sparkles size={12} />
          Plan Trip
        </Link>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────────────────────────────── */
const HeroSection = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 pt-24 pb-20">

      {/* Waves */}
      <MonsoonWaves />

      {/* Very faint dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        aria-hidden="true"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(347,77%,50%) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Soft ambient blobs */}
      <div className="pointer-events-none absolute -top-56 -left-44 h-[520px] w-[520px] rounded-full bg-primary/[0.03] blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-44 -right-44 h-[440px] w-[440px] rounded-full bg-primary/[0.03] blur-[90px]" />

      {/* Two-column layout */}
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">

          {/* ── LEFT: Content ── */}
          <div className="order-2 lg:order-1">

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="mb-5"
            >
              <h1 className="text-[2.8rem] font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-6xl lg:text-[4.2rem]">
                <motion.span
                  className="block"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                >
                  Har Safar,
                </motion.span>

                <motion.span
                  className="relative mt-1 block w-fit text-gradient"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.32 }}
                >
                  Ab Smart.
                  {/* Animated underline */}
                  <motion.span
                    className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-primary to-[hsl(355,90%,60%)]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.65, ease: "easeOut", delay: 0.68 }}
                    style={{ originX: 0 }}
                  />
                </motion.span>
              </h1>
            </motion.div>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.52 }}
              className="mb-10 max-w-md text-base leading-relaxed text-muted-foreground"
            >
              Every journey, now smarter.
            </motion.p>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut", delay: 0.68 }}
              className="mb-7"
            >
              <SmartSearch />
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.84 }}
              className="flex flex-wrap items-center gap-3"
            >
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="gradient-primary inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/15 transition-all hover:scale-[1.03] hover:shadow-[0_6px_24px_hsla(347,77%,50%,0.30)]"
                >
                  <Sparkles size={13} />
                  Start Planning
                </Link>
              )}
              <a
                href="#destinations"
                className="group inline-flex items-center gap-2 rounded-2xl border border-primary/25 bg-transparent px-7 py-3.5 text-sm font-semibold text-primary transition-all hover:border-primary/45 hover:bg-primary/5"
              >
                Explore Destinations
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </a>
            </motion.div>
          </div>

          {/* ── RIGHT: Monument cycle ── */}
          <motion.div
            className="order-1 flex flex-col items-center justify-center lg:order-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.9 }}
          >
            <MonumentCycle />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#features"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.5 }}
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
