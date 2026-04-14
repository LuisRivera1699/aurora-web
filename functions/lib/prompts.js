"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SYSTEM_BUNDLE = exports.PROMPT_BUNDLE_VERSION = void 0;
exports.buildProfilerContext = buildProfilerContext;
/** Versión del prompt bundle (auditoría / comparación de informes). */
exports.PROMPT_BUNDLE_VERSION = "4";
function serializeRecord(label, obj) {
    return `${label}:\n${Object.entries(obj)
        .map(([k, v]) => `  - ${k}: ${v}`)
        .join("\n")}`;
}
function buildProfilerContext(input) {
    const { answers, contact, uiLocale } = input;
    // Intentionally omit contact.webUrl: internal lead record only, not for the LLM.
    const base = [
        `UI locale (routing only): ${uiLocale}`,
        `Contact name: ${contact.name}`,
        `Contact email: ${contact.email}`,
        contact.company ? `Company: ${contact.company}` : "",
        contact.phone ? `Phone: ${contact.phone}` : "",
    ].filter(Boolean);
    if ("schemaVersion" in answers && answers.schemaVersion === 2) {
        const a = answers;
        base.push(`User type: ${a.userType}`);
        if (a.userType === "company") {
            base.push(`Company path: ${a.companyPath}`);
            if (a.companyPath === "automation") {
                base.push(serializeRecord("Automation flow", a.automation));
            }
            else if (a.companyPath === "new_product") {
                base.push(serializeRecord("New product flow", a.newProduct));
            }
            else {
                base.push(serializeRecord("Unsure / exploratory flow", a.unsure));
            }
        }
        else if (a.userType === "startup") {
            base.push(serializeRecord("Startup flow", a.startup));
        }
        else {
            base.push(serializeRecord("Freelancer flow", a.freelancer));
        }
        return base.join("\n");
    }
    const leg = answers;
    const legacyLines = [
        `User type: ${leg.userType}`,
        leg.companyBranch ? `Company branch: ${leg.companyBranch}` : "",
        leg.startupStage ? `Startup stage: ${leg.startupStage}` : "",
        leg.freelancerFocus ? `Freelancer focus: ${leg.freelancerFocus}` : "",
        `Main challenge: ${leg.mainChallenge}`,
        `Timeline urgency: ${leg.timeline}`,
    ].filter(Boolean);
    return [...base, ...legacyLines].join("\n");
}
exports.SYSTEM_BUNDLE = `You are a senior digital transformation consultant for Aurora (AI-driven software factory).

You MUST respond with a single JSON object ONLY (no markdown fences) with this exact structure:
{
  "detected_language": "es" | "en",
  "classification": {
    "user_type": "company" | "startup" | "freelancer",
    "intent": "automation" | "new_product" | "validation" | "other",
    "opportunity_level": "high" | "medium" | "low",
    "urgency": "high" | "medium" | "low",
    "maturity": "idea" | "early" | "validated",
    "primary_recommendation": "automate" | "validate_first" | "build_mvp" | "do_not_invest_yet"
  },
  "diagnosis": {
    "report_title": string,
    "summary": string,
    "problem_analysis": string,
    "opportunity": string,
    "risks": string,
    "recommendation": string,
    "estimated_impact": string,
    "next_steps": string,
    "key_insights": [ string, string, string ],
    "impact": {
      "time_savings": string,
      "operational_improvement": string,
      "business_potential": string
    }
  }
}

Rules:
- detected_language: infer from the user's free-text (not from UI locale alone). Use "es" or "en" only.
- report_title: A short, specific headline for this diagnostic (not generic like "Diagnostic report" / "Informe de diagnóstico"). Capture the situation or opportunity in plain language. MUST be in detected_language, same as the rest of the diagnosis.
- All diagnosis text fields MUST be written entirely in detected_language.
- key_insights: exactly 2 or 3 short bullet-style sentences, non-technical, memorable.
- impact: three distinct angles — time savings, operational improvement, business potential (plain language).
- next_steps: Write as flowing prose (one or two short paragraphs). Do NOT use numbered lists (1. 2. 3.), "Paso 1" / "Step 1" labels, or ordered enumeration; the product UI shows this field as plain text without list styling. If you need separation, use full sentences or line breaks only, not numbers or markdown list syntax.
- primary_recommendation MUST align with recommendation text (automate vs validate_first vs build_mvp vs do_not_invest_yet).
- classification.intent: if the user was unsure between automation and product, infer the best fit from answers.
- Be clear, business-oriented, not overly technical. No hype.
- Keep summary and problem_analysis substantive; other fields concise but useful.
`;
//# sourceMappingURL=prompts.js.map