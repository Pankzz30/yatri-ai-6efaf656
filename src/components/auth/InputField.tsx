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
      {/* Floating label */}
      <label
        className={`pointer-events-none absolute left-11 z-10 origin-left transition-all duration-200 ${
          focused || hasValue
            ? "-top-2.5 scale-[0.78] bg-white px-1 font-semibold text-[#E11D48]"
            : "top-3.5 scale-100 text-[#9CA3AF]"
        } text-sm`}
      >
        {label}
      </label>

      {/* Icon */}
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused ? "text-[#E11D48]" : "text-[#9CA3AF]"}`}>
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
        className={`w-full rounded-2xl border bg-white py-3.5 pl-11 pr-${isPassword ? "11" : "4"} text-sm text-[#111827] outline-none transition-all duration-200 ${
          error
            ? "border-red-400 ring-2 ring-red-100"
            : focused
            ? "border-[#E11D48] ring-2 ring-red-100 shadow-sm"
            : "border-[#E5E7EB] hover:border-[#D1D5DB]"
        }`}
      />

      {/* Show/hide toggle */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPwd(!showPwd)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
        >
          {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}

      {/* Inline error */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-xs text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default InputField;
