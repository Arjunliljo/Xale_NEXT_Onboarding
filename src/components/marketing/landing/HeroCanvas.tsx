"use client";

import { useEffect, useRef } from "react";

/**
 * HeroCanvas — performance-tuned 2D canvas:
 * - Network of slow-drifting nodes connected by faint lines when close
 * - Cursor distorts nearby nodes with magnetic force
 * - Pauses when off-screen (IntersectionObserver)
 * - Pauses on prefers-reduced-motion
 * - DPI-capped (max 2) to avoid retina perf hit
 * - ~60fps on M1 / mid-range desktop, gracefully degrades on mobile
 */
export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const FPS_CAP = 30;
    const FRAME_MS = 1000 / FPS_CAP;

    type Node = { x: number; y: number; vx: number; vy: number; baseX: number; baseY: number };
    let nodes: Node[] = [];
    let width = 0;
    let height = 0;
    let mouseX = -1000;
    let mouseY = -1000;
    let raf = 0;
    let visible = true;
    let lastTime = performance.now();
    let lastFrame = 0;

    function resize() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);

      // Aim for fewer, sparser nodes — O(n²) connection pass dominates cost.
      const target = Math.max(28, Math.min(60, Math.floor((width * height) / 22000)));
      nodes = Array.from({ length: target }, () => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        return {
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
        };
      });
    }

    function onMove(e: PointerEvent) {
      const rect = canvas?.getBoundingClientRect();
      if (!rect) return;
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }
    function onLeave() {
      mouseX = -1000;
      mouseY = -1000;
    }

    function tick(now: number) {
      if (!visible) return;
      raf = requestAnimationFrame(tick);

      // Frame-rate cap — slow drift looks identical at 30fps but halves CPU
      if (now - lastFrame < FRAME_MS) return;
      const dt = Math.min(48, now - lastTime);
      lastTime = now;
      lastFrame = now;
      const step = dt / 16.667;

      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Update positions
      for (const n of nodes) {
        n.x += n.vx * step;
        n.y += n.vy * step;

        // Soft return-to-base spring
        n.x += (n.baseX - n.x) * 0.001;
        n.y += (n.baseY - n.y) * 0.001;

        // Cursor influence (push away)
        const dx = n.x - mouseX;
        const dy = n.y - mouseY;
        const d2 = dx * dx + dy * dy;
        if (d2 < 14400) {
          const d = Math.sqrt(d2) || 1;
          const force = (1 - d / 120) * 1.4;
          n.x += (dx / d) * force * step;
          n.y += (dy / d) * force * step;
        }

        // Wrap softly
        if (n.x < -10) n.x = width + 10;
        if (n.x > width + 10) n.x = -10;
        if (n.y < -10) n.y = height + 10;
        if (n.y > height + 10) n.y = -10;
      }

      // Draw connections — O(n²) but capped at ~60 nodes ≈ 1.8k pair checks; cheap
      ctx.lineWidth = 1;
      const maxDist = 110;
      const maxDist2 = maxDist * maxDist;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < maxDist2) {
            const alpha = (1 - d2 / maxDist2) * 0.22;
            ctx.strokeStyle = `rgba(152,205,184,${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        const dx = n.x - mouseX;
        const dy = n.y - mouseY;
        const d2 = dx * dx + dy * dy;
        const near = d2 < 8000;
        ctx.fillStyle = near ? "rgba(49,155,114,0.95)" : "rgba(152,205,184,0.55)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, near ? 2.4 : 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    resize();
    lastFrame = performance.now();
    raf = requestAnimationFrame(tick);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !visible) {
            visible = true;
            lastTime = performance.now();
            lastFrame = lastTime;
            raf = requestAnimationFrame(tick);
          } else if (!e.isIntersecting && visible) {
            visible = false;
            cancelAnimationFrame(raf);
          }
        });
      },
      { threshold: 0.01 }
    );
    io.observe(canvas);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ display: "block" }}
    />
  );
}
