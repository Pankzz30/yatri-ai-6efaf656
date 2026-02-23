import { useRef, useState, useEffect } from "react";
import flightHeroVideo from "@/assets/flight-hero.mp4";
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
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Air_India_Logo.svg/200px-Air_India_Logo.svg.png",
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
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/200px-Emirates_logo.svg.png",
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
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IndiGo_Airlines_logo.svg/200px-IndiGo_Airlines_logo.svg.png",
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
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Vistara_Logo.svg/200px-Vistara_Logo.svg.png",
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
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/SpiceJet_logo.svg/200px-SpiceJet_logo.svg.png",
  },
];

/* ── Film grain overlay ── */
const grainStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  opacity: 0.03,
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

/* ── Select Flight Button ── */
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
      className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[hsl(205,85%,50%)] to-[hsl(210,90%,58%)] px-6 py-3 text-sm font-bold text-white shadow-[0_0_30px_hsla(205,85%,50%,0.35)] transition-shadow duration-300 hover:shadow-[0_0_50px_hsla(205,85%,50%,0.55)]"
    >
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative flex items-center gap-2">
        Select Flight
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </motion.button>
  );
}

/* ── Flight Card ── */
function FlightCard({ flight, index }: { flight: (typeof FLIGHTS)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);

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
        style={{ y }}
        className="group relative overflow-hidden rounded-2xl border border-[hsl(210,30%,92%)] bg-white shadow-[0_4px_24px_hsla(210,50%,70%,0.08)] transition-all duration-500 hover:border-[hsla(205,85%,50%,0.3)] hover:shadow-[0_20px_60px_hsla(205,85%,50%,0.12)]"
      >
        {/* Hover sweep */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[hsla(205,85%,55%,0.04)] to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

        <div className="flex flex-col lg:flex-row items-stretch">
          {/* Airline Info - Left */}
          <div className="flex items-center gap-4 border-b lg:border-b-0 lg:border-r border-[hsl(210,30%,94%)] p-5 lg:p-6 lg:w-[200px] flex-shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(210,40%,97%)] p-2 flex-shrink-0">
              <span className="text-lg font-black text-[hsl(205,85%,45%)]">{flight.airlineCode}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-[hsl(220,14%,10%)]">{flight.airline}</p>
              <p className="text-xs text-[hsl(220,9%,46%)]">{flight.flightNo}</p>
            </div>
          </div>

          {/* Schedule - Center */}
          <div className="flex flex-1 items-center justify-between p-5 lg:p-6">
            <div className="text-center">
              <p className="text-2xl font-black tracking-tight text-[hsl(220,14%,10%)]">{flight.departure}</p>
              <p className="text-xs font-semibold text-[hsl(205,85%,50%)]">{flight.depCity}</p>
            </div>

            <div className="flex flex-1 items-center gap-2 mx-4">
              <div className="h-px flex-1 bg-gradient-to-r from-[hsl(210,30%,90%)] via-[hsl(205,85%,70%)] to-[hsl(210,30%,90%)]" />
              <div className="flex flex-col items-center gap-0.5">
                <Plane className="h-4 w-4 text-[hsl(205,85%,50%)] rotate-45" />
                <span className="text-[10px] font-medium text-[hsl(220,9%,46%)]">{flight.duration}</span>
                <span className="text-[10px] text-[hsl(220,9%,56%)]">{flight.stops}</span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-[hsl(210,30%,90%)] via-[hsl(205,85%,70%)] to-[hsl(210,30%,90%)]" />
            </div>

            <div className="text-center">
              <p className="text-2xl font-black tracking-tight text-[hsl(220,14%,10%)]">{flight.arrival}</p>
              <p className="text-xs font-semibold text-[hsl(205,85%,50%)]">{flight.arrCity}</p>
            </div>
          </div>

          {/* Price & CTA - Right */}
          <div className="flex items-center justify-between gap-4 border-t lg:border-t-0 lg:border-l border-[hsl(210,30%,94%)] p-5 lg:p-6 lg:w-[240px] flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 + index * 0.05 }}
              viewport={{ once: true }}
            >
              <p className="text-xs text-[hsl(220,9%,56%)] line-through">₹{flight.originalPrice.toLocaleString("en-IN")}</p>
              <p className="text-2xl font-black tracking-tight text-[hsl(220,14%,10%)]">
                <AnimatedPrice price={flight.price} />
              </p>
              <p className="text-[10px] font-medium text-[hsl(205,85%,50%)]">{flight.cabin}</p>
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
    <div className="min-h-screen bg-[hsl(210,40%,98%)]">
      {/* ── Cinematic entrance ── */}
      <AnimatePresence>
        {!entered && (
          <motion.div
            className="fixed inset-0 z-[100] bg-[hsl(210,50%,10%)]"
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-[1px] bg-gradient-to-r from-transparent via-[hsl(205,85%,60%)] to-transparent"
                  style={{ width: "120%", top: `${25 + i * 10}%`, opacity: 0.4 }}
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 0.5 + i * 0.08, delay: i * 0.04, ease: "easeOut" }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero Section ── */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Background video with slow zoom */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1 }}
          animate={{ scale: 1.1 }}
          transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover brightness-[0.7]"
            src={flightHeroVideo}
          />
        </motion.div>

        {/* Soft white + sky gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsla(210,50%,10%,0.3)] via-transparent to-[hsl(210,40%,98%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsla(210,50%,15%,0.2)] via-transparent to-[hsla(210,50%,15%,0.1)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(210,40%,98%)] via-transparent to-transparent" />

        {/* Grain */}
        <div style={grainStyle} />

        {/* Ambient sky glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, hsla(35,90%,60%,0.12) 0%, transparent 50%), " +
              "radial-gradient(ellipse at 70% 70%, hsla(205,85%,55%,0.08) 0%, transparent 40%)",
          }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 sm:pb-20 px-4">
          {/* Brand badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            className="mb-5 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md"
          >
            <Plane className="h-3 w-3 text-white" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/80">
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
              style={{ textShadow: "0 4px 40px rgba(0,0,0,0.3)" }}
            >
              {from}
            </motion.span>

            <motion.span
              initial={{ opacity: 0, x: -30, scale: 0.5 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-2xl sm:text-4xl lg:text-5xl font-light text-[hsl(205,85%,65%)]"
              style={{ textShadow: "0 0 30px hsla(205,85%,50%,0.4)" }}
            >
              →
            </motion.span>

            <motion.span
              initial={{ opacity: 0, filter: "blur(20px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.8, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter text-white"
              style={{ textShadow: "0 4px 40px rgba(0,0,0,0.3)" }}
            >
              {to}
            </motion.span>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7, ease: "easeOut" }}
            className="mt-4 text-sm sm:text-base text-white/60 font-medium tracking-wide"
          >
            <span className="text-[hsl(205,85%,70%)] font-semibold">{FLIGHTS.length}</span> premium flights found · Best fares guaranteed
          </motion.p>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.4, duration: 0.8, ease: "easeOut" }}
            className="mt-6 h-[1px] w-32 origin-center bg-gradient-to-r from-transparent via-[hsl(205,85%,60%)] to-transparent"
          />
        </div>
      </div>

      {/* ── Floating Glass Search Summary ── */}
      <div className="relative z-10 -mt-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
          className="mx-auto max-w-4xl rounded-2xl border border-[hsl(210,30%,90%)] bg-white/80 p-5 backdrop-blur-xl shadow-[0_8px_40px_hsla(210,50%,70%,0.12)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(205,85%,95%)]">
                <MapPin className="h-5 w-5 text-[hsl(205,85%,50%)]" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(220,9%,56%)]">Route</p>
                <p className="text-sm font-bold text-[hsl(220,14%,10%)]">{from} → {to}</p>
              </div>
            </div>

            <div className="h-8 w-px bg-[hsl(210,30%,92%)] hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(205,85%,95%)]">
                <Calendar className="h-5 w-5 text-[hsl(205,85%,50%)]" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(220,9%,56%)]">Date</p>
                <p className="text-sm font-bold text-[hsl(220,14%,10%)]">{date}</p>
              </div>
            </div>

            <div className="h-8 w-px bg-[hsl(210,30%,92%)] hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(205,85%,95%)]">
                <Users className="h-5 w-5 text-[hsl(205,85%,50%)]" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(220,9%,56%)]">Passengers</p>
                <p className="text-sm font-bold text-[hsl(220,14%,10%)]">{passengers} Traveller{passengers > 1 ? "s" : ""}</p>
              </div>
            </div>

            <div className="h-8 w-px bg-[hsl(210,30%,92%)] hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(205,85%,95%)]">
                <Briefcase className="h-5 w-5 text-[hsl(205,85%,50%)]" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(220,9%,56%)]">Cabin</p>
                <p className="text-sm font-bold text-[hsl(220,14%,10%)]">{cabin}</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-xl border border-[hsl(210,30%,90%)] bg-[hsl(210,40%,97%)] px-5 py-2.5 text-xs font-semibold text-[hsl(220,14%,30%)] transition-all hover:bg-[hsl(205,85%,95%)] hover:text-[hsl(205,85%,45%)]"
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
            <h2 className="text-2xl font-black tracking-tight text-[hsl(220,14%,10%)]">Available Flights</h2>
            <p className="mt-1 text-sm text-[hsl(220,9%,56%)]">Sorted by price · {FLIGHTS.length} results</p>
          </div>
          <div className="flex gap-2">
            {["Price", "Duration", "Departure"].map((f) => (
              <button
                key={f}
                className="rounded-lg border border-[hsl(210,30%,90%)] bg-white px-4 py-2 text-xs font-medium text-[hsl(220,9%,46%)] transition-all hover:border-[hsl(205,85%,70%)] hover:bg-[hsl(205,85%,97%)] hover:text-[hsl(205,85%,45%)]"
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="space-y-6">
          {FLIGHTS.map((flight, i) => (
            <FlightCard key={flight.id} flight={flight} index={i} />
          ))}
        </div>
      </div>

      {/* ── Subtle ambient glow at bottom ── */}
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[hsla(205,85%,50%,0.04)] to-transparent" />
    </div>
  );
}
