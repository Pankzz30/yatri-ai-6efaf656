import { useRef, useState, useEffect } from "react";
import heroCabCinematic from "@/assets/hero-cab-cinematic.jpg";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, Calendar, Users, Clock, Star, Wifi, Zap, Shield, Car } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

/* ── Mock cab data ── */
const CABS = [
  {
    id: 1,
    name: "Toyota Innova Crysta",
    operator: "Yatri Premium Cabs",
    departure: "Anytime",
    arrival: "~3h 30m",
    duration: "3h 30m",
    price: 2499,
    originalPrice: 3499,
    rating: 4.8,
    reviews: 3240,
    seats: 6,
    type: "SUV Premium",
    amenities: ["wifi", "charging", "ac"],
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=800&q=80",
  },
  {
    id: 2,
    name: "Mercedes E-Class",
    operator: "LuxRide Select",
    departure: "Anytime",
    arrival: "~3h 15m",
    duration: "3h 15m",
    price: 4599,
    originalPrice: 5999,
    rating: 4.9,
    reviews: 1820,
    seats: 3,
    type: "Luxury Sedan",
    amenities: ["wifi", "charging", "ac"],
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80",
  },
  {
    id: 3,
    name: "Maruti Suzuki Ertiga",
    operator: "CityLink Cabs",
    departure: "Anytime",
    arrival: "~4h 00m",
    duration: "4h 00m",
    price: 1799,
    originalPrice: 2499,
    rating: 4.5,
    reviews: 5100,
    seats: 6,
    type: "MUV Comfort",
    amenities: ["charging", "ac"],
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
  },
  {
    id: 4,
    name: "Toyota Camry Hybrid",
    operator: "GreenCab India",
    departure: "Anytime",
    arrival: "~3h 20m",
    duration: "3h 20m",
    price: 3849,
    originalPrice: 4999,
    rating: 4.7,
    reviews: 960,
    seats: 3,
    type: "Sedan Premium",
    amenities: ["wifi", "charging", "ac"],
    image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80",
  },
  {
    id: 5,
    name: "Mahindra XUV700",
    operator: "DriveEasy",
    departure: "Anytime",
    arrival: "~3h 45m",
    duration: "3h 45m",
    price: 2199,
    originalPrice: 2999,
    rating: 4.6,
    reviews: 4200,
    seats: 6,
    type: "SUV Standard",
    amenities: ["charging", "ac"],
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80",
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
  ac: { icon: Shield, label: "AC Comfort" },
};

/* ── Magnetic Button ── */
function MagneticButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  return (
    <motion.button
      style={{ x: springX, y: springY }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * 0.15);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.15);
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

/* ── Price Counter Animation ── */
function AnimatedPrice({ price }: { price: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame: number;
    const start = Date.now();
    const duration = 1200;
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * price));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [price]);

  return <span ref={ref}>₹{display.toLocaleString("en-IN")}</span>;
}

