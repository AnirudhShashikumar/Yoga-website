import { CancelBookingForm } from "@/components/customer/booking-actions";
import { SessionTime } from "@/components/customer/session-time";
import { StatusBadge } from "@/components/ui/status-badge";
import type { CustomerBooking } from "@/features/customer/types";

const statusTone = {
  pending: "warning",
  confirmed: "success",
  completed: "neutral",
  cancelled: "danger",
} as const;

export function BookingCard({
  booking,
  allowCancellation,
}: {
  booking: CustomerBooking;
  allowCancellation: boolean;
}) {
  return (
    <article className="rounded-2xl border border-brand/10 bg-surface p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <StatusBadge tone={statusTone[booking.status]}>{booking.status}</StatusBadge>
          <h3 className="mt-3 font-display text-2xl font-medium text-brand-strong">
            {booking.session?.class.name ?? "Session details unavailable"}
          </h3>
          {booking.session ? (
            <>
              <p className="mt-2 text-sm font-semibold leading-6 text-muted">
                <SessionTime
                  startsAt={booking.session.startsAt}
                  endsAt={booking.session.endsAt}
                />
              </p>
              <p className="mt-1 text-sm capitalize text-muted">
                {booking.session.format} session
              </p>
            </>
          ) : (
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
              This session is no longer publicly scheduled. The booking record is retained for your history.
            </p>
          )}
          <details className="mt-4 rounded-xl border border-brand/10 bg-surface-subtle px-4 py-3 text-sm text-muted">
            <summary className="min-h-8 cursor-pointer font-semibold text-brand-strong">View booking details</summary>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.1em] text-brand/60">Status</dt>
                <dd className="mt-1 capitalize">{booking.status}</dd>
              </div>
              {booking.session ? (
                <>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.1em] text-brand/60">Class</dt>
                    <dd className="mt-1">{booking.session.class.name}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.1em] text-brand/60">Date and time</dt>
                    <dd className="mt-1"><SessionTime startsAt={booking.session.startsAt} endsAt={booking.session.endsAt} /></dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.1em] text-brand/60">Format</dt>
                    <dd className="mt-1 capitalize">{booking.session.format}</dd>
                  </div>
                </>
              ) : null}
            </dl>
          </details>
        </div>
        {allowCancellation ? (
          <div className="w-full shrink-0 sm:w-auto">
            <CancelBookingForm bookingId={booking.id} />
          </div>
        ) : null}
      </div>
    </article>
  );
}
