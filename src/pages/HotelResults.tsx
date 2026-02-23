import { useRef, useState, useEffect } from "react";
import heroHotelCinematic from "@/assets/hero-hotel-cinematic.jpg";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, Calendar, Users, Star, Wifi, Car, Coffee, Waves } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

/* ── Mock hotel data ── */
const HOTELS = [
  {
    id: 1,
    name: "The Oberoi Amarvilas",
    location: "Agra, Uttar Pradesh",
    rating: 4.9,
    reviews: 2340,
    price: 18500,
    originalPrice: 28000,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
    type: "5-Star Luxury",
    amenities: ["Pool", "Spa", "WiFi", "Parking"],
    distance: "600m from Taj Mahal",
  },
  {
    id: 2,
    name: "Taj Lake Palace",
    location: "Udaipur, Rajasthan",
    rating: 4.8,
    reviews: 1890,
    price: 24999,
    originalPrice: 38000,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400",
    type: "Heritage Palace",
    amenities: ["Pool", "Spa", "WiFi", "Restaurant"],
    distance: "On Lake Pichola",
  },
  {
    id: 3,
    name: "ITC Grand Chola",
    location: "Chennai, Tamil Nadu",
    rating: 4.7,
    reviews: 3120,
    price: 12999,
    originalPrice: 19500,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
    type: "5-Star Business",
    amenities: ["Pool", "Gym", "WiFi", "Parking"],
    distance: "Near Guindy",
  },
  {
    id: 4,
    name: "Zostel Manali",
    location: "Manali, Himachal Pradesh",
    rating: 4.3,
    reviews: 4560,
    price: 899,
    originalPrice: 1499,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
    type: "Hostel",
    amenities: ["WiFi", "Café", "Common Area"],
    distance: "Old Manali Road",
  },
  {
    id: 5,
    name: "The Leela Palace",
    location: "New Delhi",
    rating: 4.9,
    reviews: 2780,
    price: 21500,
    originalPrice: 32000,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400",
    type: "5-Star Luxury",
    amenities: ["Pool", "Spa", "WiFi", "Butler"],
    distance: "Diplomatic Enclave",
  },
];

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  Pool: <Waves className="h-3 w-3" />,
  Spa: <Coffee className="h-3 w-3" />,
  WiFi: <Wifi className="h-3 w-3" />,
  Parking: <Car className="h-3 w-3" />,
  Gym: <Star className="h-3 w-3" />,
  Restaurant: <Coffee className="h-3 w-3" />,
  Café: <Coffee className="h-3 w-3" />,
  Butler: <Star className="h-3 w-3" />,
  "Common Area": <Users className="h-3 w-3" />,
};

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

/* ── Book Now Button ── */
function BookNowButton({ onClick }: { onClick?: () => void }) {
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
        Book Now
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </motion.button>
  );
}

