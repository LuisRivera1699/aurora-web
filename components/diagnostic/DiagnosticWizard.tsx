"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import type { SiteMessages } from "@/content/messages/types";
import { callProcessProfilerAnswers } from "@/lib/firebase-functions";
import { isFirebaseConfigured } from "@/lib/firebase";
import {
  buildAnswersV2,
  countFlowSteps,
  FLOW_SPECS,
  flowIdForSelection,
  totalWizardSteps,
  type WizardFlowId,
} from "@/lib/diagnostic-wizard-flows";
import type { CompanyPath, UserType } from "@/lib/diagnostics/types";

type DiagnosticWizardProps = {
  messages: SiteMessages;
};

function pushGenerateDiagnosticEvent(type: UserType) {
  const windowWithDataLayer = window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
  };

  windowWithDataLayer.dataLayer = windowWithDataLayer.dataLayer ?? [];
  windowWithDataLayer.dataLayer.push({
    event: "generate_diagnostic",
    type,
    step: "final",
  });
}

const FLOW_MSG_KEY: Record<
  WizardFlowId,
  keyof SiteMessages["diagnostic"]["flows"]
> = {
  companyAutomation: "companyAutomation",
  companyNewProduct: "companyNewProduct",
  companyUnsure: "companyUnsure",
  startup: "startup",
  freelancer: "freelancer",
};

type Phase = "profile" | "companyGoal" | "flow" | "contact";

function OptionButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full cursor-pointer rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-colors sm:text-base ${
        selected
          ? "border-aurora-blue/50 bg-white/10 text-foreground"
          : "border-white/10 bg-white/[0.03] text-foreground-muted hover:border-white/20 hover:bg-white/[0.06] hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

export function DiagnosticWizard({ messages }: DiagnosticWizardProps) {
  const d = messages.diagnostic;
  const router = useRouter();
  const locale = messages.locale;

  const [phase, setPhase] = useState<Phase>("profile");
  const [userType, setUserType] = useState<UserType | null>(null);
  const [companyPath, setCompanyPath] = useState<CompanyPath | null>(null);
  const [flowStepIndex, setFlowStepIndex] = useState(0);
  const [flowValues, setFlowValues] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [webUrl, setWebUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const flowId = useMemo(
    () => (userType ? flowIdForSelection(userType, companyPath) : null),
    [userType, companyPath],
  );
  const isFirstStep = phase === "profile";

  const totalSteps = totalWizardSteps(userType, companyPath);

  const currentStepNumber = useMemo(() => {
    if (phase === "profile") return 1;
    if (phase === "companyGoal") return 2;
    if (phase === "contact") return totalSteps;
    if (phase === "flow" && flowId !== null) {
      return 1 + (userType === "company" ? 1 : 0) + flowStepIndex + 1;
    }
    return 1;
  }, [phase, userType, flowStepIndex, flowId, totalSteps]);

  const progressLabel = useMemo(() => {
    return d.progress
      .replace("{current}", String(currentStepNumber))
      .replace("{total}", String(totalSteps));
  }, [d.progress, currentStepNumber, totalSteps]);

  const canNext = useCallback(() => {
    if (phase === "profile") return userType !== null;
    if (phase === "companyGoal") return companyPath !== null;
    if (phase === "flow" && flowId !== null) {
      const spec = FLOW_SPECS[flowId][flowStepIndex];
      if (!spec) return false;
      const v = (flowValues[spec.fieldKey] ?? "").trim();
      if (spec.kind === "urgency")
        return v === "high" || v === "medium" || v === "low";
      return v.length >= 1;
    }
    if (phase === "contact") {
      return (
        name.trim().length >= 2 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      );
    }
    return false;
  }, [
    phase,
    userType,
    companyPath,
    flowId,
    flowStepIndex,
    flowValues,
    name,
    email,
  ]);

  const goNext = () => {
    if (!canNext()) return;
    if (phase === "profile") {
      if (userType === "company") setPhase("companyGoal");
      else {
        setFlowStepIndex(0);
        setFlowValues({});
        setPhase("flow");
      }
      return;
    }
    if (phase === "companyGoal") {
      setFlowStepIndex(0);
      setFlowValues({});
      setPhase("flow");
      return;
    }
    if (phase === "flow" && flowId !== null) {
      const max = countFlowSteps(flowId) - 1;
      if (flowStepIndex < max) {
        setFlowStepIndex((s) => s + 1);
      } else {
        setPhase("contact");
      }
      return;
    }
  };

  const goBack = () => {
    setError(null);
    if (phase === "contact") {
      setPhase("flow");
      if (flowId) setFlowStepIndex(countFlowSteps(flowId) - 1);
      return;
    }
    if (phase === "flow" && flowId !== null) {
      if (flowStepIndex > 0) {
        setFlowStepIndex((s) => s - 1);
        return;
      }
      if (userType === "company") {
        setPhase("companyGoal");
        return;
      }
      setPhase("profile");
      return;
    }
    if (phase === "companyGoal") {
      setCompanyPath(null);
      setPhase("profile");
      return;
    }
  };

  const setFlowField = (key: string, value: string) => {
    setFlowValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!canNext() || !flowId || !userType) return;
    setError(null);
    if (!isFirebaseConfigured()) {
      setError(d.errorNotConfigured);
      return;
    }
    setSubmitting(true);
    try {
      const answers = buildAnswersV2(flowId, flowValues);
      const res = await callProcessProfilerAnswers({
        answers,
        contact: {
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          phone: phone.trim(),
          webUrl: webUrl.trim(),
        },
        uiLocale: locale,
        userAgent:
          typeof navigator !== "undefined"
            ? navigator.userAgent.slice(0, 512)
            : undefined,
      });
      const reportId = res.data?.reportId;
      if (!reportId) {
        setError(d.errorGeneric);
        return;
      }
      pushGenerateDiagnosticEvent(userType);
      router.push(`/${locale}/report/${encodeURIComponent(reportId)}`);
    } catch {
      setError(d.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  };

  const renderFlowStep = () => {
    if (!flowId) return null;
    const spec = FLOW_SPECS[flowId][flowStepIndex];
    const flowMsgs = d.flows[FLOW_MSG_KEY[flowId]];
    const copy = flowMsgs[flowStepIndex];
    if (!spec || !copy) return null;

    if (spec.kind === "urgency") {
      return (
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-foreground">
            {copy.title}
          </h2>
          <p className="text-sm leading-relaxed text-foreground-muted">
            {copy.description}
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <OptionButton
              selected={flowValues.urgency_level === "high"}
              onClick={() => setFlowField("urgency_level", "high")}
            >
              {d.optionUrgent}
            </OptionButton>
            <OptionButton
              selected={flowValues.urgency_level === "medium"}
              onClick={() => setFlowField("urgency_level", "medium")}
            >
              {d.optionSoon}
            </OptionButton>
            <OptionButton
              selected={flowValues.urgency_level === "low"}
              onClick={() => setFlowField("urgency_level", "low")}
            >
              {d.optionExploring}
            </OptionButton>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-foreground">
          {copy.title}
        </h2>
        <p className="text-sm leading-relaxed text-foreground-muted">
          {copy.description}
        </p>
        <textarea
          value={flowValues[spec.fieldKey] ?? ""}
          onChange={(e) => setFlowField(spec.fieldKey, e.target.value)}
          placeholder={copy.placeholder}
          rows={6}
          className="mt-2 w-full rounded-xl border border-white/10 bg-surface-card/50 px-4 py-3 text-sm text-foreground placeholder:text-foreground-muted/50 focus:border-aurora-blue/40 focus:outline-none focus:ring-2 focus:ring-aurora-blue/20"
        />
        <p className="mt-2 text-xs leading-relaxed text-foreground-muted/85">
          {d.flowStepDetailHint}
        </p>
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl">
      {!isFirstStep ? (
        <p className="mb-8 text-sm text-foreground-muted">{progressLabel}</p>
      ) : null}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${phase}-${flowStepIndex}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {phase === "profile" && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                {d.stepProfileTitle}
              </h2>
              <p className="text-foreground-muted">{d.stepProfileSubtitle}</p>
              <div className="mt-6 flex flex-col gap-2">
                <OptionButton
                  selected={userType === "company"}
                  onClick={() => setUserType("company")}
                >
                  {d.optionCompany}
                </OptionButton>
                <OptionButton
                  selected={userType === "startup"}
                  onClick={() => setUserType("startup")}
                >
                  {d.optionStartup}
                </OptionButton>
                <OptionButton
                  selected={userType === "freelancer"}
                  onClick={() => setUserType("freelancer")}
                >
                  {d.optionFreelancer}
                </OptionButton>
              </div>
            </div>
          )}

          {phase === "companyGoal" && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-foreground">
                {d.stepCompanyGoalTitle}
              </h2>
              <div className="mt-6 flex flex-col gap-2">
                <OptionButton
                  selected={companyPath === "automation"}
                  onClick={() => setCompanyPath("automation")}
                >
                  {d.optionAutomation}
                </OptionButton>
                <OptionButton
                  selected={companyPath === "new_product"}
                  onClick={() => setCompanyPath("new_product")}
                >
                  {d.optionNewProduct}
                </OptionButton>
                <OptionButton
                  selected={companyPath === "unsure"}
                  onClick={() => setCompanyPath("unsure")}
                >
                  {d.optionUnsure}
                </OptionButton>
              </div>
            </div>
          )}

          {phase === "flow" && renderFlowStep()}

          {phase === "contact" && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-foreground">
                {d.stepContactTitle}
              </h2>
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-medium text-foreground-muted">
                    {d.labels.name}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={d.placeholders.name}
                    autoComplete="name"
                    className="mt-1 w-full rounded-lg border border-white/10 bg-surface-card/50 px-3 py-2.5 text-sm text-foreground focus:border-aurora-blue/40 focus:outline-none focus:ring-2 focus:ring-aurora-blue/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground-muted">
                    {d.labels.email}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={d.placeholders.email}
                    autoComplete="email"
                    className="mt-1 w-full rounded-lg border border-white/10 bg-surface-card/50 px-3 py-2.5 text-sm text-foreground focus:border-aurora-blue/40 focus:outline-none focus:ring-2 focus:ring-aurora-blue/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground-muted">
                    {d.labels.company}
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder={d.placeholders.company}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-surface-card/50 px-3 py-2.5 text-sm text-foreground focus:border-aurora-blue/40 focus:outline-none focus:ring-2 focus:ring-aurora-blue/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground-muted">
                    {d.labels.phone}
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={d.placeholders.phone}
                    autoComplete="tel"
                    className="mt-1 w-full rounded-lg border border-white/10 bg-surface-card/50 px-3 py-2.5 text-sm text-foreground focus:border-aurora-blue/40 focus:outline-none focus:ring-2 focus:ring-aurora-blue/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground-muted">
                    {userType === "freelancer"
                      ? d.labels.webUrlFreelancer
                      : d.labels.webUrlCompany}
                  </label>
                  <input
                    type="text"
                    inputMode="url"
                    value={webUrl}
                    onChange={(e) => setWebUrl(e.target.value)}
                    placeholder={
                      userType === "freelancer"
                        ? d.placeholders.webUrlFreelancer
                        : d.placeholders.webUrlCompany
                    }
                    autoComplete="url"
                    className="mt-1 w-full rounded-lg border border-white/10 bg-surface-card/50 px-3 py-2.5 text-sm text-foreground placeholder:text-foreground-muted/60 focus:border-aurora-blue/40 focus:outline-none focus:ring-2 focus:ring-aurora-blue/20"
                  />
                  <p className="mt-1.5 text-xs leading-relaxed text-foreground-muted/85">
                    {d.webUrlOptionalHint}
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {error ? (
        <p className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <div
        className={`mt-10 flex flex-wrap items-center gap-3 ${isFirstStep ? "justify-end" : "justify-between"}`}
      >
        {!isFirstStep ? (
          <button
            type="button"
            onClick={goBack}
            disabled={submitting}
            className="cursor-pointer text-sm font-medium text-foreground-muted transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            {d.back}
          </button>
        ) : null}
        {phase !== "contact" ? (
          <button
            type="button"
            onClick={goNext}
            disabled={!canNext() || submitting}
            className="gradient-border-mask inline-flex min-w-[8rem] cursor-pointer items-center justify-center rounded-full bg-surface-card px-6 py-2.5 text-sm font-semibold text-foreground transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {d.next}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={!canNext() || submitting}
            className="gradient-border-mask inline-flex min-w-[10rem] cursor-pointer items-center justify-center rounded-full bg-surface-card px-6 py-2.5 text-sm font-semibold text-foreground transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? d.submitting : d.submit}
          </button>
        )}
      </div>
    </div>
  );
}
