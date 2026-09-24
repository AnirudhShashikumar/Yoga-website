import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AppRole } from "@/lib/auth/redirects";

export type AuthContext =
  | { status: "anonymous" }
  | { status: "unavailable" }
  | { status: "authenticated"; userId: string; role: AppRole };

function isRole(value: unknown): value is AppRole {
  return value === "customer" || value === "admin";
}

export async function getRoleForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<AppRole | null> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !isRole(data?.role)) return null;
  return data.role;
}

export const getAuthContext = cache(async (): Promise<AuthContext> => {
  let supabase: SupabaseClient;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return { status: "unavailable" };
  }

  const { data, error } = await supabase.auth.getClaims();
  const subject = data?.claims?.sub;

  if (error || typeof subject !== "string") {
    const isMissingSession =
      error?.name === "AuthSessionMissingError" || error?.code === "session_not_found";
    return { status: isMissingSession || !error ? "anonymous" : "unavailable" };
  }

  const role = await getRoleForUser(supabase, subject);
  if (!role) return { status: "unavailable" };

  return { status: "authenticated", userId: subject, role };
});
