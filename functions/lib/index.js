"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.processProfilerAnswers = void 0;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const v2_1 = require("firebase-functions/v2");
const https_1 = require("firebase-functions/v2/https");
const logger = __importStar(require("firebase-functions/logger"));
const bedrock_js_1 = require("./bedrock.js");
const prompts_js_1 = require("./prompts.js");
const schemas_js_1 = require("./schemas.js");
const scores_js_1 = require("./scores.js");
const resend_js_1 = require("./resend.js");
(0, v2_1.setGlobalOptions)({ region: "us-central1", maxInstances: 20 });
if (!(0, app_1.getApps)().length) {
    (0, app_1.initializeApp)();
}
const COLLECTION = process.env.DIAGNOSTICS_COLLECTION ?? "diagnostics";
/** Callable público (sin login): captura de leads; endurecer con App Check en producción si aplica. */
exports.processProfilerAnswers = (0, https_1.onCall)({ cors: true, timeoutSeconds: 120, memory: "512MiB" }, async (request) => {
    return runProfiler(request.data);
});
async function runProfiler(raw) {
    const parsed = schemas_js_1.profilerInputSchema.safeParse(raw);
    if (!parsed.success) {
        logger.warn("Invalid profiler payload", { issues: parsed.error.issues.length });
        throw new https_1.HttpsError("invalid-argument", "Invalid payload");
    }
    const input = parsed.data;
    const userMessage = `Context:\n${(0, prompts_js_1.buildProfilerContext)(input)}\n\nProduce the JSON response as specified.`;
    let bundle;
    try {
        const text = await (0, bedrock_js_1.invokeClaudeJson)(prompts_js_1.SYSTEM_BUNDLE, userMessage);
        const json = (0, bedrock_js_1.extractJsonObject)(text);
        bundle = schemas_js_1.aiBundleSchema.parse(json);
    }
    catch (e) {
        logger.error("Bedrock / parse failed", { err: e instanceof Error ? e.message : String(e) });
        await writeErrorDoc(input, e);
        throw new https_1.HttpsError("internal", "Diagnostic generation failed");
    }
    const scores = (0, scores_js_1.computeScores)(bundle.classification);
    const reportPayload = {
        schemaVersion: 2,
        classification: bundle.classification,
        diagnosis: bundle.diagnosis,
        scores,
        detectedLanguage: bundle.detected_language,
        contact: input.contact,
        answers: input.answers,
    };
    const db = (0, firestore_1.getFirestore)();
    const docRef = db.collection(COLLECTION).doc();
    const now = firestore_1.FieldValue.serverTimestamp();
    await docRef.set({
        promptVersion: prompts_js_1.PROMPT_BUNDLE_VERSION,
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
    const siteUrl = (process.env.SITE_URL ?? "https://aurora.example.com").replace(/\/$/, "");
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
        const recommendationTeaser = pickRecommendationTeaser(diagnosis.recommendation, diagnosis.summary, 200);
        const reportTitle = diagnosis.report_title?.trim() || undefined;
        await (0, resend_js_1.sendDiagnosticEmail)({
            to: input.contact.email,
            name: input.contact.name,
            reportUrl,
            language: bundle.detected_language,
            opportunityLevel: cls.opportunity_level,
            summaryPreview,
            reportTitle,
            primaryRecommendation: cls.primary_recommendation,
            keyInsightLines,
            recommendationTeaser,
        });
        await docRef.update({
            emailSent: true,
            emailSentAt: firestore_1.FieldValue.serverTimestamp(),
            updatedAt: firestore_1.FieldValue.serverTimestamp(),
        });
    }
    catch (emailErr) {
        logger.error("Resend failed", emailErr);
    }
    return { reportId };
}
function truncateForEmail(text, max) {
    const t = text.trim();
    if (t.length <= max)
        return t;
    return `${t.slice(0, max).trim()}…`;
}
/** Short teaser for email; omit if redundant with the summary opening. */
function pickRecommendationTeaser(recommendation, summary, max) {
    const r = recommendation.trim();
    const s = summary.trim();
    if (r.length < 50)
        return undefined;
    const r60 = r.slice(0, 60).toLowerCase();
    const s60 = s.slice(0, 60).toLowerCase();
    if (r60 === s60)
        return undefined;
    return truncateForEmail(r, max);
}
async function writeErrorDoc(input, err) {
    try {
        const db = (0, firestore_1.getFirestore)();
        await db.collection(COLLECTION).add({
            name: input.contact.name,
            email: input.contact.email,
            webUrl: input.contact.webUrl ?? "",
            answers: input.answers,
            uiLocale: input.uiLocale,
            status: "error",
            errorMessage: err instanceof Error ? err.message : String(err),
            createdAt: firestore_1.FieldValue.serverTimestamp(),
        });
    }
    catch (e) {
        logger.error("Failed to write error doc", e);
    }
}
//# sourceMappingURL=index.js.map