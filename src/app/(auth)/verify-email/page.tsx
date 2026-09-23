import type { Metadata } from "next";
import Link from "next/link";

import { AuthPanel } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Email verification status for your Prabha Yogashala account.",
};

type VerifyEmailPageProps = {
  searchParams: Promise<{ status?: string | string[] }>;
};

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const parameter = (await searchParams).status;
  const status = Array.isArray(parameter) ? parameter[0] : parameter;
  const confirmed = status === "confirmed";
  const invalid = status === "invalid";

  return (
    <AuthPanel
      eyebrow="Email Verification"
      title={confirmed ? "Your email is confirmed." : invalid ? "This link is no longer valid." : "Check your inbox."}
      description={
        confirmed
          ? "Your secure session is ready. Continue to your account."
          : invalid
            ? "The confirmation link may be malformed, expired, or already used. You can register again or return to sign in."
            : "If registration was successful, a confirmation link has been sent. Open that link to finish setting up your account."
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {confirmed ? (
          <Link href="/dashboard" className="inline-flex min-h-12 items-center justify-center rounded-pill bg-brand px-6 text-sm font-semibold text-white shadow-action hover:bg-brand-strong">
            Continue to Account
          </Link>
        ) : (
          <Link href="/register" className="inline-flex min-h-12 items-center justify-center rounded-pill bg-brand px-6 text-sm font-semibold text-white shadow-action hover:bg-brand-strong">
            {invalid ? "Register Again" : "Back to Registration"}
          </Link>
        )}
        <Link href="/login" className="inline-flex min-h-12 items-center justify-center rounded-pill border border-brand/20 bg-background px-6 text-sm font-semibold text-brand hover:bg-surface-subtle">
          Go to Sign In
        </Link>
      </div>
    </AuthPanel>
  );
}
