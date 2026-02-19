import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Bus, Train, Plane, Hotel, MapPin, Calendar, Users, ArrowLeftRight, ChevronDown, ArrowRight,
  Home, Sparkles, Shuffle, Loader2,
} from "lucide-react";
import TravelStoryScene from "@/components/TravelStoryScene";
import { useUser } from "@/context/UserContext";

/* ─────────────────────────────────────────────────────────────────
   CATEGORY TABS
───────────────────────────────────────────────────────────────── */
type Category = "home" | "bus" | "train" | "flight" | "hotels";

const CATEGORIES: { id: Category; label: string; Icon: React.ElementType }[] = [
  { id: "home",   label: "Home",   Icon: Home  },
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
const slideVariants = {
  enter: { opacity: 0, x: 18 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -14 },
};

const BookingCard = ({ category }: { category: Exclude<Category, "home"> }) => {
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
    <div className="w-full rounded-2xl border border-border/70 bg-white shadow-[0_4px_32px_rgba(0,0,0,0.07)] overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={category}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
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
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   DURATION / BUDGET / STYLE OPTIONS
───────────────────────────────────────────────────────────────── */
const DURATION_OPTS = ["2–3 days", "4–5 days", "1 week", "Custom"];
const BUDGET_OPTS   = ["Budget", "Balanced", "Premium"] as const;
const STYLE_OPTS    = ["Weekend", "Relaxed", "Adventure", "Backpacking"] as const;

const SURPRISE_PROMPTS = [
  "Plan a 4-day offbeat trip to Meghalaya for a solo nature lover",
  "Design a 5-day royal heritage tour of Rajputana on a balanced budget",
  "Craft a 3-day coastal escape to Gokarna, backpacking style",
  "Plan a 6-day family trip to Kerala backwaters, premium comfort",
  "Weekend adventure itinerary to Rishikesh including river rafting",
];

/* ─────────────────────────────────────────────────────────────────
   AI ITINERARY CARD
───────────────────────────────────────────────────────────────── */
const AIItineraryCard = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [from, setFrom] = useState(user?.preferences?.location ?? "");
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState(DURATION_OPTS[0]);
  const [budget, setBudget] = useState<typeof BUDGET_OPTS[number]>("Balanced");
  const [tripStyle, setTripStyle] = useState<typeof STYLE_OPTS[number]>("Adventure");
  const [isGenerating, setIsGenerating] = useState(false);

  const buildPrompt = () =>
    `Plan a ${duration} trip to ${destination || "India"}${from ? ` starting from ${from}` : ""}. Budget: ${budget}. Trip style: ${tripStyle}. Provide a detailed day-by-day itinerary.`;

  const handleGenerate = () => {
    if (!destination.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      navigate("/plan", { state: { prompt: buildPrompt() } });
    }, 1200);
  };

  const handleSurprise = () => {
    const pick = SURPRISE_PROMPTS[Math.floor(Math.random() * SURPRISE_PROMPTS.length)];
    setIsGenerating(true);
    setTimeout(() => {
      navigate("/plan", { state: { prompt: pick } });
    }, 1200);
  };

  return (
    <motion.div
      key="home-card"
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
      className="w-full rounded-2xl border border-border/70 bg-white shadow-[0_4px_32px_rgba(0,0,0,0.07)] overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">AI Itinerary</p>
        <h3 className="mt-0.5 text-base font-bold text-foreground leading-snug">Plan Your Perfect Journey</h3>
      </div>

      <div className="mx-5 border-t border-border/60" />

      {/* From */}
      <div className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/40">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
          <MapPin size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">From</p>
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="Your city (auto-filled)"
            className="mt-0.5 w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/45 outline-none"
          />
        </div>
      </div>

      <div className="mx-5 border-t border-border/60" />

      {/* Destination */}
      <div className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/40">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
          <MapPin size={16} strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Destination</p>
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Where do you want to go?"
            className="mt-0.5 w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/45 outline-none"
          />
        </div>
      </div>

      <div className="mx-5 border-t border-border/60" />

      {/* Duration */}
      <div className="flex items-center gap-4 px-5 py-3.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
          <Calendar size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">Duration</p>
          <div className="flex flex-wrap gap-1.5">
            {DURATION_OPTS.map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  duration === d
                    ? "bg-primary text-white shadow-sm"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-5 border-t border-border/60" />

      {/* Budget */}
      <div className="flex items-center gap-4 px-5 py-3.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
          <span className="text-xs font-black">₹</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">Budget</p>
          <div className="flex gap-1.5">
            {BUDGET_OPTS.map((b) => (
              <button
                key={b}
                onClick={() => setBudget(b)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  budget === b
                    ? "bg-primary text-white shadow-sm"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-5 border-t border-border/60" />

      {/* Trip Style */}
      <div className="flex items-center gap-4 px-5 py-3.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
          <Sparkles size={15} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">Trip Style</p>
          <div className="flex flex-wrap gap-1.5">
            {STYLE_OPTS.map((s) => (
              <button
                key={s}
                onClick={() => setTripStyle(s)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  tripStyle === s
                    ? "bg-primary text-white shadow-sm"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="px-5 py-4 flex gap-2.5">
        <motion.button
          onClick={handleGenerate}
          disabled={isGenerating}
          whileHover={isGenerating ? {} : { scale: 1.025 }}
          whileTap={isGenerating ? {} : { scale: 0.975 }}
          transition={{ type: "tween", duration: 0.18 }}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-md shadow-primary/20 transition-shadow hover:shadow-[0_6px_24px_hsla(347,77%,50%,0.30)] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>Crafting your itinerary…</span>
            </>
          ) : (
            <>
              <Sparkles size={15} />
              Generate My Trip
            </>
          )}
        </motion.button>

        <motion.button
          onClick={handleSurprise}
          disabled={isGenerating}
          whileHover={isGenerating ? {} : { scale: 1.05 }}
          whileTap={isGenerating ? {} : { scale: 0.95 }}
          transition={{ type: "tween", duration: 0.18 }}
          title="Surprise Me"
          className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl border border-border bg-white text-muted-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-50"
        >
          <Shuffle size={16} />
        </motion.button>
      </div>

      {/* Generating overlay shimmer */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ background: "linear-gradient(135deg, transparent 0%, hsla(347,77%,50%,0.03) 100%)" }}
          />
        )}
      </AnimatePresence>
    </motion.div>
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
  <div className="grid grid-cols-5">
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
              transition={{ type: "tween", duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
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
  const [category, setCategory] = useState<Category>("home");

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

            {/* RIGHT — Booking form / AI card */}
            <motion.div
              className="relative mt-8 w-full lg:mt-0 lg:w-[500px] lg:justify-self-end"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut", delay: 0.8 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {category === "home" ? (
                  <AIItineraryCard key="home" />
                ) : (
                  <BookingCard key={category} category={category} />
                )}
              </AnimatePresence>
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
