import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import AuthLayout from "@/components/auth/AuthLayout";
import InputField from "@/components/auth/InputField";
import AuthButton from "@/components/auth/AuthButton";
import SocialLoginButton from "@/components/auth/SocialLoginButton";

const features = [
  "AI-powered personalized itineraries",
  "Budget optimization for every trip",
  "500+ curated Indian destinations",
  "Offline-ready trip access",
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    login(email, email.split("@")[0]);
    navigate("/");
    setLoading(false);
  };

  return (
    <AuthLayout
      headline={
        <>
          Plan smarter.
          <br />
          <span className="text-primary">Travel better.</span>
        </>
      }
      subtext="Join thousands of travellers who plan their perfect India trips with AI."
      features={features}
    >
      <div className="mb-8">
        <h1 className="text-[1.85rem] font-bold text-foreground leading-tight">Welcome back</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Sign in to continue your adventure</p>
      </div>

      <SocialLoginButton
        onClick={async () => {
          const { error } = await lovable.auth.signInWithOAuth("google", {
            redirect_uri: window.location.origin,
          });
          if (error) toast.error("Google sign-in failed");
        }}
      />

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or continue with email</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField label="Email address" type="email" value={email} onChange={setEmail} required autoComplete="email" icon={<Mail size={16} />} />
        <InputField label="Password" type="password" value={password} onChange={setPassword} required autoComplete="current-password" icon={<Lock size={16} />} />

        <div className="flex items-center justify-between pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              onClick={() => setRemember(!remember)}
              className={`h-4 w-4 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
                remember ? "border-primary bg-primary" : "border-border bg-card"
              }`}
            >
              {remember && (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                  <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-xs text-muted-foreground">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
            Forgot password?
          </Link>
        </div>

        <div className="pt-1">
          <AuthButton loading={loading} loadingText="Signing in...">Sign in</AuthButton>
        </div>
      </form>

      <p className="mt-7 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors">Create one free</Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
