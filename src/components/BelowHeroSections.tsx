import TravelMoodExperience from "@/components/TravelMoodExperience";
import CinematicStory from "@/components/CinematicStory";
import PremiumCTA from "@/components/PremiumCTA";

export default function BelowHeroSections() {
  return (
    <div className="bg-background">
      {/* Section 1+2+3 — Interactive Travel Mood Experience */}
      <TravelMoodExperience />

      {/* Section 4 — Cinematic Scroll Story */}
      <CinematicStory />

      {/* Section 5 — Premium Closing CTA */}
      <PremiumCTA />
    </div>
  );
}
