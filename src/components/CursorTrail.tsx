import React, { useEffect, useState, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  size: number;
  rotation: number;
}

const TRAIL_EMOJIS = ['💖', '✨', '🌸', '💕', '🎀', '🧸', '🤍', '⭐', '🌷'];

export const CursorTrail: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const lastPosRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const idCounterRef = useRef<number>(0);

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        return;
      }

      const now = performance.now();
      const dx = clientX - lastPosRef.current.x;
      const dy = clientY - lastPosRef.current.y;
      const dist = Math.hypot(dx, dy);

      // Only spawn particle if mouse moved enough distance or enough time passed
      if (dist > 18 || now - lastPosRef.current.time > 80) {
        lastPosRef.current = { x: clientX, y: clientY, time: now };
        idCounterRef.current += 1;

        const randomEmoji = TRAIL_EMOJIS[idCounterRef.current % TRAIL_EMOJIS.length];
        const randomSize = 14 + (idCounterRef.current % 4) * 4; // 14px to 26px
        const randomRotation = ((idCounterRef.current * 37) % 60) - 30; // -30deg to 30deg

        const newParticle: Particle = {
          id: idCounterRef.current,
          x: clientX,
          y: clientY,
          emoji: randomEmoji,
          size: randomSize,
          rotation: randomRotation,
        };

        setParticles((prev) => {
          // Limit active particles to 18 to maintain high performance (60fps)
          const updated = prev.length > 18 ? prev.slice(prev.length - 17) : prev;
          return [...updated, newParticle];
        });

        // Automatically clean up particle after animation finishes (750ms)
        setTimeout(() => {
          setParticles((current) => current.filter((p) => p.id !== newParticle.id));
        }, 750);
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute animate-cursor-float pointer-events-none select-none leading-none"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            fontSize: `${p.size}px`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
};
