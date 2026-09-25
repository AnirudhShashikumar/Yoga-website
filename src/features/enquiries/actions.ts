"use server";

import "server-only";

import { revalidatePath } from "next/cache";

import { getWhatsAppUrl } from "@/config/site";
import { trialEnquirySchema } from "@/features/enquiries/schemas";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type TrialEnquiryState = {
  status: "idle" | "success" | "error";
  message: string;
  whatsappUrl?: string;
  fieldErrors?: Record<string, string>;
};

export const initialTrialEnquiryState: TrialEnquiryState = { status: "idle", message: "" };

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function whatsAppMessage(data: {
  fullName: string; phone: string; email: string; age: number; experienceLevel: string;
  interestedPractice: string; format: string; preferredWindow: string; message: string;
}) {
  return ["Hello Prabha Yogashala, I submitted a trial class enquiry.", `Name: ${data.fullName}`, `Phone: ${data.phone}`, `Email: ${data.email}`, `Age: ${data.age}`, `Experience: ${data.experienceLevel}`, `Practice: ${data.interestedPractice}`, `Format: ${data.format}`, `Preferred window: ${data.preferredWindow}`, data.message ? `Message: ${data.message}` : ""].filter(Boolean).join("\n");
}

export async function submitTrialEnquiryAction(_previous: TrialEnquiryState, formData: FormData): Promise<TrialEnquiryState> {
  const raw = {
    fullName: text(formData, "fullName"), phone: text(formData, "phone"), email: text(formData, "email"),
    age: text(formData, "age"), experienceLevel: text(formData, "experienceLevel"),
    interestedClassId: text(formData, "interestedClassId"), interestedPractice: text(formData, "interestedPractice"),
    format: text(formData, "format"), preferredWindow: text(formData, "preferredWindow"),
    message: text(formData, "message"), consent: text(formData, "consent"), website: text(formData, "website"),
  };
  const parsed = trialEnquirySchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return { status: "error", message: "Check the highlighted information and try again.", fieldErrors };
  }

  let supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  try { supabase = await createSupabaseServerClient(); } catch { return { status: "error", message: "Enquiry services are temporarily unavailable. Please try again later." }; }
  const { data: classItem, error: classError } = await supabase.from("classes").select("id,name").eq("id", parsed.data.interestedClassId).eq("published", true).is("archived_at", null).maybeSingle();
  if (classError || !classItem || classItem.name !== parsed.data.interestedPractice) return { status: "error", message: "The selected practice is no longer available. Refresh the page and choose again." };

  const { error } = await supabase.from("trial_enquiries").insert({
    name: parsed.data.fullName, phone: parsed.data.phone, email: parsed.data.email.toLowerCase(), age: parsed.data.age,
    experience_level: parsed.data.experienceLevel.toLowerCase() as "beginner" | "intermediate" | "advanced",
    interested_class_id: classItem.id, interested_practice: classItem.name,
    preferred_format: parsed.data.format.toLowerCase() as "online" | "offline",
    preferred_time_window: parsed.data.preferredWindow.toLowerCase() as "morning" | "evening",
    message: parsed.data.message, consent_given: true,
  });
  if (error) return { status: "error", message: "Enquiry services are temporarily unavailable. Please try again later." };

  revalidatePath("/admin"); revalidatePath("/admin/enquiries");
  return { status: "success", message: "Your enquiry has been saved. Prabha Yogashala can now follow up using the details you provided.", whatsappUrl: getWhatsAppUrl(whatsAppMessage(parsed.data)) };
}
