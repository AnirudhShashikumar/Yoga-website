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
    (customer)/           customer routes and guarded layout, Milestone 6
    (admin)/              admin routes and guarded layout, Milestone 8
    layout.tsx            document, fonts, global metadata foundation
    globals.css           semantic design tokens and global accessibility rules
  components/
    ui/                   low-level reusable visual primitives
    layout/               public, customer, and admin shells when implemented
  config/                 verified site data, navigation, CTA language, taxonomy
  features/               domain slices added only when their milestone begins
    auth/
    bookings/
    classes/
    enquiries/
    gallery/
    schedule/
    workshops/
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

Milestone 5 will implement Supabase email authentication: registration, verification, login, logout, password recovery/reset, and server-managed sessions.

- Public registration creates customer access only.
- Store editable profile information separately from protected role assignment.
- Use a protected `user_roles` relation (or an equivalently isolated server-managed claim) for `customer` and `admin` authorization.
- Route guards improve UX but are not the security boundary.
- Server actions must check the authenticated user and required role.
- RLS policies remain the final data-access boundary.
- Any admin helper function must use a fixed `search_path` and be inaccessible to ordinary clients unless explicitly safe.

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
- Explicitly test Supabase RLS with customer A, customer B, anonymous, and admin contexts. The rollback-only pgTAP suite covers visibility, reciprocal ownership isolation, protected-column injection, managed-content permissions, lifecycle transitions, and Storage policy presence.
- Add end-to-end tests for public navigation, auth, route protection, trial enquiries, bookings, class/schedule administration, and responsive navigation when those features exist.

## Deployment

- Vercel hosts the Next.js application.
- Supabase hosts Auth, PostgreSQL, and Storage.
- Preview and production environments use separate Supabase projects or an approved branching strategy.
- Secrets live in platform environment settings, never in Git.
- Database migrations run through a controlled deployment step before application code that depends on them.
- Production readiness requires lint, typecheck, tests, build, route checks, accessibility review, authorization/RLS verification, and content-integrity review.
