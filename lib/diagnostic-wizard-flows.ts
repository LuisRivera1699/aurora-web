import type { CompanyPath, ProfilerAnswersV2, UserType } from "@/lib/diagnostics/types";

export type WizardFlowId =
  | "companyAutomation"
  | "companyNewProduct"
  | "companyUnsure"
  | "startup"
  | "freelancer";

export type FlowStepKind = "text" | "urgency";

export type FlowStepSpec = { fieldKey: string; kind: FlowStepKind };

/** Orden alineado con `ProfilerAnswersV2` y zod en functions. */
export const FLOW_SPECS: Record<WizardFlowId, FlowStepSpec[]> = {
  companyAutomation: [
    { fieldKey: "area_to_improve", kind: "text" },
    { fieldKey: "current_process_how", kind: "text" },
    { fieldKey: "main_problem", kind: "text" },
    { fieldKey: "people_involved", kind: "text" },
    { fieldKey: "time_spent", kind: "text" },
    { fieldKey: "urgency_level", kind: "urgency" },
    { fieldKey: "previous_solution_attempts", kind: "text" },
  ],
  companyNewProduct: [
    { fieldKey: "product_type", kind: "text" },
    { fieldKey: "problem_solved", kind: "text" },
    { fieldKey: "target_audience", kind: "text" },
    { fieldKey: "existing_validation", kind: "text" },
    { fieldKey: "competition", kind: "text" },
    { fieldKey: "current_stage", kind: "text" },
    { fieldKey: "what_needs_now", kind: "text" },
  ],
  companyUnsure: [
    { fieldKey: "problem_summary", kind: "text" },
    { fieldKey: "context", kind: "text" },
    { fieldKey: "urgency_feeling", kind: "text" },
    { fieldKey: "current_tools_or_support", kind: "text" },
    { fieldKey: "desired_outcome", kind: "text" },
  ],
  startup: [
    { fieldKey: "idea_one_liner", kind: "text" },
    { fieldKey: "validation", kind: "text" },
    { fieldKey: "users_or_clients", kind: "text" },
    { fieldKey: "problem_solved", kind: "text" },
    { fieldKey: "competition", kind: "text" },
    { fieldKey: "stage", kind: "text" },
    { fieldKey: "current_need", kind: "text" },
  ],
  freelancer: [
    { fieldKey: "activity", kind: "text" },
    { fieldKey: "most_repetitive_task", kind: "text" },
    { fieldKey: "current_tools", kind: "text" },
    { fieldKey: "what_to_automate", kind: "text" },
    { fieldKey: "time_spent", kind: "text" },
    { fieldKey: "main_goal", kind: "text" },
  ],
};

export function flowIdForSelection(
  userType: UserType,
  companyPath: CompanyPath | null,
): WizardFlowId | null {
  if (userType === "company" && companyPath === "automation") return "companyAutomation";
  if (userType === "company" && companyPath === "new_product") return "companyNewProduct";
  if (userType === "company" && companyPath === "unsure") return "companyUnsure";
  if (userType === "startup") return "startup";
  if (userType === "freelancer") return "freelancer";
  return null;
}

export function countFlowSteps(flowId: WizardFlowId): number {
  return FLOW_SPECS[flowId].length;
}

export function totalWizardSteps(
  userType: UserType | null,
  companyPath: CompanyPath | null,
): number {
  if (!userType) return 1;
  const fid = flowIdForSelection(userType, companyPath);
  if (!fid) {
    if (userType === "company") return 2;
    return 1;
  }
  return 1 + (userType === "company" ? 1 : 0) + countFlowSteps(fid) + 1;
}

/** Construye `ProfilerAnswersV2` desde estado acumulado. */
export function buildAnswersV2(
  flowId: WizardFlowId,
  values: Record<string, string>,
): ProfilerAnswersV2 {
  const specs = FLOW_SPECS[flowId];
  const pick = (k: string) => (values[k] ?? "").trim();

  switch (flowId) {
    case "companyAutomation":
      return {
        schemaVersion: 2,
        userType: "company",
        companyPath: "automation",
        automation: {
          area_to_improve: pick("area_to_improve"),
          current_process_how: pick("current_process_how"),
          main_problem: pick("main_problem"),
          people_involved: pick("people_involved"),
          time_spent: pick("time_spent"),
          urgency_level: (pick("urgency_level") as "high" | "medium" | "low") || "medium",
          previous_solution_attempts: pick("previous_solution_attempts"),
        },
      };
    case "companyNewProduct":
      return {
        schemaVersion: 2,
        userType: "company",
        companyPath: "new_product",
        newProduct: {
          product_type: pick("product_type"),
          problem_solved: pick("problem_solved"),
          target_audience: pick("target_audience"),
          existing_validation: pick("existing_validation"),
          competition: pick("competition"),
          current_stage: pick("current_stage"),
          what_needs_now: pick("what_needs_now"),
        },
      };
    case "companyUnsure":
      return {
        schemaVersion: 2,
        userType: "company",
        companyPath: "unsure",
        unsure: {
          problem_summary: pick("problem_summary"),
          context: pick("context"),
          urgency_feeling: pick("urgency_feeling"),
          current_tools_or_support: pick("current_tools_or_support"),
          desired_outcome: pick("desired_outcome"),
        },
      };
    case "startup": {
      const o: Record<string, string> = {};
      for (const s of specs) o[s.fieldKey] = pick(s.fieldKey);
      return {
        schemaVersion: 2,
        userType: "startup",
        startup: {
          idea_one_liner: o.idea_one_liner!,
          validation: o.validation!,
          users_or_clients: o.users_or_clients!,
          problem_solved: o.problem_solved!,
          competition: o.competition!,
          stage: o.stage!,
          current_need: o.current_need!,
        },
      };
    }
    case "freelancer": {
      const o: Record<string, string> = {};
      for (const s of specs) o[s.fieldKey] = pick(s.fieldKey);
      return {
        schemaVersion: 2,
        userType: "freelancer",
        freelancer: {
          activity: o.activity!,
          most_repetitive_task: o.most_repetitive_task!,
          current_tools: o.current_tools!,
          what_to_automate: o.what_to_automate!,
          time_spent: o.time_spent!,
          main_goal: o.main_goal!,
        },
      };
    }
  }
}
