import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Bus, Train, Plane, Hotel, MapPin, Calendar, Users, ArrowLeftRight, ChevronDown, ArrowRight,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────
   MONSOON WAVE BACKGROUND
───────────────────────────────────────────────────────────────── */
const MonsoonWaves = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <svg viewBox="0 0 1440 560" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="wg1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(347,77%,50%)" stopOpacity="0.012" />
          <stop offset="50%" stopColor="hsl(347,77%,50%)" stopOpacity="0.022" />
          <stop offset="100%" stopColor="hsl(347,77%,50%)" stopOpacity="0.006" />
        </linearGradient>
      </defs>
      <motion.path
        d="M-200 200 C100 160 300 240 600 200 C900 160 1100 240 1440 200 C1740 160 1900 240 2080 200 L2080 280 C1900 320 1740 240 1440 280 C1100 320 900 240 600 280 C300 320 100 240 -200 280 Z"
        fill="url(#wg1)"
        animate={{ x: [0, -300, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   MONUMENT SVGs
───────────────────────────────────────────────────────────────── */
const TajMahal = () => (
  <svg viewBox="0 0 400 240" fill="none" className="w-full h-full" aria-hidden="true">
    <g stroke="hsl(347,77%,50%)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.55">
      <motion.path d="M200 175 C200 155 200 150 200 150 C200 122 180 92 200 72 C220 92 200 122 200 150"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease: "easeInOut", delay: 0.1 }} />
      <motion.path d="M162 175 C162 138 146 115 165 98 C175 88 189 82 200 72 C211 82 225 88 235 98 C254 115 238 138 238 175"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.4, ease: "easeInOut", delay: 0.35 }} />
      <motion.path d="M120 175 L120 130 C120 118 116 112 120 106 C124 112 120 118 120 130"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: "easeInOut", delay: 0.7 }} />
      <motion.path d="M116 106 C116 99 118 95 120 92 C122 95 124 99 124 106"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 1.1 }} />
      <motion.path d="M280 175 L280 130 C280 118 276 112 280 106 C284 112 280 118 280 130"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: "easeInOut", delay: 0.8 }} />
      <motion.path d="M276 106 C276 99 278 95 280 92 C282 95 284 99 284 106"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 1.2 }} />
      <motion.path d="M140 175 L260 175 M134 182 L266 182 M126 189 L274 189"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: "easeInOut", delay: 1.5 }} />
      <motion.path d="M148 175 L148 145 C148 132 155 124 162 120 C169 116 180 114 200 114 C220 114 231 116 238 120 C245 124 252 132 252 145 L252 175"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 1.1 }} />
    </g>
  </svg>
);

const GatewayOfIndia = () => (
  <svg viewBox="0 0 400 240" fill="none" className="w-full h-full" aria-hidden="true">
    <g stroke="hsl(347,77%,50%)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.55">
      <motion.path d="M152 185 L152 128 C152 100 168 84 200 84 C232 84 248 100 248 128 L248 185"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.4, ease: "easeInOut" }} />
      <motion.path d="M166 185 L166 136 C166 112 179 100 200 100 C221 100 234 112 234 136 L234 185"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.4 }} />
      <motion.path d="M114 185 L114 120 C114 114 117 109 122 106 L152 106"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: "easeInOut", delay: 0.6 }} />
      <motion.path d="M286 185 L286 120 C286 114 283 109 278 106 L248 106"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: "easeInOut", delay: 0.7 }} />
      <motion.path d="M108 120 C108 108 112 101 114 96 C116 101 120 108 120 120"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 1.1 }} />
      <motion.path d="M280 120 C280 108 284 101 286 96 C288 101 292 108 292 120"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 1.2 }} />
      <motion.path d="M108 120 L292 120 M110 128 L290 128"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeInOut", delay: 1.4 }} />
      <motion.path d="M96 185 L304 185 M90 192 L310 192"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut", delay: 1.8 }} />
    </g>
  </svg>
);

const IndiaGate = () => (
  <svg viewBox="0 0 400 240" fill="none" className="w-full h-full" aria-hidden="true">
    <g stroke="hsl(347,77%,50%)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.55">
      <motion.path d="M158 185 L158 130 C158 104 172 88 200 82 C228 88 242 104 242 130 L242 185"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.4, ease: "easeInOut" }} />
      <motion.path d="M172 185 L172 138 C172 116 182 103 200 98 C218 103 228 116 228 138 L228 185"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.35 }} />
      <motion.path d="M148 88 L252 88 L252 80 L148 80 Z"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut", delay: 0.8 }} />
      <motion.path d="M195 80 L195 66 C195 60 197 56 200 52 C203 56 205 60 205 66 L205 80"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 1.1 }} />
      <motion.path d="M198 52 C198 46 199 42 200 39 C201 42 202 46 202 52"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeInOut", delay: 1.4 }} />
      <motion.path d="M110 185 L290 185 M102 192 L298 192 M94 199 L306 199"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeInOut", delay: 1.6 }} />
    </g>
  </svg>
);

