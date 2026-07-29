import { useEffect, useState } from 'react';

export function ParticleBackground() {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; duration: number; size: number }>>([]);

  useEffect(() => {
    // Generate static particle data once on mount
    const p = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      size: 0.2 + Math.random() * 0.5
    }));
    setParticles(p);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Soft gradient radial mask overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-background/80 to-background z-10" />
      
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-0 rounded-full bg-primary/40 blur-[1px]"
          style={{
            left: `${p.left}%`,
            width: `${p.size}rem`,
            height: `${p.size}rem`,
            animation: `shimmer ${p.duration}s linear ${p.delay}s infinite`
          }}
        />
      ))}
    </div>
  );
}
