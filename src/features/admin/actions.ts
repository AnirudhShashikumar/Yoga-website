"use server";

import "server-only";

import { revalidatePath } from "next/cache";

import {
  classCreateSchema,
  classUpdateSchema,
  customerProfileSchema,
  firstFieldErrors,
  galleryMetadataSchema,
  sessionSchema,
  statusMutationSchema,
  workshopCreateSchema,
  workshopUpdateSchema,
} from "@/features/admin/schemas";
import type { AdminActionState } from "@/features/admin/types";
import { businessDateTimeToIso } from "@/lib/dates";
import { getAuthContext } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function checked(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function values(formData: FormData, key: string) {
  return formData.getAll(key).filter((value): value is string => typeof value === "string");
}

async function getAdminMutationContext() {
  const auth = await getAuthContext();
  if (auth.status !== "authenticated" || auth.role !== "admin") return null;
  try {
    return { supabase: await createSupabaseServerClient(), userId: auth.userId };
  } catch {
    return null;
  }
}

function unavailable(message = "This administrative action is temporarily unavailable. Please try again."): AdminActionState {
  return { status: "error", message };
}

function invalid(error: Parameters<typeof firstFieldErrors>[0]): AdminActionState {
  return {
    status: "error",
    message: "Check the highlighted information and try again.",
    fieldErrors: firstFieldErrors(error),
  };
}

function revalidateClassViews(slug?: string) {
  revalidatePath("/");
  revalidatePath("/classes");
  if (slug) revalidatePath(`/classes/${slug}`);
  revalidatePath("/schedule");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/classes");
  revalidatePath("/dashboard/schedule");
  revalidatePath("/admin");
  revalidatePath("/admin/classes");
  revalidatePath("/admin/schedule");
}

function classValues(formData: FormData) {
  return {
    name: text(formData, "name"),
    shortDescription: text(formData, "shortDescription"),
    description: text(formData, "description"),
    category: text(formData, "category"),
    levels: values(formData, "levels"),
    formats: values(formData, "formats"),
    sortOrder: text(formData, "sortOrder"),
    featured: checked(formData, "featured"),
    published: checked(formData, "published"),
  };
}

export async function createClassAction(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = classCreateSchema.safeParse({
    slug: text(formData, "slug"),
    ...classValues(formData),
  });
  if (!parsed.success) return invalid(parsed.error);
  const context = await getAdminMutationContext();
  if (!context) return unavailable();

  const { error } = await context.supabase.from("classes").insert({
    slug: parsed.data.slug,
    name: parsed.data.name,
    short_description: parsed.data.shortDescription,
    description: parsed.data.description,
    category: parsed.data.category,
    levels: parsed.data.levels,
    available_formats: parsed.data.formats,
    sort_order: parsed.data.sortOrder ? Number(parsed.data.sortOrder) : 0,
    featured: parsed.data.featured,
    published: parsed.data.published,
  });
  if (error?.code === "23505") return unavailable("That slug is already in use. Choose another slug.");
  if (error) return unavailable();

  revalidateClassViews(parsed.data.slug);
  return { status: "success", message: "Class created successfully." };
}

export async function updateClassAction(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = classUpdateSchema.safeParse({ id: text(formData, "id"), ...classValues(formData) });
  if (!parsed.success) return invalid(parsed.error);
  const context = await getAdminMutationContext();
  if (!context) return unavailable();

  const { data, error } = await context.supabase
    .from("classes")
    .update({
      name: parsed.data.name,
      short_description: parsed.data.shortDescription,
      description: parsed.data.description,
      category: parsed.data.category,
      levels: parsed.data.levels,
      available_formats: parsed.data.formats,
      sort_order: parsed.data.sortOrder ? Number(parsed.data.sortOrder) : 0,
      featured: parsed.data.featured,
      published: parsed.data.published,
    })
    .eq("id", parsed.data.id)
    .select("slug")
    .maybeSingle();

  if (error?.code === "23514") return unavailable("This class has a future published session. Resolve that session before hiding the class.");
  if (error || !data) return unavailable();
  revalidateClassViews(data.slug);
  return { status: "success", message: "Class updated successfully." };
}

export async function archiveClassAction(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = statusMutationSchema.pick({ id: true }).safeParse({ id: text(formData, "id") });
  if (!parsed.success) return unavailable("The selected class is invalid.");
  const context = await getAdminMutationContext();
  if (!context) return unavailable();
  const { data, error } = await context.supabase
    .from("classes")
    .update({ published: false, archived_at: new Date().toISOString() })
    .eq("id", parsed.data.id)
    .select("slug")
    .maybeSingle();
  if (error?.code === "23514") return unavailable("Cancel or complete future published sessions before archiving this class.");
  if (error || !data) return unavailable();
  revalidateClassViews(data.slug);
  return { status: "success", message: "Class archived. Historical records were retained." };
}

export async function restoreClassAction(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const id = text(formData, "id");
  const parsed = statusMutationSchema.pick({ id: true }).safeParse({ id });
  if (!parsed.success) return unavailable("The selected class is invalid.");
  const context = await getAdminMutationContext();
  if (!context) return unavailable();
  const { data, error } = await context.supabase
    .from("classes")
    .update({ archived_at: null, published: false })
    .eq("id", id)
    .select("slug")
    .maybeSingle();
  if (error || !data) return unavailable();
  revalidateClassViews(data.slug);
  return { status: "success", message: "Class restored as an unpublished draft." };
}

function sessionValues(formData: FormData) {
  return {
    id: text(formData, "id") || undefined,
    classId: text(formData, "classId"),
    date: text(formData, "date"),
    startTime: text(formData, "startTime"),
    endTime: text(formData, "endTime"),
    format: text(formData, "format"),
    capacity: text(formData, "capacity"),
    publish: checked(formData, "publish"),
  };
}

function parseSessionTimes(date: string, startTime: string, endTime: string) {
  const startsAt = businessDateTimeToIso(date, startTime);
  const endsAt = businessDateTimeToIso(date, endTime);
  if (!startsAt || !endsAt || new Date(endsAt) <= new Date(startsAt)) return null;
  return { startsAt, endsAt };
}

export async function createSessionAction(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = sessionSchema.safeParse(sessionValues(formData));
  if (!parsed.success) return invalid(parsed.error);
  const times = parseSessionTimes(parsed.data.date, parsed.data.startTime, parsed.data.endTime);
  if (!times) return unavailable("The end time must be later than the start time on the selected date.");
  if (parsed.data.publish && new Date(times.startsAt) <= new Date()) return unavailable("Published sessions must begin in the future.");
  const context = await getAdminMutationContext();
  if (!context) return unavailable();

  if (parsed.data.publish) {
    const { data: classItem } = await context.supabase.from("classes").select("published,archived_at").eq("id", parsed.data.classId).maybeSingle();
    if (!classItem?.published || classItem.archived_at) return unavailable("Publish the selected class before publishing its session.");
  }

  const { error } = await context.supabase.from("class_sessions").insert({
    class_id: parsed.data.classId,
    starts_at: times.startsAt,
    ends_at: times.endsAt,
    format: parsed.data.format,
    capacity: parsed.data.capacity ? Number(parsed.data.capacity) : null,
    status: parsed.data.publish ? "published" : "draft",
  });
  if (error) return unavailable();
  revalidateClassViews();
  return { status: "success", message: parsed.data.publish ? "Session created and published." : "Draft session created." };
}

export async function updateSessionAction(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = sessionSchema.safeParse(sessionValues(formData));
  if (!parsed.success || !parsed.data.id) return parsed.success ? unavailable("The selected session is invalid.") : invalid(parsed.error);
  const times = parseSessionTimes(parsed.data.date, parsed.data.startTime, parsed.data.endTime);
  if (!times) return unavailable("The end time must be later than the start time on the selected date.");
  const context = await getAdminMutationContext();
  if (!context) return unavailable();
  const { error } = await context.supabase
    .from("class_sessions")
    .update({
      class_id: parsed.data.classId,
      starts_at: times.startsAt,
      ends_at: times.endsAt,
      format: parsed.data.format,
      capacity: parsed.data.capacity ? Number(parsed.data.capacity) : null,
    })
    .eq("id", parsed.data.id);
  if (error?.code === "23514") return unavailable("Booked session timing, format, and class cannot be changed, and capacity cannot be lower than active bookings.");
  if (error) return unavailable();
  revalidateClassViews();
  return { status: "success", message: "Session details updated." };
}

export async function updateSessionStatusAction(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = statusMutationSchema.safeParse({ id: text(formData, "id"), status: text(formData, "status") });
  if (!parsed.success || !["published", "cancelled", "completed"].includes(parsed.data.status)) return unavailable("The selected session status is invalid.");
  const context = await getAdminMutationContext();
  if (!context) return unavailable();
  const { error } = await context.supabase
    .from("class_sessions")
    .update({ status: parsed.data.status as "published" | "cancelled" | "completed" })
    .eq("id", parsed.data.id);
  if (error?.code === "23514") return unavailable("That session status change is not permitted from its current state.");
  if (error) return unavailable();
  revalidateClassViews();
  return { status: "success", message: `Session marked ${parsed.data.status}.` };
}

export async function archiveSessionAction(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const id = text(formData, "id");
  const parsed = statusMutationSchema.pick({ id: true }).safeParse({ id });
  if (!parsed.success) return unavailable("The selected session is invalid.");
  const context = await getAdminMutationContext();
  if (!context) return unavailable();
  const { error } = await context.supabase.from("class_sessions").update({ archived_at: new Date().toISOString() }).eq("id", id);
  if (error?.code === "23514") return unavailable("Cancel active bookings and ensure the session is no longer published before archiving it.");
  if (error) return unavailable();
  revalidateClassViews();
  return { status: "success", message: "Session archived. Booking history was retained." };
}

export async function updateBookingStatusAction(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = statusMutationSchema.safeParse({ id: text(formData, "id"), status: text(formData, "status") });
  if (!parsed.success || !["confirmed", "completed", "cancelled"].includes(parsed.data.status)) return unavailable("The selected booking status is invalid.");
  const context = await getAdminMutationContext();
  if (!context) return unavailable();
  const { data, error } = await context.supabase
    .from("bookings")
    .update({ status: parsed.data.status as "confirmed" | "completed" | "cancelled" })
    .eq("id", parsed.data.id)
    .select("id")
    .maybeSingle();
  if (error?.code === "23514") return unavailable("That booking status change is not permitted from its current state.");
  if (error || !data) return unavailable();
  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/customers");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard/schedule");
  return { status: "success", message: `Booking marked ${parsed.data.status}.` };
}