const monuments = [
  { id: "taj", Component: TajMahal },
  { id: "gateway", Component: GatewayOfIndia },
  { id: "indiagate", Component: IndiaGate },
];

const MonumentCycle = () => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % monuments.length), 6000);
    return () => clearInterval(t);
  }, []);
  const { Component } = monuments[current];
  return (
    <div className="relative w-full max-w-md h-44 sm:h-52 mx-auto">
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
  );
};

/* ─────────────────────────────────────────────────────────────────
   CATEGORY TABS
───────────────────────────────────────────────────────────────── */
type Category = "bus" | "train" | "flight" | "hotels";

const CATEGORIES: { id: Category; label: string; Icon: React.ElementType }[] = [
  { id: "bus",    label: "Bus",    Icon: Bus   },
  { id: "train",  label: "Train",  Icon: Train  },
  { id: "flight", label: "Flight", Icon: Plane  },
  { id: "hotels", label: "Hotels", Icon: Hotel  },
];

/* ─────────────────────────────────────────────────────────────────
   FIELD ROW — reusable tappable row
───────────────────────────────────────────────────────────────── */
const FieldRow = ({
  icon: Icon,
  label,
  placeholder,
  type = "text",
}: {
  icon: React.ElementType;
  label: string;
  placeholder: string;
  type?: string;
}) => (
  <div className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/40 cursor-pointer group">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
      <Icon size={16} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">{label}</p>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-0.5 w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/45 outline-none"
      />
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   BOOKING CARD — dynamic per category
───────────────────────────────────────────────────────────────── */
const BookingCard = ({ category }: { category: Category }) => {
  const [swapped, setSwapped] = useState(false);

  const fromLabel = swapped ? "To" : "From";
  const toLabel   = swapped ? "From" : "To";

  const renderFields = () => {
    if (category === "bus" || category === "train") {
      return (
        <>
          <FieldRow icon={MapPin} label={fromLabel} placeholder="Origin city" />
          <div className="relative mx-5 flex items-center">
            <div className="flex-1 border-t border-border/60" />
            <button
              onClick={() => setSwapped((s) => !s)}
              className="mx-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-white shadow-sm text-primary transition-all hover:scale-110 hover:border-primary/40 active:scale-95"
            >
              <ArrowLeftRight size={13} />
            </button>
            <div className="flex-1 border-t border-border/60" />
          </div>
          <FieldRow icon={MapPin} label={toLabel} placeholder="Destination city" />
          <div className="mx-5 border-t border-border/60" />
          <FieldRow icon={Calendar} label="Date" placeholder="Select date" type="date" />
          {category === "train" && (
            <>
              <div className="mx-5 border-t border-border/60" />
              <div className="flex items-center gap-4 px-5 py-4 hover:bg-secondary/40 cursor-pointer">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
                  <Users size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Class</p>
                  <select className="mt-0.5 w-full bg-transparent text-sm font-medium text-foreground outline-none cursor-pointer appearance-none">
                    <option value="">Select class</option>
                    <option>Sleeper (SL)</option>
                    <option>3rd AC (3A)</option>
                    <option>2nd AC (2A)</option>
                    <option>1st AC (1A)</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </>
      );
    }

    if (category === "flight") {
      return (
        <>
          <FieldRow icon={MapPin} label={swapped ? "To" : "From"} placeholder="Origin airport" />
          <div className="relative mx-5 flex items-center">
            <div className="flex-1 border-t border-border/60" />
            <button
              onClick={() => setSwapped((s) => !s)}
              className="mx-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-white shadow-sm text-primary transition-all hover:scale-110 hover:border-primary/40 active:scale-95"
            >
              <ArrowLeftRight size={13} />
            </button>
            <div className="flex-1 border-t border-border/60" />
          </div>
          <FieldRow icon={MapPin} label={swapped ? "From" : "To"} placeholder="Destination airport" />
          <div className="mx-5 border-t border-border/60" />
          <div className="grid grid-cols-2">
            <div className="border-r border-border/60">
              <FieldRow icon={Calendar} label="Departure" placeholder="Select date" type="date" />
            </div>
            <FieldRow icon={Calendar} label="Return" placeholder="Optional" type="date" />
          </div>
          <div className="mx-5 border-t border-border/60" />
          <FieldRow icon={Users} label="Passengers" placeholder="1 Adult" />
        </>
      );
    }

    // Hotels
    return (
      <>
        <FieldRow icon={MapPin} label="City" placeholder="Where are you going?" />
        <div className="mx-5 border-t border-border/60" />
        <div className="grid grid-cols-2">
          <div className="border-r border-border/60">
            <FieldRow icon={Calendar} label="Check-in" placeholder="Add date" type="date" />
          </div>
          <FieldRow icon={Calendar} label="Check-out" placeholder="Add date" type="date" />
        </div>
        <div className="mx-5 border-t border-border/60" />
        <FieldRow icon={Users} label="Guests" placeholder="2 Adults · 1 Room" />
      </>
    );
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={category}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="w-full rounded-2xl border border-border/70 bg-white shadow-[0_4px_32px_rgba(0,0,0,0.07)] overflow-hidden"
      >
        {renderFields()}

        {/* CTA */}
        <div className="px-5 py-4">
          <Link
            to="/register"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:scale-[1.03] hover:shadow-[0_6px_24px_hsla(347,77%,50%,0.30)] active:scale-[0.98]"
          >
            {category === "bus" && "Search Buses"}
            {category === "train" && "Search Trains"}
            {category === "flight" && "Search Flights"}
            {category === "hotels" && "Search Hotels"}
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─────────────────────────────────────────────────────────────────
   CATEGORY TABS BAR
───────────────────────────────────────────────────────────────── */
const CategoryTabs = ({
  active,
  onChange,
}: {
  active: Category;
  onChange: (c: Category) => void;
}) => (
  <div className="w-full rounded-2xl border border-border/60 bg-white shadow-sm overflow-hidden mb-3">
    <div className="grid grid-cols-4">
      {CATEGORIES.map(({ id, label, Icon }) => {
        const isActive = id === active;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`relative flex flex-col items-center justify-center gap-1.5 py-4 text-xs font-semibold transition-all hover:scale-[1.04] ${
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
            <span>{label}</span>
            {isActive && (
              <motion.span
                layoutId="tab-underline"
                className="absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 380, damping: 34 }}
              />
            )}
          </button>
        );
      })}
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────────────────────────────── */
const HeroSection = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const [category, setCategory] = useState<Category>("bus");

  return (
    <>
      {/* ── Sticky category tabs — fixed below navbar ── */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-border/60 shadow-sm">
        <div className="mx-auto max-w-md px-4">
          <CategoryTabs active={category} onChange={setCategory} />
        </div>
      </div>

      <section className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden bg-background px-4 pt-36 pb-20">

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
        <div className="pointer-events-none absolute -top-56 -left-44 h-[480px] w-[480px] rounded-full bg-primary/[0.022] blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-44 -right-44 h-[400px] w-[400px] rounded-full bg-primary/[0.022] blur-[100px]" />

        {/* ── Content ── */}
        <div className="relative z-10 mx-auto w-full max-w-md">

          {/* Monument + tagline */}
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0, ease: "easeOut", delay: 0.2 }}
          >
            <MonumentCycle />

            <motion.h1
              className="mt-3 text-[1.7rem] sm:text-[2.1rem] font-extrabold leading-tight tracking-tight text-foreground whitespace-nowrap"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.9 }}
            >
              Har Safar,{" "}
              <span className="relative inline-block text-primary">
                Ab Smart.
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-[2.5px] rounded-full bg-primary"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.65, ease: "easeOut", delay: 1.3 }}
                  style={{ originX: 0 }}
                />
              </span>
            </motion.h1>
          </motion.div>

          {/* Booking form — below monument + tagline */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.8 }}
          >
            <BookingCard category={category} />
          </motion.div>

          {!isAuthenticated && (
            <motion.div
              className="mt-6 flex justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 1.1 }}
            >
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 rounded-2xl border border-primary/25 px-6 py-2.5 text-sm font-semibold text-primary transition-all hover:border-primary/45 hover:bg-primary/5"
              >
                Explore Destinations
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          )}
        </div>

      {/* Scroll indicator */}
      <motion.a
        href="#features"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground/35 transition-colors hover:text-primary/60"
        aria-label="Scroll down"
      >
        <span className="text-[9px] font-medium uppercase tracking-widest">Scroll</span>
        <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown size={14} />
        </motion.div>
      </motion.a>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
    </>
  );
};

export default HeroSection;
