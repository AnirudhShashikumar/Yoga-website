import type { Enums } from "@/types/database.generated";

export type CustomerDataResult<T> =
  | { status: "success"; data: T }
  | { status: "error"; reason: "unauthorized" | "unavailable" };

export type CustomerProfile = {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  age: number | null;
  experienceLevel: Enums<"experience_level"> | null;
  preferredFormat: Enums<"delivery_format"> | null;
};

export type CustomerClass = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: Enums<"practice_category">;
  levels: Enums<"experience_level">[];
  availableFormats: Enums<"delivery_format">[];
};

export type CustomerSession = {
  id: string;
  startsAt: string;
  endsAt: string;
  format: Enums<"delivery_format">;
  capacity: number | null;
  class: CustomerClass;
};

export type CustomerBooking = {
  id: string;
  status: Enums<"booking_status">;
  createdAt: string;
  session: CustomerSession | null;
};

export type CustomerActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string> | undefined;
  values?: Record<string, string> | undefined;
};

export const initialCustomerActionState: CustomerActionState = {
  status: "idle",
  message: "",
};
