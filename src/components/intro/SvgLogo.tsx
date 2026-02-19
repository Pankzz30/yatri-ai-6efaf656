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

  const strokeDuration = fast ? 0.45 : 1.4;

  const strokeVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: strokeDuration, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] },
    },
  };

  const fillVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: fast ? 0.3 : 0.6, ease: "easeOut" as const },
    },
  };

  const glowVariants = {
    hidden: { opacity: 0 },
    pulse: {
      opacity: [0.4, 0.9, 0.4],
      transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut" as const },
    },
  };

  const isStroke = stage === "stroke" || stage === "fill" || stage === "done";
  const isFill = stage === "fill" || stage === "done";

  if (stage === "hidden") return null;

  return (
    <div className="relative flex flex-col items-center gap-4 select-none">
      {/* Glow backdrop */}
      <motion.div
        variants={glowVariants}
        initial="hidden"
        animate={isFill ? "pulse" : "hidden"}
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, hsla(347,77%,50%,0.18) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* SVG icon mark — car shape */}
      <div className="relative">
        <svg
          width="100"
          height="80"
          viewBox="0 0 100 80"
          fill="none"
          className="overflow-visible"
        >
          {/* Rounded rect background */}
          <motion.rect
            x="2" y="4" width="96" height="72" rx="18"
            fill="hsl(347,77%,50%)"
            variants={fillVariants}
            initial="hidden"
            animate={isFill ? "visible" : "hidden"}
          />
          {/* Stroke outline */}
          <motion.rect
            x="2" y="4" width="96" height="72" rx="18"
            stroke="hsl(347,77%,50%)"
            strokeWidth="2.5"
            fill="none"
            variants={strokeVariants}
            initial="hidden"
            animate={isStroke ? "visible" : "hidden"}
          />

          {/* ── CAR BODY ── */}
          {/* Main body lower */}
          <motion.path
            d="M14 47 L14 56 Q14 60 18 60 L82 60 Q86 60 86 56 L86 47 Z"
            stroke={isFill ? "white" : "hsl(347,77%,50%)"}
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            variants={strokeVariants}
            initial="hidden"
            animate={isStroke ? "visible" : "hidden"}
            style={{ transition: "stroke 0.4s ease" }}
          />
          {/* Cabin / roof */}
          <motion.path
            d="M28 47 L33 33 Q35 29 40 29 L60 29 Q65 29 67 33 L72 47 Z"
            stroke={isFill ? "white" : "hsl(347,77%,50%)"}
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            variants={strokeVariants}
            initial="hidden"
            animate={isStroke ? "visible" : "hidden"}
            style={{ transition: "stroke 0.4s ease" }}
          />
          {/* Windshield split line */}
          <motion.line
            x1="50" y1="30" x2="50" y2="47"
            stroke={isFill ? "rgba(255,255,255,0.55)" : "hsla(347,77%,50%,0.55)"}
            strokeWidth="1.8"
            strokeLinecap="round"
            variants={strokeVariants}
            initial="hidden"
            animate={isStroke ? "visible" : "hidden"}
            style={{ transition: "stroke 0.4s ease" }}
          />

          {/* Left wheel */}
          <motion.circle
            cx="28" cy="60" r="7"
            stroke={isFill ? "white" : "hsl(347,77%,50%)"}
            strokeWidth="2.8"
            fill="none"
            variants={strokeVariants}
            initial="hidden"
            animate={isStroke ? "visible" : "hidden"}
            style={{ transition: "stroke 0.4s ease" }}
          />
          {/* Left wheel hub */}
          <motion.circle
            cx="28" cy="60" r="2.5"
            fill={isFill ? "white" : "hsl(347,77%,50%)"}
            initial={{ opacity: 0 }}
            animate={isStroke ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: strokeDuration * 0.7, duration: 0.3 }}
            style={{ transition: "fill 0.4s ease" }}
          />

          {/* Right wheel */}
          <motion.circle
            cx="72" cy="60" r="7"
            stroke={isFill ? "white" : "hsl(347,77%,50%)"}
            strokeWidth="2.8"
            fill="none"
            variants={strokeVariants}
            initial="hidden"
            animate={isStroke ? "visible" : "hidden"}
            style={{ transition: "stroke 0.4s ease" }}
          />
          {/* Right wheel hub */}
          <motion.circle
            cx="72" cy="60" r="2.5"
            fill={isFill ? "white" : "hsl(347,77%,50%)"}
            initial={{ opacity: 0 }}
            animate={isStroke ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: strokeDuration * 0.7, duration: 0.3 }}
            style={{ transition: "fill 0.4s ease" }}
          />

          {/* Headlight */}
          {isFill && (
            <motion.ellipse
              cx="84" cy="50" rx="4" ry="3"
              fill="rgba(255,255,220,0.9)"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.25, duration: 0.35, ease: "backOut" }}
            />
          )}
          {/* Tail light */}
          {isFill && (
            <motion.ellipse
              cx="16" cy="50" rx="3.5" ry="2.5"
              fill="rgba(255,100,100,0.85)"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.35, ease: "backOut" }}
            />
          )}
        </svg>

        {/* Shimmer sweep over icon */}
        {shimmer && (
          <motion.div
            className="absolute inset-0 rounded-[18px] overflow-hidden pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="absolute inset-y-0 w-2/3"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
              }}
              initial={{ left: "-70%" }}
              animate={{ left: "140%" }}
              transition={{ duration: fast ? 0.5 : 0.8, ease: [0.4, 0, 0.2, 1] }}
            />
          </motion.div>
        )}
      </div>

      {/* Wordmark */}
      <div className="relative overflow-hidden">
        <motion.div
          className="flex items-baseline gap-1"
          initial={{ opacity: 0, y: 20 }}
          animate={isStroke ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: fast ? 0.3 : 0.6, ease: "easeOut", delay: fast ? 0.1 : 0.4 }}
        >
          <span
            className="text-5xl font-bold tracking-tight"
            style={{ color: "hsl(220,14%,7%)" }}
          >
            Yatri
          </span>
          <span
            className="text-5xl font-bold tracking-tight ml-2"
            style={{ color: "hsl(347,77%,50%)" }}
          >
            AI
          </span>
        </motion.div>

        {/* Shimmer sweep over wordmark */}
        {shimmer && (
          <motion.div
            className="pointer-events-none absolute inset-y-0"
            style={{
              width: "55%",
              background: "linear-gradient(90deg, transparent, hsla(347,77%,50%,0.14), transparent)",
            }}
            initial={{ left: "-60%" }}
            animate={{ left: "160%" }}
            transition={{ duration: fast ? 0.55 : 0.85, ease: [0.4, 0, 0.2, 1] }}
          />
        )}
      </div>

      {/* Tagline */}
      <motion.p
        className="text-xs font-semibold tracking-[0.22em] uppercase"
        style={{ color: "hsl(220,9%,46%)" }}
        initial={{ opacity: 0 }}
        animate={isFill ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: fast ? 0.35 : 0.7, ease: "easeOut", delay: fast ? 0.05 : 0.2 }}
      >
        Intelligent Indian Trip Planner
      </motion.p>

      {/* Progress bar — only in full mode */}
      {!fast && (
        <motion.div
          className="h-px w-32 rounded-full overflow-hidden"
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
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
          />
        </motion.div>
      )}
    </div>
  );
};

export default SvgLogo;
