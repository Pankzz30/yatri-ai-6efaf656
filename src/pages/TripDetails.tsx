import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Clock, Star, Utensils, Hotel, Train, Gem, IndianRupee } from "lucide-react";
import { destinations, mockItinerary } from "@/data/mockData";

const TripDetails = () => {
  const { id } = useParams();
  const destination = destinations.find((d) => d.id === id);

  if (!destination) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <p className="text-muted-foreground">Destination not found.</p>
      </div>
    );
  }

  const itin = mockItinerary;

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={destination.image} alt={destination.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <Link to="/" className="mb-3 inline-flex items-center gap-1 rounded-full bg-card/80 px-3 py-1 text-xs text-foreground backdrop-blur-sm">
            <ArrowLeft size={14} /> Back
          </Link>
          <h1 className="text-3xl font-bold text-primary-foreground md:text-4xl">{destination.name}</h1>
          <div className="mt-1 flex items-center gap-3 text-sm text-primary-foreground/80">
            <span className="flex items-center gap-1"><MapPin size={14} /> {destination.state}</span>
            <span>{destination.distance} km away</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-10 space-y-10">
        {/* Overview */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="mb-3 text-xl font-bold text-foreground">Overview</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{itin.overview}</p>
          <div className="mt-4 inline-block rounded-2xl bg-accent px-5 py-3">
            <span className="text-lg font-bold text-primary">{itin.costBreakdown.total}</span>
            <span className="ml-2 text-sm text-muted-foreground">estimated total</span>
          </div>
        </motion.section>

        {/* Day-wise */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground"><Clock size={20} className="text-primary" /> Day-wise Itinerary</h2>
          <div className="space-y-4">
            {itin.dayWisePlan.map((day) => (
              <div key={day.day} className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-base font-semibold text-foreground">Day {day.day}: {day.title}</h3>
                <ul className="mt-3 space-y-1.5">
                  {day.activities.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      {a}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">🍽️ {day.meals.join(" • ")}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Hotels */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground"><Hotel size={20} className="text-primary" /> Hotels</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {itin.hotels.map((h, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">{h.name}</h4>
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">{h.type}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">{h.price}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><Star size={12} className="fill-primary text-primary" /> {h.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Transport */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground"><Train size={20} className="text-primary" /> Transport</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {itin.transport.map((t, i) => (
              <div key={i} className="min-w-[180px] rounded-2xl border border-border bg-card p-4">
                <h4 className="text-sm font-semibold text-foreground">{t.mode}</h4>
                <p className="mt-1 text-lg font-bold text-primary">{t.cost}</p>
                <p className="text-xs text-muted-foreground">{t.duration}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Food */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground"><Utensils size={20} className="text-primary" /> Famous Local Food</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {itin.foodSuggestions.map((f, i) => (
              <div key={i} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{f.name} {f.mustTry && "⭐"}</h4>
                  <p className="text-xs text-muted-foreground">{f.type}</p>
                </div>
                <span className="text-sm font-semibold text-primary">{f.price}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Hidden Gems */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground"><Gem size={20} className="text-primary" /> Hidden Gems</h2>
          <div className="space-y-3">
            {itin.hiddenGems.map((g, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-4">
                <h4 className="text-sm font-semibold text-foreground">{g.name}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{g.description}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Cost Breakdown */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground"><IndianRupee size={20} className="text-primary" /> Cost Breakdown</h2>
          <div className="rounded-2xl border border-border bg-card p-5">
            {Object.entries(itin.costBreakdown).filter(([k]) => k !== "total").map(([k, v]) => (
              <div key={k} className="flex items-center justify-between border-b border-border py-2.5 last:border-0">
                <span className="text-sm capitalize text-muted-foreground">{k}</span>
                <span className="text-sm font-semibold text-foreground">{v}</span>
              </div>
            ))}
            <div className="mt-3 flex items-center justify-between rounded-xl bg-accent px-4 py-3">
              <span className="text-sm font-bold text-foreground">Total</span>
              <span className="text-lg font-bold text-primary">{itin.costBreakdown.total}</span>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default TripDetails;
