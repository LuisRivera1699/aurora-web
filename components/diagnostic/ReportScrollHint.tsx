"use client";

import { useCallback, useEffect, useState } from "react";

type ReportScrollHintProps = {
  targetId: string;
  ariaLabel: string;
};

const BOTTOM_THRESHOLD_PX = 96;

function canScrollFurther(): boolean {
  if (typeof document === "undefined") return false;
  const doc = document.documentElement;
  return doc.scrollHeight > window.innerHeight + 24;
}

function isNearPageBottom(): boolean {
  if (typeof document === "undefined") return true;
  const doc = document.documentElement;
  const y = window.scrollY + window.innerHeight;
  return y >= doc.scrollHeight - BOTTOM_THRESHOLD_PX;
}

export function ReportScrollHint({ targetId, ariaLabel }: ReportScrollHintProps) {
  const [visible, setVisible] = useState(false);

  const update = useCallback(() => {
    if (!canScrollFurther()) {
      setVisible(false);
      return;
    }
    setVisible(!isNearPageBottom());
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => update())
        : null;
    if (ro) ro.observe(document.documentElement);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      ro?.disconnect();
    };
  }, [update]);

  function scrollToContent() {
    const el = document.getElementById(targetId);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-30 flex justify-center pb-[env(safe-area-inset-bottom,0px)] md:bottom-8">
      <button
        type="button"
        onClick={scrollToContent}
        aria-label={ariaLabel}
        className="pointer-events-auto motion-safe:animate-bounce group flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-surface-card/70 text-foreground-muted shadow-lg shadow-black/30 backdrop-blur-sm transition hover:border-aurora-blue/40 hover:bg-surface-card/95 hover:text-aurora-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora-blue"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 transition motion-reduce:transition-none group-hover:translate-y-0.5"
          aria-hidden
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}
