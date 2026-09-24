import type { AuthContext } from "@/lib/auth/session";

export type PortalKind = "customer" | "admin";

export type PortalAccess =
  | { status: "allowed" }
  | { status: "unavailable" }
  | { status: "redirect"; destination: string };

export function resolvePortalAccess(
  auth: AuthContext,
  portal: PortalKind,
): PortalAccess {
  const home = portal === "admin" ? "/admin" : "/dashboard";

  if (auth.status === "anonymous") {
    return {
      status: "redirect",
      destination: `/login?next=${encodeURIComponent(home)}`,
    };
  }

  if (auth.status === "unavailable") return { status: "unavailable" };

  if (portal === "admin" && auth.role !== "admin") {
    return { status: "redirect", destination: "/dashboard" };
  }

  if (portal === "customer" && auth.role === "admin") {
    return { status: "redirect", destination: "/admin" };
  }

  return { status: "allowed" };
}
