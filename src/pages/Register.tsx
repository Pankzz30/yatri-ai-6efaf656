import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import AuthLayout from "@/components/auth/AuthLayout";
import InputField from "@/components/auth/InputField";
import AuthButton from "@/components/auth/AuthButton";
import SocialLoginButton from "@/components/auth/SocialLoginButton";

const perks = [
  "Free to get started — no credit card needed",
  "AI-personalised itineraries in seconds",
  "Budget tracker & cost optimizer built-in",
  "Save & share trips with friends",
];

const getStrength = (pwd: string) => {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
};

const strengthMeta = [
  { label: "Too weak", color: "bg-red-400" },
  { label: "Weak", color: "bg-orange-400" },
  { label: "Fair", color: "bg-yellow-400" },
  { label: "Good", color: "bg-emerald-400" },
  { label: "Strong", color: "bg-green-500" },
];

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  
  const [loading, setLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const strength = getStrength(password);
  const confirmError = confirm.length > 0 && confirm !== password ? "Passwords do not match" : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    login(email, name);
    navigate("/");
    setLoading(false);
  };

  return (
    <AuthLayout
      headline={
        <>
          Join 50,000+
          <br />
          <span className="text-[#E11D48]">smart travellers.</span>
        </>
      }
      subtext="Create your free account and start planning your dream India trip today."
      features={perks}
      variant="register"
    >
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-[1.85rem] font-bold text-[#111827] leading-tight">Create account</h1>
        <p className="mt-1.5 text-sm text-[#6B7280]">Start planning your dream trips for free</p>
      </div>

      {/* Social */}
      <SocialLoginButton
        onClick={async () => {
          const { error } = await lovable.auth.signInWithOAuth("google", {
            redirect_uri: window.location.origin,
          });
          if (error) toast.error("Google sign-up failed");
        }}
      />

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#F3F4F6]" />
        <span className="text-xs text-[#9CA3AF]">or continue with email</span>
        <div className="h-px flex-1 bg-[#F3F4F6]" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Full name"
          type="text"
          value={name}
          onChange={setName}
          required
          autoComplete="name"
          icon={<User size={16} />}
        />
        <InputField
          label="Email address"
          type="email"
          value={email}
          onChange={setEmail}
          required
          autoComplete="email"
          icon={<Mail size={16} />}
        />
        <InputField
          label="Create password"
          type="password"
          value={password}
          onChange={setPassword}
          required
          autoComplete="new-password"
          icon={<Lock size={16} />}
        />

        {/* Password strength */}
        <AnimatePresence>
          {password.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex gap-1 mb-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      i < strength ? strengthMeta[strength].color : "bg-[#F3F4F6]"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-[#9CA3AF]">
                Strength:{" "}
                <span
                  className={`font-semibold ${
                    strength >= 3
                      ? "text-emerald-500"
                      : strength >= 2
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {strengthMeta[strength]?.label ?? "Too weak"}
                </span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <InputField
          label="Confirm password"
          type="password"
          value={confirm}
          onChange={setConfirm}
          required
          autoComplete="new-password"
          icon={<Lock size={16} />}
          error={confirmError}
        />

        <div className="pt-1">
          <AuthButton loading={loading} loadingText="Creating account..." disabled={!!confirmError}>
            <span className="flex items-center justify-center gap-2">
              Create free account
            </span>
          </AuthButton>
        </div>
      </form>

      {/* Terms */}
      <p className="mt-5 text-center text-xs text-[#9CA3AF]">
        By signing up, you agree to our{" "}
        <a href="#" className="text-[#E11D48] hover:underline">Terms</a>{" "}
        &amp;{" "}
        <a href="#" className="text-[#E11D48] hover:underline">Privacy Policy</a>
      </p>

      <p className="mt-4 text-center text-sm text-[#6B7280]">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-[#E11D48] hover:text-[#BE123C] transition-colors">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
