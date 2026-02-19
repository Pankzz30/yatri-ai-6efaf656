import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Bus, Train, Plane, Hotel, MapPin, Calendar, Users, ArrowLeftRight, ChevronDown, ArrowRight,
} from "lucide-react";
import TravelStoryScene from "@/components/TravelStoryScene";

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
              className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full bg-primary"
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
            />
          )}
        </button>
      );
    })}
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────────────────────────────── */
const HeroSection = ({ isAuthenticated, sceneStartSignal }: { isAuthenticated: boolean; sceneStartSignal?: boolean }) => {
  const [category, setCategory] = useState<Category>("bus");

  return (
    <>
      {/* ── Sticky category tabs — fixed below navbar ── */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-border/60">
        <div className="container mx-auto px-6">
          <CategoryTabs active={category} onChange={setCategory} />
        </div>
      </div>

      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 pt-36 pb-20 lg:pt-28 lg:pb-16">

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
        <div className="relative z-10 mx-auto w-full max-w-md lg:max-w-6xl">

          {/* MOBILE: stacked | DESKTOP: split 2-col grid */}
          <div className="flex flex-col items-center lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">

            {/* LEFT — Travel scene + tagline */}
            <motion.div
              className="flex flex-col items-center text-center lg:items-start lg:text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0, ease: "easeOut", delay: 0.2 }}
            >
              <TravelStoryScene className="w-full h-44 sm:h-52 lg:h-60 max-w-md lg:max-w-none" />

              <motion.h1
                className="mt-3 text-[1.7rem] sm:text-[2.1rem] lg:text-[2.6rem] font-extrabold leading-tight tracking-tight text-foreground"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.9 }}
              >
                Smart Yatri.{" "}
                <span className="relative inline-block text-primary">
                  Smart Safar.
                  <motion.span
                    className="absolute -bottom-1 left-0 right-0 h-[2.5px] rounded-full bg-primary"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.65, ease: "easeOut", delay: 1.3 }}
                    style={{ originX: 0 }}
                  />
                </span>
              </motion.h1>

              <motion.p
                className="mt-4 hidden lg:block text-sm text-muted-foreground leading-relaxed max-w-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 1.1 }}
              >
                Every journey, now smarter. Plan buses, trains, flights and hotels in one place.
              </motion.p>

              {!isAuthenticated && (
                <motion.div
                  className="mt-6 hidden lg:flex"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 1.3 }}
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
            </motion.div>

            {/* RIGHT — Booking form */}
            <motion.div
              className="mt-8 w-full lg:mt-0 lg:w-[500px] lg:justify-self-end"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut", delay: 0.8 }}
            >
              <BookingCard category={category} />
            </motion.div>

          </div>

          {/* Mobile-only CTA */}
          {!isAuthenticated && (
            <motion.div
              className="mt-6 flex justify-center lg:hidden"
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
