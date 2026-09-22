import type { Route } from "next";
import Link from "next/link";

import { AccordionItem } from "@/components/ui/accordion";
import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { frequentlyAskedQuestions } from "@/config/faq";

export function FAQPreview() {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Helpful answers"
          title="A few things to know before you begin."
          align="center"
        />
        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {frequentlyAskedQuestions.slice(0, 4).map((faq) => (
            <AccordionItem key={faq.question} title={faq.question}>
              <p>{faq.answer}</p>
            </AccordionItem>
          ))}
        </div>
        <div className="mt-7 text-center">
          <Link
            href={"/faq" as Route}
            className="group inline-flex min-h-11 items-center font-semibold text-brand-strong"
          >
            View all FAQs
            <ArrowRightIcon className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
