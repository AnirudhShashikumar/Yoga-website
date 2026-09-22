import type { Metadata } from "next";

import { TrialEnquiryForm } from "@/components/forms/trial-enquiry-form";
import { PageHero } from "@/components/public/page-hero";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Book a Trial Class",
  description:
    "Prepare a no-account trial-class enquiry for Prabha Yogashala and choose whether to send it through WhatsApp.",
};

type BookPageProps = { searchParams: Promise<{ practice?: string | string[] }> };

export default async function BookPage({ searchParams }: BookPageProps) {
  const requestedPractice = (await searchParams).practice;
  const initialPractice = Array.isArray(requestedPractice) ? requestedPractice[0] : requestedPractice;

  return (
    <>
      <PageHero eyebrow="Book a Trial Class" title="Share the essentials for your first conversation." description="No account is required. The current frontend validates your details locally and prepares a WhatsApp message; it does not store or submit data to a backend." />
      <Section>
        <Container>
          <div className="mx-auto max-w-5xl">
            <TrialEnquiryForm initialPractice={initialPractice} />
          </div>
        </Container>
      </Section>
    </>
  );
}
