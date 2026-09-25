import "server-only";

import { getAuthContext } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.generated";
import type {
  AdminBooking,
  AdminClass,
  AdminDataResult,
  AdminEnquiry,
  AdminGalleryItem,
  AdminProfile,
  AdminSession,
  AdminWorkshop,
} from "@/features/admin/types";

type AdminContext = {
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
};

async function getAdminDataContext(): Promise<AdminDataResult<AdminContext>> {
  const auth = await getAuthContext();
  if (auth.status !== "authenticated" || auth.role !== "admin") {
    return { status: "error", reason: "unauthorized" };
  }

  try {
    return { status: "success", data: { supabase: await createSupabaseServerClient() } };
  } catch {
    return { status: "error", reason: "unavailable" };
  }
}

export async function getAdminClasses(): Promise<AdminDataResult<AdminClass[]>> {
  const context = await getAdminDataContext();
  if (context.status === "error") return context;

  const { data, error } = await context.data.supabase
    .from("classes")
    .select("*")
    .order("sort_order")
    .order("name");

  if (error || !data) return { status: "error", reason: "unavailable" };
  return { status: "success", data };
}

export async function getAdminSessions(): Promise<AdminDataResult<AdminSession[]>> {
  const context = await getAdminDataContext();
  if (context.status === "error") return context;
  const { supabase } = context.data;

  const [sessionResult, classResult, bookingResult] = await Promise.all([
    supabase.from("class_sessions").select("*").order("starts_at"),
    supabase.from("classes").select("id,name,slug,published"),
    supabase.from("bookings").select("session_id,status"),
  ]);

  if (
    sessionResult.error || !sessionResult.data ||
    classResult.error || !classResult.data ||
    bookingResult.error || !bookingResult.data
  ) return { status: "error", reason: "unavailable" };

  const classes = new Map(classResult.data.map((item) => [item.id, item]));
  const counts = new Map<string, { active: number; total: number }>();
  for (const booking of bookingResult.data) {
    const current = counts.get(booking.session_id) ?? { active: 0, total: 0 };
    current.total += 1;
    if (booking.status === "pending" || booking.status === "confirmed") current.active += 1;
    counts.set(booking.session_id, current);
  }

  return {
    status: "success",
    data: sessionResult.data.map((session) => ({
      ...session,
      class: classes.get(session.class_id) ?? null,
      activeBookingCount: counts.get(session.id)?.active ?? 0,
      totalBookingCount: counts.get(session.id)?.total ?? 0,
    })),
  };
}

export async function getAdminBookings(): Promise<AdminDataResult<AdminBooking[]>> {
  const context = await getAdminDataContext();
  if (context.status === "error") return context;
  const { supabase } = context.data;

  const [bookingResult, sessionResult, classResult, profileResult] = await Promise.all([
    supabase.from("bookings").select("*").order("created_at", { ascending: false }),
    supabase.from("class_sessions").select("*"),
    supabase.from("classes").select("id,name,slug,published"),
    supabase.from("profiles").select("id,full_name,phone"),
  ]);

  if (
    bookingResult.error || !bookingResult.data ||
    sessionResult.error || !sessionResult.data ||
    classResult.error || !classResult.data ||
    profileResult.error || !profileResult.data
  ) return { status: "error", reason: "unavailable" };

  const classes = new Map(classResult.data.map((item) => [item.id, item]));
  const profiles = new Map(profileResult.data.map((item) => [item.id, item]));
  const sessionCounts = new Map<string, { active: number; total: number }>();
  for (const booking of bookingResult.data) {
    const current = sessionCounts.get(booking.session_id) ?? { active: 0, total: 0 };
    current.total += 1;
    if (booking.status === "pending" || booking.status === "confirmed") current.active += 1;
    sessionCounts.set(booking.session_id, current);
  }
  const sessions = new Map(
    sessionResult.data.map((session) => [
      session.id,
      {
        ...session,
        class: classes.get(session.class_id) ?? null,
        activeBookingCount: sessionCounts.get(session.id)?.active ?? 0,
        totalBookingCount: sessionCounts.get(session.id)?.total ?? 0,
      } satisfies AdminSession,
    ]),
  );

  return {
    status: "success",
    data: bookingResult.data.map((booking) => ({
      ...booking,
      customer: profiles.get(booking.customer_id) ?? null,
      session: sessions.get(booking.session_id) ?? null,
    })),
  };
}

