"use client";

import { useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
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

    const pos = {
      tx: window.innerWidth / 2,
      ty: window.innerHeight / 2,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      cx: window.innerWidth / 2,
      cy: window.innerHeight / 2,
      bx: window.innerWidth / 2,
      by: window.innerHeight / 2,
      kx: window.innerWidth / 2,
      ky: window.innerHeight / 2,
    };

    let moving = false;
    let raf = 0;
    let washOp = 0.28;
    let wrapOp = 0.85;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;

    const onMove = (e: MouseEvent) => {
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

      pos.x = lerp(pos.x, pos.tx, easeFast);
      pos.y = lerp(pos.y, pos.ty, easeFast);
      pos.cx = lerp(pos.cx, pos.tx, easeMid);
      pos.cy = lerp(pos.cy, pos.ty, easeMid);
      pos.bx = lerp(pos.bx, pos.tx, easeSlow);
      pos.by = lerp(pos.by, pos.ty, easeSlow);
      pos.kx = lerp(pos.kx, pos.tx, moving ? 0.22 : 0.11);
      pos.ky = lerp(pos.ky, pos.ty, moving ? 0.22 : 0.11);

      const t = `translate3d(${pos.x}px,${pos.y}px,0) translate(-50%,-50%)`;
      const t2 = `translate3d(${pos.cx}px,${pos.cy}px,0) translate(-50%,-50%)`;
      const t3 = `translate3d(${pos.bx}px,${pos.by}px,0) translate(-50%,-50%)`;
      const tk = `translate3d(${pos.kx}px,${pos.ky}px,0) translate(-50%,-50%)`;

      wash.style.transform = t3;
      blobA.style.transform = t;
      blobB.style.transform = t2;
      core.style.transform = tk;

      const targetWash = moving ? 0.38 : 0.14;
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
      <div
        ref={washRef}
        className="pointer-events-none absolute left-0 top-0 h-[min(95vw,900px)] w-[min(95vw,900px)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.28]"
        style={{
          background:
            "radial-gradient(circle at 40% 35%, rgba(0,110,160,0.22) 0%, rgba(133,67,154,0.12) 42%, transparent 70%)",
          filter: "blur(72px)",
        }}
      />
      <div
        ref={blobARef}
        className="pointer-events-none absolute left-0 top-0 h-[min(72vw,620px)] w-[min(72vw,620px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 45% 40%, rgba(133,67,154,0.42) 0%, rgba(0,110,160,0.18) 45%, transparent 72%)",
          filter: "blur(52px)",
        }}
      />
      <div
        ref={blobBRef}
        className="pointer-events-none absolute left-0 top-0 h-[min(56vw,480px)] w-[min(56vw,480px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(90,130,220,0.35) 0%, rgba(133,67,154,0.14) 50%, transparent 68%)",
          filter: "blur(38px)",
        }}
      />
      <div
        ref={coreRef}
        className="pointer-events-none absolute left-0 top-0 h-[min(22vw,200px)] w-[min(22vw,200px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(232,240,255,0.65) 0%, rgba(0,110,160,0.4) 34%, transparent 62%)",
          filter: "blur(14px)",
          opacity: 0.88,
        }}
      />
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
