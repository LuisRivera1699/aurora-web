import type { ElementType, ReactNode } from "react";

export function SectionTitle({
  children,
  id,
  align = "left",
  as,
}: {
  children: ReactNode;
  id?: string;
  align?: "left" | "center";
  /** Default `h2`; use `h1` for standalone pages (e.g. blog index). */
  as?: "h1" | "h2";
}) {
  const Component: ElementType = as ?? "h2";
  return (
    <Component
      id={id}
      className={`font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl ${
        align === "center" ? "text-center" : "text-left"
      }`}
    >
      <span className="gradient-text" aria-hidden>
        &gt;{" "}
      </span>
      {children}
    </Component>
  );
}
