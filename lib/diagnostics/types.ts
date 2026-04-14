/** Shared profiler / diagnostics types (aligned with Cloud Function + Firestore). */

export type UserType = "company" | "startup" | "freelancer";
export type CompanyPath = "automation" | "new_product" | "unsure";
export type UrgencyLevel = "high" | "medium" | "low";

/** Legacy v1 (flat) — informes generados antes del perfilador v2. */
export type ProfilerAnswersLegacy = {
  schemaVersion?: 1;
  userType: UserType;
  companyBranch?: "automation" | "new_product";
  startupStage?: "idea" | "early" | "validated";
  freelancerFocus?: "solo" | "agency" | "consulting";
  mainChallenge: string;
  timeline: UrgencyLevel;
};

export type CompanyAutomationAnswers = {
  area_to_improve: string;
  current_process_how: string;
  main_problem: string;
  people_involved: string;
  time_spent: string;
  urgency_level: UrgencyLevel;
  previous_solution_attempts: string;
};

export type CompanyNewProductAnswers = {
  product_type: string;
  problem_solved: string;
  target_audience: string;
  existing_validation: string;
  competition: string;
  current_stage: string;
  what_needs_now: string;
};

export type CompanyUnsureAnswers = {
  problem_summary: string;
  context: string;
  urgency_feeling: string;
  current_tools_or_support: string;
  desired_outcome: string;
};

export type StartupFlowAnswers = {
  idea_one_liner: string;
  validation: string;
  users_or_clients: string;
  problem_solved: string;
  competition: string;
  stage: string;
  current_need: string;
};

export type FreelancerFlowAnswers = {
  activity: string;
  most_repetitive_task: string;
  current_tools: string;
  what_to_automate: string;
  time_spent: string;
  main_goal: string;
};

export type ProfilerAnswersV2 =
  | {
      schemaVersion: 2;
      userType: "company";
      companyPath: "automation";
      automation: CompanyAutomationAnswers;
    }
  | {
      schemaVersion: 2;
      userType: "company";
      companyPath: "new_product";
      newProduct: CompanyNewProductAnswers;
    }
  | {
      schemaVersion: 2;
      userType: "company";
      companyPath: "unsure";
      unsure: CompanyUnsureAnswers;
    }
  | {
      schemaVersion: 2;
      userType: "startup";
      startup: StartupFlowAnswers;
    }
  | {
      schemaVersion: 2;
      userType: "freelancer";
      freelancer: FreelancerFlowAnswers;
    };

/** Union stored in Firestore `answers` field. */
export type ProfilerAnswers = ProfilerAnswersV2 | ProfilerAnswersLegacy;

export type ProfilerContact = {
  name: string;
  email: string;
  company: string;
  phone: string;
  /** Sitio web o perfil; no enviado al modelo, solo registro interno. */
  webUrl?: string;
};

export type PrimaryRecommendation =
  | "automate"
  | "validate_first"
  | "build_mvp"
  | "do_not_invest_yet";

export type ClassificationResult = {
  user_type: "company" | "startup" | "freelancer";
  intent: "automation" | "new_product" | "validation" | "other";
  opportunity_level: "high" | "medium" | "low";
  urgency: "high" | "medium" | "low";
  maturity: "idea" | "early" | "validated";
  /** v2; ausente en informes legacy. */
  primary_recommendation?: PrimaryRecommendation;
};

export type DiagnosisImpact = {
  time_savings: string;
  operational_improvement: string;
  business_potential: string;
};

export type DiagnosisResult = {
  /** Título generado por el modelo; ausente en informes legacy. */
  report_title?: string;
  summary: string;
  problem_analysis: string;
  opportunity: string;
  risks: string;
  recommendation: string;
  estimated_impact: string;
  next_steps: string;
  /** v2 informes; ausente en informes legacy. */
  key_insights?: string[];
  impact?: DiagnosisImpact;
};

export type DiagnosticScores = {
  total: number;
  bucket: "high" | "medium" | "low";
};

/** Public-safe payload for UI + PDF (no internal secrets). */
export type DiagnosticReportPayload = {
  schemaVersion?: 2;
  classification: ClassificationResult;
  diagnosis: DiagnosisResult;
  scores: DiagnosticScores;
  detectedLanguage: "es" | "en";
  contact: ProfilerContact;
  answers: ProfilerAnswers;
};

export type DiagnosticPublicDoc = {
  id: string;
  status: "complete" | "error" | "pending";
  uiLocale: "es" | "en";
  detectedLanguage: "es" | "en";
  contact: ProfilerContact;
  answers: ProfilerAnswers;
  classification: ClassificationResult;
  diagnosis: DiagnosisResult;
  reportPayload: DiagnosticReportPayload;
  scores: DiagnosticScores;
  createdAt: string | null;
  errorMessage?: string;
};

export function isLegacyAnswers(a: ProfilerAnswers): a is ProfilerAnswersLegacy {
  return !("schemaVersion" in a && a.schemaVersion === 2);
}
