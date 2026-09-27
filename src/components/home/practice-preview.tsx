import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublicClasses } from "@/features/public/data";

export async function PracticePreview() {
  const result = await getPublicClasses();
  const classes = result.status === "success" ? result.data : [];
  const featured = [...classes].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 4);
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
          {featured.map((practice, index) => (
            <Card key={practice.name} className="group flex min-h-72 flex-col overflow-hidden p-0 sm:p-0">
              <div className="relative min-h-36 overflow-hidden bg-gradient-to-br from-sage via-surface-subtle to-sky">
                {practice.mediaUrl ? (
                  <Image
                    src={practice.mediaUrl}
                    alt=""
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                ) : null}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-brand-strong/65 via-brand-strong/10 to-transparent"
                />
                <span
                  aria-hidden="true"
                  className="absolute bottom-4 left-5 font-display text-3xl text-white/90"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-2xl font-medium text-brand-strong">
                  {practice.name}
                </h3>
                <p className="mt-3 text-base leading-7 text-muted">{practice.short_description}</p>
                <Link
                  href={`/classes/${practice.slug}` as Route}
                  className="mt-auto inline-flex min-h-11 items-end pt-5 text-sm font-bold text-brand"
                >
                  View Class
                  <ArrowRightIcon className="ml-2 size-4" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
