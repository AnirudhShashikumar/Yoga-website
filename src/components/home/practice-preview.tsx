import type { Route } from "next";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { practices } from "@/config/classes";

const featuredSlugs = ["hatha-yoga", "ashtanga-yoga", "pranayama", "meditation"] as const;
const featuredPractices = featuredSlugs.map((slug) => {
  const practice = practices.find((candidate) => candidate.slug === slug);
  if (!practice) throw new Error(`Missing configured practice: ${slug}`);
  return practice;
});
const tones = ["bg-sage", "bg-sky", "bg-amber-100", "bg-surface-muted"] as const;

export function PracticePreview() {
  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Explore the practice"
            title="Different paths, one considered approach."
            description="Begin with a familiar form or discover another part of the verified Prabha Yogashala offering."
          />
          <Link
            href={"/classes" as Route}
            className="group inline-flex min-h-11 shrink-0 items-center font-semibold text-brand-strong"
          >
            Explore Classes
            <ArrowRightIcon className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredPractices.map((practice, index) => (
            <Card key={practice.name} className="flex min-h-64 flex-col p-6">
              <div
                aria-hidden="true"
                className={`flex size-11 items-center justify-center rounded-full ${tones[index]} font-display text-lg font-semibold text-brand-strong`}
              >
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-8 font-display text-2xl font-medium text-brand-strong">
                {practice.name}
              </h3>
              <p className="mt-3 text-base leading-7 text-muted">{practice.summary}</p>
              <Link
                href={`/classes/${practice.slug}` as Route}
                className="mt-auto inline-flex min-h-11 items-end pt-5 text-sm font-bold text-brand"
              >
                View Class
                <ArrowRightIcon className="ml-2 size-4" />
              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
