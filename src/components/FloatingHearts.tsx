import React, { useMemo } from 'react';

interface FloatingHeartsProps {
  count?: number;
}

export const FloatingHearts: React.FC<FloatingHeartsProps> = ({ count = 16 }) => {
  const hearts = useMemo(() => {
    const emojis = ['💖', '🌸', '✨', '💕', '🎀', '💌', '🤍', '☁️'];
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      left: `${(i * 100) / count + (Math.random() * 6 - 3)}%`,
      size: `${14 + (i % 5) * 4}px`,
      duration: `${9 + (i % 7) * 2}s`,
      delay: `${(i * 0.7) % 8}s`,
      opacity: 0.25 + (i % 4) * 0.1,
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="floating-heart"
          style={{
            left: h.left,
            fontSize: h.size,
            animationDuration: h.duration,
            animationDelay: h.delay,
            opacity: h.opacity,
          }}
          aria-hidden="true"
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
};
