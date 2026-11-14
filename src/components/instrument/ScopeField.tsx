"use client";

import { useEffect, useRef } from "react";

/**
 * SCOPE FIELD: the main site's background, replacing the 3D scene.
 *
 * A fixed canvas with a faint graticule and three slow traces. The pointer acts
 * as a probe: traces bend towards it as it passes. Plain 2D canvas, no
 * libraries and no network requests, so it cannot take the page down.
 *
 * Kept quiet on purpose (low alpha, about 30 frames a second, paused when the
 * tab is hidden) because text sits on top of it on every main-site page.
 * With prefers-reduced-motion it draws one still frame.
 */

export default function ScopeField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;

    const css = getComputedStyle(cv);
    const ink = css.getPropertyValue("--ink").trim() || "#eaf0e8";
    const sig = css.getPropertyValue("--signal").trim() || "#e3b95b";
    const sig2 = css.getPropertyValue("--signal-2").trim() || "#7fe3b4";
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, raf = 0, last = 0;
    const probe = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const traces = [
      { y: 0.3, a: 26, k: 0.0052, s: 0.22, col: ink, alpha: 0.1 },
      { y: 0.56, a: 34, k: 0.0037, s: -0.16, col: sig, alpha: 0.2 },
      { y: 0.8, a: 22, k: 0.0068, s: 0.3, col: sig2, alpha: 0.14 },
    ];

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      // graticule
      const cell = 56;
      ctx.fillStyle = ink;
      ctx.globalAlpha = 0.1;
      for (let x = cell / 2; x < w; x += cell) for (let y = cell / 2; y < h; y += cell) ctx.fillRect(x, y, 1, 1);
      ctx.globalAlpha = 0.035;
      for (let x = cell / 2; x < w; x += cell * 4) ctx.fillRect(x, 0, 1, h);
      for (let y = cell / 2; y < h; y += cell * 4) ctx.fillRect(0, y, w, 1);

      probe.x += (probe.tx - probe.x) * 0.12;
      probe.y += (probe.ty - probe.y) * 0.12;
      const scroll = window.scrollY * 0.002;

      ctx.lineWidth = 1.3;
      for (const tr of traces) {
        const base = h * tr.y;
        ctx.beginPath();
        for (let x = -8; x <= w + 8; x += 8) {
          const ph = t * tr.s + scroll;
          let y = base + tr.a * (Math.sin(x * tr.k + ph) + 0.45 * Math.sin(x * tr.k * 2.7 - ph * 1.6));
          const dx = x - probe.x;
          const pull = Math.exp(-(dx * dx) / (2 * 150 * 150));
          const dy = probe.y - y;
          y += pull * Math.max(-90, Math.min(90, dy)) * 0.55;
          if (x === -8) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = tr.col;
        ctx.globalAlpha = tr.alpha;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 33) return;
      last = now;
      draw(now / 1000);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      probe.tx = e.clientX;
      probe.ty = e.clientY;
    };
    const onLeave = () => {
      probe.tx = -9999;
      probe.ty = -9999;
    };
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !still) raf = requestAnimationFrame(loop);
    };
    const onResize = () => {
      size();
      if (still) draw(0);
    };

    size();
    if (still) draw(0);
    else raf = requestAnimationFrame(loop);

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}
