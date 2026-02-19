import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface LogoIntroProps {
  onComplete: () => void;
}

const LogoIntro = ({ onComplete }: LogoIntroProps) => {
  const [phase, setPhase] = useState<"enter" | "sweep" | "exit">("enter");

  useEffect(() => {
    // Phase timeline
    const sweepTimer = setTimeout(() => setPhase("sweep"), 900);
    const exitTimer = setTimeout(() => setPhase("exit"), 1700);
    const doneTimer = setTimeout(() => onComplete(), 2600);

    return () => {
      clearTimeout(sweepTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" ? (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        >
          {/* Subtle background pulse */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background:
                phase === "sweep"
                  ? [
                      "radial-gradient(ellipse at 50% 50%, hsla(347,77%,50%,0.04) 0%, transparent 70%)",
                      "radial-gradient(ellipse at 50% 50%, hsla(347,77%,50%,0.10) 0%, transparent 70%)",
                      "radial-gradient(ellipse at 50% 50%, hsla(347,77%,50%,0.04) 0%, transparent 70%)",
                    ]
                  : "radial-gradient(ellipse at 50% 50%, hsla(347,77%,50%,0.04) 0%, transparent 70%)",
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {/* Logo container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 12 }}
            animate={{ opacity: 1, scale: phase === "sweep" ? 1.04 : 1, y: 0 }}
            transition={{
              opacity: { duration: 0.6, ease: "easeOut" },
              scale: { duration: 0.5, ease: "easeOut" },
              y: { duration: 0.6, ease: "easeOut" },
            }}
            className="relative flex flex-col items-center gap-5"
          >
            {/* Icon mark */}
            <motion.div
              className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-primary shadow-2xl"
              animate={
                phase === "sweep"
                  ? {
                      boxShadow: [
                        "0 0 0px hsla(347,77%,50%,0)",
                        "0 0 40px hsla(347,77%,50%,0.55), 0 0 80px hsla(347,77%,50%,0.25)",
                        "0 0 20px hsla(347,77%,50%,0.30)",
                      ],
                    }
                  : {
                      boxShadow: "0 20px 60px hsla(347,77%,50%,0.30)",
                    }
              }
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              {/* Icon SVG */}
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>

              {/* Sweep shimmer overlay on icon */}
              {phase === "sweep" && (
                <motion.div
                  className="absolute inset-0 rounded-3xl overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1 }}
                >
                  <motion.div
                    className="absolute inset-y-0 w-1/2"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
                    }}
                    initial={{ left: "-60%" }}
                    animate={{ left: "150%" }}
                    transition={{ duration: 0.65, ease: "easeInOut" }}
                  />
                </motion.div>
              )}
            </motion.div>

            {/* Wordmark */}
            <div className="relative overflow-hidden">
              <motion.div
                className="flex items-baseline gap-0"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.55, ease: "easeOut" }}
              >
                <span className="text-5xl font-bold tracking-tight text-foreground">
                  Yatri
                </span>
                <span className="text-5xl font-bold tracking-tight text-primary ml-2">
                  AI
                </span>
              </motion.div>

              {/* Sweep streak across wordmark */}
              {phase === "sweep" && (
                <motion.div
                  className="pointer-events-none absolute inset-y-0"
                  style={{
                    width: "60%",
                    background:
                      "linear-gradient(90deg, transparent, hsla(347,77%,50%,0.12), transparent)",
                  }}
                  initial={{ left: "-60%" }}
                  animate={{ left: "160%" }}
                  transition={{ duration: 0.65, ease: "easeInOut" }}
                />
              )}
            </div>

            {/* Tagline */}
            <motion.p
              className="text-sm font-medium tracking-widest text-muted-foreground uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "sweep" ? 1 : 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              Intelligent Indian Trip Planner
            </motion.p>

            {/* Red bottom bar loader */}
            <motion.div
              className="h-0.5 w-40 overflow-hidden rounded-full bg-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "sweep" ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: phase === "sweep" ? "100%" : "0%" }}
                transition={{ duration: 0.8, ease: "easeInOut", delay: 0.05 }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default LogoIntro;
