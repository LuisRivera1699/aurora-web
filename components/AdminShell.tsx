"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import { signOutAdmin } from "@/lib/firebase-auth";

type AdminShellProps = {
  title: string;
  userEmail?: string | null;
  actions?: ReactNode;
  children: ReactNode;
};

const NAV_ITEMS = [
  { href: "/admin", label: "Leads" },
  { href: "/admin/diagnostics", label: "Diagnóstico" },
] as const;

export default function AdminShell({ title, userEmail, actions, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  async function onSignOut() {
    setSigningOut(true);
    setSignOutError(null);
    try {
      await signOutAdmin();
      router.replace("/admin/login");
    } catch {
      setSignOutError("No se pudo cerrar sesión.");
      setSigningOut(false);
    }
  }

  return (
    <div className="min-h-[100svh] bg-surface-900 text-foreground lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="border-b border-white/10 bg-surface-850/95 px-4 py-4 backdrop-blur lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:flex-col lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-aurora-blue">
            Aurora Admin
          </p>
          <p className="mt-2 truncate text-xs text-foreground-muted" title={userEmail ?? undefined}>
            {userEmail ? `Sesión: ${userEmail}` : "Panel privado"}
          </p>
        </div>

        <nav className="mt-5 flex gap-2 lg:flex-col" aria-label="Admin">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "rounded-2xl px-4 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-white text-surface-900 shadow-lg shadow-aurora-blue/10"
                    : "text-foreground-muted hover:bg-white/5 hover:text-foreground",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 lg:mt-auto">
          <button
            type="button"
            onClick={() => void onSignOut()}
            disabled={signingOut}
            className="w-full rounded-2xl border border-white/15 px-4 py-3 text-left text-sm font-medium text-foreground-muted transition hover:bg-white/5 hover:text-foreground disabled:opacity-50"
          >
            {signingOut ? "Cerrando sesión…" : "Cerrar sesión"}
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="border-b border-white/10 bg-surface-900/90 px-4 py-5 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold">{title}</h1>
              <p className="mt-1 text-sm text-foreground-muted">Gestión interna de solicitudes.</p>
            </div>
            {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
          </div>
        </header>

        <main className="px-4 py-8 sm:px-6 lg:px-8">
          {signOutError ? (
            <p className="mb-6 rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-200" role="alert">
              {signOutError}
            </p>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  );
}
