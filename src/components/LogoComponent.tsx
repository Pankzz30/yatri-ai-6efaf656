import { motion } from "framer-motion";

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
      <div className="flex items-center gap-2.5">
        {/* Icon mark — matches auth pages */}
        <motion.div
          whileHover={{ rotate: 8, scale: 1.08 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/30"
        >
          <svg width="22" height="16" viewBox="0 0 100 80" fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 47 L14 56 Q14 60 18 60 L82 60 Q86 60 86 56 L86 47 Z" />
            <path d="M28 47 L33 33 Q35 29 40 29 L60 29 Q65 29 67 33 L72 47 Z" />
            <circle cx="28" cy="60" r="7" />
            <circle cx="72" cy="60" r="7" />
          </svg>
        </motion.div>

        {/* Wordmark */}
        <span className={`font-bold tracking-tight ${textSizes[size]}`}>
          <span className="text-foreground">Yatri</span>
          <span className="text-primary"> AI</span>
        </span>
      </div>

      {showTagline && (
        <p className="text-xs text-muted-foreground pl-10">Intelligent Indian Trip Planner</p>
      )}
    </div>
  );
};

export default LogoComponent;
