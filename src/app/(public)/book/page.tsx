import type { Metadata } from "next";

import { TrialEnquiryForm } from "@/components/forms/trial-enquiry-form";
import { PageHero } from "@/components/public/page-hero";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { getPublicClasses } from "@/features/public/data";

export const metadata: Metadata = {
  title: "Book a Trial Class",
  description:
    "Prepare a no-account trial-class enquiry for Prabha Yogashala and choose whether to send it through WhatsApp.",
};

type BookPageProps = { searchParams: Promise<{ practice?: string | string[] }> };

export default async function BookPage({ searchParams }: BookPageProps) {
  const requestedPractice = (await searchParams).practice;
  const initialPractice = Array.isArray(requestedPractice) ? requestedPractice[0] : requestedPractice;
  const classes = await getPublicClasses();

  return (
    <>
      <PageHero eyebrow="Book a Trial Class" title="Share the essentials for your first conversation." description="No account is required. Your validated enquiry is stored securely only after you consent and submit it." />
      <Section>
        <Container>
          <div className="mx-auto max-w-5xl">
            {classes.status === "error" ? <EmptyState title="Trial enquiry services are temporarily unavailable." description="Please try again later or contact Prabha Yogashala through WhatsApp." /> : classes.data.length === 0 ? <EmptyState title="No practices are currently available for enquiry." description="Please contact Prabha Yogashala directly for current information." /> : <TrialEnquiryForm initialPractice={initialPractice} classes={classes.data.map((item) => ({ id: item.id, slug: item.slug, name: item.name }))} />}
          </div>
        </Container>
      </Section>
    </>
  );
}
