import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const STORIES = [
  {
    headline: "Chase the Mountains.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
  },
  {
    headline: "Lose Yourself in the Coast.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200",
  },
  {
    headline: "Find Stories in Every Street.",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200",
  },
];

function StorySlice({ story, index }: { story: typeof STORIES[0]; index: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax: image moves slower than scroll
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  // Ken Burns: slow zoom over scroll
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1.12]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
      className="relative h-[70vh] min-h-[450px] w-full overflow-hidden"
    >
      {/* Background with parallax + Ken Burns */}
      <motion.img
        src={story.image}
        alt={story.headline}
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
        style={{ y, scale }}
      />

      {/* Dark cinematic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

      {/* Atmospheric mist overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 80%, hsla(0,0%,100%,0.12) 0%, transparent 60%), " +
            "radial-gradient(ellipse at 20% 50%, hsla(0,0%,100%,0.06) 0%, transparent 50%)",
        }}
      />

      {/* Soft vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 120px 40px rgba(0,0,0,0.35)",
        }}
      />

      {/* Text content */}
      <div className="absolute inset-0 flex items-end justify-start p-8 sm:p-16">
        <motion.h2
          initial={{ opacity: 0, y: 40, letterSpacing: "0.08em" }}
          whileInView={{ opacity: 1, y: 0, letterSpacing: "0.02em" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight max-w-xl leading-[1.1] drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
        >
          {story.headline}
        </motion.h2>
      </div>
    </motion.div>
  );
}

/* ── Crossfade Hero Banner ── */
function CinematicHeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % STORIES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[50vh] min-h-[340px] w-full overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.img
          key={current}
          src={STORIES[current].image}
          alt={STORIES[current].headline}
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1.15 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 0.8 }, scale: { duration: 8, ease: "linear" } }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/15" />

      {/* Atmospheric mist */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          background:
            "radial-gradient(ellipse at 50% 90%, hsla(0,0%,100%,0.15) 0%, transparent 55%)",
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center text-center px-6">
        <AnimatePresence mode="wait">
          <motion.h2
            key={current}
            initial={{ opacity: 0, y: 30, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, y: 0, letterSpacing: "0.02em" }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white max-w-2xl leading-[1.1] drop-shadow-[0_2px_16px_rgba(0,0,0,0.6)]"
          >
            {STORIES[current].headline}
          </motion.h2>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {STORIES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === current ? "w-8 bg-white" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function CinematicStory() {
  return (
    <section className="w-full">
      {/* Crossfade hero banner */}
      <CinematicHeroBanner />

      {/* Parallax story slices */}
      {STORIES.map((story, i) => (
        <StorySlice key={story.headline} story={story} index={i} />
      ))}
    </section>
  );
}
