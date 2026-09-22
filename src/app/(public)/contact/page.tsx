import type { Metadata } from "next";

import { ContactEnquiryForm } from "@/components/forms/contact-enquiry-form";
import { PageHero } from "@/components/public/page-hero";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { WhatsAppIcon } from "@/components/ui/icons";
import { siteConfig, trialWhatsAppUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Prabha Yogashala through the verified WhatsApp, Instagram, or YouTube details and enquire about classes.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Begin with a straightforward conversation." description="Ask about practices, broad timing, online or offline format, workshops, or current pricing. A studio address and public email have not yet been confirmed." />
      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="space-y-5 lg:col-span-5">
              <a href={trialWhatsAppUrl} target="_blank" rel="noreferrer" className="block rounded-2xl border border-brand/10 bg-brand-strong p-6 text-white shadow-card transition-transform hover:-translate-y-1">
                <WhatsAppIcon className="size-7" />
                <h2 className="mt-6 font-display text-2xl font-medium">WhatsApp</h2>
                <p className="mt-2 text-sm leading-6 text-white/75">Use the client-supplied number to start an enquiry. Reconfirmation is required before launch.</p>
              </a>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <a href={siteConfig.contact.instagram} target="_blank" rel="noreferrer" className="rounded-2xl border border-brand/10 bg-surface p-6 shadow-card"><p className="text-sm font-bold uppercase tracking-[0.12em] text-brand">Instagram</p><p className="mt-3 font-display text-xl text-brand-strong">@prabha_yogashala</p></a>
                <a href={siteConfig.contact.youtube} target="_blank" rel="noreferrer" className="rounded-2xl border border-brand/10 bg-surface p-6 shadow-card"><p className="text-sm font-bold uppercase tracking-[0.12em] text-brand">YouTube</p><p className="mt-3 font-display text-xl text-brand-strong">@prabhayogashala</p></a>
              </div>
              <div className="rounded-2xl border border-brand/10 bg-surface-subtle p-6">
                <h2 className="font-display text-2xl font-medium text-brand-strong">General practice windows</h2>
                <dl className="mt-5 space-y-4 text-sm"><div className="flex justify-between gap-4"><dt className="font-semibold text-muted">Morning</dt><dd className="text-right text-brand-strong">{siteConfig.availability.morning}</dd></div><div className="flex justify-between gap-4"><dt className="font-semibold text-muted">Evening</dt><dd className="text-right text-brand-strong">{siteConfig.availability.evening}</dd></div></dl>
                <p className="mt-5 text-sm leading-6 text-muted">Exact sessions, location, and response times are not published.</p>
              </div>
            </div>
            <div className="lg:col-span-7">
              <h2 className="font-display text-3xl font-medium text-brand-strong">Prepare an enquiry</h2>
              <p className="mt-3 mb-6 text-base leading-7 text-muted">Complete the fields below, then review the prepared message before choosing whether to send it through WhatsApp.</p>
              <ContactEnquiryForm />
              <a href={trialWhatsAppUrl} target="_blank" rel="noreferrer" className={buttonStyles({ variant: "ghost", className: "mt-4" })}>Skip the form and open WhatsApp</a>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
