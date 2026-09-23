import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { logoutAction } from "@/features/auth/actions";

export function ProtectedShell({
  portal,
  children,
}: {
  portal: "Customer Account" | "Administration";
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-surface-subtle">
      <header className="border-b border-brand/10 bg-surface">
        <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <Link href="/" className="font-display text-lg font-semibold text-brand-strong sm:text-xl">
              {siteConfig.name}
            </Link>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand/65">{portal}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="hidden min-h-11 items-center rounded-pill px-4 text-sm font-semibold text-brand hover:bg-surface-subtle sm:inline-flex">
              Public Website
            </Link>
            <form action={logoutAction}>
              <Button type="submit" variant="secondary" size="sm">Sign Out</Button>
            </form>
          </div>
        </div>
      </header>
      <main id="main-content" className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
        {children}
      </main>
    </div>
  );
}

export function AuthUnavailable() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-5 py-12">
      <section className="w-full max-w-lg rounded-[2rem] border border-brand/10 bg-surface p-7 text-center shadow-floating sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand/70">Account Service</p>
        <h1 className="mt-3 font-display text-3xl font-medium text-brand-strong">Account access is temporarily unavailable.</h1>
        <p className="mt-4 leading-7 text-muted">Protected information has not been displayed. Please try again later.</p>
        <Link href="/" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-pill bg-brand px-6 text-sm font-semibold text-white shadow-action hover:bg-brand-strong">
          Return Home
        </Link>
      </section>
    </main>
  );
}
