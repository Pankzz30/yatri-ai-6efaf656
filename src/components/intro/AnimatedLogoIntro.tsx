import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import SvgLogo from "./SvgLogo";

type Stage = "svg-stroke" | "svg-fill" | "exit" | "done";

interface AnimatedLogoIntroProps {
  onComplete: () => void;
  fast?: boolean;
}

// Full cinematic: ~5s — stroke draw then fill
const FULL_TIMINGS = {
  "svg-fill": 2200,
  "exit":     4400,
  "done":     5100,
};

// Fast return: ~1.6s
const FAST_TIMINGS = {
  "svg-fill": 350,
  "exit":     1100,
  "done":     1650,
};

const AnimatedLogoIntro = ({ onComplete, fast = false }: AnimatedLogoIntroProps) => {
  const timings = fast ? FAST_TIMINGS : FULL_TIMINGS;
  const [stage, setStage] = useState<Stage>("svg-stroke");
  const [dims]  = useState({ w: window.innerWidth, h: window.innerHeight });
  const timers  = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const s = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      timers.current.push(t);
    };
    s(() => setStage("svg-fill"),  timings["svg-fill"]);
    s(() => setStage("exit"),      timings["exit"]);
    s(() => { setStage("done"); onComplete(); }, timings["done"]);
    return () => timers.current.forEach(clearTimeout);
  }, [onComplete, fast]); // eslint-disable-line react-hooks/exhaustive-deps

  const logoStage =
    stage === "svg-fill" || stage === "exit" ? "fill" : "stroke";

  if (stage === "done") return null;

  return (
    <AnimatePresence>
      <motion.div
        key="intro"
        className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
        style={{ background: "hsl(0,0%,100%)" }}
        initial={{ opacity: 1 }}
        animate={stage === "exit" ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: fast ? 0.42 : 0.65, ease: "easeInOut" }}
      >
        {/* Ambient radial glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={
            stage === "svg-fill" || stage === "exit"
              ? { background: [
                  "radial-gradient(ellipse at 50% 50%, hsla(347,77%,50%,0.04) 0%, transparent 68%)",
                  "radial-gradient(ellipse at 50% 50%, hsla(347,77%,50%,0.11) 0%, transparent 68%)",
                  "radial-gradient(ellipse at 50% 50%, hsla(347,77%,50%,0.05) 0%, transparent 68%)",
                ] }
              : { background: "radial-gradient(ellipse at 50% 50%, hsla(347,77%,50%,0.03) 0%, transparent 68%)" }
          }
          transition={{ duration: fast ? 0.5 : 1.1, ease: "easeInOut" }}
        />

        {/* Logo — shrinks to navbar on exit */}
        <motion.div
          initial={fast ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
          animate={
            stage === "exit"
              ? { scale: 0.3, y: -(dims.h / 2 - 32), opacity: 0 }
              : fast
              ? { opacity: 1, scale: 1 }
              : { scale: 1, y: 0, opacity: 1 }
          }
          transition={
            stage === "exit"
              ? { duration: fast ? 0.38 : 0.6, ease: [0.4, 0, 0.2, 1] }
              : { duration: fast ? 0.38 : 0.5, ease: "easeOut" }
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
