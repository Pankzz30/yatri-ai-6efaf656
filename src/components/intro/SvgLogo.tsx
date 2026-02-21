import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SvgLogoProps {
  stage: "hidden" | "stroke" | "fill" | "done";
  fast?: boolean;
}

const SvgLogo = ({ stage, fast = false }: SvgLogoProps) => {
  const [shimmer, setShimmer] = useState(false);

  useEffect(() => {
    if (stage === "fill") {
      const t = setTimeout(() => setShimmer(true), fast ? 150 : 400);
      return () => clearTimeout(t);
    }
    setShimmer(false);
  }, [stage, fast]);

  const strokeDuration = fast ? 0.5 : 1.5;

  const mkStroke = (delay = 0) => ({
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: strokeDuration, ease: [0.4, 0, 0.2, 1] as [number,number,number,number], delay },
    },
  });

  const fillVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: fast ? 0.3 : 0.55, ease: "easeOut" as const } },
  };

  const glowVariants = {
    hidden: { opacity: 0 },
    pulse: {
      opacity: [0.3, 0.85, 0.3],
      transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" as const },
    },
  };

  const isStroke = stage === "stroke" || stage === "fill" || stage === "done";
  const isFill   = stage === "fill"   || stage === "done";

  if (stage === "hidden") return null;

  const strokeColor = isFill ? "white" : "hsl(347,77%,50%)";

  // Letter animation for wordmark
  const yatriLetters = "Yatri".split("");
  const aiLetters = "AI".split("");

  const letterContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: fast ? 0.04 : 0.08,
        delayChildren: fast ? 0.1 : 0.35,
      },
    },
  };

  const letterChild = {
    hidden: { opacity: 0, y: 28, rotateX: -60, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        duration: fast ? 0.35 : 0.65,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <div className="relative flex flex-col items-center gap-6 select-none" style={{ perspective: "800px" }}>
      {/* Ambient glow — double layer for richness */}
      <motion.div
        variants={glowVariants}
        initial="hidden"
        animate={isFill ? "pulse" : "hidden"}
        className="absolute pointer-events-none"
        style={{
          inset: "-60px",
          background: "radial-gradient(ellipse at center, hsla(347,77%,50%,0.25) 0%, transparent 65%)",
          filter: "blur(30px)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isFill ? { opacity: 0.6, scale: 1.2 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: fast ? 0.4 : 0.8, ease: "easeOut" }}
        className="absolute pointer-events-none"
        style={{
          inset: "-80px",
          background: "radial-gradient(circle at center, hsla(347,77%,50%,0.08) 0%, transparent 50%)",
          filter: "blur(40px)",
        }}
      />

      {/* ── ICON MARK ── */}
      <motion.div
        className="relative"
        initial={{ scale: fast ? 0.92 : 0.85 }}
        animate={isStroke ? { scale: 1 } : { scale: 0.85 }}
        transition={{ duration: fast ? 0.4 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg
          width="140"
          height="84"
          viewBox="0 0 120 72"
          fill="none"
          className="overflow-visible"
          style={{ willChange: "transform" }}
        >
          {/* Background pill fills on fill stage */}
          <motion.rect
            x="1" y="1" width="118" height="70" rx="18"
            fill="hsl(347,77%,50%)"
            variants={fillVariants}
            initial="hidden"
            animate={isFill ? "visible" : "hidden"}
          />
          {/* Stroke border of pill */}
          <motion.rect
            x="1" y="1" width="118" height="70" rx="18"
            stroke="hsl(347,77%,50%)" strokeWidth="2" fill="none"
            variants={mkStroke(0)}
            initial="hidden"
            animate={isStroke ? "visible" : "hidden"}
          />

          {/* ── CAR BODY ── */}
          <motion.path
            d="M10 46 L10 54 Q10 58 14 58 L106 58 Q110 58 110 54 L110 46 Z"
            stroke={strokeColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none"
            variants={mkStroke(0)}
            initial="hidden" animate={isStroke ? "visible" : "hidden"}
            style={{ transition: "stroke 0.35s ease" }}
          />
          <motion.path
            d="M24 46 C26 38 32 26 42 22 L78 22 C88 22 94 30 96 38 L100 46"
            stroke={strokeColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none"
            variants={mkStroke(fast ? 0 : 0.12)}
            initial="hidden" animate={isStroke ? "visible" : "hidden"}
            style={{ transition: "stroke 0.35s ease" }}
          />
          <motion.path
            d="M96 38 L106 46"
            stroke={strokeColor} strokeWidth="2.6" strokeLinecap="round" fill="none"
            variants={mkStroke(fast ? 0 : 0.18)}
            initial="hidden" animate={isStroke ? "visible" : "hidden"}
            style={{ transition: "stroke 0.35s ease" }}
          />
          <motion.path
            d="M24 46 L18 46"
            stroke={strokeColor} strokeWidth="2.6" strokeLinecap="round" fill="none"
            variants={mkStroke(fast ? 0 : 0.05)}
            initial="hidden" animate={isStroke ? "visible" : "hidden"}
            style={{ transition: "stroke 0.35s ease" }}
          />
          <motion.line
            x1="62" y1="46" x2="58" y2="28"
            stroke={isFill ? "rgba(255,255,255,0.45)" : "hsla(347,77%,50%,0.45)"}
            strokeWidth="1.6" strokeLinecap="round"
            variants={mkStroke(fast ? 0 : 0.3)}
            initial="hidden" animate={isStroke ? "visible" : "hidden"}
            style={{ transition: "stroke 0.35s ease" }}
          />
          <motion.path
            d="M28 45 C30 38 35 28 42 24 L56 24 L54 45 Z"
            stroke={isFill ? "rgba(255,255,255,0.65)" : "hsla(347,77%,50%,0.65)"}
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"
            variants={mkStroke(fast ? 0 : 0.22)}
            initial="hidden" animate={isStroke ? "visible" : "hidden"}
            style={{ transition: "stroke 0.35s ease" }}
          />
          <motion.path
            d="M64 45 L66 24 L78 24 C87 24 92 32 94 40 L92 45 Z"
            stroke={isFill ? "rgba(255,255,255,0.65)" : "hsla(347,77%,50%,0.65)"}
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"
            variants={mkStroke(fast ? 0 : 0.28)}
            initial="hidden" animate={isStroke ? "visible" : "hidden"}
            style={{ transition: "stroke 0.35s ease" }}
          />

          {/* Wheels */}
          <motion.circle cx="30" cy="58" r="9" stroke={strokeColor} strokeWidth="2.6" fill="none" variants={mkStroke(fast ? 0 : 0.38)} initial="hidden" animate={isStroke ? "visible" : "hidden"} style={{ transition: "stroke 0.35s ease" }} />
          <motion.circle cx="30" cy="58" r="4" stroke={strokeColor} strokeWidth="1.6" fill="none" variants={mkStroke(fast ? 0 : 0.42)} initial="hidden" animate={isStroke ? "visible" : "hidden"} style={{ transition: "stroke 0.35s ease" }} />
          {[0, 60, 120].map((deg, i) => (
            <motion.line key={deg} x1={30 + 4 * Math.cos((deg * Math.PI) / 180)} y1={58 + 4 * Math.sin((deg * Math.PI) / 180)} x2={30 + 8.2 * Math.cos((deg * Math.PI) / 180)} y2={58 + 8.2 * Math.sin((deg * Math.PI) / 180)} stroke={strokeColor} strokeWidth="1.4" strokeLinecap="round" variants={mkStroke(fast ? 0 : 0.44 + i * 0.03)} initial="hidden" animate={isStroke ? "visible" : "hidden"} style={{ transition: "stroke 0.35s ease" }} />
          ))}
          <motion.circle cx="90" cy="58" r="9" stroke={strokeColor} strokeWidth="2.6" fill="none" variants={mkStroke(fast ? 0 : 0.38)} initial="hidden" animate={isStroke ? "visible" : "hidden"} style={{ transition: "stroke 0.35s ease" }} />
          <motion.circle cx="90" cy="58" r="4" stroke={strokeColor} strokeWidth="1.6" fill="none" variants={mkStroke(fast ? 0 : 0.42)} initial="hidden" animate={isStroke ? "visible" : "hidden"} style={{ transition: "stroke 0.35s ease" }} />
          {[0, 60, 120].map((deg, i) => (
            <motion.line key={deg} x1={90 + 4 * Math.cos((deg * Math.PI) / 180)} y1={58 + 4 * Math.sin((deg * Math.PI) / 180)} x2={90 + 8.2 * Math.cos((deg * Math.PI) / 180)} y2={58 + 8.2 * Math.sin((deg * Math.PI) / 180)} stroke={strokeColor} strokeWidth="1.4" strokeLinecap="round" variants={mkStroke(fast ? 0 : 0.44 + i * 0.03)} initial="hidden" animate={isStroke ? "visible" : "hidden"} style={{ transition: "stroke 0.35s ease" }} />
          ))}

          {/* Lights */}
          {isFill && (
            <>
              <motion.ellipse cx="108" cy="50" rx="5" ry="3.5" fill="rgba(255,248,200,0.95)" initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.2, duration: 0.3, ease: "backOut" }} />
              <motion.ellipse cx="12" cy="50" rx="4" ry="3" fill="rgba(255,80,80,0.88)" initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.35, duration: 0.3, ease: "backOut" }} />
              <motion.circle cx="11" cy="55" r="1.5" fill="rgba(255,255,255,0.35)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.3 }} />
              <motion.circle cx="8" cy="55" r="1" fill="rgba(255,255,255,0.2)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.3 }} />
            </>
          )}
        </svg>

        {/* Shimmer sweep */}
        {shimmer && (
          <motion.div
            className="absolute inset-0 rounded-[18px] overflow-hidden pointer-events-none"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              className="absolute inset-y-0 w-2/3"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)" }}
              initial={{ left: "-70%" }}
              animate={{ left: "140%" }}
              transition={{ duration: fast ? 0.5 : 0.85, ease: [0.4, 0, 0.2, 1] }}
            />
          </motion.div>
        )}
      </motion.div>

      {/* ── WORDMARK — per-letter animation ── */}
      <div className="relative overflow-hidden">
        <motion.div
          className="flex items-baseline"
          variants={letterContainer}
          initial="hidden"
          animate={isStroke ? "visible" : "hidden"}
          style={{ perspective: "600px" }}
        >
          {yatriLetters.map((letter, i) => (
            <motion.span
              key={`y-${i}`}
              variants={letterChild}
              className="inline-block text-5xl font-extrabold tracking-tight"
              style={{ color: "hsl(220,14%,7%)", fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              {letter}
            </motion.span>
          ))}
          <motion.span variants={letterChild} className="inline-block w-2.5" />
          {aiLetters.map((letter, i) => (
            <motion.span
              key={`a-${i}`}
              variants={letterChild}
              className="inline-block text-5xl font-extrabold tracking-tight"
              style={{
                color: "hsl(347,77%,50%)",
                fontFamily: "'Inter', system-ui, sans-serif",
                textShadow: "0 0 30px hsla(347,77%,50%,0.3)",
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>

        {shimmer && (
          <motion.div
            className="pointer-events-none absolute inset-y-0"
            style={{ width: "55%", background: "linear-gradient(90deg, transparent, hsla(347,77%,50%,0.18), transparent)" }}
            initial={{ left: "-60%" }}
            animate={{ left: "160%" }}
            transition={{ duration: fast ? 0.55 : 0.85, ease: [0.4, 0, 0.2, 1] }}
          />
        )}
      </div>

      {/* Tagline with tracking animation */}
      <motion.p
        className="text-xs font-semibold uppercase"
        style={{ color: "hsl(220,9%,46%)" }}
        initial={{ opacity: 0, letterSpacing: "0.35em", y: 8 }}
        animate={isFill ? { opacity: 1, letterSpacing: "0.22em", y: 0 } : { opacity: 0, letterSpacing: "0.35em", y: 8 }}
        transition={{ duration: fast ? 0.35 : 0.7, ease: [0.22, 1, 0.36, 1], delay: fast ? 0.05 : 0.2 }}
      >
        Intelligent Indian Trip Planner
      </motion.p>

      {/* Progress bar */}
      {!fast && (
        <motion.div
          className="h-px w-36 rounded-full overflow-hidden"
          style={{ background: "hsl(350,20%,90%)" }}
          initial={{ opacity: 0 }}
          animate={isFill ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "hsl(347,77%,50%)" }}
            initial={{ width: "0%" }}
            animate={isFill ? { width: "100%" } : { width: "0%" }}
            transition={{ duration: 1.05, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
          />
        </motion.div>
      )}
    </div>
  );
};

export default SvgLogo;
