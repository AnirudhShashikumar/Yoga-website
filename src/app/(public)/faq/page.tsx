import type { Metadata } from "next";

import { ConversionCTA } from "@/components/public/conversion-cta";
import { PageHero } from "@/components/public/page-hero";
import { AccordionItem } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { frequentlyAskedQuestions } from "@/config/faq";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers about joining Prabha Yogashala, age suitability, experience levels, formats, trial classes, broad timing, and contact.",
};

export default function FAQPage() {
  return (
    <>
      <PageHero eyebrow="FAQ" title="Useful answers before your first enquiry." description="These answers use verified information only. Unapproved pricing, scheduling, payment, cancellation, and refund details are intentionally not inferred." />
      <Section>
        <Container>
          <div className="mx-auto max-w-4xl space-y-3">
            {frequentlyAskedQuestions.map((item, index) => (
              <AccordionItem key={item.question} title={<span><span className="mr-4 text-sm font-bold text-brand/50">{String(index + 1).padStart(2, "0")}</span>{item.question}</span>}>
                <p>{item.answer}</p>
              </AccordionItem>
            ))}
          </div>
          <div className="mx-auto mt-10 flex max-w-4xl flex-col items-center justify-between gap-5 rounded-2xl bg-sage p-6 text-center sm:flex-row sm:text-left">
            <div><h2 className="font-display text-2xl font-medium text-brand-strong">Still have a question?</h2><p className="mt-2 text-sm leading-6 text-muted">Ask directly when a detail has not yet been published.</p></div>
            <ButtonLink href="/contact" variant="secondary">Contact Us</ButtonLink>
          </div>
        </Container>
      </Section>
      <ConversionCTA />
    </>
  );
}
