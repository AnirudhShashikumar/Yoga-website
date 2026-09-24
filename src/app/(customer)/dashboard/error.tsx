"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function CustomerDashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Customer portal render failed", error);
  }, [error]);

  return (
    <section className="rounded-2xl border border-brand/10 bg-surface p-8 text-center shadow-card">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand/65">Account information</p>
      <h1 className="mt-3 font-display text-3xl font-medium text-brand-strong">Something went wrong.</h1>
      <p className="mx-auto mt-3 max-w-lg leading-7 text-muted">
        Your private account data has not been displayed. Try loading this page again.
      </p>
      <Button type="button" className="mt-6" onClick={reset}>Try Again</Button>
    </section>
  );
}
