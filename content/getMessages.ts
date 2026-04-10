import type { SiteMessages } from "@/content/messages/types";
import { messagesEn } from "@/content/messages/en";
import { messagesEs } from "@/content/messages/es";

export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(s: string): s is Locale {
  return s === "es" || s === "en";
}

export function getMessages(locale: string): SiteMessages {
  return isLocale(locale) ? (locale === "es" ? messagesEs : messagesEn) : messagesEn;
}

/** Accept-Language: prefer Spanish if any tag starts with es; otherwise English. */
export function localeFromAcceptLanguage(header: string | null): Locale {
  if (!header) return "en";
  const parts = header.split(",").map((p) => p.trim().split(";")[0]?.toLowerCase() ?? "");
  for (const p of parts) {
    const base = p.split("-")[0] ?? "";
    if (base === "es") return "es";
  }
  return "en";
}
