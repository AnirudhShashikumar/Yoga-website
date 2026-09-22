import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

const audiences = [
  { label: "Ages", value: "10 and above" },
  { label: "Starting", value: "Beginner" },
  { label: "Continuing", value: "Intermediate" },
  { label: "Established", value: "Advanced" },
] as const;

export function AudienceSection() {
  return (
    <Section className="bg-sky/45">
      <Container>
        <SectionHeading
          eyebrow="Who can join"
          title="A welcoming place to begin or continue."
          description="Prabha Yogashala serves a wide range of experience levels, with participation open from age 10."
          align="center"
        />
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-4 lg:grid-cols-4">
          {audiences.map((audience) => (
            <div
              key={audience.label}
              className="rounded-2xl border border-brand/10 bg-surface/80 p-5 text-center shadow-card sm:p-7"
            >
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand">
                {audience.label}
              </p>
              <p className="mt-3 font-display text-xl font-medium text-brand-strong sm:text-2xl">
                {audience.value}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

