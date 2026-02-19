import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  tx: number; // target x
  ty: number; // target y
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  phase: number;
}

interface ParticleFieldProps {
  stage: "build" | "form" | "dissolve" | "done";
  width: number;
  height: number;
}

const RED = "hsl(347,77%,50%)";
const GRAY = "hsl(220,9%,72%)";

function randomEdge(w: number, h: number): { x: number; y: number } {
  const side = Math.floor(Math.random() * 4);
  if (side === 0) return { x: Math.random() * w, y: -20 };
  if (side === 1) return { x: w + 20, y: Math.random() * h };
  if (side === 2) return { x: Math.random() * w, y: h + 20 };
  return { x: -20, y: Math.random() * h };
}

// Approximate logo letter positions in center area
function logoTargets(w: number, h: number): Array<{ x: number; y: number }> {
  const cx = w / 2;
  const cy = h / 2;
  const pts: Array<{ x: number; y: number }> = [];
  // "Y" shape
  for (let i = 0; i < 18; i++) {
    const t = i / 17;
    pts.push({ x: cx - 110 + t * 18, y: cy - 28 - t * 22 });
    pts.push({ x: cx - 110 + 36 - t * 18, y: cy - 28 - t * 22 });
  }
  for (let i = 0; i < 10; i++) {
    pts.push({ x: cx - 110 + 18, y: cy - 28 + (i * 5) });
  }
  // "a" shape
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    pts.push({ x: cx - 74 + Math.cos(a) * 14, y: cy + Math.sin(a) * 12 });
  }
  pts.push({ x: cx - 60, y: cy - 12 });
  pts.push({ x: cx - 60, y: cy + 12 });
  // "t" shape
  for (let i = 0; i < 8; i++) pts.push({ x: cx - 44, y: cy - 24 + i * 6 });
  for (let i = 0; i < 6; i++) pts.push({ x: cx - 50 + i * 4, y: cy - 18 });
  // "r" shape
  for (let i = 0; i < 8; i++) pts.push({ x: cx - 28, y: cy - 12 + i * 4 });
  pts.push({ x: cx - 28, y: cy - 12 });
  pts.push({ x: cx - 22, y: cy - 18 });
  // "i" shape
  for (let i = 0; i < 8; i++) pts.push({ x: cx - 12, y: cy - 12 + i * 4 });
  pts.push({ x: cx - 12, y: cy - 22 });
  // AI text area scatter
  for (let i = 0; i < 20; i++) {
    pts.push({ x: cx + 20 + Math.random() * 50, y: cy - 10 + Math.random() * 20 });
  }
  return pts;
}

const ParticleField = ({ stage, width, height }: ParticleFieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const targetsRef = useRef<Array<{ x: number; y: number }>>([]);

  useEffect(() => {
    if (!width || !height) return;
    const targets = logoTargets(width, height);
    targetsRef.current = targets;
    const count = 140;
    particlesRef.current = Array.from({ length: count }, (_, i) => {
      const edge = randomEdge(width, height);
      const t = targets[i % targets.length];
      return {
        x: edge.x,
        y: edge.y,
        tx: t.x + (Math.random() - 0.5) * 8,
        ty: t.y + (Math.random() - 0.5) * 8,
        vx: 0,
        vy: 0,
        size: Math.random() * 2.5 + 1,
        opacity: 0,
        color: Math.random() > 0.35 ? RED : GRAY,
        phase: Math.random() * Math.PI * 2,
      };
    });
  }, [width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let startTime = performance.now();

    const draw = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((p) => {
        if (stage === "build") {
          // Drift inward slowly
          const targetOpacity = Math.min(1, elapsed / 1.5);
          p.opacity += (targetOpacity * 0.7 - p.opacity) * 0.04;
          p.x += (width / 2 - p.x) * 0.004 + Math.sin(elapsed + p.phase) * 0.4;
          p.y += (height / 2 - p.y) * 0.004 + Math.cos(elapsed + p.phase) * 0.4;
        } else if (stage === "form") {
          // Move toward logo targets
          p.opacity += (0.9 - p.opacity) * 0.06;
          p.x += (p.tx - p.x) * 0.08;
          p.y += (p.ty - p.y) * 0.08;
        } else if (stage === "dissolve") {
          // Fade out
          p.opacity += (0 - p.opacity) * 0.12;
        }

        if (p.opacity < 0.01) return;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        // soft glow
        ctx.shadowColor = p.color === RED ? "hsla(347,77%,50%,0.6)" : "transparent";
        ctx.shadowBlur = p.color === RED ? 6 : 0;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [stage, width, height]);

  if (stage === "done") return null;

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 pointer-events-none"
      style={{ willChange: "transform" }}
    />
  );
};

export default ParticleField;
