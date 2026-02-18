import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Sparkles, MapPin, Star, Globe } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    login(email, email.split("@")[0]);
    navigate("/");
    setLoading(false);
  };

  const highlights = [
    { icon: <MapPin size={16} />, text: "500+ Indian destinations" },
    { icon: <Star size={16} />, text: "AI-curated itineraries" },
    { icon: <Globe size={16} />, text: "Budget-smart travel plans" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* ===== LEFT PANEL ===== */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden lg:flex">
        {/* Background gradient */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 40%, hsla(224,76%,55%,0.4) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, hsla(200,88%,50%,0.3) 0%, transparent 60%)" }} />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(hsl(262,83%,65%) 1px, transparent 1px), linear-gradient(90deg, hsl(262,83%,65%) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Floating orbs */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl float" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-sky-300/20 blur-3xl float-delayed" />

        <div className="relative z-10 flex flex-col h-full justify-between p-12">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-lg">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Yatri AI</span>
          </div>

          {/* Center content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="mb-4 text-4xl font-bold leading-tight text-white">
                Your perfect Indian
                <br />
                <span className="text-gradient-hero">adventure awaits</span>
              </h2>
              <p className="mb-10 text-lg text-white/60 leading-relaxed">
                AI-powered trip planning personalized to your style, budget, and interests.
              </p>

              <div className="space-y-4">
                {highlights.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.15 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-sm">
                      {h.icon}
                    </div>
                    <span className="text-sm text-white/80">{h.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Floating card preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-12 glass-card rounded-3xl p-5 border border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center text-2xl shadow-lg">
                  🏔️
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">Manali & Spiti Valley</div>
                  <div className="text-xs text-white/60">7 days · AI-planned itinerary</div>
                  <div className="mt-1 flex items-center gap-1">
                    {[1,2,3,4,5].map(s => <Star key={s} size={10} className="fill-yellow-400 text-yellow-400" />)}
                    <span className="text-xs text-white/50 ml-1">4.9</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white">₹22k</div>
                  <div className="text-xs text-white/50">per person</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom text */}
          <p className="text-xs text-white/30">
            © 2026 Yatri AI · Trusted by 50,000+ travelers
          </p>
        </div>
      </div>

      {/* ===== RIGHT PANEL ===== */}
      <div className="flex w-full min-h-screen items-center justify-center bg-background px-6 py-12 lg:w-1/2 lg:min-h-0">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo - only shown when left panel is hidden */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl gradient-primary">
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="text-xl font-bold"><span className="text-gradient">Yatri</span><span className="text-foreground/70"> AI</span></span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to continue planning your adventures</p>
          </div>

          {/* Google button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={async () => {
              const { error } = await lovable.auth.signInWithOAuth("google", {
                redirect_uri: window.location.origin,
              });
              if (error) toast.error("Google sign-in failed");
            }}
            className="mb-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-card py-3.5 text-sm font-medium text-foreground transition-all hover:border-primary/30 hover:bg-accent"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </motion.button>

          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or continue with email</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="group relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full rounded-2xl border border-input bg-card py-3.5 pl-11 pr-4 text-sm text-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Password */}
            <div className="group relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full rounded-2xl border border-input bg-card py-3.5 pl-11 pr-11 text-sm text-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-2xl gradient-primary py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-primary/30 disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in...
                </span>
              ) : "Sign in"}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Create one free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
