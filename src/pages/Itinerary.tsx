import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import {
  MapPin, Clock, Wallet, Plane, Train, Bus, Hotel, Star, ChevronDown,
  Sun, Sunset, Moon, Car, UtensilsCrossed, Camera,
  Gem, ArrowLeft, Edit3, CloudSun, Map, List, Navigation,
  IndianRupee, ArrowRight,
} from "lucide-react";
import { mockItinerary } from "@/data/mockData";
import heroItinerary from "@/assets/hero-itinerary-cinematic.jpg";

/* ── Film grain overlay ── */
const grainStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  opacity: 0.04,
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
  backgroundSize: "128px 128px",
};

/* ── Fade-up animation ── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

/* ── Section wrapper ── */
const Section = ({ title, icon: Icon, children, index = 0 }: {
  title: string; icon: React.ElementType; children: React.ReactNode; index?: number;
}) => (
  <motion.section
    custom={index}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-40px" }}
    variants={fadeUp}
    className="space-y-4"
  >
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon size={16} />
      </div>
      <h2 className="text-base font-bold text-foreground tracking-tight">{title}</h2>
    </div>
    {children}
  </motion.section>
);

/* ── Collapsible card ── */
const CollapsibleCard = ({ trigger, children, defaultOpen = false }: {
  trigger: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-border/40 bg-card overflow-hidden transition-shadow hover:shadow-sm">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3 text-left">
        {trigger}
        <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-250 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Badge ── */
const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "primary" | "muted" }) => {
  const cls = variant === "primary"
    ? "bg-primary/10 text-primary"
    : variant === "muted"
    ? "bg-muted text-muted-foreground"
    : "bg-secondary text-foreground";
  return <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium ${cls}`}>{children}</span>;
};

/* ── Star rating ── */
const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(i => (
      <Star key={i} size={10} className={i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"} />
    ))}
    <span className="ml-1 text-[10px] text-muted-foreground">{rating}</span>
  </div>
);

/* ── 3D Interactive Card ── */
function InteractiveCard({ children, index, className = "" }: { children: React.ReactNode; index: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [15, -15]);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
    >
      <motion.div
        style={{ y, rotateX: springRotateX, rotateY: springRotateY, transformPerspective: 1200 }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const cx = (e.clientX - rect.left) / rect.width - 0.5;
          const cy = (e.clientY - rect.top) / rect.height - 0.5;
          rotateX.set(cy * -4);
          rotateY.set(cx * 4);
        }}
        onMouseLeave={() => { rotateX.set(0); rotateY.set(0); }}
        className={`group relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition-all duration-500 hover:border-primary/20 hover:shadow-[0_0_60px_hsla(347,77%,50%,0.08)] ${className}`}
      >
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/[0.03] to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ── Book CTA Button ── */
function BookButton({ label = "Book →" }: { label?: string }) {
  return (
    <button className="text-[10px] font-semibold text-primary hover:underline transition-colors">
      {label}
    </button>
  );
}

/* ═══════════════════════════════════════════════════
   ITINERARY PAGE
═══════════════════════════════════════════════════ */
const Itinerary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { destination?: string; duration?: string; budget?: string; styles?: string } | null;
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [entered, setEntered] = useState(false);

  const dest = state?.destination || "Jaipur";
  const dur = state?.duration || "3 Days";
  const budget = state?.budget || "Balanced";
  const styles = state?.styles || "Adventure";
  const data = mockItinerary;

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  const travelOptions = [
    { mode: "Flight", icon: Plane, price: "₹3,200", duration: "1h 10m", time: "06:30 AM", tag: "Fastest", tagColor: "primary" as const },
    { mode: "Train (Shatabdi)", icon: Train, price: "₹780", duration: "4h 30m", time: "06:00 AM", tag: "Best Value", tagColor: "primary" as const },
    { mode: "Bus (Volvo AC)", icon: Bus, price: "₹520", duration: "5h 45m", time: "10:00 PM", tag: "Budget", tagColor: "muted" as const },
  ];

  const stays = [
    { name: "Zostel Jaipur", type: "Budget", price: "₹600/night", rating: 4.0, location: "MI Road", reason: "Best for solo travelers & backpackers" },
    { name: "Holiday Inn Jaipur", type: "Mid-Range", price: "₹3,500/night", rating: 4.4, location: "Civil Lines", reason: "Perfect mix of comfort and value" },
    { name: "Rambagh Palace", type: "Premium", price: "₹15,000/night", rating: 4.9, location: "Bhawani Singh Rd", reason: "Royal heritage experience" },
  ];

  const localTransport = [
    { type: "Auto Rickshaw", estimate: "₹50–150/trip", note: "Negotiate fare beforehand" },
    { type: "Ola/Uber Cab", estimate: "₹100–300/trip", note: "Reliable & AC comfort" },
    { type: "Bike Rental", estimate: "₹400–600/day", note: "Best for exploring at your pace" },
    { type: "City Bus", estimate: "₹10–30/trip", note: "RSRTC runs regular routes" },
  ];

  const foodItems = [
    { name: "Dal Baati Churma", restaurant: "LMB", price: "₹200–350", mustTry: true },
    { name: "Laal Maas", restaurant: "Handi Restaurant", price: "₹300–500", mustTry: true },
    { name: "Pyaaz Kachori", restaurant: "Rawat Misthan Bhandar", price: "₹30–60", mustTry: true },
    { name: "Ghewar", restaurant: "Laxmi Misthan Bhandar", price: "₹80–150", mustTry: false },
    { name: "Lassi", restaurant: "Lassiwala (MI Road)", price: "₹40–80", mustTry: true },
  ];

  const hiddenGems = [
    { name: "Panna Meena Ka Kund", desc: "Stunning geometric stepwell — perfect for photos", instagrammable: true },
    { name: "Galtaji Temple", desc: "Hidden temple complex with natural springs in the hills", instagrammable: false },
    { name: "Patrika Gate", desc: "Colorful cultural gate showcasing Rajasthan's heritage", instagrammable: true },
    { name: "Nahargarh Stepwell", desc: "Secret stepwell few tourists know about", instagrammable: true },
  ];

  const budgetBreakdown = [
    { category: "Travel", amount: "₹1,560", icon: Plane },
    { category: "Stay", amount: "₹3,600", icon: Hotel },
    { category: "Food", amount: "₹2,000", icon: UtensilsCrossed },
    { category: "Activities", amount: "₹1,500", icon: Camera },
  ];
  const totalBudget = "₹8,660";

  const timeOfDayIcon = (period: string) => {
    if (period === "Morning") return Sun;
    if (period === "Afternoon") return Sunset;
    return Moon;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Cinematic entrance ── */}
      <AnimatePresence>
        {!entered && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black"
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent"
                  style={{
                    width: "120%",
                    top: `${20 + i * 8}%`,
                    opacity: 0.3 + Math.random() * 0.3,
                  }}
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 0.6 + Math.random() * 0.4,
                    delay: i * 0.05,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Cinematic Hero Section ── */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Background image with Ken Burns */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1 }}
          animate={{ scale: 1.12 }}
          transition={{ duration: 30, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
        >
          <img
            src={heroItinerary}
            alt=""
            className="h-full w-full object-cover brightness-[0.5]"
            draggable={false}
          />
        </motion.div>

        {/* Multi-layer dark cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        {/* Grain */}
        <div style={grainStyle} />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: "inset 0 0 200px 80px rgba(0,0,0,0.6)" }}
        />

        {/* Animated light streaks */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-[1px]"
              style={{
                width: `${40 + i * 8}%`,
                top: `${25 + i * 10}%`,
                left: "-20%",
                background: i % 2 === 0
                  ? `linear-gradient(90deg, transparent 0%, hsla(347,77%,50%,${0.08 + i * 0.02}) 40%, hsla(347,77%,55%,${0.15 + i * 0.02}) 60%, transparent 100%)`
                  : `linear-gradient(90deg, transparent 0%, hsla(0,0%,100%,${0.03 + i * 0.01}) 40%, hsla(0,0%,100%,${0.06 + i * 0.01}) 60%, transparent 100%)`,
              }}
              animate={{ x: ["-120%", "250%"] }}
              transition={{
                duration: 3 + i * 0.7,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.6,
              }}
            />
          ))}
        </div>

        {/* Soft ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 20% 80%, hsla(347,77%,50%,0.15) 0%, transparent 50%), " +
              "radial-gradient(ellipse at 80% 20%, hsla(347,77%,40%,0.08) 0%, transparent 40%)",
          }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 sm:pb-20 px-4">
          {/* Brand badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            className="mb-5 flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 backdrop-blur-sm"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">
              Yatri AI Itinerary
            </span>
          </motion.div>

          {/* Destination heading — blur-to-clear */}
          <motion.h1
            initial={{ opacity: 0, filter: "blur(20px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.6, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter text-white text-center"
            style={{ textShadow: "0 4px 40px rgba(0,0,0,0.5)" }}
          >
            {dest}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.7, ease: "easeOut" }}
            className="mt-4 text-sm sm:text-base text-white/35 font-medium tracking-wide"
          >
            <span className="text-primary font-semibold">{dur}</span> · {budget} Budget · {styles}
          </motion.p>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
            className="mt-6 h-[1px] w-32 origin-center bg-gradient-to-r from-transparent via-primary to-transparent"
          />
        </div>
      </div>

      {/* ── Floating Glass Search Summary ── */}
      <div className="relative z-10 -mt-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
          className="glass mx-auto max-w-4xl rounded-2xl p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Destination</p>
                <p className="text-sm font-bold text-foreground">{dest}</p>
              </div>
            </div>

            <div className="h-8 w-px bg-border hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Duration</p>
                <p className="text-sm font-bold text-foreground">{dur}</p>
              </div>
            </div>

            <div className="h-8 w-px bg-border hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Budget</p>
                <p className="text-sm font-bold text-foreground">{budget}</p>
              </div>
            </div>

            <div className="h-8 w-px bg-border hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <IndianRupee className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Estimated</p>
                <p className="text-sm font-bold text-foreground">{totalBudget}</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/")}
              className="rounded-xl border border-border bg-muted/50 px-5 py-2.5 text-xs font-semibold text-muted-foreground transition-all hover:bg-muted hover:text-foreground flex items-center gap-1.5"
            >
              <Edit3 size={12} /> Modify
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* ── View Toggle + Back ── */}
      <div className="mx-auto max-w-5xl px-4 pt-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="flex items-center justify-between mb-8"
        >
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={14} />
            Back
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${viewMode === "list" ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-muted/50 text-muted-foreground hover:text-foreground"}`}
            >
              <List size={12} /> List
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${viewMode === "map" ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-muted/50 text-muted-foreground hover:text-foreground"}`}
            >
              <Map size={12} /> Map
            </button>
          </div>
        </motion.div>
      </div>

      {/* ── Main Content ── */}
      <div className="mx-auto max-w-5xl px-4 space-y-10 pb-32">

        {/* ═══ 1. WEATHER PREVIEW ═══ */}
        <InteractiveCard index={0}>
          <div className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <CloudSun className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Weather Forecast</p>
                <p className="text-xs text-muted-foreground">Expected conditions during your trip</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {data.dayWisePlan.map((day) => (
                <div key={day.day} className="flex-1 min-w-[100px] rounded-xl border border-border/40 bg-secondary/30 p-3 text-center">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase">Day {day.day}</p>
                  <Sun size={20} className="mx-auto mt-1 text-amber-400" />
                  <p className="mt-1 text-sm font-bold text-foreground">28°C</p>
                  <p className="text-[10px] text-muted-foreground">Sunny</p>
                </div>
              ))}
            </div>
          </div>
        </InteractiveCard>

        {/* ═══ 2. TRAVEL RECOMMENDATIONS ═══ */}
        <Section title="Getting There" icon={Navigation} index={1}>
          <div className="space-y-3">
            {travelOptions.map((t, i) => (
              <InteractiveCard key={t.mode} index={i + 1}>
                <div className="flex items-center gap-4 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <t.icon size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-foreground">{t.mode}</p>
                      <Badge variant={t.tagColor}>{t.tag}</Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{t.time} · {t.duration}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-black text-foreground">{t.price}</p>
                    <BookButton />
                  </div>
                </div>
              </InteractiveCard>
            ))}
          </div>
        </Section>

        {/* ═══ 3. STAY RECOMMENDATIONS ═══ */}
        <Section title="Where to Stay" icon={Hotel} index={2}>
          <div className="space-y-3">
            {stays.map((s, i) => (
              <InteractiveCard key={s.name} index={i + 1}>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-foreground">{s.name}</p>
                        <Badge variant={s.type === "Premium" ? "primary" : "default"}>{s.type}</Badge>
                      </div>
                      <Stars rating={s.rating} />
                      <p className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1"><MapPin size={9} />{s.location}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-black text-foreground">{s.price}</p>
                      <BookButton />
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground italic">"{s.reason}"</p>
                </div>
              </InteractiveCard>
            ))}
          </div>
        </Section>

        {/* ═══ 4. DAY-BY-DAY TIMELINE ═══ */}
        <Section title="Day-by-Day Plan" icon={Clock} index={3}>
          <div className="space-y-3">
            {data.dayWisePlan.map((day) => (
              <CollapsibleCard
                key={day.day}
                defaultOpen={day.day === 1}
                trigger={
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">{day.day}</span>
                      <p className="text-sm font-semibold text-foreground">Day {day.day}: {day.title}</p>
                    </div>
                  </div>
                }
              >
                <div className="space-y-3 pl-8">
                  {(["Morning", "Afternoon", "Evening"] as const).map((period, pi) => {
                    const PIcon = timeOfDayIcon(period);
                    const activity = day.activities[pi] || "Free time";
                    const meal = day.meals[pi] || "";
                    return (
                      <div key={period} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary">
                            <PIcon size={12} className="text-foreground" />
                          </div>
                          {pi < 2 && <div className="w-px flex-1 bg-border/60 mt-1" />}
                        </div>
                        <div className="flex-1 pb-2">
                          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{period}</p>
                          <p className="text-sm text-foreground mt-0.5">{activity}</p>
                          {meal && <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1"><UtensilsCrossed size={9} />{meal}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CollapsibleCard>
            ))}
          </div>
        </Section>

        {/* ═══ 5. LOCAL TRANSPORT ═══ */}
        <Section title="Getting Around" icon={Car} index={4}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {localTransport.map((t, i) => (
              <InteractiveCard key={t.type} index={i}>
                <div className="px-4 py-3">
                  <p className="text-[12px] font-semibold text-foreground">{t.type}</p>
                  <p className="text-lg font-black text-primary mt-1">{t.estimate}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{t.note}</p>
                </div>
              </InteractiveCard>
            ))}
          </div>
        </Section>

        {/* ═══ 6. FAMOUS FOOD ═══ */}
        <Section title="Must-Try Food" icon={UtensilsCrossed} index={5}>
          <div className="space-y-3">
            {foodItems.map((f, i) => (
              <InteractiveCard key={f.name} index={i}>
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-foreground">{f.name}</p>
                      {f.mustTry && <Badge variant="primary">Must Try</Badge>}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{f.restaurant}</p>
                  </div>
                  <p className="text-sm font-black text-foreground shrink-0">{f.price}</p>
                </div>
              </InteractiveCard>
            ))}
          </div>
        </Section>

        {/* ═══ 7. HIDDEN GEMS ═══ */}
        <Section title="Hidden Gems" icon={Gem} index={6}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {hiddenGems.map((g, i) => (
              <InteractiveCard key={g.name} index={i}>
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-bold text-foreground">{g.name}</p>
                    {g.instagrammable && <Badge variant="primary"><Camera size={8} />Insta</Badge>}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{g.desc}</p>
                </div>
              </InteractiveCard>
            ))}
          </div>
        </Section>

        {/* ═══ 8. BUDGET BREAKDOWN ═══ */}
        <Section title="Budget Breakdown" icon={Wallet} index={7}>
          <InteractiveCard index={0}>
            <div className="p-5">
              <div className="space-y-3">
                {budgetBreakdown.map((b) => (
                  <div key={b.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                        <b.icon size={14} className="text-foreground" />
                      </div>
                      <p className="text-sm text-foreground">{b.category}</p>
                    </div>
                    <p className="text-sm font-bold text-foreground">{b.amount}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                <p className="text-sm font-bold text-foreground">Total Estimated</p>
                <p className="text-xl font-black text-primary">{totalBudget}</p>
              </div>
            </div>
          </InteractiveCard>
        </Section>

        {/* ═══ 9. MAP VIEW ═══ */}
        {viewMode === "map" && (
          <Section title="Route Map" icon={Map} index={8}>
            <InteractiveCard index={0}>
              <div className="relative h-64 bg-secondary flex items-center justify-center">
                <div className="text-center">
                  <Map size={32} className="mx-auto text-muted-foreground/40" />
                  <p className="mt-2 text-sm text-muted-foreground">Interactive map coming soon</p>
                  <p className="text-[11px] text-muted-foreground/60 mt-1">Route lines & key locations</p>
                </div>
                <div className="absolute top-6 left-8 flex items-center gap-1.5 rounded-full bg-card px-2.5 py-1 shadow-sm border border-border/40">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-[10px] font-medium text-foreground">Amber Fort</span>
                </div>
                <div className="absolute top-14 right-12 flex items-center gap-1.5 rounded-full bg-card px-2.5 py-1 shadow-sm border border-border/40">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-[10px] font-medium text-foreground">City Palace</span>
                </div>
                <div className="absolute bottom-8 left-16 flex items-center gap-1.5 rounded-full bg-card px-2.5 py-1 shadow-sm border border-border/40">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-[10px] font-medium text-foreground">Hotel</span>
                </div>
              </div>
            </InteractiveCard>
          </Section>
        )}

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4 pt-4 pb-8"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/plan", { state: { prompt: `Plan a ${dur} trip to ${dest}. Budget: ${budget}. Style: ${styles}. Provide a detailed day-by-day itinerary.` } })}
            className="group relative w-full max-w-md overflow-hidden rounded-xl bg-gradient-to-r from-primary to-[hsl(355,90%,55%)] px-8 py-4 text-sm font-bold text-white shadow-[0_0_30px_hsla(347,77%,50%,0.3)] transition-shadow duration-300 hover:shadow-[0_0_50px_hsla(347,77%,50%,0.5)]"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative flex items-center justify-center gap-2">
              Chat with AI for More Details
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </motion.button>
          <p className="text-[10px] text-muted-foreground">Powered by Yatri AI · Prices are estimates</p>
        </motion.div>
      </div>

      {/* ── Subtle ambient glow at bottom ── */}
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[hsla(347,77%,50%,0.05)] to-transparent" />
    </div>
  );
};

export default Itinerary;
