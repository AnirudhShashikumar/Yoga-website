# Prabha Yogashala Database and Security Model

## Scope

Milestone 4 establishes the reproducible Supabase foundation only. The public website still reads the typed static content in `src/config/classes.ts`; authentication UI, application mutations, dashboards, and live public reads are intentionally deferred.

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
| Bookings | No access | Read own; create eligible pending booking | Read/create/update all |
| Trial enquiries | Insert only | Insert only | Insert/read/update |
| Workshops | Read published, non-archived | Same | Read/create/update all |
| Gallery items | Read published, non-archived | Same | Read/create/update all |

No application-table delete privilege is exposed through the Data API. The repeatable pgTAP suite in `supabase/tests/database/rls.test.sql` exercises anonymous, customer A, customer B, and admin contexts, including reciprocal isolation and protected-column injection attempts. Test identities and records exist only inside its rolled-back transaction.

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

## Local migration and verification workflow

Prerequisites are the Supabase CLI and a running Docker-compatible engine.

```bash
supabase start
supabase db reset
supabase test db
supabase db lint --local --level warning
supabase gen types typescript --local > src/types/database.generated.ts
```

`supabase db reset` recreates the local database, applies ordered migrations, and then applies `supabase/seed.sql`. Never run a destructive reset against a linked production project. Review generated type changes before committing; do not hand-author a file that claims to be generated.

For remote deployment, link the intended environment explicitly, inspect migration state and the pending diff, then use the project's controlled migration step. Preview and production must not silently share a database.
