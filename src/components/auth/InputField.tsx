import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  icon: React.ReactNode;
  error?: string;
  autoComplete?: string;
}

const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  required,
  icon,
  error,
  autoComplete,
}: InputFieldProps) => {
  const [focused, setFocused] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPwd ? "text" : "password") : type;
  const hasValue = value.length > 0;

  return (
    <div className="relative">
      <label
        className={`pointer-events-none absolute left-11 z-10 origin-left transition-all duration-200 ${
          focused || hasValue
            ? "-top-2.5 scale-[0.78] bg-card px-1 font-semibold text-primary"
            : "top-3.5 scale-100 text-muted-foreground"
        } text-sm`}
      >
        {label}
      </label>

      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused ? "text-primary" : "text-muted-foreground"}`}>
        {icon}
      </div>

      <input
        type={inputType}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        autoComplete={autoComplete}
        className={`w-full rounded-2xl border bg-card py-3.5 pl-11 pr-${isPassword ? "11" : "4"} text-sm text-foreground outline-none transition-all duration-200 ${
          error
            ? "border-destructive ring-2 ring-destructive/20"
            : focused
            ? "border-primary ring-2 ring-primary/15 shadow-sm"
            : "border-border hover:border-muted-foreground/30"
        }`}
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPwd(!showPwd)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-xs text-destructive"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default InputField;
