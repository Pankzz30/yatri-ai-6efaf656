import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, Send, CheckCircle } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import InputField from "@/components/auth/InputField";
import AuthButton from "@/components/auth/AuthButton";

const features = [
  "Secure password reset via email",
  "Link expires in 24 hours",
  "Your data is always safe",
  "Contact support if needed",
];

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
  };

  return (
    <AuthLayout
      headline={
        <>
          Reset your
          <br />
          <span className="text-[#E11D48]">password.</span>
        </>
      }
      subtext="We'll send a secure reset link to your email address."
      features={features}
    >
      <AnimatePresence mode="wait">
        {sent ? (
          /* ===== SUCCESS STATE ===== */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 20 }}
              >
                <CheckCircle size={40} className="text-[#E11D48]" />
              </motion.div>
            </div>
            <h2 className="text-2xl font-bold text-[#111827] mb-2">Check your inbox</h2>
            <p className="text-sm text-[#6B7280] mb-1">
              We've sent a reset link to
            </p>
            <p className="text-sm font-semibold text-[#111827] mb-8">{email}</p>
            <p className="text-xs text-[#9CA3AF] mb-8">
              Didn't receive it? Check your spam folder or{" "}
              <button
                onClick={() => setSent(false)}
                className="text-[#E11D48] hover:underline font-medium"
              >
                try again
              </button>
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#E11D48] hover:text-[#BE123C] transition-colors"
            >
              <ArrowLeft size={14} />
              Back to sign in
            </Link>
          </motion.div>
        ) : (
          /* ===== FORM STATE ===== */
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            {/* Back link */}
            <Link
              to="/login"
              className="mb-8 inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#111827] transition-colors"
            >
              <ArrowLeft size={14} />
              Back to sign in
            </Link>

            <div className="mb-8">
              <h1 className="text-[1.85rem] font-bold text-[#111827] leading-tight">Forgot password?</h1>
              <p className="mt-1.5 text-sm text-[#6B7280]">
                Enter your email and we'll send a reset link
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="Email address"
                type="email"
                value={email}
                onChange={setEmail}
                required
                autoComplete="email"
                icon={<Mail size={16} />}
              />
              <div className="pt-1">
                <AuthButton loading={loading} loadingText="Sending link...">
                  <span className="flex items-center justify-center gap-2">
                    <Send size={15} />
                    Send reset link
                  </span>
                </AuthButton>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default ForgotPassword;
