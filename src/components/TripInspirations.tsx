import { motion } from "framer-motion";
import { useState } from "react";
import { Heart, Clock, Wallet, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { destinations } from "@/data/mockData";

function InspirationCard({
  d,
  index,
}: {
  d: (typeof destinations)[0];
  index: number;
}) {
  const [saved, setSaved] = useState(false);
  const days = `${Math.round(d.distance / 80)}–${Math.round(d.distance / 50)} days`;

  return (
    <div
      className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-250 h-[420px] cursor-pointer"
    >
      {/* Image */}
      <motion.img
        src={d.image}
        alt={d.name}
        className="absolute inset-0 w-full h-full object-cover"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      {/* Save */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setSaved(!saved);
        }}
        className="absolute top-4 right-4 z-10 h-9 w-9 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-transform duration-200 hover:scale-110"
      >
        <Heart
          size={15}
          className={
            saved ? "fill-primary text-primary" : "text-muted-foreground"
          }
        />
      </button>

      {/* Content */}
      <div className="absolute bottom-0 inset-x-0 p-6">
        <h3 className="text-2xl font-bold text-white leading-tight mb-1">
          {d.name}
        </h3>
        <p className="text-white/65 text-sm mb-4 line-clamp-1">
          {d.description}
        </p>

        <div className="flex items-center gap-2.5 mb-4">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold bg-white/15 backdrop-blur-sm text-white px-3 py-1.5 rounded-full">
            <Wallet size={11} />
            {d.budgetRange.split(" - ")[0]}+
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold bg-white/15 backdrop-blur-sm text-white px-3 py-1.5 rounded-full">
            <Clock size={11} />
            {days}
          </span>
        </div>

        <Link
          to="/plan"
          className="flex items-center justify-center gap-2 w-full text-xs font-bold text-primary-foreground rounded-xl py-2.5 gradient-cta transition-opacity duration-200 hover:opacity-90"
        >
          View Plan
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}

export default function TripInspirations() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-10"
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-1.5">
            Curated For You
          </p>
          <h2 className="text-3xl font-bold text-foreground">
            Inspiration for Your Next Escape
          </h2>
        </motion.div>

        {/* Grid — desktop columns, mobile horizontal scroll */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-sm:flex max-sm:overflow-x-auto max-sm:scrollbar-hide max-sm:snap-x max-sm:snap-mandatory max-sm:pb-2">
          {destinations.map((d, i) => (
            <div
              key={d.id}
              className="max-sm:min-w-[85vw] max-sm:snap-start"
            >
              <InspirationCard d={d} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