export async function getAdminCustomers(): Promise<AdminDataResult<AdminProfile[]>> {
  const context = await getAdminDataContext();
  if (context.status === "error") return context;
  const { supabase } = context.data;

  const [profileResult, roleResult, directoryResult, bookingResult] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("user_roles").select("user_id,role").eq("role", "customer"),
    supabase.rpc("admin_customer_directory"),
    supabase.from("bookings").select("customer_id"),
  ]);

  if (
    profileResult.error || !profileResult.data ||
    roleResult.error || !roleResult.data ||
    directoryResult.error || !directoryResult.data ||
    bookingResult.error || !bookingResult.data
  ) return { status: "error", reason: "unavailable" };

  const customerIds = new Set(roleResult.data.map((role) => role.user_id));
  const directory = new Map(directoryResult.data.map((item) => [item.user_id, item]));
  const bookingCounts = new Map<string, number>();
  for (const booking of bookingResult.data) {
    bookingCounts.set(booking.customer_id, (bookingCounts.get(booking.customer_id) ?? 0) + 1);
  }

  return {
    status: "success",
    data: profileResult.data
      .filter((profile) => customerIds.has(profile.id))
      .map((profile) => {
        const account = directory.get(profile.id);
        return {
          ...profile,
          email: account?.email ?? null,
          emailConfirmedAt: account?.email_confirmed_at ?? null,
          lastSignInAt: account?.last_sign_in_at ?? null,
          accountCreatedAt: account?.created_at ?? null,
          bookingCount: bookingCounts.get(profile.id) ?? 0,
        };
      }),
  };
}

export async function getAdminEnquiries(): Promise<AdminDataResult<AdminEnquiry[]>> {
  const context = await getAdminDataContext();
  if (context.status === "error") return context;
  const { supabase } = context.data;

  const [enquiryResult, classResult] = await Promise.all([
    supabase.from("trial_enquiries").select("*").order("created_at", { ascending: false }),
    supabase.from("classes").select("id,name,slug"),
  ]);
  if (
    enquiryResult.error || !enquiryResult.data ||
    classResult.error || !classResult.data
  ) return { status: "error", reason: "unavailable" };

  const classes = new Map(classResult.data.map((item) => [item.id, item]));
  return {
    status: "success",
    data: enquiryResult.data.map((enquiry) => ({
      ...enquiry,
      interestedClass: enquiry.interested_class_id
        ? classes.get(enquiry.interested_class_id) ?? null
        : null,
    })),
  };
}

export async function getAdminWorkshops(): Promise<AdminDataResult<AdminWorkshop[]>> {
  const context = await getAdminDataContext();
  if (context.status === "error") return context;
  const { data, error } = await context.data.supabase
    .from("workshops")
    .select("*")
    .order("starts_at", { ascending: true, nullsFirst: false });
  if (error || !data) return { status: "error", reason: "unavailable" };
  return { status: "success", data };
}

export async function getAdminGallery(): Promise<AdminDataResult<AdminGalleryItem[]>> {
  const context = await getAdminDataContext();
  if (context.status === "error") return context;
  const { supabase } = context.data;
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("sort_order")
    .order("created_at", { ascending: false });
  if (error || !data) return { status: "error", reason: "unavailable" };

  return {
    status: "success",
    data: data.map((item) => ({
      ...item,
      publicUrl: supabase.storage.from("gallery-media").getPublicUrl(item.storage_path).data.publicUrl,
    })),
  };
}

export async function getAdminOverview() {
  const [customers, bookings, sessions, enquiries, classes, workshops, gallery] = await Promise.all([
    getAdminCustomers(),
    getAdminBookings(),
    getAdminSessions(),
    getAdminEnquiries(),
    getAdminClasses(),
    getAdminWorkshops(),
    getAdminGallery(),
  ]);
  if (
    customers.status === "error" || bookings.status === "error" ||
    sessions.status === "error" || enquiries.status === "error" ||
    classes.status === "error" || workshops.status === "error" || gallery.status === "error"
  ) return { status: "error", reason: "unavailable" } as const;

  return {
    status: "success",
    data: {
      counts: {
        customers: customers.data.length,
        bookings: bookings.data.length,
        sessions: sessions.data.length,
        enquiries: enquiries.data.length,
        classes: classes.data.length,
        workshops: workshops.data.length,
        gallery: gallery.data.length,
      },
      bookings: bookings.data,
      sessions: sessions.data,
      enquiries: enquiries.data,
    },
  } as const;
}

export function findById<T extends { id: string }>(items: T[], id: string) {
  return items.find((item) => item.id === id) ?? null;
}

export type { Tables };
