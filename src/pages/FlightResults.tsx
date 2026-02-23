import { useRef, useState, useEffect } from "react";
import flightHeroVideo from "@/assets/flight-hero.mp4";
import heroBusCinematic from "@/assets/hero-bus-cinematic.jpg";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, Calendar, Users, Clock, Plane, Briefcase } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

/* ── Mock flight data ── */
const FLIGHTS = [
  {
    id: 1,
    airline: "Air India",
    airlineCode: "AI",
    flightNo: "AI-302",
    departure: "06:15",
    arrival: "09:30",
    depCity: "DEL",
    arrCity: "DXB",
    duration: "3h 45m",
    stops: "Non-stop",
    price: 14999,
    originalPrice: 22499,
    cabin: "Economy",
  },
  {
    id: 2,
    airline: "Emirates",
    airlineCode: "EK",
    flightNo: "EK-511",
    departure: "10:45",
    arrival: "13:15",
    depCity: "DEL",
    arrCity: "DXB",
    duration: "3h 30m",
    stops: "Non-stop",
    price: 24599,
    originalPrice: 32999,
    cabin: "Business",
  },
  {
    id: 3,
    airline: "IndiGo",
    airlineCode: "6E",
    flightNo: "6E-1407",
    departure: "14:00",
    arrival: "17:45",
    depCity: "DEL",
    arrCity: "DXB",
    duration: "4h 15m",
    stops: "1 Stop (BOM)",
    price: 11299,
    originalPrice: 16499,
    cabin: "Economy",
  },
  {
    id: 4,
    airline: "Vistara",
    airlineCode: "UK",
    flightNo: "UK-854",
    departure: "22:30",
    arrival: "01:15",
    depCity: "DEL",
    arrCity: "DXB",
    duration: "3h 45m",
    stops: "Non-stop",
    price: 18750,
    originalPrice: 25999,
    cabin: "Premium Economy",
  },
  {
    id: 5,
    airline: "SpiceJet",
    airlineCode: "SG",
    flightNo: "SG-19",
    departure: "08:00",
    arrival: "12:30",
    depCity: "DEL",
    arrCity: "DXB",
    duration: "5h 00m",
    stops: "1 Stop (JAI)",
    price: 9499,
    originalPrice: 14299,
    cabin: "Economy",
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

/* ── Select Flight Button (Yatri red theme) ── */
function SelectFlightButton({ onClick }: { onClick?: () => void }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });

  return (
    <motion.button
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.12);
        y.set((e.clientY - r.top - r.height / 2) * 0.12);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[hsl(347,77%,50%)] to-[hsl(355,90%,55%)] px-6 py-3 text-sm font-bold text-white shadow-[0_0_30px_hsla(347,77%,50%,0.4)] transition-shadow duration-300 hover:shadow-[0_0_50px_hsla(347,77%,50%,0.6)]"
    >
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative flex items-center gap-2">
        Select Flight
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </motion.button>
  );
}

/* ── Flight Card (dark theme matching BusResults) ── */
function FlightCard({ flight, index }: { flight: (typeof FLIGHTS)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);

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
          rotateX.set(cy * -6);
          rotateY.set(cx * 6);
        }}
        onMouseLeave={() => { rotateX.set(0); rotateY.set(0); }}
        className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all duration-500 hover:border-primary/20 hover:shadow-[0_0_80px_hsla(347,77%,50%,0.12)]"
      >
        {/* Light sweep effect */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/[0.03] to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

        <div className="flex flex-col lg:flex-row items-stretch">
          {/* Airline Info - Left */}
          <div className="flex items-center gap-4 border-b lg:border-b-0 lg:border-r border-border p-5 lg:p-6 lg:w-[200px] flex-shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 p-2 flex-shrink-0">
              <span className="text-lg font-black text-primary">{flight.airlineCode}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{flight.airline}</p>
              <p className="text-xs text-muted-foreground">{flight.flightNo}</p>
            </div>
          </div>

          {/* Schedule - Center */}
          <div className="flex flex-1 items-center justify-between p-5 lg:p-6">
            <div className="text-center">
              <p className="text-2xl font-black tracking-tight text-foreground">{flight.departure}</p>
              <p className="text-xs font-semibold text-primary">{flight.depCity}</p>
            </div>

            <div className="flex flex-1 items-center gap-2 mx-4">
              <div className="h-px flex-1 bg-gradient-to-r from-border via-primary to-border" />
              <div className="flex flex-col items-center gap-0.5">
                <Plane className="h-4 w-4 text-primary rotate-45" />
                <span className="text-[10px] font-medium text-muted-foreground">{flight.duration}</span>
                <span className="text-[10px] text-muted-foreground">{flight.stops}</span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-border via-primary to-border" />
            </div>

            <div className="text-center">
              <p className="text-2xl font-black tracking-tight text-foreground">{flight.arrival}</p>
              <p className="text-xs font-semibold text-primary">{flight.arrCity}</p>
            </div>
          </div>

          {/* Price & CTA - Right */}
          <div className="flex items-center justify-between gap-4 border-t lg:border-t-0 lg:border-l border-border p-5 lg:p-6 lg:w-[240px] flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 + index * 0.05 }}
              viewport={{ once: true }}
            >
              <p className="text-xs text-muted-foreground line-through">₹{flight.originalPrice.toLocaleString("en-IN")}</p>
              <p className="text-2xl font-black tracking-tight text-foreground">
                <AnimatedPrice price={flight.price} />
              </p>
              <p className="text-[10px] font-medium text-primary">{flight.cabin}</p>
            </motion.div>

            <SelectFlightButton onClick={() => navigate("/plan")} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   FLIGHT RESULTS PAGE
═══════════════════════════════════════════════════ */
export default function FlightResults() {
  const [entered, setEntered] = useState(false);
  const location = useLocation();
  const state = location.state as { from?: string; to?: string; date?: string; passengers?: number; cabin?: string } | null;

  const from = state?.from || "Delhi";
  const to = state?.to || "Dubai";
  const date = state?.date || "15 Mar 2026";
  const passengers = state?.passengers || 1;
  const cabin = state?.cabin || "Economy";

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
        {/* Fallback poster image shown instantly while video loads */}
        <div
          className="absolute inset-0 bg-cover bg-center brightness-[0.5]"
          style={{ backgroundImage: `url(${heroBusCinematic})` }}
        />

        {/* Background video with slow zoom */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1 }}
          animate={{ scale: 1.12 }}
          transition={{ duration: 30, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="h-full w-full object-cover brightness-[0.5]"
            src={flightHeroVideo}
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

        {/* Animated headlight streaks */}
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
              Yatri Premium Flights
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
            <span className="text-[hsl(347,77%,55%)] font-semibold">{FLIGHTS.length}</span> premium flights found · Best fares guaranteed
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

      {/* ── Floating Glass Search Summary (dark glass) ── */}
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
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Cabin</p>
                <p className="text-sm font-bold text-foreground">{cabin}</p>
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
            <h2 className="text-2xl font-black tracking-tight">Available Flights</h2>
            <p className="mt-1 text-sm text-muted-foreground">Sorted by price · {FLIGHTS.length} results</p>
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
          {FLIGHTS.map((flight, i) => (
            <FlightCard key={flight.id} flight={flight} index={i} />
          ))}
        </div>
      </div>

      {/* ── Subtle ambient glow at bottom ── */}
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[hsla(347,77%,50%,0.05)] to-transparent" />
    </div>
  );
}
