import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import HeroSearch from "@/components/HeroSearch";
import DestinationCard from "@/components/DestinationCard";
import OnboardingModal from "@/components/OnboardingModal";
import AnimatedLogoIntro from "@/components/intro/AnimatedLogoIntro";
import { destinations } from "@/data/mockData";
import { Sparkles, Brain, Wallet, Compass, ArrowRight } from "lucide-react";

// Cinematic stagger entrance — runs after intro overlay fades
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const Index = () => {
  const { isAuthenticated, user } = useUser();
  const showOnboarding = isAuthenticated && user?.isFirstLogin;

  // First-ever visit this session → full cinematic. Return visits → fast.
  const isFirstVisit = !sessionStorage.getItem("yatri_visited");
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = () => {
    sessionStorage.setItem("yatri_visited", "1");
    setIntroComplete(true);
  };

  const trending = destinations
    .slice()
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, 6);

  const features = [
    {
      icon: <Brain size={22} />,
      title: "AI Itineraries",
      description: "Personalized day-by-day plans crafted by AI in seconds.",
    },
    {
      icon: <Wallet size={22} />,
      title: "Budget Optimizer",
      description: "Smart cost breakdowns to make every rupee count.",
    },
    {
      icon: <Compass size={22} />,
      title: "Hidden Gems",
      description: "Discover offbeat spots most travelers never find.",
    },
  ];

  return (
    <>
      {/* Intro plays every mount; fast mode after first session visit */}
      {!introComplete && (
        <AnimatedLogoIntro fast={!isFirstVisit} onComplete={handleIntroComplete} />
      )}

      <motion.div
        className="min-h-screen bg-background"
        variants={container}
        initial="hidden"
        animate={introComplete ? "visible" : "hidden"}
      >
        {showOnboarding && <OnboardingModal />}

        {/* ── HERO ── */}
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16">
          {/* Soft background blobs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-secondary/60 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-accent/40 blur-3xl" />
          </div>

          {/* Dot grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: "radial-gradient(circle, hsl(347,77%,50%) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative z-10 w-full max-w-3xl text-center">
            {/* Badge */}
            <motion.div variants={fadeUp}>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
                <Sparkles size={12} />
                AI-Powered Indian Trip Planner
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="mb-5 text-5xl font-bold leading-[1.1] tracking-tight text-foreground md:text-6xl"
            >
              Plan smarter.{" "}
              <span className="text-gradient">Travel better.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={fadeUp}
              className="mx-auto mb-10 max-w-md text-base text-muted-foreground"
            >
              Discover India's most beautiful destinations with personalized AI itineraries, budget planning, and insider tips.
            </motion.p>

            {/* Search */}
            <motion.div variants={fadeUp} className="mb-8">
              <HeroSearch />
            </motion.div>

            {/* CTA links */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center"
            >
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-2xl bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-[1.03] hover:shadow-primary/35"
                >
                  <Sparkles size={15} />
                  Get started free
                </Link>
              )}
              <a
                href="#destinations"
                className="inline-flex items-center gap-1.5 rounded-2xl border border-border px-7 py-3 text-sm font-medium text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground"
              >
                Browse destinations
                <ArrowRight size={14} />
              </a>
            </motion.div>
          </div>

          {/* Bottom fade */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* ── WHY YATRI AI ── */}
        <motion.section variants={fadeUp} className="bg-[hsl(350,80%,98%)] py-20">
          <div className="container mx-auto px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-foreground">
                Everything you need for a{" "}
                <span className="text-gradient">perfect trip</span>
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="rounded-2xl bg-white p-7 shadow-sm border border-border/60 transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {f.icon}
                  </div>
                  <h3 className="mb-2 text-base font-bold text-foreground">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── DESTINATIONS ── */}
        <motion.section id="destinations" variants={fadeUp} className="py-20">
          <div className="container mx-auto px-6">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Popular Destinations</h2>
                <p className="mt-1 text-sm text-muted-foreground">Top-rated places loved by Indian travelers</p>
              </div>
            </div>

            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
              {trending.map((d, i) => (
                <DestinationCard key={d.id} destination={d} index={i} />
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── CTA ── */}
        <motion.section variants={fadeUp} className="py-20">
          <div className="container mx-auto px-6">
            <div className="relative overflow-hidden rounded-3xl gradient-cta p-12 text-center">
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, transparent 70%)" }}
              />
              <div className="relative z-10">
                <h2 className="mb-3 text-3xl font-bold text-white">Start your dream trip today</h2>
                <p className="mx-auto mb-8 max-w-sm text-sm text-white/75">
                  Join 50,000+ travelers who plan smarter with Yatri AI.
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-sm font-bold text-primary shadow-xl transition-all hover:scale-[1.03]"
                >
                  <Sparkles size={16} />
                  Get started free
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-border py-10">
          <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <svg width="16" height="12" viewBox="0 0 100 80" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 47 L14 56 Q14 60 18 60 L82 60 Q86 60 86 56 L86 47 Z"/>
                <path d="M28 47 L33 33 Q35 29 40 29 L60 29 Q65 29 67 33 L72 47 Z"/>
                <circle cx="28" cy="60" r="7"/>
                <circle cx="72" cy="60" r="7"/>
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
