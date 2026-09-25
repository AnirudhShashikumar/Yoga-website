import type { Enums, Tables } from "@/types/database.generated";

export type AdminDataResult<T> =
  | { status: "success"; data: T }
  | { status: "error"; reason: "unauthorized" | "unavailable" };

export type AdminActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string> | undefined;
};

export const initialAdminActionState: AdminActionState = {
  status: "idle",
  message: "",
};

export type AdminClass = Tables<"classes">;
export type AdminProfile = Tables<"profiles"> & {
  email: string | null;
  emailConfirmedAt: string | null;
  lastSignInAt: string | null;
  accountCreatedAt: string | null;
  bookingCount: number;
};

export type AdminSession = Tables<"class_sessions"> & {
  class: Pick<Tables<"classes">, "id" | "name" | "slug" | "published"> | null;
  activeBookingCount: number;
  totalBookingCount: number;
};

export type AdminBooking = Tables<"bookings"> & {
  customer: Pick<Tables<"profiles">, "id" | "full_name" | "phone"> | null;
  session: AdminSession | null;
};

export type AdminEnquiry = Tables<"trial_enquiries"> & {
  interestedClass: Pick<Tables<"classes">, "id" | "name" | "slug"> | null;
};

export type AdminWorkshop = Tables<"workshops">;
export type AdminGalleryItem = Tables<"gallery_items"> & { publicUrl: string };

export type BookingStatus = Enums<"booking_status">;
export type SessionStatus = Enums<"session_status">;
export type EnquiryStatus = Enums<"enquiry_status">;
