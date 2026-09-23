import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default function AdminFoundationPage() {
  return (
    <section className="max-w-3xl rounded-[2rem] border border-brand/10 bg-surface p-7 shadow-card sm:p-10">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand/70">Protected Administration</p>
      <h1 className="mt-3 font-display text-3xl font-medium text-brand-strong sm:text-4xl">Administrator access confirmed.</h1>
      <p className="mt-4 max-w-2xl leading-7 text-muted">
        This is an authorization checkpoint only. Customer, class, booking, enquiry, workshop, gallery, and settings management have not been implemented.
      </p>
    </section>
  );
}
