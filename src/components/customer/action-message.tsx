import type { CustomerActionState } from "@/features/customer/types";
import { cn } from "@/lib/utils/cn";

export function CustomerActionMessage({ state }: { state: CustomerActionState }) {
  if (state.status === "idle" || !state.message) return null;

  return (
    <p
      role={state.status === "error" ? "alert" : "status"}
      aria-live="polite"
      tabIndex={-1}
      className={cn(
        "mt-3 rounded-xl px-4 py-3 text-sm font-medium leading-6",
        state.status === "error"
          ? "bg-error-soft text-error"
          : "bg-sage text-brand-strong",
      )}
    >
      {state.message}
    </p>
  );
}
