import Link from "next/link";
import type { ReactNode } from "react";

import { BrandIdentity } from "@/components/brand/brand-identity";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(205,229,214,0.75),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(220,234,242,0.65),transparent_38%)]"
      />
      <a
        href="#auth-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-brand-strong px-4 py-3 font-semibold text-white transition-transform focus:translate-y-0"
      >
        Skip to authentication form
      </a>
      <header className="relative z-10 border-b border-brand/10 bg-background/75 backdrop-blur-lg">
        <div className="mx-auto flex min-h-20 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
          <BrandIdentity priority className="py-2" />
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-pill px-4 text-sm font-semibold text-brand transition-colors hover:bg-surface"
          >
            Back to website
          </Link>
        </div>
      </header>
      <main
        id="auth-content"
        className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-center px-5 py-12 sm:px-6 sm:py-16 lg:min-h-[calc(100dvh-5rem)] lg:px-8"
      >
        {children}
      </main>
    </div>
  );
}

type AuthPanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthPanel({ eyebrow, title, description, children }: AuthPanelProps) {
  return (
    <section className="w-full max-w-xl rounded-[2rem] border border-brand/10 bg-surface/95 p-6 shadow-floating sm:p-9">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand/70">{eyebrow}</p>
      <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-brand-strong sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 leading-7 text-muted">{description}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}
