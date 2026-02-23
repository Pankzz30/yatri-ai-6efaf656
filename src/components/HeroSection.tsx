import { motion, AnimatePresence } from "framer-motion";
import SearchTransition from "@/components/SearchTransition";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  Bus, Train, Plane, Hotel, MapPin, Calendar, Users, ArrowLeftRight, ChevronDown, ArrowRight,
  Home, Shuffle, Loader2, Navigation, Search, X,
} from "lucide-react";
import TravelStoryScene from "@/components/TravelStoryScene";
import { useUser } from "@/context/UserContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

/* ─────────────────────────────────────────────────────────────────
   CATEGORY TABS
───────────────────────────────────────────────────────────────── */
type Category = "home" | "bus" | "train" | "flight" | "hotels";

const CATEGORIES: { id: Category; label: string; Icon: React.ElementType }[] = [
  { id: "home",   label: "AI",   Icon: Home  },
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
  const navigate = useNavigate();
  const [showTransition, setShowTransition] = useState(false);
  const [pendingNav, setPendingNav] = useState<{ path: string; state: any } | null>(null);

  // Bus form state
  const [busFrom, setBusFrom] = useState("");
  const [busTo, setBusTo] = useState("");
  const [busDate, setBusDate] = useState("");
  const [busPassengers] = useState(1);

  // Train form state
  const [trainFrom, setTrainFrom] = useState("");
  const [trainTo, setTrainTo] = useState("");
  const [trainDate, setTrainDate] = useState("");
  const [trainClass, setTrainClass] = useState("");

  // Flight form state
  const [flightFrom, setFlightFrom] = useState("");
  const [flightTo, setFlightTo] = useState("");
  const [flightDate, setFlightDate] = useState("");
  const [flightPassengers, setFlightPassengers] = useState("1");

  // Hotel form state
  const [hotelCity, setHotelCity] = useState("");
  const [hotelCheckIn, setHotelCheckIn] = useState("");
  const [hotelCheckOut, setHotelCheckOut] = useState("");
  const [hotelGuests, setHotelGuests] = useState("2");

  const fromLabel = swapped ? "To" : "From";
  const toLabel   = swapped ? "From" : "To";

  const triggerSearch = (path: string, state: any) => {
    setPendingNav({ path, state });
    setShowTransition(true);
  };

  const handleTransitionComplete = () => {
    setShowTransition(false);
    if (pendingNav) {
      navigate(pendingNav.path, { state: pendingNav.state });
    }
  };

  const handleSearch = () => {
    if (category === "bus") {
      const from = swapped ? busTo : busFrom;
      const to = swapped ? busFrom : busTo;
      triggerSearch("/bus-results", {
        from: from || "Delhi",
        to: to || "Jaipur",
        date: busDate || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        passengers: busPassengers,
      });
      return;
    }
    if (category === "train") {
      const from = swapped ? trainTo : trainFrom;
      const to = swapped ? trainFrom : trainTo;
      triggerSearch("/train-results", {
        from: from || "New Delhi",
        to: to || "Mumbai",
        date: trainDate || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        passengers: 1,
        classType: trainClass || "All Classes",
      });
      return;
    }
    if (category === "flight") {
      const from = swapped ? flightTo : flightFrom;
      const to = swapped ? flightFrom : flightTo;
      triggerSearch("/flight-results", {
        from: from || "Delhi",
        to: to || "Dubai",
        date: flightDate || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        passengers: parseInt(flightPassengers) || 1,
      });
      return;
    }
    if (category === "hotels") {
      triggerSearch("/hotel-results", {
        destination: hotelCity || "Jaipur",
        checkIn: hotelCheckIn || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        checkOut: hotelCheckOut || new Date(Date.now() + 3 * 86400000).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        guests: parseInt(hotelGuests) || 2,
        rooms: 1,
      });
      return;
    }
    navigate("/register");
  };

  const renderFields = () => {
    if (category === "bus" || category === "train") {
      return (
        <>
          <div className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/40 cursor-pointer group">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
              <MapPin size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">{fromLabel}</p>
              <input
                value={category === "bus" ? busFrom : category === "train" ? trainFrom : undefined}
                onChange={category === "bus" ? (e) => setBusFrom(e.target.value) : category === "train" ? (e) => setTrainFrom(e.target.value) : undefined}
                placeholder="Origin city"
                className="mt-0.5 w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/45 outline-none"
              />
            </div>
          </div>
          <div className="relative mx-5 flex items-center">
            <div className="flex-1 border-t border-border/60" />
            <button
              onClick={() => setSwapped((s) => !s)}
              className="mx-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-card shadow-sm text-primary transition-all hover:scale-110 hover:border-primary/40 active:scale-95"
            >
              <ArrowLeftRight size={13} />
            </button>
            <div className="flex-1 border-t border-border/60" />
          </div>
          <div className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/40 cursor-pointer group">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
              <MapPin size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">{toLabel}</p>
              <input
                value={category === "bus" ? busTo : category === "train" ? trainTo : undefined}
                onChange={category === "bus" ? (e) => setBusTo(e.target.value) : category === "train" ? (e) => setTrainTo(e.target.value) : undefined}
                placeholder="Destination city"
                className="mt-0.5 w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/45 outline-none"
              />
            </div>
          </div>
          <div className="mx-5 border-t border-border/60" />
          <div className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/40 cursor-pointer group">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
              <Calendar size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Date</p>
              <input
                type="date"
                value={category === "bus" ? busDate : category === "train" ? trainDate : undefined}
                onChange={category === "bus" ? (e) => setBusDate(e.target.value) : category === "train" ? (e) => setTrainDate(e.target.value) : undefined}
                placeholder="Select date"
                className="mt-0.5 w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/45 outline-none"
              />
            </div>
          </div>
          {category === "train" && (
            <>
              <div className="mx-5 border-t border-border/60" />
              <div className="flex items-center gap-4 px-5 py-4 hover:bg-secondary/40 cursor-pointer">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
                  <Users size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Class</p>
                  <select
                    value={trainClass}
                    onChange={(e) => setTrainClass(e.target.value)}
                    className="mt-0.5 w-full bg-transparent text-sm font-medium text-foreground outline-none cursor-pointer appearance-none"
                  >
                    <option value="">All Classes</option>
                    <option value="Sleeper (SL)">Sleeper (SL)</option>
                    <option value="3rd AC (3A)">3rd AC (3A)</option>
                    <option value="2nd AC (2A)">2nd AC (2A)</option>
                    <option value="1st AC (1A)">1st AC (1A)</option>
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
          <div className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/40 cursor-pointer group">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
              <MapPin size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">{swapped ? "To" : "From"}</p>
              <input
                value={flightFrom}
                onChange={(e) => setFlightFrom(e.target.value)}
                placeholder="Origin airport"
                className="mt-0.5 w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/45 outline-none"
              />
            </div>
          </div>
          <div className="relative mx-5 flex items-center">
            <div className="flex-1 border-t border-border/60" />
            <button
              onClick={() => setSwapped((s) => !s)}
              className="mx-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-card shadow-sm text-primary transition-all hover:scale-110 hover:border-primary/40 active:scale-95"
            >
              <ArrowLeftRight size={13} />
            </button>
            <div className="flex-1 border-t border-border/60" />
          </div>
          <div className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/40 cursor-pointer group">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
              <MapPin size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">{swapped ? "From" : "To"}</p>
              <input
                value={flightTo}
                onChange={(e) => setFlightTo(e.target.value)}
                placeholder="Destination airport"
                className="mt-0.5 w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/45 outline-none"
              />
            </div>
          </div>
          <div className="mx-5 border-t border-border/60" />
          <div className="grid grid-cols-2">
            <div className="border-r border-border/60">
              <div className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/40 cursor-pointer group">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
                  <Calendar size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Departure</p>
                  <input
                    type="date"
                    value={flightDate}
                    onChange={(e) => setFlightDate(e.target.value)}
                    placeholder="Select date"
                    className="mt-0.5 w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/45 outline-none"
                  />
                </div>
              </div>
            </div>
            <FieldRow icon={Calendar} label="Return" placeholder="Optional" type="date" />
          </div>
          <div className="mx-5 border-t border-border/60" />
          <div className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/40 cursor-pointer group">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
              <Users size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Passengers</p>
              <input
                value={flightPassengers}
                onChange={(e) => setFlightPassengers(e.target.value)}
                placeholder="1 Adult"
                className="mt-0.5 w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/45 outline-none"
              />
            </div>
          </div>
        </>
      );
    }

    // Hotels
    return (
      <>
        <div className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/40 cursor-pointer group">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
            <MapPin size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">City</p>
            <input
              value={hotelCity}
              onChange={(e) => setHotelCity(e.target.value)}
              placeholder="Where are you going?"
              className="mt-0.5 w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/45 outline-none"
            />
          </div>
        </div>
        <div className="mx-5 border-t border-border/60" />
        <div className="grid grid-cols-2">
          <div className="border-r border-border/60">
            <div className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/40 cursor-pointer group">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
                <Calendar size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Check-in</p>
                <input
                  type="date"
                  value={hotelCheckIn}
                  onChange={(e) => setHotelCheckIn(e.target.value)}
                  placeholder="Add date"
                  className="mt-0.5 w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/45 outline-none"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/40 cursor-pointer group">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
              <Calendar size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Check-out</p>
              <input
                type="date"
                value={hotelCheckOut}
                onChange={(e) => setHotelCheckOut(e.target.value)}
                placeholder="Add date"
                className="mt-0.5 w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/45 outline-none"
              />
            </div>
          </div>
        </div>
        <div className="mx-5 border-t border-border/60" />
        <div className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/40 cursor-pointer group">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
            <Users size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Guests</p>
            <input
              value={hotelGuests}
              onChange={(e) => setHotelGuests(e.target.value)}
              placeholder="2 Adults · 1 Room"
              className="mt-0.5 w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/45 outline-none"
            />
          </div>
        </div>
      </>
    );
  };

    return (
    <>
      <SearchTransition
        active={showTransition}
        type={category}
        onComplete={handleTransitionComplete}
      />
      <div className="w-full rounded-2xl border border-border/70 bg-card shadow-[0_4px_32px_rgba(0,0,0,0.07)] overflow-hidden">
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
              <button
                onClick={handleSearch}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:scale-[1.03] hover:shadow-[0_6px_24px_hsla(347,77%,50%,0.30)] active:scale-[0.98]"
              >
                {category === "bus" && "Search Buses"}
                {category === "train" && "Search Trains"}
                {category === "flight" && "Search Flights"}
                {category === "hotels" && "Search Hotels"}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────────────────────────
   DURATION / BUDGET / STYLE OPTIONS
───────────────────────────────────────────────────────────────── */
const DURATION_OPTS = ["2–3 days", "4–5 days", "1 week", "Custom"] as const;
const BUDGET_OPTS   = ["Budget", "Balanced", "Premium"] as const;
const STYLE_OPTS    = ["Weekend", "Relaxed", "Adventure", "Backpacking", "Cultural", "Foodie"] as const;

const GENERATING_MESSAGES = [
  "Scanning the best local spots…",
  "Optimizing your route…",
  "Matching hidden gems…",
  "Crafting day-by-day itinerary…",
  "Almost ready…",
];

const SURPRISE_PROMPTS = [
  "Plan a 4-day offbeat trip to Meghalaya for a solo nature lover",
  "Design a 5-day royal heritage tour of Rajputana on a balanced budget",
  "Craft a 3-day coastal escape to Gokarna, backpacking style",
  "Plan a 6-day family trip to Kerala backwaters, premium comfort",
  "Weekend adventure itinerary to Rishikesh including river rafting",
];

/* ── Smart Location Input ────────────────────────────────────── */
const LocationInput = ({
  value,
  onChange,
  placeholder,
  showCurrentLocation = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  showCurrentLocation?: boolean;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      () => onChange("Current Location"),
      () => {}
    );
  };

  return (
    <motion.div
      animate={{ boxShadow: focused ? "0 0 0 2px hsla(347,77%,50%,0.18)" : "0 0 0 0px transparent" }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2 rounded-xl bg-secondary/40 px-3 py-2.5 cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <Search size={13} className={`shrink-0 transition-colors duration-200 ${focused ? "text-primary" : "text-muted-foreground/60"}`} />
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/45 outline-none min-w-0"
      />
      {value ? (
        <button
          onClick={(e) => { e.stopPropagation(); onChange(""); }}
          className="shrink-0 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
        >
          <X size={11} />
        </button>
      ) : showCurrentLocation ? (
        <button
          onClick={(e) => { e.stopPropagation(); handleCurrentLocation(); }}
          title="Use current location"
          className="shrink-0 text-primary/60 hover:text-primary transition-colors"
        >
          <Navigation size={12} />
        </button>
      ) : null}
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   AI ITINERARY CARD
───────────────────────────────────────────────────────────────── */
const AIItineraryCard = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [from, setFrom] = useState(user?.preferences?.location ?? "");
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState<typeof DURATION_OPTS[number]>(DURATION_OPTS[0]);
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>();
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [budget, setBudget] = useState<typeof BUDGET_OPTS[number]>("Balanced");
  const [tripStyles, setTripStyles] = useState<Set<typeof STYLE_OPTS[number]>>(new Set(["Adventure"]));
  const [isGenerating, setIsGenerating] = useState(false);
  const [genMsgIdx, setGenMsgIdx] = useState(0);

  const isReady = destination.trim().length > 0;

  /* Cycle generating messages */
  useEffect(() => {
    if (!isGenerating) { setGenMsgIdx(0); return; }
    const id = setInterval(() => setGenMsgIdx((i) => (i + 1) % GENERATING_MESSAGES.length), 900);
    return () => clearInterval(id);
  }, [isGenerating]);

  const buildPrompt = () => {
    const dur = duration === "Custom" && customDateRange?.from && customDateRange?.to
      ? `${format(customDateRange.from, "d MMM")} – ${format(customDateRange.to, "d MMM")}`
      : duration;
    const styles = [...tripStyles].join(" & ");
    return `Plan a ${dur} trip to ${destination || "India"}${from ? ` starting from ${from}` : ""}. Budget: ${budget}. Trip style: ${styles}. Provide a detailed day-by-day itinerary.`;
  };

  const handleGenerate = () => {
    if (!destination.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      navigate("/itinerary", {
        state: {
          destination: destination.trim(),
          duration: durationLabel,
          budget,
          styles: [...tripStyles].join(" & "),
        },
      });
    }, 2200);
  };

  const handleSurprise = () => {
    const pick = SURPRISE_PROMPTS[Math.floor(Math.random() * SURPRISE_PROMPTS.length)];
    setIsGenerating(true);
    setTimeout(() => {
      navigate("/plan", { state: { prompt: pick } });
    }, 2200);
  };

  const toggleStyle = (s: typeof STYLE_OPTS[number]) => {
    setTripStyles((prev) => {
      const next = new Set(prev);
      if (next.has(s)) { if (next.size > 1) next.delete(s); }
      else next.add(s);
      return next;
    });
  };

  const [openSection, setOpenSection] = useState<string | null>(null);
  const toggleSection = (s: string) => setOpenSection(prev => prev === s ? null : s);

  const pill = (active: boolean) =>
    `relative px-2 py-1 text-[11px] font-medium rounded transition-colors duration-150 select-none ${
      active
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
    }`;

  const durationLabel =
    duration === "Custom" && customDateRange?.from && customDateRange?.to
      ? `${format(customDateRange.from, "d MMM")} – ${format(customDateRange.to, "d MMM")}`
      : duration;

  return (
    <motion.div
      key="home-card"
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
      className="relative w-full rounded-2xl bg-card shadow-[0_4px_32px_rgba(0,0,0,0.06)] overflow-hidden border border-border/30"
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <h3 className="text-[15px] font-bold text-foreground tracking-tight">Plan Your Trip</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">AI-powered day-by-day itinerary</p>
      </div>

      <div className="px-5 space-y-6 pb-2">
        {/* From + Destination row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p className="text-[11px] font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
              <MapPin size={10} className="text-primary" /> From
            </p>
            <LocationInput
              value={from}
              onChange={setFrom}
              placeholder="Your city"
              showCurrentLocation
            />
          </div>
          <div>
            <p className="text-[11px] font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
              <MapPin size={10} className="text-primary" /> Destination
            </p>
            <LocationInput
              value={destination}
              onChange={setDestination}
              placeholder="Where to?"
            />
          </div>
        </div>

        {/* Duration + Budget — collapsible, merged row on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Duration */}
          <div>
            <button
              onClick={() => toggleSection("duration")}
              className="w-full flex items-center justify-between text-[12px] font-semibold text-foreground"
            >
              <span>Duration</span>
              <span className="text-[10px] font-normal text-muted-foreground flex items-center gap-0.5">
                {durationLabel}
                <ChevronDown size={10} className={`transition-transform duration-200 ${openSection === "duration" ? "rotate-180" : ""}`} />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {openSection === "duration" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-1 pt-2.5">
                    {DURATION_OPTS.map((d) => (
                      d === "Custom" ? (
                        <Popover key={d} open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                          <PopoverTrigger asChild>
                            <button
                              onClick={() => { setDuration("Custom"); setDatePickerOpen(true); }}
                              className={pill(duration === "Custom")}
                            >
                              {duration === "Custom" && (
                                <motion.span layoutId="duration-pill" className="absolute inset-0 rounded bg-primary/10" transition={{ type: "spring", stiffness: 420, damping: 32 }} />
                              )}
                              <span className="relative flex items-center gap-1">
                                <Calendar size={9} />
                                {duration === "Custom" && customDateRange?.from && customDateRange?.to
                                  ? durationLabel
                                  : "Custom"}
                              </span>
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarPicker
                              mode="range"
                              selected={customDateRange}
                              onSelect={(r) => { setCustomDateRange(r); if (r?.from && r?.to) setDatePickerOpen(false); }}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <button key={d} onClick={() => setDuration(d)} className={pill(duration === d)}>
                          {duration === d && (
                            <motion.span layoutId="duration-pill" className="absolute inset-0 rounded bg-primary/10" transition={{ type: "spring", stiffness: 420, damping: 32 }} />
                          )}
                          <span className="relative">{d}</span>
                        </button>
                      )
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Budget */}
          <div>
            <button
              onClick={() => toggleSection("budget")}
              className="w-full flex items-center justify-between text-[12px] font-semibold text-foreground"
            >
              <span>Budget</span>
              <span className="text-[10px] font-normal text-muted-foreground flex items-center gap-0.5">
                {budget}
                <ChevronDown size={10} className={`transition-transform duration-200 ${openSection === "budget" ? "rotate-180" : ""}`} />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {openSection === "budget" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-1 pt-2.5">
                    {BUDGET_OPTS.map((b) => (
                      <button key={b} onClick={() => setBudget(b)} className={pill(budget === b)}>
                        {budget === b && (
                          <motion.span layoutId="budget-pill" className="absolute inset-0 rounded bg-primary/10" transition={{ type: "spring", stiffness: 420, damping: 32 }} />
                        )}
                        <span className="relative">{b}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Style — collapsible */}
        <div>
          <button
            onClick={() => toggleSection("style")}
            className="w-full flex items-center justify-between text-[12px] font-semibold text-foreground"
          >
            <span>Style</span>
            <span className="text-[10px] font-normal text-muted-foreground flex items-center gap-0.5">
              {[...tripStyles].join(", ")}
              <ChevronDown size={10} className={`transition-transform duration-200 ${openSection === "style" ? "rotate-180" : ""}`} />
            </span>
          </button>
          <AnimatePresence initial={false}>
            {openSection === "style" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-1 pt-2.5">
                  {STYLE_OPTS.map((s) => (
                    <button key={s} onClick={() => toggleStyle(s)} className={pill(tripStyles.has(s))}>
                      {tripStyles.has(s) && (
                        <motion.span layoutId={`style-pill-${s}`} className="absolute inset-0 rounded bg-primary/10" transition={{ type: "spring", stiffness: 420, damping: 32 }} />
                      )}
                      <span className="relative">{s}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-2">
          <motion.button
            onClick={handleGenerate}
            disabled={isGenerating || !isReady}
            whileHover={isGenerating || !isReady ? {} : { scale: 1.01 }}
            whileTap={isGenerating || !isReady ? {} : { scale: 0.99 }}
            transition={{ duration: 0.15 }}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-primary-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: isGenerating || !isReady
                ? "hsl(347 77% 60%)"
                : "linear-gradient(135deg, hsl(347 77% 48%) 0%, hsl(352 82% 56%) 100%)",
            }}
          >
            {isGenerating ? (
              <>
                <Loader2 size={13} className="animate-spin shrink-0" />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={genMsgIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22 }}
                    className="text-[13px]"
                  >
                    {GENERATING_MESSAGES[genMsgIdx]}
                  </motion.span>
                </AnimatePresence>
              </>
            ) : (
              <span>Generate My Trip</span>
            )}
          </motion.button>

          <motion.button
            onClick={handleSurprise}
            disabled={isGenerating}
            whileHover={isGenerating ? {} : { scale: 1.04 }}
            whileTap={isGenerating ? {} : { scale: 0.96 }}
            transition={{ duration: 0.15 }}
            title="Surprise Me"
            className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg border border-border/40 bg-card text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary disabled:opacity-50"
          >
            <Shuffle size={14} />
          </motion.button>
        </div>

        {/* Progress bar only during generation */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3"
            >
              <div className="h-[2px] w-full rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: "90%" }}
                  transition={{ duration: 2.0, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtle overlay shimmer while generating */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ background: "linear-gradient(135deg, transparent 60%, hsla(347,77%,50%,0.04) 100%)" }}
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
      <div className="fixed top-16 left-0 right-0 z-40 bg-card border-b border-border/60">
        <div className="container mx-auto px-6">
          <CategoryTabs active={category} onChange={setCategory} />
        </div>
      </div>

      <section className="relative flex flex-col items-center justify-center overflow-hidden bg-background px-4 pt-40 pb-6 lg:pt-36 lg:pb-6">

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

    </section>
    </>
  );
};

export default HeroSection;
