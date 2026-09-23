import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";

import { ResetPasswordForm } from "@/components/auth/auth-forms";
import { AuthPanel } from "@/components/auth/auth-shell";
import { RECOVERY_COOKIE_NAME } from "@/lib/auth/constants";

export const metadata: Metadata = {
  title: "Choose New Password",
  description: "Set a new password for your Prabha Yogashala account.",
};

export default async function ResetPasswordPage() {
  const cookieStore = await cookies();
  const hasRecoverySession = cookieStore.has(RECOVERY_COOKIE_NAME);

  return (
    <AuthPanel
      eyebrow="Account Recovery"
      title="Choose a new password."
      description="Your reset link is single-purpose and time limited."
    >
      {hasRecoverySession ? (
        <ResetPasswordForm />
      ) : (
        <div>
          <div role="alert" className="rounded-2xl border border-error/25 bg-error-soft/35 px-4 py-3 text-sm leading-6 text-error">
            This password-reset session is missing or expired. Request a new reset link.
          </div>
          <Link href="/forgot-password" className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-pill bg-brand px-6 text-sm font-semibold text-white shadow-action hover:bg-brand-strong">
            Request a New Link
          </Link>
        </div>
      )}
    </AuthPanel>
  );
}
