# Prabha Yogashala Technical Architecture

## Decision summary

Build one Next.js application using the App Router, React Server Components by default, strict TypeScript, Tailwind CSS, Supabase Auth/PostgreSQL/Storage, and Vercel. Keep public, customer, and admin surfaces in route groups within the same deployment so they share domain types, authorization rules, design tokens, and content configuration without duplicating business logic.

## Current foundation

- Next.js 16.3.5 with App Router and typed routes.
- React 19.3.0.
- TypeScript 6.0.3 with strict mode, unchecked indexed access, and exact optional properties. TypeScript 7 is not used yet because the current Next.js ESLint parser does not support it.
- Tailwind CSS 4.3.3 with CSS-first semantic tokens.
- Supabase JavaScript 2.117.0 and Supabase SSR 0.12.7.
- Zod 4.6.5 for boundary validation.
- ESLint 9.39.5 with Next.js core-web-vitals and TypeScript rules. ESLint 10 is not used yet because the React and accessibility plugins bundled by Next.js do not support it.
- pnpm as the package manager.

Package versions were verified from npm on 2026-09-22. Preserve the lockfile and update dependencies deliberately rather than automatically.

## Repository structure

```text
src/
  app/
    (public)/             public routes, added from Milestone 2
    (auth)/               authentication routes, added in Milestone 5
    (customer)/           complete guarded customer portal
    (admin)/              guarded admin foundation; full portal remains deferred
    layout.tsx            document, fonts, global metadata foundation
    globals.css           semantic design tokens and global accessibility rules
  components/
    ui/                   low-level reusable visual primitives
    customer/             customer shell, navigation, cards, forms, and states
    layout/               shared public layout components
  config/                 verified site data, navigation, CTA language, taxonomy
  features/               domain slices added only when their milestone begins
    auth/
    customer/             customer DTOs, reads, validation, actions, and tests
    classes/
    enquiries/
    gallery/
    schedule/
    workshops/
  proxy.ts                Supabase session refresh and early portal authorization
  lib/
    supabase/             browser/server clients and later auth helpers
    validation/           shared Zod schemas
    utils/                framework-agnostic helpers
  types/                  shared domain types; generated DB types will live here
supabase/
  migrations/             ordered schema, security, and Storage migrations
  seed.sql                production-safe verified practice content only
  tests/database/         rollback-only pgTAP security verification
public/                   approved, optimized local assets
docs/                     persistent project decisions and status
```

Route groups organize code without changing public URLs. Do not create a second application for the admin or customer portal.

## Rendering and mutation model

- Use Server Components for pages, reads, metadata, and compositions by default.
- Add Client Components only for interaction that requires browser state or event handlers.
- Perform privileged reads and mutations in Server Actions or route handlers after authentication, authorization, and Zod validation.
- Never import server-only code into Client Components.
- Cache public published content deliberately; authenticated or user-specific data must not be shared through public caches.
- Use `next/image` with explicit dimensions or stable aspect ratios after image rights and assets are approved.

## Configuration and content

- Stable verified business facts live in `src/config/site.ts`.
- Navigation lives in `src/config/navigation.ts`.
- The approved practice names live in `src/config/classes.ts` until the database becomes authoritative.
- Page copy should not be buried in components. Static verified copy may live in typed content modules; managed records come from Supabase.
- Environment values are validated at the boundary. Only publishable Supabase values may use the `NEXT_PUBLIC_` prefix.
- Never expose a Supabase service-role key to browser code. Do not add secrets to committed files.

## Authentication and authorization

Milestone 5 implements Supabase email authentication: registration, verification, login, logout, password recovery/reset, and server-managed cookie sessions. The operational flow and hosted-project configuration are maintained in `AUTH.md`.

- Public registration creates customer access only.
- Store editable profile information separately from protected role assignment.
- Use a protected `user_roles` relation (or an equivalently isolated server-managed claim) for `customer` and `admin` authorization.
- Route guards improve UX but are not the security boundary.
- Server actions must check the authenticated user and required role.
- RLS policies remain the final data-access boundary.
- Any admin helper function must use a fixed `search_path` and be inaccessible to ordinary clients unless explicitly safe.
- Next.js 16 `proxy.ts` calls verified `getClaims()` early so `@supabase/ssr` can refresh cookie sessions. It performs early portal redirects, while each protected layout independently rechecks session and role before rendering.
- Admin routing always resolves the protected `user_roles` record. Auth metadata and editable profile data never authorize access.
- Post-auth redirects are limited to the authenticated role's own portal subtree; untrusted external or malformed destinations are discarded.

