import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Sparkles, User, LogOut, ChevronDown, Info } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import LogoComponent from "./LogoComponent";
import AnimatedButton from "./AnimatedButton";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

interface ProfileDropdownProps {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  logout: () => void;
}

const ProfileDropdown = ({ isAuthenticated, user, logout }: ProfileDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full p-0.5 transition-all hover:ring-2 hover:ring-primary/30"
        aria-label="Profile menu"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-primary">
          <User size={14} className="text-white" />
        </div>
        <ChevronDown
          size={13}
          className="text-muted-foreground transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-2xl border border-border bg-white shadow-xl shadow-black/10 z-50"
          >
            {isAuthenticated && user && (
              <div className="border-b border-border/60 px-4 py-3">
                <p className="text-[13px] font-semibold text-foreground truncate">{user.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
              </div>
            )}
            <div className="py-1">
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-foreground hover:bg-accent/60 transition-colors"
              >
                <User size={14} className="text-muted-foreground" />
                View Profile
              </Link>
              <Link
                to="/about"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-foreground hover:bg-accent/60 transition-colors"
              >
                <Info size={14} className="text-muted-foreground" />
                About Us
              </Link>
              {isAuthenticated && (
                <>
                  <div className="mx-4 my-1 h-px bg-border/60" />
                  <button
                    onClick={() => { logout(); setOpen(false); }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-destructive hover:bg-destructive/5 transition-colors"
                  >
                    <LogOut size={14} />
                    Log out
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const { isAuthenticated, user, logout } = useUser();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (AUTH_ROUTES.includes(location.pathname)) return null;

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/plan", label: "AI Planner" },
    { to: "/my-trips", label: "My Trips" },
    { to: "/wishlist", label: "Wishlist" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const profileProps = { isAuthenticated, user, logout };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass shadow-lg shadow-black/20" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center">
          <LogoComponent size="sm" />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                isActive(link.to)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isActive(link.to) && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-xl bg-accent"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Desktop right side */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <ProfileDropdown {...profileProps} />
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground"
              >
                Log in
              </Link>
              <AnimatedButton href="/register" size="sm">
                <Sparkles size={14} />
                Start Planning
              </AnimatedButton>
            </>
          )}
        </div>

        {/* Mobile right side — profile icon only */}
        <div className="flex items-center md:hidden">
          {isAuthenticated ? (
            <ProfileDropdown {...profileProps} />
          ) : (
            <Link
              to="/login"
              className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
