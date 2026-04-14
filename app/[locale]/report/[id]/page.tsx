import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { ReportAnalysisSection } from "@/components/diagnostic/ReportAnalysisSection";
import { ReportPdfDownload } from "@/components/diagnostic/ReportPdfDownload";
import { ReportScheduleCtaCard } from "@/components/diagnostic/ReportScheduleCtaCard";
import { ReportScrollHint } from "@/components/diagnostic/ReportScrollHint";
import { getMessages, isLocale } from "@/content/getMessages";
import { getReportClientDisplayName } from "@/lib/diagnostics/report-client-line";
import { buildCalendlyScheduleUrl } from "@/lib/calendly-schedule-url";
import { loadPublicDiagnostic } from "@/lib/diagnostics/server";
import { isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import type { PrimaryRecommendation } from "@/lib/diagnostics/types";

function opportunityWidth(level: "high" | "medium" | "low"): string {
  if (level === "high") return "92%";
  if (level === "medium") return "62%";
  return "35%";
}

function opportunityLabel(
  locale: string,
  level: "high" | "medium" | "low",
): string {
  if (locale === "es") {
    if (level === "high") return "Alta";
    if (level === "medium") return "Media";
    return "Baja";
  }
  if (level === "high") return "High";
  if (level === "medium") return "Medium";
  return "Low";
}

function primaryRecLabel(
  messages: Awaited<ReturnType<typeof getMessages>>,
  key: PrimaryRecommendation | undefined,
): string | null {
  if (!key) return null;
  return messages.report.primaryRec[key];
}

function nextStepsBlocks(text: string): string[] {
  return text
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);
  const base = new URL(m.siteMeta.url);
  return {
    title: m.report.pageTitle,
    robots: { index: false, follow: false },
    alternates: {
      canonical: `${base.origin}/${locale}/report/${id}`,
    },
  };
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();

  const messages = getMessages(locale);
  const r = messages.report;
  const contactHash = messages.contact.id;

  const rawSchedule = r.scheduleUrl?.trim();
  const scheduleIsExternal = Boolean(
    rawSchedule?.startsWith("http://") || rawSchedule?.startsWith("https://"),
  );

  if (!isFirebaseAdminConfigured()) {
    return (
      <>
        <SiteHeader messages={messages} />
        <main className="mx-auto max-w-3xl flex-1 px-4 py-20 sm:px-6">
          <p className="text-foreground-muted">
            {locale === "es"
              ? "El informe no está disponible: falta la configuración del servidor."
              : "This report is unavailable: server configuration is missing."}
          </p>
        </main>
        <Footer messages={messages} />
      </>
    );
  }

  const loaded = await loadPublicDiagnostic(id);
  if (!loaded) {
    notFound();
  }

  if (loaded.status !== "complete") {
    return (
      <>
        <SiteHeader messages={messages} />
        <main className="mx-auto max-w-3xl flex-1 px-4 py-20 sm:px-6">
          <h1 className="font-display text-2xl font-semibold text-foreground">{r.pageTitle}</h1>
          <p className="mt-4 text-foreground-muted">{r.errorState}</p>
          <Link
            href={`/${locale}#${contactHash}`}
            className="mt-8 inline-flex cursor-pointer rounded-full border border-white/15 px-5 py-2.5 text-sm hover:bg-white/5"
          >
            {r.scheduleButton}
          </Link>
        </main>
        <Footer messages={messages} />
      </>
    );
  }

  const { reportPayload } = loaded;
  const d = reportPayload.diagnosis;
  const cls = reportPayload.classification;
  const oppLevel = cls.opportunity_level;
  const prLabel = primaryRecLabel(messages, cls.primary_recommendation);

  const hasImpactGrid = Boolean(d.impact);
  const hasImpactNarrative = Boolean(d.estimated_impact?.trim());
  const showImpactSection = hasImpactGrid || hasImpactNarrative;
  const nextStepsLines = nextStepsBlocks(d.next_steps);

  const scheduleHref =
    scheduleIsExternal && rawSchedule
      ? buildCalendlyScheduleUrl(rawSchedule, reportPayload.contact, reportPayload.diagnosis, {
          titleFallback: r.pageTitle,
        })
      : `/${locale}#${contactHash}`;

  const ctaProps = {
    scheduleCta15m: r.scheduleCta15m,
    scheduleButton: r.scheduleButton,
    scheduleCta: r.scheduleCta,
    href: scheduleHref,
    external: scheduleIsExternal,
  };

  return (
    <>
      <SiteHeader messages={messages} />
      <main className="flex-1 border-b border-white/10 bg-gradient-to-b from-surface-850/30 to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {d.report_title?.trim() || r.pageTitle}
              </h1>
              <p className="mt-2 text-sm text-foreground-muted">
                {r.clientLinePrefix}{" "}
                {getReportClientDisplayName(reportPayload)}
              </p>
            </div>
            <ReportPdfDownload
              payload={reportPayload}
              messages={messages}
              scheduleHref={scheduleHref}
              opportunityLevelLabel={opportunityLabel(locale, oppLevel)}
            />
          </div>

          <div className="mt-10 xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] xl:items-stretch xl:gap-12">
            <div className="min-w-0">
              <div className="rounded-2xl border border-white/10 bg-surface-card/40 p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-aurora-blue">{r.opportunityBadge}</span>
                  <span className="text-sm font-medium text-foreground">
                    {opportunityLabel(locale, oppLevel)}
                  </span>
                </div>
                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-aurora-blue/70 to-aurora-blue"
                    style={{ width: opportunityWidth(oppLevel) }}
                  />
                </div>
                <p className="mt-4 text-lg font-medium leading-relaxed text-foreground md:text-xl">
                  {d.summary}
                </p>
              </div>

              <div id="report-diagnostic-body" className="scroll-mt-28">
                {d.key_insights && d.key_insights.length > 0 ? (
                  <section className="mt-10">
                    <h2 className="font-display text-lg font-semibold text-aurora-blue">{r.insightsTitle}</h2>
                    <ul className="mt-4 max-w-prose list-disc space-y-2 pl-5 text-foreground-muted">
                      {d.key_insights.map((line, i) => (
                        <li key={i} className="leading-relaxed">
                          {line}
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                {showImpactSection ? (
                  <section className="mt-10">
                    <h2 className="font-display text-lg font-semibold text-aurora-blue">{r.impactTitle}</h2>
                    {hasImpactGrid ? (
                      <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-xl border border-white/10 bg-surface-card/30 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-aurora-blue/90">
                            {r.impactTime}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                            {d.impact!.time_savings}
                          </p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-surface-card/30 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-aurora-blue/90">
                            {r.impactOps}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                            {d.impact!.operational_improvement}
                          </p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-surface-card/30 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-aurora-blue/90">
                            {r.impactBusiness}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                            {d.impact!.business_potential}
                          </p>
                        </div>
                      </div>
                    ) : null}
                    {hasImpactNarrative ? (
                      <div className={hasImpactGrid ? "mt-8" : "mt-4"}>
                        {hasImpactGrid ? (
                          <h3 className="font-display text-base font-semibold text-foreground">
                            {r.impactNarrativeSubtitle}
                          </h3>
                        ) : null}
                        <p
                          className={`max-w-prose whitespace-pre-wrap leading-relaxed text-foreground-muted ${hasImpactGrid ? "mt-3" : ""}`}
                        >
                          {d.estimated_impact}
                        </p>
                      </div>
                    ) : null}
                  </section>
                ) : null}

                <div className="mt-10 space-y-10">
                  <ReportAnalysisSection title={r.sections.problem} variant="default">
                    <p className="max-w-prose whitespace-pre-wrap leading-relaxed text-foreground-muted">
                      {d.problem_analysis}
                    </p>
                  </ReportAnalysisSection>

                  <ReportAnalysisSection title={r.sections.opportunity} variant="card">
                    <p className="max-w-prose whitespace-pre-wrap leading-relaxed text-foreground-muted">
                      {d.opportunity}
                    </p>
                  </ReportAnalysisSection>

                  <ReportAnalysisSection title={r.sections.risks} variant="risk">
                    <p className="max-w-prose whitespace-pre-wrap leading-relaxed text-foreground-muted">
                      {d.risks}
                    </p>
                  </ReportAnalysisSection>

                  {prLabel ? (
                    <ReportAnalysisSection title={r.primaryRecLabel} variant="default">
                      <p className="rounded-xl border border-aurora-blue/25 bg-aurora-blue/10 px-4 py-3 text-foreground">
                        {prLabel}
                      </p>
                    </ReportAnalysisSection>
                  ) : null}

                  <ReportAnalysisSection title={r.sections.recommendation} variant="emphasis">
                    <p className="max-w-prose whitespace-pre-wrap leading-relaxed text-foreground-muted">
                      {d.recommendation}
                    </p>
                  </ReportAnalysisSection>

                  <ReportAnalysisSection title={r.sections.nextSteps} variant="next">
                    {nextStepsLines.length > 1 ? (
                      <ul className="max-w-prose list-disc space-y-2 pl-5 text-foreground-muted">
                        {nextStepsLines.map((line, i) => (
                          <li key={i} className="leading-relaxed">
                            {line}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="max-w-prose whitespace-pre-wrap leading-relaxed text-foreground-muted">
                        {nextStepsLines[0] ?? d.next_steps}
                      </p>
                    )}
                  </ReportAnalysisSection>
                </div>
              </div>

              <div className="mt-12 xl:hidden">
                <ReportScheduleCtaCard {...ctaProps} />
              </div>
            </div>

            <aside className="hidden min-h-0 xl:block xl:self-stretch">
              <div className="sticky top-28">
                <ReportScheduleCtaCard {...ctaProps} />
              </div>
            </aside>
          </div>
        </div>
        <ReportScrollHint targetId="report-diagnostic-body" ariaLabel={r.reportScrollHintAria} />
      </main>
      <Footer messages={messages} />
    </>
  );
}
