import Link from "next/link";
import type { ReactNode } from "react";

import { AdminNavigation } from "@/components/admin/admin-navigation";
import { BrandIdentity } from "@/components/brand/brand-identity";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/features/auth/actions";

export function AdminPortalShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <a href="#admin-content" className="sr-only z-[100] rounded-md bg-brand px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to administration content
      </a>
      <header className="sticky top-0 z-40 border-b border-brand/10 bg-background/95 backdrop-blur-lg">
        <div className="mx-auto flex min-h-20 max-w-[90rem] items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
          <BrandIdentity href="/admin" sublabel="Administration" priority className="py-2" />
          <div className="flex items-center gap-2">
            <Link href="/" className="hidden min-h-11 items-center rounded-pill px-4 text-sm font-semibold text-brand hover:bg-surface-subtle sm:inline-flex">Public Website</Link>
            <form action={logoutAction}><Button type="submit" variant="secondary" size="sm">Sign Out</Button></form>
          </div>
        </div>
        <div className="overflow-x-auto border-t border-brand/10 bg-surface xl:hidden"><AdminNavigation mobile /></div>
      </header>
      <div className="mx-auto grid w-full max-w-[90rem] xl:grid-cols-[14rem_minmax(0,1fr)]">
        <aside className="hidden border-r border-brand/10 px-5 py-8 xl:block">
          <div className="sticky top-28">
            <p className="px-4 text-xs font-bold uppercase tracking-[0.14em] text-brand/60">Manage</p>
            <div className="mt-4"><AdminNavigation /></div>
          </div>
        </aside>
        <main id="admin-content" className="min-w-0 px-5 py-8 sm:px-6 sm:py-10 lg:px-10 xl:px-12 xl:py-12">{children}</main>
      </div>
    </div>
  );
}