export async function updateCustomerProfileAction(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = customerProfileSchema.safeParse({
    id: text(formData, "id"), fullName: text(formData, "fullName"),
    phone: text(formData, "phone"), age: text(formData, "age"),
    experienceLevel: text(formData, "experienceLevel"), preferredFormat: text(formData, "preferredFormat"),
  });
  if (!parsed.success) return invalid(parsed.error);
  const context = await getAdminMutationContext();
  if (!context) return unavailable();
  const { data, error } = await context.supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName || null,
      phone: parsed.data.phone || null,
      age: parsed.data.age ? Number(parsed.data.age) : null,
      experience_level: parsed.data.experienceLevel || null,
      preferred_format: parsed.data.preferredFormat || null,
    })
    .eq("id", parsed.data.id)
    .select("id")
    .maybeSingle();
  if (error || !data) return unavailable();
  revalidatePath("/admin/customers");
  revalidatePath(`/admin/customers/${parsed.data.id}`);
  return { status: "success", message: "Customer profile updated." };
}

export async function updateEnquiryStatusAction(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = statusMutationSchema.safeParse({ id: text(formData, "id"), status: text(formData, "status") });
  if (!parsed.success || !["contacted", "converted", "closed"].includes(parsed.data.status)) return unavailable("The selected enquiry status is invalid.");
  const context = await getAdminMutationContext();
  if (!context) return unavailable();
  const { error } = await context.supabase
    .from("trial_enquiries")
    .update({ status: parsed.data.status as "contacted" | "converted" | "closed" })
    .eq("id", parsed.data.id);
  if (error?.code === "23514") return unavailable("That enquiry status change is not permitted from its current state.");
  if (error) return unavailable();
  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${parsed.data.id}`);
  return { status: "success", message: `Enquiry marked ${parsed.data.status}.` };
}

function workshopValues(formData: FormData) {
  return {
    title: text(formData, "title"), summary: text(formData, "summary"),
    description: text(formData, "description"), date: text(formData, "date"),
    startTime: text(formData, "startTime"), endTime: text(formData, "endTime"),
    format: text(formData, "format"), published: checked(formData, "published"),
  };
}

function workshopTimes(data: { date: string; startTime: string; endTime: string }) {
  if (!data.date) return { startsAt: null, endsAt: null };
  const startsAt = businessDateTimeToIso(data.date, data.startTime);
  const endsAt = data.endTime ? businessDateTimeToIso(data.date, data.endTime) : null;
  if (!startsAt || (endsAt && new Date(endsAt) <= new Date(startsAt))) return null;
  return { startsAt, endsAt };
}

export async function createWorkshopAction(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const parsed = workshopCreateSchema.safeParse({ slug: text(formData, "slug"), ...workshopValues(formData) });
  if (!parsed.success) return invalid(parsed.error);
  const times = workshopTimes(parsed.data);
  if (!times || (parsed.data.published && !times.startsAt)) return unavailable("Published workshops require a valid start date and time; any end time must be later.");
  const context = await getAdminMutationContext();
  if (!context) return unavailable();
  const { error } = await context.supabase.from("workshops").insert({
    slug: parsed.data.slug, title: parsed.data.title, summary: parsed.data.summary,
    description: parsed.data.description, starts_at: times.startsAt, ends_at: times.endsAt,
    format: parsed.data.format || null, published: parsed.data.published,
  });
  if (error?.code === "23505") return unavailable("That workshop slug is already in use.");
  if (error) return unavailable();
  revalidatePath("/"); revalidatePath("/workshops"); revalidatePath("/admin"); revalidatePath("/admin/workshops");
  return { status: "success", message: "Workshop created." };
}

export async function updateWorkshopAction(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const parsed = workshopUpdateSchema.safeParse({ id: text(formData, "id"), ...workshopValues(formData) });
  if (!parsed.success) return invalid(parsed.error);
  const times = workshopTimes(parsed.data);
  if (!times || (parsed.data.published && !times.startsAt)) return unavailable("Published workshops require a valid start date and time; any end time must be later.");
  const context = await getAdminMutationContext();
  if (!context) return unavailable();
  const { error } = await context.supabase.from("workshops").update({
    title: parsed.data.title, summary: parsed.data.summary, description: parsed.data.description,
    starts_at: times.startsAt, ends_at: times.endsAt, format: parsed.data.format || null,
    published: parsed.data.published,
  }).eq("id", parsed.data.id);
  if (error) return unavailable();
  revalidatePath("/"); revalidatePath("/workshops"); revalidatePath("/admin/workshops");
  return { status: "success", message: "Workshop updated." };
}

export async function archiveWorkshopAction(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const id = text(formData, "id");
  const parsed = statusMutationSchema.pick({ id: true }).safeParse({ id });
  if (!parsed.success) return unavailable("The selected workshop is invalid.");
  const context = await getAdminMutationContext();
  if (!context) return unavailable();
  const { error } = await context.supabase.from("workshops").update({ published: false, archived_at: new Date().toISOString() }).eq("id", id);
  if (error) return unavailable();
  revalidatePath("/"); revalidatePath("/workshops"); revalidatePath("/admin/workshops");
  return { status: "success", message: "Workshop archived." };
}

const imageTypes = new Map([
  ["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"], ["image/avif", "avif"],
]);

export async function uploadGalleryItemAction(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const parsed = galleryMetadataSchema.safeParse({
    altText: text(formData, "altText"), caption: text(formData, "caption"),
    sortOrder: text(formData, "sortOrder"), published: checked(formData, "published"),
  });
  if (!parsed.success) return invalid(parsed.error);
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return unavailable("Choose an image to upload.");
  const extension = imageTypes.get(file.type);
  if (!extension || file.size > 8 * 1024 * 1024) return unavailable("Use a JPEG, PNG, WebP, or AVIF image no larger than 8 MB.");
  const context = await getAdminMutationContext();
  if (!context) return unavailable();
  const id = crypto.randomUUID();
  const path = `${id}/${crypto.randomUUID()}.${extension}`;
  const upload = await context.supabase.storage.from("gallery-media").upload(path, file, { contentType: file.type, upsert: false });
  if (upload.error) return unavailable("The image could not be uploaded. No gallery item was created.");
  const { error } = await context.supabase.from("gallery_items").insert({
    id, storage_path: path, media_type: "image", alt_text: parsed.data.altText,
    caption: parsed.data.caption || null, sort_order: parsed.data.sortOrder ? Number(parsed.data.sortOrder) : 0,
    published: parsed.data.published,
  });
  if (error) {
    await context.supabase.storage.from("gallery-media").remove([path]);
    return unavailable();
  }
  revalidatePath("/"); revalidatePath("/gallery"); revalidatePath("/admin/gallery");
  return { status: "success", message: "Gallery image uploaded." };
}

export async function updateGalleryItemAction(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const parsed = galleryMetadataSchema.safeParse({
    id: text(formData, "id"), altText: text(formData, "altText"), caption: text(formData, "caption"),
    sortOrder: text(formData, "sortOrder"), published: checked(formData, "published"),
  });
  if (!parsed.success || !parsed.data.id) return parsed.success ? unavailable("The selected item is invalid.") : invalid(parsed.error);
  const context = await getAdminMutationContext();
  if (!context) return unavailable();
  const { error } = await context.supabase.from("gallery_items").update({
    alt_text: parsed.data.altText, caption: parsed.data.caption || null,
    sort_order: parsed.data.sortOrder ? Number(parsed.data.sortOrder) : 0,
    published: parsed.data.published,
  }).eq("id", parsed.data.id);
  if (error) return unavailable();
  revalidatePath("/"); revalidatePath("/gallery"); revalidatePath("/admin/gallery");
  return { status: "success", message: "Gallery item updated." };
}

export async function archiveGalleryItemAction(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const id = text(formData, "id");
  const parsed = statusMutationSchema.pick({ id: true }).safeParse({ id });
  if (!parsed.success) return unavailable("The selected gallery item is invalid.");
  const context = await getAdminMutationContext();
  if (!context) return unavailable();
  const { error } = await context.supabase.from("gallery_items").update({ published: false, archived_at: new Date().toISOString() }).eq("id", id);
  if (error) return unavailable();
  revalidatePath("/"); revalidatePath("/gallery"); revalidatePath("/admin/gallery");
  return { status: "success", message: "Gallery item archived; its media remains retained." };
}
