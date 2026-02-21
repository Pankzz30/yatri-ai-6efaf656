import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Heart, Clock, Wallet, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { destinations, type Destination } from "@/data/mockData";
import TypingEffect from "@/components/onboarding/TypingEffect";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

/* ── Mood Data ── */
type MoodId =
  | "nature"
  | "beach"
  | "adventure"
  | "food"
  | "culture"
  | "city"
  | "wellness"
  | "backpacking";

interface Mood {
  id: MoodId;
  label: string;
  emoji: string;
  insight: string;
  keywords: string[];
}

const MOODS: Mood[] = [
  { id: "nature", label: "Nature Escape", emoji: "🌿", insight: "Curating nature escapes near you…", keywords: ["nature", "scenic", "trekking"] },
  { id: "beach", label: "Beach Relax", emoji: "🏖️", insight: "Finding the best beaches for you…", keywords: ["beach"] },
  { id: "adventure", label: "Adventure Rush", emoji: "⛰️", insight: "Curating adventure escapes near you…", keywords: ["adventure", "trekking"] },
  { id: "food", label: "Food Trail", emoji: "🍛", insight: "Discovering food trails across India…", keywords: ["food", "culture"] },
  { id: "culture", label: "Culture & Heritage", emoji: "🏛️", insight: "Exploring heritage destinations…", keywords: ["historic", "spiritual", "religious"] },
  { id: "city", label: "City Explorer", emoji: "🌆", insight: "Finding vibrant city experiences…", keywords: ["city"] },
  { id: "wellness", label: "Wellness Retreat", emoji: "🧘", insight: "Searching for peaceful retreats…", keywords: ["spiritual", "nature"] },
  { id: "backpacking", label: "Backpacking", emoji: "🎒", insight: "Finding budget backpacking routes…", keywords: ["adventure", "nature", "trekking"] },
];

/* ── Filter Data ── */
type Duration = "all" | "short" | "weekend" | "long";
type Budget = "all" | "under8k" | "balanced" | "premium";

const DURATIONS: { id: Duration; label: string }[] = [
  { id: "all", label: "Any" },
  { id: "short", label: "2–3 days" },
  { id: "weekend", label: "Weekend" },
  { id: "long", label: "5+ days" },
];

const BUDGETS: { id: Budget; label: string }[] = [
  { id: "all", label: "Any" },
  { id: "under8k", label: "Under ₹8k" },
  { id: "balanced", label: "Balanced" },
  { id: "premium", label: "Premium" },
];

/* ── Filtering Logic ── */
function filterDestinations(
  mood: MoodId | null,
  dur: Duration,
  bud: Budget
): Destination[] {
  let list = destinations;

  if (mood) {
    const m = MOODS.find((m) => m.id === mood)!;
    list = list.filter((d) =>
      d.category.some((c) =>
        m.keywords.some((kw) => c.toLowerCase().includes(kw))
      )
    );
    if (list.length === 0) list = destinations; // fallback
  }

  if (dur === "short") list = list.filter((d) => d.distance <= 300);
  else if (dur === "weekend") list = list.filter((d) => d.distance <= 400);
  else if (dur === "long") list = list.filter((d) => d.distance > 400);

  if (bud === "under8k")
    list = list.filter(
      (d) => d.budgetRange.includes("2,") || d.budgetRange.includes("1,") || d.budgetRange.includes("3,")
    );
  else if (bud === "premium")
    list = list.filter(
      (d) => d.budgetRange.includes("10,") || d.budgetRange.includes("15,")
    );

  return list;
}

/* ── Mood Card ── */
function MoodCard({
  mood,
  isActive,
  onClick,
}: {
  mood: Mood;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05, rotateZ: 1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className={`flex flex-col items-center gap-2.5 rounded-2xl border p-5 min-w-[120px] cursor-pointer transition-all duration-250 ${
        isActive
          ? "border-primary/60 bg-accent shadow-md"
          : "border-border/40 bg-background shadow-sm hover:shadow-md"
      }`}
    >
      <span className="text-3xl">{mood.emoji}</span>
      <span className="text-xs font-semibold text-foreground whitespace-nowrap">
        {mood.label}
      </span>
    </motion.button>
  );
}

/* ── Filter Chip ── */
function Chip({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      layout
      onClick={onClick}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className={`text-[11px] font-medium px-3.5 py-1.5 rounded-full border transition-all duration-250 whitespace-nowrap ${
        isActive
          ? "bg-primary text-primary-foreground border-primary shadow-sm"
          : "bg-background text-foreground border-border hover:border-primary/40"
      }`}
    >
      {label}
    </motion.button>
  );
}

