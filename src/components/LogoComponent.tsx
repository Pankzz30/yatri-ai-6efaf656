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
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
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
