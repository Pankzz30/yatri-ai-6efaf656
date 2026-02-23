import { useRef, useState, useEffect } from "react";
import heroTrainCinematic from "@/assets/hero-train-cinematic.jpg";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, Calendar, Users, Clock, TrainFront, Wifi, Zap, Shield, Star } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

/* ── Mock train data ── */
const TRAINS = [
  {
    id: 1,
    name: "Vande Bharat Express",
    trainNo: "22436",
    departure: "06:00",
    arrival: "14:30",
    depStation: "NDLS",
    arrStation: "PRYJ",
    duration: "8h 30m",
    stops: 4,
    price: 1795,
    originalPrice: 2440,
    classType: "Chair Car (CC)",
    rating: 4.8,
    reviews: 5200,
    seats: 24,
    amenities: ["wifi", "charging", "catering"],
  },
  {
    id: 2,
    name: "Rajdhani Express",
    trainNo: "12301",
    departure: "16:55",
    arrival: "08:15",
    depStation: "NDLS",
    arrStation: "HWH",
    duration: "15h 20m",
    stops: 3,
    price: 3145,
    originalPrice: 4200,
    classType: "3A (AC 3-Tier)",
    rating: 4.6,
    reviews: 8900,
    seats: 42,
    amenities: ["charging", "catering"],
  },
  {
    id: 3,
    name: "Shatabdi Express",
    trainNo: "12002",
    departure: "06:15",
    arrival: "12:10",
    depStation: "NDLS",
    arrStation: "HBJ",
    duration: "5h 55m",
    stops: 2,
    price: 1135,
    originalPrice: 1650,
    classType: "Chair Car (CC)",
    rating: 4.5,
    reviews: 6100,
    seats: 56,
    amenities: ["catering", "charging"],
  },
  {
    id: 4,
    name: "Duronto Express",
    trainNo: "12213",
    departure: "23:00",
    arrival: "14:35",
    depStation: "NDLS",
    arrStation: "BCT",
    duration: "15h 35m",
    stops: 0,
    price: 2780,
    originalPrice: 3800,
    classType: "2A (AC 2-Tier)",
    rating: 4.7,
    reviews: 3400,
    seats: 18,
    amenities: ["charging", "catering"],
  },
  {
    id: 5,
    name: "Tejas Express",
    trainNo: "82502",
    departure: "06:25",
    arrival: "13:45",
    depStation: "NDLS",
    arrStation: "LKO",
    duration: "7h 20m",
    stops: 1,
    price: 1520,
    originalPrice: 2100,
    classType: "Executive (EC)",
    rating: 4.9,
    reviews: 2700,
    seats: 32,
    amenities: ["wifi", "charging", "catering"],
  },
];

/* ── Film grain overlay ── */
const grainStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  opacity: 0.04,
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
  backgroundSize: "128px 128px",
};

/* ── Amenity icon map ── */
const amenityIcons: Record<string, { icon: typeof Wifi; label: string }> = {
  wifi: { icon: Wifi, label: "Free WiFi" },
  charging: { icon: Zap, label: "USB Charging" },
  catering: { icon: Shield, label: "Onboard Meals" },
};

/* ── Animated Price ── */
function AnimatedPrice({ price }: { price: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let frame: number;
    const start = Date.now();
    const dur = 1200;
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      setDisplay(Math.round((1 - Math.pow(1 - p, 3)) * price));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [price]);
  return <span>₹{display.toLocaleString("en-IN")}</span>;
}

/* ── Magnetic Button ── */
function MagneticButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });

  return (
    <motion.button
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.15);
        y.set((e.clientY - r.top - r.height / 2) * 0.15);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[hsl(347,77%,50%)] to-[hsl(355,90%,55%)] px-6 py-3 text-sm font-bold text-white shadow-[0_0_30px_hsla(347,77%,50%,0.4)] transition-shadow duration-300 hover:shadow-[0_0_50px_hsla(347,77%,50%,0.6)]"
    >
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative flex items-center gap-2">
        {children}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </motion.button>
  );
}

