"use client";

import { useState } from "react";

import { ClassCard } from "@/components/classes/class-card";
import { categoryLabels, type PublicClass } from "@/features/public/types";
import { cn } from "@/lib/utils/cn";

type Filter = "all" | PublicClass["category"];

export function ClassExplorer({ practices }: { practices: PublicClass[] }) {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const visiblePractices =
    activeFilter === "all"
      ? practices
      : practices.filter((practice) => practice.category === activeFilter);
  const filters = ["all", ...new Set(practices.map((practice) => practice.category))] as Filter[];

  return (
    <div>
      <div className="flex flex-wrap gap-2" aria-label="Filter classes by category">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            aria-pressed={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "min-h-11 rounded-pill border border-brand/15 px-5 text-sm font-semibold transition-colors",
              activeFilter === filter
                ? "bg-brand text-white"
                : "bg-surface text-brand hover:bg-brand-soft/50",
            )}
          >
            {filter === "all" ? "All" : categoryLabels[filter]}
          </button>
        ))}
      </div>
      <p className="mt-5 text-sm text-muted" aria-live="polite">
        Showing {visiblePractices.length} {visiblePractices.length === 1 ? "practice" : "practices"}.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visiblePractices.map((practice) => (
          <ClassCard
            key={practice.slug}
            practice={practice}
            index={practices.findIndex((candidate) => candidate.slug === practice.slug)}
          />
        ))}
      </div>
    </div>
  );
}
