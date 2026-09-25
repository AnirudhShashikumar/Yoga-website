import "server-only";

import type { PublicClass, PublicGalleryItem, PublicSession, PublicWorkshop } from "@/features/public/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type PublicDataResult<T> =
  | { status: "success"; data: T }
  | { status: "error" };

async function client() {
  try {
    return await createSupabaseServerClient();
  } catch {
    return null;
  }
}

const classFields = "id,slug,name,short_description,description,category,levels,available_formats,media_path,featured,sort_order" as const;

export async function getPublicClasses(): Promise<PublicDataResult<PublicClass[]>> {
  const supabase = await client();
  if (!supabase) return { status: "error" };
  const { data, error } = await supabase.from("classes").select(classFields).eq("published", true).is("archived_at", null).order("sort_order").order("name");
  if (error || !data) return { status: "error" };
  return { status: "success", data };
}

export async function getPublicClassBySlug(slug: string): Promise<PublicDataResult<PublicClass | null>> {
  const supabase = await client();
  if (!supabase) return { status: "error" };
  const { data, error } = await supabase.from("classes").select(classFields).eq("slug", slug).eq("published", true).is("archived_at", null).maybeSingle();
  if (error) return { status: "error" };
  return { status: "success", data };
}

export async function getPublicSessions(): Promise<PublicDataResult<PublicSession[]>> {
  const supabase = await client();
  if (!supabase) return { status: "error" };
  const [sessionResult, classResult] = await Promise.all([
    supabase.from("class_sessions").select("id,class_id,starts_at,ends_at,format,capacity").eq("status", "published").is("archived_at", null).gt("starts_at", new Date().toISOString()).order("starts_at"),
    supabase.from("classes").select("id,slug,name").eq("published", true).is("archived_at", null),
  ]);
  if (sessionResult.error || !sessionResult.data || classResult.error || !classResult.data) return { status: "error" };
  const classes = new Map(classResult.data.map((item) => [item.id, item]));
  return { status: "success", data: sessionResult.data.flatMap((session) => {
    const classItem = classes.get(session.class_id);
    return classItem ? [{ id: session.id, starts_at: session.starts_at, ends_at: session.ends_at, format: session.format, capacity: session.capacity, class: classItem }] : [];
  }) };
}

export async function getPublicWorkshops(): Promise<PublicDataResult<PublicWorkshop[]>> {
  const supabase = await client();
  if (!supabase) return { status: "error" };
  const { data, error } = await supabase.from("workshops").select("id,slug,title,summary,description,starts_at,ends_at,format,media_path").eq("published", true).is("archived_at", null).gt("starts_at", new Date().toISOString()).order("starts_at");
  if (error || !data) return { status: "error" };
  return { status: "success", data };
}

export async function getPublicGallery(): Promise<PublicDataResult<PublicGalleryItem[]>> {
  const supabase = await client();
  if (!supabase) return { status: "error" };
  const { data, error } = await supabase.from("gallery_items").select("id,alt_text,caption,sort_order,media_type,storage_path").eq("published", true).is("archived_at", null).order("sort_order").order("created_at");
  if (error || !data) return { status: "error" };
  return { status: "success", data: data.map((item) => ({ ...item, publicUrl: supabase.storage.from("gallery-media").getPublicUrl(item.storage_path).data.publicUrl })) };
}
