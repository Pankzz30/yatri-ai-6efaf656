import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import heroBg from "@/assets/hero-bg.jpg";
import SearchBar from "@/components/SearchBar";
import DestinationCard from "@/components/DestinationCard";
import OnboardingModal from "@/components/OnboardingModal";
import { destinations } from "@/data/mockData";

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Index = () => {
  const { isAuthenticated, user } = useUser();
  const showOnboarding = isAuthenticated && user?.isFirstLogin;

  const trending = destinations.slice().sort((a, b) => b.popularityScore - a.popularityScore);
  const budgetPicks = destinations.filter((d) => d.budgetRange.includes("2,") || d.budgetRange.includes("1,"));
  const offbeat = destinations.filter((d) => d.popularityScore < 90);

  return (
    <div className="min-h-screen bg-background">
      {showOnboarding && <OnboardingModal />}

      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
        <img
          src={heroBg}
          alt="India travel"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "var(--hero-gradient)" }} />
        <div className="relative z-10 w-full px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 text-4xl font-bold text-primary-foreground md:text-6xl"
          >
            Plan Your Perfect Trip
            <br />
            <span className="opacity-90">in India</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto mb-10 max-w-lg text-base text-primary-foreground/80"
          >
            AI-powered itineraries, budget-friendly picks, and hidden gems — all personalized for you.
          </motion.p>
          <SearchBar />
        </div>
      </section>

      {/* Sections */}
      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Trending */}
        <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <h2 className="mb-6 text-2xl font-bold text-foreground">🔥 Trending Destinations</h2>
          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
            {trending.map((d, i) => (
              <DestinationCard key={d.id} destination={d} index={i} />
            ))}
          </div>
        </motion.section>

        {/* Budget */}
        <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <h2 className="mb-6 text-2xl font-bold text-foreground">💰 Budget Picks</h2>
          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
            {budgetPicks.map((d, i) => (
              <DestinationCard key={d.id} destination={d} index={i} />
            ))}
          </div>
        </motion.section>

        {/* Offbeat */}
        <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <h2 className="mb-6 text-2xl font-bold text-foreground">🌿 Offbeat Gems</h2>
          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
            {offbeat.map((d, i) => (
              <DestinationCard key={d.id} destination={d} index={i} />
            ))}
          </div>
        </motion.section>

        {/* All Destinations */}
        <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <h2 className="mb-6 text-2xl font-bold text-foreground">🗺️ All Destinations</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.map((d, i) => (
              <DestinationCard key={d.id} destination={d} index={i} />
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Index;
