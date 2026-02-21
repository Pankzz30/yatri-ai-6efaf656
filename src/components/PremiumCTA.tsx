import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function PremiumCTA() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="max-w-md mx-auto"
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">
            Start Planning
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 tracking-tight">
            Where to next?
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Your next adventure is one tap away.
          </p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/plan"
              className="inline-flex items-center gap-2 rounded-2xl px-10 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 gradient-cta transition-all duration-250"
            >
              Plan My Journey
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
