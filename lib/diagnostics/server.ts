import "server-only";
import type { DocumentData } from "firebase-admin/firestore";
import { getAdminFirestore, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { getDiagnosticsCollectionName } from "@/lib/firebase";
import type { DiagnosticReportPayload } from "@/lib/diagnostics/types";

function isValidFirestoreDocId(id: string): boolean {
  if (id.length < 1 || id.length > 1500 || id.includes("/")) return false;
  return true;
}

export type PublicDiagnosticApi =
  | {
      id: string;
      status: "complete";
      createdAt: string | null;
      reportPayload: DiagnosticReportPayload;
    }
  | {
      id: string;
      status: "error" | "pending";
      createdAt: string | null;
    };

function readCreatedAt(data: DocumentData): string | null {
  const ca = data.createdAt;
  if (ca && typeof ca === "object" && "toDate" in ca && typeof (ca as { toDate: () => Date }).toDate === "function") {
    return (ca as { toDate: () => Date }).toDate().toISOString();
  }
  return null;
}

export async function loadPublicDiagnostic(id: string): Promise<PublicDiagnosticApi | null> {
  if (!isFirebaseAdminConfigured() || !isValidFirestoreDocId(id)) {
    return null;
  }
  const db = getAdminFirestore();
  const snap = await db.collection(getDiagnosticsCollectionName()).doc(id).get();
  if (!snap.exists) return null;
  const d = snap.data() as DocumentData;
  const status = String(d.status ?? "pending") as "complete" | "error" | "pending";
  const createdAt = readCreatedAt(d);

  if (status === "complete" && d.reportPayload && typeof d.reportPayload === "object") {
    return {
      id: snap.id,
      status: "complete",
      createdAt,
      reportPayload: d.reportPayload as DiagnosticReportPayload,
    };
  }
  if (status === "error") {
    return { id: snap.id, status: "error", createdAt };
  }
  return { id: snap.id, status: "pending", createdAt };
}
