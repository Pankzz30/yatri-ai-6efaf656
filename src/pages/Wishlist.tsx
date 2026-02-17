import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { destinations } from "@/data/mockData";
import DestinationCard from "@/components/DestinationCard";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { user, isAuthenticated } = useUser();
  const wishlisted = destinations.filter((d) => user?.wishlist.includes(d.id));

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <div className="text-center">
          <Heart size={48} className="mx-auto text-muted-foreground" />
          <h2 className="mt-4 text-xl font-bold text-foreground">Sign in to view wishlist</h2>
          <Link to="/login" className="mt-4 inline-block rounded-2xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground">Wishlist</h1>
          {wishlisted.length === 0 ? (
            <div className="mt-16 text-center">
              <Heart size={48} className="mx-auto text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">Your wishlist is empty. Tap the heart on any destination!</p>
              <Link to="/" className="mt-4 inline-block rounded-2xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">Explore</Link>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {wishlisted.map((d, i) => <DestinationCard key={d.id} destination={d} index={i} />)}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Wishlist;
