import { motion } from "framer-motion";

interface AuthButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
  type?: "submit" | "button";
  onClick?: () => void;
  disabled?: boolean;
}

const AuthButton = ({
  children,
  loading,
  loadingText = "Please wait...",
  type = "submit",
  onClick,
  disabled,
}: AuthButtonProps) => (
  <motion.button
    type={type}
    onClick={onClick}
    disabled={loading || disabled}
    whileHover={{ scale: 1.025, y: -1 }}
    whileTap={{ scale: 0.975 }}
    transition={{ type: "spring", stiffness: 400, damping: 20 }}
    className="relative w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-primary/90 hover:shadow-primary/30 disabled:opacity-60 disabled:cursor-not-allowed"
  >
    {loading ? (
      <span className="flex items-center justify-center gap-2.5">
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        {loadingText}
      </span>
    ) : (
      children
    )}
  </motion.button>
);

export default AuthButton;
