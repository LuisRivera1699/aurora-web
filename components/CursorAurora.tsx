"use client";

import { useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Interpola ángulos en radianes por el arco más corto. */
function lerpAngle(a: number, b: number, t: number): number {
  let d = b - a;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return a + d * t;
}

function fmtTransform(
  x: number,
  y: number,
  rotateDeg: number,
  scale = 1,
): string {
  return `translate3d(${x}px,${y}px,0) translate(-50%,-50%) rotate(${rotateDeg}deg) scale(${scale})`;
}

function CursorAuroraRaf() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const blobARef = useRef<HTMLDivElement>(null);
  const blobBRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const wash = washRef.current;
    const blobA = blobARef.current;
    const blobB = blobBRef.current;
    const core = coreRef.current;
    if (!wrap || !wash || !blobA || !blobB || !core) return;

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    const pos = {
      tx: cx,
      ty: cy,
      x: cx,
      y: cy,
      cx: cx,
      cy: cy,
      bx: cx,
      by: cy,
      kx: cx,
      ky: cy,
    };

    const mouse = { x: cx, y: cy, t: performance.now() };
    const vel = { x: 0, y: 0 };
    let angleRad = -Math.PI / 2;

    let moving = false;
    let raf = 0;
    let washOp = 0.28;
    let wrapOp = 0.85;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = Math.min(Math.max((now - mouse.t) / 1000, 0.001), 0.064);
      const rawVx = (e.clientX - mouse.x) / dt;
      const rawVy = (e.clientY - mouse.y) / dt;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.t = now;

      vel.x = lerp(vel.x, rawVx, 0.38);
      vel.y = lerp(vel.y, rawVy, 0.38);

      pos.tx = e.clientX;
      pos.ty = e.clientY;
      moving = true;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        moving = false;
      }, 2200);
    };

    const onBlur = () => {
      moving = false;
    };

    const tick = () => {
      const easeFast = moving ? 0.16 : 0.072;
      const easeMid = moving ? 0.1 : 0.048;
      const easeSlow = moving ? 0.058 : 0.032;

      vel.x *= 0.93;
      vel.y *= 0.93;
      const speed = Math.hypot(vel.x, vel.y);

      if (speed > 12) {
        const target = Math.atan2(vel.y, vel.x);
        const turn = speed > 90 ? 0.2 : speed > 35 ? 0.14 : 0.09;
        angleRad = lerpAngle(angleRad, target, turn);
      } else if (!moving) {
        angleRad = lerpAngle(angleRad, -Math.PI / 2, 0.02);
      }

      const time = performance.now();
      const wobble = Math.sin(time * 0.0009) * 2.5 + Math.sin(time * 0.0017 + pos.tx * 0.008) * 1.5;
      const rotBase = angleRad * (180 / Math.PI) + 90;
      const rotWash = rotBase * 0.42 + wobble * 0.35;
      const rotA = rotBase + wobble * 0.5;
      const rotB = rotBase * 0.78 + wobble * 0.4;
      const rotC = rotBase * 1.02 + Math.sin(time * 0.0022) * 3;

      const leadBlend = Math.min(speed / 380, 1) * (moving ? 1 : 0.35);
      const lead = leadBlend * 52;
      const leadX = Math.cos(angleRad) * lead;
      const leadY = Math.sin(angleRad) * lead;

      pos.x = lerp(pos.x, pos.tx, easeFast);
      pos.y = lerp(pos.y, pos.ty, easeFast);
      pos.cx = lerp(pos.cx, pos.tx, easeMid);
      pos.cy = lerp(pos.cy, pos.ty, easeMid);
      pos.bx = lerp(pos.bx, pos.tx, easeSlow);
      pos.by = lerp(pos.by, pos.ty, easeSlow);

      const targetKx = pos.tx + leadX;
      const targetKy = pos.ty + leadY;
      pos.kx = lerp(pos.kx, targetKx, moving ? 0.24 : 0.1);
      pos.ky = lerp(pos.ky, targetKy, moving ? 0.24 : 0.1);

      const pulse = 1 + 0.045 * Math.sin(time * 0.0034) + 0.025 * Math.sin(time * 0.0051 + pos.x * 0.012);

      wash.style.transform = fmtTransform(pos.bx, pos.by, rotWash, pulse * 0.98);
      blobA.style.transform = fmtTransform(pos.x, pos.y, rotA, pulse);
      blobB.style.transform = fmtTransform(pos.cx, pos.cy, rotB, pulse * 1.02);
      core.style.transform = fmtTransform(pos.kx, pos.ky, rotC, pulse * 1.06);

      const coreTwinkle =
        0.78 +
        0.1 * Math.sin(time * 0.004) +
        0.06 * Math.sin(time * 0.0068) +
        (moving ? 0.08 : 0);
      core.style.opacity = String(Math.min(1, coreTwinkle));

      const targetWash = moving ? 0.4 : 0.14;
      washOp = lerp(washOp, targetWash, moving ? 0.06 : 0.035);
      wash.style.opacity = String(washOp);

      const targetWrap = moving ? 1 : 0.76;
      wrapOp = lerp(wrapOp, targetWrap, moving ? 0.08 : 0.04);
      wrap.style.opacity = String(wrapOp);

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("blur", onBlur);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("blur", onBlur);
      cancelAnimationFrame(raf);
      clearTimeout(idleTimer);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ opacity: 0.85 }}
      aria-hidden
    >
      <div className="pointer-events-none h-full w-full cursor-aurora-breathe">
        <div
          ref={washRef}
          className="pointer-events-none absolute left-0 top-0 h-[min(95vw,900px)] w-[min(95vw,900px)] rounded-full opacity-[0.28] will-change-transform"
          style={{
            background:
              "radial-gradient(ellipse 85% 70% at 58% 42%, rgba(0,110,160,0.26) 0%, rgba(133,67,154,0.14) 38%, transparent 72%)",
            filter: "blur(72px)",
          }}
        />
        <div
          ref={blobARef}
          className="pointer-events-none absolute left-0 top-0 h-[min(72vw,620px)] w-[min(72vw,620px)] rounded-full will-change-transform"
          style={{
            background:
              "radial-gradient(ellipse 80% 65% at 62% 38%, rgba(133,67,154,0.48) 0%, rgba(0,110,160,0.2) 44%, transparent 74%)",
            filter: "blur(52px)",
          }}
        />
        <div
          ref={blobBRef}
          className="pointer-events-none absolute left-0 top-0 h-[min(56vw,480px)] w-[min(56vw,480px)] rounded-full will-change-transform"
          style={{
            background:
              "radial-gradient(ellipse 75% 70% at 55% 45%, rgba(90,130,220,0.38) 0%, rgba(133,67,154,0.16) 48%, transparent 70%)",
            filter: "blur(38px)",
          }}
        />
        <div
          ref={coreRef}
          className="pointer-events-none absolute left-0 top-0 h-[min(22vw,200px)] w-[min(22vw,200px)] rounded-full will-change-transform"
          style={{
            background:
              "radial-gradient(ellipse 70% 65% at 55% 40%, rgba(255,255,255,0.75) 0%, rgba(0,110,160,0.45) 36%, transparent 64%)",
            filter: "blur(14px)",
            opacity: 0.88,
          }}
        />
      </div>
    </div>
  );
}

function CursorAuroraLayer() {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (reduceMotion === true) {
      setEnabled(false);
      return;
    }
    const mq = window.matchMedia("(pointer: fine)");
    const apply = () => {
      setEnabled(mq.matches);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [reduceMotion]);

  if (!enabled) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-20 mix-blend-screen"
      aria-hidden
    >
      <CursorAuroraRaf />
    </div>
  );
}

export function CursorAurora() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return null;
  }
  return <CursorAuroraLayer />;
}
