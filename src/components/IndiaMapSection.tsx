import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────────────────────────
   CITY DATA
───────────────────────────────────────────────────────────────── */
interface CityPin {
  name: string;
  x: number;
  y: number;
  state: string;
  img: string;
  desc: string;
  price: string;
  duration: string;
  tags: ("popular" | "offbeat" | "near")[];
}

const CITIES: CityPin[] = [
  { name: "Delhi", x: 42, y: 22, state: "Delhi", img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400", desc: "India's capital — heritage, street food & history.", price: "₹3k–8k", duration: "2–3 days", tags: ["popular", "near"] },
  { name: "Jaipur", x: 35, y: 30, state: "Rajasthan", img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400", desc: "The Pink City — forts, palaces & bazaars.", price: "₹3k–8k", duration: "2–3 days", tags: ["popular"] },
  { name: "Agra", x: 45, y: 28, state: "UP", img: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400", desc: "Home to the iconic Taj Mahal.", price: "₹2.5k–6k", duration: "1–2 days", tags: ["popular", "near"] },
  { name: "Varanasi", x: 55, y: 33, state: "UP", img: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400", desc: "Ancient ghats & timeless rituals.", price: "₹2k–5k", duration: "2–3 days", tags: ["popular"] },
  { name: "Manali", x: 38, y: 12, state: "Himachal", img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400", desc: "Snow peaks, valleys & adventure.", price: "₹4k–9k", duration: "3–5 days", tags: ["popular"] },
  { name: "Goa", x: 28, y: 65, state: "Goa", img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400", desc: "Sun, sand & India's beach paradise.", price: "₹5k–15k", duration: "3–5 days", tags: ["popular"] },
  { name: "Hampi", x: 34, y: 68, state: "Karnataka", img: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=400", desc: "UNESCO ruins in boulder-strewn landscape.", price: "₹1.5k–4k", duration: "2–3 days", tags: ["offbeat"] },
  { name: "Rishikesh", x: 40, y: 16, state: "Uttarakhand", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400", desc: "Yoga capital on the banks of the Ganges.", price: "₹2k–5k", duration: "2–3 days", tags: ["offbeat", "near"] },
  { name: "Udaipur", x: 30, y: 38, state: "Rajasthan", img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400", desc: "City of Lakes — romantic & regal.", price: "₹4k–10k", duration: "2–3 days", tags: ["popular"] },
  { name: "Kolkata", x: 70, y: 40, state: "West Bengal", img: "https://images.unsplash.com/photo-1558431382-27e303142255?w=400", desc: "Culture, art & colonial grandeur.", price: "₹3k–7k", duration: "2–3 days", tags: ["offbeat"] },
];

type Filter = "popular" | "offbeat" | "near";

/* ─────────────────────────────────────────────────────────────────
   INDIA SVG OUTLINE (simplified)
───────────────────────────────────────────────────────────────── */
function IndiaOutline() {
  return (
    <svg
      viewBox="0 0 100 120"
      className="absolute inset-0 w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="landGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(350, 80%, 95%)" />
          <stop offset="100%" stopColor="hsl(350, 60%, 97%)" />
        </linearGradient>
      </defs>
      <path
        d="M38 5 C40 3, 50 4, 52 5 C54 6, 58 8, 60 10 L62 8 L68 10 L72 14
           C74 16, 78 20, 80 24 L82 28 L78 30 L80 34 L76 38 L78 42
           C78 46, 76 50, 74 54 L70 58 L68 64 C66 68, 62 74, 58 78
           L54 84 C52 88, 50 92, 48 96 L46 100 C44 102, 42 104, 40 102
           L38 98 C36 94, 34 90, 34 86 L32 80 C30 76, 28 72, 26 68
           L24 62 C22 58, 20 54, 20 50 L18 44 C18 40, 20 36, 22 32
           L24 28 C26 24, 28 20, 30 16 L32 12 C34 8, 36 6, 38 5 Z"
        fill="url(#landGrad)"
        stroke="hsl(350, 50%, 85%)"
        strokeWidth="0.5"
        opacity="0.8"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAP MARKER
───────────────────────────────────────────────────────────────── */
function Marker({
  city,
  dimmed,
  onSelect,
  isSelected,
}: {
  city: CityPin;
  dimmed: boolean;
  onSelect: (name: string | null) => void;
  isSelected: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const active = hovered || isSelected;

  return (
    <div
      className="absolute z-10"
      style={{ left: `${city.x}%`, top: `${city.y}%`, transform: "translate(-50%, -50%)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); onSelect(isSelected ? null : city.name); }}
    >
      {/* Outer ripple */}
      <motion.div
        className="absolute rounded-full"
        style={{ inset: -6 }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: dimmed ? [0.1, 0, 0.1] : [0.35, 0, 0.35],
        }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" as const }}
      >
        <div className="w-full h-full rounded-full bg-primary/25" />
      </motion.div>

      {/* Inner glow */}
      <motion.div
        className="absolute rounded-full bg-primary/15"
        style={{ inset: -3 }}
        animate={{ opacity: active ? 0.6 : 0.2 }}
        transition={{ duration: 0.25 }}
      />

      {/* Dot */}
      <motion.div
        className="relative h-3 w-3 rounded-full cursor-pointer shadow-md"
        style={{
          background: "linear-gradient(135deg, #E11D48 0%, #be123c 100%)",
          boxShadow: active ? "0 0 10px rgba(225,29,72,0.45)" : "0 0 4px rgba(225,29,72,0.25)",
        }}
        animate={{
          scale: active ? 1.5 : dimmed ? 0.7 : 1,
          opacity: dimmed ? 0.4 : 1,
        }}
        transition={{ duration: 0.25, ease: "easeOut" as const }}
      />

      {/* City label on hover */}
      <AnimatePresence>
        {active && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-[10px] font-bold text-foreground bg-white/90 backdrop-blur px-1.5 py-0.5 rounded shadow-sm border border-border/30"
          >
            {city.name}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Preview card */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: -10 }}
            exit={{ opacity: 0, scale: 0.9, y: -6 }}
            transition={{ duration: 0.22, ease: "easeOut" as const }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 rounded-xl overflow-hidden shadow-xl border border-border/40 z-30 bg-white"
          >
            <img src={city.img} alt={city.name} className="w-full h-20 object-cover" />
            <div className="p-2.5">
              <div className="flex items-center gap-1 mb-0.5">
                <MapPin size={9} className="text-primary" />
                <p className="text-[11px] font-bold text-foreground">{city.name}</p>
                <span className="text-[9px] text-muted-foreground ml-auto">{city.state}</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-snug mb-2">{city.desc}</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold text-primary">{city.price}</span>
                <span className="text-[10px] text-muted-foreground">{city.duration}</span>
              </div>
              <Link
                to="/plan"
                className="block text-center text-[10px] font-bold text-white rounded-lg py-1.5 transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #E11D48 0%, #be123c 100%)" }}
              >
                View Trip →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ROUTE LINE (dashed SVG between two selected cities)
───────────────────────────────────────────────────────────────── */
function RouteLine({ from, to }: { from: CityPin; to: CityPin }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
      <motion.line
        x1={`${from.x}%`}
        y1={`${from.y}%`}
        x2={`${to.x}%`}
        y2={`${to.y}%`}
        stroke="#E11D48"
        strokeWidth="1.5"
        strokeDasharray="6 4"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FLOATING SUGGESTION
───────────────────────────────────────────────────────────────── */
function FloatingSuggestion({ cities }: { cities: CityPin[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    setIdx(0);
    const t = setInterval(() => setIdx((i) => (i + 1) % cities.length), 3500);
    return () => clearInterval(t);
  }, [cities.length]);

  if (!cities.length) return null;
  const city = cities[idx % cities.length];
  if (!city) return null;
  return (
    <div className="absolute top-3 left-3 z-20">
      <AnimatePresence mode="wait">
        <motion.div
          key={city.name}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 bg-white/90 backdrop-blur border border-border/40 rounded-full px-3 py-1.5 shadow-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] text-muted-foreground">Try</span>
          <span className="text-[11px] font-bold text-foreground">{city.name}</span>
          <ArrowRight size={10} className="text-primary" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────────────── */
export default function IndiaMapSection() {
  const [filter, setFilter] = useState<Filter>("popular");
  const [selected, setSelected] = useState<string[]>([]);

  const visible = CITIES.filter((c) => c.tags.includes(filter));
  const dimmedNames = CITIES.filter((c) => !c.tags.includes(filter)).map((c) => c.name);

  const handleSelect = useCallback((name: string | null) => {
    if (!name) { setSelected([]); return; }
    setSelected((prev) => {
      if (prev.includes(name)) return prev.filter((n) => n !== name);
      if (prev.length >= 2) return [prev[1], name];
      return [...prev, name];
    });
  }, []);

  const routeFrom = selected.length === 2 ? CITIES.find((c) => c.name === selected[0]) : null;
  const routeTo = selected.length === 2 ? CITIES.find((c) => c.name === selected[1]) : null;

  const FILTERS: { id: Filter; label: string }[] = [
    { id: "popular", label: "Popular" },
    { id: "offbeat", label: "Offbeat" },
    { id: "near", label: "Near Me" },
  ];

  return (
    <div className="container mx-auto px-6">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-1">Explore India</p>
      <h2 className="text-2xl font-bold text-foreground mb-2">Where to Next?</h2>
      <p className="text-xs text-muted-foreground mb-5">
        Hover markers to preview · Select two cities to see a route
      </p>

      {/* Filter toggle */}
      <div className="flex gap-1.5 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => { setFilter(f.id); setSelected([]); }}
            className={`relative text-[11px] font-medium px-3.5 py-1.5 rounded-full border transition-all duration-200 ${
              filter === f.id
                ? "bg-primary text-white border-primary shadow-sm shadow-primary/20"
                : "bg-white text-foreground border-border hover:border-primary/40"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Map container */}
      <div
        className="relative mx-auto max-w-md rounded-2xl border border-border/30 overflow-hidden shadow-md bg-white"
        style={{ aspectRatio: "3/4" }}
        onClick={() => setSelected([])}
      >
        {/* Soft gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 40% 40%, hsl(350, 70%, 97%) 0%, hsl(0, 0%, 99%) 60%, hsl(350, 40%, 98%) 100%)",
          }}
        />

        {/* Decorative grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mapGrid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="hsl(350, 40%, 70%)" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapGrid)" />
        </svg>

        {/* India outline */}
        <IndiaOutline />

        {/* Floating suggestion */}
        <FloatingSuggestion cities={visible.length ? visible : CITIES} />

        {/* Route line */}
        {routeFrom && routeTo && <RouteLine from={routeFrom} to={routeTo} />}

        {/* Markers */}
        <AnimatePresence>
          {CITIES.map((city) => (
            <Marker
              key={city.name}
              city={city}
              dimmed={dimmedNames.includes(city.name)}
              isSelected={selected.includes(city.name)}
              onSelect={handleSelect}
            />
          ))}
        </AnimatePresence>

        {/* Legend */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1 bg-white/85 backdrop-blur rounded-lg px-3 py-2 text-[10px] text-muted-foreground border border-border/30 shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary shadow-sm shadow-primary/40" />
            <span>Recommended</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary/30" />
            <span>Other</span>
          </div>
        </div>

        {/* Selected route label */}
        <AnimatePresence>
          {selected.length === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25 }}
              className="absolute bottom-3 left-3 bg-white/90 backdrop-blur rounded-lg px-3 py-1.5 border border-border/30 shadow-sm z-20"
            >
              <p className="text-[10px] font-bold text-foreground">
                {selected[0]} → {selected[1]}
              </p>
              <p className="text-[9px] text-muted-foreground">Route preview</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
