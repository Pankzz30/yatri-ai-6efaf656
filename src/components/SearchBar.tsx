import { useState } from "react";
import { Search, MapPin, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const SearchBar = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="glass mx-auto w-full max-w-3xl rounded-2xl p-2"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-background px-4 py-3">
          <MapPin size={16} className="text-primary" />
          <input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="From where?"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-background px-4 py-3">
          <MapPin size={16} className="text-primary" />
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Where to?"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-background px-4 py-3 md:w-36">
          <Calendar size={16} className="text-primary" />
          <input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Days"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105">
          <Search size={16} />
          <span className="md:hidden">Search</span>
        </button>
      </div>
    </motion.div>
  );
};

export default SearchBar;
