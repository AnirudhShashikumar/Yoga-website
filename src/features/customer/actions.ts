"use server";

import "server-only";

import { revalidatePath } from "next/cache";

import { bookingMutationSchema, firstProfileErrors, profileSchema } from "@/features/customer/schemas";
import type { CustomerActionState } from "@/features/customer/types";
import { getAuthContext } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

async function getCustomerMutationContext() {
  const auth = await getAuthContext();
  if (auth.status !== "authenticated" || auth.role !== "customer") return null;

  try {
    return {
      userId: auth.userId,
      supabase: await createSupabaseServerClient(),
    };
  } catch {
    return null;
  }
}

function mutationUnavailable(): CustomerActionState {
  return {
    status: "error",
    message: "This account action is temporarily unavailable. Please try again.",
  };
}

export async function bookSessionAction(
  _previousState: CustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  const parsed = bookingMutationSchema.safeParse({ id: text(formData, "sessionId") });
  if (!parsed.success) {
    return { status: "error", message: "The selected session is invalid." };
  }

  const context = await getCustomerMutationContext();
  if (!context) return mutationUnavailable();

  const { data: session, error: sessionError } = await context.supabase
    .from("class_sessions")
    .select("id,starts_at,status,archived_at")
    .eq("id", parsed.data.id)
    .maybeSingle();

  if (
    sessionError ||
    !session ||
    session.status !== "published" ||
    session.archived_at ||
    new Date(session.starts_at).getTime() <= Date.now()
  ) {
    return {
      status: "error",
      message: "This session is no longer available to book.",
    };
  }

  const { error } = await context.supabase.from("bookings").insert({
    customer_id: context.userId,
    session_id: parsed.data.id,
  });

  if (error?.code === "23505") {
    return { status: "error", message: "You already have an active booking for this session." };
  }

  if (error?.code === "P0001" && error.message.toLowerCase().includes("capacity")) {
    return { status: "error", message: "This session has reached capacity." };
  }

  if (error) return mutationUnavailable();

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard/classes");
  revalidatePath("/dashboard/schedule");

  return {
    status: "success",
    message: "Your booking request has been created and is pending confirmation.",
  };
}

export async function cancelBookingAction(
  _previousState: CustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  const parsed = bookingMutationSchema.safeParse({ id: text(formData, "bookingId") });
  if (!parsed.success) {
    return { status: "error", message: "The selected booking is invalid." };
  }

  const context = await getCustomerMutationContext();
  if (!context) return mutationUnavailable();

  const { data, error } = await context.supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", parsed.data.id)
    .eq("customer_id", context.userId)
    .in("status", ["pending", "confirmed"])
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return {
      status: "error",
      message: "This booking cannot be cancelled online. Please contact the instructor for help.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard/schedule");

  return { status: "success", message: "Your booking has been cancelled." };
}

export async function updateProfileAction(
  _previousState: CustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  const values = {
    fullName: text(formData, "fullName"),
    phone: text(formData, "phone"),
    age: text(formData, "age"),
    experienceLevel: text(formData, "experienceLevel"),
    preferredFormat: text(formData, "preferredFormat"),
  };
  const parsed = profileSchema.safeParse(values);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      fieldErrors: firstProfileErrors(parsed.error),
      values,
    };
  }

  const context = await getCustomerMutationContext();
  if (!context) return { ...mutationUnavailable(), values };

  const { data, error } = await context.supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName || null,
      phone: parsed.data.phone || null,
      age: parsed.data.age ? Number(parsed.data.age) : null,
      experience_level: parsed.data.experienceLevel || null,
      preferred_format: parsed.data.preferredFormat || null,
    })
    .eq("id", context.userId)
    .select("id")
    .maybeSingle();

  if (error || !data) return { ...mutationUnavailable(), values };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");

  return {
    status: "success",
    message: "Your profile has been updated.",
    values,
  };
}
