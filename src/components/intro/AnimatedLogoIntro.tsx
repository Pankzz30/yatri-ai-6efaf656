import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import ParticleField from "./ParticleField";
import SvgLogo from "./SvgLogo";

type Stage =
  | "particles-build"   // 0–2s   particles drift in
  | "particles-form"    // 2–3s   particles cluster toward logo
  | "svg-stroke"        // 3–4.5s SVG strokes draw
  | "svg-fill"          // 4.5–5.5s logo fills + shimmer
  | "exit"              // 5.5–6s  scale-down, fade content in
  | "done";             // 6s+    hidden

interface AnimatedLogoIntroProps {
  onComplete: () => void;
}

const STAGE_TIMINGS: Record<Stage, number> = {
  "particles-build": 0,
  "particles-form": 2000,
  "svg-stroke": 3000,
  "svg-fill": 4500,
  "exit": 5500,
  "done": 6200,
};

const AnimatedLogoIntro = ({ onComplete }: AnimatedLogoIntroProps) => {
  const [stage, setStage] = useState<Stage>("particles-build");
  const [dims, setDims] = useState({ w: window.innerWidth, h: window.innerHeight });
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const onResize = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    // Clear any previous timers
    timers.current.forEach(clearTimeout);
    timers.current = [];

    const schedule = (fn: () => void, delay: number) => {
      const t = setTimeout(fn, delay);
      timers.current.push(t);
    };

    schedule(() => setStage("particles-form"), STAGE_TIMINGS["particles-form"]);
    schedule(() => setStage("svg-stroke"), STAGE_TIMINGS["svg-stroke"]);
    schedule(() => setStage("svg-fill"), STAGE_TIMINGS["svg-fill"]);
    schedule(() => setStage("exit"), STAGE_TIMINGS["exit"]);
    schedule(() => {
      setStage("done");
      onComplete();
    }, STAGE_TIMINGS["done"]);

    return () => timers.current.forEach(clearTimeout);
  }, [onComplete]);

  const particleStage =
    stage === "particles-build"
      ? "build"
      : stage === "particles-form"
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
        transition={{ duration: 0.7, ease: "easeInOut" }}
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
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />

        {/* Particle canvas */}
        <ParticleField
          stage={particleStage}
          width={dims.w}
          height={dims.h}
        />

        {/* Logo — scales down on exit */}
        <motion.div
          animate={
            stage === "exit"
              ? { scale: 0.35, y: -(dims.h / 2 - 36), opacity: 0 }
              : { scale: 1, y: 0, opacity: 1 }
          }
          transition={
            stage === "exit"
              ? { duration: 0.65, ease: [0.4, 0, 0.2, 1] }
              : { duration: 0.5, ease: "easeOut" }
          }
          className="relative z-10"
        >
          <SvgLogo stage={logoStage} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedLogoIntro;
