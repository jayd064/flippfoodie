import { useEffect, useState } from "react";

export const Confetti = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    color: string;
    delay: number;
    rotation: number;
  }>>([]);

  useEffect(() => {
    const handleLevelUp = () => {
      // Generate confetti particles
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: ["#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#3b82f6"][Math.floor(Math.random() * 5)],
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360,
      }));
      setParticles(newParticles);

      // Clear after animation
      setTimeout(() => setParticles([]), 3000);
    };

    window.addEventListener("levelUp", handleLevelUp);
    return () => window.removeEventListener("levelUp", handleLevelUp);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999]">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 rounded-sm animate-confetti-fall"
          style={{
            left: `${particle.x}%`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
            transform: `rotate(${particle.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
};
