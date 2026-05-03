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
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import type { ContactLeadRecord } from "@/lib/contact-lead-types";
import { getFirestoreDb, getLeadsCollectionName, isFirebaseConfigured } from "@/lib/firebase";
import { watchAuthState } from "@/lib/firebase-auth";

const SERVICE_INTEREST_LABELS: Record<string, string> = {
  "process-automation": "Automatización de procesos",
  "custom-business-software": "Software empresarial a medida",
  "digital-products-mvps": "Productos digitales y MVPs",
};

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

function formatServiceInterest(value: string): string {
  return SERVICE_INTEREST_LABELS[value] ?? value;
}

function LeadDetailField({
  label,
  value,
  href,
}: {
  label: string;
  value?: string;
  href?: string;
}) {
  const display = value?.trim() || "—";
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground-muted">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm leading-relaxed text-foreground">
        {href && display !== "—" ? (
          <a
            href={href}
            className="text-aurora-blue hover:underline"
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {display}
          </a>
        ) : (
          display
        )}
      </dd>
    </div>
  );
}

function LeadDetailModal({
  lead,
  onClose,
}: {
  lead: ContactLeadRecord;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-detail-title"
    >
      <div className="max-h-[90svh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-surface-900 shadow-2xl shadow-black/40">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-surface-900/95 px-5 py-4 backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-aurora-blue">
              Lead
            </p>
            <h2 id="lead-detail-title" className="mt-1 font-display text-xl font-bold">
              {lead.name || "Detalle del lead"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/15 px-3 py-1.5 text-sm text-foreground-muted hover:bg-white/5 hover:text-foreground"
          >
            Cerrar
          </button>
        </div>

        <div className="space-y-6 p-5">
          <dl className="grid gap-4 sm:grid-cols-2">
            <LeadDetailField label="Fecha" value={lead.createdAt ? new Date(lead.createdAt).toLocaleString("es") : ""} />
            <LeadDetailField label="Nombre" value={lead.name} />
            <LeadDetailField label="Email" value={lead.email} href={lead.email ? `mailto:${lead.email}` : undefined} />
            <LeadDetailField label="Empresa" value={lead.company} />
            <LeadDetailField label="Teléfono" value={lead.phone} href={lead.phone ? `tel:${lead.phone}` : undefined} />
            <LeadDetailField
              label="Servicio"
              value={lead.requirementType ? formatServiceInterest(lead.requirementType) : ""}
            />
            <LeadDetailField label="Origen" value={lead.source} />
            <LeadDetailField label="User agent" value={lead.userAgent} />
          </dl>

          <section className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground-muted">
              Mensaje
            </h3>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {lead.message || "—"}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [leads, setLeads] = useState<ContactLeadRecord[]>([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "error">("idle");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<ContactLeadRecord | null>(null);

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
      setSelectedLead((current) => {
        if (!current) return null;
        return rows.find((row) => row.id === current.id) ?? null;
      });
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

  useEffect(() => {
    if (!selectedLead) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedLead(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedLead]);

  async function onDelete(id: string) {
    if (!confirm("¿Eliminar este lead de forma permanente?")) return;
    setDeletingId(id);
    setLoadError(null);
    try {
      const db = getFirestoreDb();
      await deleteDoc(doc(db, getLeadsCollectionName(), id));
      setLeads((prev) => prev.filter((r) => r.id !== id));
      setSelectedLead((current) => (current?.id === id ? null : current));
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

  if (!authChecked) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-surface-900 text-foreground-muted">
        Cargando…
      </div>
    );
  }

  return (
    <AdminShell
      title="Leads"
      userEmail={userEmail}
      actions={
        <button
          type="button"
          onClick={() => void fetchLeads()}
          disabled={loadState === "loading"}
          className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/5 disabled:opacity-50"
        >
          Actualizar
        </button>
      }
    >
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

        {leads.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-surface-card/70 shadow-2xl shadow-black/20">
            <table className="w-full min-w-[1200px] table-fixed text-left text-sm">
              <thead className="border-b border-white/10 bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-foreground-muted">
                <tr>
                  <th className="w-44 px-4 py-4 font-semibold">Fecha</th>
                  <th className="w-40 px-4 py-4 font-semibold">Nombre</th>
                  <th className="w-56 px-4 py-4 font-semibold">Email</th>
                  <th className="w-40 px-4 py-4 font-semibold">Empresa</th>
                  <th className="w-36 px-4 py-4 font-semibold">Teléfono</th>
                  <th className="w-56 px-4 py-4 font-semibold">Servicio</th>
                  <th className="w-72 px-4 py-4 font-semibold">Mensaje</th>
                  <th className="w-56 px-4 py-4 font-semibold" />
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-white/5 align-top hover:bg-white/[0.03]">
                    <td className="whitespace-nowrap px-4 py-4 text-foreground-muted">
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleString("es") : "—"}
                    </td>
                    <td className="px-4 py-4 font-medium">{lead.name || "—"}</td>
                    <td className="px-4 py-4">
                      {lead.email ? (
                        <a href={`mailto:${lead.email}`} className="text-aurora-blue hover:underline">
                          {lead.email}
                        </a>
                      ) : (
                        <span className="text-foreground-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-foreground-muted">{lead.company || "—"}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-foreground-muted">
                      {lead.phone || "—"}
                    </td>
                    <td className="px-4 py-4 text-foreground-muted">
                      {lead.requirementType ? formatServiceInterest(lead.requirementType) : "—"}
                    </td>
                    <td className="px-4 py-4 text-foreground-muted">
                      <p className="truncate" title={lead.message}>
                        {lead.message || "—"}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedLead(lead)}
                          className="rounded-full border border-white/20 px-4 py-2 text-sm text-foreground hover:bg-white/5"
                        >
                          Ver detalle
                        </button>
                        <button
                          type="button"
                          onClick={() => void onDelete(lead.id)}
                          disabled={deletingId === lead.id}
                          className="rounded-full border border-red-400/40 px-4 py-2 text-sm text-red-200 hover:bg-red-500/10 disabled:opacity-50"
                        >
                          {deletingId === lead.id ? "Eliminando…" : "Eliminar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {selectedLead ? (
          <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
        ) : null}
    </AdminShell>
  );
}
