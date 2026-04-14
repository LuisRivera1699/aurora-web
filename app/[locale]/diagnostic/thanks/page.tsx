import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { getMessages, isLocale } from "@/content/getMessages";
import {
  formatCalendlyMeetingDisplay,
  parseCalendlyEventTime,
} from "@/lib/format-calendly-redirect-times";

function firstQuery(
  v: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);
  const base = new URL(m.siteMeta.url);
  return {
    title: m.diagnosticThanks.pageTitle,
    robots: { index: false, follow: false },
    alternates: {
      canonical: `${base.origin}/${locale}/diagnostic/thanks`,
    },
  };
}

export default async function DiagnosticThanksPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const sp = await searchParams;
  const startRaw = firstQuery(sp.event_start_time);
  const endRaw = firstQuery(sp.event_end_time);

  const start = parseCalendlyEventTime(startRaw);
  const end = parseCalendlyEventTime(endRaw);
  const meetingLine =
    start !== null ? formatCalendlyMeetingDisplay(locale, start, end) : null;

  const messages = getMessages(locale);
  const t = messages.diagnosticThanks;

  return (
    <>
      <SiteHeader messages={messages} />
      <main className="flex-1 border-b border-white/10 bg-gradient-to-b from-surface-850/40 to-transparent">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t.headline}
          </h1>

          {meetingLine ? (
            <div className="mt-8 rounded-2xl border border-white/10 bg-surface-card/40 p-6">
              <p className="text-sm font-medium text-aurora-blue">{t.meetingIntro}</p>
              <p className="mt-2 text-lg leading-relaxed text-foreground">{meetingLine}</p>
            </div>
          ) : null}

          <p className="mt-8 text-base leading-relaxed text-foreground-muted md:text-lg">
            {t.bodyMeeting}
          </p>
          <p className="mt-6 text-base leading-relaxed text-foreground-muted md:text-lg">
            {t.bodyEmail}
          </p>

          <Link
            href={`/${locale}`}
            className="mt-10 inline-flex rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-foreground hover:bg-white/5"
          >
            {t.homeCta}
          </Link>
        </div>
      </main>
      <Footer messages={messages} />
    </>
  );
}
