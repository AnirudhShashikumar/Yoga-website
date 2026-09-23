import assert from "node:assert/strict";
import test from "node:test";

import { registerSchema, resetPasswordSchema } from "./schemas.ts";
import {
  getPostAuthDestination,
  getSafeInternalPath,
} from "../../lib/auth/redirects.ts";

test("safe redirects accept only allowed internal portal paths", () => {
  assert.equal(getPostAuthDestination("customer", "/dashboard/bookings?view=upcoming"), "/dashboard/bookings?view=upcoming");
  assert.equal(getPostAuthDestination("admin", "/admin/classes"), "/admin/classes");
  assert.equal(getPostAuthDestination("customer", "/admin"), "/dashboard");
  assert.equal(getPostAuthDestination("admin", "/dashboard"), "/admin");
});

test("safe redirects reject external and malformed targets", () => {
  const hostileTargets = [
    "https://evil.example/dashboard",
    "//evil.example/dashboard",
    "javascript:alert(1)",
    "/\\evil.example",
    "/%5c%5cevil.example",
    " /dashboard",
    "/contact",
  ];

  for (const target of hostileTargets) {
    assert.equal(getPostAuthDestination("customer", target), "/dashboard");
  }

  assert.equal(
    getSafeInternalPath("/reset-password", "/login", ["/reset-password"]),
    "/reset-password",
  );
});

test("registration accepts safe profile data but has no role input", () => {
  const result = registerSchema.safeParse({
    fullName: "Asha Kumar",
    email: "ASHA@example.com",
    phone: "+91 98765 43210",
    password: "balanced8",
    confirmPassword: "balanced8",
    terms: "on",
    role: "admin",
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal("role" in result.data, false);
    assert.equal(result.data.email, "asha@example.com");
  }
});

test("registration and reset reject mismatched or weak passwords", () => {
  const registration = registerSchema.safeParse({
    fullName: "Asha Kumar",
    email: "asha@example.com",
    phone: "9876543210",
    password: "password1",
    confirmPassword: "password2",
    terms: "on",
  });
  const reset = resetPasswordSchema.safeParse({
    password: "short",
    confirmPassword: "short",
  });

  assert.equal(registration.success, false);
  assert.equal(reset.success, false);
});
