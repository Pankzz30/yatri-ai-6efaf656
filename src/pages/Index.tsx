import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import OnboardingModal from "@/components/OnboardingModal";
import AnimatedLogoIntro from "@/components/intro/AnimatedLogoIntro";
import HeroSection from "@/components/HeroSection";
import BelowHeroSections from "@/components/BelowHeroSections";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
};

const Index = () => {
  const { isAuthenticated, user } = useUser();
  const showOnboarding = isAuthenticated && user?.isFirstLogin;

  const isFirstVisit = !sessionStorage.getItem("yatri_visited");
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = () => {
    sessionStorage.setItem("yatri_visited", "1");
    setIntroComplete(true);
  };

  return (
    <>
      {!introComplete && (
        <AnimatedLogoIntro fast={!isFirstVisit} onComplete={handleIntroComplete} />
      )}

      <motion.div
        className="min-h-screen bg-background pb-16 md:pb-0"
        variants={container}
        initial="hidden"
        animate={introComplete ? "visible" : "hidden"}
      >
        {showOnboarding && <OnboardingModal />}

        {/* ── HERO ── */}
        <HeroSection isAuthenticated={isAuthenticated} sceneStartSignal={introComplete} />

        {/* ── DYNAMIC BELOW-HERO SECTIONS ── */}
        <BelowHeroSections />

        {/* ── FOOTER ── */}
        <footer className="border-t border-border py-10">
          <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <svg width="18" height="11" viewBox="0 0 120 72" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 46 L10 54 Q10 58 14 58 L106 58 Q110 58 110 54 L110 46 Z" strokeWidth="9"/>
                  <path d="M24 46 C26 38 32 26 42 22 L78 22 C88 22 94 30 96 38 L100 46" strokeWidth="9"/>
                  <path d="M96 38 L106 46" strokeWidth="9"/>
                  <circle cx="30" cy="58" r="9" strokeWidth="8"/>
                  <circle cx="90" cy="58" r="9" strokeWidth="8"/>
                </svg>
              </div>
              <span className="text-sm font-bold text-foreground">Yatri <span className="text-primary">AI</span></span>
            </div>
            <div className="flex items-center gap-6">
              {["About", "Contact", "Privacy", "Terms"].map((item) => (
                <a key={item} href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">{item}</a>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">© 2026 Yatri AI</p>
          </div>
        </footer>
      </motion.div>
    </>
  );
};

export default Index;
