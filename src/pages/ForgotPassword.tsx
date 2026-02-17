import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 pt-16">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Link to="/login" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} /> Back to login
        </Link>
        <div className="rounded-3xl bg-card p-8 shadow-lg">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                <Mail size={28} className="text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Check your email</h2>
              <p className="mt-2 text-sm text-muted-foreground">We've sent a reset link to {email}</p>
            </div>
          ) : (
            <>
              <h2 className="mb-2 text-2xl font-bold text-foreground">Forgot password?</h2>
              <p className="mb-6 text-sm text-muted-foreground">Enter your email and we'll send a reset link</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" required className="w-full rounded-xl border border-input bg-background py-3 pl-11 pr-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <button type="submit" className="w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]">
                  Send reset link
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
