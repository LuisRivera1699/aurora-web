import { NextResponse } from "next/server";
import { loadPublicDiagnostic } from "@/lib/diagnostics/server";
import { isFirebaseAdminConfigured } from "@/lib/firebase-admin";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Report service not configured." },
      { status: 503 },
    );
  }

  const doc = await loadPublicDiagnostic(id);
  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (doc.status === "complete") {
    return NextResponse.json({
      id: doc.id,
      status: doc.status,
      createdAt: doc.createdAt,
      reportPayload: doc.reportPayload,
    });
  }

  return NextResponse.json({
    id: doc.id,
    status: doc.status,
    createdAt: doc.createdAt,
  });
}
