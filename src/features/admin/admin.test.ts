import assert from "node:assert/strict";
import test from "node:test";

import {
  classCreateSchema,
  customerProfileSchema,
  galleryMetadataSchema,
  sessionSchema,
} from "./schemas.ts";
import { trialEnquirySchema } from "../enquiries/schemas.ts";
import { businessDateTimeToIso, toBusinessDateTimeInput } from "../../lib/dates.ts";

test("class management accepts supported catalogue fields and strips role injection", () => {
  const result = classCreateSchema.safeParse({
    slug: "gentle-flow",
    name: "Gentle Flow",
    shortDescription: "A measured practice.",
    description: "A measured practice with approved details.",
    category: "foundational",
    levels: ["beginner"],
    formats: ["online"],
    sortOrder: "10",
    featured: false,
    published: true,
    role: "admin",
  });
  assert.equal(result.success, true);
  if (result.success) assert.equal("role" in result.data, false);
});

test("class and profile management reject malformed inputs", () => {
  assert.equal(classCreateSchema.safeParse({ slug: "Unsafe Slug", name: "", shortDescription: "", description: "", category: "other", levels: [], formats: [], sortOrder: "-1", featured: false, published: false }).success, false);
  assert.equal(customerProfileSchema.safeParse({ id: "not-a-user", fullName: "A", phone: "123", age: "9", experienceLevel: "expert", preferredFormat: "hybrid" }).success, false);
});

test("session management validates ids, time fields, enums, and capacity", () => {
  const valid = sessionSchema.safeParse({
    classId: "c0000000-0000-4000-8000-000000000001",
    date: "2026-10-01",
    startTime: "09:00",
    endTime: "10:00",
    format: "online",
    capacity: "20",
    publish: true,
  });
  assert.equal(valid.success, true);
  assert.equal(sessionSchema.safeParse({ classId: "bad", date: "tomorrow", startTime: "9", endTime: "10", format: "hybrid", capacity: "0", publish: false }).success, false);
});

test("gallery metadata requires meaningful bounded alt text", () => {
  assert.equal(galleryMetadataSchema.safeParse({ altText: "Instructor demonstrating a seated posture", caption: "Morning practice", sortOrder: "1", published: true }).success, true);
  assert.equal(galleryMetadataSchema.safeParse({ altText: "", caption: "", sortOrder: "-1", published: true }).success, false);
});

test("trial enquiries require consent and a real class identifier", () => {
  const base = { fullName: "Asha Kumar", phone: "9876543210", email: "asha@example.com", age: "32", experienceLevel: "Beginner", interestedClassId: "c0000000-0000-4000-8000-000000000001", interestedPractice: "Hatha Yoga", format: "Online", preferredWindow: "Morning", message: "", website: "" };
  assert.equal(trialEnquirySchema.safeParse({ ...base, consent: "on" }).success, true);
  assert.equal(trialEnquirySchema.safeParse(base).success, false);
});

test("admin scheduling converts India Standard Time to UTC and back", () => {
  const iso = businessDateTimeToIso("2026-10-01", "09:15");
  assert.equal(iso, "2026-10-01T03:45:00.000Z");
  assert.deepEqual(toBusinessDateTimeInput(iso ?? ""), { date: "2026-10-01", time: "09:15" });
});
