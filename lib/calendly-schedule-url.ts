import type { DiagnosisResult, ProfilerContact } from "@/lib/diagnostics/types";

const DEFAULT_CONTEXT_MAX_LENGTH = 1000;

export type BuildCalendlyScheduleUrlOptions = {
  /** First custom invitee question in Calendly is `a1`; override if your event uses another slot. */
  contextParam?: string;
  contextMaxLength?: number;
  /** Used when `diagnosis.report_title` is empty. */
  titleFallback?: string;
};

/**
 * Appends Calendly-supported query params for prefill: `name`, `email`, and custom answers (`a1`, …).
 * Base URL must be the event type link without existing prefill query (fragment is dropped).
 */
export function buildCalendlyScheduleUrl(
  baseUrl: string,
  contact: Pick<ProfilerContact, "name" | "email">,
  diagnosis: Pick<DiagnosisResult, "report_title" | "summary">,
  options?: BuildCalendlyScheduleUrlOptions,
): string {
  const trimmed = baseUrl.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return trimmed;
  }

  let url: URL;
  try {
    url = new URL(trimmed);
    url.hash = "";
  } catch {
    return trimmed;
  }

  const name = contact.name?.trim() ?? "";
  if (name) url.searchParams.set("name", name);

  const email = contact.email?.trim() ?? "";
  if (email) url.searchParams.set("email", email);

  const title =
    diagnosis.report_title?.trim() ||
    options?.titleFallback?.trim() ||
    "Aurora diagnostic";
  const summary = diagnosis.summary?.trim() ?? "";
  const body = `${title}\n\n${summary}`;
  const maxLen = options?.contextMaxLength ?? DEFAULT_CONTEXT_MAX_LENGTH;
  const truncated =
    body.length > maxLen ? `${body.slice(0, Math.max(0, maxLen - 1))}…` : body;

  const param =
    options?.contextParam?.trim() ||
    (typeof process !== "undefined" &&
      process.env.NEXT_PUBLIC_CALENDLY_CONTEXT_PARAM?.trim()) ||
    "a1";
  if (truncated) url.searchParams.set(param, truncated);

  return url.toString();
}
