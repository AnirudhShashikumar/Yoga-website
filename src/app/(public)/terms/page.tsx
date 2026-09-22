import type { Metadata } from "next";

import { LegalDraftPage } from "@/components/legal/legal-draft-page";

export const metadata: Metadata = {
  title: "Terms & Conditions — Draft",
  description: "A structured draft terms page awaiting client and legal approval.",
  robots: { index: false, follow: false },
};

const sections = [
  { heading: "Status of these terms", body: "Final terms, legal business identity, governing law, dispute process, and effective date have not been supplied or approved. This page is a layout and content checklist rather than a binding agreement." },
  { heading: "Enquiries and availability", body: "A website enquiry does not confirm a class, workshop, format, time, location, or price. The final terms should define when an arrangement becomes confirmed after the booking workflow and business rules are approved." },
  { heading: "Pricing and payment", body: "No verified prices, taxes, payment methods, memberships, or payment terms are published in the current milestone. Approved commercial terms must be inserted before payment or paid booking features are introduced." },
  { heading: "Changes and cancellations", body: "Cancellation, rescheduling, refund, late-arrival, and missed-session policies have not been provided. The website does not infer these rules; final approved wording is required before launch." },
  { heading: "Participation and responsibility", body: "Any participation wording must be reviewed for the actual services offered and must not create unsupported medical or outcome claims. Specialized practices require clear, approved scope and suitability language." },
  { heading: "Contact and legal notices", body: "A verified legal name, address, public email, and jurisdiction are required to complete this document and provide an appropriate route for formal notices." },
] as const;

export default function TermsPage() {
  return <LegalDraftPage title="Terms & Conditions" description="A production-quality layout for future approved terms, without inventing definitive business policies." sections={sections} />;
}
