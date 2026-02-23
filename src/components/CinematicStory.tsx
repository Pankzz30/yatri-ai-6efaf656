import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SECTIONS = [
  {
    headline: "Chase the Mountains.",
    sub: "Where the air is thin and the views are endless.",
    video: "https://videos.pexels.com/video-files/2169880/2169880-hd_1920_1080_30fps.mp4",
    poster: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
    cta: "Explore Peaks",
    prompt: "Plan a scenic mountain trip in India with trekking, camping, and breathtaking views. Budget-friendly, 5 days.",
  },
  {
    headline: "Feel the Open Road.",
    sub: "Every mile tells a story worth remembering.",
    video: "https://videos.pexels.com/video-files/2795382/2795382-hd_1920_1080_30fps.mp4",
    poster: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200",
    cta: "Start Driving",
    prompt: "Plan an epic road trip across India covering scenic highways, roadside dhabas, and hidden gems. 7 days, self-drive.",
  },
  {
    headline: "Lose Yourself in the Coast.",
    sub: "Where the horizon meets the deep blue.",
    video: "https://videos.pexels.com/video-files/1409899/1409899-hd_1920_1080_25fps.mp4",
    poster: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200",
    cta: "Discover Shores",
    prompt: "Plan a relaxing coastal getaway in India with beaches, seafood, and water activities. 5 days, moderate budget.",
  },
  {
    headline: "Find Stories in Every Skyline.",
    sub: "Cities that never stop inspiring.",
    video: "https://videos.pexels.com/video-files/3129671/3129671-hd_1920_1080_30fps.mp4",
    poster: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200",
    cta: "Explore Cities",
    prompt: "Plan a vibrant city exploration trip covering culture, street food, nightlife, and iconic landmarks in India. 4 days.",
  },
];

/* ── Film grain overlay via CSS ── */
const grainStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  opacity: 0.06,
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
  backgroundSize: "128px 128px",
};

function VideoSection({
  section,
  index,
}: {
  section: (typeof SECTIONS)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const navigate = useNavigate();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1, delay: index * 0.08, ease: "easeOut" }}
      className="relative h-[70vh] min-h-[420px] w-full overflow-hidden"
    >
      {/* Video background with parallax */}
      <motion.div className="absolute inset-0 will-change-transform" style={{ y }}>
        {/* Fallback poster */}
        <img
          src={section.poster}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? "opacity-0" : "opacity-100"
          }`}
          style={{ filter: "blur(2px)" }}
        />

        {/* Video */}
        <video
          src={section.video}
          poster={section.poster}
          autoPlay
          loop
          muted
          playsInline
          onCanPlayThrough={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{ filter: "blur(2px)" }}
        />
      </motion.div>

      {/* Dark gradient overlay (55-60%) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/45 to-black/30" />

      {/* Soft fog / light-leak */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background:
            "radial-gradient(ellipse at 30% 80%, hsla(0,0%,100%,0.18) 0%, transparent 55%), " +
            "radial-gradient(ellipse at 80% 30%, hsla(40,60%,90%,0.1) 0%, transparent 50%)",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: "inset 0 0 140px 50px rgba(0,0,0,0.4)" }}
      />

      {/* Film grain */}
      <div style={grainStyle} />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-start justify-end p-8 sm:p-14 lg:p-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="text-sm sm:text-base text-white/70 tracking-widest uppercase mb-3"
        >
          {section.sub}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 40, letterSpacing: "0.08em" }}
          whileInView={{ opacity: 1, y: 0, letterSpacing: "0.01em" }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white max-w-2xl leading-[1.08] drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)] mb-6"
        >
          {section.headline}
        </motion.h2>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          onClick={() => navigate("/plan", { state: { prompt: section.prompt } })}
          className="group flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/50"
        >
          {section.cta}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function CinematicStory() {
  return (
    <section className="w-full">
      {SECTIONS.map((section, i) => (
        <VideoSection key={section.headline} section={section} index={i} />
      ))}
    </section>
  );
}
