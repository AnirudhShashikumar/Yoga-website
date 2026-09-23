"use client";

import Link from "next/link";

import { AuthPanel } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";

export default function AuthenticationError({ reset }: { reset: () => void }) {
  return (
    <AuthPanel
      eyebrow="Account Service"
      title="We could not load this page."
      description="No account details were changed. You can safely try again or return to the public website."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Button type="button" onClick={reset}>Try Again</Button>
        <Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-pill border border-brand/20 bg-background px-6 text-sm font-semibold text-brand hover:bg-surface-subtle">
          Return Home
        </Link>
      </div>
    </AuthPanel>
  );
}
