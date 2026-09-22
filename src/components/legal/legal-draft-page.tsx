import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PageHero } from "@/components/public/page-hero";

type LegalSection = Readonly<{ heading: string; body: string }>;

export function LegalDraftPage({
  title,
  description,
  sections,
}: {
  title: string;
  description: string;
  sections: readonly LegalSection[];
}) {
  return (
    <>
      <PageHero eyebrow="Draft for client review" title={title} description={description} />
      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[18rem_1fr] lg:gap-16">
            <aside className="h-fit rounded-2xl border border-ochre/35 bg-amber-50 p-6 lg:sticky lg:top-28">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-amber-900">
                Not legally approved
              </p>
              <p className="mt-3 text-sm leading-6 text-amber-950/80">
                This page is a structured content placeholder, not an authoritative legal policy. Client and legal review are required before launch.
              </p>
            </aside>
            <article className="max-w-3xl">
              <div className="space-y-10">
                {sections.map((section) => (
                  <section key={section.heading}>
                    <h2 className="font-display text-2xl font-medium text-brand-strong sm:text-3xl">
                      {section.heading}
                    </h2>
                    <p className="mt-4 text-base leading-8 text-muted">{section.body}</p>
                  </section>
                ))}
              </div>
            </article>
          </div>
        </Container>
      </Section>
    </>
  );
}
