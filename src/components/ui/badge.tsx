import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";

type BadgeTone = "sage" | "sky" | "ochre" | "neutral";

const toneClasses: Record<BadgeTone, string> = {
  sage: "bg-sage text-brand-strong",
  sky: "bg-sky text-brand-strong",
  ochre: "bg-amber-100 text-amber-900",
  neutral: "bg-surface-muted text-muted",
};

export function Badge({
  className,
  tone = "sage",
  ...props
}: ComponentPropsWithoutRef<"span"> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-pill px-3 py-1 text-xs font-semibold tracking-wide",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}

