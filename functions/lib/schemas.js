"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiBundleSchema = exports.diagnosisSchema = exports.classificationSchema = exports.primaryRecommendationSchema = exports.contactLeadInputSchema = exports.profilerInputSchema = exports.profilerAnswersSchema = exports.profilerAnswersLegacySchema = exports.profilerAnswersV2Schema = void 0;
const zod_1 = require("zod");
const urgency = zod_1.z.enum(["high", "medium", "low"]);
const text = (min) => zod_1.z.string().min(min).max(4000);
const companyAutomationFields = zod_1.z.object({
    area_to_improve: text(1),
    current_process_how: text(1),
    main_problem: text(1),
    people_involved: text(1),
    time_spent: text(1),
    urgency_level: urgency,
    previous_solution_attempts: text(1),
});
const companyNewProductFields = zod_1.z.object({
    product_type: text(1),
    problem_solved: text(1),
    target_audience: text(1),
    existing_validation: text(1),
    competition: text(1),
    current_stage: text(1),
    what_needs_now: text(1),
});
const companyUnsureFields = zod_1.z.object({
    problem_summary: text(1),
    context: text(1),
    urgency_feeling: text(1),
    current_tools_or_support: text(1),
    desired_outcome: text(1),
});
const startupFields = zod_1.z.object({
    idea_one_liner: text(1),
    validation: text(1),
    users_or_clients: text(1),
    problem_solved: text(1),
    competition: text(1),
    stage: text(1),
    current_need: text(1),
});
const freelancerFields = zod_1.z.object({
    activity: text(1),
    most_repetitive_task: text(1),
    current_tools: text(1),
    what_to_automate: text(1),
    time_spent: text(1),
    main_goal: text(1),
});
exports.profilerAnswersV2Schema = zod_1.z.union([
    zod_1.z.object({
        schemaVersion: zod_1.z.literal(2),
        userType: zod_1.z.literal("company"),
        companyPath: zod_1.z.literal("automation"),
        automation: companyAutomationFields,
    }),
    zod_1.z.object({
        schemaVersion: zod_1.z.literal(2),
        userType: zod_1.z.literal("company"),
        companyPath: zod_1.z.literal("new_product"),
        newProduct: companyNewProductFields,
    }),
    zod_1.z.object({
        schemaVersion: zod_1.z.literal(2),
        userType: zod_1.z.literal("company"),
        companyPath: zod_1.z.literal("unsure"),
        unsure: companyUnsureFields,
    }),
    zod_1.z.object({
        schemaVersion: zod_1.z.literal(2),
        userType: zod_1.z.literal("startup"),
        startup: startupFields,
    }),
    zod_1.z.object({
        schemaVersion: zod_1.z.literal(2),
        userType: zod_1.z.literal("freelancer"),
        freelancer: freelancerFields,
    }),
]);
/** v1 informes previos al perfilador v2. */
exports.profilerAnswersLegacySchema = zod_1.z
    .object({
    schemaVersion: zod_1.z.literal(1).optional(),
    userType: zod_1.z.enum(["company", "startup", "freelancer"]),
    companyBranch: zod_1.z.enum(["automation", "new_product"]).nullish(),
    startupStage: zod_1.z.enum(["idea", "early", "validated"]).nullish(),
    freelancerFocus: zod_1.z.enum(["solo", "agency", "consulting"]).nullish(),
    mainChallenge: zod_1.z.string().min(1).max(4000),
    timeline: urgency,
})
    .superRefine((data, ctx) => {
    const a = data;
    if (a.userType === "company" && !a.companyBranch) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: "companyBranch required" });
    }
    if (a.userType === "startup" && !a.startupStage) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: "startupStage required" });
    }
    if (a.userType === "freelancer" && !a.freelancerFocus) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: "freelancerFocus required" });
    }
});
exports.profilerAnswersSchema = zod_1.z.union([exports.profilerAnswersV2Schema, exports.profilerAnswersLegacySchema]);
exports.profilerInputSchema = zod_1.z.object({
    answers: exports.profilerAnswersSchema,
    contact: zod_1.z.object({
        name: zod_1.z.string().min(2).max(200),
        email: zod_1.z.string().email().max(320),
        company: zod_1.z.preprocess((v) => (v === null || v === undefined ? "" : v), zod_1.z.string().max(200).default("")),
        phone: zod_1.z.preprocess((v) => (v === null || v === undefined ? "" : v), zod_1.z.string().max(80).default("")),
        webUrl: zod_1.z.preprocess((v) => (v === null || v === undefined ? "" : v), zod_1.z.string().max(500).default("")),
    }),
    uiLocale: zod_1.z.enum(["es", "en"]),
    userAgent: zod_1.z.string().max(512).optional(),
});
exports.contactLeadInputSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(200),
    email: zod_1.z.string().email().max(320),
    message: zod_1.z.string().min(1).max(8000),
    company: zod_1.z.preprocess((v) => (v === null || v === undefined ? "" : v), zod_1.z.string().max(200).default("")),
    phone: zod_1.z.preprocess((v) => (v === null || v === undefined ? "" : v), zod_1.z.string().max(80).default("")),
    requirementType: zod_1.z.preprocess((v) => (v === null || v === undefined ? "" : v), zod_1.z.string().max(64).default("")),
    uiLocale: zod_1.z.enum(["es", "en"]),
    userAgent: zod_1.z.string().max(512).optional(),
});
exports.primaryRecommendationSchema = zod_1.z.enum([
    "automate",
    "validate_first",
    "build_mvp",
    "do_not_invest_yet",
]);
exports.classificationSchema = zod_1.z.object({
    user_type: zod_1.z.enum(["company", "startup", "freelancer"]),
    intent: zod_1.z.enum(["automation", "new_product", "validation", "other"]),
    opportunity_level: zod_1.z.enum(["high", "medium", "low"]),
    urgency: zod_1.z.enum(["high", "medium", "low"]),
    maturity: zod_1.z.enum(["idea", "early", "validated"]),
    primary_recommendation: exports.primaryRecommendationSchema,
});
exports.diagnosisSchema = zod_1.z.object({
    report_title: zod_1.z.string().min(8).max(160),
    summary: zod_1.z.string().min(20).max(8000),
    problem_analysis: zod_1.z.string().min(20).max(8000),
    opportunity: zod_1.z.string().min(10).max(8000),
    risks: zod_1.z.string().min(10).max(8000),
    recommendation: zod_1.z.string().min(10).max(8000),
    estimated_impact: zod_1.z.string().min(5).max(4000),
    next_steps: zod_1.z.string().min(10).max(8000),
    key_insights: zod_1.z.array(zod_1.z.string().min(10).max(800)).min(2).max(3),
    impact: zod_1.z.object({
        time_savings: zod_1.z.string().min(5).max(2000),
        operational_improvement: zod_1.z.string().min(5).max(2000),
        business_potential: zod_1.z.string().min(5).max(2000),
    }),
});
exports.aiBundleSchema = zod_1.z.object({
    detected_language: zod_1.z.enum(["es", "en"]),
    classification: exports.classificationSchema,
    diagnosis: exports.diagnosisSchema,
});
//# sourceMappingURL=schemas.js.map