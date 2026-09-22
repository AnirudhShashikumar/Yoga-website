import type { Metadata } from "next";

import { ConversionCTA } from "@/components/public/conversion-cta";
import { PageHero } from "@/components/public/page-hero";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Contact Prabha Yogashala for current trial, group, personal-session, and membership pricing information.",
};

const pricingOptions = [
  { title: "Trial Class", label: "Start here", description: "Trial classes are offered. Current price and available practice options are confirmed directly." },
  { title: "Group Classes", label: "Shared practice", description: "Group Classes are a verified offering. Pricing, format, and scheduling details require confirmation." },
  { title: "Personal Sessions", label: "Individual format", description: "Personal Sessions are arranged through enquiry. No package price or duration has been approved for publication." },
  { title: "Membership", label: "Not yet confirmed", description: "Membership options and terms have not been confirmed. No membership is sold through this website in the current milestone." },
] as const;

export default function PricingPage() {
  return (
    <>
      <PageHero eyebrow="Pricing" title="Clear conversations before commitments." description="No verified prices, packages, taxes, or membership terms have been supplied. This page keeps the choices understandable without inventing amounts." />
      <Section>
        <Container>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {pricingOptions.map((option) => (
              <Card key={option.title} className="flex flex-col">
                <Badge tone={option.title === "Membership" ? "neutral" : "sage"}>{option.label}</Badge>
                <h2 className="mt-6 font-display text-2xl font-medium text-brand-strong">{option.title}</h2>
                <p className="mt-4 flex-1 text-base leading-7 text-muted">{option.description}</p>
                <p className="mt-8 border-t border-brand/10 pt-6 font-display text-2xl text-brand">Contact for pricing</p>
                <ButtonLink href="/contact" variant="secondary" className="mt-5">Contact Us</ButtonLink>
              </Card>
            ))}
          </div>
          <div className="mt-10 rounded-2xl bg-sky/50 p-6 text-sm leading-6 text-muted sm:p-8">
            Pricing shown or discussed elsewhere should not be assumed current. Confirm the amount, format, schedule, and any applicable policy directly before proceeding.
          </div>
        </Container>
      </Section>
      <ConversionCTA title="Ask about the right starting option." description="Tell Prabha Yogashala what you are interested in, and request current pricing without creating an account." />
    </>
  );
}
