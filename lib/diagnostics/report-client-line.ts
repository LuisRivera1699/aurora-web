import type { DiagnosticReportPayload } from "./types";

/** Nombre a mostrar tras la etiqueta "Cliente:" / "Client:" (empresa o startup → company o nombre; freelancer → nombre). */
export function getReportClientDisplayName(payload: DiagnosticReportPayload): string {
  const { contact, classification } = payload;
  const name = contact.name?.trim() ?? "";
  if (classification.user_type === "freelancer") return name;
  const company = contact.company?.trim() ?? "";
  return company || name;
}
