import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Sparkles, Wallet, Compass, X } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { interests as interestOptions } from "@/data/mockData";

const steps = ["Location", "Interests", "Budget", "Style"];

const OnboardingModal = () => {
  const { completeOnboarding } = useUser();
  const [step, setStep] = useState(0);
  const [location, setLocation] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState<"budget" | "balanced" | "premium">("balanced");
  const [tripStyle, setTripStyle] = useState<"weekend" | "explorer" | "relaxed" | "backpacking">("explorer");
  const [offbeat, setOffbeat] = useState(false);
  const [detecting, setDetecting] = useState(false);

  const detectLocation = () => {
    setDetecting(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocation("New Delhi, India");
          setDetecting(false);
        },
        () => {
          setLocation("New Delhi, India");
          setDetecting(false);
        }
      );
    } else {
      setLocation("New Delhi, India");
      setDetecting(false);
    }
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const next = () => {
    if (step < 3) setStep(step + 1);
    else {
      completeOnboarding({
        location,
        interests: selectedInterests,
        budget,
        tripStyle,
        offbeat,
      });
    }
  };

  const slideVariants = {
    enter: { opacity: 0, x: 60 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -60 },
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-lg rounded-3xl bg-card p-6 shadow-2xl md:p-8"
      >
        {/* Progress */}
        <div className="mb-6 flex gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {step === 0 && (
              <div>
                <div className="mb-1 flex items-center gap-2 text-primary">
                  <MapPin size={20} />
                  <span className="text-xs font-semibold uppercase tracking-wider">Step 1</span>
                </div>
                <h2 className="mb-2 text-2xl font-bold text-foreground">Where are you?</h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  We'll show destinations within 300–500 km
                </p>
                <div className="flex gap-2">
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter your city"
                    className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    onClick={detectLocation}
                    disabled={detecting}
                    className="rounded-xl bg-accent px-4 py-3 text-sm font-medium text-accent-foreground transition-transform hover:scale-105"
                  >
                    {detecting ? "..." : "Detect"}
                  </button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <div className="mb-1 flex items-center gap-2 text-primary">
                  <Sparkles size={20} />
                  <span className="text-xs font-semibold uppercase tracking-wider">Step 2</span>
                </div>
                <h2 className="mb-2 text-2xl font-bold text-foreground">What excites you?</h2>
                <p className="mb-6 text-sm text-muted-foreground">Select all that interest you</p>
                <div className="grid grid-cols-2 gap-3">
                  {interestOptions.map((interest) => {
                    const selected = selectedInterests.includes(interest.id);
                    return (
                      <button
                        key={interest.id}
                        onClick={() => toggleInterest(interest.id)}
                        className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all hover:scale-[1.02] ${
                          selected
                            ? "border-primary bg-accent glow-border"
                            : "border-border bg-background"
                        }`}
                      >
                        <span className="text-2xl">{interest.icon}</span>
                        <span className="text-sm font-medium text-foreground">
                          {interest.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="mb-1 flex items-center gap-2 text-primary">
                  <Wallet size={20} />
                  <span className="text-xs font-semibold uppercase tracking-wider">Step 3</span>
                </div>
                <h2 className="mb-2 text-2xl font-bold text-foreground">Your comfort level?</h2>
                <p className="mb-6 text-sm text-muted-foreground">Pick your travel budget style</p>
                <div className="flex flex-col gap-3">
                  {(["budget", "balanced", "premium"] as const).map((b) => (
                    <button
                      key={b}
                      onClick={() => setBudget(b)}
                      className={`rounded-2xl border-2 px-6 py-4 text-left transition-all hover:scale-[1.01] ${
                        budget === b
                          ? "border-primary bg-accent glow-border"
                          : "border-border bg-background"
                      }`}
                    >
                      <span className="text-base font-semibold capitalize text-foreground">
                        {b === "budget" ? "💰 Budget Friendly" : b === "balanced" ? "⚖️ Balanced" : "✨ Premium"}
                      </span>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {b === "budget" ? "Best value, hostels & street food" : b === "balanced" ? "Comfort without splurging" : "Luxury stays & fine dining"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="mb-1 flex items-center gap-2 text-primary">
                  <Compass size={20} />
                  <span className="text-xs font-semibold uppercase tracking-wider">Step 4</span>
                </div>
                <h2 className="mb-2 text-2xl font-bold text-foreground">How do you travel?</h2>
                <p className="mb-6 text-sm text-muted-foreground">Pick your style & preference</p>
                <div className="grid grid-cols-2 gap-3">
                  {(["weekend", "explorer", "relaxed", "backpacking"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setTripStyle(s)}
                      className={`rounded-2xl border-2 px-4 py-4 text-center transition-all hover:scale-[1.02] ${
                        tripStyle === s
                          ? "border-primary bg-accent glow-border"
                          : "border-border bg-background"
                      }`}
                    >
                      <span className="text-sm font-semibold capitalize text-foreground">
                        {s === "weekend" ? "🏕️ Weekend" : s === "explorer" ? "🗺️ Explorer" : s === "relaxed" ? "😌 Relaxed" : "🎒 Backpacking"}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between rounded-2xl border border-border bg-background px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {offbeat ? "Offbeat / Less Crowded" : "Popular Destinations"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {offbeat ? "Hidden gems & untouched beauty" : "Well-known, well-loved places"}
                    </p>
                  </div>
                  <button
                    onClick={() => setOffbeat(!offbeat)}
                    className={`relative h-7 w-12 rounded-full transition-colors ${
                      offbeat ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-6 w-6 rounded-full bg-card shadow-md transition-transform ${
                        offbeat ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 rounded-2xl border border-border py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Back
            </button>
          )}
          <button
            onClick={next}
            disabled={step === 0 && !location}
            className="flex-1 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-50"
          >
            {step === 3 ? "Start Exploring" : "Continue"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingModal;
