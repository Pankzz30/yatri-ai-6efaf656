import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import ParticleField from "./ParticleField";
import SvgLogo from "./SvgLogo";

type Stage =
  | "particles-build"
  | "particles-form"
  | "svg-stroke"
  | "svg-fill"
  | "exit"
  | "done";

interface AnimatedLogoIntroProps {
  onComplete: () => void;
  /** Fast mode: no particles, just logo fade-in + shimmer → out (~1.8s) */
  fast?: boolean;
}

// Full cinematic: 5–6s
const FULL_TIMINGS: Record<Stage, number> = {
  "particles-build": 0,
  "particles-form": 2000,
  "svg-stroke": 3000,
  "svg-fill": 4500,
  "exit": 5500,
  "done": 6200,
};

// Fast return: 1.8s total — skip particles, straight to fill
const FAST_TIMINGS: Record<Stage, number> = {
  "particles-build": 0,
  "particles-form": 0,
  "svg-stroke": 0,
  "svg-fill": 400,
  "exit": 1200,
  "done": 1800,
};

const AnimatedLogoIntro = ({ onComplete, fast = false }: AnimatedLogoIntroProps) => {
  const timings = fast ? FAST_TIMINGS : FULL_TIMINGS;
  const [stage, setStage] = useState<Stage>(fast ? "svg-stroke" : "particles-build");
  const [dims, setDims] = useState({ w: window.innerWidth, h: window.innerHeight });
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const onResize = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    const schedule = (fn: () => void, delay: number) => {
      const t = setTimeout(fn, delay);
      timers.current.push(t);
    };

    if (!fast) {
      schedule(() => setStage("particles-form"), timings["particles-form"]);
      schedule(() => setStage("svg-stroke"), timings["svg-stroke"]);
    }
    schedule(() => setStage("svg-fill"), timings["svg-fill"]);
    schedule(() => setStage("exit"), timings["exit"]);
    schedule(() => {
      setStage("done");
      onComplete();
    }, timings["done"]);

    return () => timers.current.forEach(clearTimeout);
  }, [onComplete, fast]); // eslint-disable-line react-hooks/exhaustive-deps

  const particleStage =
    !fast && stage === "particles-build"
      ? "build"
      : !fast && stage === "particles-form"
      ? "form"
      : stage === "svg-stroke" || stage === "svg-fill"
      ? "dissolve"
      : "done";

  const logoStage =
    stage === "svg-stroke" || stage === "svg-fill" || stage === "exit" || stage === "done"
      ? stage === "svg-fill" || stage === "exit" || stage === "done"
        ? "fill"
        : "stroke"
      : "hidden";

  if (stage === "done") return null;

  return (
    <AnimatePresence>
      <motion.div
        key="intro"
        className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
        style={{ background: "hsl(0,0%,100%)" }}
        initial={{ opacity: 1 }}
        animate={stage === "exit" ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: fast ? 0.45 : 0.7, ease: "easeInOut" }}
      >
        {/* Subtle mesh glow bg */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={
            stage === "svg-fill" || stage === "exit"
              ? {
                  background: [
                    "radial-gradient(ellipse at 50% 50%, hsla(347,77%,50%,0.04) 0%, transparent 70%)",
                    "radial-gradient(ellipse at 50% 50%, hsla(347,77%,50%,0.10) 0%, transparent 70%)",
                    "radial-gradient(ellipse at 50% 50%, hsla(347,77%,50%,0.05) 0%, transparent 70%)",
                  ],
                }
              : {
                  background:
                    "radial-gradient(ellipse at 50% 50%, hsla(347,77%,50%,0.03) 0%, transparent 70%)",
                }
          }
          transition={{ duration: fast ? 0.5 : 1.2, ease: "easeInOut" }}
        />

        {/* Particles — only in full mode */}
        {!fast && (
          <ParticleField stage={particleStage} width={dims.w} height={dims.h} />
        )}

        {/* Logo */}
        <motion.div
          initial={fast ? { opacity: 0, scale: 0.92 } : { opacity: 1, scale: 1 }}
          animate={
            stage === "exit"
              ? { scale: 0.35, y: -(dims.h / 2 - 36), opacity: 0 }
              : fast
              ? { opacity: 1, scale: 1 }
              : { scale: 1, y: 0, opacity: 1 }
          }
          transition={
            stage === "exit"
              ? { duration: fast ? 0.4 : 0.65, ease: [0.4, 0, 0.2, 1] }
              : { duration: fast ? 0.4 : 0.5, ease: "easeOut" }
          }
          className="relative z-10"
        >
          <SvgLogo stage={logoStage} fast={fast} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedLogoIntro;
