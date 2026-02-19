import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { User, MapPin, Heart, Map, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, isAuthenticated } = useUser();

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <div className="text-center">
          <User size={48} className="mx-auto text-muted-foreground" />
          <h2 className="mt-4 text-xl font-bold text-foreground">Sign in to view profile</h2>
          <Link to="/login" className="mt-4 inline-block rounded-2xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-24 md:pb-8">
      <div className="container mx-auto max-w-2xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-3xl bg-card p-8 card-elevated">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                <User size={28} className="text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>

          {!user.isFirstLogin && (
            <div className="mt-6 rounded-3xl bg-card p-6 card-elevated">
              <h3 className="mb-4 text-sm font-semibold text-foreground">Preferences</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-primary" />
                  <span className="text-sm text-muted-foreground">{user.preferences.location || "Not set"}</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {user.preferences.interests.map((i) => (
                      <span key={i} className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground capitalize">{i}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground capitalize">{user.preferences.budget}</span>
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground capitalize">{user.preferences.tripStyle}</span>
                  {user.preferences.offbeat && <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">Offbeat</span>}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link to="/my-trips" className="flex items-center gap-3 rounded-2xl bg-card p-5 card-elevated">
              <Map size={20} className="text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">Saved Trips</p>
                <p className="text-xs text-muted-foreground">{user.savedTrips.length} trips</p>
              </div>
            </Link>
            <Link to="/wishlist" className="flex items-center gap-3 rounded-2xl bg-card p-5 card-elevated">
              <Heart size={20} className="text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">Wishlist</p>
                <p className="text-xs text-muted-foreground">{user.wishlist.length} places</p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
