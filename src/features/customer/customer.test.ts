import assert from "node:assert/strict";
import test from "node:test";

import { resolvePortalAccess } from "../../lib/auth/access.ts";
import { bookingMutationSchema, profileSchema } from "./schemas.ts";

test("anonymous users are redirected from each protected portal", () => {
  assert.deepEqual(resolvePortalAccess({ status: "anonymous" }, "customer"), {
    status: "redirect",
    destination: "/login?next=%2Fdashboard",
  });
  assert.deepEqual(resolvePortalAccess({ status: "anonymous" }, "admin"), {
    status: "redirect",
    destination: "/login?next=%2Fadmin",
  });
});

test("customer and admin access remain separated", () => {
  const customer = {
    status: "authenticated" as const,
    userId: "10000000-0000-4000-8000-000000000001",
    role: "customer" as const,
  };
  const admin = {
    status: "authenticated" as const,
    userId: "a0000000-0000-4000-8000-00000000000a",
    role: "admin" as const,
  };

  assert.deepEqual(resolvePortalAccess(customer, "customer"), { status: "allowed" });
  assert.deepEqual(resolvePortalAccess(customer, "admin"), {
    status: "redirect",
    destination: "/dashboard",
  });
  assert.deepEqual(resolvePortalAccess(admin, "admin"), { status: "allowed" });
  assert.deepEqual(resolvePortalAccess(admin, "customer"), {
    status: "redirect",
    destination: "/admin",
  });
});

test("portal access fails closed when account services are unavailable", () => {
  assert.deepEqual(
    resolvePortalAccess({ status: "unavailable" }, "customer"),
    { status: "unavailable" },
  );
});

test("booking input accepts only a session or booking UUID", () => {
  assert.equal(
    bookingMutationSchema.safeParse({ id: "51000000-0000-4000-8000-000000000001" }).success,
    true,
  );
  assert.equal(bookingMutationSchema.safeParse({ id: "another-customer" }).success, false);
});

test("profile validation accepts supported optional fields only", () => {
  const valid = profileSchema.safeParse({
    fullName: "Asha Kumar",
    phone: "+91 98765 43210",
    age: "32",
    experienceLevel: "beginner",
    preferredFormat: "online",
    role: "admin",
  });

  assert.equal(valid.success, true);
  if (valid.success) assert.equal("role" in valid.data, false);
});

test("profile validation rejects invalid age, phone, and enum values", () => {
  const invalid = profileSchema.safeParse({
    fullName: "A",
    phone: "123",
    age: "9",
    experienceLevel: "expert",
    preferredFormat: "hybrid",
  });

  assert.equal(invalid.success, false);
});
