import { useEffect, useState } from 'react';

export function ParticleBackground() {
  const [particles, setParticles] = useState<Array<{
    id: number; left: number; delay: number; duration: number; size: number;
  }>>([]);

  useEffect(() => {
    // Fewer, more subtle particles for the luxury white theme
    const p = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 5 + Math.random() * 6,
      size: 0.15 + Math.random() * 0.3,
    }));
    setParticles(p);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Soft warm tint at the very top */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#FFFDF5] to-transparent opacity-60" />

      {/* Gold dust particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-0 rounded-full"
          style={{
            left: `${p.left}%`,
            width: `${p.size}rem`,
            height: `${p.size}rem`,
            background: "rgba(201, 162, 39, 0.35)",
            filter: "blur(1px)",
            animation: `shimmer ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