/* ── Hotel Card ── */
function HotelCard({ hotel, index }: { hotel: (typeof HOTELS)[0]; index: number }) {
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
        style={{ y, rotateX: springRotateX, rotateY: springRotateY, transformPerspective: 1200 }}
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
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/[0.03] to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

        <div className="flex flex-col lg:flex-row items-stretch">
          {/* Hotel Image */}
          <div className="relative h-48 lg:h-auto lg:w-[220px] flex-shrink-0 overflow-hidden">
            <img
              src={hotel.image}
              alt={hotel.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/20" />
            <div className="absolute top-3 left-3 rounded-lg bg-black/60 backdrop-blur-sm px-2.5 py-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white">{hotel.type}</span>
            </div>
          </div>

          {/* Hotel Details */}
          <div className="flex flex-1 flex-col justify-between p-5 lg:p-6">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-black tracking-tight text-foreground">{hotel.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {hotel.location}
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1">
                  <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                  <span className="text-sm font-bold text-primary">{hotel.rating}</span>
                </div>
              </div>

              <p className="mt-1.5 text-[11px] text-muted-foreground">{hotel.distance} · {hotel.reviews.toLocaleString()} reviews</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {hotel.amenities.map((a) => (
                  <span key={a} className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {AMENITY_ICONS[a]} {a}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between gap-4 border-t lg:border-t-0 lg:border-l border-border p-5 lg:p-6 lg:w-[220px] flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 + index * 0.05 }}
              viewport={{ once: true }}
            >
              <p className="text-xs text-muted-foreground line-through">₹{hotel.originalPrice.toLocaleString("en-IN")}</p>
              <p className="text-2xl font-black tracking-tight text-foreground">
                <AnimatedPrice price={hotel.price} />
              </p>
              <p className="text-[10px] font-medium text-muted-foreground">per night</p>
            </motion.div>

            <BookNowButton onClick={() => navigate("/plan")} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   HOTEL RESULTS PAGE
═══════════════════════════════════════════════════ */
export default function HotelResults() {
  const [entered, setEntered] = useState(false);
  const location = useLocation();
  const state = location.state as { destination?: string; checkIn?: string; checkOut?: string; guests?: number; rooms?: number } | null;

  const destination = state?.destination || "Jaipur";
  const checkIn = state?.checkIn || "15 Mar 2026";
  const checkOut = state?.checkOut || "18 Mar 2026";
  const guests = state?.guests || 2;
  const rooms = state?.rooms || 1;

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
                  style={{ width: "120%", top: `${20 + i * 8}%`, opacity: 0.3 + Math.random() * 0.3 }}
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 0.6 + Math.random() * 0.4, delay: i * 0.05, ease: "easeOut" }}
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
          animate={{ scale: 1.08 }}
          transition={{ duration: 30, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
        >
          <img
            src={heroHotelCinematic}
            alt="Luxury hotel"
            className="h-full w-full object-cover object-[center_40%] brightness-[0.45]"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[hsl(0,0%,6%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(0,0%,6%)] via-transparent to-transparent" />
        <div style={grainStyle} />
        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 200px 80px rgba(0,0,0,0.6)" }} />

        {/* Ambient golden glow streaks */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-[1px]"
              style={{
                width: `${40 + i * 8}%`,
                top: `${25 + i * 10}%`,
                left: "-20%",
                background: `linear-gradient(90deg, transparent 0%, hsla(347,77%,50%,${0.06 + i * 0.02}) 40%, hsla(347,77%,55%,${0.12 + i * 0.02}) 60%, transparent 100%)`,
              }}
              animate={{ x: ["-120%", "250%"] }}
              transition={{ duration: 4 + i * 0.8, repeat: Infinity, ease: "linear", delay: i * 0.7 }}
            />
          ))}
        </div>

        <div className="absolute inset-0 pointer-events-none opacity-30" style={{
          background: "radial-gradient(ellipse at 20% 80%, hsla(347,77%,50%,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, hsla(347,77%,40%,0.08) 0%, transparent 40%)",
        }} />

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
              Yatri Premium Stays
            </span>
          </motion.div>

          <motion.span
            initial={{ opacity: 0, filter: "blur(20px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.6, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter text-white text-center"
            style={{ textShadow: "0 4px 40px rgba(0,0,0,0.5)" }}
          >
            {destination}
          </motion.span>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.7, ease: "easeOut" }}
            className="mt-4 text-sm sm:text-base text-white/35 font-medium tracking-wide"
          >
            <span className="text-[hsl(347,77%,55%)] font-semibold">{HOTELS.length}</span> premium stays found · Best rates guaranteed
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
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
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Destination</p>
                <p className="text-sm font-bold text-foreground">{destination}</p>
              </div>
            </div>

            <div className="h-8 w-px bg-border hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Check-in / Out</p>
                <p className="text-sm font-bold text-foreground">{checkIn} — {checkOut}</p>
              </div>
            </div>

            <div className="h-8 w-px bg-border hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Guests & Rooms</p>
                <p className="text-sm font-bold text-foreground">{guests} Guest{guests > 1 ? "s" : ""} · {rooms} Room{rooms > 1 ? "s" : ""}</p>
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
            <h2 className="text-2xl font-black tracking-tight">Available Hotels</h2>
            <p className="mt-1 text-sm text-muted-foreground">Sorted by rating · {HOTELS.length} results</p>
          </div>
          <div className="flex gap-2">
            {["Price", "Rating", "Distance"].map((f) => (
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
          {HOTELS.map((hotel, i) => (
            <HotelCard key={hotel.id} hotel={hotel} index={i} />
          ))}
        </div>
      </div>

      <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[hsla(347,77%,50%,0.05)] to-transparent" />
    </div>
  );
}
