import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClassCard } from "@/components/classes/class-card";
import { ConversionCTA } from "@/components/public/conversion-cta";
import { PageHero } from "@/components/public/page-hero";
import { Badge } from "@/components/ui/badge";
import { CheckIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPracticeBySlug, getRelatedPractices, practices } from "@/config/classes";

type ClassPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return practices.map((practice) => ({ slug: practice.slug }));
}

export async function generateMetadata({ params }: ClassPageProps): Promise<Metadata> {
  const { slug } = await params;
  const practice = getPracticeBySlug(slug);
  if (!practice) return { title: "Class not found" };

  return {
    title: practice.name,
    description: `${practice.summary} Learn about the ${practice.name} offering at Prabha Yogashala.`,
  };
}

export default async function ClassDetailPage({ params }: ClassPageProps) {
  const { slug } = await params;
  const practice = getPracticeBySlug(slug);
  if (!practice) notFound();
  const related = getRelatedPractices(practice);

  return (
    <>
      <PageHero
        eyebrow={practice.category}
        title={practice.name}
        description={practice.summary}
        aside={
          <div className="rounded-2xl border border-brand/10 bg-surface p-6 shadow-card">
            <Badge tone="sage">Online & offline offered</Badge>
            <p className="mt-4 text-sm leading-6 text-muted">Confirm whether this practice is available in your preferred format and broad time window when enquiring.</p>
          </div>
        }
      />
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <SectionHeading eyebrow="Practice overview" title={`A considered introduction to ${practice.name}.`} />
              <p className="mt-6 text-lg leading-8 text-muted">{practice.overview}</p>
            </div>
            <aside className="rounded-2xl border border-brand/10 bg-surface-subtle p-6 lg:col-span-5 lg:p-8">
              <h2 className="font-display text-2xl font-medium text-brand-strong">Format and timing</h2>
              <dl className="mt-6 space-y-5">
                <div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-brand">Delivery</dt><dd className="mt-1 text-muted">Online and offline options are offered; practice-specific availability is confirmed directly.</dd></div>
                <div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-brand">Schedule</dt><dd className="mt-1 text-muted">Morning and evening windows are available. Exact sessions are still being finalized.</dd></div>
                <div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-brand">Level</dt><dd className="mt-1 text-muted">Suitability is discussed according to current experience rather than assigned as an unsupported fixed level.</dd></div>
              </dl>
            </aside>
          </div>
        </Container>
      </Section>
      <Section className="bg-surface-subtle">
        <Container>
          <div className="grid gap-5 lg:grid-cols-3">
            {[
              ["Who it may suit", practice.maySuit],
              ["What to expect", practice.whatToExpect],
              ["Practice qualities", practice.practiceQualities],
            ].map(([title, items]) => (
              <section key={title as string} className="rounded-2xl border border-brand/10 bg-surface p-6 sm:p-8">
                <h2 className="font-display text-2xl font-medium text-brand-strong">{title}</h2>
                <ul className="mt-6 space-y-4">
                  {(items as readonly string[]).map((item) => (
                    <li key={item} className="flex gap-3 text-base leading-7 text-muted"><span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-sage text-brand"><CheckIcon className="size-4" /></span>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <p className="mt-8 rounded-2xl border border-brand/10 bg-sky/50 p-5 text-sm leading-6 text-muted">
            This information describes the practice conservatively and is not medical advice. No therapeutic result or health outcome is promised.
          </p>
        </Container>
      </Section>
      <Section>
        <Container>
          <SectionHeading eyebrow="Continue exploring" title="Related practices" />
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {related.map((item) => <ClassCard key={item.slug} practice={item} index={practices.findIndex((candidate) => candidate.slug === item.slug)} />)}
          </div>
        </Container>
      </Section>
      <ConversionCTA title={`Explore ${practice.name} through a trial enquiry.`} />
    </>
  );
}
