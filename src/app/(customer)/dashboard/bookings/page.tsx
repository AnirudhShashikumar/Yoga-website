import type { Metadata } from "next";

import { BookingCard } from "@/components/customer/booking-card";
import { CustomerPageHeader } from "@/components/customer/customer-page-header";
import { CustomerDataError } from "@/components/customer/data-state";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getCustomerBookings, getServerTimestamp } from "@/features/customer/data";
import type { CustomerBooking } from "@/features/customer/types";

export const metadata: Metadata = { title: "My Bookings" };

function BookingGroup({ id, title, bookings, cancellable }: { id: string; title: string; bookings: CustomerBooking[]; cancellable?: boolean }) {
  if (bookings.length === 0) return null;

  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="font-display text-2xl font-medium text-brand-strong sm:text-3xl">{title}</h2>
      <div className="mt-5 space-y-4">
        {bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} allowCancellation={Boolean(cancellable)} />
        ))}
      </div>
    </section>
  );
}

export default async function CustomerBookingsPage() {
  const result = await getCustomerBookings();
  if (result.status === "error") return <CustomerDataError />;

  const now = getServerTimestamp();
  const upcoming = result.data.filter(
    (booking) =>
      (booking.status === "pending" || booking.status === "confirmed") &&
      booking.session &&
      new Date(booking.session.startsAt).getTime() > now,
  );
  const cancelled = result.data.filter((booking) => booking.status === "cancelled");
  const past = result.data.filter((booking) => !upcoming.includes(booking) && booking.status !== "cancelled");

  return (
    <div className="space-y-10">
      <CustomerPageHeader
        eyebrow="My Bookings"
        title="Your practice, in one clear place."
        description="Only bookings owned by your authenticated account are shown. Booking history is retained even when session details are no longer published."
        action={<ButtonLink href="/dashboard/schedule">Find a Session</ButtonLink>}
      />

      {result.data.length === 0 ? (
        <EmptyState
          title="You have no bookings yet."
          description="Explore the published classes now, then choose a real available session when one appears on the schedule."
          action={<ButtonLink href="/dashboard/classes">Explore Classes</ButtonLink>}
        />
      ) : (
        <div className="space-y-10">
          <BookingGroup id="upcoming-bookings" title="Upcoming" bookings={upcoming} cancellable />
          <BookingGroup id="past-bookings" title="Past" bookings={past} />
          <BookingGroup id="cancelled-bookings" title="Cancelled" bookings={cancelled} />
        </div>
      )}

      <p className="rounded-2xl border border-brand/10 bg-sky/50 p-5 text-sm leading-6 text-muted">
        Online cancellation is limited to your own pending or confirmed booking before its session begins. The final business cancellation and rescheduling policy still requires client approval; no refund behavior is implemented.
      </p>
    </div>
  );
}
