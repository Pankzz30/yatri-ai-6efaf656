import TripInspirations from "@/components/TripInspirations";
import CinematicStory from "@/components/CinematicStory";
import PremiumCTA from "@/components/PremiumCTA";

export default function BelowHeroSections() {
  return (
    <div className="bg-background">
      {/* Section 1 — Trip Inspirations */}
      <TripInspirations />

      {/* Section 4 — Cinematic Scroll Story */}
      <CinematicStory />

      {/* Section 5 — Premium Closing CTA */}
      <PremiumCTA />
    </div>
  );
}
