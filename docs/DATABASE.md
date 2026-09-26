# Prabha Yogashala Database and Security Model

## Scope

Milestone 4 established the reproducible Supabase foundation and Milestone 5.5 linked and verified it against the hosted staging project. Milestones 6 and 7 now use the generated database types and hosted records across the customer portal, admin portal, and public managed-content surfaces.

The database contains no passwords, payment data, medical histories, government identifiers, or other fields outside the approved V1. Authentication identity and email remain in Supabase Auth.

## Relationship model

```text
auth.users
  ├── 1:1 profiles
  ├── 1:1 user_roles
  ├── 1:N bookings ── N:1 class_sessions ── N:1 classes
  └── 0:N trial_enquiries ─────────────────── 0:1 classes

workshops       independent managed publication records
gallery_items   independent managed Storage metadata
```

- `profiles` contains only customer-editable application data. The Auth user is the identity source.
- `user_roles` is the protected authorization source for `customer` and `admin`.
- `classes` describes a practice. `class_sessions` describes a scheduled occurrence.
- `bookings` retains history and restricts each customer to one active `pending` or `confirmed` booking per session.
- `trial_enquiries` accepts anonymous or authenticated leads but exposes management reads only to admins.
- Managed content uses publication/status plus `archived_at`; destructive Data API deletes are not granted.

All IDs are UUIDs. Audit and scheduled timestamps use `timestamptz`, which PostgreSQL stores as instants and returns relative to the connection timezone. Application code must render scheduled instants in an explicitly chosen visitor or business timezone.

## Status and transition rules

- Booking: `pending → confirmed|cancelled`; `confirmed → completed|cancelled`.
- Session: `draft → published|cancelled`; `published → completed|cancelled`.
- Trial enquiry: `new → contacted|closed`; `contacted → converted|closed`.

Database triggers enforce these transitions. Reopening or reversing a terminal state requires a future, explicit business decision and migration.

## Role trust boundary

The `auth.users` insert trigger creates a blank profile and assigns only `customer`. It ignores user metadata and request payloads. `private.is_admin()` is a `SECURITY DEFINER` helper with a fixed empty `search_path`; it reads the protected role table for RLS decisions.

Registration may temporarily store validated full name and phone in Auth user metadata so the email-confirmation callback can copy them into `profiles`. That metadata never contains or determines a role; the database trigger still assigns `customer` independently.

Neither ordinary customers nor Data API admins receive `INSERT`, `UPDATE`, or `DELETE` privileges on `user_roles`. Trusted role provisioning must therefore be performed through controlled project administration or a future narrowly scoped server-only operation. A service-role secret is not required by this milestone and must never be exposed through `NEXT_PUBLIC_*` values or browser code.

Insert guards overwrite customer-controlled booking/enquiry ownership, status, IDs, audit timestamps, and consent audit metadata. Anonymous/customer enquiry policies require affirmative consent; they do not infer consent from submission. Column privileges additionally limit profile updates and prevent customer booking status updates. Route guards and client-visible role values are UX aids only; PostgreSQL privileges, RLS, constraints, and triggers are the security boundary.

## RLS access matrix

| Resource | Anonymous | Customer | Admin |
| --- | --- | --- | --- |
| Profiles | No access | Read/update own permitted fields | Read/update permitted profile fields |
| Roles | No access | Read own; no mutation | Read all; no Data API mutation |
| Classes | Read published, non-archived | Same | Read/create/update all |
| Sessions | Read published sessions of published classes | Same | Read/create/update all |
| Bookings | No access | Read own; create eligible pending booking; cancel own active future booking | Read/create/update all |
| Trial enquiries | Insert only | Insert only | Insert/read/update |
| Workshops | Read published, non-archived | Same | Read/create/update all |
| Gallery items | Read published, non-archived | Same | Read/create/update all |

No application-table delete privilege is exposed through the Data API. The repeatable 69-assertion pgTAP suite in `supabase/tests/database/rls.test.sql` exercises anonymous, customer A, customer B, and admin contexts, including reciprocal isolation, owner-only booking-history detail reads, ownership injection, duplicate/capacity booking behavior, cancellation boundaries, admin-directory access, immutable slugs, booked-session facts, and archival safeguards. Test identities and records exist only inside its rolled-back transaction, and `finish(true)` makes an assertion failure fail the hosted command.

## Admin lifecycle safety

Migration `20260925000200_admin_portal_safety.sql` adds the final Milestone 7 database boundaries:

- `admin_customer_directory()` is a fixed-search-path `SECURITY DEFINER` function that fails unless the caller has the protected admin role and returns only the limited Auth directory fields required by customer management.
- Class slugs are immutable after creation so public URLs and joins do not silently break.
- A class cannot be unpublished or archived while it owns a future published session.
- Once a session has any booking history, its class, start/end instants, and delivery format cannot be rewritten.
- Session capacity cannot be lowered below the number of active pending/confirmed bookings.
- A session with active bookings cannot be archived. Operators must use valid cancellation/status workflows while preserving booking history.

Application actions add earlier, friendlier validation for publishing only future sessions of published, active classes. Database constraints and RLS remain authoritative under concurrency or bypass attempts.

## Customer booking safety

Migration `20260924000100_customer_portal_booking_safety.sql` adds the database boundary required by the customer portal:

