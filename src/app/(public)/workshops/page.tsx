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
import { getPublicWorkshops } from "@/features/public/data";
import { formatBusinessDateTime } from "@/lib/dates";

export const metadata: Metadata = { title: "Workshops", description: "Explore confirmed, published Prabha Yogashala workshops." };

export default async function WorkshopsPage() {
  const result = await getPublicWorkshops();
  return <>
    <PageHero eyebrow="Workshops" title="Focused sessions, announced with complete information." description="Only future workshops with confirmed, published details appear here." />
    <Section><Container>
      {result.status === "error" ? <EmptyState title="Workshop information is temporarily unavailable." description="Please try again later or contact Prabha Yogashala directly." /> : result.data.length === 0 ? <EmptyState title="No upcoming workshops are published." description="Topics, dates, venues, formats, and instructor details remain absent until they are approved." action={<div className="flex flex-col gap-3 sm:flex-row"><ButtonLink href="/contact">Send an Enquiry</ButtonLink><a href={trialWhatsAppUrl} target="_blank" rel="noreferrer" className={buttonStyles({ variant: "secondary" })}><WhatsAppIcon className="mr-2 size-5" />WhatsApp Us</a></div>} /> : <div className="grid gap-5 md:grid-cols-2">{result.data.map((workshop) => <article key={workshop.id} className="rounded-2xl border border-brand/10 bg-surface p-6 shadow-card sm:p-8"><div className="flex flex-wrap gap-2"><Badge tone="sage">Confirmed workshop</Badge>{workshop.format ? <Badge tone="neutral">{workshop.format}</Badge> : null}</div><h2 className="mt-5 font-display text-3xl font-medium text-brand-strong">{workshop.title}</h2><p className="mt-3 text-base leading-7 text-muted">{workshop.summary}</p><p className="mt-5 font-semibold text-brand-strong">{workshop.starts_at ? formatBusinessDateTime(workshop.starts_at) : null}{workshop.ends_at ? ` – ${formatBusinessDateTime(workshop.ends_at)}` : ""}</p><p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-muted">{workshop.description}</p><ButtonLink href="/contact" variant="secondary" className="mt-6">Enquire About This Workshop</ButtonLink></article>)}</div>}
    </Container></Section>
    <ConversionCTA eyebrow="Workshop enquiries" title="Ask about a confirmed workshop." />
  </>;
}
