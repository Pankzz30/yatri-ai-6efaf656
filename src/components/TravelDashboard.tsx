import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Trophy, Map, Heart, Compass, Target } from "lucide-react";
import { useUser } from "@/context/UserContext";

/* ── Animated Counter ── */
function AnimatedCounter({ target, duration = 1.5 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <span ref={ref}>{count}</span>;
}

/* ── Stat Card ── */
function StatCard({
  icon: Icon,
  label,
  value,
  index,
}: {
  icon: typeof Trophy;
  label: string;
  value: number;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.35, ease: "easeOut" }}
      className="flex flex-col items-center gap-2 rounded-2xl border border-border/40 bg-background p-5 shadow-sm hover:shadow-md transition-shadow duration-250"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
        <Icon size={18} className="text-primary" />
      </div>
      <p className="text-2xl font-bold text-foreground">
        <AnimatedCounter target={value} />
      </p>
      <p className="text-[11px] text-muted-foreground font-medium">{label}</p>
    </motion.div>
  );
}

/* ── Travel Level Bar ── */
function TravelLevelBar() {
  const level = 4;
  const progress = 65;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-2xl border border-border/40 bg-background p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Trophy size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Level {level}</p>
            <p className="text-[10px] text-muted-foreground">Explorer</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          {progress}% to Level {level + 1}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, hsl(347 77% 50%), hsl(355 90% 60%))" }}
          initial={{ width: 0 }}
          whileInView={{ width: `${progress}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        />
      </div>
    </motion.div>
  );
}

/* ── Weekly Challenge ── */
function WeeklyChallenge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, ease: "easeOut", delay: 0.15 }}
      className="rounded-2xl border border-border/40 bg-background p-5 shadow-sm hover:shadow-md transition-shadow duration-250 cursor-pointer"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
          <Target size={16} className="text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">Weekly Challenge</p>
          <p className="text-[10px] text-muted-foreground">Ends in 3 days</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Plan a trip under ₹5,000 to earn <span className="text-primary font-semibold">50 XP</span>
      </p>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-primary/70"
          initial={{ width: 0 }}
          whileInView={{ width: "40%" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        />
      </div>
      <p className="text-[10px] text-muted-foreground mt-1.5">2 of 5 tasks completed</p>
    </motion.div>
  );
}

/* ── Main Export ── */
export default function TravelDashboard() {
  const { user } = useUser();

  const stats = [
    { icon: Compass, label: "Trips Planned", value: user?.savedTrips?.length || 3 },
    { icon: Heart, label: "Wishlist", value: user?.wishlist?.length || 7 },
    { icon: Map, label: "States Explored", value: 5 },
    { icon: Trophy, label: "Budget Saved", value: 12400 },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-1">
            Your Progress
          </p>
          <h2 className="text-2xl font-bold text-foreground mb-6">Your Travel Dashboard</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2">
            <TravelLevelBar />
          </div>
          <WeeklyChallenge />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
