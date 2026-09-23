import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AuthUnavailable, ProtectedShell } from "@/components/auth/protected-shell";
import { getAuthContext } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function CustomerPortalLayout({ children }: { children: ReactNode }) {
  const auth = await getAuthContext();

  if (auth.status === "anonymous") redirect("/login?next=/dashboard");
  if (auth.status === "unavailable") return <AuthUnavailable />;
  if (auth.role === "admin") redirect("/admin");

  return <ProtectedShell portal="Customer Account">{children}</ProtectedShell>;
}
