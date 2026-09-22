import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";

export function Section({ className, ...props }: ComponentPropsWithoutRef<"section">) {
  return (
    <section
      className={cn("py-16 sm:py-20 lg:py-28", className)}
      {...props}
    />
  );
}

