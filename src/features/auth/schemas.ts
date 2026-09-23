import { z } from "zod";

const emailSchema = z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address."));

const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(72, "Use no more than 72 characters.")
  .regex(/[A-Za-z]/, "Include at least one letter.")
  .regex(/[0-9]/, "Include at least one number.");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password."),
  next: z.string().optional(),
});

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Enter your full name.")
      .max(120, "Keep your name under 120 characters."),
    email: emailSchema,
    phone: z
      .string()
      .trim()
      .min(7, "Enter a phone number with at least 7 digits.")
      .max(30, "Keep the phone number under 30 characters.")
      .refine(
        (value) => value.replace(/\D/g, "").length >= 7,
        "Enter a valid phone number.",
      ),
    password: passwordSchema,
    confirmPassword: z.string(),
    terms: z.literal("on", { error: "You must acknowledge the Terms and Privacy Policy." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const forgotPasswordSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const registrationProfileMetadataSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(30),
});