## Customer portal architecture

Milestone 6 implements one customer-only application shell over `/dashboard`, `/dashboard/bookings`, `/dashboard/classes`, `/dashboard/schedule`, and `/dashboard/profile`.

- The protected route-group layout resolves the authenticated account and the protected `user_roles` record before rendering. Anonymous users go to login with the exact safe destination; administrators remain on the admin surface rather than implicitly receiving customer access.
- Server Components perform customer reads through `src/features/customer/data.ts`. That module is server-only, reauthorizes every query, returns explicit presentation DTOs, and never exposes raw Supabase responses to Client Components.
- Server Actions in `src/features/customer/actions.ts` reauthorize, validate UUID/profile input with Zod, derive customer identity from the authenticated session, execute the mutation, return privacy-safe action state, and revalidate every affected customer route.
- Client Components are limited to pending/action feedback, cancellation confirmation, active responsive navigation, device-timezone formatting, and profile dirty-state protection.
- Published classes are read from Supabase. Upcoming schedule entries are published future `class_sessions` joined to published classes. Bookings are the authenticated customer's own joined records. The portal never synthesizes sessions, availability counts, or customer activity.
- Booking success is shown only after the database insert returns successfully. The UI disables duplicate submission, recognizes already-booked sessions, and immediately revalidates Dashboard, My Bookings, Explore Classes, and Schedule.
- Customer cancellation is a conservative technical rule, not an invented business window: only the owner's active `pending` or `confirmed` booking for a published future session may transition to `cancelled`. The UI requires an explicit inline confirmation.
- Session timestamps are stored as instants and rendered in the visitor's device timezone using semantic `time` elements. No unconfirmed business timezone is assumed.

## Admin portal architecture

Milestone 7 implements one admin-only application shell over `/admin` and the management routes documented in `PROJECT_CONTEXT.md`.

- The protected layout independently verifies the Auth identity and protected `user_roles` record before rendering. Customers never receive admin data or navigation.
- Server Components read through `src/features/admin/data.ts`; the module reauthorizes every request, selects only required columns, and maps database rows to explicit presentation DTOs.
- Server Actions in `src/features/admin/actions.ts` reauthorize every mutation, validate form data with Zod, return privacy-safe state, and revalidate all affected admin, public, and customer routes.
- Classes, sessions, bookings, customer profiles, enquiries, workshops, and gallery metadata use the existing RLS-protected tables. Role management is deliberately absent.
- Customer directory email and confirmation metadata comes through the fixed-search-path, admin-checking `admin_customer_directory()` database function. It exposes no password, token, or role-mutation capability.
- Destructive deletion is not exposed. Unpublish, cancel, complete, close, and archive transitions preserve history. Database triggers protect booked session facts, active booking capacity, immutable slugs, and future published-session dependencies.
- Admin scheduling is entered and rendered in `Asia/Kolkata`; PostgreSQL stores UTC instants. Customer/public readers render those same instants without inventing recurrence or capacity.
- Gallery uploads accept only approved image MIME types up to 8 MiB, generate UUID-scoped object paths, store relative paths, and remove a newly uploaded object if the metadata insert fails.
- `/admin/settings` is a truthful read-only operational summary because the approved database has no settings relation.

## Public managed-data integration

Public classes, class details, schedule, workshops, gallery, and homepage previews now read published, non-archived Supabase records. The verified static practice catalogue remains a supplemental editorial source for known slugs only. The trial form uses a server action with Zod validation, a honeypot, affirmative-consent persistence, and generic errors. Rate limiting or a managed bot challenge remains a production-hardening dependency.

## Relational model

Milestone 4 implements the database model below. Detailed relationships, access rules, migration commands, and Storage boundaries are maintained in `DATABASE.md`.

