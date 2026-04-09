"use client";

import { FirebaseError } from "firebase/app";
import { useReducer } from "react";
import { contact } from "@/content/site";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";
import { isFirebaseConfigured } from "@/lib/firebase";
import { submitContactLead } from "@/lib/submit-contact-lead";

type State = {
  status: "idle" | "loading" | "success" | "error";
  message: string;
};

type Action =
  | { type: "start" }
  | { type: "success" }
  | { type: "error"; message: string }
  | { type: "reset" };

function formReducer(state: State, action: Action): State {
  switch (action.type) {
    case "start":
      return { status: "loading", message: "" };
    case "success":
      return { status: "success", message: "Gracias. Te contactaremos pronto." };
    case "error":
      return { status: "error", message: action.message };
    case "reset":
      return { status: "idle", message: "" };
    default:
      return state;
  }
}

export function ContactForm() {
  const [state, dispatch] = useReducer(formReducer, {
    status: "idle",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch({ type: "start" });
    const form = e.currentTarget;
    const fd = new FormData(form);

    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();
    const company = String(fd.get("company") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const requirementType = String(fd.get("requirementType") ?? "").trim();

    if (!isFirebaseConfigured()) {
      dispatch({
        type: "error",
        message: "Formulario no disponible: configura Firebase en .env (NEXT_PUBLIC_FIREBASE_*).",
      });
      return;
    }

    try {
      await submitContactLead({
        name,
        email,
        message,
        company,
        phone,
        requirementType,
      });
      dispatch({ type: "success" });
      form.reset();
    } catch (err) {
      if (err instanceof FirebaseError && err.code === "permission-denied") {
        dispatch({
          type: "error",
          message: "No autorizado. Revisa las reglas de Firestore para esta colección.",
        });
        return;
      }
      const msg = err instanceof Error ? err.message : "No se pudo enviar. Intenta de nuevo.";
      dispatch({ type: "error", message: msg });
    }
  }

  return (
    <section
      id={contact.id}
      className="scroll-mt-24 bg-surface-900 py-20 md:py-28"
      aria-labelledby={`${contact.id}-heading`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="space-y-4">
              <SectionTitle id={`${contact.id}-heading`}>{contact.title}</SectionTitle>
              <p className="max-w-md text-foreground-muted">{contact.description}</p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <form
              onSubmit={handleSubmit}
              className="gradient-border-mask relative space-y-5 rounded-3xl bg-surface-card p-6 shadow-xl md:p-8"
              noValidate
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
                    Nombre <span className="text-aurora-purple">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    minLength={2}
                    className="w-full rounded-xl border border-white/10 bg-surface-900/80 px-4 py-3 text-foreground placeholder:text-foreground-muted/50 outline-none transition-[box-shadow,border-color] focus:border-aurora-blue/60 focus:ring-2 focus:ring-aurora-blue/25"
                    placeholder="Tu nombre"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                    Correo <span className="text-aurora-purple">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-white/10 bg-surface-900/80 px-4 py-3 text-foreground placeholder:text-foreground-muted/50 outline-none transition-[box-shadow,border-color] focus:border-aurora-blue/60 focus:ring-2 focus:ring-aurora-blue/25"
                    placeholder="nombre@empresa.com"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-foreground">
                    Empresa
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    className="w-full rounded-xl border border-white/10 bg-surface-900/80 px-4 py-3 text-foreground placeholder:text-foreground-muted/50 outline-none transition-[box-shadow,border-color] focus:border-aurora-blue/60 focus:ring-2 focus:ring-aurora-blue/25"
                    placeholder="Opcional"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-foreground">
                    Teléfono
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className="w-full rounded-xl border border-white/10 bg-surface-900/80 px-4 py-3 text-foreground placeholder:text-foreground-muted/50 outline-none transition-[box-shadow,border-color] focus:border-aurora-blue/60 focus:ring-2 focus:ring-aurora-blue/25"
                    placeholder="Opcional"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="requirementType"
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    Tipo de necesidad
                  </label>
                  <select
                    id="requirementType"
                    name="requirementType"
                    defaultValue=""
                    className="w-full cursor-pointer rounded-xl border border-white/10 bg-surface-900/80 px-4 py-3 text-foreground outline-none transition-[box-shadow,border-color] focus:border-aurora-blue/60 focus:ring-2 focus:ring-aurora-blue/25"
                  >
                    {contact.requirementTypes.map((opt) => (
                      <option key={opt.value || "empty"} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
                    Requerimiento <span className="text-aurora-purple">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    minLength={10}
                    rows={5}
                    className="w-full resize-y rounded-xl border border-white/10 bg-surface-900/80 px-4 py-3 text-foreground placeholder:text-foreground-muted/50 outline-none transition-[box-shadow,border-color] focus:border-aurora-blue/60 focus:ring-2 focus:ring-aurora-blue/25"
                    placeholder="Cuéntanos alcance, plazos y cualquier contexto útil."
                  />
                </div>
              </div>

              {state.status === "success" && (
                <p className="rounded-xl bg-aurora-blue/15 px-4 py-3 text-sm text-foreground" role="status">
                  {state.message}
                </p>
              )}
              {state.status === "error" && (
                <p className="rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-200" role="alert">
                  {state.message}
                </p>
              )}

              <button
                type="submit"
                disabled={state.status === "loading"}
                className="w-full rounded-full bg-gradient-to-r from-aurora-purple to-aurora-blue py-4 text-base font-semibold text-white shadow-lg transition-[transform,opacity] enabled:hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-12"
              >
                {state.status === "loading" ? "Enviando…" : "Enviar solicitud"}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
