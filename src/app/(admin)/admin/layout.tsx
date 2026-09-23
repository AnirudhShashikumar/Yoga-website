import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AuthUnavailable, ProtectedShell } from "@/components/auth/protected-shell";
import { getAuthContext } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminPortalLayout({ children }: { children: ReactNode }) {
  const auth = await getAuthContext();

  if (auth.status === "anonymous") redirect("/login?next=/admin");
  if (auth.status === "unavailable") return <AuthUnavailable />;
  if (auth.role !== "admin") redirect("/dashboard");

  return <ProtectedShell portal="Administration">{children}</ProtectedShell>;
}
