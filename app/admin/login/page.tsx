"use client";

import { FirebaseError } from "firebase/app";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isFirebaseConfigured } from "@/lib/firebase";
import { signInAdmin, watchAuthState } from "@/lib/firebase-auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setReady(true);
      return;
    }
    const unsub = watchAuthState((user) => {
      if (user) {
        router.replace("/admin");
        return;
      }
      setReady(true);
    });
    return () => unsub();
  }, [router]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsFormValid(e.currentTarget.checkValidity());
    if (!e.currentTarget.checkValidity()) return;

    if (!isFirebaseConfigured()) {
      setError("Firebase no está configurado (.env).");
      return;
    }
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    setBusy(true);
    try {
      await signInAdmin(email, password);
      router.replace("/admin");
    } catch (err) {
      if (err instanceof FirebaseError) {
        if (
          err.code === "auth/invalid-credential" ||
          err.code === "auth/wrong-password" ||
          err.code === "auth/user-not-found"
        ) {
          setError("Correo o contraseña incorrectos.");
          return;
        }
        if (err.code === "auth/too-many-requests") {
          setError("Demasiados intentos. Prueba más tarde.");
          return;
        }
        setError(err.message);
        return;
      }
      setError("No se pudo iniciar sesión.");
    } finally {
      setBusy(false);
    }
  }

  if (!ready) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-surface-900 text-foreground-muted">
        Cargando…
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] bg-surface-900 px-4 py-16 text-foreground">
      <div className="mx-auto w-full max-w-md">
        <p className="mb-2 text-center text-sm text-foreground-muted">
          <Link href="/" className="underline-offset-2 hover:underline">
            ← Volver al sitio
          </Link>
        </p>
        <h1 className="mb-2 font-display text-2xl font-bold tracking-tight">Admin AURORA</h1>
        <p className="mb-8 text-sm text-foreground-muted">
          Inicia sesión con el usuario creado en Firebase Authentication.
        </p>

        {!isFirebaseConfigured() && (
          <p className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            Configura las variables{" "}
            <code className="rounded bg-white/10 px-1">NEXT_PUBLIC_FIREBASE_*</code> en{" "}
            <code className="rounded bg-white/10 px-1">.env</code>.
          </p>
        )}

        <form
          onSubmit={onSubmit}
          onInput={(e) => setIsFormValid(e.currentTarget.checkValidity())}
          onChange={(e) => setIsFormValid(e.currentTarget.checkValidity())}
          className="gradient-border-mask space-y-4 rounded-2xl bg-surface-card p-6 shadow-xl"
        >
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium">
              Correo
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="username"
              required
              className="w-full rounded-xl border border-white/10 bg-surface-900/80 px-4 py-3 outline-none focus:border-aurora-blue/60 focus:ring-2 focus:ring-aurora-blue/25"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium">
              Contraseña
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-white/10 bg-surface-900/80 px-4 py-3 outline-none focus:border-aurora-blue/60 focus:ring-2 focus:ring-aurora-blue/25"
            />
          </div>
          {error && (
            <p className="rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-200" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy || !isFirebaseConfigured() || !isFormValid}
            className="w-full rounded-full bg-gradient-to-r from-aurora-purple to-aurora-blue py-3.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
