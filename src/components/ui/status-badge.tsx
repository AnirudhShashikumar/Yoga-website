import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";

const toneClasses: Record<StatusTone, string> = {
  neutral: "bg-surface-muted text-muted",
  info: "bg-sky text-brand-strong",
  success: "bg-sage text-brand-strong",
  warning: "bg-amber-100 text-amber-900",
  danger: "bg-error-soft text-error",
};

export function StatusBadge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: StatusTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-pill px-3 py-1 text-xs font-bold capitalize",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

