import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils/cn";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  aside?: ReactNode;
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  aside,
  className,
}: PageHeroProps) {
  return (
    <section className={cn("relative overflow-hidden border-b border-brand/10", className)}>
      <div
        aria-hidden="true"
        className="absolute -left-24 top-10 size-72 rounded-full bg-sky/45 blur-3xl"
      />
      <Container className="relative py-16 sm:py-20 lg:py-24">
        <div className={cn("grid items-center gap-10", aside && "lg:grid-cols-12 lg:gap-16")}>
          <div className={cn("max-w-4xl", aside && "lg:col-span-7")}>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand">
              {eyebrow}
            </p>
            <h1 className="mt-5 font-display text-4xl font-medium leading-[1.08] text-brand-strong sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">{description}</p>
            {actions ? <div className="mt-8 flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
          </div>
          {aside ? <div className="lg:col-span-5">{aside}</div> : null}
        </div>
      </Container>
    </section>
  );
}
