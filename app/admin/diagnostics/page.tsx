"use client";

import { FirebaseError } from "firebase/app";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getDiagnosticsCollectionName, getFirestoreDb, isFirebaseConfigured } from "@/lib/firebase";
import { signOutAdmin, watchAuthState } from "@/lib/firebase-auth";

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

  async function onSignOut() {
    try {
      await signOutAdmin();
      router.replace("/admin/login");
    } catch {
      setLoadError("No se pudo cerrar sesión.");
    }
  }

  if (!authChecked) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-surface-900 text-foreground-muted">
        Cargando…
      </div>
    );
  }

  const labels = {
    title: "Diagnósticos IA",
    navBack: "← Volver al panel",
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
    <div className="min-h-[100svh] bg-surface-900 text-foreground">
      <header className="border-b border-white/10 bg-surface-900/90 px-4 py-4 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-xl font-bold">{labels.title}</h1>
            <p className="text-xs text-foreground-muted">
              {userEmail ? (
                <>
                  Sesión: <span className="text-foreground/90">{userEmail}</span>
                </>
              ) : (
                "—"
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin"
              className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/5"
            >
              {labels.navBack}
            </Link>
            <button
              type="button"
              onClick={() => void fetchRows()}
              disabled={loadState === "loading"}
              className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/5 disabled:opacity-50"
            >
              Actualizar
            </button>
            <button
              type="button"
              onClick={() => void onSignOut()}
              className="rounded-full bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
            >
              Cerrar sesión
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-sm hover:bg-white/5"
            >
              Sitio público
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
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

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.03] text-foreground-muted">
              <tr>
                <th className="px-4 py-3 font-medium">{labels.cols.name}</th>
                <th className="px-4 py-3 font-medium">{labels.cols.company}</th>
                <th className="px-4 py-3 font-medium">{labels.cols.web}</th>
                <th className="px-4 py-3 font-medium">{labels.cols.type}</th>
                <th className="px-4 py-3 font-medium">{labels.cols.opportunity}</th>
                <th className="px-4 py-3 font-medium">{labels.cols.date}</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-foreground-muted">{row.company || "—"}</td>
                  <td className="px-4 py-3 text-foreground-muted">
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
                  <td className="px-4 py-3 text-foreground-muted">{row.userType || "—"}</td>
                  <td className="px-4 py-3 text-foreground-muted">{row.opportunity || "—"}</td>
                  <td className="px-4 py-3 text-foreground-muted">
                    {row.createdAt ? row.createdAt.toLocaleString("es") : "—"}
                  </td>
                  <td className="px-4 py-3">
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
      </main>
    </div>
  );
}
