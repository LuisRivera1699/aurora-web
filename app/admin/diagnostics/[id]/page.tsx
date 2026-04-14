"use client";

import { FirebaseError } from "firebase/app";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getDiagnosticsCollectionName, getFirestoreDb, isFirebaseConfigured } from "@/lib/firebase";
import { watchAuthState } from "@/lib/firebase-auth";

export default function AdminDiagnosticDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [authChecked, setAuthChecked] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [raw, setRaw] = useState<Record<string, unknown> | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
    if (!authChecked || !userEmail || !id) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const db = getFirestoreDb();
        const snap = await getDoc(doc(db, getDiagnosticsCollectionName(), id));
        if (cancelled) return;
        if (!snap.exists) {
          setLoadError("Documento no encontrado.");
          setRaw(null);
          return;
        }
        setRaw(snap.data() as Record<string, unknown>);
      } catch (e) {
        if (cancelled) return;
        if (e instanceof FirebaseError && e.code === "permission-denied") {
          setLoadError("Sin permiso para leer este diagnóstico.");
          return;
        }
        setLoadError(e instanceof Error ? e.message : "Error al cargar.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [authChecked, userEmail, id]);

  const uiLocale = raw?.uiLocale === "en" ? "en" : "es";
  const reportLocale =
    raw?.detectedLanguage === "en" || raw?.detectedLanguage === "es"
      ? String(raw.detectedLanguage)
      : uiLocale;
  const publicReportHref = `/${reportLocale}/report/${encodeURIComponent(id)}`;

  if (!authChecked) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-surface-900 text-foreground-muted">
        Cargando…
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] bg-surface-900 text-foreground">
      <header className="border-b border-white/10 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-xl font-bold">Detalle del diagnóstico</h1>
            <p className="text-xs text-foreground-muted">{userEmail}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/diagnostics"
              className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/5"
            >
              ← Lista
            </Link>
            {raw && (
              <a
                href={publicReportHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-aurora-blue/20 px-4 py-2 text-sm text-aurora-blue hover:bg-aurora-blue/30"
              >
                Ver informe público
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {loadError && (
          <p className="mb-6 rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-200">{loadError}</p>
        )}
        {loading && <p className="text-foreground-muted">Cargando…</p>}
        {!loading && raw && (
          <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-black/30 p-4 text-xs leading-relaxed text-foreground-muted">
            {JSON.stringify(raw, null, 2)}
          </pre>
        )}
        {!loading && raw && (
          <p className="mt-4 text-xs text-foreground-muted">
            Idioma UI: {String(uiLocale)} · detectado: {String(reportLocale)}
          </p>
        )}
      </main>
    </div>
  );
}
