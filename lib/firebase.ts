import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

function readConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}

export function isFirebaseConfigured(): boolean {
  const c = readConfig();
  return Boolean(c.apiKey && c.projectId && c.appId);
}

export function getFirebaseApp(): FirebaseApp {
  const config = readConfig();
  if (!config.apiKey || !config.projectId || !config.appId) {
    throw new Error(
      "Firebase no está configurado. Define NEXT_PUBLIC_FIREBASE_* en .env (ver .env.example).",
    );
  }
  if (getApps().length) return getApp();
  return initializeApp(config);
}

export function getFirestoreDb(): Firestore {
  return getFirestore(getFirebaseApp());
}

export function getLeadsCollectionName(): string {
  return process.env.NEXT_PUBLIC_FIRESTORE_CONTACT_COLLECTION ?? "contact_requests";
}

export function getDiagnosticsCollectionName(): string {
  return process.env.NEXT_PUBLIC_FIRESTORE_DIAGNOSTICS_COLLECTION ?? "diagnostics";
}