- `profiles`: one-to-one with `auth.users`; permitted customer-editable profile fields.
- `user_roles`: protected role assignment.
- `classes`: centrally managed practice content; slug, category, level, format, image path, featured, published, archived state.
- `class_sessions`: class occurrence with date/time, format, optional capacity, and explicit status.
- `bookings`: customer-to-session relation with explicit status and audit timestamps.
- `trial_enquiries`: anonymous or authenticated enquiry, preferences, message, and CRM status.
- `workshops`: managed publication record.
- `gallery_items`: managed media metadata and publication order.

The model uses UUID primary keys, deliberate foreign-key deletion behavior, PostgreSQL enums and check constraints, timezone-aware timestamps, update triggers, uniqueness rules, and query-driven indexes. Publication/status and archival preserve history; application tables expose no Data API delete privilege.

`auth.users` remains the authentication identity source. An Auth trigger creates only a blank profile and the hard-coded `customer` role. Protected `user_roles` records—not user metadata, profile data, forms, query parameters, or browser state—authorize administrators. Ordinary clients, including Data API admin sessions, cannot mutate role assignments.

Customer booking inserts are additionally serialized on the target session row by a fixed-search-path `SECURITY DEFINER` trigger. It verifies that the session and class are published and non-archived, requires a future start time, and enforces optional capacity against active `pending`/`confirmed` bookings atomically. This database boundary complements, rather than replaces, application validation and the unique active-booking index.

## State transitions

- Booking: `pending → confirmed → completed`; `pending|confirmed → cancelled`.
- Trial enquiry: `new → contacted → converted|closed`; allow reopening only if explicitly required.
- Session: `draft → published → completed`; `draft|published → cancelled`.

Transitions must be enforced in server/database logic, not inferred from button visibility.

## Storage

Use the public-read, admin-write `class-media`, `workshop-media`, `gallery-media`, and `founder-media` buckets only for approved media. Store object paths in PostgreSQL, not public URLs. Bucket limits and MIME allowlists provide baseline enforcement; future server workflows must also validate content, extension, MIME type, size, filename, and media rights. Object bytes are managed through the Storage API, never by directly editing `storage.objects`.

## Error, loading, and empty states

Every data-driven surface must define loading, empty, success, error, unauthorized, and not-found behavior. Empty-state copy must state the truth (“No bookings yet,” “No workshops published”) and must never substitute fabricated records.

## Accessibility and responsive requirements

- WCAG-minded semantic structure, keyboard access, visible focus, labels, useful error announcements, and ARIA only where native semantics are insufficient.
- Body copy starts at 16px; regular interactive labels should normally be at least 14px.
- Touch targets are at least 44×44px; primary controls use 48–52px height.
- Honor `prefers-reduced-motion`.
- Verify 390px, 768px, 1024px, 1280px, and 1440px widths with no horizontal overflow.
- Convert dense tables to mobile-friendly card/summary patterns or controlled scrolling with preserved headers and labels.

## SEO and metadata

The root layout owns title templates, description, theme color, and favicon. Later milestones add canonical origin configuration, route metadata, sitemap, robots, and truthful structured data. Do not add local-business address schema until the address is confirmed. A social preview image is not part of the current scope.

## Testing strategy

- Run lint, strict typecheck, and production build after each major milestone.
- Add focused unit tests for validation, state transitions, and pure domain logic.
- Add integration tests for Server Actions and repository behavior.
- Explicitly test Supabase RLS with customer A, customer B, anonymous, and admin contexts. The 69-assertion rollback-only pgTAP suite covers visibility, reciprocal ownership isolation, protected-column injection, owner-only booking-history detail reads, customer cancellation, duplicate/capacity booking safety, managed-content permissions, admin-directory access, admin lifecycle safeguards, and Storage policy presence. `finish(true)` makes a failed plan fail the hosted SQL command.
- Add end-to-end tests for public navigation, auth, route protection, trial enquiries, bookings, class/schedule administration, and responsive navigation when those features exist.

## Deployment

- Vercel hosts the Next.js application.
- Supabase hosts Auth, PostgreSQL, and Storage.
- Preview and production environments use separate Supabase projects or an approved branching strategy.
- Secrets live in platform environment settings, never in Git.
- Database migrations run through a controlled deployment step before application code that depends on them.
- Production readiness requires lint, typecheck, tests, build, route checks, accessibility review, authorization/RLS verification, and content-integrity review.
