import { redirect } from "next/navigation";
import type { Metadata, Route } from "next";
import type { ReactNode } from "react";

import { AuthUnavailable } from "@/components/auth/protected-shell";
import { CustomerPortalShell } from "@/components/customer/customer-portal-shell";
import { resolvePortalAccess } from "@/lib/auth/access";
import { getAuthContext } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "My Account", template: "%s | My Account" },
  robots: { index: false, follow: false },
};

export default async function CustomerPortalLayout({ children }: { children: ReactNode }) {
  const auth = await getAuthContext();
  const access = resolvePortalAccess(auth, "customer");

  if (access.status === "redirect") redirect(access.destination as Route);
  if (access.status === "unavailable") return <AuthUnavailable />;

  return <CustomerPortalShell>{children}</CustomerPortalShell>;
}
