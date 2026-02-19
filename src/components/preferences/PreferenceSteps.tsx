/**
 * Shared, reusable step components for both Onboarding and Edit Preferences.
 * Extracted so both flows stay in sync with no duplication.
 */
import { motion } from "framer-motion";
import { interests as interestOptions } from "@/data/mockData";

const ease = [0.4, 0, 0.2, 1] as const;

/* ══ INTERESTS ══════════════════════════════════════════ */
export const StepInterests = ({
  selected,
  toggle,
}: {
  selected: string[];
  toggle: (id: string) => void;
}) => (
  <div className="grid grid-cols-2 gap-2.5">
    {interestOptions.map((interest, i) => {
      const isSelected = selected.includes(interest.id);
      return (
        <motion.button
          key={interest.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04, duration: 0.26, ease }}
          onClick={() => toggle(interest.id)}
          whileTap={{ scale: 0.97 }}
          className={`relative flex items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition-all duration-200 ${
            isSelected
              ? "border-primary bg-accent shadow-[0_0_0_3px_hsla(347,77%,50%,0.08)]"
              : "border-border bg-white hover:border-primary/30 hover:bg-[hsl(350,80%,99%)]"
          }`}
        >
          <motion.span
            animate={{ scale: isSelected ? 1.15 : 1 }}
            transition={{ type: "tween", duration: 0.18 }}
            className="text-xl leading-none"
          >
            {interest.icon}
          </motion.span>
          <span
            className={`text-sm font-medium leading-tight ${
              isSelected ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {interest.label}
          </span>
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary"
            />
          )}
        </motion.button>
      );
    })}
  </div>
);

/* ══ BUDGET ═════════════════════════════════════════════ */
export const budgetOptions = [
  {
    id: "budget" as const,
    emoji: "💰",
    label: "Budget Friendly",
    sub: "Best value · hostels & street food",
  },
  {
    id: "balanced" as const,
    emoji: "⚖️",
    label: "Balanced",
    sub: "Comfort without overspending",
  },
  {
    id: "premium" as const,
    emoji: "✨",
    label: "Premium",
    sub: "Luxury stays & fine dining",
  },
];

export const StepBudget = ({
  budget,
  setBudget,
}: {
  budget: string;
  setBudget: (v: "budget" | "balanced" | "premium") => void;
}) => (
  <div className="flex flex-col gap-3">
    {budgetOptions.map((opt, i) => {
      const active = budget === opt.id;
      return (
        <motion.button
          key={opt.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.07, duration: 0.26, ease }}
          onClick={() => setBudget(opt.id)}
          whileTap={{ scale: 0.985 }}
          className={`flex items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition-all duration-200 ${
            active
              ? "border-primary bg-accent shadow-[0_0_0_3px_hsla(347,77%,50%,0.08)]"
              : "border-border bg-white hover:border-primary/25 hover:bg-[hsl(350,80%,99%)]"
          }`}
        >
          <span className="text-2xl leading-none">{opt.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">{opt.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{opt.sub}</p>
          </div>
          <motion.div
            animate={{
              backgroundColor: active ? "hsl(347,77%,50%)" : "transparent",
              borderColor: active ? "hsl(347,77%,50%)" : "hsl(350,20%,82%)",
            }}
            transition={{ duration: 0.18 }}
            className="h-[18px] w-[18px] flex-shrink-0 rounded-full border-2 flex items-center justify-center"
          >
            {active && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="h-2 w-2 rounded-full bg-white"
              />
            )}
          </motion.div>
        </motion.button>
      );
    })}
  </div>
);

/* ══ STYLE ══════════════════════════════════════════════ */
export const styleOptions = [
  { id: "weekend" as const, emoji: "🏕️", label: "Weekend Escape" },
  { id: "explorer" as const, emoji: "🗺️", label: "Explorer" },
  { id: "relaxed" as const, emoji: "😌", label: "Relaxed" },
  { id: "backpacking" as const, emoji: "🎒", label: "Backpacking" },
];

export const StepStyle = ({
  tripStyle,
  setTripStyle,
  offbeat,
  setOffbeat,
}: {
  tripStyle: string;
  setTripStyle: (v: "weekend" | "explorer" | "relaxed" | "backpacking") => void;
  offbeat: boolean;
  setOffbeat: (v: boolean) => void;
}) => (
  <div className="space-y-3">
    <div className="grid grid-cols-2 gap-2.5">
      {styleOptions.map((opt, i) => {
        const active = tripStyle === opt.id;
        return (
          <motion.button
            key={opt.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.26, ease }}
            onClick={() => setTripStyle(opt.id)}
            whileTap={{ scale: 0.97 }}
            className={`flex flex-col items-center gap-2 rounded-2xl border-2 py-5 px-3 text-center transition-all duration-200 ${
              active
                ? "border-primary bg-accent shadow-[0_0_0_3px_hsla(347,77%,50%,0.08)]"
                : "border-border bg-white hover:border-primary/25 hover:bg-[hsl(350,80%,99%)]"
            }`}
          >
            <motion.span
              animate={{ scale: active ? 1.2 : 1 }}
              transition={{ type: "tween", duration: 0.2 }}
              className="text-2xl leading-none"
            >
              {opt.emoji}
            </motion.span>
            <span
              className={`text-xs font-semibold ${
                active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {opt.label}
            </span>
          </motion.button>
        );
      })}
    </div>

    {/* Offbeat toggle */}
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.28, duration: 0.26 }}
      className="flex items-center justify-between rounded-2xl border border-border bg-white px-5 py-4"
    >
      <div>
        <p className="text-sm font-semibold text-foreground">
          {offbeat ? "Offbeat & Hidden" : "Popular Destinations"}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {offbeat
            ? "Untouched gems most travelers miss"
            : "Well-loved, well-reviewed places"}
        </p>
      </div>
      <button
        onClick={() => setOffbeat(!offbeat)}
        className={`relative h-7 w-12 flex-shrink-0 rounded-full transition-colors duration-200 ${
          offbeat ? "bg-primary" : "bg-muted"
        }`}
      >
        <motion.span
          animate={{ x: offbeat ? 20 : 2 }}
          transition={{ type: "tween", duration: 0.2, ease }}
          className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md"
          style={{ left: 0 }}
        />
      </button>
    </motion.div>
  </div>
);
