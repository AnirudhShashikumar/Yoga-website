import type { Enums, Tables } from "@/types/database.generated";

export type PublicClass = Pick<
  Tables<"classes">,
  "id" | "slug" | "name" | "short_description" | "description" | "category" | "levels" | "available_formats" | "media_path" | "featured" | "sort_order"
>;

export type PublicSession = Pick<Tables<"class_sessions">, "id" | "starts_at" | "ends_at" | "format" | "capacity"> & {
  class: Pick<PublicClass, "id" | "slug" | "name">;
};

export type PublicWorkshop = Pick<Tables<"workshops">, "id" | "slug" | "title" | "summary" | "description" | "starts_at" | "ends_at" | "format" | "media_path">;
export type PublicGalleryItem = Pick<Tables<"gallery_items">, "id" | "alt_text" | "caption" | "sort_order" | "media_type" | "storage_path"> & { publicUrl: string };

export const categoryLabels: Record<Enums<"practice_category">, string> = {
  foundational: "Foundational",
  dynamic: "Dynamic",
  mind_breath: "Mind & Breath",
  specialized: "Specialized",
  personal_groups: "Personal & Groups",
};
