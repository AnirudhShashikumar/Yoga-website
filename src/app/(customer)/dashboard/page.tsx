import type { Metadata, Route } from "next";
import Link from "next/link";

import { BookingCard } from "@/components/customer/booking-card";
import { CustomerPageHeader } from "@/components/customer/customer-page-header";
import { CustomerDataError } from "@/components/customer/data-state";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { trialWhatsAppUrl } from "@/config/site";
import { getCustomerBookings, getCustomerProfile, getServerTimestamp } from "@/features/customer/data";

export const metadata: Metadata = { title: "Overview" };

export default async function CustomerOverviewPage() {
  const [profileResult, bookingsResult] = await Promise.all([
    getCustomerProfile(),
    getCustomerBookings(),
  ]);

  if (profileResult.status === "error" || bookingsResult.status === "error") {
    return <CustomerDataError />;
  }

  const profile = profileResult.data;
  const bookings = bookingsResult.data;
  const now = getServerTimestamp();
  const upcoming = bookings
    .filter(
      (booking) =>
        (booking.status === "pending" || booking.status === "confirmed") &&
        booking.session &&
        new Date(booking.session.startsAt).getTime() > now,
    )
    .sort(
      (a, b) =>
        new Date(a.session?.startsAt ?? 0).getTime() -
        new Date(b.session?.startsAt ?? 0).getTime(),
    );
  const completed = bookings.filter((booking) => booking.status === "completed").length;
  const cancelled = bookings.filter((booking) => booking.status === "cancelled").length;
  const nextConfirmed = upcoming.find((booking) => booking.status === "confirmed");
  const firstName = profile.fullName?.trim().split(/\s+/)[0];

  return (
    <div className="space-y-10">
      <CustomerPageHeader
        eyebrow="Overview"
        title={`Welcome${firstName ? `, ${firstName}` : ""}.`}
        description="Your account brings together real bookings, available sessions, and the profile preferences you choose to share."
        action={<ButtonLink href="/dashboard/schedule">Book a Class</ButtonLink>}
      />

      <section aria-labelledby="booking-summary-heading">
        <h2 id="booking-summary-heading" className="sr-only">Booking summary</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["Upcoming", upcoming.length, "Published future sessions"],
            ["Completed", completed, "Recorded completed bookings"],
            ["Cancelled", cancelled, "Retained booking history"],
          ].map(([label, value, description]) => (
            <Card key={label} className="p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand/65">{label}</p>
              <p className="mt-3 font-display text-4xl font-medium text-brand-strong">{value}</p>
              <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="next-session-heading">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand/65">Your next step</p>
            <h2 id="next-session-heading" className="mt-2 font-display text-2xl font-medium text-brand-strong sm:text-3xl">Next confirmed session</h2>
          </div>
          {upcoming.length > 0 ? (
            <Link href={"/dashboard/bookings" as Route} className="text-sm font-semibold text-brand underline-offset-4 hover:underline">View all bookings</Link>
          ) : null}
        </div>
        {nextConfirmed ? (
          <BookingCard booking={nextConfirmed} allowCancellation />
        ) : (
          <EmptyState
            title="No confirmed upcoming session yet."
            description={upcoming.length > 0 ? "Your pending booking request is shown below and will remain clearly marked until its status changes." : "When a real session is published, you can review its time and format before creating a booking."}
            action={<ButtonLink href="/dashboard/classes">Explore Classes</ButtonLink>}
          />
        )}
      </section>

      {upcoming.length > 0 ? (
        <section aria-labelledby="upcoming-preview-heading">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 id="upcoming-preview-heading" className="font-display text-2xl font-medium text-brand-strong sm:text-3xl">Upcoming bookings</h2>
            <Link href={"/dashboard/bookings" as Route} className="text-sm font-semibold text-brand underline-offset-4 hover:underline">Manage bookings</Link>
          </div>
          <div className="space-y-4">
            {upcoming.slice(0, 2).map((booking) => <BookingCard key={booking.id} booking={booking} allowCancellation />)}
          </div>
        </section>
      ) : null}

      <section aria-labelledby="quick-actions-heading">
        <h2 id="quick-actions-heading" className="font-display text-2xl font-medium text-brand-strong sm:text-3xl">Quick actions</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {[
            ["Book a Class", "/dashboard/schedule", "Choose from real published sessions."],
            ["Explore Classes", "/dashboard/classes", "Browse the published practice catalogue."],
            ["View Schedule", "/dashboard/schedule", "Find real sessions when they are published."],
            ["Edit Profile", "/dashboard/profile", "Update your supported account preferences."],
          ].map(([label, href, description]) => (
            <Link key={href} href={href as Route} className="rounded-2xl border border-brand/10 bg-surface p-5 shadow-card transition-colors hover:bg-sage/40">
              <span className="font-semibold text-brand-strong">{label}</span>
              <span className="mt-2 block text-sm leading-6 text-muted">{description}</span>
            </Link>
          ))}
          <a href={trialWhatsAppUrl} target="_blank" rel="noreferrer" className="rounded-2xl border border-brand/10 bg-brand p-5 text-white shadow-card transition-colors hover:bg-brand-strong">
            <span className="font-semibold">WhatsApp Instructor</span>
            <span className="mt-2 block text-sm leading-6 text-white/75">Ask a question before choosing a session.</span>
          </a>
        </div>
      </section>
    </div>
  );
}
