import { motion } from "framer-motion";
import { MapPin, Star, Globe, CheckCircle } from "lucide-react";
import AuthLogo from "./AuthLogo";

interface AuthLayoutProps {
  children: React.ReactNode;
  /** Headline shown on the left panel */
  headline: React.ReactNode;
  /** Subtext under the headline */
  subtext: string;
  /** Feature list bullets */
  features: string[];
  /** Preview card variant */
  variant?: "login" | "register";
}

const AuthLayout = ({ children, headline, subtext, features, variant = "login" }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* ===== LEFT PANEL ===== */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative hidden lg:flex lg:w-1/2 flex-col overflow-hidden bg-white"
      >
        {/* Subtle gradient blobs */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-rose-100/60 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-red-50/80 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 h-48 w-48 rounded-full bg-orange-50/50 blur-2xl pointer-events-none" />

        {/* Dot-grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #E11D48 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 flex flex-col h-full p-14 justify-between">
          {/* Logo */}
          <AuthLogo />

          {/* Center content */}
          <div className="mt-auto mb-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h2 className="text-[2.6rem] font-bold leading-[1.15] text-[#111827] mb-4">
                {headline}
              </h2>
              <p className="text-[#6B7280] text-base mb-10 leading-relaxed">{subtext}</p>

              <div className="space-y-3.5">
                {features.map((feat, i) => (
                  <motion.div
                    key={feat}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.12, duration: 0.45 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-50 flex-shrink-0">
                      <CheckCircle size={13} className="text-[#E11D48]" />
                    </div>
                    <span className="text-sm text-[#374151]">{feat}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Stats pills */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.5 }}
              className="mt-12 flex flex-wrap gap-3"
            >
              {[
                { icon: <MapPin size={13} />, label: "500+ Destinations" },
                { icon: <Star size={13} />, label: "4.9★ Rating" },
                { icon: <Globe size={13} />, label: "50k+ Travelers" },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-2 text-xs font-medium text-[#374151] shadow-sm"
                >
                  <span className="text-[#E11D48]">{icon}</span>
                  {label}
                </div>
              ))}
            </motion.div>
          </div>

          <p className="text-xs text-[#9CA3AF]">© 2026 Yatri AI · Intelligent Indian Trip Planner</p>
        </div>
      </motion.div>

      {/* ===== RIGHT PANEL ===== */}
      <div className="flex w-full items-center justify-center px-6 py-14 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="w-full max-w-[420px]"
        >
          {/* Mobile logo */}
          <div className="mb-10 lg:hidden">
            <AuthLogo />
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
