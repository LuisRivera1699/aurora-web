import type { ReactNode } from "react";

export function SectionTitle({
  children,
  id,
  align = "left",
}: {
  children: ReactNode;
  id?: string;
  align?: "left" | "center";
}) {
  return (
    <h2
      id={id}
      className={`font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl ${
        align === "center" ? "text-center" : "text-left"
      }`}
    >
      <span className="gradient-text" aria-hidden>
        &gt;{" "}
      </span>
      {children}
    </h2>
  );
}
