import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { getPublicWorkshops } from "@/features/public/data";
import { formatBusinessDateTime } from "@/lib/dates";

export async function WorkshopPreview() {
  const result = await getPublicWorkshops();
  const nextWorkshop = result.status === "success" ? result.data[0] : undefined;
  return (
    <Section>
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-brand/10 bg-surface p-7 shadow-card sm:p-10 lg:p-14">
          <div aria-hidden="true" className="absolute -right-20 -top-24 size-72 rounded-full bg-sage blur-3xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              <Badge tone="ochre">Workshops</Badge>
              <h2 className="mt-5 font-display text-3xl font-medium leading-tight text-brand-strong sm:text-4xl">
                {nextWorkshop?.title ?? "Thoughtful sessions beyond the regular practice."}
              </h2>
              <p className="mt-4 text-lg leading-8 text-muted">
                {nextWorkshop ? `${nextWorkshop.summary} ${nextWorkshop.starts_at ? formatBusinessDateTime(nextWorkshop.starts_at) : ""}` : "Workshops are part of the Prabha Yogashala offering. Dates, topics, and formats will be published only after they are confirmed."}
              </p>
            </div>
            <ButtonLink href="/workshops" variant="secondary" size="lg">
              Learn More
            </ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
