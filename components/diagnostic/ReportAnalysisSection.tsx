import type { ReactNode } from "react";

type Variant = "default" | "card" | "emphasis" | "risk" | "next";

const variantClass: Record<Variant, string> = {
  default: "border-l-2 border-aurora-blue/35 pl-4",
  card: "rounded-2xl border border-white/10 bg-surface-card/25 p-5 sm:p-6",
  emphasis:
    "rounded-2xl border border-aurora-blue/25 bg-gradient-to-br from-aurora-blue/[0.07] to-transparent p-5 sm:p-6",
  risk: "rounded-xl border border-white/10 bg-surface-card/35 p-5 sm:p-6",
  next: "border-l-2 border-aurora-purple/45 pl-4",
};

type ReportAnalysisSectionProps = {
  title: string;
  variant?: Variant;
  children: ReactNode;
};

export function ReportAnalysisSection({ title, variant = "default", children }: ReportAnalysisSectionProps) {
  return (
    <section className={variantClass[variant]}>
      <h2 className="font-display text-lg font-semibold text-aurora-blue">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
