import { redirect } from "next/navigation";
import type { Route } from "next";
import type { ReactNode } from "react";

import { AuthUnavailable, ProtectedShell } from "@/components/auth/protected-shell";
import { resolvePortalAccess } from "@/lib/auth/access";
import { getAuthContext } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminPortalLayout({ children }: { children: ReactNode }) {
  const auth = await getAuthContext();
  const access = resolvePortalAccess(auth, "admin");

  if (access.status === "redirect") redirect(access.destination as Route);
  if (access.status === "unavailable") return <AuthUnavailable />;

  return <ProtectedShell portal="Administration">{children}</ProtectedShell>;
}
