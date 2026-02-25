import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import heroCab from "@/assets/hero-cab-cinematic.jpg";
import heroFlight from "@/assets/hero-flight-cinematic.jpg";
import heroTrain from "@/assets/hero-train-cinematic.jpg";
import heroHotel from "@/assets/hero-hotel-cinematic.jpg";

type TransportType = "cab" | "train" | "flight" | "hotels";

interface SearchTransitionProps {
  active: boolean;
  type: TransportType;
  onComplete: () => void;
  duration?: number;
}

const HERO_IMAGES: Record<TransportType, string> = {
  cab: heroCab,
  train: heroTrain,
  flight: heroFlight,
  hotels: heroHotel,
};

const LOADING_TEXTS: Record<TransportType, string[]> = {
  cab: [
    "Finding the best cabs for you...",
    "Matching nearby drivers...",
    "Almost there...",
  ],
  train: [
    "Checking IRCTC for live seats...",
    "Finding fastest routes...",
    "Locking in the best fares...",
  ],
  flight: [
    "Scanning airlines for best deals...",
    "Comparing 200+ flights...",
    "Securing premium fares...",
  ],
  hotels: [
    "Finding premium stays for you...",
    "Comparing 1000+ hotels...",
    "Locking in exclusive rates...",
  ],
};

const TRANSPORT_LABELS: Record<TransportType, string> = {
  cab: "Cab",
  train: "Train",
  flight: "Flight",
  hotels: "Hotels",
};

export default function SearchTransition({
  active,
  type,
  onComplete,
  duration = 2800,
}: SearchTransitionProps) {
  const [textIndex, setTextIndex] = useState(0);
  const texts = LOADING_TEXTS[type];

  useEffect(() => {
    if (!active) { setTextIndex(0); return; }
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % texts.length);
    }, duration / texts.length);
    return () => clearInterval(interval);
  }, [active, texts, duration]);

  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(onComplete, duration);
    return () => clearTimeout(timer);
  }, [active, onComplete, duration]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
        >
          {/* ── Cinematic hero image with Ken Burns ── */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1.18 }}
            transition={{ duration: duration / 1000 + 1, ease: "easeOut" }}
          >
            <img
              src={HERO_IMAGES[type]}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
          </motion.div>

          {/* ── Dark overlay for readability ── */}
          <div className="absolute inset-0 bg-black/65" />

          {/* ── Motion blur overlay ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
            }}
          />

          {/* ── Vignette ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
            }}
          />

          {/* ── Film grain texture ── */}
          <motion.div
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            animate={{ opacity: [0.04, 0.07, 0.04] }}
            transition={{ duration: 0.3, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: "128px 128px",
            }}
          />

          {/* ── Ambient brand glow ── */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background:
                "radial-gradient(ellipse at 50% 55%, hsla(347,77%,50%,0.2) 0%, transparent 55%)",
            }}
          />

          {/* ── Content ── */}
          <div className="relative z-10 flex flex-col items-center text-center px-6">
            {/* Brand badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.45 }}
              className="mb-6 flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.06] px-5 py-2 backdrop-blur-md"
            >
              <motion.div
                className="h-2 w-2 rounded-full bg-primary"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/60">
                Yatri AI
              </span>
            </motion.div>

            {/* Transport type label */}
            <motion.h2
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="text-4xl sm:text-5xl font-black uppercase tracking-wider text-white"
              style={{ textShadow: "0 4px 30px rgba(0,0,0,0.5)" }}
            >
              {TRANSPORT_LABELS[type]}
            </motion.h2>

            {/* Decorative line */}
            <motion.div
              className="mt-4 mb-6 h-[2px] w-16 rounded-full bg-primary"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
            />

            {/* Loading text */}
            <div className="h-8 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={textIndex}
                  initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                  transition={{ duration: 0.35 }}
                  className="text-sm font-medium tracking-wide text-white/55"
                >
                  {texts[textIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <motion.div className="mt-8 h-[2px] w-52 overflow-hidden rounded-full bg-white/[0.08]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: duration / 1000, ease: "easeInOut" }}
              />
            </motion.div>
          </div>

          {/* ── Bottom accent line ── */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