/* ── Train Card ── */
function TrainCard({ train, index }: { train: (typeof TRAINS)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [25, -25]);

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
      className="w-full"
    >
      <motion.div
        style={{
          y,
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformPerspective: 1200,
        }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const cx = (e.clientX - rect.left) / rect.width - 0.5;
          const cy = (e.clientY - rect.top) / rect.height - 0.5;
          rotateX.set(cy * -7);
          rotateY.set(cx * 7);
        }}
        onMouseLeave={() => { rotateX.set(0); rotateY.set(0); }}
        className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all duration-500 hover:border-primary/20 hover:shadow-[0_0_80px_hsla(347,77%,50%,0.12)]"
      >
        {/* Light sweep */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/[0.03] to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

        <div className="flex flex-col lg:flex-row items-stretch">
          {/* Train Info - Left */}
          <div className="flex items-center gap-4 border-b lg:border-b-0 lg:border-r border-border p-5 lg:p-6 lg:w-[220px] flex-shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 p-2 flex-shrink-0">
              <TrainFront className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{train.name}</p>
              <p className="text-xs text-muted-foreground">#{train.trainNo}</p>
              <div className="mt-1 flex items-center gap-1">
                <Star className="h-3 w-3 fill-[hsl(45,93%,55%)] text-[hsl(45,93%,55%)]" />
                <span className="text-[10px] font-semibold text-foreground">{train.rating}</span>
                <span className="text-[10px] text-muted-foreground">({train.reviews.toLocaleString()})</span>
              </div>
            </div>
          </div>

          {/* Schedule - Center */}
          <div className="flex flex-1 items-center justify-between p-5 lg:p-6">
            <div className="text-center">
              <p className="text-2xl font-black tracking-tight text-foreground">{train.departure}</p>
              <p className="text-xs font-semibold text-primary">{train.depStation}</p>
            </div>

            <div className="flex flex-1 items-center gap-2 mx-4">
              <div className="h-px flex-1 bg-gradient-to-r from-border via-primary to-border" />
              <div className="flex flex-col items-center gap-0.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-medium text-muted-foreground">{train.duration}</span>
                <span className="text-[10px] text-muted-foreground">
                  {train.stops === 0 ? "Non-stop" : `${train.stops} stop${train.stops > 1 ? "s" : ""}`}
                </span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-border via-primary to-border" />
            </div>

            <div className="text-center">
              <p className="text-2xl font-black tracking-tight text-foreground">{train.arrival}</p>
              <p className="text-xs font-semibold text-primary">{train.arrStation}</p>
            </div>
          </div>

          {/* Right Panel: Amenities + Price + CTA */}
          <div className="flex flex-col gap-3 border-t lg:border-t-0 lg:border-l border-border p-5 lg:p-6 lg:w-[280px] flex-shrink-0">
            {/* Amenities */}
            <div className="flex flex-wrap gap-2">
              {train.amenities.map((a) => {
                const item = amenityIcons[a];
                if (!item) return null;
                const Icon = item.icon;
                return (
                  <div key={a} className="flex items-center gap-1 rounded-md bg-muted px-2 py-1">
                    <Icon className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">{item.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Price & CTA */}
            <div className="flex items-end justify-between">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 + index * 0.05 }}
                viewport={{ once: true }}
              >
                <p className="text-xs text-muted-foreground line-through">₹{train.originalPrice.toLocaleString("en-IN")}</p>
                <p className="text-2xl font-black tracking-tight text-foreground">
                  <AnimatedPrice price={train.price} />
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-medium text-primary">{train.classType}</p>
                  <span className="text-[10px] text-muted-foreground">· {train.seats} seats</span>
                </div>
              </motion.div>

              <MagneticButton onClick={() => navigate("/plan")}>
                Book Now
              </MagneticButton>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   TRAIN RESULTS PAGE
═══════════════════════════════════════════════════ */
export default function TrainResults() {
  const [entered, setEntered] = useState(false);
  const location = useLocation();
  const state = location.state as { from?: string; to?: string; date?: string; passengers?: number; classType?: string } | null;

  const from = state?.from || "New Delhi";
  const to = state?.to || "Mumbai";
  const date = state?.date || "20 Mar 2026";
  const passengers = state?.passengers || 1;
  const classType = state?.classType || "All Classes";

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

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
                  className="absolute h-[1px] bg-gradient-to-r from-transparent via-[hsl(347,77%,50%)] to-transparent"
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

      {/* ── Hero Section ── */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1 }}
          animate={{ scale: 1.12 }}
          transition={{ duration: 30, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
        >
          <img
            src={heroTrainCinematic}
            alt="Cinematic train hero"
            className="h-full w-full object-cover object-[center_40%] sm:object-center brightness-[0.6]"
          />
        </motion.div>

        {/* Multi-layer dark cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[hsl(0,0%,6%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(0,0%,6%)] via-transparent to-transparent" />

        {/* Grain */}
        <div style={grainStyle} />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: "inset 0 0 200px 80px rgba(0,0,0,0.6)" }}
        />

        {/* Animated rail streaks */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-[1px]"
              style={{
                width: `${40 + i * 8}%`,
                top: `${25 + i * 8}%`,
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

        {/* Soft red ambient glow */}
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
            <div className="h-1.5 w-1.5 rounded-full bg-[hsl(347,77%,50%)] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">
              Yatri Premium Trains
            </span>
          </motion.div>

          {/* Route heading — blur-to-clear */}
          <div className="flex items-center gap-2 sm:gap-4">
            <motion.span
              initial={{ opacity: 0, filter: "blur(20px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.6, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter text-white"
              style={{ textShadow: "0 4px 40px rgba(0,0,0,0.5)" }}
            >
              {from}
            </motion.span>

            <motion.span
              initial={{ opacity: 0, x: -30, scale: 0.5 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-2xl sm:text-4xl lg:text-5xl font-light text-[hsl(347,77%,50%)]"
              style={{ textShadow: "0 0 30px hsla(347,77%,50%,0.4)" }}
            >
              →
            </motion.span>

            <motion.span
              initial={{ opacity: 0, filter: "blur(20px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.8, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter text-white"
              style={{ textShadow: "0 4px 40px rgba(0,0,0,0.5)" }}
            >
              {to}
            </motion.span>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7, ease: "easeOut" }}
            className="mt-4 text-sm sm:text-base text-white/35 font-medium tracking-wide"
          >
            <span className="text-[hsl(347,77%,55%)] font-semibold">{TRAINS.length}</span> premium trains found · IRCTC verified fares
          </motion.p>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.4, duration: 0.8, ease: "easeOut" }}
            className="mt-6 h-[1px] w-32 origin-center bg-gradient-to-r from-transparent via-[hsl(347,77%,50%)] to-transparent"
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
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Route</p>
                <p className="text-sm font-bold text-foreground">{from} → {to}</p>
              </div>
            </div>

            <div className="h-8 w-px bg-border hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Date</p>
                <p className="text-sm font-bold text-foreground">{date}</p>
              </div>
            </div>

            <div className="h-8 w-px bg-border hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Passengers</p>
                <p className="text-sm font-bold text-foreground">{passengers} Traveller{passengers > 1 ? "s" : ""}</p>
              </div>
            </div>

            <div className="h-8 w-px bg-border hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <TrainFront className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Class</p>
                <p className="text-sm font-bold text-foreground">{classType}</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-xl border border-border bg-muted/50 px-5 py-2.5 text-xs font-semibold text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              Modify Search
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* ── Results ── */}
      <div className="mx-auto max-w-5xl px-4 pb-32 pt-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mb-10 flex items-center justify-between"
        >
          <div>
            <h2 className="text-2xl font-black tracking-tight">Available Trains</h2>
            <p className="mt-1 text-sm text-muted-foreground">Sorted by departure · {TRAINS.length} results</p>
          </div>
          <div className="flex gap-2">
            {["Price", "Duration", "Departure"].map((f) => (
              <button
                key={f}
                className="rounded-lg border border-border bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-primary/30 hover:bg-muted hover:text-foreground"
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="space-y-8">
          {TRAINS.map((train, i) => (
            <TrainCard key={train.id} train={train} index={i} />
          ))}
        </div>
      </div>

      {/* ── Subtle ambient glow at bottom ── */}
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[hsla(347,77%,50%,0.05)] to-transparent" />
    </div>
  );
}
