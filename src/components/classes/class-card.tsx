import type { Route } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { categoryLabels, type PublicClass } from "@/features/public/types";

export function ClassCard({ practice, index }: { practice: PublicClass; index: number }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-brand/10 bg-surface shadow-card transition-transform hover:-translate-y-1">
      <div className="flex min-h-40 items-end justify-between bg-gradient-to-br from-sage via-surface-subtle to-sky p-6">
        <span className="font-display text-5xl text-brand/20" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <Badge tone="neutral">{categoryLabels[practice.category]}</Badge>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h2 className="font-display text-2xl font-medium text-brand-strong">
          <Link href={`/classes/${practice.slug}` as Route} className="after:absolute after:inset-0">
            {practice.name}
          </Link>
        </h2>
        <p className="mt-3 flex-1 text-base leading-7 text-muted">{practice.short_description}</p>
        <div className="relative mt-6 flex flex-col gap-3 border-t border-brand/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center text-sm font-bold text-brand">
            View Class <ArrowRightIcon className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
          </span>
          <ButtonLink href={`/book?practice=${practice.slug}`} size="sm" className="relative z-10">
            Book a Trial Class
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
