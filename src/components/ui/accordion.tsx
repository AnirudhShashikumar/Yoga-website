import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type AccordionItemProps = Omit<ComponentPropsWithoutRef<"details">, "title"> & {
  title: ReactNode;
};

export function AccordionItem({
  title,
  children,
  className,
  ...props
}: AccordionItemProps) {
  return (
    <details
      className={cn(
        "group rounded-xl border border-brand/10 bg-surface px-5 py-1 shadow-card",
        className,
      )}
      {...props}
    >
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-display text-lg font-semibold text-brand-strong marker:content-none">
        {title}
        <span aria-hidden="true" className="text-xl transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="pb-5 text-base leading-7 text-muted">{children}</div>
    </details>
  );
}

