import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Home, Heart, Map, MessageCircle } from "lucide-react";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/my-trips", label: "My Trips", icon: Map },
  { to: "/wishlist", label: "Wishlist", icon: Heart },
  { to: "/contact", label: "Help", icon: MessageCircle },
];

const MobileBottomNav = () => {
  const location = useLocation();

  if (AUTH_ROUTES.includes(location.pathname)) return null;

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-card shadow-[0_-1px_0_0_hsl(var(--border)),0_-4px_16px_hsla(0,0%,0%,0.08)]">
      <div className="flex items-stretch h-16">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = isActive(to);
          return (
            <Link
              key={to}
              to={to}
              className="flex flex-1 flex-col items-center justify-center gap-0.5 min-w-0"
            >
              <motion.div
                whileTap={{ scale: 0.88 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="flex flex-col items-center gap-0.5"
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.2 : 1.8}
                  className={active ? "text-primary" : "text-muted-foreground"}
                />
                <span
                  className={`text-[10px] font-medium leading-tight tracking-tight ${active ? "text-primary" : "text-muted-foreground"}`}
                >
                  {label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
      <div style={{ height: "env(safe-area-inset-bottom)" }} />
    </nav>
  );
};

export default MobileBottomNav;
