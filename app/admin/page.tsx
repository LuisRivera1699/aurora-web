"use client";

import { FirebaseError } from "firebase/app";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { ContactLeadRecord } from "@/lib/contact-lead-types";
import { getFirestoreDb, getLeadsCollectionName, isFirebaseConfigured } from "@/lib/firebase";
import { signOutAdmin, watchAuthState } from "@/lib/firebase-auth";

function mapDoc(id: string, data: Record<string, unknown>): ContactLeadRecord {
  return {
    id,
    name: String(data.name ?? ""),
    email: String(data.email ?? ""),
    message: String(data.message ?? ""),
    company: String(data.company ?? ""),
    phone: String(data.phone ?? ""),
    requirementType: String(data.requirementType ?? ""),
    userAgent: String(data.userAgent ?? ""),
    source: String(data.source ?? ""),
    createdAt: String(data.createdAt ?? ""),
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [leads, setLeads] = useState<ContactLeadRecord[]>([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "error">("idle");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    if (!isFirebaseConfigured()) {
      setLoadState("error");
      setLoadError("Firebase no configurado.");
      return;
    }
    setLoadState("loading");
    setLoadError(null);
    try {
      const db = getFirestoreDb();
      const colName = getLeadsCollectionName();
      const q = query(collection(db, colName), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const rows: ContactLeadRecord[] = [];
      snap.forEach((d) => {
        rows.push(mapDoc(d.id, d.data() as Record<string, unknown>));
      });
      setLeads(rows);
      setLoadState("idle");
    } catch (e) {
      setLoadState("error");
      if (e instanceof FirebaseError && e.code === "permission-denied") {
        setLoadError(
          "Sin permiso para leer leads. Comprueba que tu usuario coincide con el email en firestore.rules o contact_requests.",
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
    void fetchLeads();
  }, [authChecked, userEmail, fetchLeads]);

  async function onDelete(id: string) {
    if (!confirm("¿Eliminar este lead de forma permanente?")) return;
    setDeletingId(id);
    setLoadError(null);
    try {
      const db = getFirestoreDb();
      await deleteDoc(doc(db, getLeadsCollectionName(), id));
      setLeads((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      if (e instanceof FirebaseError && e.code === "permission-denied") {
        setLoadError("Sin permiso para eliminar. Revisa firestore.rules.");
        return;
      }
      setLoadError(e instanceof Error ? e.message : "No se pudo eliminar.");
    } finally {
      setDeletingId(null);
    }
  }

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

  return (
    <div className="min-h-[100svh] bg-surface-900 text-foreground">
      <header className="border-b border-white/10 bg-surface-900/90 px-4 py-4 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-xl font-bold">Leads</h1>
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
            <button
              type="button"
              onClick={() => void fetchLeads()}
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
              href="/admin/diagnostics"
              className="rounded-full border border-aurora-blue/40 px-4 py-2 text-sm text-aurora-blue hover:bg-aurora-blue/10"
            >
              Diagnósticos IA
            </Link>
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
        {!isFirebaseConfigured() && (
          <p className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            Configura <code className="rounded bg-white/10 px-1">NEXT_PUBLIC_FIREBASE_*</code> en{" "}
            <code className="rounded bg-white/10 px-1">.env</code>.
          </p>
        )}

        {loadError && (
          <p className="mb-6 rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-200" role="alert">
            {loadError}
          </p>
        )}

        {loadState === "loading" && leads.length === 0 && (
          <p className="text-foreground-muted">Cargando solicitudes…</p>
        )}

        {leads.length === 0 && loadState !== "loading" && !loadError && (
          <p className="text-foreground-muted">No hay leads todavía.</p>
        )}

        <ul className="space-y-4">
          {leads.map((lead) => (
            <li
              key={lead.id}
              className="gradient-border-mask rounded-2xl border border-white/5 bg-surface-card p-5 shadow-lg"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1 text-sm">
                  <p className="font-display text-lg font-semibold text-foreground">{lead.name}</p>
                  <p>
                    <a href={`mailto:${lead.email}`} className="text-aurora-blue hover:underline">
                      {lead.email}
                    </a>
                  </p>
                  <p className="text-xs text-foreground-muted">
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleString("es") : "—"}
                    {lead.requirementType ? ` · ${lead.requirementType}` : ""}
                  </p>
                  {(lead.company || lead.phone) && (
                    <p className="text-xs text-foreground-muted">
                      {[lead.company, lead.phone].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <p className="mt-3 whitespace-pre-wrap text-foreground-muted">{lead.message}</p>
                  {lead.userAgent ? (
                    <p className="mt-2 truncate text-[10px] text-foreground-muted/70" title={lead.userAgent}>
                      {lead.userAgent}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => void onDelete(lead.id)}
                  disabled={deletingId === lead.id}
                  className="shrink-0 rounded-full border border-red-400/40 px-4 py-2 text-sm text-red-200 hover:bg-red-500/10 disabled:opacity-50"
                >
                  {deletingId === lead.id ? "Eliminando…" : "Eliminar"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
