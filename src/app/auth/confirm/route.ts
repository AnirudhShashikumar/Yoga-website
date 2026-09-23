import type { EmailOtpType, User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { registrationProfileMetadataSchema } from "@/features/auth/schemas";
import { RECOVERY_COOKIE_NAME } from "@/lib/auth/constants";
import { getSafeInternalPath } from "@/lib/auth/redirects";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const allowedTypes = new Set<EmailOtpType>(["signup", "email", "recovery"]);

function verificationUrl(request: NextRequest, status: "confirmed" | "invalid") {
  return new URL(`/verify-email?status=${status}`, request.url);
}

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const requestedType = request.nextUrl.searchParams.get("type") as EmailOtpType | null;
  const code = request.nextUrl.searchParams.get("code");
  const requestedNext = getSafeInternalPath(
    request.nextUrl.searchParams.get("next"),
    "/verify-email?status=confirmed",
    ["/reset-password"],
  );

  try {
    const supabase = await createSupabaseServerClient();
    let user: User | null = null;

    if (tokenHash && requestedType && allowedTypes.has(requestedType)) {
      const result = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: requestedType,
      });
      if (result.error) return NextResponse.redirect(verificationUrl(request, "invalid"));
      user = result.data.user;
    } else if (code) {
      const result = await supabase.auth.exchangeCodeForSession(code);
      if (result.error) return NextResponse.redirect(verificationUrl(request, "invalid"));
      user = result.data.user;
    }

    if (!user) {
      return NextResponse.redirect(verificationUrl(request, "invalid"));
    }

    if (requestedType === "recovery" || requestedNext === "/reset-password") {
      const cookieStore = await cookies();
      cookieStore.set(RECOVERY_COOKIE_NAME, "active", {
        httpOnly: true,
        maxAge: 15 * 60,
        path: "/reset-password",
        sameSite: "lax",
        secure: request.nextUrl.protocol === "https:",
      });
      return NextResponse.redirect(new URL("/reset-password", request.url));
    }

    const profile = registrationProfileMetadataSchema.safeParse(user.user_metadata);
    if (profile.success) {
      await supabase
        .from("profiles")
        .update({
          full_name: profile.data.full_name,
          phone: profile.data.phone,
        })
        .eq("id", user.id);
    }

    return NextResponse.redirect(verificationUrl(request, "confirmed"));
  } catch {
    return NextResponse.redirect(verificationUrl(request, "invalid"));
  }
}
