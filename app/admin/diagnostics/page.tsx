"use client";

import { FirebaseError } from "firebase/app";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { getDiagnosticsCollectionName, getFirestoreDb, isFirebaseConfigured } from "@/lib/firebase";
import { watchAuthState } from "@/lib/firebase-auth";

type DiagnosticRow = {
  id: string;
  name: string;
  company: string;
  webUrl: string;
  userType: string;
  opportunity: string;
  createdAt: Date | null;
};

function webUrlHref(raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

function readTimestamp(data: unknown): Date | null {
  if (
    data &&
    typeof data === "object" &&
    "toDate" in data &&
    typeof (data as { toDate: () => Date }).toDate === "function"
  ) {
    return (data as { toDate: () => Date }).toDate();
  }
  return null;
}

function mapDoc(id: string, data: Record<string, unknown>): DiagnosticRow {
  const classification = data.classification as Record<string, unknown> | undefined;
  const userType = String(classification?.user_type ?? "");
  const opp = String(classification?.opportunity_level ?? "");
  return {
    id,
    name: String(data.name ?? ""),
    company: String(data.company ?? ""),
    webUrl: String(data.webUrl ?? ""),
    userType,
    opportunity: opp,
    createdAt: readTimestamp(data.createdAt),
  };
}

export default function AdminDiagnosticsPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [rows, setRows] = useState<DiagnosticRow[]>([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "error">("idle");
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchRows = useCallback(async () => {
    if (!isFirebaseConfigured()) {
      setLoadState("error");
      setLoadError("Firebase no configurado.");
      return;
    }
    setLoadState("loading");
    setLoadError(null);
    try {
      const db = getFirestoreDb();
      const colName = getDiagnosticsCollectionName();
      const q = query(collection(db, colName), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const list: DiagnosticRow[] = [];
      snap.forEach((d) => {
        list.push(mapDoc(d.id, d.data() as Record<string, unknown>));
      });
      setRows(list);
      setLoadState("idle");
    } catch (e) {
      setLoadState("error");
      if (e instanceof FirebaseError && e.code === "permission-denied") {
        setLoadError(
          "Sin permiso para leer diagnósticos. Comprueba firestore.rules y el email admin.",
        );
        return;
      }
      if (e instanceof FirebaseError && e.code === "failed-precondition") {
        setLoadError(
          "Falta un índice compuesto en Firestore o el campo createdAt no existe en los documentos.",
        );
        return;
      }
      setLoadError(e instanceof Error ? e.message : "Error al cargar.");
    }
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      router.replace("/admin/login");
      return;
    }
    const unsub = watchAuthState((u) => {
      if (!u) {
        router.replace("/admin/login");
        return;
      }
      setUserEmail(u.email ?? null);
      setAuthChecked(true);
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (!authChecked || !userEmail) return;
    const t = setTimeout(() => {
      void fetchRows();
    }, 0);
    return () => clearTimeout(t);
  }, [authChecked, userEmail, fetchRows]);

  if (!authChecked) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-surface-900 text-foreground-muted">
        Cargando…
      </div>
    );
  }

  const labels = {
    title: "Diagnóstico",
    empty: "No hay diagnósticos todavía.",
    cols: {
      name: "Nombre",
      company: "Empresa",
      web: "Web",
      type: "Tipo",
      opportunity: "Oportunidad",
      date: "Fecha",
    },
    viewReport: "Ver informe",
  };

  return (
    <AdminShell
      title={labels.title}
      userEmail={userEmail}
      actions={
        <button
          type="button"
          onClick={() => void fetchRows()}
          disabled={loadState === "loading"}
          className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/5 disabled:opacity-50"
        >
          Actualizar
        </button>
      }
    >
        {loadError && (
          <p className="mb-6 rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-200" role="alert">
            {loadError}
          </p>
        )}

        {loadState === "loading" && rows.length === 0 && (
          <p className="text-foreground-muted">Cargando…</p>
        )}

        {rows.length === 0 && loadState !== "loading" && !loadError && (
          <p className="text-foreground-muted">{labels.empty}</p>
        )}

        {rows.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-surface-card/70 shadow-2xl shadow-black/20">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-foreground-muted">
              <tr>
                <th className="px-4 py-4 font-semibold">{labels.cols.name}</th>
                <th className="px-4 py-4 font-semibold">{labels.cols.company}</th>
                <th className="px-4 py-4 font-semibold">{labels.cols.web}</th>
                <th className="px-4 py-4 font-semibold">{labels.cols.type}</th>
                <th className="px-4 py-4 font-semibold">{labels.cols.opportunity}</th>
                <th className="px-4 py-4 font-semibold">{labels.cols.date}</th>
                <th className="px-4 py-4 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-4 font-medium">{row.name}</td>
                  <td className="px-4 py-4 text-foreground-muted">{row.company || "—"}</td>
                  <td className="px-4 py-4 text-foreground-muted">
                    {row.webUrl ? (
                      <a
                        href={webUrlHref(row.webUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-aurora-blue hover:underline"
                      >
                        Enlace
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-4 text-foreground-muted">{row.userType || "—"}</td>
                  <td className="px-4 py-4 text-foreground-muted">{row.opportunity || "—"}</td>
                  <td className="px-4 py-4 text-foreground-muted">
                    {row.createdAt ? row.createdAt.toLocaleString("es") : "—"}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/diagnostics/${row.id}`}
                      className="text-aurora-blue hover:underline"
                    >
                      Detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
    </AdminShell>
  );
}
