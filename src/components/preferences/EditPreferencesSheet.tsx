/**
 * EditPreferencesSheet — slide-up modal for editing travel preferences
 * from the Profile page without re-doing full onboarding.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { StepInterests, StepBudget, StepStyle } from "./PreferenceSteps";

const TABS = ["Interests", "Budget", "Style"] as const;
type Tab = (typeof TABS)[number];

const ease = [0.4, 0, 0.2, 1] as const;

const slideVariants = {
  enter: { opacity: 0, x: 18 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -14 },
};

interface Props {
  open: boolean;
  onClose: () => void;
}

const EditPreferencesSheet = ({ open, onClose }: Props) => {
  const { user, completeOnboarding } = useUser();

  const [activeTab, setActiveTab] = useState<Tab>("Interests");
  const [saved, setSaved] = useState(false);

  // Local drafts pre-filled from existing prefs
  const [interests, setInterests] = useState<string[]>(
    user?.preferences?.interests ?? []
  );
  const [budget, setBudget] = useState<"budget" | "balanced" | "premium">(
    user?.preferences?.budget ?? "balanced"
  );
  const [tripStyle, setTripStyle] = useState<
    "weekend" | "explorer" | "relaxed" | "backpacking"
  >(user?.preferences?.tripStyle ?? "explorer");
  const [offbeat, setOffbeat] = useState(user?.preferences?.offbeat ?? false);

  const toggleInterest = (id: string) =>
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const handleSave = () => {
    if (!user) return;
    completeOnboarding({
      location: user.preferences?.location ?? "",
      interests,
      budget,
      tripStyle,
      offbeat,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 900);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-[4px]"
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: "100%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.32, ease }}
            className="fixed bottom-0 left-0 right-0 z-[120] mx-auto max-w-lg rounded-t-3xl bg-white shadow-[0_-16px_64px_rgba(0,0,0,0.14)] flex flex-col"
            style={{ maxHeight: "90dvh" }}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-border" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-3 pb-4 border-b border-border">
              <div>
                <h2 className="text-base font-bold text-foreground">Edit Preferences</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Updates apply instantly to your profile
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X size={15} />
              </button>
            </div>

            {/* Tab bar */}
            <div className="flex gap-1 px-6 pt-4 pb-0">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="relative flex-1 rounded-xl py-2 text-xs font-semibold transition-colors duration-200"
                  style={{
                    color:
                      activeTab === tab
                        ? "hsl(347,77%,50%)"
                        : "hsl(220,9%,46%)",
                  }}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="pref-tab-underline"
                      transition={{ duration: 0.22, ease }}
                      className="absolute bottom-0 left-1/2 h-[2px] w-8 -translate-x-1/2 rounded-full bg-primary"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="mx-6 h-px bg-border mt-2" />

            {/* Step content — scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-hide">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeTab}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.22, ease }}
                >
                  {activeTab === "Interests" && (
                    <StepInterests selected={interests} toggle={toggleInterest} />
                  )}
                  {activeTab === "Budget" && (
                    <StepBudget budget={budget} setBudget={setBudget} />
                  )}
                  {activeTab === "Style" && (
                    <StepStyle
                      tripStyle={tripStyle}
                      setTripStyle={setTripStyle}
                      offbeat={offbeat}
                      setOffbeat={setOffbeat}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Save button */}
            <div className="px-6 pb-8 pt-3 border-t border-border">
              <motion.button
                onClick={handleSave}
                whileTap={{ scale: 0.98 }}
                className="relative w-full overflow-hidden rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:shadow-[0_6px_24px_hsla(347,77%,50%,0.28)]"
              >
                <AnimatePresence mode="wait">
                  {saved ? (
                    <motion.span
                      key="saved"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <Check size={15} />
                      Saved!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="save"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                    >
                      Save Preferences
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditPreferencesSheet;
