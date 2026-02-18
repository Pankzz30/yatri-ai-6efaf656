import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

const LogoComponent = ({ size = "md", showTagline = false }: LogoProps) => {
  const textSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-2">
        {/* Icon mark */}
        <motion.div
          className="relative flex items-center justify-center"
          whileHover={{ rotate: 15 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl gradient-primary shadow-lg">
            <Sparkles size={16} className="text-white" />
          </div>
        </motion.div>

        {/* Wordmark */}
        <span className={`font-bold tracking-tight ${textSizes[size]}`}>
          <span className="text-gradient">Yatri</span>
          <span className="text-foreground/80"> AI</span>
        </span>
      </div>

      {showTagline && (
        <p className="text-xs text-muted-foreground pl-10">Intelligent Indian Trip Planner</p>
      )}
    </div>
  );
};

export default LogoComponent;
