import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";

export function Card({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-brand/10 bg-surface p-6 shadow-card sm:p-8",
        className,
      )}
      {...props}
    />
  );
}

