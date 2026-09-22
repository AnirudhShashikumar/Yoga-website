import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CalendarIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";

const windows = [
  { label: "Morning", time: siteConfig.availability.morning, tone: "bg-sage" },
  { label: "Evening", time: siteConfig.availability.evening, tone: "bg-sky" },
] as const;

export function SchedulePreview() {
  return (
    <Section className="border-y border-brand/10 bg-surface-subtle">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="General practice windows"
              title="A broad rhythm for morning and evening."
              description="Individual sessions are still being finalized. These are the only confirmed availability windows."
            />
            <ButtonLink href="/schedule" variant="secondary" className="mt-7">
              View Schedule
            </ButtonLink>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {windows.map((window) => (
              <article
                key={window.label}
                className={`${window.tone} rounded-2xl border border-brand/10 p-7 sm:p-8`}
              >
                <CalendarIcon className="size-7 text-brand" />
                <p className="mt-8 text-sm font-bold uppercase tracking-[0.12em] text-brand">
                  {window.label}
                </p>
                <p className="mt-2 font-display text-3xl font-medium text-brand-strong">
                  {window.time}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

