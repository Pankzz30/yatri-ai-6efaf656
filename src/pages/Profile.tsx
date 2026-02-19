import { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import {
  User, MapPin, Heart, Map, Settings, MessageCircle, ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import EditPreferencesSheet from "@/components/preferences/EditPreferencesSheet";

/* ── Animation helpers ───────────────────────────────── */
const ease = [0.4, 0, 0.2, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28, ease, delay },
});

/* ── Travel personality logic ────────────────────────── */
const getTagline = (interests: string[], tripStyle: string, budget: string): string => {
  if (interests.includes("adventure") || tripStyle === "backpacking") return "Adventure Seeker";
  if (interests.includes("food")) return "Food Nomad";
  if (interests.includes("historic") || interests.includes("spiritual")) return "Cultural Explorer";
  if (interests.includes("nature")) return "Nature Wanderer";
  if (budget === "premium") return "Luxury Traveler";
  if (tripStyle === "relaxed") return "Slow Traveler";
  return "Smart Explorer";
};

const getPersonalityBadge = (interests: string[], tripStyle: string, budget: string) => {
  if (budget === "budget")         return { label: "Budget Smart",    emoji: "💡", desc: "Max experiences, minimal spend" };
  if (interests.includes("adventure")) return { label: "Explorer Mode", emoji: "🗺️", desc: "Born to wander off the map" };
  if (interests.includes("food"))      return { label: "Food Nomad",    emoji: "🍜", desc: "Following flavours across India" };
  if (interests.includes("nature"))    return { label: "Nature Seeker", emoji: "🌿", desc: "Chasing landscapes and stillness" };
  if (budget === "premium")            return { label: "Premium Yatri", emoji: "✨", desc: "Comfort and culture, both" };
  return { label: "Smart Yatri", emoji: "⚡", desc: "Intelligent travel, every time" };
};

const getFavoriteCity = (interests: string[], location: string): string => {
  if (interests.includes("beaches"))   return "Goa";
  if (interests.includes("adventure")) return "Manali";
  if (interests.includes("historic"))  return "Jaipur";
  if (interests.includes("spiritual")) return "Varanasi";
  if (interests.includes("nature"))    return "Rishikesh";
  return location?.split(",")[0] || "Delhi";
};

/* ── City coords for mini map (300×360 SVG) ─────────── */
const cityCoords: Record<string, [number, number]> = {
  goa:       [108, 240],
  mumbai:    [100, 205],
  bangalore: [148, 262],
  delhi:     [148,  82],
  jaipur:    [120, 108],
  varanasi:  [198, 118],
  manali:    [138,  52],
  rishikesh: [158,  68],
  agra:      [158, 105],
  hampi:     [140, 248],
  udaipur:   [106, 148],
};

const interestToCity: Record<string, string> = {
  beaches:   "goa",
  adventure: "manali",
  historic:  "jaipur",
  spiritual: "varanasi",
  nature:    "rishikesh",
  food:      "mumbai",
  city:      "bangalore",
  shopping:  "jaipur",
};

/* ── Achievements list ───────────────────────────────── */
const ALL_ACHIEVEMENTS = [
  { id: "first_trip",     icon: "🏆", label: "First Trip",     desc: "Journey begins",      condition: (u: ReturnType<typeof useUser>["user"]) => (u?.savedTrips.length ?? 0) >= 1 },
  { id: "explorer",       icon: "🗺️", label: "Explorer Mode",   desc: "3+ destinations",    condition: (u: ReturnType<typeof useUser>["user"]) => (u?.wishlist.length ?? 0) >= 3 },
  { id: "budget_smart",   icon: "💡", label: "Budget Smart",    desc: "Smart spender",      condition: (u: ReturnType<typeof useUser>["user"]) => u?.preferences?.budget === "budget" },
  { id: "wishlist_lover", icon: "❤️", label: "Wishlist Lover",  desc: "Dream big",          condition: (u: ReturnType<typeof useUser>["user"]) => (u?.wishlist.length ?? 0) >= 1 },
  { id: "yatri_member",   icon: "⚡", label: "Yatri Member",    desc: "Welcome aboard",     condition: () => true },
];

