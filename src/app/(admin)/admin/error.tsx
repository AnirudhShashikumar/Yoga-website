"use client";

import { Button } from "@/components/ui/button";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="rounded-2xl border border-brand/10 bg-surface p-8 text-center shadow-card"><h1 className="font-display text-3xl font-medium text-brand-strong">Administration could not be loaded.</h1><p className="mt-3 text-muted">Private business data has not been displayed. Try this page again.</p><Button className="mt-6" onClick={reset}>Try Again</Button></section>;
}
