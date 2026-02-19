/**
 * IndiaMapPreview — desktop-only animated route preview panel
 * Shows a simplified SVG outline of India with animated dots/lines
 * that update based on user selections.
 */
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  location: string;
  interests: string[];
  budget: string;
  tripStyle: string;
  step: number;
}

// Rough [cx, cy] positions on a 300×360 SVG for major cities
const cityCoords: Record<string, [number, number]> = {
  delhi:     [148, 82],
  jaipur:    [120, 108],
  agra:      [158, 105],
  varanasi:  [198, 118],
  manali:    [138, 52],
  rishikesh: [158, 68],
  goa:       [108, 240],
  mumbai:    [100, 205],
  bangalore: [148, 262],
  hampi:     [140, 248],
  udaipur:   [106, 148],
};

const stepLabels = ["Where you are", "Your interests", "Your budget", "Your style"];
const stepHints = [
  "Locating the perfect starting point…",
  "Mapping destinations to your taste…",
  "Aligning routes to your budget…",
  "Curating the ultimate journey…",
];

// Pick 2-3 destinations to highlight based on interests
const interestDestinations: Record<string, string[]> = {
  historic:   ["agra", "jaipur", "hampi"],
  nature:     ["rishikesh", "manali"],
  spiritual:  ["varanasi", "rishikesh"],
  beaches:    ["goa"],
  adventure:  ["manali", "rishikesh"],
  food:       ["varanasi", "mumbai"],
  city:       ["mumbai", "bangalore"],
  shopping:   ["jaipur", "delhi"],
};

function getHighlightedCities(interests: string[]): string[] {
  const cities = new Set<string>(["delhi"]);
  interests.forEach((id) => {
    (interestDestinations[id] || []).forEach((c) => cities.add(c));
  });
  return Array.from(cities).slice(0, 5);
}

const IndiaMapPreview = ({ location, interests, budget, tripStyle, step }: Props) => {
  const highlightCities = step >= 1 ? getHighlightedCities(interests) : ["delhi"];
  const origin = "delhi";
  const originCoord = cityCoords[origin];

  return (
    <div className="hidden lg:flex flex-col h-full justify-between">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
        Route Preview
      </div>

      {/* SVG Map */}
      <div className="relative flex-1 flex items-center justify-center">
        <svg
          viewBox="0 0 300 360"
          className="w-full max-w-[220px] opacity-90"
          fill="none"
        >
          {/* India outline — simplified path */}
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

          {/* Animated route lines from origin to destinations */}
          <AnimatePresence>
            {highlightCities.filter(c => c !== origin).map((city) => {
              const coord = cityCoords[city];
              if (!coord) return null;
              return (
                <motion.line
                  key={city}
                  x1={originCoord[0]}
                  y1={originCoord[1]}
                  x2={coord[0]}
                  y2={coord[1]}
                  stroke="hsl(347,77%,60%)"
                  strokeWidth="1"
                  strokeDasharray="4 3"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.55 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              );
            })}
          </AnimatePresence>

          {/* City dots */}
          {Object.entries(cityCoords).map(([city, [cx, cy]]) => {
            const isHighlighted = highlightCities.includes(city);
            const isOrigin = city === origin;
            return (
              <motion.circle
                key={city}
                cx={cx}
                cy={cy}
                r={isOrigin ? 5 : isHighlighted ? 4.5 : 2.5}
                fill={
                  isOrigin
                    ? "hsl(347,77%,50%)"
                    : isHighlighted
                    ? "hsl(347,77%,60%)"
                    : "hsl(350,20%,84%)"
                }
                animate={{
                  r: isHighlighted ? [isOrigin ? 5 : 4, isOrigin ? 6 : 5.5, isOrigin ? 5 : 4] : 2.5,
                  opacity: isHighlighted ? 1 : 0.4,
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            );
          })}
        </svg>
      </div>

      {/* Step info */}
      <div className="mt-4 space-y-1.5">
        <p className="text-[11px] font-semibold text-[#E11D48] uppercase tracking-wider">
          {stepLabels[step] || ""}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {stepHints[step] || ""}
        </p>
        {step >= 1 && highlightCities.length > 1 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {highlightCities.filter(c => c !== origin).map((c) => (
              <span key={c} className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-medium text-accent-foreground capitalize">
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IndiaMapPreview;
