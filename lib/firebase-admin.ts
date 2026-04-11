import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

const COLLECTION_ARTICLES =
  process.env.NEXT_PUBLIC_FIRESTORE_ARTICLES_COLLECTION ?? "articles";

export function isFirebaseAdminConfigured(): boolean {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim());
}

/**
 * Parses service account JSON from env. Handles invalid JSON when `private_key`
 * contains literal newlines (common in .env pastes) instead of `\n` escapes.
 */
function parseServiceAccountJson(raw: string): {
  project_id?: string;
  client_email?: string;
  private_key?: string;
} {
  const t = raw.trim();
  try {
    return JSON.parse(t) as { project_id?: string; client_email?: string; private_key?: string };
  } catch {
    const keyLabel = '"private_key"';
    const pkIdx = t.indexOf(keyLabel);
    const endMarker = "-----END PRIVATE KEY-----";
    if (pkIdx === -1 || t.indexOf(endMarker) === -1) {
      throw new SyntaxError(
        "FIREBASE_SERVICE_ACCOUNT_JSON: JSON inválido. Usa un JSON en una sola línea con \\n en private_key, o revisa comillas y saltos de línea.",
      );
    }
    const colonIdx = t.indexOf(":", pkIdx + keyLabel.length);
    const openQuote = t.indexOf('"', colonIdx + 1);
    if (openQuote === -1) {
      throw new SyntaxError("FIREBASE_SERVICE_ACCOUNT_JSON: falta el valor de private_key.");
    }
    const valueStart = openQuote + 1;
    const endIdx = t.indexOf(endMarker, valueStart);
    if (endIdx === -1) {
      throw new SyntaxError("FIREBASE_SERVICE_ACCOUNT_JSON: private_key incompleto (PEM).");
    }
    const afterPem = endIdx + endMarker.length;
    const closeQuote = t.indexOf('"', afterPem);
    if (closeQuote === -1) {
      throw new SyntaxError("FIREBASE_SERVICE_ACCOUNT_JSON: falta comilla de cierre en private_key.");
    }
    const inner = t.slice(valueStart, closeQuote);
    const repaired = t.slice(0, openQuote) + JSON.stringify(inner) + t.slice(closeQuote + 1);
    return JSON.parse(repaired) as {
      project_id?: string;
      client_email?: string;
      private_key?: string;
    };
  }
}

function getFirebaseAdminApp(): App {
  if (getApps().length) return getApps()[0]!;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_JSON no está definido. Añade las credenciales del service account (JSON en una sola línea) para leer el blog en el servidor.",
    );
  }
  const parsed = parseServiceAccountJson(raw);
  return initializeApp({
    credential: cert({
      projectId: parsed.project_id,
      clientEmail: parsed.client_email,
      privateKey: parsed.private_key?.replace(/\\n/g, "\n"),
    }),
  });
}

export function getAdminFirestore(): Firestore {
  getFirebaseAdminApp();
  return getFirestore();
}

export function getArticlesCollectionName(): string {
  return COLLECTION_ARTICLES;
}
