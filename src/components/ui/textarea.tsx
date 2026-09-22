import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";

export function Textarea({
  className,
  rows = 5,
  ...props
}: ComponentPropsWithoutRef<"textarea">) {
  return (
    <textarea
      rows={rows}
      className={cn(
        "w-full rounded-xl border bg-surface-subtle px-4 py-3 text-base text-foreground placeholder:text-muted/70 aria-[invalid=true]:border-error aria-[invalid=true]:bg-error-soft/30 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
