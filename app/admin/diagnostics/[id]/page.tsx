"use client";

import { FirebaseError } from "firebase/app";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import type {
  ClassificationResult,
  DiagnosisResult,
  DiagnosticReportPayload,
  DiagnosticScores,
  ProfilerAnswers,
  ProfilerContact,
  PrimaryRecommendation,
} from "@/lib/diagnostics/types";
import { getDiagnosticsCollectionName, getFirestoreDb, isFirebaseConfigured } from "@/lib/firebase";
import { watchAuthState } from "@/lib/firebase-auth";

type AdminDiagnosticDoc = {
  status?: string;
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  webUrl?: string;
  uiLocale?: string;
  detectedLanguage?: string;
  emailSent?: boolean;
  errorMessage?: string;
  contact?: ProfilerContact;
  answers?: ProfilerAnswers;
  classification?: ClassificationResult;
  diagnosis?: DiagnosisResult;
  reportPayload?: DiagnosticReportPayload;
  scores?: DiagnosticScores;
  createdAt?: unknown;
  updatedAt?: unknown;
};

type DetailFieldProps = {
  label: string;
  value?: string | number | null;
  href?: string;
};

const opportunityLabels = {
  high: "Alta",
  medium: "Media",
  low: "Baja",
} as const;

const primaryRecommendationLabels: Record<PrimaryRecommendation, string> = {
  automate: "Automatizar procesos",
  validate_first: "Validar antes de construir",
  build_mvp: "Construir MVP",
  do_not_invest_yet: "No invertir todavía",
};

const userTypeLabels = {
  company: "Empresa",
  startup: "Startup",
  freelancer: "Freelancer",
} as const;

const intentLabels = {
  automation: "Automatización",
  new_product: "Nuevo producto",
  validation: "Validación",
  other: "Otro",
} as const;

function webUrlHref(raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

function formatTimestamp(value: unknown): string {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate: () => Date }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate().toLocaleString("es");
  }
  if (typeof value === "string" && value.trim()) return value;
  return "—";
}

function nextStepsBlocks(text: string): string[] {
  return text
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function detailValue(value?: string | number | null): string {
  if (value === null || value === undefined) return "—";
  const text = String(value).trim();
  return text || "—";
}

function getContact(raw: AdminDiagnosticDoc, reportPayload: DiagnosticReportPayload | null): ProfilerContact {
  return {
    name: reportPayload?.contact.name ?? raw.contact?.name ?? raw.name ?? "",
    email: reportPayload?.contact.email ?? raw.contact?.email ?? raw.email ?? "",
    company: reportPayload?.contact.company ?? raw.contact?.company ?? raw.company ?? "",
    phone: reportPayload?.contact.phone ?? raw.contact?.phone ?? raw.phone ?? "",
    webUrl: reportPayload?.contact.webUrl ?? raw.contact?.webUrl ?? raw.webUrl ?? "",
  };
}

function getReportPayload(raw: AdminDiagnosticDoc): DiagnosticReportPayload | null {
  if (raw.reportPayload?.diagnosis && raw.reportPayload.classification) {
    return raw.reportPayload;
  }

  if (!raw.diagnosis || !raw.classification || !raw.scores || !raw.answers) return null;

  return {
    schemaVersion: 2,
    classification: raw.classification,
    diagnosis: raw.diagnosis,
    scores: raw.scores,
    detectedLanguage: raw.detectedLanguage === "en" ? "en" : "es",
    contact: {
      name: raw.contact?.name ?? raw.name ?? "",
      email: raw.contact?.email ?? raw.email ?? "",
      company: raw.contact?.company ?? raw.company ?? "",
      phone: raw.contact?.phone ?? raw.phone ?? "",
      webUrl: raw.contact?.webUrl ?? raw.webUrl ?? "",
    },
    answers: raw.answers,
  };
}

function labelForAnswerKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function renderAnswerValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) return value.map(renderAnswerValue).join(", ");
  return "—";
}

function flattenAnswerEntries(
  value: unknown,
  prefix = "",
): Array<{ label: string; value: unknown }> {
  if (value === undefined || value === null) return [];
  if (typeof value !== "object" || Array.isArray(value)) {
    return prefix ? [{ label: prefix, value }] : [];
  }

  return Object.entries(value).flatMap(([key, nested]) => {
    if (nested === undefined || nested === null) return [];
    const label = prefix ? `${prefix} / ${key}` : key;
    if (typeof nested === "object" && !Array.isArray(nested)) {
      return flattenAnswerEntries(nested, label);
    }
    return [{ label, value: nested }];
  });
}

