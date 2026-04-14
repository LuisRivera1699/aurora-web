import { z } from "zod";

const urgency = z.enum(["high", "medium", "low"]);
const text = (min: number) => z.string().min(min).max(4000);

const companyAutomationFields = z.object({
  area_to_improve: text(1),
  current_process_how: text(1),
  main_problem: text(1),
  people_involved: text(1),
  time_spent: text(1),
  urgency_level: urgency,
  previous_solution_attempts: text(1),
});

const companyNewProductFields = z.object({
  product_type: text(1),
  problem_solved: text(1),
  target_audience: text(1),
  existing_validation: text(1),
  competition: text(1),
  current_stage: text(1),
  what_needs_now: text(1),
});

const companyUnsureFields = z.object({
  problem_summary: text(1),
  context: text(1),
  urgency_feeling: text(1),
  current_tools_or_support: text(1),
  desired_outcome: text(1),
});

const startupFields = z.object({
  idea_one_liner: text(1),
  validation: text(1),
  users_or_clients: text(1),
  problem_solved: text(1),
  competition: text(1),
  stage: text(1),
  current_need: text(1),
});

const freelancerFields = z.object({
  activity: text(1),
  most_repetitive_task: text(1),
  current_tools: text(1),
  what_to_automate: text(1),
  time_spent: text(1),
  main_goal: text(1),
});

export const profilerAnswersV2Schema = z.union([
  z.object({
    schemaVersion: z.literal(2),
    userType: z.literal("company"),
    companyPath: z.literal("automation"),
    automation: companyAutomationFields,
  }),
  z.object({
    schemaVersion: z.literal(2),
    userType: z.literal("company"),
    companyPath: z.literal("new_product"),
    newProduct: companyNewProductFields,
  }),
  z.object({
    schemaVersion: z.literal(2),
    userType: z.literal("company"),
    companyPath: z.literal("unsure"),
    unsure: companyUnsureFields,
  }),
  z.object({
    schemaVersion: z.literal(2),
    userType: z.literal("startup"),
    startup: startupFields,
  }),
  z.object({
    schemaVersion: z.literal(2),
    userType: z.literal("freelancer"),
    freelancer: freelancerFields,
  }),
]);

/** v1 informes previos al perfilador v2. */
export const profilerAnswersLegacySchema = z
  .object({
    schemaVersion: z.literal(1).optional(),
    userType: z.enum(["company", "startup", "freelancer"]),
    companyBranch: z.enum(["automation", "new_product"]).nullish(),
    startupStage: z.enum(["idea", "early", "validated"]).nullish(),
    freelancerFocus: z.enum(["solo", "agency", "consulting"]).nullish(),
    mainChallenge: z.string().min(1).max(4000),
    timeline: urgency,
  })
  .superRefine((data, ctx) => {
    const a = data;
    if (a.userType === "company" && !a.companyBranch) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "companyBranch required" });
    }
    if (a.userType === "startup" && !a.startupStage) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "startupStage required" });
    }
    if (a.userType === "freelancer" && !a.freelancerFocus) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "freelancerFocus required" });
    }
  });

export const profilerAnswersSchema = z.union([profilerAnswersV2Schema, profilerAnswersLegacySchema]);

export const profilerInputSchema = z.object({
  answers: profilerAnswersSchema,
  contact: z.object({
    name: z.string().min(2).max(200),
    email: z.string().email().max(320),
    company: z.preprocess(
      (v) => (v === null || v === undefined ? "" : v),
      z.string().max(200).default(""),
    ),
    phone: z.preprocess(
      (v) => (v === null || v === undefined ? "" : v),
      z.string().max(80).default(""),
    ),
    webUrl: z.preprocess(
      (v) => (v === null || v === undefined ? "" : v),
      z.string().max(500).default(""),
    ),
  }),
  uiLocale: z.enum(["es", "en"]),
  userAgent: z.string().max(512).optional(),
});

export const primaryRecommendationSchema = z.enum([
  "automate",
  "validate_first",
  "build_mvp",
  "do_not_invest_yet",
]);

export const classificationSchema = z.object({
  user_type: z.enum(["company", "startup", "freelancer"]),
  intent: z.enum(["automation", "new_product", "validation", "other"]),
  opportunity_level: z.enum(["high", "medium", "low"]),
  urgency: z.enum(["high", "medium", "low"]),
  maturity: z.enum(["idea", "early", "validated"]),
  primary_recommendation: primaryRecommendationSchema,
});

export const diagnosisSchema = z.object({
  report_title: z.string().min(8).max(160),
  summary: z.string().min(20).max(8000),
  problem_analysis: z.string().min(20).max(8000),
  opportunity: z.string().min(10).max(8000),
  risks: z.string().min(10).max(8000),
  recommendation: z.string().min(10).max(8000),
  estimated_impact: z.string().min(5).max(4000),
  next_steps: z.string().min(10).max(8000),
  key_insights: z.array(z.string().min(10).max(800)).min(2).max(3),
  impact: z.object({
    time_savings: z.string().min(5).max(2000),
    operational_improvement: z.string().min(5).max(2000),
    business_potential: z.string().min(5).max(2000),
  }),
});

export const aiBundleSchema = z.object({
  detected_language: z.enum(["es", "en"]),
  classification: classificationSchema,
  diagnosis: diagnosisSchema,
});

export type ProfilerInput = z.infer<typeof profilerInputSchema>;
export type AiBundle = z.infer<typeof aiBundleSchema>;
