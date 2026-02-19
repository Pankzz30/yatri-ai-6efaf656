import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SvgLogoProps {
  stage: "hidden" | "stroke" | "fill" | "done";
}

const SvgLogo = ({ stage }: SvgLogoProps) => {
  const [shimmer, setShimmer] = useState(false);

  useEffect(() => {
    if (stage === "fill") {
      const t = setTimeout(() => setShimmer(true), 400);
      return () => clearTimeout(t);
    }
    setShimmer(false);
  }, [stage]);

  const strokeVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1.4, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] },
    },
  };

  const fillVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" as const },
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

      {/* SVG icon mark */}
      <div className="relative">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          className="overflow-visible"
        >
          {/* Rounded rect background — fills in */}
          <motion.rect
            x="4" y="4" width="72" height="72" rx="20"
            fill="hsl(347,77%,50%)"
            variants={fillVariants}
            initial="hidden"
            animate={isFill ? "visible" : "hidden"}
          />
          {/* Stroke outline of rect */}
          <motion.rect
            x="4" y="4" width="72" height="72" rx="20"
            stroke="hsl(347,77%,50%)"
            strokeWidth="2.5"
            fill="none"
            variants={strokeVariants}
            initial="hidden"
            animate={isStroke ? "visible" : "hidden"}
          />

          {/* Abstract "Y" path — stroke then becomes white on fill */}
          <motion.path
            d="M28 22 L40 36 L52 22"
            stroke={isFill ? "white" : "hsl(347,77%,50%)"}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            variants={strokeVariants}
            initial="hidden"
            animate={isStroke ? "visible" : "hidden"}
            style={{ transition: "stroke 0.4s ease" }}
          />
          <motion.path
            d="M40 36 L40 58"
            stroke={isFill ? "white" : "hsl(347,77%,50%)"}
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            variants={strokeVariants}
            initial="hidden"
            animate={isStroke ? "visible" : "hidden"}
            style={{ transition: "stroke 0.4s ease" }}
          />

          {/* AI spark dots */}
          {isFill && (
            <>
              <motion.circle
                cx="56" cy="28" r="3.5"
                fill="white"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4, ease: "backOut" }}
              />
              <motion.circle
                cx="62" cy="36" r="2.5"
                fill="rgba(255,255,255,0.7)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45, duration: 0.4, ease: "backOut" }}
              />
              <motion.circle
                cx="56" cy="44" r="3"
                fill="rgba(255,255,255,0.5)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.4, ease: "backOut" }}
              />
            </>
          )}
        </svg>

        {/* Shimmer sweep over icon */}
        {shimmer && (
          <motion.div
            className="absolute inset-0 rounded-[20px] overflow-hidden pointer-events-none"
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
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
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
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
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
            transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
          />
        )}
      </div>

      {/* Tagline */}
      <motion.p
        className="text-xs font-semibold tracking-[0.22em] uppercase"
        style={{ color: "hsl(220,9%,46%)" }}
        initial={{ opacity: 0 }}
        animate={isFill ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
      >
        Intelligent Indian Trip Planner
      </motion.p>

      {/* Progress bar */}
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
    </div>
  );
};

export default SvgLogo;
