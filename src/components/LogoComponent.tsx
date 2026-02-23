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

  const iconSize = { sm: 32, md: 40, lg: 56 };
  const svgScale = { sm: 0.55, md: 0.68, lg: 0.96 };
  const s = iconSize[size];
  const sc = svgScale[size];

  return (
    <div className="flex flex-col items-start gap-1">
      <motion.div
        className="flex items-center gap-2.5"
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        {/* Icon mark — premium sports car */}
        <motion.div
          whileHover={{ rotate: 2, scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 350, damping: 18 }}
          className="relative flex items-center justify-center rounded-xl bg-primary overflow-hidden"
          style={{
            width: s,
            height: s,
            boxShadow: "0 4px 20px hsla(347,77%,50%,0.35), 0 1px 4px hsla(347,77%,50%,0.2)",
          }}
        >
          {/* Subtle inner shine */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 50%, rgba(0,0,0,0.08) 100%)",
            }}
          />
          <svg
            width={Math.round(120 * sc)}
            height={Math.round(72 * sc)}
            viewBox="0 0 120 72"
            fill="none"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="relative z-10"
          >
            <path d="M10 46 L10 54 Q10 58 14 58 L106 58 Q110 58 110 54 L110 46 Z" strokeWidth="4.5" />
            <path d="M24 46 C26 38 32 26 42 22 L78 22 C88 22 94 30 96 38 L100 46" strokeWidth="4.5" />
            <path d="M96 38 L106 46" strokeWidth="4.5" />
            <line x1="62" y1="46" x2="58" y2="28" strokeWidth="2.5" stroke="rgba(255,255,255,0.55)" />
            <path d="M28 45 C30 38 35 28 42 24 L56 24 L54 45 Z" strokeWidth="2.5" stroke="rgba(255,255,255,0.7)" />
            <path d="M64 45 L66 24 L78 24 C87 24 92 32 94 40 L92 45 Z" strokeWidth="2.5" stroke="rgba(255,255,255,0.7)" />
            <circle cx="30" cy="58" r="9" strokeWidth="4.5" />
            <circle cx="30" cy="58" r="4" strokeWidth="2.5" />
            {[0, 60, 120].map((deg) => (
              <line key={deg} x1={30 + 4 * Math.cos((deg * Math.PI) / 180)} y1={58 + 4 * Math.sin((deg * Math.PI) / 180)} x2={30 + 8.2 * Math.cos((deg * Math.PI) / 180)} y2={58 + 8.2 * Math.sin((deg * Math.PI) / 180)} strokeWidth="2" />
            ))}
            <circle cx="90" cy="58" r="9" strokeWidth="4.5" />
            <circle cx="90" cy="58" r="4" strokeWidth="2.5" />
            {[0, 60, 120].map((deg) => (
              <line key={deg} x1={90 + 4 * Math.cos((deg * Math.PI) / 180)} y1={58 + 4 * Math.sin((deg * Math.PI) / 180)} x2={90 + 8.2 * Math.cos((deg * Math.PI) / 180)} y2={58 + 8.2 * Math.sin((deg * Math.PI) / 180)} strokeWidth="2" />
            ))}
            <ellipse cx="108" cy="50" rx="4.5" ry="3" stroke="rgba(255,248,200,0.9)" strokeWidth="1.5" />
            <ellipse cx="12" cy="50" rx="4" ry="2.8" stroke="rgba(255,100,100,0.85)" strokeWidth="1.5" />
          </svg>
        </motion.div>

        {/* Wordmark with premium weight */}
        <span className={`font-extrabold tracking-tight ${textSizes[size]}`} style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
          <span className="text-primary">Yatri</span>
          <span className="text-primary" style={{ textShadow: size === "lg" ? "0 0 24px hsla(347,77%,50%,0.25)" : "none" }}> AI</span>
        </span>
      </motion.div>

      {showTagline && (
        <p className="text-xs text-muted-foreground pl-10 tracking-wider">Intelligent Indian Trip Planner</p>
      )}
    </div>
  );
};

export default LogoComponent;
