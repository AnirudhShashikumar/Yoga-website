import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthContext } from "@/lib/auth/session";
import type { Tables } from "@/types/database.generated";
import type {
  CustomerBooking,
  CustomerClass,
  CustomerDataResult,
  CustomerProfile,
  CustomerSession,
} from "@/features/customer/types";

type CustomerDataContext = {
  userId: string;
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
};

export function getServerTimestamp() {
  return Date.now();
}

async function getCustomerDataContext(): Promise<
  CustomerDataResult<CustomerDataContext>
> {
  const auth = await getAuthContext();

  if (auth.status !== "authenticated" || auth.role !== "customer") {
    return { status: "error", reason: "unauthorized" };
  }

  try {
    const supabase = await createSupabaseServerClient();
    return { status: "success", data: { userId: auth.userId, supabase } };
  } catch {
    return { status: "error", reason: "unavailable" };
  }
}

function toCustomerClass(row: Tables<"classes">): CustomerClass {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.short_description,
    description: row.description,
    category: row.category,
    levels: row.levels,
    availableFormats: row.available_formats,
  };
}

function toCustomerSession(
  row: Tables<"class_sessions">,
  classRow: Tables<"classes">,
): CustomerSession {
  return {
    id: row.id,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    format: row.format,
    capacity: row.capacity,
    class: toCustomerClass(classRow),
  };
}

export async function getCustomerProfile(): Promise<
  CustomerDataResult<CustomerProfile>
> {
  const context = await getCustomerDataContext();
  if (context.status === "error") return context;

  const { supabase, userId } = context.data;
  const [userResult, profileResult] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("profiles")
      .select("id,full_name,phone,age,experience_level,preferred_format")
      .eq("id", userId)
      .maybeSingle(),
  ]);

  if (
    userResult.error ||
    profileResult.error ||
    !userResult.data.user?.email ||
    !profileResult.data
  ) {
    return { status: "error", reason: "unavailable" };
  }

  const profile = profileResult.data;
  return {
    status: "success",
    data: {
      id: profile.id,
      email: userResult.data.user.email,
      fullName: profile.full_name,
      phone: profile.phone,
      age: profile.age,
      experienceLevel: profile.experience_level,
      preferredFormat: profile.preferred_format,
    },
  };
}

export async function getPublishedClasses(): Promise<
  CustomerDataResult<CustomerClass[]>
> {
  const context = await getCustomerDataContext();
  if (context.status === "error") return context;

  const { data, error } = await context.data.supabase
    .from("classes")
    .select(
      "id,slug,name,short_description,description,category,levels,available_formats,published,archived_at,media_path,sort_order,featured,created_at,updated_at",
    )
    .eq("published", true)
    .is("archived_at", null)
    .order("sort_order")
    .order("name");

  if (error || !data) return { status: "error", reason: "unavailable" };
  return { status: "success", data: data.map(toCustomerClass) };
}

export async function getPublishedSessions(): Promise<
  CustomerDataResult<CustomerSession[]>
> {
  const context = await getCustomerDataContext();
  if (context.status === "error") return context;

  const { supabase } = context.data;
  const { data: sessionRows, error: sessionError } = await supabase
    .from("class_sessions")
    .select("id,class_id,starts_at,ends_at,format,capacity,status,archived_at,created_at,updated_at")
    .eq("status", "published")
    .is("archived_at", null)
    .gt("starts_at", new Date().toISOString())
    .order("starts_at");

  if (sessionError || !sessionRows) {
    return { status: "error", reason: "unavailable" };
  }

  if (sessionRows.length === 0) return { status: "success", data: [] };

  const classIds = [...new Set(sessionRows.map((row) => row.class_id))];
  const { data: classRows, error: classError } = await supabase
    .from("classes")
    .select(
      "id,slug,name,short_description,description,category,levels,available_formats,published,archived_at,media_path,sort_order,featured,created_at,updated_at",
    )
    .in("id", classIds);

  if (classError || !classRows) {
    return { status: "error", reason: "unavailable" };
  }

  const classesById = new Map(classRows.map((row) => [row.id, row]));
  const sessions = sessionRows.flatMap((row) => {
    const classRow = classesById.get(row.class_id);
    return classRow ? [toCustomerSession(row, classRow)] : [];
  });

  return { status: "success", data: sessions };
}

export async function getCustomerBookings(): Promise<
  CustomerDataResult<CustomerBooking[]>
> {
  const context = await getCustomerDataContext();
  if (context.status === "error") return context;

  const { supabase, userId } = context.data;
  const { data: bookingRows, error: bookingError } = await supabase
    .from("bookings")
    .select("id,customer_id,session_id,status,created_at,updated_at")
    .eq("customer_id", userId)
    .order("created_at", { ascending: false });

  if (bookingError || !bookingRows) {
    return { status: "error", reason: "unavailable" };
  }

  if (bookingRows.length === 0) return { status: "success", data: [] };

  const sessionIds = [...new Set(bookingRows.map((row) => row.session_id))];
  const { data: sessionRows, error: sessionError } = await supabase
    .from("class_sessions")
    .select("id,class_id,starts_at,ends_at,format,capacity,status,archived_at,created_at,updated_at")
    .in("id", sessionIds);

  if (sessionError || !sessionRows) {
    return { status: "error", reason: "unavailable" };
  }

  const classIds = [...new Set(sessionRows.map((row) => row.class_id))];
  const classResult = classIds.length
    ? await supabase
        .from("classes")
        .select(
          "id,slug,name,short_description,description,category,levels,available_formats,published,archived_at,media_path,sort_order,featured,created_at,updated_at",
        )
        .in("id", classIds)
    : { data: [], error: null };

  if (classResult.error || !classResult.data) {
    return { status: "error", reason: "unavailable" };
  }

  const classesById = new Map(classResult.data.map((row) => [row.id, row]));
  const sessionsById = new Map(
    sessionRows.flatMap((row) => {
      const classRow = classesById.get(row.class_id);
      return classRow ? [[row.id, toCustomerSession(row, classRow)] as const] : [];
    }),
  );

  return {
    status: "success",
    data: bookingRows.map((row) => ({
      id: row.id,
      status: row.status,
      createdAt: row.created_at,
      session: sessionsById.get(row.session_id) ?? null,
    })),
  };
}
