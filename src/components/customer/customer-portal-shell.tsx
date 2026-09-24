import Link from "next/link";
import type { ReactNode } from "react";

import { CustomerNavigation } from "@/components/customer/customer-navigation";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { logoutAction } from "@/features/auth/actions";

export function CustomerPortalShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <a
        href="#dashboard-content"
        className="sr-only z-[100] rounded-md bg-brand px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to dashboard content
      </a>

      <header className="sticky top-0 z-40 border-b border-brand/10 bg-background/95 backdrop-blur-lg">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex min-w-0 flex-col py-3">
            <span className="truncate font-display text-lg font-semibold text-brand-strong sm:text-xl">
              {siteConfig.name}
            </span>
            <span className="truncate text-[0.68rem] font-bold uppercase tracking-[0.14em] text-brand/70">
              Customer Account
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden min-h-11 items-center rounded-pill px-4 text-sm font-semibold text-brand hover:bg-surface-subtle sm:inline-flex"
            >
              Public Website
            </Link>
            <form action={logoutAction}>
              <Button type="submit" variant="secondary" size="sm">
                Sign Out
              </Button>
            </form>
          </div>
        </div>

        <div className="overflow-x-auto border-t border-brand/10 bg-surface lg:hidden">
          <CustomerNavigation mobile />
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside className="hidden border-r border-brand/10 px-6 py-10 lg:block">
          <div className="sticky top-28">
            <p className="px-4 text-xs font-bold uppercase tracking-[0.14em] text-brand/60">
              Your practice
            </p>
            <div className="mt-4">
              <CustomerNavigation />
            </div>
            <Link
              href="/"
              className="mt-8 flex min-h-11 items-center rounded-xl border border-brand/10 px-4 text-sm font-semibold text-brand hover:bg-surface-subtle"
            >
              Public Website
            </Link>
          </div>
        </aside>

        <main
          id="dashboard-content"
          className="min-w-0 px-5 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12 xl:px-12"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
