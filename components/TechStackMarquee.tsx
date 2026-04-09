"use client";

import { useReducedMotion } from "framer-motion";
import { TechStackGlyph } from "@/components/TechStackGlyph";

export type TechMarqueeItem = { id: string; label: string };

export function TechStackMarquee({ items }: { items: readonly TechMarqueeItem[] }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <ul className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-10 gap-y-10 px-4">
        {items.map((item) => (
          <li key={item.id} className="shrink-0">
            <TechStackGlyph id={item.id} label={item.label} />
          </li>
        ))}
      </ul>
    );
  }

  const loop = [...items, ...items];

  return (
    <div className="tech-marquee-wrapper group relative w-full py-2 md:py-4">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-surface-900 to-transparent md:w-24"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-surface-900 to-transparent md:w-24"
        aria-hidden
      />
      <div className="overflow-hidden">
        <div className="tech-marquee-track flex w-max items-center gap-10 md:gap-14 lg:gap-16">
          {loop.map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              className="shrink-0"
              aria-hidden={i >= items.length}
            >
              <TechStackGlyph id={item.id} label={item.label} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
