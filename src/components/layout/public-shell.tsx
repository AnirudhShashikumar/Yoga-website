import type { ReactNode } from "react";

import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-brand-strong px-4 py-3 font-semibold text-white transition-transform focus:translate-y-0"
      >
        Skip to main content
      </a>
      <PublicHeader />
      <main id="main-content">{children}</main>
      <PublicFooter />
      <FloatingWhatsApp />
    </>
  );
}

