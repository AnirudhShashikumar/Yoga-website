"use client";

import { useActionState, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { initialAdminActionState, type AdminActionState } from "@/features/admin/types";
import { cn } from "@/lib/utils/cn";

type Action = (state: AdminActionState, formData: FormData) => Promise<AdminActionState>;

export function AdminActionForm({
  action,
  children,
  submitLabel,
  pendingLabel = "Saving…",
  successLabel,
  variant = "primary",
  className,
  buttonClassName,
  confirm,
}: {
  action: Action;
  children?: ReactNode;
  submitLabel: string;
  pendingLabel?: string;
  successLabel?: string;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  buttonClassName?: string;
  confirm?: { title: string; description: string } | undefined;
}) {
  const [state, formAction, pending] = useActionState(action, initialAdminActionState);
  const [confirming, setConfirming] = useState(false);

  return (
    <form
      action={formAction}
      className={cn("space-y-5", className)}
      onSubmit={(event) => {
        if (confirm && !confirming) {
          event.preventDefault();
          setConfirming(true);
        }
      }}
    >
      {children}
      {confirming && state.status !== "success" ? (
        <div className="rounded-xl border border-error/20 bg-error-soft/30 p-4">
          <p className="text-sm font-semibold text-brand-strong">{confirm?.title}</p>
          <p className="mt-1 text-sm leading-6 text-muted">{confirm?.description}</p>
          <button type="button" className="mt-2 min-h-10 text-sm font-semibold text-brand underline-offset-4 hover:underline" onClick={() => setConfirming(false)} disabled={pending}>Go back</button>
        </div>
      ) : null}
      {state.message ? (
        <div role={state.status === "error" ? "alert" : "status"} aria-live="polite" className={cn("rounded-xl border px-4 py-3 text-sm leading-6", state.status === "error" ? "border-error/20 bg-error-soft/35 text-error" : "border-brand/10 bg-sage/55 text-brand-strong")}>
          <p className="font-semibold">{state.message}</p>
          {state.fieldErrors ? (
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {Object.values(state.fieldErrors).map((message) => <li key={message}>{message}</li>)}
            </ul>
          ) : null}
        </div>
      ) : null}
      <Button type="submit" variant={variant} disabled={pending || state.status === "success"} className={buttonClassName}>
        {pending ? pendingLabel : state.status === "success" && successLabel ? successLabel : confirming && confirm ? `Confirm ${submitLabel}` : submitLabel}
      </Button>
    </form>
  );
}