/* ── Cab Card ── */
function CabCard({ cab, index }: { cab: (typeof CABS)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

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
          rotateX.set(cy * -8);
          rotateY.set(cx * 8);
        }}
        onMouseLeave={() => { rotateX.set(0); rotateY.set(0); }}
        className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all duration-500 hover:border-primary/20 hover:shadow-[0_0_80px_hsla(347,77%,50%,0.12)]"
      >
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

        <div className="flex flex-col lg:flex-row">
          {/* Cab Image */}
          <div className="relative h-56 lg:h-auto lg:w-[380px] overflow-hidden flex-shrink-0">
            <motion.img
              src={cab.image}
              alt={cab.name}
              className="h-full w-full object-cover"
              initial={{ scale: 1.1 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              viewport={{ once: true }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card" />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

            <div className="absolute top-4 left-4">
              <span className="rounded-lg bg-primary/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground backdrop-blur-sm">
                {cab.type}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-between p-6 lg:p-8">
            <div>
              <div className="mb-4 flex items-start justify-between">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    {cab.operator}
                  </p>
                  <h3 className="mt-1 text-xl font-bold tracking-tight text-foreground lg:text-2xl">
                    {cab.name}
                  </h3>
                </motion.div>

                <div className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5">
                  <Star className="h-3.5 w-3.5 fill-[hsl(45,93%,55%)] text-[hsl(45,93%,55%)]" />
                  <span className="text-sm font-bold text-foreground">{cab.rating}</span>
                  <span className="text-xs text-muted-foreground">({cab.reviews.toLocaleString()})</span>
                </div>
              </div>

              {/* Trip details */}
              <div className="mb-5 flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                  <Car className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{cab.seats} Seater</span>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Est. {cab.duration}</span>
                </div>
              </div>

              {/* Amenities */}
              <div className="flex gap-3">
                {cab.amenities.map((a) => {
                  const item = amenityIcons[a];
                  if (!item) return null;
                  const Icon = item.icon;
                  return (
                    <div key={a} className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price & CTA */}
            <div className="mt-6 flex items-end justify-between border-t border-border pt-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.05 }}
                viewport={{ once: true }}
              >
                <p className="text-xs text-muted-foreground line-through">₹{cab.originalPrice.toLocaleString("en-IN")}</p>
                <p className="text-3xl font-black tracking-tight text-foreground">
                  <AnimatedPrice price={cab.price} />
                </p>
                <p className="text-xs text-muted-foreground">per trip · {cab.seats} seats</p>
              </motion.div>

              <MagneticButton onClick={() => navigate("/plan")}>
                Book Cab
              </MagneticButton>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   CAB RESULTS PAGE
═══════════════════════════════════════════════════ */
export default function CabResults() {
  const [entered, setEntered] = useState(false);
  const location = useLocation();
  const state = location.state as { from?: string; to?: string; date?: string; passengers?: number } | null;

  const from = state?.from || "Delhi";
  const to = state?.to || "Jaipur";
  const date = state?.date || "28 Feb 2026";
  const passengers = state?.passengers || 1;

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

      {/* ── Hero ── */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1 }}
          animate={{ scale: 1.12 }}
          transition={{ duration: 30, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
        >
          <img
            src={heroCabCinematic}
            alt="Cinematic cab hero"
            className="h-full w-full object-cover object-[center_40%] sm:object-center brightness-[0.65]"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[hsl(0,0%,6%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(0,0%,6%)] via-transparent to-transparent" />
        <div style={grainStyle} />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: "inset 0 0 200px 80px rgba(0,0,0,0.6)" }}
        />

        {/* Animated light streaks */}
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
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            className="mb-5 flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 backdrop-blur-sm"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-[hsl(347,77%,50%)] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">
              Yatri Premium Cabs
            </span>
          </motion.div>

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

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7, ease: "easeOut" }}
            className="mt-4 text-sm sm:text-base text-white/35 font-medium tracking-wide"
          >
            <span className="text-[hsl(347,77%,55%)] font-semibold">{CABS.length}</span> premium cabs available · Instant booking
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.4, duration: 0.8, ease: "easeOut" }}
            className="mt-6 h-[1px] w-32 origin-center bg-gradient-to-r from-transparent via-[hsl(347,77%,50%)] to-transparent"
          />
        </div>
      </div>

      {/* ── Search Summary Card ── */}
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
            <h2 className="text-2xl font-black tracking-tight">Available Cabs</h2>
            <p className="mt-1 text-sm text-muted-foreground">Sorted by popularity · {CABS.length} results</p>
          </div>
          <div className="flex gap-2">
            {["Price", "Rating", "Type"].map((f) => (
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
          {CABS.map((cab, i) => (
            <CabCard key={cab.id} cab={cab} index={i} />
          ))}
        </div>
      </div>

      <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[hsla(347,77%,50%,0.05)] to-transparent" />
    </div>
  );
}
