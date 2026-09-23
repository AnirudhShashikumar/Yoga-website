import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false, follow: false },
};

export default function CustomerAccountFoundationPage() {
  return (
    <section className="max-w-3xl rounded-[2rem] border border-brand/10 bg-surface p-7 shadow-card sm:p-10">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand/70">Secure Customer Area</p>
      <h1 className="mt-3 font-display text-3xl font-medium text-brand-strong sm:text-4xl">Your account is ready.</h1>
      <p className="mt-4 max-w-2xl leading-7 text-muted">
        This protected landing confirms customer access. Booking, schedule, and profile features belong to the next milestone and have not been created yet.
      </p>
    </section>
  );
}
