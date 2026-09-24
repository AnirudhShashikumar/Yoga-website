"use client";

import { useActionState, useState } from "react";

import { CustomerActionMessage } from "@/components/customer/action-message";
import { Button } from "@/components/ui/button";
import {
  bookSessionAction,
  cancelBookingAction,
} from "@/features/customer/actions";
import { initialCustomerActionState } from "@/features/customer/types";

export function BookSessionForm({ sessionId }: { sessionId: string }) {
  const [state, action, pending] = useActionState(
    bookSessionAction,
    initialCustomerActionState,
  );

  return (
    <form action={action} className="w-full sm:w-auto">
      <input type="hidden" name="sessionId" value={sessionId} />
      <Button
        type="submit"
        className="w-full sm:w-auto"
        disabled={pending || state.status === "success"}
      >
        {pending ? "Booking…" : state.status === "success" ? "Booked" : "Book This Session"}
      </Button>
      <CustomerActionMessage state={state} />
    </form>
  );
}

export function CancelBookingForm({ bookingId }: { bookingId: string }) {
  const [state, action, pending] = useActionState(
    cancelBookingAction,
    initialCustomerActionState,
  );
  const [confirming, setConfirming] = useState(false);

  if (!confirming && state.status !== "success") {
    return (
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="w-full sm:w-auto"
        onClick={() => setConfirming(true)}
      >
        Cancel Booking
      </Button>
    );
  }

  return (
    <div className="w-full rounded-xl border border-error/20 bg-error-soft/25 p-4 sm:max-w-sm">
      {state.status !== "success" ? (
        <>
          <p className="text-sm font-semibold text-brand-strong">Cancel this booking?</p>
          <p className="mt-1 text-sm leading-6 text-muted">This keeps the booking in your history with a cancelled status.</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Button type="button" variant="ghost" size="sm" onClick={() => setConfirming(false)} disabled={pending}>
              Keep Booking
            </Button>
            <form action={action}>
              <input type="hidden" name="bookingId" value={bookingId} />
              <Button type="submit" variant="danger" size="sm" className="w-full" disabled={pending}>
                {pending ? "Cancelling…" : "Yes, Cancel"}
              </Button>
            </form>
          </div>
        </>
      ) : null}
      <CustomerActionMessage state={state} />
    </div>
  );
}
