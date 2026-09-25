import { z } from "zod";

const slug = z
  .string()
  .trim()
  .min(1, "Enter a slug.")
  .max(120, "Use no more than 120 characters.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens.");

const requiredText = (label: string, maximum: number) =>
  z.string().trim().min(1, `${label} is required.`).max(maximum, `Use no more than ${maximum} characters.`);

const optionalWholeNumber = z
  .string()
  .trim()
  .refine((value) => value === "" || /^\d+$/.test(value), "Enter a whole number or leave this blank.");

export const classCreateSchema = z.object({
  slug,
  name: requiredText("Name", 120),
  shortDescription: requiredText("Short description", 300),
  description: requiredText("Description", 5000),
  category: z.enum(["foundational", "dynamic", "mind_breath", "specialized", "personal_groups"]),
  levels: z.array(z.enum(["beginner", "intermediate", "advanced"])),
  formats: z.array(z.enum(["online", "offline"])),
  sortOrder: optionalWholeNumber.refine((value) => value === "" || Number(value) <= 100000, "Use a smaller sort order."),
  featured: z.boolean(),
  published: z.boolean(),
});

export const classUpdateSchema = classCreateSchema.omit({ slug: true }).extend({
  id: z.uuid(),
});

export const sessionSchema = z.object({
  id: z.uuid().optional(),
  classId: z.uuid("Choose a class."),
  date: z.iso.date("Choose a valid date."),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Choose a start time."),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Choose an end time."),
  format: z.enum(["online", "offline"]),
  capacity: optionalWholeNumber.refine(
    (value) => value === "" || (Number(value) >= 1 && Number(value) <= 10000),
    "Capacity must be between 1 and 10,000.",
  ),
  publish: z.boolean(),
});

export const statusMutationSchema = z.object({
  id: z.uuid(),
  status: z.string().min(1),
});

export const customerProfileSchema = z.object({
  id: z.uuid(),
  fullName: z.string().trim().max(120).refine((value) => value === "" || value.length >= 2, "Enter at least 2 characters or leave this blank."),
  phone: z.string().trim().max(30).refine((value) => value === "" || value.replace(/\D/g, "").length >= 7, "Enter a valid phone number or leave this blank."),
  age: optionalWholeNumber.refine((value) => value === "" || (Number(value) >= 10 && Number(value) <= 120), "Age must be between 10 and 120."),
  experienceLevel: z.enum(["", "beginner", "intermediate", "advanced"]),
  preferredFormat: z.enum(["", "online", "offline"]),
});

export const workshopCreateSchema = z.object({
  slug,
  title: requiredText("Title", 160),
  summary: requiredText("Summary", 400),
  description: requiredText("Description", 8000),
  date: z.union([z.literal(""), z.iso.date()]),
  startTime: z.string(),
  endTime: z.string(),
  format: z.enum(["", "online", "offline"]),
  published: z.boolean(),
});

export const workshopUpdateSchema = workshopCreateSchema.omit({ slug: true }).extend({
  id: z.uuid(),
});

export const galleryMetadataSchema = z.object({
  id: z.uuid().optional(),
  altText: requiredText("Alt text", 500),
  caption: z.string().trim().max(1000, "Use no more than 1,000 characters."),
  sortOrder: optionalWholeNumber.refine((value) => value === "" || Number(value) <= 100000, "Use a smaller sort order."),
  published: z.boolean(),
});

export function firstFieldErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}
