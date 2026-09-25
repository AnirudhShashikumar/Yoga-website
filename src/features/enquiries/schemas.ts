import { z } from "zod";

const requiredText = (label: string, minimum = 2) =>
  z.string().trim().min(minimum, `${label} is required.`);

const phoneSchema = z
  .string()
  .trim()
  .min(7, "Enter a phone number with at least 7 digits.")
  .refine((value) => value.replace(/\D/g, "").length >= 7, "Enter a valid phone number.");

export const trialEnquirySchema = z.object({
  fullName: requiredText("Full name"),
  phone: phoneSchema,
  email: z.email("Enter a valid email address."),
  age: z.coerce.number().int("Enter a whole-number age.").min(10, "Trial enquiries are available for ages 10 and above.").max(120, "Enter a valid age."),
  experienceLevel: z.enum(["Beginner", "Intermediate", "Advanced"], {
    error: "Choose your experience level.",
  }),
  interestedClassId: z.uuid("Choose a practice."),
  interestedPractice: z.string().trim().min(1, "Choose a practice.").max(120),
  format: z.enum(["Online", "Offline"], { error: "Choose online or offline." }),
  preferredWindow: z.enum(["Morning", "Evening"], {
    error: "Choose a broad practice window.",
  }),
  message: z.string().trim().max(1000, "Keep the message under 1,000 characters."),
  consent: z.literal("on", { error: "Consent is required to submit this enquiry." }),
  website: z.string().max(0).optional(),
});

export const contactEnquirySchema = z.object({
  fullName: requiredText("Full name"),
  email: z.email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .refine(
      (value) => value.length === 0 || value.replace(/\D/g, "").length >= 7,
      "Enter a valid phone number or leave it blank.",
    ),
  topic: z.enum(["Trial class", "Classes", "Schedule", "Pricing", "Workshop", "Other"], {
    error: "Choose an enquiry topic.",
  }),
  message: requiredText("Message", 10).max(1000, "Keep the message under 1,000 characters."),
});

export type TrialEnquiry = z.infer<typeof trialEnquirySchema>;
export type ContactEnquiry = z.infer<typeof contactEnquirySchema>;
