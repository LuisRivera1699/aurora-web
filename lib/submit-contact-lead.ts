"use client";

import { isFirebaseConfigured } from "@/lib/firebase";
import { callSubmitContactLead } from "@/lib/firebase-functions";

export type ContactLeadPayload = {
  name: string;
  email: string;
  message: string;
  company: string;
  phone: string;
  requirementType: string;
  uiLocale: "es" | "en";
};

/**
 * Captura el lead en backend para poder escribir en Firestore y enviar correos sin exponer secretos.
 */
export async function submitContactLead(payload: ContactLeadPayload): Promise<void> {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase no está configurado.");
  }

  const ua =
    typeof navigator !== "undefined" && typeof navigator.userAgent === "string"
      ? navigator.userAgent.slice(0, 512)
      : "";

  await callSubmitContactLead({
    name: payload.name.trim().slice(0, 200),
    email: payload.email.trim().toLowerCase().slice(0, 320),
    message: payload.message.trim().slice(0, 8000),
    company: payload.company.trim().slice(0, 200),
    phone: payload.phone.trim().slice(0, 80),
    requirementType: payload.requirementType.trim().slice(0, 64),
    uiLocale: payload.uiLocale,
    userAgent: ua,
  });
}
