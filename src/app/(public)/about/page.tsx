import type { Metadata } from "next";
import Image from "next/image";

import { ConversionCTA } from "@/components/public/conversion-cta";
import { PageHero } from "@/components/public/page-hero";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { publicMedia } from "@/config/media";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about the Positive & Healthy Life philosophy, teaching approach, experience, and qualifications behind Prabha Yogashala.",
};

const approach = [
  { number: "01", title: "Meet your level", text: "Beginner, intermediate, and advanced practitioners are welcomed without presenting one path as suitable for everyone." },
  { number: "02", title: "Keep guidance clear", text: "Practice choices, broad timing, and format are communicated plainly before the next step is confirmed." },
  { number: "03", title: "Build steady practice", text: "The emphasis is on an approachable return to practice, without guaranteed outcomes or unnecessary pressure." },
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Prabha Yogashala"
        title="A clear path toward a positive and healthy life."
        description="Prabha Yogashala welcomes practitioners aged 10 and above through online and offline yoga, meditation, and breath-focused practice."
        aside={
          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-brand/10 bg-surface p-5 shadow-card">
            <div><p className="font-display text-3xl text-brand-strong">7</p><p className="mt-1 text-xs font-semibold text-muted">Years</p></div>
            <div><p className="font-display text-2xl text-brand-strong">M.Sc</p><p className="mt-1 text-xs font-semibold text-muted">Qualification</p></div>
            <div><p className="font-display text-xl text-brand-strong">NIS</p><p className="mt-1 text-xs font-semibold text-muted">Course</p></div>
          </div>
        }
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading eyebrow="The story" title="Practice presented with honesty and room to grow." />
            </div>
            <div className="space-y-5 text-lg leading-8 text-muted lg:col-span-7">
              <p>
                Prabha Yogashala is guided by the client-supplied philosophy <strong className="font-semibold text-brand-strong">{siteConfig.philosophy}</strong>. Its public offering brings together yoga, meditation, and pranayama for a broad range of experience levels.
              </p>
              <p>
                The website reflects what is confirmed today: {siteConfig.experienceYears} years of teaching experience, the qualifications “M.Sc” and “NIS Certification Course,” online and offline delivery, and a welcoming audience from age 10. Details that still require client approval remain clearly identified rather than being filled with invented copy.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-surface-subtle">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-brand/10 bg-surface shadow-floating">
                <Image src={publicMedia.founder.src} alt={publicMedia.founder.alt} fill sizes="(max-width: 1023px) 90vw, 36vw" className="object-cover" />
                <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-background/95 p-5 backdrop-blur">
                  <p className="text-sm font-bold uppercase tracking-[0.12em] text-brand">Content placeholder</p>
                  <p className="mt-2 text-sm leading-6 text-muted">Approved founder portrait and identity are required before launch.</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <Badge tone="sage">Instructor / Founder</Badge>
              <h2 className="mt-5 font-display text-3xl font-medium leading-tight text-brand-strong sm:text-4xl">A teaching profile grounded in verified facts.</h2>
              <p className="mt-5 text-lg leading-8 text-muted">
                The instructor’s name, detailed biography, qualification specialization, and portrait have not been approved for publication. This space preserves the intended editorial presentation without assigning a fictional identity.
              </p>
              <dl className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-brand/10 bg-surface p-5"><dt className="text-xs font-bold uppercase tracking-[0.12em] text-brand">Experience</dt><dd className="mt-2 font-display text-2xl text-brand-strong">7 years</dd></div>
                <div className="rounded-2xl border border-brand/10 bg-surface p-5"><dt className="text-xs font-bold uppercase tracking-[0.12em] text-brand">Qualification</dt><dd className="mt-2 font-display text-2xl text-brand-strong">M.Sc</dd></div>
                <div className="rounded-2xl border border-brand/10 bg-surface p-5"><dt className="text-xs font-bold uppercase tracking-[0.12em] text-brand">Course</dt><dd className="mt-2 font-display text-xl text-brand-strong">NIS Certification Course</dd></div>
              </dl>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="Teaching approach" title="Simple principles for a considered practice." description="The approach is expressed without promising a particular health or performance outcome." />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {approach.map((item) => (
              <Card key={item.number} className="flex flex-col">
                <span className="font-display text-4xl text-brand/25">{item.number}</span>
                <h2 className="mt-8 font-display text-2xl font-medium text-brand-strong">{item.title}</h2>
                <p className="mt-3 text-base leading-7 text-muted">{item.text}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-sky/45">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-end">
            <SectionHeading eyebrow="Online and offline" title="Practice can begin from more than one place." />
            <p className="text-lg leading-8 text-muted">
              The mission is to keep the first step understandable across both formats. Exact locations, class times, and format availability for individual practices are confirmed directly rather than assumed.
            </p>
          </div>
        </Container>
      </Section>
      <ConversionCTA />
    </>
  );
}
