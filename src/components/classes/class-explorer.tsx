"use client";

import { useState } from "react";

import { ClassCard } from "@/components/classes/class-card";
import { practiceCategories, practices, type PracticeCategory } from "@/config/classes";
import { cn } from "@/lib/utils/cn";

type Filter = "All" | PracticeCategory;

export function ClassExplorer() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const visiblePractices =
    activeFilter === "All"
      ? practices
      : practices.filter((practice) => practice.category === activeFilter);

  return (
    <div>
      <div className="flex flex-wrap gap-2" aria-label="Filter classes by category">
        {(["All", ...practiceCategories] as const).map((filter) => (
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
            {filter}
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
