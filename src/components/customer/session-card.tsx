import Link from "next/link";

import { BookSessionForm } from "@/components/customer/booking-actions";
import { SessionTime } from "@/components/customer/session-time";
import { ButtonLink } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import type { CustomerSession } from "@/features/customer/types";

export function SessionCard({ session, alreadyBooked = false }: { session: CustomerSession; alreadyBooked?: boolean }) {
  return (
    <article className="rounded-2xl border border-brand/10 bg-surface p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="info">{session.format}</StatusBadge>
            {alreadyBooked ? <StatusBadge tone="success">Already booked</StatusBadge> : null}
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-brand/60">
              Published session
            </span>
          </div>
          <h2 className="mt-3 font-display text-2xl font-medium text-brand-strong">
            <Link
              href={`/classes/${session.class.slug}`}
              className="underline-offset-4 hover:underline"
            >
              {session.class.name}
            </Link>
          </h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-muted">
            <SessionTime startsAt={session.startsAt} endsAt={session.endsAt} />
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            {session.class.shortDescription}
          </p>
        </div>
        <div className="w-full shrink-0 xl:w-auto">
          {alreadyBooked ? (
            <ButtonLink href="/dashboard/bookings" variant="secondary" className="w-full sm:w-auto">
              View My Booking
            </ButtonLink>
          ) : (
            <BookSessionForm sessionId={session.id} />
          )}
        </div>
      </div>
    </article>
  );
}
