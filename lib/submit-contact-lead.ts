"use client";

import { addDoc, collection } from "firebase/firestore";
import { getFirestoreDb, getLeadsCollectionName, isFirebaseConfigured } from "@/lib/firebase";

export type ContactLeadPayload = {
  name: string;
  email: string;
  message: string;
  company: string;
  phone: string;
  requirementType: string;
};

/**
 * Crea un documento en Firestore desde el cliente.
 * La seguridad depende de reglas en `firestore.rules` (solo create, campos acotados).
 */
export async function submitContactLead(payload: ContactLeadPayload): Promise<void> {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase no está configurado.");
  }

  const db = getFirestoreDb();
  const col = collection(db, getLeadsCollectionName());

  const ua =
              typeof navigator !== "undefined" && typeof navigator.userAgent === "string"
                ? navigator.userAgent.slice(0, 512)
                : "";

  await addDoc(col, {
    name: payload.name.trim().slice(0, 200),
    email: payload.email.trim().toLowerCase().slice(0, 320),
    message: payload.message.trim().slice(0, 8000),
    company: payload.company.trim().slice(0, 200),
    phone: payload.phone.trim().slice(0, 80),
    requirementType: payload.requirementType.trim().slice(0, 64),
    userAgent: ua,
    source: "aurora-web",
    createdAt: new Date().toISOString(),
  });
}
