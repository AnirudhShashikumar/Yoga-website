import type { Metadata } from "next";

import { ClassExplorer } from "@/components/classes/class-explorer";
import { ConversionCTA } from "@/components/public/conversion-cta";
import { PageHero } from "@/components/public/page-hero";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { getPublicClasses } from "@/features/public/data";

export const metadata: Metadata = {
  title: "Classes",
  description:
    "Explore the verified yoga, meditation, pranayama, personal, corporate, prenatal, kids, and specialized practices offered by Prabha Yogashala.",
};

export default async function ClassesPage() {
  const classes = await getPublicClasses();
  return (
    <>
      <PageHero eyebrow="Classes" title="Find a practice that meets you where you are." description="Explore twelve verified offerings across foundational, dynamic, mind-and-breath, specialized, personal, and group formats. Individual timing and delivery details are confirmed during enquiry." />
      <Section>
        <Container>
          {classes.status === "error" ? <EmptyState title="The class catalogue is temporarily unavailable." description="Please try again later or contact Prabha Yogashala directly." /> : classes.data.length ? <ClassExplorer practices={classes.data} /> : <EmptyState title="No classes are published yet." description="Approved classes will appear here after they are published." />}
        </Container>
      </Section>
      <ConversionCTA title="Not sure which practice to choose?" description="Share your experience level and preference for online or offline practice. The available options can be discussed before you decide." />
    </>
  );
}
