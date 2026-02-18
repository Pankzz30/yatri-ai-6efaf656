import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AnimatedButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  fullWidth?: boolean;
}

const springTransition = { type: "spring" as const, stiffness: 400, damping: 20 };

const AnimatedButton = ({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  disabled = false,
  fullWidth = false,
}: AnimatedButtonProps) => {
  const baseClasses = cn(
    "relative inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer select-none",
    {
      "gradient-primary text-white shadow-lg hover:shadow-[0_0_30px_hsla(262,83%,65%,0.5)]": variant === "primary",
      "glass border border-primary/30 text-foreground hover:border-primary/60": variant === "secondary",
      "text-muted-foreground hover:text-foreground": variant === "ghost",
      "border border-border text-foreground hover:border-primary/50": variant === "outline",
      "px-4 py-2 text-sm": size === "sm",
      "px-6 py-3 text-sm": size === "md",
      "px-8 py-4 text-base": size === "lg",
      "w-full": fullWidth,
      "opacity-50 cursor-not-allowed pointer-events-none": disabled,
    },
    className
  );

  if (href) {
    return (
      <motion.div
        whileHover={disabled ? {} : { scale: 1.03, y: -1 }}
        whileTap={disabled ? {} : { scale: 0.97 }}
        transition={springTransition}
      >
        <Link to={href} className={baseClasses}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.03, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={springTransition}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;
