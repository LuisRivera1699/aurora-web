import Link from "next/link";

type ReportScheduleCtaCardProps = {
  scheduleCta15m: string;
  scheduleButton: string;
  scheduleCta: string;
  href: string;
  external: boolean;
  className?: string;
};

export function ReportScheduleCtaCard({
  scheduleCta15m,
  scheduleButton,
  scheduleCta,
  href,
  external,
  className = "",
}: ReportScheduleCtaCardProps) {
  return (
    <div
      className={`rounded-2xl border border-aurora-blue/30 bg-gradient-to-br from-aurora-blue/[0.12] via-transparent to-aurora-purple/[0.06] p-6 sm:p-8 ${className}`}
    >
      <p className="font-display text-lg font-semibold text-foreground">{scheduleCta15m}</p>
      <Link
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="mt-5 inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-aurora-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-aurora-blue/90 sm:w-auto"
      >
        {scheduleButton}
      </Link>
      <p className="mt-4 text-sm text-foreground-muted">{scheduleCta}</p>
    </div>
  );
}
