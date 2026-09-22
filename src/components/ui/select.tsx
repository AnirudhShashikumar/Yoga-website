import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";

export function Select({ className, ...props }: ComponentPropsWithoutRef<"select">) {
  return (
    <select
      className={cn(
        "min-h-[3.25rem] w-full rounded-xl border bg-surface-subtle px-4 text-base text-foreground aria-[invalid=true]:border-error aria-[invalid=true]:bg-error-soft/30 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
