"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendDiagnosticEmail = sendDiagnosticEmail;
exports.sendContactThankYouEmail = sendContactThankYouEmail;
const resend_1 = require("resend");
async function sendDiagnosticEmail(opts) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
        console.warn("RESEND_API_KEY missing; skipping email");
        return;
    }
    const resend = new resend_1.Resend(key);
    const from = process.env.RESEND_FROM ?? "contacto@teamaurora.pe";
    const siteUrl = (process.env.SITE_URL ?? "https://www.teamaurora.pe").replace(/\/$/, "");
    /** Horizontal wordmark (~5:1); do not force square dimensions in HTML. */
    const logoUrl = process.env.EMAIL_LOGO_URL ?? `${siteUrl}/brand_assets/LOGO_WHITE.svg`;
    const diagnosticMeetingUrl = process.env.DIAGNOSTIC_MEETING_URL ??
        "https://cal.com/aurora-software-factory/15min-diagnostic";
    const titleForSubject = opts.reportTitle?.trim();
    const subject = opts.language === "es"
        ? titleForSubject
            ? `${truncatePlain(titleForSubject, 52)} — Informe Aurora`
            : "Tu informe Aurora: ideas clave, riesgos y próximos pasos"
        : titleForSubject
            ? `${truncatePlain(titleForSubject, 52)} — Aurora report`
            : "Your Aurora report: key insights, risks, and next steps";
    const oppLabelEs = opts.opportunityLevel === "high"
        ? "Alta"
        : opts.opportunityLevel === "medium"
            ? "Media"
            : opts.opportunityLevel === "low"
                ? "Baja"
                : "";
    const oppLabelEn = opts.opportunityLevel === "high"
        ? "High"
        : opts.opportunityLevel === "medium"
            ? "Medium"
            : opts.opportunityLevel === "low"
                ? "Low"
                : "";
    const summaryHtml = formatPreviewBlock(opts.summaryPreview, 200);
    const insights = (opts.keyInsightLines ?? [])
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 2)
        .map((s) => escapeHtml(truncatePlain(s, 200)));
    const primaryLineEs = opts.primaryRecommendation != null
        ? primaryRecommendationLabel(opts.primaryRecommendation, "es")
        : "";
    const primaryLineEn = opts.primaryRecommendation != null
        ? primaryRecommendationLabel(opts.primaryRecommendation, "en")
        : "";
    const recTeaserHtml = opts.recommendationTeaser?.trim()
        ? escapeHtml(truncatePlain(opts.recommendationTeaser.trim(), 220))
        : "";
    const safeReportUrl = escapeHtml(opts.reportUrl);
    const plainUrlForEmail = opts.reportUrl;
    const htmlEs = buildBrandedHtml({
        lang: "es",
        preheader: "En el informe: nivel de oportunidad, ideas clave, riesgos, recomendación y próximos pasos.",
        headline: opts.reportTitle?.trim() ||
            "Tu informe ya está listo: contexto, riesgos y qué hacer después",
        greeting: `Hola ${escapeHtml(opts.name)},`,
        intro: "Ya preparamos tu diagnóstico en base a lo que nos compartiste. No reemplaza una reunión, pero te da una visión clara de por dónde empezar y qué evitar.",
        opportunityBadge: oppLabelEs ? `Nivel de oportunidad: ${oppLabelEs}` : "",
        primarySectionTitle: "Enfoque sugerido",
        primaryLine: primaryLineEs,
        whatsInsideTitle: "Dentro del informe",
        insightItems: insights,
        execSummaryTitle: "Resumen ejecutivo",
        summaryHtml,
        recTeaserTitle: "Recomendación principal",
        recTeaserHtml,
        nextStepTitle: "Siguiente paso",
        nextStepIntro: "Si quieres llevar esto a algo real, te recomiendo agendar una llamada con nosotros.",
        nextStepItems: [
            "Bajamos el diagnóstico a tu caso específico",
            "Te damos un plan más concreto",
            "Definimos cómo implementarlo correctamente",
        ],
        meetingCtaIntro: "Puedes agendar aquí directamente:",
        meetingCta: "Agendar llamada de diagnóstico",
        meetingUrl: escapeHtml(diagnosticMeetingUrl),
        plainMeetingUrl: escapeHtml(diagnosticMeetingUrl),
        reportIntro: "También puedes revisar el informe completo aquí:",
        cta: "Abrir informe completo",
        fallbackLinkLabel: "Si el botón no funciona, copia y pega este enlace:",
        reportUrl: safeReportUrl,
        plainReportUrl: escapeHtml(plainUrlForEmail),
        replyLine: "Si tienes dudas puntuales, responde este correo y lo vemos contigo.",
        signature: "Quedo atento,<br/>Luis Rivera<br/>Aurora Managing Director",
        logoUrl: escapeHtml(logoUrl),
        footer: buildFooter(siteUrl),
    });
    const htmlEn = buildBrandedHtml({
        lang: "en",
        preheader: "In the report: opportunity level, key insights, risks, recommendation, and next steps.",
        headline: opts.reportTitle?.trim() ||
            "Your report is ready: context, risks, and what to do next",
        greeting: `Hi ${escapeHtml(opts.name)},`,
        intro: "We prepared your diagnostic based on what you shared. It does not replace a meeting, but it gives you a clear view of where to start and what to avoid.",
        opportunityBadge: oppLabelEn ? `Opportunity level: ${oppLabelEn}` : "",
        primarySectionTitle: "Suggested focus",
        primaryLine: primaryLineEn,
        whatsInsideTitle: "What’s inside",
        insightItems: insights,
        execSummaryTitle: "Executive summary",
        summaryHtml,
        recTeaserTitle: "Main recommendation",
        recTeaserHtml,
        nextStepTitle: "Next step",
        nextStepIntro: "If you want to turn this into something real, I recommend booking a call with us.",
        nextStepItems: [
            "We adapt the diagnostic to your specific case",
            "We give you a more concrete plan",
            "We define how to implement it correctly",
        ],
        meetingCtaIntro: "You can book directly here:",
        meetingCta: "Book diagnostic call",
        meetingUrl: escapeHtml(diagnosticMeetingUrl),
        plainMeetingUrl: escapeHtml(diagnosticMeetingUrl),
        reportIntro: "You can also review the full report here:",
        cta: "Open full report",
        fallbackLinkLabel: "If the button does not work, copy and paste this link:",
        reportUrl: safeReportUrl,
        plainReportUrl: escapeHtml(plainUrlForEmail),
        replyLine: "If you have specific questions, reply to this email and we will review them with you.",
        signature: "Best,<br/>Luis Rivera<br/>Aurora Managing Director",
        logoUrl: escapeHtml(logoUrl),
        footer: buildFooter(siteUrl),
    });
    await resend.emails.send({
        from,
        to: opts.to,
        subject,
        html: opts.language === "es" ? htmlEs : htmlEn,
    });
}
async function sendContactThankYouEmail(opts) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
        console.warn("RESEND_API_KEY missing; skipping email");
        return;
    }
    const resend = new resend_1.Resend(key);
    const from = process.env.RESEND_FROM ?? "contacto@teamaurora.pe";
    const siteUrl = (process.env.SITE_URL ?? "https://www.teamaurora.pe").replace(/\/$/, "");
    const logoUrl = process.env.EMAIL_LOGO_URL ?? `${siteUrl}/brand_assets/LOGO_WHITE.svg`;
    const meetingUrl = process.env.CONTACT_MEETING_URL ??
        "https://cal.com/aurora-software-factory/15min-contact";
    const subject = opts.language === "es"
        ? "Recibimos tu solicitud — siguiente paso"
        : "We received your request — next step";
    await resend.emails.send({
        from,
        to: opts.to,
        subject,
        html: opts.language === "es"
            ? buildContactThankYouHtml({
                lang: "es",
                preheader: "Gracias por escribirnos. Agenda una llamada corta para avanzar rápido.",
                headline: "Recibimos tu solicitud",
                greeting: `Hola ${escapeHtml(opts.name)},`,
                intro: "Gracias por escribirnos 🙌 Ya tenemos tu solicitud y hay varias formas en las que podríamos ayudarte según lo que comentas.",
                leadIn: "Para avanzar rápido, lo mejor es agendar una llamada corta donde:",
                bulletItems: [
                    "Entendemos bien tu caso",
                    "Te damos recomendaciones concretas",
                    "Vemos si tiene sentido trabajar juntos",
                ],
                ctaIntro: "Puedes elegir el horario que mejor te funcione aquí:",
                cta: "Agendar llamada corta",
                meetingUrl: escapeHtml(meetingUrl),
                plainMeetingUrl: escapeHtml(meetingUrl),
                fallbackLinkLabel: "Si el botón no funciona, copia y pega este enlace en el navegador:",
                afterCta: "La llamada es directa, sin compromiso, y sales con más claridad sobre qué hacer.",
                replyLine: "Si prefieres, también puedes responder este correo con más contexto y lo revisamos antes de la reunión.",
                signature: "Quedo atento,<br/>Luis Rivera<br/>Aurora Managing Director",
                logoUrl: escapeHtml(logoUrl),
                footer: buildFooter(siteUrl),
            })
            : buildContactThankYouHtml({
                lang: "en",
                preheader: "Thanks for reaching out. Book a short call so we can move quickly.",
                headline: "We received your request",
                greeting: `Hi ${escapeHtml(opts.name)},`,
                intro: "Thanks for reaching out 🙌 We have your request, and there are several ways we could help depending on what you shared.",
                leadIn: "To move quickly, the best next step is to book a short call where:",
                bulletItems: [
                    "We understand your case clearly",
                    "We give you concrete recommendations",
                    "We see whether it makes sense to work together",
                ],
                ctaIntro: "You can choose the time that works best for you here:",
                cta: "Book a short call",
                meetingUrl: escapeHtml(meetingUrl),
                plainMeetingUrl: escapeHtml(meetingUrl),
                fallbackLinkLabel: "If the button does not work, copy and paste this link into your browser:",
                afterCta: "The call is direct, there is no commitment, and you leave with more clarity on what to do.",
                replyLine: "If you prefer, you can also reply to this email with more context and we will review it before the meeting.",
                signature: "Best,<br/>Luis Rivera<br/>Aurora Managing Director",
                logoUrl: escapeHtml(logoUrl),
                footer: buildFooter(siteUrl),
            }),
    });
}
function truncatePlain(s, max) {
    const t = s.trim();
    if (t.length <= max)
        return t;
    return `${t.slice(0, max).trim()}…`;
}
function buildFooter(siteUrl) {
    return `© Aurora · <a href="${escapeHtml(siteUrl)}" style="color:#7a8a99;text-decoration:none;">${escapeHtml(siteUrl.replace(/^https?:\/\//, ""))}</a>`;
}
function primaryRecommendationLabel(key, lang) {
    const es = {
        automate: "Priorizar automatización y alivio operativo donde el retorno sea claro.",
        validate_first: "Validar supuestos antes de invertir fuerte en construcción.",
        build_mvp: "Avanzar con un MVP acotado para aprender rápido con usuarios reales.",
        do_not_invest_yet: "Aclarar alcance y riesgos antes de comprometer inversión relevante.",
    };
    const en = {
        automate: "Prioritize automation and operational relief where payoff is clear.",
        validate_first: "Validate assumptions before heavy build or spend.",
        build_mvp: "Move forward with a scoped MVP to learn quickly with real users.",
        do_not_invest_yet: "Clarify scope and risk before committing significant investment.",
    };
    return lang === "es" ? es[key] : en[key];
}
function formatPreviewBlock(text, max) {
    if (!text?.trim())
        return "";
    const raw = text.trim();
    const truncated = raw.length > max;
    const t = truncated ? `${raw.slice(0, max).trim()}…` : raw;
    return escapeHtml(t);
}
function buildBrandedHtml(p) {
    const preheaderRow = `<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${escapeHtml(p.preheader)}</div>`;
    const nextStepItems = p.nextStepItems
        .map((item) => `<li style="margin:0 0 8px 0;">${escapeHtml(item)}</li>`)
        .join("");
    const badgeRow = p.opportunityBadge
        ? `<tr><td style="padding:0 28px 12px 28px;font-size:13px;color:#006ea0;font-weight:600;border-left:3px solid #006ea0;padding-left:25px;">${escapeHtml(p.opportunityBadge)}</td></tr>`
        : "";
    const primaryRow = p.primaryLine.trim().length > 0
        ? `<tr><td style="padding:0 28px 16px 28px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(0,110,160,0.08);border-radius:12px;border:1px solid rgba(0,110,160,0.25);">
<tr><td style="padding:14px 16px;font-size:12px;font-weight:600;color:#7dd3fc;text-transform:uppercase;letter-spacing:0.04em;">${escapeHtml(p.primarySectionTitle)}</td></tr>
<tr><td style="padding:0 16px 16px 16px;font-size:14px;line-height:1.55;color:#c5d0dc;">${escapeHtml(p.primaryLine)}</td></tr>
</table>
</td></tr>`
        : "";
    const insightsRow = p.insightItems.length > 0
        ? `<tr><td style="padding:0 28px 16px 28px;">
<p style="margin:0 0 10px 0;font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.04em;">${escapeHtml(p.whatsInsideTitle)}</p>
<ul style="margin:0;padding:0 0 0 20px;color:#a8b4c0;font-size:14px;line-height:1.55;">
${p.insightItems.map((item) => `<li style="margin:0 0 8px 0;">${item}</li>`).join("")}
</ul>
</td></tr>`
        : "";
    const summaryBlock = p.summaryHtml
        ? `<tr><td style="padding:0 28px 16px 28px;">
<p style="margin:0 0 8px 0;font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.04em;">${escapeHtml(p.execSummaryTitle)}</p>
<div style="font-size:14px;line-height:1.55;color:#cbd5e1;border-left:3px solid #006ea0;padding-left:14px;">${p.summaryHtml}</div>
</td></tr>`
        : "";
    const recBlock = p.recTeaserHtml
        ? `<tr><td style="padding:0 28px 18px 28px;">
<p style="margin:0 0 8px 0;font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.04em;">${escapeHtml(p.recTeaserTitle)}</p>
<div style="font-size:14px;line-height:1.55;color:#a8b4c0;font-style:italic;">${p.recTeaserHtml}</div>
</td></tr>`
        : "";
    const nextStepRow = `<tr><td style="padding:6px 28px 22px 28px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(125,211,252,0.07);border-radius:14px;border:1px solid rgba(125,211,252,0.18);">
<tr><td style="padding:18px 18px 8px 18px;font-size:18px;font-weight:700;color:#f0f4f8;line-height:1.35;">${escapeHtml(p.nextStepTitle)}</td></tr>
<tr><td style="padding:0 18px 12px 18px;font-size:14px;line-height:1.65;color:#c5d0dc;">${escapeHtml(p.nextStepIntro)}</td></tr>
<tr><td style="padding:0 18px 14px 18px;">
<ul style="margin:0;padding:0 0 0 20px;color:#a8b4c0;font-size:14px;line-height:1.55;">
${nextStepItems}
</ul>
</td></tr>
<tr><td style="padding:0 18px 12px 18px;font-size:14px;line-height:1.6;color:#c5d0dc;">${escapeHtml(p.meetingCtaIntro)}</td></tr>
<tr><td style="padding:0 18px 18px 18px;">
<a href="${p.meetingUrl}" style="display:inline-block;background:#006ea0;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:13px 24px;border-radius:999px;">${escapeHtml(p.meetingCta)}</a>
</td></tr>
<tr><td style="padding:0 18px 18px 18px;font-size:12px;line-height:1.5;color:#7a8a99;word-break:break-all;">
<span style="color:#94a3b8;">${p.plainMeetingUrl}</span>
</td></tr>
</table>
</td></tr>`;
    const fallbackRow = `<tr><td style="padding:0 28px 24px 28px;font-size:12px;line-height:1.5;color:#7a8a99;word-break:break-all;">
${escapeHtml(p.fallbackLinkLabel)}<br/>
<span style="color:#94a3b8;">${p.plainReportUrl}</span>
</td></tr>`;
    return `<!DOCTYPE html>
<html lang="${p.lang}">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/></head>
<body style="margin:0;background:#0f1419;font-family:Segoe UI,system-ui,sans-serif;">
${preheaderRow}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f1419;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#151b24;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
<tr><td style="padding:28px 28px 8px 28px;">
<img src="${p.logoUrl}" alt="Aurora" width="200" height="40" style="display:block;width:200px;max-width:100%;height:auto;border:0;outline:none;"/>
</td></tr>
<tr><td style="padding:8px 28px 8px 28px;font-size:21px;font-weight:700;color:#f0f4f8;line-height:1.3;">${escapeHtml(p.headline)}</td></tr>
<tr><td style="padding:0 28px 16px 28px;font-size:15px;line-height:1.55;color:#a8b4c0;">${p.greeting}</td></tr>
<tr><td style="padding:0 28px 18px 28px;font-size:15px;line-height:1.65;color:#c5d0dc;">${escapeHtml(p.intro)}</td></tr>
${badgeRow}
${primaryRow}
${insightsRow}
${summaryBlock}
${recBlock}
${nextStepRow}
<tr><td style="padding:2px 28px 12px 28px;font-size:15px;line-height:1.65;color:#c5d0dc;">${escapeHtml(p.reportIntro)}</td></tr>
<tr><td style="padding:0 28px 24px 28px;">
<a href="${p.reportUrl}" style="display:inline-block;background:#006ea0;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 28px;border-radius:999px;">${escapeHtml(p.cta)}</a>
</td></tr>
${fallbackRow}
<tr><td style="padding:0 28px 18px 28px;font-size:15px;line-height:1.65;color:#c5d0dc;">${escapeHtml(p.replyLine)}</td></tr>
<tr><td style="padding:0 28px 28px 28px;font-size:15px;line-height:1.65;color:#c5d0dc;">${p.signature}</td></tr>
<tr><td style="padding:0 28px 28px 28px;font-size:13px;line-height:1.5;color:#7a8a99;">${p.footer}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}
function buildContactThankYouHtml(p) {
    const preheaderRow = `<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${escapeHtml(p.preheader)}</div>`;
    const bulletItems = p.bulletItems
        .map((item) => `<li style="margin:0 0 8px 0;">${escapeHtml(item)}</li>`)
        .join("");
    return `<!DOCTYPE html>
<html lang="${p.lang}">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/></head>
<body style="margin:0;background:#0f1419;font-family:Segoe UI,system-ui,sans-serif;">
${preheaderRow}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f1419;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#151b24;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
<tr><td style="padding:28px 28px 8px 28px;">
<img src="${p.logoUrl}" alt="Aurora" width="200" height="40" style="display:block;width:200px;max-width:100%;height:auto;border:0;outline:none;"/>
</td></tr>
<tr><td style="padding:8px 28px 8px 28px;font-size:21px;font-weight:700;color:#f0f4f8;line-height:1.3;">${escapeHtml(p.headline)}</td></tr>
<tr><td style="padding:0 28px 16px 28px;font-size:15px;line-height:1.55;color:#a8b4c0;">${p.greeting}</td></tr>
<tr><td style="padding:0 28px 16px 28px;font-size:15px;line-height:1.65;color:#c5d0dc;">${escapeHtml(p.intro)}</td></tr>
<tr><td style="padding:0 28px 10px 28px;font-size:15px;line-height:1.65;color:#c5d0dc;">${escapeHtml(p.leadIn)}</td></tr>
<tr><td style="padding:0 28px 18px 28px;">
<ul style="margin:0;padding:0 0 0 20px;color:#a8b4c0;font-size:14px;line-height:1.55;">
${bulletItems}
</ul>
</td></tr>
<tr><td style="padding:0 28px 12px 28px;font-size:15px;line-height:1.65;color:#c5d0dc;">${escapeHtml(p.ctaIntro)}</td></tr>
<tr><td style="padding:0 28px 24px 28px;">
<a href="${p.meetingUrl}" style="display:inline-block;background:#006ea0;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 28px;border-radius:999px;">${escapeHtml(p.cta)}</a>
</td></tr>
<tr><td style="padding:0 28px 22px 28px;font-size:12px;line-height:1.5;color:#7a8a99;word-break:break-all;">
${escapeHtml(p.fallbackLinkLabel)}<br/>
<span style="color:#94a3b8;">${p.plainMeetingUrl}</span>
</td></tr>
<tr><td style="padding:0 28px 16px 28px;font-size:15px;line-height:1.65;color:#c5d0dc;">${escapeHtml(p.afterCta)}</td></tr>
<tr><td style="padding:0 28px 18px 28px;font-size:15px;line-height:1.65;color:#c5d0dc;">${escapeHtml(p.replyLine)}</td></tr>
<tr><td style="padding:0 28px 28px 28px;font-size:15px;line-height:1.65;color:#c5d0dc;">${p.signature}</td></tr>
<tr><td style="padding:0 28px 28px 28px;font-size:13px;line-height:1.5;color:#7a8a99;">${p.footer}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}
function escapeHtml(s) {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
//# sourceMappingURL=resend.js.map