function DetailField({ label, value, href }: DetailFieldProps) {
  const display = detailValue(value);
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground-muted">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm text-foreground">
        {href && display !== "—" ? (
          <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-aurora-blue hover:underline">
            {display}
          </a>
        ) : (
          display
        )}
      </dd>
    </div>
  );
}

function AdminSection({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-white/10 bg-surface-card/55 p-5 ${className}`}>
      <h2 className="font-display text-lg font-semibold text-aurora-blue">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function TextBlock({ children }: { children?: string }) {
  return (
    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground-muted">
      {children?.trim() || "—"}
    </p>
  );
}

function AnswersList({ answers }: { answers: ProfilerAnswers }) {
  const entries = flattenAnswerEntries(answers);

  return (
    <dl className="space-y-4">
      {entries.map(({ label, value }) => (
        <div key={label} className="rounded-xl border border-white/10 bg-black/15 p-4">
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground-muted">
            {label
              .split(" / ")
              .map(labelForAnswerKey)
              .join(" / ")}
          </dt>
          <dd className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {renderAnswerValue(value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function AdminDiagnosticDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [authChecked, setAuthChecked] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [raw, setRaw] = useState<AdminDiagnosticDoc | null>(null);
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
        setRaw(snap.data() as AdminDiagnosticDoc);
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
  const reportPayload = raw ? getReportPayload(raw) : null;
  const contact = raw ? getContact(raw, reportPayload) : null;
  const diagnosis = reportPayload?.diagnosis;
  const classification = reportPayload?.classification;
  const scores = reportPayload?.scores ?? raw?.scores;
  const nextStepsLines = diagnosis?.next_steps ? nextStepsBlocks(diagnosis.next_steps) : [];
  const webHref = contact?.webUrl ? webUrlHref(contact.webUrl) : "";

  if (!authChecked) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-surface-900 text-foreground-muted">
        Cargando…
      </div>
    );
  }

  return (
    <AdminShell
      title="Detalle del diagnóstico"
      userEmail={userEmail}
      actions={
        <>
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
        </>
      }
    >
      {loadError && (
        <p className="mb-6 rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-200">{loadError}</p>
      )}
      {loading && <p className="text-foreground-muted">Cargando…</p>}
      {!loading && raw && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-surface-card/70 p-5 shadow-2xl shadow-black/15">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground-muted">
                  Informe IA
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold text-foreground">
                  {diagnosis?.report_title?.trim() || "Diagnóstico sin título"}
                </h2>
                <p className="mt-2 text-sm text-foreground-muted">
                  ID: <span className="font-mono">{id}</span>
                </p>
              </div>

              <div className="grid gap-2 text-sm sm:grid-cols-2 lg:min-w-[360px]">
                <div className="rounded-xl border border-white/10 bg-black/15 px-4 py-3">
                  <span className="text-foreground-muted">Estado: </span>
                  <span className="font-medium text-foreground">{detailValue(raw.status)}</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/15 px-4 py-3">
                  <span className="text-foreground-muted">Email: </span>
                  <span className="font-medium text-foreground">
                    {raw.emailSent ? "Enviado" : "No enviado"}
                  </span>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/15 px-4 py-3">
                  <span className="text-foreground-muted">Creado: </span>
                  <span className="font-medium text-foreground">{formatTimestamp(raw.createdAt)}</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/15 px-4 py-3">
                  <span className="text-foreground-muted">Actualizado: </span>
                  <span className="font-medium text-foreground">{formatTimestamp(raw.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {!reportPayload || !diagnosis || !classification ? (
            <AdminSection title="Diagnóstico no disponible">
              <TextBlock>
                {raw.errorMessage ||
                  "Este documento no tiene un reporte completo generado por la IA."}
              </TextBlock>
            </AdminSection>
          ) : (
            <>
              <div className="grid gap-6 lg:grid-cols-2">
                <AdminSection title="Contacto">
                  <dl className="grid gap-4 sm:grid-cols-2">
                    <DetailField label="Nombre" value={contact?.name} />
                    <DetailField
                      label="Correo"
                      value={contact?.email}
                      href={`mailto:${contact?.email ?? ""}`}
                    />
                    <DetailField label="Empresa" value={contact?.company} />
                    <DetailField
                      label="Teléfono"
                      value={contact?.phone}
                      href={contact?.phone ? `tel:${contact.phone}` : undefined}
                    />
                    <DetailField
                      label="Web / perfil"
                      value={contact?.webUrl}
                      href={webHref || undefined}
                    />
                  </dl>
                </AdminSection>

                <AdminSection title="Clasificación">
                  <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <DetailField
                      label="Tipo"
                      value={userTypeLabels[classification.user_type] ?? classification.user_type}
                    />
                    <DetailField
                      label="Intención"
                      value={intentLabels[classification.intent] ?? classification.intent}
                    />
                    <DetailField
                      label="Oportunidad"
                      value={opportunityLabels[classification.opportunity_level]}
                    />
                    <DetailField label="Urgencia" value={opportunityLabels[classification.urgency]} />
                    <DetailField label="Madurez" value={classification.maturity} />
                    <DetailField
                      label="Score"
                      value={scores ? `${scores.total} (${scores.bucket})` : "—"}
                    />
                  </dl>
                </AdminSection>
              </div>

              <AdminSection title="Resumen ejecutivo">
                <TextBlock>{diagnosis.summary}</TextBlock>
              </AdminSection>

              {diagnosis.key_insights && diagnosis.key_insights.length > 0 ? (
                <AdminSection title="Insights clave">
                  <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground-muted">
                    {diagnosis.key_insights.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </AdminSection>
              ) : null}

              {diagnosis.impact ? (
                <AdminSection title="Impacto estimado">
                  <div className="grid gap-4 md:grid-cols-3">
                    <DetailField label="Ahorro de tiempo" value={diagnosis.impact.time_savings} />
                    <DetailField
                      label="Mejora operativa"
                      value={diagnosis.impact.operational_improvement}
                    />
                    <DetailField
                      label="Potencial de negocio"
                      value={diagnosis.impact.business_potential}
                    />
                  </div>
                  {diagnosis.estimated_impact?.trim() ? (
                    <div className="mt-5 border-t border-white/10 pt-5">
                      <TextBlock>{diagnosis.estimated_impact}</TextBlock>
                    </div>
                  ) : null}
                </AdminSection>
              ) : diagnosis.estimated_impact?.trim() ? (
                <AdminSection title="Impacto estimado">
                  <TextBlock>{diagnosis.estimated_impact}</TextBlock>
                </AdminSection>
              ) : null}

              <div className="grid gap-6 lg:grid-cols-2">
                <AdminSection title="Análisis del contexto">
                  <TextBlock>{diagnosis.problem_analysis}</TextBlock>
                </AdminSection>

                <AdminSection title="Oportunidad">
                  <TextBlock>{diagnosis.opportunity}</TextBlock>
                </AdminSection>

                <AdminSection title="Riesgos">
                  <TextBlock>{diagnosis.risks}</TextBlock>
                </AdminSection>

                <AdminSection title="Recomendación">
                  {classification.primary_recommendation ? (
                    <p className="mb-4 inline-flex rounded-full border border-aurora-blue/25 bg-aurora-blue/10 px-3 py-1 text-xs font-semibold text-aurora-blue">
                      {primaryRecommendationLabels[classification.primary_recommendation]}
                    </p>
                  ) : null}
                  <TextBlock>{diagnosis.recommendation}</TextBlock>
                </AdminSection>
              </div>

              <AdminSection title="Próximos pasos">
                {nextStepsLines.length > 1 ? (
                  <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground-muted">
                    {nextStepsLines.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <TextBlock>{nextStepsLines[0] ?? diagnosis.next_steps}</TextBlock>
                )}
              </AdminSection>

              <AdminSection title="Respuestas originales">
                <AnswersList answers={reportPayload.answers} />
              </AdminSection>
            </>
          )}

          <p className="text-xs text-foreground-muted">
            Idioma UI: {String(uiLocale)} · detectado: {String(reportLocale)}
          </p>
        </div>
        )}
    </AdminShell>
  );
}
