import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { CheckIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";

const offerings = [
  {
    label: "Online",
    title: "Practise from where you are.",
    description:
      "Online sessions are available. Individual timing and session details are confirmed during an enquiry.",
  },
  {
    label: "Offline",
    title: "Choose an in-person practice.",
    description:
      "Offline sessions are available. Location and individual session details are shared during an enquiry.",
  },
] as const;

export function OfferingSection() {
  return (
    <Section className="bg-brand-strong text-white">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-soft">
              Online and offline
            </p>
            <h2 className="mt-4 font-display text-3xl font-medium leading-tight sm:text-4xl">
              A format that meets your practice.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/75">
              Choose the way of joining that best suits your practice and circumstances.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {offerings.map((offering) => (
              <article
                key={offering.label}
                className="rounded-2xl border border-white/15 bg-white/5 p-6 sm:p-8"
              >
                <Badge tone="sage">{offering.label}</Badge>
                <h3 className="mt-6 font-display text-2xl font-medium">{offering.title}</h3>
                <p className="mt-3 text-base leading-7 text-white/75">{offering.description}</p>
                <div className="mt-6 flex items-center gap-3 text-sm font-semibold text-brand-soft">
                  <span className="flex size-7 items-center justify-center rounded-full bg-white/10">
                    <CheckIcon className="size-4" />
                  </span>
                  Available {offering.label.toLowerCase()}
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
