import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { Heart, Clock, Wallet, ArrowRight, Shuffle } from "lucide-react";
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
  | "backpacking"
  | "surprise"
  | "golden";

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

const GOLDEN_MOOD: Mood = {
  id: "golden",
  label: "Golden Discovery",
  emoji: "✨",
  insight: "Unlocking hidden gem destinations just for you…",
  keywords: ["nature", "scenic", "historic", "spiritual"],
};

const ROTATING_HEADINGS = [
  "Need a break?",
  "Feeling adventurous?",
  "Escaping the routine?",
  "Hungry for something new?",
];

/* ── Filtering Logic ── */
function filterDestinations(mood: MoodId | null): Destination[] {
  let list = destinations;
  const moodData = mood === "golden" ? GOLDEN_MOOD : MOODS.find((m) => m.id === mood);

  if (mood && moodData) {
    list = list.filter((d) =>
      d.category.some((c) =>
        moodData.keywords.some((kw) => c.toLowerCase().includes(kw))
      )
    );
    if (list.length === 0) list = destinations;
  }

  return list;
}

/* ── Hover effect overlays per mood ── */
function MoodHoverEffect({ moodId }: { moodId: MoodId }) {
  switch (moodId) {
    case "nature":
      return (
        <motion.div
          className="absolute top-1 right-2 opacity-0 group-hover/mood:opacity-40 transition-opacity duration-250 pointer-events-none"
          animate={{ x: [0, 3, 0], y: [0, -1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-[10px]">☁️</span>
        </motion.div>
      );
    case "beach":
      return (
        <motion.div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/mood:opacity-30 transition-opacity duration-250 pointer-events-none w-full overflow-hidden"
          animate={{ opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-full" />
        </motion.div>
      );
    case "adventure":
      return (
        <motion.div
          className="absolute bottom-3 left-2 opacity-0 group-hover/mood:opacity-30 transition-opacity duration-250 pointer-events-none"
        >
          <motion.div
            className="h-[1.5px] w-6 bg-primary/50 rounded-full"
            animate={{ scaleX: [0, 1, 0], originX: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      );
    case "food":
      return (
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 opacity-0 group-hover/mood:opacity-25 transition-opacity duration-250 pointer-events-none flex gap-0.5"
        >
          {[0, 0.3, 0.6].map((delay) => (
            <motion.div
              key={delay}
              className="w-[1.5px] h-3 bg-muted-foreground/40 rounded-full"
              animate={{ y: [0, -4, 0], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay }}
            />
          ))}
        </motion.div>
      );
    default:
      return null;
  }
}

/* ── Ripple effect ── */
function useRipple() {
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);
  const trigger = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, key: Date.now() });
  }, []);
  return { ripple, trigger };
}

function RippleSpan({ ripple }: { ripple: { x: number; y: number; key: number } | null }) {
  if (!ripple) return null;
  return (
    <motion.span
      key={ripple.key}
      className="absolute rounded-full bg-primary/15 pointer-events-none"
      style={{ left: ripple.x - 20, top: ripple.y - 20, width: 40, height: 40 }}
      initial={{ scale: 0, opacity: 0.6 }}
      animate={{ scale: 3, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    />
  );
}

/* ── Mood Card ── */
function MoodCard({
  mood,
  isActive,
  onClick,
}: {
  mood: Mood;
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  const { ripple, trigger } = useRipple();

  return (
    <motion.button
      layout
      onClick={(e) => { trigger(e); onClick(e); }}
      whileHover={{ scale: 1.05, rotateZ: 1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className={`group/mood relative flex flex-col items-center gap-2.5 rounded-2xl border p-5 min-w-[120px] cursor-pointer transition-all duration-250 overflow-hidden ${
        isActive
          ? "border-primary/60 bg-accent shadow-md"
          : "border-border/40 bg-background shadow-sm hover:shadow-md"
      }`}
    >
      <RippleSpan ripple={ripple} />
      <MoodHoverEffect moodId={mood.id} />
      <span className="text-3xl relative z-10">{mood.emoji}</span>
      <span className="text-xs font-semibold text-foreground whitespace-nowrap relative z-10">
        {mood.label}
      </span>
    </motion.button>
  );
}

/* ── Surprise Me Card ── */
function SurpriseMeCard({
  isActive,
  onClick,
}: {
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState("🎲");
  const { ripple, trigger } = useRipple();

  const handleClick = (e: React.MouseEvent) => {
    trigger(e);
    const random = MOODS[Math.floor(Math.random() * MOODS.length)];
    setChosenEmoji(random.emoji);
    setFlipped(true);
    setTimeout(() => setFlipped(false), 1200);
    onClick(e);
  };

  return (
    <motion.button
      layout
      onClick={handleClick}
      whileHover={{ scale: 1.05, rotateZ: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className={`group/mood relative flex flex-col items-center gap-2.5 rounded-2xl border p-5 min-w-[120px] cursor-pointer transition-all duration-250 overflow-hidden ${
        isActive
          ? "border-primary/60 bg-accent shadow-md"
          : "border-border/40 bg-background shadow-sm hover:shadow-md"
      }`}
      style={{ perspective: 600 }}
    >
      <RippleSpan ripple={ripple} />
      <motion.div
        animate={{ rotateY: flipped ? 360 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="text-3xl"
      >
        {flipped ? chosenEmoji : "🎲"}
      </motion.div>
      <span className="text-xs font-semibold text-foreground whitespace-nowrap">Surprise Me</span>
      {flipped && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary/50"
              style={{ left: `${20 + i * 12}%`, top: "30%" }}
              initial={{ y: 0, opacity: 1, scale: 0 }}
              animate={{ y: -20 - Math.random() * 15, opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
            />
          ))}
        </motion.div>
      )}
    </motion.button>
  );
}

/* ── Golden Mood Card ── */
function GoldenMoodCard({
  isActive,
  onClick,
}: {
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  const { ripple, trigger } = useRipple();

  return (
    <motion.button
      layout
      onClick={(e) => { trigger(e); onClick(e); }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className={`group/mood relative flex flex-col items-center gap-2.5 rounded-2xl border p-5 min-w-[120px] cursor-pointer transition-all duration-250 overflow-hidden ${
        isActive
          ? "border-amber-400/60 bg-amber-50/80 shadow-md shadow-amber-200/30"
          : "border-amber-200/50 bg-gradient-to-b from-amber-50/40 to-background shadow-sm hover:shadow-md hover:shadow-amber-100/20"
      }`}
    >
      <RippleSpan ripple={ripple} />
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, hsla(45,90%,65%,0.12) 0%, transparent 70%)",
        }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="text-3xl relative z-10">✨</span>
      <span className="text-xs font-semibold text-amber-700 whitespace-nowrap relative z-10">
        Golden Discovery
      </span>
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
  const [headingIndex, setHeadingIndex] = useState(0);
  const [showGolden, setShowGolden] = useState(false);
  const [moodOrder, setMoodOrder] = useState(() => MOODS.map((_, i) => i));
  const goldenTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Rotating heading
  useEffect(() => {
    const interval = setInterval(() => {
      setHeadingIndex((prev) => (prev + 1) % ROTATING_HEADINGS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Random golden mood appearance
  useEffect(() => {
    const scheduleGolden = () => {
      const delay = 15000 + Math.random() * 30000; // 15-45s
      goldenTimerRef.current = setTimeout(() => {
        setShowGolden(true);
        setTimeout(() => setShowGolden(false), 10000); // visible for 10s
        scheduleGolden();
      }, delay);
    };
    scheduleGolden();
    return () => { if (goldenTimerRef.current) clearTimeout(goldenTimerRef.current); };
  }, []);

  const shuffleMoods = () => {
    setMoodOrder((prev) => {
      const next = [...prev];
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      return next;
    });
  };

  const handleSurprise = () => {
    const random = MOODS[Math.floor(Math.random() * MOODS.length)];
    setActiveMood(random.id);
  };

  const results = filterDestinations(activeMood);
  const activeMoodData = activeMood === "golden"
    ? GOLDEN_MOOD
    : MOODS.find((m) => m.id === activeMood);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        {/* ── Heading with shuffle ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-1">
            Personalized
          </p>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-foreground">
              How are you feeling today?
            </h2>
            <motion.button
              onClick={shuffleMoods}
              whileHover={{ rotate: 180, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="p-1.5 rounded-full hover:bg-accent transition-colors duration-250"
              title="Shuffle moods"
            >
              <Shuffle size={16} className="text-muted-foreground" />
            </motion.button>
          </div>

          {/* Rotating sub-heading */}
          <div className="h-6 mb-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={headingIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="text-sm text-muted-foreground"
              >
                {ROTATING_HEADINGS[headingIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Mood grid ── */}
        <LayoutGroup>
          <div className="grid grid-cols-4 gap-3 max-sm:flex max-sm:overflow-x-auto max-sm:scrollbar-hide max-sm:pb-2 mb-1">
            {moodOrder.map((idx) => {
              const mood = MOODS[idx];
              return (
                <MoodCard
                  key={mood.id}
                  mood={mood}
                  isActive={activeMood === mood.id}
                  onClick={() =>
                    setActiveMood((prev) => (prev === mood.id ? null : mood.id))
                  }
                />
              );
            })}
          </div>

          {/* Surprise + Golden row */}
          <div className="flex gap-3 max-sm:overflow-x-auto max-sm:scrollbar-hide max-sm:pb-2 mb-5">
            <SurpriseMeCard
              isActive={false}
              onClick={handleSurprise}
            />
            <AnimatePresence>
              {showGolden && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, width: 0 }}
                  animate={{ opacity: 1, scale: 1, width: "auto" }}
                  exit={{ opacity: 0, scale: 0.9, width: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <GoldenMoodCard
                    isActive={activeMood === "golden"}
                    onClick={() =>
                      setActiveMood((prev) => (prev === "golden" ? null : "golden"))
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </LayoutGroup>

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

        {/* ── Smart Destination Carousel ── */}
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
