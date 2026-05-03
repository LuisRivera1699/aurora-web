import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { setGlobalOptions } from "firebase-functions/v2";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { invokeClaudeJson, extractJsonObject } from "./bedrock.js";
import { PROMPT_BUNDLE_VERSION, SYSTEM_BUNDLE, buildProfilerContext } from "./prompts.js";
import {
  profilerInputSchema,
  aiBundleSchema,
  type ProfilerInput,
} from "./schemas.js";
import { computeScores } from "./scores.js";
import { sendDiagnosticEmail, type EmailPrimaryRecommendation } from "./resend.js";

setGlobalOptions({ region: "us-central1", maxInstances: 20 });

if (!getApps().length) {
  initializeApp();
}

const COLLECTION = process.env.DIAGNOSTICS_COLLECTION ?? "diagnostics";

/** Callable público (sin login): captura de leads; endurecer con App Check en producción si aplica. */
export const processProfilerAnswers = onCall(
  { cors: true, timeoutSeconds: 120, memory: "512MiB" },
  async (request) => {
    return runProfiler(request.data);
  },
);

async function runProfiler(raw: unknown): Promise<{ reportId: string }> {
  const parsed = profilerInputSchema.safeParse(raw);
  if (!parsed.success) {
    logger.warn("Invalid profiler payload", { issues: parsed.error.issues.length });
    throw new HttpsError("invalid-argument", "Invalid payload");
  }
  const input: ProfilerInput = parsed.data;

  const userMessage = `Context:\n${buildProfilerContext(input)}\n\nProduce the JSON response as specified.`;

  let bundle: ReturnType<typeof aiBundleSchema.parse>;
  try {
    const text = await invokeClaudeJson(SYSTEM_BUNDLE, userMessage);
    const json = extractJsonObject(text);
    bundle = aiBundleSchema.parse(json);
  } catch (e) {
    logger.error("Bedrock / parse failed", { err: e instanceof Error ? e.message : String(e) });
    await writeErrorDoc(input, e);
    throw new HttpsError("internal", "Diagnostic generation failed");
  }

  const scores = computeScores(bundle.classification);
  const reportPayload = {
    schemaVersion: 2 as const,
    classification: bundle.classification,
    diagnosis: bundle.diagnosis,
    scores,
    detectedLanguage: bundle.detected_language,
    contact: input.contact,
    answers: input.answers,
  };

  const db = getFirestore();
  const docRef = db.collection(COLLECTION).doc();
  const now = FieldValue.serverTimestamp();

  await docRef.set({
    promptVersion: PROMPT_BUNDLE_VERSION,
    name: input.contact.name,
    email: input.contact.email,
    company: input.contact.company ?? "",
    phone: input.contact.phone ?? "",
    webUrl: input.contact.webUrl ?? "",
    answers: input.answers,
    uiLocale: input.uiLocale,
    detectedLanguage: bundle.detected_language,
    classification: bundle.classification,
    diagnosis: bundle.diagnosis,
    reportPayload,
    scores,
    status: "complete",
    userAgent: input.userAgent ?? "",
    emailSent: false,
    createdAt: now,
    updatedAt: now,
  });

  const reportId = docRef.id;
  const siteUrl = (process.env.SITE_URL ?? "https://www.teamaurora.pe").replace(/\/$/, "");
  const pathLocale = bundle.detected_language;
  const reportUrl = `${siteUrl}/${pathLocale}/report/${encodeURIComponent(reportId)}`;

  try {
    const diagnosis = bundle.diagnosis;
    const cls = bundle.classification;
    const summaryPreview = truncateForEmail(diagnosis.summary, 200);
    const keyInsightLines = (diagnosis.key_insights ?? [])
      .slice(0, 2)
      .map((line) => truncateForEmail(line, 180))
      .filter(Boolean);
    const recommendationTeaser = pickRecommendationTeaser(
      diagnosis.recommendation,
      diagnosis.summary,
      200,
    );
    const reportTitle = diagnosis.report_title?.trim() || undefined;

    await sendDiagnosticEmail({
      to: input.contact.email,
      name: input.contact.name,
      reportUrl,
      language: bundle.detected_language,
      opportunityLevel: cls.opportunity_level,
      summaryPreview,
      reportTitle,
      primaryRecommendation: cls.primary_recommendation as EmailPrimaryRecommendation,
      keyInsightLines,
      recommendationTeaser,
    });
    await docRef.update({
      emailSent: true,
      emailSentAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  } catch (emailErr) {
    logger.error("Resend failed", emailErr);
  }

  return { reportId };
}

function truncateForEmail(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

/** Short teaser for email; omit if redundant with the summary opening. */
function pickRecommendationTeaser(
  recommendation: string,
  summary: string,
  max: number,
): string | undefined {
  const r = recommendation.trim();
  const s = summary.trim();
  if (r.length < 50) return undefined;
  const r60 = r.slice(0, 60).toLowerCase();
  const s60 = s.slice(0, 60).toLowerCase();
  if (r60 === s60) return undefined;
  return truncateForEmail(r, max);
}

async function writeErrorDoc(input: ProfilerInput, err: unknown): Promise<void> {
  try {
    const db = getFirestore();
    await db.collection(COLLECTION).add({
      name: input.contact.name,
      email: input.contact.email,
      webUrl: input.contact.webUrl ?? "",
      answers: input.answers,
      uiLocale: input.uiLocale,
      status: "error",
      errorMessage: err instanceof Error ? err.message : String(err),
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (e) {
    logger.error("Failed to write error doc", e);
  }
}
