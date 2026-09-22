import type { Metadata } from "next";

import { ConversionCTA } from "@/components/public/conversion-cta";
import { PageHero } from "@/components/public/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { CalendarIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Schedule",
  description: `View the confirmed broad Prabha Yogashala practice windows: ${siteConfig.availability.morning} and ${siteConfig.availability.evening}.`,
};

const steps = [
  ["Share your preference", "Choose morning or evening and tell us whether you prefer online or offline practice."],
  ["Discuss the practice", "Your experience level and practice interest help frame the initial conversation."],
  ["Confirm the details", "An exact time is confirmed directly. No unverified session has been published here."],
] as const;

export default function SchedulePage() {
  return (
    <>
      <PageHero
        eyebrow="Schedule"
        title="A broad morning and evening rhythm."
        description="The detailed class schedule is still being finalized. The two windows below are the only currently confirmed timing information."
        actions={<><ButtonLink href="/book">Book a Trial Class</ButtonLink><ButtonLink href="/contact" variant="secondary">Ask a Question</ButtonLink></>}
      />
      <Section>
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            <article className="rounded-[2rem] border border-brand/10 bg-sage p-7 sm:p-10">
              <CalendarIcon className="size-8 text-brand" />
              <p className="mt-8 text-sm font-bold uppercase tracking-[0.14em] text-brand">Morning window</p>
              <h2 className="mt-3 font-display text-4xl font-medium text-brand-strong sm:text-5xl">{siteConfig.availability.morning}</h2>
              <p className="mt-4 text-base leading-7 text-muted">Individual practices and exact start times are not yet published.</p>
            </article>
            <article className="rounded-[2rem] border border-brand/10 bg-sky p-7 sm:p-10">
              <CalendarIcon className="size-8 text-brand" />
              <p className="mt-8 text-sm font-bold uppercase tracking-[0.14em] text-brand">Evening window</p>
              <h2 className="mt-3 font-display text-4xl font-medium text-brand-strong sm:text-5xl">{siteConfig.availability.evening}</h2>
              <p className="mt-4 text-base leading-7 text-muted">Individual practices and exact start times are not yet published.</p>
            </article>
          </div>
        </Container>
      </Section>
      <Section className="bg-surface-subtle">
        <Container>
          <SectionHeading eyebrow="Flexible by design" title="How scheduling works for now." description="This presentation can later receive verified, published sessions from Supabase without changing the page’s core hierarchy." />
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map(([title, text], index) => (
              <li key={title} className="rounded-2xl border border-brand/10 bg-surface p-6 sm:p-8">
                <span className="text-sm font-bold text-brand">0{index + 1}</span>
                <h2 className="mt-6 font-display text-2xl font-medium text-brand-strong">{title}</h2>
                <p className="mt-3 text-base leading-7 text-muted">{text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 rounded-2xl border border-brand/10 bg-background p-7 text-center sm:p-10">
            <h2 className="font-display text-2xl font-medium text-brand-strong">No individual sessions are published yet.</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-muted">Days, instructors, durations, capacities, and availability remain intentionally absent until they are verified.</p>
          </div>
        </Container>
      </Section>
      <ConversionCTA title="Find a time within the confirmed windows." />
    </>
  );
}