/* ── Destination Card ── */
function DestCard({ d, index }: { d: Destination; index: number }) {
  const [saved, setSaved] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.25, ease: "easeInOut" }}
      className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-250 h-80 cursor-pointer"
    >
      <motion.img
        src={d.image}
        alt={d.name}
        className="absolute inset-0 w-full h-full object-cover"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

      <button
        onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
        className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm transition-transform duration-200 hover:scale-110"
      >
        <Heart
          size={14}
          className={saved ? "fill-primary text-primary" : "text-muted-foreground"}
        />
      </button>

      <div className="absolute bottom-0 inset-x-0 p-5">
        <h3 className="text-lg font-bold text-white leading-tight mb-0.5">
          {d.name}
        </h3>
        <p className="text-white/70 text-xs mb-3 line-clamp-1">
          {d.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center gap-1 text-[10px] font-semibold bg-white/20 backdrop-blur text-white px-2.5 py-1 rounded-full">
            <Wallet size={10} />
            {d.budgetRange.split(" - ")[0]}+
          </span>
          <span className="flex items-center gap-1 text-[10px] font-semibold bg-white/20 backdrop-blur text-white px-2.5 py-1 rounded-full">
            <Clock size={10} />
            {Math.round(d.distance / 80)}–{Math.round(d.distance / 50)} days
          </span>
        </div>

        <Link
          to="/plan"
          className="flex items-center justify-center gap-1.5 w-full text-[11px] font-bold text-primary-foreground rounded-xl py-2 gradient-cta transition-all duration-200 hover:opacity-90"
        >
          View Itinerary
          <ArrowRight size={12} />
        </Link>
      </div>
    </motion.div>
  );
}

/* ── Main Export ── */
export default function TravelMoodExperience() {
  const [activeMood, setActiveMood] = useState<MoodId | null>(null);
  const [duration, setDuration] = useState<Duration>("all");
  const [budget, setBudget] = useState<Budget>("all");

  const results = filterDestinations(activeMood, duration, budget);
  const activeMoodData = MOODS.find((m) => m.id === activeMood);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        {/* ── Section 1: Mood Selector ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-1">
            Personalized
          </p>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            How are you feeling today?
          </h2>
        </motion.div>

        {/* Mood grid — desktop grid, mobile scroll */}
        <div className="grid grid-cols-4 gap-3 max-sm:flex max-sm:overflow-x-auto max-sm:scrollbar-hide max-sm:pb-2 mb-5">
          {MOODS.map((mood) => (
            <MoodCard
              key={mood.id}
              mood={mood}
              isActive={activeMood === mood.id}
              onClick={() =>
                setActiveMood((prev) => (prev === mood.id ? null : mood.id))
              }
            />
          ))}
        </div>

        {/* AI Insight text */}
        <AnimatePresence mode="wait">
          {activeMoodData && (
            <motion.div
              key={activeMoodData.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="mb-8 flex items-center gap-2"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <TypingEffect
                text={activeMoodData.insight}
                speed={30}
                className="text-sm text-muted-foreground"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Section 2: Dynamic Filters ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25, ease: "easeInOut", delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Duration
              </p>
              <div className="flex gap-1.5">
                {DURATIONS.map((d) => (
                  <Chip
                    key={d.id}
                    label={d.label}
                    isActive={duration === d.id}
                    onClick={() => setDuration(d.id)}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Budget
              </p>
              <div className="flex gap-1.5">
                {BUDGETS.map((b) => (
                  <Chip
                    key={b.id}
                    label={b.label}
                    isActive={budget === b.id}
                    onClick={() => setBudget(b.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Section 3: Smart Destination Carousel ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25, ease: "easeInOut", delay: 0.15 }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-1">
            AI-Curated
          </p>
          <h3 className="text-xl font-bold text-foreground mb-5">
            Trips Picked Just For You
          </h3>
        </motion.div>

        {results.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-12">
            No trips match your mood. Try adjusting your filters.
          </p>
        ) : (
          <Carousel
            opts={{ align: "start", loop: false }}
            className="w-full"
          >
            <CarouselContent className="-ml-3">
              <AnimatePresence mode="popLayout">
                {results.map((d, i) => (
                  <CarouselItem
                    key={d.id}
                    className="pl-3 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <DestCard d={d} index={i} />
                  </CarouselItem>
                ))}
              </AnimatePresence>
            </CarouselContent>
            <CarouselPrevious className="-left-4 lg:-left-5" />
            <CarouselNext className="-right-4 lg:-right-5" />
          </Carousel>
        )}
      </div>
    </section>
  );
}
