import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

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

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.02]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="relative h-[60vh] min-h-[400px] overflow-hidden"
    >
      <motion.img
        src={story.image}
        alt={story.headline}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ y, scale }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute inset-0 flex items-end justify-start p-8 sm:p-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="text-3xl sm:text-5xl font-bold text-white tracking-tight max-w-lg leading-tight"
        >
          {story.headline}
        </motion.h2>
      </div>
    </motion.div>
  );
}

export default function CinematicStory() {
  return (
    <section>
      {STORIES.map((story, i) => (
        <StorySlice key={story.headline} story={story} index={i} />
      ))}
    </section>
  );
}
