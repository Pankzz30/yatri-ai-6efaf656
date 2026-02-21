import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Heart, Clock, Wallet, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { destinations, type Destination } from "@/data/mockData";

/* ─────────────────────────────────────────────────────────────────
   CATEGORY FILTERS
───────────────────────────────────────────────────────────────── */
type Filter = "all" | "weekend" | "budget" | "adventure" | "offbeat";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "weekend", label: "Weekend" },
  { id: "budget", label: "Budget" },
  { id: "adventure", label: "Adventure" },
  { id: "offbeat", label: "Offbeat" },
];

function filterDestinations(filter: Filter): Destination[] {
  switch (filter) {
    case "weekend":
      return destinations.filter((d) => d.distance <= 350);
    case "budget":
      return destinations.filter((d) => d.budgetRange.includes("2,") || d.budgetRange.includes("1,"));
    case "adventure":
      return destinations.filter((d) =>
        d.category.some((c) => c.toLowerCase().includes("adventure") || c.toLowerCase().includes("nature"))
      );
    case "offbeat":
      return destinations.filter((d) => d.popularityScore < 90);
    default:
      return destinations;
  }
}

/* ─────────────────────────────────────────────────────────────────
   DISCOVERY CARD
───────────────────────────────────────────────────────────────── */
function DiscoveryCard({ d, index }: { d: Destination; index: number }) {
  const [saved, setSaved] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: "easeOut" as const }}
      className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-250 h-72 sm:h-80 cursor-pointer"
    >
      {/* Cinematic Image */}
      <motion.img
        src={d.image}
        alt={d.name}
        className="absolute inset-0 w-full h-full object-cover"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.35, ease: "easeOut" as const }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

      {/* Save icon */}
      <button
        onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
        className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm transition-transform duration-200 hover:scale-110"
      >
        <Heart
          size={14}
          className={saved ? "fill-primary text-primary" : "text-muted-foreground"}
        />
      </button>

      {/* Bottom content */}
      <div className="absolute bottom-0 inset-x-0 p-5">
        <h3 className="text-lg font-bold text-white leading-tight mb-0.5">{d.name}</h3>
        <p className="text-white/70 text-xs mb-3 line-clamp-1">{d.description}</p>

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

/* ─────────────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────────────── */
export default function DiscoveryFeed() {
  const [filter, setFilter] = useState<Filter>("all");
  const results = filterDestinations(filter);

  return (
    <div className="container mx-auto px-6">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-1">AI-Powered</p>
      <h2 className="text-2xl font-bold text-foreground mb-2">Trips Picked Just For You</h2>
      <p className="text-xs text-muted-foreground mb-5">Personalized recommendations based on your preferences</p>

      {/* Filter toggle */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`relative text-[11px] font-medium px-3.5 py-1.5 rounded-full border transition-all duration-200 whitespace-nowrap ${
              filter === f.id
                ? "bg-primary text-white border-primary shadow-sm shadow-primary/20"
                : "bg-white text-foreground border-border hover:border-primary/40"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Card grid */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={filter}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {results.map((d, i) => (
            <DiscoveryCard key={d.id} d={d} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>

      {results.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-12">No trips found for this category. Try another filter.</p>
      )}
    </div>
  );
}
