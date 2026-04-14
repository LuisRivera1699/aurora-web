/**
 * Calendly "Pass event details" redirect: `event_start_time` / `event_end_time` (ISO 8601, invitee TZ).
 * @see https://calendly.com/help/how-to-redirect-invitees-to-another-site-after-booking
 */

export function parseCalendlyEventTime(iso: string | undefined): Date | null {
  if (!iso?.trim()) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Human-readable line for the thank-you page; null if no valid start time. */
export function formatCalendlyMeetingDisplay(
  locale: "es" | "en",
  start: Date,
  end: Date | null,
): string {
  const loc = locale === "es" ? "es" : "en";

  if (!end || start.getTime() === end.getTime()) {
    return new Intl.DateTimeFormat(loc, {
      dateStyle: "full",
      timeStyle: "short",
    }).format(start);
  }

  const sameCalendarDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  if (sameCalendarDay) {
    const datePart = new Intl.DateTimeFormat(loc, { dateStyle: "full" }).format(start);
    const t1 = new Intl.DateTimeFormat(loc, { timeStyle: "short" }).format(start);
    const t2 = new Intl.DateTimeFormat(loc, { timeStyle: "short" }).format(end);
    return `${datePart} · ${t1} – ${t2}`;
  }

  const full = new Intl.DateTimeFormat(loc, { dateStyle: "full", timeStyle: "short" });
  return `${full.format(start)} – ${full.format(end)}`;
}
