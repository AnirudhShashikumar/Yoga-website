import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getPublicEnvironment } from "@/lib/env";
import type { AppRole } from "@/lib/auth/redirects";
import type { Database } from "@/types/database.generated";

function isProtectedPath(pathname: string) {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/") ||
    pathname === "/admin" || pathname.startsWith("/admin/");
}

function isAuthPath(pathname: string) {
  return ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"]
    .some((path) => pathname === path);
}

function roleFrom(value: unknown): AppRole | null {
  return value === "admin" || value === "customer" ? value : null;
}

function copyCookies(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie) => target.cookies.set(cookie));
  return target;
}

function protectedRedirect(request: NextRequest, response: NextResponse, path: string) {
  const target = new URL(path, request.url);
  const redirectResponse = copyCookies(response, NextResponse.redirect(target));
  redirectResponse.headers.set("Cache-Control", "private, no-store");
  return redirectResponse;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  let wroteCookies = false;
  const pathname = request.nextUrl.pathname;
  const protectedPath = isProtectedPath(pathname);

  try {
    const environment = getPublicEnvironment();
    const supabase = createServerClient<Database>(
      environment.NEXT_PUBLIC_SUPABASE_URL,
      environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
            wroteCookies = true;
          },
        },
      },
    );

    const { data, error } = await supabase.auth.getClaims();
    const userId = data?.claims?.sub;

    if (protectedPath) {
      if (error || typeof userId !== "string") {
        const next = `${pathname}${request.nextUrl.search}`;
        return protectedRedirect(
          request,
          response,
          `/login?next=${encodeURIComponent(next)}`,
        );
      }

      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();
      const role = roleFrom(roleData?.role);

      if (roleError || !role) {
        return protectedRedirect(
          request,
          response,
          "/login?error=unavailable",
        );
      }

      if (pathname.startsWith("/admin") && role !== "admin") {
        return protectedRedirect(request, response, "/dashboard");
      }

      if (pathname.startsWith("/dashboard") && role === "admin") {
        return protectedRedirect(request, response, "/admin");
      }
    }
  } catch {
    if (protectedPath) {
      return protectedRedirect(request, response, "/login?error=unavailable");
    }
  }

  const hasAuthCookie = request.cookies
    .getAll()
    .some(({ name }) => name.startsWith("sb-") && name.includes("auth-token"));

  if (protectedPath || isAuthPath(pathname) || hasAuthCookie || wroteCookies) {
    response.headers.set("Cache-Control", "private, no-store");
  }

  return response;
}
