import { getFunctions, httpsCallable, type HttpsCallableResult } from "firebase/functions";
import { getFirebaseApp } from "@/lib/firebase";
import type { ProfilerAnswers } from "@/lib/diagnostics/types";

export function getFunctionsRegion(): string {
  return process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION ?? "us-central1";
}

export type ProfilerSubmitPayload = {
  answers: ProfilerAnswers;
  contact: {
    name: string;
    email: string;
    company: string;
    phone: string;
    webUrl?: string;
  };
  uiLocale: "es" | "en";
  userAgent?: string;
};

export type ProfilerSubmitResponse = {
  reportId: string;
};

export async function callProcessProfilerAnswers(
  data: ProfilerSubmitPayload,
): Promise<HttpsCallableResult<ProfilerSubmitResponse>> {
  const fn = getFunctions(getFirebaseApp(), getFunctionsRegion());
  const callable = httpsCallable<ProfilerSubmitPayload, ProfilerSubmitResponse>(
    fn,
    "processProfilerAnswers",
  );
  return callable(data);
}
