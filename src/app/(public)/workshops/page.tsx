import type { Metadata } from "next";

import { ConversionCTA } from "@/components/public/conversion-cta";
import { PageHero } from "@/components/public/page-hero";
import { Badge } from "@/components/ui/badge";
import { ButtonLink, buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Section } from "@/components/ui/section";
import { WhatsAppIcon } from "@/components/ui/icons";
import { trialWhatsAppUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Workshops",
  description:
    "Explore the Prabha Yogashala workshop space and enquire about future verified workshop announcements.",
};

export default function WorkshopsPage() {
  return (
    <>
      <PageHero eyebrow="Workshops" title="Focused sessions, announced with complete information." description="Workshops are a verified Prabha Yogashala service. No upcoming topic, date, venue, format, or instructor detail has yet been approved for publication." />
      <Section>
        <Container>
          <EmptyState
            title="Upcoming workshop information will be announced here."
            description="When a workshop is confirmed, this space will present its topic, format, date, broad suitability, and enquiry path without changing the page architecture."
            action={<div className="flex flex-col gap-3 sm:flex-row"><ButtonLink href="/contact">Send an Enquiry</ButtonLink><a href={trialWhatsAppUrl} target="_blank" rel="noreferrer" className={buttonStyles({ variant: "secondary" })}><WhatsAppIcon className="mr-2 size-5" />WhatsApp Us</a></div>}
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["Topic", "A clear, approved description of the workshop focus."],
              ["Format", "Verified online or offline delivery and any relevant participation notes."],
              ["Timing", "Confirmed date and time only after scheduling is complete."],
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl border border-dashed border-brand/25 bg-surface-subtle p-6">
                <Badge tone="neutral">Future workshop field</Badge>
                <h2 className="mt-6 font-display text-2xl font-medium text-brand-strong">{title}</h2>
                <p className="mt-3 text-base leading-7 text-muted">{description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
      <ConversionCTA eyebrow="Workshop enquiries" title="Ask to hear about confirmed workshops." />
    </>
  );
}
