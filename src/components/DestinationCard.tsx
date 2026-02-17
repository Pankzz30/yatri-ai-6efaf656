import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import type { Destination } from "@/data/mockData";

interface Props {
  destination: Destination;
  index?: number;
}

const DestinationCard = ({ destination, index = 0 }: Props) => {
  const { user, isAuthenticated, toggleWishlist } = useUser();
  const isWishlisted = user?.wishlist.includes(destination.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group min-w-[260px] max-w-[300px] flex-shrink-0 overflow-hidden rounded-2xl bg-card card-elevated"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
        {isAuthenticated && (
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(destination.id);
            }}
            className="absolute right-3 top-3 rounded-full bg-card/80 p-2 backdrop-blur-sm transition-transform hover:scale-110"
          >
            <Heart
              size={16}
              className={isWishlisted ? "fill-primary text-primary" : "text-foreground"}
            />
          </button>
        )}
        <div className="absolute bottom-3 left-3">
          <span className="rounded-full bg-card/80 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
            {destination.distance} km
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-foreground">{destination.name}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{destination.state}</p>
        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{destination.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-primary">{destination.budgetRange}</span>
          <Link
            to={`/trip/${destination.id}`}
            className="rounded-xl bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-transform hover:scale-105"
          >
            View Plan
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default DestinationCard;
