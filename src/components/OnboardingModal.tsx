import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Sparkles, Wallet, Compass, Navigation } from "lucide-react";
import { useUser } from "@/context/UserContext";
import TypingEffect from "./onboarding/TypingEffect";
import IndiaMapPreview from "./onboarding/IndiaMapPreview";
import { StepInterests, StepBudget, StepStyle } from "./preferences/PreferenceSteps";

/* ─── constants ──────────────────────────────────────────── */
const STEPS = ["Location", "Interests", "Budget", "Style"];

const AI_PROMPTS = [
  "Let's plan something unforgettable…",
  "Nice choice. Now, what excites you?",
  "Smart traveler. What's your comfort level?",
  "Almost ready. How do you like to travel?",
];

const AI_RESPONSES: Record<number, string> = {
  1: "Nice choice.",
  2: "Smart traveler.",
  3: "Almost ready.",
};

const slideVariants = {
  enter: { opacity: 0, x: 22 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -16 },
};

const easing = [0.4, 0, 0.2, 1] as const;

/* ─── progress dots ──────────────────────────────────────── */
const ProgressDots = ({ step, total }: { step: number; total: number }) => (
  <div className="flex items-center gap-0">
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className="flex items-center">
        <motion.div
          animate={{
            width: i === step ? 20 : 8,
            backgroundColor:
              i < step
                ? "hsl(347,77%,50%)"
                : i === step
                ? "hsl(347,77%,50%)"
                : "hsl(350,20%,88%)",
          }}
          transition={{ duration: 0.35, ease: easing }}
          className="h-2 rounded-full"
          style={{ width: i === step ? 20 : 8 }}
        />
        {i < total - 1 && (
          <motion.div
            animate={{ backgroundColor: i < step ? "hsl(347,77%,50%)" : "hsl(350,20%,88%)" }}
            transition={{ duration: 0.35 }}
            className="h-[2px] w-5 mx-0.5"
          />
        )}
      </div>
    ))}
  </div>
);

/* ─── main component ─────────────────────────────────────── */
const OnboardingModal = () => {
  const { completeOnboarding } = useUser();
  const [step, setStep] = useState(0);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState<"budget" | "balanced" | "premium">("balanced");
  const [tripStyle, setTripStyle] = useState<"weekend" | "explorer" | "relaxed" | "backpacking">("explorer");
  const [offbeat, setOffbeat] = useState(false);
  const [detecting, setDetecting] = useState(false);

  /* Show AI response chip briefly after advancing */
  const showAiResponse = (nextStep: number) => {
    const msg = AI_RESPONSES[nextStep];
    if (msg) {
      setAiResponse(msg);
      setTimeout(() => setAiResponse(null), 2200);
    }
  };

  const detectLocation = () => {
    setDetecting(true);
    const onDone = () => { setLocation("New Delhi, India"); setDetecting(false); };
    navigator.geolocation
      ? navigator.geolocation.getCurrentPosition(onDone, onDone)
      : onDone();
  };

  const toggleInterest = (id: string) =>
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const next = () => {
    if (step < 3) {
      const nextStep = step + 1;
      showAiResponse(nextStep);
      setStep(nextStep);
    } else {
      completeOnboarding({ location, interests: selectedInterests, budget, tripStyle, offbeat });
    }
  };

  const back = () => step > 0 && setStep(step - 1);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[6px] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: easing }}
        className="relative w-full max-w-3xl rounded-3xl bg-white shadow-[0_32px_80px_rgba(0,0,0,0.18)] overflow-hidden"
      >
        <div className="flex min-h-[540px]">

          {/* ── LEFT: Map panel (desktop only) ── */}
          <div className="hidden lg:block w-[230px] flex-shrink-0 bg-[hsl(350,60%,99%)] border-r border-[hsl(350,20%,92%)] p-7">
            <IndiaMapPreview
              location={location}
              interests={selectedInterests}
              budget={budget}
              tripStyle={tripStyle}
              step={step}
            />
          </div>

          {/* ── RIGHT: Form panel ── */}
          <div className="flex-1 flex flex-col p-7 md:p-10">

            {/* Top bar: dots + AI response */}
            <div className="flex items-center justify-between mb-8">
              <ProgressDots step={step} total={4} />
              <AnimatePresence>
                {aiResponse && (
                  <motion.div
                    key={aiResponse}
                    initial={{ opacity: 0, x: 10, scale: 0.92 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.25, ease: easing }}
                    className="flex items-center gap-1.5 rounded-full bg-accent border border-primary/10 px-3.5 py-1.5 text-xs font-semibold text-accent-foreground shadow-sm"
                  >
                    <Sparkles size={11} className="text-primary" />
                    {aiResponse}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* AI typing headline */}
            <div className="mb-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary mb-2">
                Yatri AI
              </p>
              <h2 className="text-xl font-bold text-foreground leading-snug">
                <TypingEffect key={step} text={AI_PROMPTS[step]} speed={36} />
              </h2>
            </div>

            {/* Step content */}
            <div className="flex-1 min-h-0">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: easing }}
                  className="h-full"
                >
                  {step === 0 && <StepLocation location={location} setLocation={setLocation} detecting={detecting} detectLocation={detectLocation} />}
                  {step === 1 && <StepInterests selected={selectedInterests} toggle={toggleInterest} />}
                  {step === 2 && <StepBudget budget={budget} setBudget={setBudget} />}
                  {step === 3 && <StepStyle tripStyle={tripStyle} setTripStyle={setTripStyle} offbeat={offbeat} setOffbeat={setOffbeat} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Nav buttons */}
            <div className="mt-8 flex gap-3">
              {step > 0 && (
                <button
                  onClick={back}
                  className="flex-1 rounded-2xl border border-border py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  Back
                </button>
              )}
              <button
                onClick={next}
                disabled={step === 0 && !location}
                className="flex-1 rounded-2xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:shadow-[0_6px_24px_hsla(347,77%,50%,0.28)] hover:scale-[1.015] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {step === 3 ? "Start Exploring →" : "Continue"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   STEP 0 — Location (local, not shared)
══════════════════════════════════════════════════════ */
const StepLocation = ({
  location, setLocation, detecting, detectLocation,
}: {
  location: string; setLocation: (v: string) => void; detecting: boolean; detectLocation: () => void;
}) => (
  <div className="space-y-5">
    <div className="relative">
      <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter your city"
        className="w-full rounded-2xl border border-input bg-background pl-10 pr-4 py-3.5 text-sm text-foreground outline-none transition-all focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
      />
    </div>
    <button
      onClick={detectLocation}
      disabled={detecting}
      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-white py-3 text-sm font-medium text-foreground transition-all hover:border-primary/30 hover:bg-accent disabled:opacity-50"
    >
      <Navigation size={14} className={detecting ? "animate-spin text-primary" : "text-primary"} />
      {detecting ? "Detecting…" : "Auto-detect my location"}
    </button>
    {location && (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 rounded-2xl bg-accent border border-primary/10 px-4 py-3 text-sm text-accent-foreground"
      >
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        <span className="font-medium">{location}</span>
        <span className="text-muted-foreground">· Ready to explore</span>
      </motion.div>
    )}
  </div>
);

export default OnboardingModal;
