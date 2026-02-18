import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  gradient: string;
  index?: number;
}

const FeatureCard = ({ icon, title, description, gradient, index = 0 }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative glass-card rounded-3xl p-8 overflow-hidden cursor-default"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
        style={{ background: `radial-gradient(circle at 50% 0%, ${gradient}15 0%, transparent 70%)` }}
      />

      {/* Gradient border effect */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${gradient}20, transparent)`,
          padding: "1px",
        }}
      />

      {/* Icon */}
      <motion.div
        className="relative mb-6 inline-flex items-center justify-center rounded-2xl p-4 text-white"
        style={{ background: `linear-gradient(135deg, ${gradient}CC, ${gradient}88)` }}
        whileHover={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>

      {/* Content */}
      <h3 className="mb-3 text-xl font-bold text-foreground group-hover:text-gradient transition-all duration-300">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      {/* Hover indicator */}
      <div
        className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full"
        style={{ background: `linear-gradient(90deg, ${gradient}, transparent)` }}
      />
    </motion.div>
  );
};

export default FeatureCard;
