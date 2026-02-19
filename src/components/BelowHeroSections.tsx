import { motion, useInView } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import { MapPin, Clock, Shuffle, ChevronRight, Sparkles } from "lucide-react";
import { destinations } from "@/data/mockData";
import { useUser } from "@/context/UserContext";
import IndiaMapSection from "@/components/IndiaMapSection";

/* ─────────────────────────────────────────────────────────────────
   ANIMATION VARIANTS
───────────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   1. CURATED TRIP CARD
───────────────────────────────────────────────────────────────── */
function CuratedCard({ d, index }: { d: typeof destinations[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: "easeOut" as const }}
      className="group relative flex-shrink-0 w-64 h-80 rounded-2xl overflow-hidden cursor-pointer select-none"
    >
      {/* Image */}
      <motion.img
        src={d.image}
        alt={d.name}
        className="absolute inset-0 w-full h-full object-cover"
        whileHover={{ scale: 1.06 }}
        transition={{ duration: 0.45, ease: "easeOut" as const }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Badges top-right */}
      <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
        <span className="text-[10px] font-semibold bg-white/95 text-foreground px-2 py-0.5 rounded-full shadow-sm">
          {d.budgetRange.split(" - ")[0]}+
        </span>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 inset-x-0 p-4">
        <p className="text-white font-bold text-base leading-tight">{d.name}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin size={10} className="text-white/70" />
          <p className="text-white/70 text-[11px]">{d.state}</p>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-[10px] bg-white/20 backdrop-blur text-white px-2 py-0.5 rounded-full">
            {d.category[0]}
          </span>
          <span className="text-[10px] flex items-center gap-0.5 text-white/60">
            <Clock size={9} /> {Math.round(d.distance / 60)}–{Math.round(d.distance / 50)} days
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   2. SURPRISE ME FLIP CARD
───────────────────────────────────────────────────────────────── */
function SurpriseMeCard() {
  const [flipped, setFlipped] = useState(false);
  const [pick, setPick] = useState(destinations[0]);

  const handleFlip = useCallback(() => {
    const random = destinations[Math.floor(Math.random() * destinations.length)];
    setPick(random);
    setFlipped((f) => !f);
  }, []);

  return (
    <div
      className="relative h-52 cursor-pointer select-none"
      style={{ perspective: "1000px" }}
      onClick={handleFlip}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: "easeInOut" as const }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-3 border border-border/50 bg-white shadow-sm"
          style={{ backfaceVisibility: "hidden" }}
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" as const }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"
          >
            <Shuffle size={26} />
          </motion.div>
          <p className="font-bold text-foreground text-base">Surprise Me!</p>
          <p className="text-xs text-muted-foreground">Tap to discover a random destination</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <img src={pick.image} alt={pick.name} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 p-4">
            <p className="text-white font-bold text-xl">{pick.name}</p>
            <p className="text-white/70 text-xs mt-0.5">{pick.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] bg-primary text-white px-2.5 py-0.5 rounded-full font-medium">
                {pick.budgetRange}
              </span>
              <span className="text-white/60 text-[11px]">Tap to reshuffle</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   3. AI SUGGESTION CHIPS
───────────────────────────────────────────────────────────────── */
const AI_CHIPS = [
  "3-day under ₹10k",
  "Hidden gems near me",
  "Adventure getaway",
  "Beach escape",
  "Weekend in hills",
  "Cultural deep-dive",
  "Solo trip ideas",
  "Couple retreat",
  "Budget backpacking",
  "Luxury splurge",
];

function AISuggestionChips() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div className="flex flex-wrap gap-2">
      {AI_CHIPS.map((chip, i) => (
        <motion.button
          key={chip}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.04, duration: 0.3 }}
          onClick={() => setActive(active === chip ? null : chip)}
          className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-200 ${
            active === chip
              ? "bg-primary text-white border-primary shadow-sm shadow-primary/30"
              : "bg-white text-foreground border-border hover:border-primary/50 hover:text-primary"
          }`}
        >
          <Sparkles size={10} className="inline mr-1 opacity-70" />
          {chip}
        </motion.button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   4. EXPLORE BY MOOD CARDS
───────────────────────────────────────────────────────────────── */
const MOODS = [
  {
    label: "Nature",
    emoji: "🌿",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600",
    color: "#16a34a",
  },
  {
    label: "Food",
    emoji: "🍛",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600",
    color: "#d97706",
  },
  {
    label: "Relax",
    emoji: "🏖️",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600",
    color: "#0891b2",
  },
  {
    label: "Adventure",
    emoji: "⛰️",
    image: "https://images.unsplash.com/photo-1600100397608-e4b0f8b6b3d1?w=600",
    color: "#E11D48",
  },
  {
    label: "Culture",
    emoji: "🏛️",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600",
    color: "#7c3aed",
  },
];

function MoodCard({ mood, index }: { mood: typeof MOODS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" as const }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative rounded-2xl overflow-hidden cursor-pointer flex-1 min-w-[120px] h-40"
    >
      <motion.img
        src={mood.image}
        alt={mood.label}
        className="absolute inset-0 w-full h-full object-cover"
        animate={{ scale: hovered ? 1.08 : 1 }}
        transition={{ duration: 0.4, ease: "easeOut" as const }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `linear-gradient(to top, ${mood.color}cc, ${mood.color}44, transparent)`,
          opacity: hovered ? 1 : 0.7,
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 gap-1">
        <span className="text-xl">{mood.emoji}</span>
        <p className="text-white font-bold text-sm">{mood.label}</p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   5. TRENDING NOW CAROUSEL
───────────────────────────────────────────────────────────────── */
function TrendingCard({ d, index }: { d: typeof destinations[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" as const }}
      className="flex-shrink-0 w-44 group cursor-pointer"
    >
      <div className="relative h-32 rounded-xl overflow-hidden mb-2">
        <motion.img
          src={d.image}
          alt={d.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.07 }}
          transition={{ duration: 0.35, ease: "easeOut" as const }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-2 left-2 text-[10px] font-bold bg-primary text-white px-1.5 py-0.5 rounded-md">
          #{index + 1}
        </div>
      </div>
      <p className="text-sm font-semibold text-foreground leading-tight">{d.name}</p>
      <p className="text-[11px] text-muted-foreground mt-0.5">{d.state}</p>
    </motion.div>
  );
}

/* India Map is now in IndiaMapSection.tsx */

/* ─────────────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────────────── */
export default function BelowHeroSections() {
  const { user } = useUser();
  const trending = [...destinations].sort((a, b) => b.popularityScore - a.popularityScore);
  const curated = user?.preferences?.interests?.length
    ? destinations.filter((d) =>
        d.category.some((c) =>
          user.preferences.interests.some((i) => c.toLowerCase().includes(i.toLowerCase()))
        )
      ).slice(0, 6)
    : trending.slice(0, 6);

  return (
    <div className="bg-background">

      {/* ── 1. TRIPS CURATED FOR YOU ── */}
      <Section className="py-16">
        <div className="container mx-auto px-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-1">Personalized</p>
              <h2 className="text-2xl font-bold text-foreground">
                {user ? `Picked for ${user.name.split(" ")[0]}` : "Trips Curated For You"}
              </h2>
            </div>
            <button className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
              See all <ChevronRight size={12} />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide -mx-2 px-2">
            {curated.map((d, i) => (
              <CuratedCard key={d.id} d={d} index={i} />
            ))}
          </div>
        </div>
      </Section>

      {/* ── 2 + 3. SURPRISE ME + AI CHIPS ── */}
      <Section className="py-12 bg-[hsl(350,80%,98.5%)]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Surprise Me */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-1">Feeling Bold?</p>
              <h2 className="text-xl font-bold text-foreground mb-4">Not Sure Where to Go?</h2>
              <SurpriseMeCard />
            </div>
            {/* AI Chips */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-1">AI Suggestions</p>
              <h2 className="text-xl font-bold text-foreground mb-4">Quick Inspirations</h2>
              <AISuggestionChips />
            </div>
          </div>
        </div>
      </Section>

      {/* ── 4. EXPLORE BY MOOD ── */}
      <Section className="py-16">
        <div className="container mx-auto px-6">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-1">Discover</p>
          <h2 className="text-2xl font-bold text-foreground mb-6">Explore by Mood</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {MOODS.map((mood, i) => (
              <MoodCard key={mood.label} mood={mood} index={i} />
            ))}
          </div>
        </div>
      </Section>

      {/* ── 5. TRENDING NOW ── */}
      <Section className="py-12 bg-[hsl(350,80%,98.5%)]">
        <div className="container mx-auto px-6">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-1">Hot Right Now</p>
              <h2 className="text-2xl font-bold text-foreground">Trending Now</h2>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
            {trending.map((d, i) => (
              <TrendingCard key={d.id} d={d} index={i} />
            ))}
          </div>
        </div>
      </Section>

      {/* ── 6. INTERACTIVE INDIA MAP ── */}
      <Section className="py-16">
        <IndiaMapSection />
      </Section>

      {/* ── FOOTER CTA ── */}
      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">Start Planning</p>
            <h2 className="text-2xl font-bold text-foreground mb-2">Your next trip is one tap away.</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
              Join 50,000+ smart travelers who plan with Yatri AI.
            </p>
            <motion.a
              href="/register"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-2xl px-8 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25"
              style={{ background: "linear-gradient(135deg, #E11D48 0%, #be123c 100%)" }}
            >
              Get started free
            </motion.a>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
