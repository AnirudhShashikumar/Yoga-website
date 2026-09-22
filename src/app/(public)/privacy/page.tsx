import type { Metadata } from "next";

import { LegalDraftPage } from "@/components/legal/legal-draft-page";

export const metadata: Metadata = {
  title: "Privacy Policy — Draft",
  description: "A structured draft privacy page awaiting client and legal approval.",
  robots: { index: false, follow: false },
};

const sections = [
  { heading: "Status of this document", body: "Final privacy wording, legal business identity, governing jurisdiction, retention periods, service providers, and contact details have not been approved. This structure must be replaced or reviewed before production launch." },
  { heading: "Information the service may receive", body: "The planned service may receive information a visitor chooses to provide through enquiries, registration, profile management, and booking. The final policy must list the exact fields and purposes after those workflows and providers are implemented." },
  { heading: "Current website form behavior", body: "The current contact and trial forms validate information in the visitor’s browser and prepare a WhatsApp message. They do not persist information to the project database in this milestone. Information sent through WhatsApp is subject to that service and the recipient’s handling." },
  { heading: "Future account and booking data", body: "Authentication, customer profiles, bookings, and administrative records are planned for later milestones. The approved policy must describe collection, lawful basis, access, retention, deletion, security, and user rights before those features launch." },
  { heading: "Contact and rights requests", body: "A verified public email, postal address, and process for privacy requests have not yet been supplied. These details must be added before this document can function as a production privacy policy." },
] as const;

export default function PrivacyPage() {
  return <LegalDraftPage title="Privacy Policy" description="A professional content structure for the final policy, clearly marked as awaiting client and legal review." sections={sections} />;
}
