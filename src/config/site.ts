export const siteConfig = {
  name: "Prabha Yogashala",
  philosophy: "Positive & Healthy Life",
  description:
    "Yoga instruction for practitioners aged 10 and above, offered online and offline.",
  experienceYears: 7,
  qualifications: ["M.Sc", "NIS Certification Course"] as const,
  availability: {
    morning: "5:00 AM–8:00 AM",
    evening: "5:00 PM–8:00 PM",
    exactScheduleConfirmed: false,
  },
  contact: {
    whatsappE164: "+917353242875",
    instagram: "https://www.instagram.com/prabha_yogashala/",
    youtube: "https://youtube.com/@prabhayogashala",
  },
} as const;

export const primaryCta = "Book a Trial Class";
export const secondaryCta = "WhatsApp Us";

export function getWhatsAppUrl(message?: string) {
  const number = siteConfig.contact.whatsappE164.replace(/\D/g, "");
  const baseUrl = `https://wa.me/${number}` as const;

  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
}

export const trialWhatsAppUrl = getWhatsAppUrl(
  "Hello Prabha Yogashala, I would like to learn more about a trial class.",
);

