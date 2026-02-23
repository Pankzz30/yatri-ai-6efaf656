import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Clock, Wallet, Plane, Train, Bus, Hotel, Star, ChevronDown,
  Sun, Sunset, Moon, Car, UtensilsCrossed, Camera,
  Gem, ArrowLeft, Edit3, CloudSun, Map, List, Navigation,
  IndianRupee,
} from "lucide-react";
import { mockItinerary } from "@/data/mockData";

/* ── Fade-up animation ──────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

/* ── Section wrapper ────────────────────────────── */
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

/* ── Collapsible card ───────────────────────────── */
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

/* ── Badge ──────────────────────────────────────── */
const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "primary" | "muted" }) => {
  const cls = variant === "primary"
    ? "bg-primary/10 text-primary"
    : variant === "muted"
    ? "bg-muted text-muted-foreground"
    : "bg-secondary text-foreground";
  return <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium ${cls}`}>{children}</span>;
};

/* ── Star rating ────────────────────────────────── */
const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(i => (
      <Star key={i} size={10} className={i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"} />
    ))}
    <span className="ml-1 text-[10px] text-muted-foreground">{rating}</span>
  </div>
);

/* ═══════════════════════════════════════════════════
   ITINERARY PAGE
═══════════════════════════════════════════════════ */
const Itinerary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { destination?: string; duration?: string; budget?: string; styles?: string } | null;
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const dest = state?.destination || "Jaipur";
  const dur = state?.duration || "3 Days";
  const budget = state?.budget || "Balanced";
  const styles = state?.styles || "Adventure";
  const data = mockItinerary;

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
    <div className="min-h-screen bg-background pt-16 pb-24">
      {/* ── Top bar ── */}
      <div className="sticky top-16 z-30 border-b border-border/60 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 max-w-3xl">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={14} />
            Back
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List size={12} /> List
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${viewMode === "map" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Map size={12} /> Map
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 space-y-10 pt-8">

        {/* ═══ 1. TRIP SUMMARY ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="rounded-2xl border border-border/40 bg-card p-5 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Your Trip</p>
              <h1 className="mt-1 text-2xl font-bold text-foreground tracking-tight">{dest}</h1>
            </div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1 rounded-lg border border-border/60 px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
            >
              <Edit3 size={11} /> Edit
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge><Clock size={9} />{dur}</Badge>
            <Badge><Wallet size={9} />{budget}</Badge>
            <Badge variant="primary">{styles}</Badge>
            <Badge variant="muted"><CloudSun size={9} />28°C Sunny</Badge>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2">
            <IndianRupee size={14} className="text-primary" />
            <div>
              <p className="text-[11px] text-muted-foreground">Estimated Total</p>
              <p className="text-sm font-bold text-foreground">{totalBudget}</p>
            </div>
          </div>
        </motion.div>

        {/* ═══ 2. TRAVEL RECOMMENDATIONS ═══ */}
        <Section title="Getting There" icon={Navigation} index={1}>
          <div className="space-y-2">
            {travelOptions.map((t) => (
              <div key={t.mode} className="flex items-center gap-3 rounded-xl border border-border/40 bg-card px-4 py-3 transition-shadow hover:shadow-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <t.icon size={16} className="text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{t.mode}</p>
                    <Badge variant={t.tagColor}>{t.tag}</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{t.time} · {t.duration}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-foreground">{t.price}</p>
                  <button className="mt-0.5 text-[10px] font-semibold text-primary hover:underline">Book →</button>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ═══ 3. STAY RECOMMENDATIONS ═══ */}
        <Section title="Where to Stay" icon={Hotel} index={2}>
          <div className="space-y-2">
            {stays.map((s) => (
              <div key={s.name} className="rounded-xl border border-border/40 bg-card px-4 py-3 transition-shadow hover:shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{s.name}</p>
                      <Badge variant={s.type === "Premium" ? "primary" : "default"}>{s.type}</Badge>
                    </div>
                    <Stars rating={s.rating} />
                    <p className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1"><MapPin size={9} />{s.location}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-foreground">{s.price}</p>
                    <button className="mt-0.5 text-[10px] font-semibold text-primary hover:underline">Book →</button>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground italic">"{s.reason}"</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ═══ 4. DAY-BY-DAY TIMELINE ═══ */}
        <Section title="Day-by-Day Plan" icon={Clock} index={3}>
          <div className="space-y-2">
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
          <div className="grid grid-cols-2 gap-2">
            {localTransport.map((t) => (
              <div key={t.type} className="rounded-xl border border-border/40 bg-card px-3 py-3">
                <p className="text-[12px] font-semibold text-foreground">{t.type}</p>
                <p className="text-sm font-bold text-primary mt-1">{t.estimate}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{t.note}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ═══ 6. FAMOUS FOOD ═══ */}
        <Section title="Must-Try Food" icon={UtensilsCrossed} index={5}>
          <div className="space-y-2">
            {foodItems.map((f) => (
              <div key={f.name} className="flex items-center gap-3 rounded-xl border border-border/40 bg-card px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{f.name}</p>
                    {f.mustTry && <Badge variant="primary">Must Try</Badge>}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{f.restaurant}</p>
                </div>
                <p className="text-sm font-bold text-foreground shrink-0">{f.price}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ═══ 7. HIDDEN GEMS ═══ */}
        <Section title="Hidden Gems" icon={Gem} index={6}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {hiddenGems.map((g) => (
              <div key={g.name} className="rounded-xl border border-border/40 bg-card px-4 py-3 transition-shadow hover:shadow-sm">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-semibold text-foreground">{g.name}</p>
                  {g.instagrammable && <Badge variant="primary"><Camera size={8} />Insta</Badge>}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ═══ 8. BUDGET BREAKDOWN ═══ */}
        <Section title="Budget Breakdown" icon={Wallet} index={7}>
          <div className="rounded-2xl border border-border/40 bg-card p-4">
            <div className="space-y-3">
              {budgetBreakdown.map((b) => (
                <div key={b.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary">
                      <b.icon size={13} className="text-foreground" />
                    </div>
                    <p className="text-sm text-foreground">{b.category}</p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{b.amount}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
              <p className="text-sm font-bold text-foreground">Total Estimated</p>
              <p className="text-lg font-bold text-primary">{totalBudget}</p>
            </div>
          </div>
        </Section>

        {/* ═══ 9. MAP VIEW ═══ */}
        {viewMode === "map" && (
          <Section title="Route Map" icon={Map} index={8}>
            <div className="rounded-2xl border border-border/40 bg-card overflow-hidden">
              <div className="relative h-64 bg-secondary flex items-center justify-center">
                <div className="text-center">
                  <Map size={32} className="mx-auto text-muted-foreground/40" />
                  <p className="mt-2 text-sm text-muted-foreground">Interactive map coming soon</p>
                  <p className="text-[11px] text-muted-foreground/60 mt-1">Route lines & key locations</p>
                </div>
                {/* Route markers mock */}
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
            </div>
          </Section>
        )}

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-3 pt-4 pb-8"
        >
          <button
            onClick={() => navigate("/plan", { state: { prompt: `Plan a ${dur} trip to ${dest}. Budget: ${budget}. Style: ${styles}. Provide a detailed day-by-day itinerary.` } })}
            className="w-full rounded-lg py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 gradient-cta"
          >
            Chat with AI for More Details
          </button>
          <p className="text-[10px] text-muted-foreground">Powered by Yatri AI · Prices are estimates</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Itinerary;