/* ═══════════════════════════════════════════════════════
   MINI INDIA MAP
═══════════════════════════════════════════════════════ */
const MiniIndiaMap = ({ highlights }: { highlights: string[] }) => (
  <svg viewBox="0 0 300 360" className="w-full max-w-[140px] mx-auto opacity-90" fill="none">
    <path
      d="M148,18 L168,22 L185,32 L198,28 L210,38 L218,52 L222,68 L228,80 L232,96 L228,110
         L235,122 L238,138 L232,152 L238,162 L234,178 L228,192 L220,204 L210,218 L202,228
         L196,242 L188,255 L178,265 L168,272 L158,280 L148,284 L138,280 L128,274 L118,265
         L108,254 L98,242 L90,228 L82,214 L76,200 L72,184 L68,168 L66,152 L70,138 L68,124
         L72,110 L70,96 L74,82 L80,70 L88,56 L98,44 L110,34 L122,26 Z"
      stroke="hsl(350,20%,88%)"
      strokeWidth="1.5"
      fill="hsl(350,60%,99%)"
    />
    {Object.entries(cityCoords).map(([city, [cx, cy]]) => {
      const isHighlighted = highlights.includes(city);
      return (
        <motion.circle
          key={city}
          cx={cx}
          cy={cy}
          r={isHighlighted ? 5 : 2.5}
          fill={isHighlighted ? "hsl(347,77%,50%)" : "hsl(350,20%,82%)"}
          animate={isHighlighted ? { r: [4.5, 6, 4.5], opacity: [1, 0.7, 1] } : {}}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      );
    })}
  </svg>
);

