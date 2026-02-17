import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

const Contact = () => {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto max-w-lg px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground">Contact Us</h1>
          <p className="mt-2 text-sm text-muted-foreground">We'd love to hear from you</p>
          {sent ? (
            <div className="mt-10 rounded-2xl bg-card p-8 text-center card-elevated">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent">
                <Send size={24} className="text-primary" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Message sent!</h2>
              <p className="mt-1 text-sm text-muted-foreground">We'll get back to you soon.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="mt-8 space-y-4"
            >
              <input placeholder="Name" required className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" />
              <input type="email" placeholder="Email" required className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" />
              <textarea placeholder="Your message" rows={5} required className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring resize-none" />
              <button type="submit" className="w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]">
                Send Message
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
