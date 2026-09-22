import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export function Introduction() {
  return (
    <Section className="border-y border-brand/10 bg-surface-subtle">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand">Our approach</p>
            <h2 className="mt-4 font-display text-3xl font-medium leading-tight text-brand-strong sm:text-4xl">
              Practice with clarity, patience, and purpose.
            </h2>
          </div>
          <div className="space-y-5 text-lg leading-8 text-muted lg:col-span-7 lg:col-start-6">
            <p>
              Prabha Yogashala is guided by a simple philosophy: Positive &amp;
              Healthy Life. The practice is intended to feel approachable whether
              someone is beginning yoga or continuing an established routine.
            </p>
            <p>
              With online and offline options, practitioners can explore a range of
              yoga, meditation, and breath-focused offerings at the level that suits
              their experience.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}