/* ═══════════════════════════════════════════════════════
   PROFILE PAGE
═══════════════════════════════════════════════════════ */
const Profile = () => {
  const { user, isAuthenticated } = useUser();
  const [editOpen, setEditOpen] = useState(false);

  /* ── Unauthenticated state ── */
  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }} className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
            <User size={28} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Sign in to view profile</h2>
          <p className="mt-1 text-sm text-muted-foreground">Your travel identity awaits.</p>
          <Link to="/login" className="mt-5 inline-block rounded-2xl bg-primary px-7 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:shadow-[0_6px_24px_hsla(347,77%,50%,0.28)] hover:scale-[1.02]">
            Sign in
          </Link>
        </motion.div>
      </div>
    );
  }

  const onboarded = !user.isFirstLogin;
  const interests = user.preferences?.interests ?? [];
  const tagline   = onboarded ? getTagline(interests, user.preferences.tripStyle, user.preferences.budget) : "Smart Explorer";
  const badge     = onboarded ? getPersonalityBadge(interests, user.preferences.tripStyle, user.preferences.budget) : null;
  const favCity   = onboarded ? getFavoriteCity(interests, user.preferences.location) : "Delhi";

  const highlightedCities = [
    "delhi",
    ...interests.map((i) => interestToCity[i]).filter(Boolean),
  ].slice(0, 4);

  const earnedAchievements = ALL_ACHIEVEMENTS.filter((a) => a.condition(user));

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background pt-24 pb-28 md:pb-10">
      <div className="container mx-auto max-w-2xl px-4 space-y-5">

        {/* ══ 1. PROFILE HERO CARD ══ */}
        <motion.div {...fadeUp(0)} className="relative overflow-hidden rounded-3xl bg-card card-elevated p-7">
          {/* Subtle mesh bg */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{
              background:
                "radial-gradient(ellipse at 80% 10%, hsla(347,77%,60%,0.05) 0%, transparent 60%)," +
                "radial-gradient(ellipse at 10% 80%, hsla(355,90%,70%,0.04) 0%, transparent 60%)",
            }}
          />

          <div className="relative flex items-start gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gradient-to-br from-primary to-[hsl(355,90%,60%)] text-xl font-bold text-white shadow-[0_8px_28px_hsla(347,77%,50%,0.28)]">
                {initials}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white bg-[hsl(142,72%,50%)]" />
            </div>

            {/* Identity */}
            <div className="min-w-0 flex-1 pt-0.5">
              <h1 className="text-xl font-bold leading-tight text-foreground">{user.name}</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">{user.email}</p>
              {onboarded && (
                <p className="mt-1.5 text-xs font-semibold text-primary">{tagline}</p>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-6 grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-muted/30">
            {[
              { label: "Trips Planned", value: user.savedTrips.length },
              { label: "Wishlist",      value: user.wishlist.length },
              { label: "Fav City",      value: favCity, small: true },
            ].map(({ label, value, small }) => (
              <div key={label} className="py-3 text-center">
                <p className={`font-bold text-foreground ${small ? "text-sm leading-tight" : "text-xl"}`}>
                  {value}
                </p>
                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ══ 2. TRAVEL PERSONALITY BADGE ══ */}
        {onboarded && badge && (
          <motion.div {...fadeUp(0.06)} className="overflow-hidden rounded-3xl bg-card card-elevated p-6">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Travel Personality
            </p>
            <div className="flex items-center gap-4 rounded-2xl border border-primary/15 bg-gradient-to-r from-accent via-[hsl(350,80%,97%)] to-white px-5 py-4 shadow-[0_0_0_1px_hsla(347,77%,50%,0.06)]">
              <span className="text-3xl leading-none">{badge.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">{badge.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{badge.desc}</p>
              </div>
              <div className="flex-shrink-0 rounded-full bg-primary/10 px-3 py-1">
                <p className="text-[11px] font-semibold text-primary">Active</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ══ 3. PREFERENCES ══ */}
        {onboarded && interests.length > 0 && (
          <motion.div {...fadeUp(0.1)} className="rounded-3xl bg-card card-elevated p-6">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Your Interests
            </p>
            {user.preferences.location && (
              <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={13} className="text-primary flex-shrink-0" />
                <span>{user.preferences.location}</span>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, i) => (
                <motion.span
                  key={interest}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.22, ease }}
                  className="rounded-full border border-primary/15 bg-accent px-3.5 py-1.5 text-xs font-semibold capitalize text-accent-foreground"
                >
                  {interest}
                </motion.span>
              ))}
              <span className="rounded-full border border-border bg-muted px-3.5 py-1.5 text-xs font-semibold capitalize text-muted-foreground">
                {user.preferences.budget}
              </span>
              <span className="rounded-full border border-border bg-muted px-3.5 py-1.5 text-xs font-semibold capitalize text-muted-foreground">
                {user.preferences.tripStyle}
              </span>
              {user.preferences.offbeat && (
                <span className="rounded-full border border-primary/20 bg-accent px-3.5 py-1.5 text-xs font-semibold text-primary">
                  Offbeat ✦
                </span>
              )}
            </div>
          </motion.div>
        )}

        {/* ══ 4. MINI TRAVEL FOOTPRINT ══ */}
        {onboarded && (
          <motion.div {...fadeUp(0.14)} className="rounded-3xl bg-card card-elevated p-6">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Travel Footprint
            </p>
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                <MiniIndiaMap highlights={highlightedCities} />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Your India</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Mapped to your interests — these cities match your travel DNA.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {highlightedCities.map((c) => (
                    <span key={c} className="rounded-full bg-accent border border-primary/10 px-2.5 py-0.5 text-[10px] font-semibold capitalize text-accent-foreground">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ══ 5. ACHIEVEMENTS ══ */}
        <motion.div {...fadeUp(0.18)} className="rounded-3xl bg-card card-elevated p-6">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Achievements
          </p>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {earnedAchievements.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.18 + i * 0.05, duration: 0.24, ease }}
                className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-muted/30 p-3.5 text-center"
              >
                <span className="text-2xl leading-none">{a.icon}</span>
                <p className="text-xs font-bold text-foreground leading-tight">{a.label}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ══ 6. QUICK ACTIONS ══ */}
        <motion.div {...fadeUp(0.22)} className="rounded-3xl bg-card card-elevated p-6">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Quick Actions
          </p>
          <div className="space-y-2">
            {[
              { to: "/my-trips",  icon: <Map size={17} className="text-primary" />,            label: "View My Trips",      sub: `${user.savedTrips.length} saved` },
              { to: "/wishlist",  icon: <Heart size={17} className="text-primary" />,           label: "My Wishlist",        sub: `${user.wishlist.length} places` },
              { to: "/contact",   icon: <MessageCircle size={17} className="text-primary" />,   label: "Chat Assistant",     sub: "Plan with Yatri AI" },
            ].map(({ to, icon, label, sub }) => (
              <Link
                key={label}
                to={to}
                className="flex items-center gap-4 rounded-2xl border border-border bg-white px-4 py-3.5 transition-all duration-200 hover:border-primary/20 hover:bg-accent hover:shadow-[0_4px_16px_hsla(347,77%,50%,0.08)] group"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-accent">
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
                <ChevronRight size={15} className="text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            ))}

            {/* Edit Preferences — opens sheet */}
            <button
              onClick={() => setEditOpen(true)}
              className="flex w-full items-center gap-4 rounded-2xl border border-border bg-white px-4 py-3.5 text-left transition-all duration-200 hover:border-primary/20 hover:bg-accent hover:shadow-[0_4px_16px_hsla(347,77%,50%,0.08)] group"
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-accent">
                <Settings size={17} className="text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">Edit Preferences</p>
                <p className="text-xs text-muted-foreground">Update your travel style</p>
              </div>
              <ChevronRight size={15} className="text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
        </motion.div>

      </div>

      {/* Edit Preferences slide-up sheet */}
      <EditPreferencesSheet open={editOpen} onClose={() => setEditOpen(false)} />
    </div>
  );
};

export default Profile;
