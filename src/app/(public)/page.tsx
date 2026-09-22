import type { Metadata } from "next";

import { AudienceSection } from "@/components/home/audience-section";
import { FAQPreview } from "@/components/home/faq-preview";
import { FinalCTA } from "@/components/home/final-cta";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { Hero } from "@/components/home/hero";
import { Introduction } from "@/components/home/introduction";
import { OfferingSection } from "@/components/home/offering-section";
import { PhilosophySection } from "@/components/home/philosophy-section";
import { PracticePreview } from "@/components/home/practice-preview";
import { SchedulePreview } from "@/components/home/schedule-preview";
import { TrustBar } from "@/components/home/trust-bar";
import { WorkshopPreview } from "@/components/home/workshop-preview";

export const metadata: Metadata = {
  title: "Yoga for Every Stage of Practice",
  description:
    "Explore online and offline yoga at Prabha Yogashala for practitioners aged 10 and above, from beginner to advanced.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Introduction />
      <PracticePreview />
      <OfferingSection />
      <AudienceSection />
      <PhilosophySection />
      <SchedulePreview />
      <WorkshopPreview />
      <GalleryPreview />
      <FAQPreview />
      <FinalCTA />
    </>
  );
}