- A fixed-search-path `SECURITY DEFINER` insert trigger locks the target `class_sessions` row, so concurrent customer booking attempts are serialized for that session.
- The trigger rejects missing, unpublished, cancelled/completed, past, archived-class, and over-capacity sessions. Capacity counts only active `pending` and `confirmed` bookings.
- The original ownership/status protection trigger still derives `customer_id` from `auth.uid()` and forces customer-created bookings to `pending`; browser input cannot book for another account or inject an administrative status.
- The existing unique active-booking index rejects obvious duplicate active bookings for the same customer/session.
- A narrow update policy permits only the owning customer to change an active booking for a published future session to `cancelled`. Ownership, session, timestamps, and all other status transitions remain unavailable to customers.

The client has not confirmed a business cancellation window. This rule therefore implements only the conservative technically valid transition; refunds, rescheduling, and policy promises are not implemented.

Migration `20260925000100_customer_booking_history_visibility.sql` adds two fixed-search-path owner checks and narrow read policies so a customer can still see the real class and session referenced by their own booking after that session/class is no longer public. Another customer and anonymous visitors cannot use that history path. This preserves useful completed/cancelled booking details without republishing managed content.

## Seed and static-to-database mapping

`supabase/seed.sql` inserts only the 12 verified practice definitions already public in `src/config/classes.ts`. It is safe to rerun and never overwrites managed records. No users, schedules, bookings, testimonials, prices, instructors, workshops, or gallery events are seeded.

The mapping is intentionally direct:

| TypeScript | PostgreSQL |
| --- | --- |
| `slug`, `name`, `summary`, `overview` | `slug`, `name`, `short_description`, `description` |
| `Foundational` | `foundational` |
| `Dynamic` | `dynamic` |
| `Mind & Breath` | `mind_breath` |
| `Specialized` | `specialized` |
| `Personal & Groups` | `personal_groups` |

The richer `maySuit`, `whatToExpect`, and `practiceQualities` page copy remains static until its content-management requirements are approved. Unverified per-practice levels and formats are seeded as empty arrays. Milestone 9 will define the final read bridge without changing this milestone's frontend.

## Storage boundaries

All four buckets are public-read and admin-write. Public delivery is appropriate for approved site imagery; public buckets do not make uploads public. PostgreSQL stores relative object paths, never permanent public URLs.

| Bucket | Limit | Allowed MIME types | Path convention |
| --- | ---: | --- | --- |
| `class-media` | 8 MiB | JPEG, PNG, WebP, AVIF | `<class-uuid>/<file>` |
| `workshop-media` | 8 MiB | JPEG, PNG, WebP, AVIF | `<workshop-uuid>/<file>` |
| `gallery-media` | 25 MiB | Same images plus MP4, WebM | `<gallery-item-uuid>/<file>` |
| `founder-media` | 8 MiB | JPEG, PNG, WebP, AVIF | `founder/<file>` |

Only protected admins may create, replace, or delete objects. Upload workflows must use the Storage API, validate file extension/content/MIME/size on the server, generate safe filenames, and verify media rights. Development placeholder SVGs are not production media and are not uploaded.

## Anonymous enquiry abuse boundary

The anonymous insert policy is database defense in depth, not approval for a generic browser-to-table submission path. The later integration must use a server action or route handler with server-side Zod validation, payload length limits, normalized contact data, rate limiting, a honeypot or Turnstile-style control if required, explicit consent capture, and non-sensitive error responses. RLS does not prevent spam.

## Hosted staging verification

Verified on 2026-09-24 and extended on 2026-09-25 against the Supabase project referenced by the uncommitted `.env.local`:

- The Supabase CLI is a project-local development dependency and is locked at 2.117.0 in `pnpm-lock.yaml`; no global installation is required.
- The linked project reference exactly matches `NEXT_PUBLIC_SUPABASE_URL`. The reference and all credentials remain unprinted and uncommitted.
- A migration dry run showed only the three ordered project migrations and `supabase/seed.sql`. The migrations and seed were then applied successfully to the linked staging database.
- The hosted migration history contains `20260923000100`, `20260923000200`, `20260923000300`, `20260924000100`, `20260925000100`, and `20260925000200` in order.
- The hosted `classes` table contains exactly 12 rows and 12 unique slugs, matching the approved static taxonomy. No users, bookings, sessions, prices, workshops, or gallery records were seeded.
- `supabase db lint --linked --level warning --fail-on error` reported no schema errors.
- The established rollback-only suite passed 61/61 before Milestone 7. The eight new Milestone 7 assertions were then run directly in a rolled-back hosted SQL Editor transaction and passed 8/8. A one-command 69-assertion CLI rerun remains unavailable on this host because `supabase test db --linked` requires Docker, which is not installed.
- Hosted `public` schema types were generated into `src/types/database.generated.ts` and are now used by the browser, server, and Proxy Supabase client factories.
- A hosted read-only state check on 2026-09-25 found 12 published, non-archived classes, zero class sessions, and zero bookings. The portals therefore display real class records and honest session/booking empty states until administrators publish sessions.

The pgTAP file keeps data-modifying CTEs at the statement top level, scopes fixture-count assertions so real hosted users do not make the rollback-only suite brittle, and raises on assertion failure. Test identities and records remain transaction-local and are rolled back.

## Local migration and verification workflow

Prerequisites are the project dependencies and a running Docker-compatible engine.

```bash
pnpm exec supabase start
pnpm exec supabase db reset
pnpm exec supabase test db
pnpm exec supabase db lint --local --level warning
pnpm exec supabase gen types typescript --local > src/types/database.generated.ts
```

`supabase db reset` recreates the local database, applies ordered migrations, and then applies `supabase/seed.sql`. Never run a destructive reset against a linked production project. Review generated type changes before committing; do not hand-author a file that claims to be generated.

For remote deployment, link the intended environment explicitly, inspect migration state and the pending diff, then use the project's controlled migration step. Preview and production must not silently share a database.
