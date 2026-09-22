import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

const principles = [
  {
    number: "01",
    title: "Meet your level",
    description: "Beginner, intermediate, and advanced practice are all part of the offering.",
  },
  {
    number: "02",
    title: "Choose your format",
    description: "Choose an online or offline format according to your preference.",
  },
  {
    number: "03",
    title: "Return to the philosophy",
    description: "Positive & Healthy Life remains the clear idea at the center of the experience.",
  },
] as const;

export function PhilosophySection() {
  return (
    <Section>
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <SectionHeading
            className="lg:col-span-5"
            eyebrow="Why Prabha Yogashala"
            title="A clear foundation, without unnecessary complexity."
            description="The experience is designed to make it easy to understand what is offered and choose a suitable next step."
          />
          <div className="grid gap-4 lg:col-span-7">
            {principles.map((principle) => (
              <Card key={principle.number} className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
                <span className="font-display text-2xl font-semibold text-ochre">
                  {principle.number}
                </span>
                <div>
                  <h3 className="font-display text-2xl font-medium text-brand-strong">
                    {principle.title}
                  </h3>
                  <p className="mt-2 text-base leading-7 text-muted">{principle.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
