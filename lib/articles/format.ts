export function formatArticleDate(d: Date | null, locale: "es" | "en"): string {
  if (!d) return "";
  return new Intl.DateTimeFormat(locale === "es" ? "es" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function formatReadingMinutesLabel(template: string, minutes: number): string {
  return template.replace(/\{minutes\}/g, String(minutes));
}
