import { motion } from "framer-motion";

const About = () => (
  <div className="min-h-screen bg-background pt-24">
    <div className="container mx-auto max-w-3xl px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground">About Yatri AI</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Yatri AI is an AI-powered travel companion designed exclusively for India. We help travelers discover the perfect destinations, create budget-friendly itineraries, and uncover hidden gems — all personalized to your interests and comfort level.
        </p>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Whether you're a weekend getaway seeker or a backpacking adventurer, Yatri AI crafts the ideal trip plan so you can focus on making memories.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            { num: "500+", label: "Destinations" },
            { num: "10K+", label: "Trips Planned" },
            { num: "4.8★", label: "User Rating" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-card p-6 text-center card-elevated">
              <p className="text-2xl font-bold text-primary">{s.num}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
);

export default About;
