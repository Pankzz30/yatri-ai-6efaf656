import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import HeroSearch from "@/components/HeroSearch";
import DestinationCard from "@/components/DestinationCard";
import OnboardingModal from "@/components/OnboardingModal";
import FeatureCard from "@/components/FeatureCard";
import AnimatedButton from "@/components/AnimatedButton";
import { destinations } from "@/data/mockData";
import {
  Sparkles, Brain, Wallet, MapPin, ChevronRight,
  Star, Users, Globe, ArrowRight, CheckCircle,
  Compass, Zap, Shield
} from "lucide-react";

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const Index = () => {
  const { isAuthenticated, user } = useUser();
  const showOnboarding = isAuthenticated && user?.isFirstLogin;

  const trending = destinations.slice().sort((a, b) => b.popularityScore - a.popularityScore);
  const budgetPicks = destinations.filter((d) => d.budgetRange.includes("2,") || d.budgetRange.includes("1,"));
  const offbeat = destinations.filter((d) => d.popularityScore < 90);

  const features = [
    {
      icon: <Brain size={28} />,
      title: "AI-Powered Itineraries",
      description: "Our advanced AI analyzes thousands of trips to craft the perfect personalized itinerary tailored to your style, budget, and interests.",
      gradient: "hsl(262, 83%, 65%)",
    },
    {
      icon: <Wallet size={28} />,
      title: "Budget Optimization",
      description: "Smart cost analysis finds the best value experiences, hotels, and transport — maximizing every rupee of your travel budget.",
      gradient: "hsl(180, 80%, 55%)",
    },
    {
      icon: <Compass size={28} />,
      title: "Smart Recommendations",
      description: "Discover hidden gems and nearby attractions powered by real-time data, local insights, and thousands of traveler reviews.",
      gradient: "hsl(320, 80%, 65%)",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Choose Preferences",
      description: "Tell us your budget, travel style, and what excites you — beaches, culture, adventure, or food.",
      icon: <Zap size={20} />,
    },
    {
      number: "02",
      title: "Get AI Recommendations",
      description: "Our AI generates a complete trip plan with accommodations, activities, and local tips in seconds.",
      icon: <Brain size={20} />,
    },
    {
      number: "03",
      title: "Explore Your Trip",
      description: "Review, customize, and book your perfect Indian adventure with one click.",
      icon: <Globe size={20} />,
    },
  ];

  const stats = [
    { value: "50K+", label: "Trips Planned", icon: <MapPin size={18} /> },
    { value: "500+", label: "Destinations", icon: <Globe size={18} /> },
    { value: "4.9★", label: "Avg Rating", icon: <Star size={18} /> },
    { value: "98%", label: "Happy Travelers", icon: <Users size={18} /> },
  ];

  return (
    <div className="min-h-screen mesh-bg">
      {showOnboarding && <OnboardingModal />}

      {/* ===== HERO SECTION ===== */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-blue-200/30 blur-[120px] float" />
          <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-sky-200/25 blur-[100px] float-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-blue-100/20 blur-[80px] float-slow" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(hsl(262,83%,65%) 1px, transparent 1px), linear-gradient(90deg, hsl(262,83%,65%) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating elements */}
        <div className="absolute top-32 left-[8%] float opacity-60 hidden lg:block">
          <div className="glass-card rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl gradient-primary flex items-center justify-center">
              <MapPin size={14} className="text-white" />
            </div>
            <div>
              <div className="text-xs font-semibold text-foreground">Rajasthan</div>
              <div className="text-xs text-muted-foreground">₹15,000 · 5 days</div>
            </div>
          </div>
        </div>

        <div className="absolute top-40 right-[8%] float-delayed opacity-60 hidden lg:block">
          <div className="glass-card rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/80 flex items-center justify-center">
              <CheckCircle size={14} className="text-white" />
            </div>
            <div>
              <div className="text-xs font-semibold text-foreground">AI Plan Ready!</div>
              <div className="text-xs text-muted-foreground">3 itineraries generated</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-48 left-[10%] float-slow opacity-50 hidden lg:block">
          <div className="glass-card rounded-2xl px-4 py-3 flex items-center gap-2">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-semibold text-foreground">4.9 · 12k reviews</span>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full glass border border-primary/20 px-4 py-2 text-sm"
          >
            <Sparkles size={14} className="text-primary" />
            <span className="text-muted-foreground">AI-Powered Travel Planning</span>
            <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">New</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl"
          >
            <span className="text-gradient-hero">Plan Smarter.</span>
            <br />
            <span className="text-foreground/90">Travel Better.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground leading-relaxed"
          >
            AI-powered personalized Indian trip planner. Discover hidden gems, optimize your budget, and explore India like never before.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <AnimatedButton href="/register" size="lg" className="min-w-[180px]">
              <Sparkles size={18} />
              Start Planning
            </AnimatedButton>
            <AnimatedButton href="#destinations" variant="secondary" size="lg" className="min-w-[180px]">
              Explore Destinations
              <ChevronRight size={18} />
            </AnimatedButton>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mx-auto max-w-2xl"
          >
            <HeroSearch />
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary text-white">
                  {stat.icon}
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="relative py-24 overflow-hidden section-light">
        <div className="container mx-auto px-6">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full glass border border-primary/20 px-4 py-2 text-sm">
              <Zap size={14} className="text-primary" />
              <span className="text-muted-foreground">Why Choose Yatri AI</span>
            </div>
            <h2 className="text-4xl font-bold text-foreground md:text-5xl">
              Travel smarter with{" "}
              <span className="text-gradient">AI intelligence</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Everything you need for the perfect Indian travel experience, powered by cutting-edge artificial intelligence.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-blue-100/40 blur-[100px]" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full glass border border-primary/20 px-4 py-2 text-sm">
              <Shield size={14} className="text-primary" />
              <span className="text-muted-foreground">Simple Process</span>
            </div>
            <h2 className="text-4xl font-bold text-foreground md:text-5xl">
              How it <span className="text-gradient">works</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[70%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent hidden md:block" />

            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: 0.6 }}
                  className="relative text-center"
                >
                  <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
                    <div className="absolute inset-0 rounded-full gradient-primary opacity-10" />
                    <div className="absolute inset-2 rounded-full glass-card border border-primary/20" />
                    <div className="relative z-10 flex flex-col items-center">
                      <span className="text-xs font-bold text-primary">{step.number}</span>
                      <div className="text-foreground mt-1">{step.icon}</div>
                    </div>
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-foreground">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground max-w-xs mx-auto">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== DESTINATIONS ===== */}
      <section id="destinations" className="py-24">
        <div className="container mx-auto px-6 space-y-16">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                🔥 <span>Trending Destinations</span>
              </h2>
              <button className="flex items-center gap-1 text-sm text-primary hover:underline">
                View all <ArrowRight size={14} />
              </button>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
              {trending.map((d, i) => (
                <DestinationCard key={d.id} destination={d} index={i} />
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-8">
              💰 <span>Budget Picks</span>
            </h2>
            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
              {budgetPicks.map((d, i) => (
                <DestinationCard key={d.id} destination={d} index={i} />
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-8">
              🌿 <span>Offbeat Gems</span>
            </h2>
            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
              {offbeat.map((d, i) => (
                <DestinationCard key={d.id} destination={d} index={i} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-4xl overflow-hidden p-12 text-center"
          >
            <div className="absolute inset-0 gradient-cta opacity-90" />
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, transparent 70%)" }} />
            <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/5 blur-3xl float" />
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/5 blur-3xl float-delayed" />

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm"
              >
                <Sparkles size={32} className="text-white" />
              </motion.div>
              <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
                Start Your Dream Trip Today
              </h2>
              <p className="mx-auto mb-10 max-w-md text-lg text-white/80">
                Join thousands of travelers who've discovered India's most beautiful destinations with Yatri AI.
              </p>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-block"
              >
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-10 py-4 text-base font-bold text-blue-700 shadow-2xl transition-all hover:shadow-white/25"
                >
                  <Sparkles size={20} />
                  Get Started Free
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-border py-16">
        <div className="container mx-auto px-6">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl gradient-primary">
                  <Sparkles size={16} className="text-white" />
                </div>
                <span className="text-xl font-bold">
                  <span className="text-gradient">Yatri</span>
                  <span className="text-foreground/80"> AI</span>
                </span>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                Intelligent Indian trip planning powered by AI. Discover, plan, and explore India like never before.
              </p>
              <div className="mt-6 flex gap-4">
                {["Twitter", "Instagram", "LinkedIn"].map((social) => (
                  <motion.button
                    key={social}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-xl glass border border-border p-2.5 text-muted-foreground transition-colors hover:text-foreground hover:border-primary/30"
                  >
                    <span className="text-xs font-medium">{social.slice(0, 2)}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold text-foreground">Product</h4>
              <ul className="space-y-3">
                {["Features", "Destinations", "Pricing", "Blog"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-foreground">Company</h4>
              <ul className="space-y-3">
                {["About", "Contact", "Privacy", "Terms"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
            <p className="text-sm text-muted-foreground">© 2026 Yatri AI. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">Made with ❤️ for Indian travelers</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
