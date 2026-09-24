import { z } from "zod";

const optionalText = (minimum: number, maximum: number, message: string) =>
  z
    .string()
    .trim()
    .max(maximum, `Use no more than ${maximum} characters.`)
    .refine((value) => value.length === 0 || value.length >= minimum, message);

export const bookingMutationSchema = z.object({
  id: z.uuid("The selected item is invalid."),
});

export const profileSchema = z.object({
  fullName: optionalText(2, 120, "Enter at least 2 characters or leave this blank."),
  phone: optionalText(7, 30, "Enter at least 7 characters or leave this blank.").refine(
    (value) => value.length === 0 || value.replace(/\D/g, "").length >= 7,
    "Enter a valid phone number or leave this blank.",
  ),
  age: z
    .string()
    .trim()
    .refine(
      (value) => value.length === 0 || /^\d+$/.test(value),
      "Enter a whole number or leave this blank.",
    )
    .refine(
      (value) => value.length === 0 || (Number(value) >= 10 && Number(value) <= 120),
      "Age must be between 10 and 120.",
    ),
  experienceLevel: z.enum(["", "beginner", "intermediate", "advanced"]),
  preferredFormat: z.enum(["", "online", "offline"]),
});

export function firstProfileErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}
