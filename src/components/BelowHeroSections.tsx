import TravelDashboard from "@/components/TravelDashboard";
import DiscoveryFeed from "@/components/DiscoveryFeed";
import CinematicStory from "@/components/CinematicStory";
import PremiumCTA from "@/components/PremiumCTA";

export default function BelowHeroSections() {
  return (
    <div className="bg-background">
      {/* Section 1 — Gamified Travel Dashboard */}
      <TravelDashboard />

      {/* Section 2 — Trips Curated For You */}
      <section className="py-16 section-light">
        <DiscoveryFeed />
      </section>

      {/* Section 3 — Cinematic Scroll Story */}
      <CinematicStory />

      {/* Section 4 — Premium Closing CTA */}
      <PremiumCTA />
    </div>
  );
}
