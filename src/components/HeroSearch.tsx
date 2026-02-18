import { useState, useMemo } from "react";
import { Search, MapPin, Wallet, Clock, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { destinations } from "@/data/mockData";

const BUDGET_OPTIONS = [
  { label: "Any Budget", min: 0, max: Infinity },
  { label: "Under ₹3,000", min: 0, max: 3000 },
  { label: "₹3,000 – ₹7,000", min: 3000, max: 7000 },
  { label: "₹7,000 – ₹12,000", min: 7000, max: 12000 },
  { label: "₹12,000+", min: 12000, max: Infinity },
];

const DURATION_OPTIONS = [
  { label: "Any Duration", days: 0 },
  { label: "Weekend (1-3 days)", days: 3 },
  { label: "Short (4-6 days)", days: 6 },
  { label: "Week (7-10 days)", days: 10 },
  { label: "Long (10+ days)", days: 999 },
];

// Parse the budget max from "₹X,XXX - ₹Y,YYY" strings
const parseBudgetMax = (range: string): number => {
  const match = range.match(/₹([\d,]+)\s*$/);
  if (!match) return 0;
  return parseInt(match[1].replace(/,/g, ""), 10);
};

const parseBudgetMin = (range: string): number => {
  const match = range.match(/₹([\d,]+)/);
  if (!match) return 0;
  return parseInt(match[1].replace(/,/g, ""), 10);
};

const HeroSearch = () => {
  const [query, setQuery] = useState("");
  const [budgetIdx, setBudgetIdx] = useState(0);
  const [durationIdx, setDurationIdx] = useState(0);
  const [focused, setFocused] = useState(false);

  const budget = BUDGET_OPTIONS[budgetIdx];
  const duration = DURATION_OPTIONS[durationIdx];

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    return destinations.filter((d) => {
      const matchesQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q) ||
        d.category.some((c) => c.toLowerCase().includes(q)) ||
        d.description.toLowerCase().includes(q);

      const destBudgetMax = parseBudgetMax(d.budgetRange);
      const destBudgetMin = parseBudgetMin(d.budgetRange);
      const matchesBudget =
        budget.min === 0 && budget.max === Infinity
          ? true
          : destBudgetMin <= budget.max && destBudgetMax >= budget.min;

      // Duration filter: crude mapping via distance (longer trip needed for further)
      // We treat duration as number of days required (distance / 100 ≈ days)
      const estimatedDays = Math.ceil(d.distance / 100);
      const matchesDuration =
        duration.days === 0
          ? true
          : duration.days === 999
          ? estimatedDays > 10
          : estimatedDays <= duration.days;

      return matchesQuery && matchesBudget && matchesDuration;
    });
  }, [query, budgetIdx, durationIdx]);

  const showResults = focused && (query.length > 0 || budgetIdx !== 0 || durationIdx !== 0);

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      {/* Main Search Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="rounded-2xl bg-background shadow-2xl border border-border overflow-hidden"
      >
        {/* Search Input Row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search size={18} className="text-primary flex-shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="Search destinations, states, or categories..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-0 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {/* Budget Filter */}
          <div className="flex items-center gap-2 px-4 py-3 flex-1">
            <Wallet size={15} className="text-primary flex-shrink-0" />
            <select
              value={budgetIdx}
              onChange={(e) => setBudgetIdx(Number(e.target.value))}
              onFocus={() => setFocused(true)}
              className="flex-1 bg-transparent text-sm text-foreground outline-none cursor-pointer"
            >
              {BUDGET_OPTIONS.map((opt, i) => (
                <option key={opt.label} value={i}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Duration Filter */}
          <div className="flex items-center gap-2 px-4 py-3 flex-1">
            <Clock size={15} className="text-primary flex-shrink-0" />
            <select
              value={durationIdx}
              onChange={(e) => setDurationIdx(Number(e.target.value))}
              onFocus={() => setFocused(true)}
              className="flex-1 bg-transparent text-sm text-foreground outline-none cursor-pointer"
            >
              {DURATION_OPTIONS.map((opt, i) => (
                <option key={opt.label} value={i}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div className="px-3 py-2 flex items-center justify-center">
            <button
              onClick={() => setFocused(true)}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 w-full sm:w-auto justify-center"
            >
              <Search size={15} />
              Search
            </button>
          </div>
        </div>
      </motion.div>

      {/* Instant Results Dropdown */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl bg-background shadow-2xl border border-border overflow-hidden max-h-[420px] overflow-y-auto"
          >
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <MapPin size={32} className="text-muted-foreground/40 mb-3" />
                <p className="text-sm font-medium text-foreground">No destinations found</p>
                <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <div>
                <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {results.length} destination{results.length !== 1 ? "s" : ""} found
                  </span>
                  <button
                    onClick={() => { setBudgetIdx(0); setDurationIdx(0); setQuery(""); }}
                    className="text-xs text-primary hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
                <div className="divide-y divide-border">
                  {results.map((dest) => (
                    <Link
                      key={dest.id}
                      to={`/trip/${dest.id}`}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-accent/50 transition-colors group"
                    >
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="h-14 w-14 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">{dest.name}</p>
                          <span className="text-xs text-muted-foreground">· {dest.state}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{dest.description}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs font-semibold text-primary">{dest.budgetRange}</span>
                          <span className="text-xs text-muted-foreground">{dest.distance} km</span>
                          <div className="flex gap-1 flex-wrap">
                            {dest.category.slice(0, 2).map((c) => (
                              <span key={c} className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-primary">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary flex-shrink-0 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeroSearch;
