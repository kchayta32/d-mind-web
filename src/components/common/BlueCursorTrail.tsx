import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxLife: number;
  life: number;
  color: string;
}

interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
  width: number;
}

export const BlueCursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Only activate for devices with a fine pointer (mouse / trackpad)
    if (typeof window === 'undefined') return;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number | null = null;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const trailPoints: TrailPoint[] = [];
    const MAX_TRAIL_POINTS = 18;

    let mouseX = -100;
    let mouseY = -100;
    let prevMouseX = -100;
    let prevMouseY = -100;
    let isMoving = false;
    let idleTimer: any = null;

    // Glowing Cyan & Electric Blue Colors
    const colors = [
      'rgba(0, 229, 255, ',   // Neon Cyan
      'rgba(56, 189, 248, ',  // Sky Blue
      'rgba(14, 165, 233, ',  // Light Blue
      'rgba(59, 130, 246, ',  // Electric Blue
      'rgba(99, 102, 241, ',  // Indigo Accent
    ];

    const addParticles = (x: number, y: number, vx: number, vy: number) => {
      const speed = Math.hypot(vx, vy);
      const count = Math.min(4, Math.max(1, Math.floor(speed / 4)));

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const pSpeed = Math.random() * 1.5 + 0.5;
        const colorPrefix = colors[Math.floor(Math.random() * colors.length)];
        const maxLife = Math.random() * 24 + 18;

        particles.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: vx * 0.15 + Math.cos(angle) * pSpeed,
          vy: vy * 0.15 + Math.sin(angle) * pSpeed,
          size: Math.random() * 3.5 + 1.5,
          alpha: 0.9,
          maxLife,
          life: maxLife,
          color: colorPrefix,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (prevMouseX === -100) {
        prevMouseX = mouseX;
        prevMouseY = mouseY;
      }

      const vx = mouseX - prevMouseX;
      const vy = mouseY - prevMouseY;
      const dist = Math.hypot(vx, vy);

      // Add to flowing trail
      trailPoints.unshift({
        x: mouseX,
        y: mouseY,
        alpha: 0.85,
        width: Math.min(10, Math.max(3, dist * 0.35)),
      });

      if (trailPoints.length > MAX_TRAIL_POINTS) {
        trailPoints.pop();
      }

      // Spawn fluid ripple particles along movement path
      if (dist > 1) {
        addParticles(mouseX, mouseY, vx, vy);
      }

      prevMouseX = mouseX;
      prevMouseY = mouseY;

      isMoving = true;
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        isMoving = false;
      }, 150);

      // Start animation loop if not running
      if (!animId) {
        animId = requestAnimationFrame(render);
      }
    };

    const handleMouseLeave = () => {
      mouseX = -100;
      mouseY = -100;
      prevMouseX = -100;
      prevMouseY = -100;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw glowing ribbon curve connecting trail points
      if (trailPoints.length > 2) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 0; i < trailPoints.length - 1; i++) {
          const p1 = trailPoints[i];
          const p2 = trailPoints[i + 1];
          const progress = i / trailPoints.length;
          const alpha = p1.alpha * (1 - progress);

          if (alpha <= 0.01) continue;

          // Electric blue gradient with cyan bloom
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 229, 255, ${alpha * 0.75})`;
          ctx.lineWidth = Math.max(1, p1.width * (1 - progress * 0.8));
          ctx.shadowColor = 'rgba(0, 229, 255, 0.8)';
          ctx.shadowBlur = 8;
          ctx.stroke();

          // Core bright white-blue line
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(224, 242, 254, ${alpha * 0.9})`;
          ctx.lineWidth = Math.max(0.75, (p1.width * (1 - progress * 0.8)) / 2.5);
          ctx.shadowBlur = 0;
          ctx.stroke();

          // Decay alpha
          p1.alpha *= 0.91;
        }

        ctx.restore();
      }

      // Clean up faded trail points
      while (trailPoints.length > 0 && trailPoints[trailPoints.length - 1].alpha < 0.02) {
        trailPoints.pop();
      }

      // 2. Render and update glowing fluid particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.life -= 1;
        const lifeRatio = p.life / p.maxLife;
        p.alpha = lifeRatio;

        if (p.life <= 0 || p.alpha <= 0.01) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.shadowColor = 'rgba(0, 229, 255, 0.9)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = `${p.color}${p.alpha})`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.size * lifeRatio), 0, Math.PI * 2);
        ctx.fill();

        // Inner glowing core
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.3, p.size * lifeRatio * 0.4), 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // 3. Leading cursor glow halo
      if (mouseX > 0 && mouseY > 0 && isMoving) {
        ctx.save();
        const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 16);
        gradient.addColorStop(0, 'rgba(0, 229, 255, 0.45)');
        gradient.addColorStop(0.5, 'rgba(56, 189, 248, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 229, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Loop condition: keep rendering if moving, or if particles/trail points still animating
      if (isMoving || particles.length > 0 || trailPoints.length > 0) {
        animId = requestAnimationFrame(render);
      } else {
        animId = null;
      }
    };

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animId) cancelAnimationFrame(animId);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[999999] h-full w-full"
      style={{ touchAction: 'none' }}
      aria-hidden="true"
    />
  );
};

export default BlueCursorTrail;
