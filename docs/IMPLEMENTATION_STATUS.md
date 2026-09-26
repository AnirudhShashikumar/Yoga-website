# Prabha Yogashala Implementation Status

Last updated: 2026-09-27

## Completed

### Milestone 0 Workspace Audit

- Inspected every file in the workspace, including four Stitch export folders, duplicate root screenshots, three additional concept screenshots, one additional public concept image, and the eight-page client questionnaire.
- Confirmed there was no existing application, package manifest, dependency lockfile, Git repository, or Git history.
- Confirmed there are four unique Stitch page exports: Home, About, Classes, and Schedule.
- Confirmed the root copies `screen.png`, `screen 2.png`, `screen 3.png`, and `screen 4.png` exactly duplicate the four corresponding Stitch screenshots.
- Confirmed all four `DESIGN.md` files are byte-identical.
- Identified the standalone admin dashboard and customer dashboard screenshots. No source exports exist for those dashboard concepts.
- Identified `1.jpeg` and the classes screenshot as earlier “Sanguine” concepts, not Prabha Yogashala production assets.
- Classified all screenshots and generated HTML as references; no original material was deleted or changed.
- Documented unsupported generated content and content-integrity rules in `PROJECT_CONTEXT.md`.

### Milestone 1 Architecture and Foundation

- Established a Next.js App Router, React, TypeScript, Tailwind CSS, Supabase, PostgreSQL/Supabase Storage, and Vercel architecture.
- Added strict project configuration, lint/typecheck/build scripts, dependency versions, and ignore rules.
- Added the root document layout, optimized font setup, metadata foundation, theme color, and browser icon architecture. The provisional icon was later replaced by the approved official mark.
- Added semantic CSS tokens for color, typography, spacing, radius, shadow, focus, selection, and reduced motion.
- Added typed configuration for verified site facts, navigation, CTA language, and class taxonomy.
- Added environment validation and separate Supabase browser/server client factories.
- Added shared domain status types.
- Added accessible foundation primitives: Container, Section, Button, Badge, Card, SectionHeading, FormField, Input, Select, Textarea, AccordionItem, EmptyState, StatusBadge, and Skeleton.
- Added the persistent documentation set requested for future sessions.
- No route pages, feature workflows, database migrations, or authentication behavior were implemented.

### Milestone 2 Public Shell and Homepage

- Added the shared public route-group layout with a skip link, sticky `PublicHeader`, `PublicFooter`, and floating WhatsApp CTA.
- Added responsive desktop navigation and a native-dialog mobile menu with keyboard focus management, Escape dismissal, focus restoration, and background scroll locking.
- Implemented the complete Homepage: hero, verified trust indicators, introduction, practice preview, online/offline formats, audience levels, philosophy, broad schedule windows, workshop empty state, gallery preview, FAQ preview, and final trial CTA.
- Kept Homepage content within the verified facts in `PROJECT_CONTEXT.md`; no testimonials, prices, exact sessions, instructor identity, medical claims, or fictional records were added.
- Added a centralized, replaceable media registry in `src/config/media.ts` and four abstract local SVG placeholders under `public/images/placeholders/`. The placeholders are decorative and must be replaced with approved client photography before production launch.
- Extended the button primitive with typed link styling and added local functional SVG icons so navigation and CTAs do not depend on an icon font.
- Added a centralized WhatsApp URL builder using the client-supplied number. The number remains subject to pre-launch reconfirmation.
- No remaining public pages, Supabase workflows, authentication, customer portal, or admin portal behavior was implemented.

### Milestone 3 Complete Public Website

- Implemented all remaining public routes: `/about`, `/classes`, `/classes/[slug]`, `/schedule`, `/pricing`, `/workshops`, `/gallery`, `/faq`, `/contact`, `/book`, `/privacy`, and `/terms`.
- Expanded `src/config/classes.ts` into the single typed source for all 12 verified practices, including slugs, grounded categories, conservative summaries, overviews, suitability guidance, expectations, and practice qualities. The Homepage, class discovery, class filters, detail pages, related-practice links, and trial form now consume this source.
- Added statically generated, metadata-aware class detail pages for all configured practices. Unknown class slugs use the Next.js not-found behavior.
- Added shared public-page components for editorial heroes, conversion CTAs, class cards/discovery, and legal draft presentation without forcing identical page compositions.
- Added a keyboard-operable category filter for class discovery and retained native semantic FAQ accordions.
- Added polished Schedule, Pricing, and Workshops states that communicate only confirmed windows and service availability without inventing sessions, prices, events, capacities, or policies.
- Added the full Gallery route using six abstract, centrally registered development placeholders. None are presented as client facilities, students, or events.
- Added Contact and Trial Enquiry forms with Zod-backed browser validation, inline accessible errors, first-invalid-field focus, mobile-friendly controls, and an explicit WhatsApp handoff. These forms do not persist or claim to submit data.
- Added professional Privacy and Terms draft layouts, marked as not legally approved and excluded from search indexing until approved content is supplied.
- Added page-level metadata for every public route and data-derived metadata for class details.
- Removed premature Account links from the public shell so the completed public website has no links to unimplemented authentication routes.
- No Supabase schema, authentication, customer portal, admin portal, payment, or membership functionality was implemented.

### Milestone 4 Supabase Data Foundation and Security

- Added ordered, clean-project Supabase migrations for profiles, protected roles, classes, class sessions, bookings, trial enquiries, workshops, and gallery metadata.
- Added constrained enums, foreign keys, query-driven indexes, timezone-aware timestamps, reliable `updated_at` triggers, archive/publication state, and database-enforced lifecycle transitions.
- Separated Auth identity from editable application profiles. New Auth users receive a hard-coded `customer` role; request metadata is not trusted for authorization.
- Protected `user_roles` from all Data API mutation, added a fixed-search-path admin authorization helper, and prevented customer payloads from injecting ownership, administrative status, IDs, or audit timestamps.
- Enabled RLS on every exposed application table with explicit least-privilege grants and policies for anonymous, customer, and admin contexts.
- Added four public-read, admin-write Storage buckets with MIME/size limits and entity-oriented path constraints. No fake media was uploaded.
- Added a production-safe seed containing only the 12 verified practices. No people, schedules, bookings, prices, workshops, or gallery events are seeded.
- Added a rollback-only 48-assertion pgTAP suite for anonymous, customer A, customer B, and admin boundaries, including reciprocal isolation and protected-column behavior.
- Documented the schema, trust boundary, static taxonomy mapping, Storage architecture, abuse controls, local workflow, and generated database-type workflow in `DATABASE.md`.
- No authentication UI, protected routes, dashboards, live frontend data, booking persistence, payments, or memberships were implemented.

### Milestone 5 Authentication, Sessions, and Route Authorization

- Added `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`, and the `/auth/confirm` server callback using the installed Supabase SSR/JavaScript APIs.
- Added Zod-validated Server Actions for registration, login, logout, recovery requests, and password updates with safe typed errors and no password persistence or logging.
- Preserved customer-only registration: no role input is accepted or sent; safe name/phone metadata is validated before being copied to `profiles`, while `user_roles` remains authoritative.
- Added Next.js 16 `proxy.ts` session refresh using verified claims, private/no-store handling for authenticated responses, and early protection for customer/admin portal paths.
- Added independent server-side protected layouts for `/dashboard/*` and `/admin/*`, with customers and admins routed only to their intended portal.
- Added strict role-compatible redirect validation and focused tests covering external, protocol-relative, malformed, encoded-backslash, unrelated, and cross-role destinations.
- Added a short-lived HTTP-only recovery marker in addition to the verified recovery session before accepting a password update.
- Added accessible, responsive auth forms with password-manager autocomplete, show/hide controls, pending states, field-linked errors, error focus, live announcements, and noindex metadata.
- Added the public-header Sign In/My Account/Admin integration without changing the primary trial-class CTA or using client state as an authorization boundary.
- Added only minimal protected customer/admin landing states; no dashboard features or CRUD were implemented.
- Added `.env.example`, versioned local confirmation/recovery templates, hosted configuration instructions, and the repeatable live-auth checklist in `AUTH.md`.

### Milestone 5.5 Hosted Supabase Integration and Runtime Verification

- Added the Supabase CLI as a project-local development dependency and linked the exact hosted staging project referenced by the uncommitted `.env.local`.
- Verified `.env.local` is ignored and untracked; required public Supabase variables are present without printing their values. No service-role secret was introduced.
- Dry-ran and applied the three ordered migrations plus the production-safe seed. Hosted migration history matches the repository, and the hosted public API returns exactly 12 class rows with 12 unique slugs.
- Ran hosted database lint with no schema errors.
- Corrected five pgTAP statements to PostgreSQL's required top-level data-modifying-CTE shape without changing the 48-test plan or expectations. The exact rollback-only suite then passed 48/48 against hosted staging; a deliberate failure probe confirmed failures are surfaced.
- Generated database types from the hosted `public` schema and integrated them into the browser, server, and Proxy Supabase clients.
- Replaced the hosted project's old Site URL and broad redirects with the exact deployed/local callback allowlist. Email confirmation, secure email change, refresh rotation, and an 8-character letter-plus-number password minimum are enabled.
- Verified safe unauthenticated hosted behavior, anonymous data boundaries, deployed auth rendering, protected-route redirects, and invalid confirmation handling.
- Diagnosed the first production registration failure end to end. Vercel was supplying an invalid `NEXT_PUBLIC_SITE_URL`, so `getSiteUrl()` threw before `signUp()` and no Supabase request was made. The canonical HTTPS origin is now active in Production and Preview.
- Completed one hosted disposable customer registration through email confirmation. The resulting records were exactly one Auth user, one profile, and one `customer` role; the attempted `role=admin` form field was ignored and no role metadata was stored.
- Passed focused auth tests, ESLint, strict TypeScript validation, and the Next.js production build.

### Milestone 6 Customer Portal

- Added the complete customer application shell and guarded routes: `/dashboard`, `/dashboard/bookings`, `/dashboard/classes`, `/dashboard/schedule`, and `/dashboard/profile`.
- Added responsive desktop/mobile navigation with active-section semantics, Public Website, Sign Out, skip navigation, and strict customer-only layout authorization that preserves the existing admin boundary.
- Added a server-only customer data layer with explicit DTOs for the authenticated profile/Auth email, published classes, real future published sessions, and the authenticated customer's joined bookings.
- Added Zod-validated, reauthorized Server Actions for booking, conservative cancellation, and profile updates. Customer identity always comes from the verified session; no action accepts an arbitrary customer ID.
- Added the real-data Overview with personalized greeting, next confirmed session, upcoming booking preview, five requested quick actions, and a polished new-customer empty state.
- Added My Bookings sections for upcoming, past/completed, and cancelled records; canonical status indicators; class/date/time/format details; native detail disclosure; two-step cancellation confirmation; and action feedback.
- Added live Explore Classes and Schedule views. The 12 seeded published classes are database-backed. Because the hosted database currently has zero sessions and bookings, session/booking surfaces truthfully render empty states and no booking success is fabricated.
- Added booking pending/success/error behavior, duplicate-submission prevention, already-booked display, route revalidation after success, and no capacity/remaining-spots claims.
- Added a real profile editor for only supported customer-editable fields, Auth email display, validation, save/discard/loading/success/error states, dirty-state leave protection, and the established password-recovery entry point. No role controls or casual email-change flow were added.
- Added a hosted migration that serializes booking inserts per session, validates published/future eligibility, enforces optional capacity atomically, and permits only an owning customer to cancel an active future booking.
- Expanded the rollback-only RLS suite from 48 to 61 assertions for customer booking creation, identity protection, published and owner-history class/session reads, duplicate/capacity errors, own cancellation, reciprocal denial, and existing role/storage boundaries.
- Added focused customer access/input tests. The final checks passed: `pnpm test:auth` 4/4, `pnpm test:customer` 6/6, ESLint, strict TypeScript, whitespace validation, the 61/61 hosted pgTAP suite, hosted schema lint, and the Next.js webpack production build.

### Milestone 7 Admin Portal and Managed Public Data

- Added the complete guarded admin shell and all approved overview, booking, customer, class, schedule, enquiry, workshop, gallery, and settings routes, including focused create/detail/edit routes.
- Added a server-only admin data layer, explicit DTOs, Zod schemas, privacy-safe Server Action state, route revalidation, and independent admin authorization on every read and mutation.
- Added real overview counts, status-grouped booking management, limited customer-directory/profile management, class/session lifecycle management, enquiry CRM transitions, workshop publication, and validated gallery image upload/metadata management.
- Preserved history through unpublish/cancel/complete/close/archive operations. No Data API delete, role-management UI, public admin registration, service-role credential, payment, or unsupported setting was introduced.
- Added migration `20260925000200_admin_portal_safety.sql` for limited admin Auth-directory access, immutable class slugs, future-session class safeguards, booked-session fact preservation, capacity floors, and active-booking archive protection; it is applied to the linked hosted database.
- Expanded the checked-in rollback-only RLS suite from 61 to 69 assertions. The prior 61 passed together, and the eight new hosted assertions passed in a rolled-back SQL Editor run; Docker absence prevents the CLI wrapper from rerunning all 69 in one command on this host.
- Connected public classes, class details, schedule, workshops, gallery, and homepage previews to published Supabase data while retaining verified static editorial supplements for known class slugs.
- Replaced the trial enquiry handoff-only form with a server-validated, consent-recording database submission and optional WhatsApp follow-up. Public error messages remain generic; rate limiting/managed bot protection remains a production-hardening item.
- Added focused admin tests and aligned `Database` types with the linked hosted schema. ESLint, strict TypeScript, auth/customer/admin tests, hosted database lint, and the webpack production build pass.

### Official brand integration

- Preserved the approved source logo unchanged under `assets-source/branding/` and added a reproducible asset-generation script.
- Created a cropped transparent full lockup and a square symbol-only mark without redrawing, recoloring, or changing the artwork proportions.
- Integrated the official identity into the public desktop/mobile header, public footer, shared authentication shell, customer portal shell, and admin portal shell.
- Replaced the provisional lettermark favicon with App Router-native favicon, standard icon, and Apple touch icon assets based on the official symbol.
- Retained the existing title/description system and removed the obsolete manual favicon declaration. No manifest or Open Graph image architecture was introduced.

## In progress

- No Milestone 7 source implementation item remains in progress.
- No Milestone 7 deployment item remains in progress.

## Remaining

- Configure production SMTP, activate the checked-in confirmation/recovery templates, and complete the password-recovery production retest.
- Complete the hosted admin → customer booking → admin management → customer update integration loop with explicitly approved disposable credentials and a legitimate future session.
- Add production-grade anonymous enquiry rate limiting or a managed bot challenge before public launch.
- Complete the whole-site accessibility/responsive audit, SEO/performance work, and production hardening/release verification.

## Client information required

- Instructor/founder name, approved biography, approved portrait, and exact qualification wording.
- Confirmed phone, social links, public email, address, and service area.
- Approved class copy, benefits, formats, durations, capacities, and schedule.
- Pricing decision and approved prices.
- Booking cancellation/rescheduling policy.
- Confirmation that `Asia/Kolkata` is the business scheduling timezone.
- Workshop and gallery content.
- Approved photographs and usage rights.
- Replacement photography for `hero-practice.svg`, `gallery-movement.svg`, `gallery-breath.svg`, and `gallery-stillness.svg`, with final captions and alt text where images are meaningful.
- Final approved FAQ wording, Privacy Policy, and Terms & Conditions.
- Legal business identity, governing jurisdiction, privacy-request contact, and policy effective dates.
- Domain, Vercel, Supabase, and business-email ownership decisions.
- A production SMTP provider, verified sender/domain, hosted Auth template activation, and permission to send the recovery retest to an approved mailbox.
- Decision on dark mode and any later multilingual work.

## Known issues and risks

- The approved official logo is integrated. Any future recolor, alternate lockup, or social-image treatment requires explicit brand approval rather than reinterpretation.
- The Stitch HTML uses temporary Google-hosted images and a fake phone number; none may be shipped.
- The Stitch pages contain invented instructor identities, testimonials, exact schedules, capacities, statistics, claims, and policies. They remain visual references only.
- The dashboard screenshots contain revenue, memberships, progress, invoices, certificates, capacity, and fictional people. Those modules are outside V1 or must be replaced with real-data/empty-state patterns.
- The questionnaire requests several features excluded from the current V1. Scope must continue to follow `PROJECT_CONTEXT.md` unless the client explicitly reauthorizes them.
- The hosted Supabase staging project and deployed Vercel origin are connected, but `.env.local` must remain outside Git and no service-role secret should be added to browser-visible configuration.
- The light design system is approved; dark-mode tokens are not.
- The project is intentionally pinned to TypeScript 6 and ESLint 9 because the current Next.js lint plugins do not yet support TypeScript 7 or ESLint 10. Revisit together during a controlled dependency upgrade.
- The Homepage uses abstract local placeholders, not production photography. Their paths and replacement status are centralized in `src/config/media.ts`.
- The About founder image and Gallery media are abstract development placeholders. Production photography, captions, ordering, alt text, and usage rights remain client dependencies.
- Trial Enquiry now validates and persists consent server-side, but production-grade rate limiting or a managed bot challenge is still required before launch.
- Privacy and Terms are structured drafts, not approved legal documents, and are marked `noindex` until reviewed.
- Docker is not installed. The established hosted suite passed 61/61 and the eight new Milestone 7 assertions passed 8/8 in a rolled-back hosted SQL Editor transaction; the one-command 69-test CLI wrapper could not run on this host.
- Admin role provisioning is intentionally outside the Data API. Before production launch, establish an audited operational process or a narrowly scoped server-only provisioning workflow.
- Public trial-enquiry insertion now uses a server-validated, honeypot-protected action with consent capture; rate limiting/managed bot protection remains required for production hardening.
- The exact hosted SSR callback allowlist is active. The checked-in token-hash templates are not yet active because the Free-tier project uses Supabase's default email provider, which rejected template modification. Configure custom SMTP and a verified sender before treating email Auth as production-ready.
- A non-PII disposable mailbox verified valid hosted customer registration, delivery, confirmation, profile creation, and hard-coded customer-role creation.
- The project lead live-tested confirmed-customer login, customer dashboard access, customer/admin separation, session persistence, logout, protected-route enforcement, and a directly provisioned controlled admin role on 2026-09-25. Password recovery remains the only unverified Auth email path.
- The hosted database currently has 12 published classes but zero class sessions and zero bookings. The customer portal is functional and intentionally shows empty schedule/booking states; end-to-end booking success/cancellation cannot be live-browser verified until a legitimate future published session exists.
- The client has not confirmed cancellation/rescheduling policy. The portal implements only the conservative database-safe cancellation transition for an owner's active future booking and makes no refund, timing-window, or rescheduling promise.
- The database has no approved settings relation, so `/admin/settings` is intentionally read-only rather than storing invented configuration.
- Business timezone has not been client-confirmed. Admin scheduling provisionally uses `Asia/Kolkata` and stores UTC instants.

## Checks

- Workspace inventory and duplicate hashing completed.
- All eight questionnaire pages rendered and visually inspected.
- Dependency lockfile created and supply-chain policy check passed.
- Peer-dependency check passed.
- ESLint passed with no errors or warnings.
- Strict TypeScript check passed.
- Next.js production build passed with the static Homepage route and framework-generated not-found route.
- Browser runtime and console check passed with no application errors or warnings.
- Responsive browser checks passed at 390px, 768px, 1024px, 1280px, and 1440px with no horizontal overflow.
- Desktop/mobile navigation switching passed. The mobile menu opens with focus on the first link, closes with Escape, restores focus to the trigger, and releases page scroll locking.
- Homepage content-integrity review passed against `PROJECT_CONTEXT.md`.
- ESLint, strict TypeScript validation, and the Next.js production build passed after Milestone 3 implementation.
- The production build includes the static Homepage and ten additional static public page endpoints, twelve statically generated class-detail paths, and request-rendered `/book` because it reads the optional practice query parameter.
- Browser route checks passed for every public page with one `h1`, valid page metadata, loaded local images, and no horizontal overflow.
- Responsive checks passed across 65 route/viewport combinations at 390px, 768px, 1024px, 1280px, and 1440px.
- All 12 configured class-detail routes rendered successfully; an unknown slug returned the Next.js not-found state.
- Internal-link crawl passed with no dead public links, including every class-to-trial query link.
- Class filtering, native FAQ keyboard expansion, mobile navigation focus/Escape behavior, Contact validation, and Trial Enquiry validation/completion were exercised in the browser.
- Browser console/runtime review found no application errors or warnings, and the content-integrity scan found no unsupported public claims.
- Milestone 4 migration, seed, RLS, Storage, and pgTAP assets received static source review, including test-plan count and taxonomy parity checks.
- The initial three foundation migrations and seed applied successfully; the public classes seed contains exactly 12 unique slugs. The fourth and fifth customer-portal migrations were applied and verified on 2026-09-25.
- Hosted database lint reported no schema errors, and the rollback-only RLS suite passed all 48 pgTAP assertions. A deliberate failing probe verified that test failures are detected.
- Hosted schema type generation passed and the generated `Database` type is integrated into all three Supabase client factories.
- ESLint and strict TypeScript validation passed after Milestone 4.
- The Next.js production build passed with the framework-supported webpack fallback. The default Turbopack build could not run in this sandbox because its CSS worker was prohibited from binding a local port; no application compilation error was reported.
- Milestone 5 focused auth tests passed: 4 tests covering safe redirects, role-compatible routing, registration role stripping, normalization, and password validation.
- ESLint and strict TypeScript validation passed after Milestone 5 implementation.
- The Milestone 5 production build passed with the framework-supported webpack fallback; `/dashboard` and `/admin` are confirmed as request-rendered routes behind Proxy.
- Login, registration, forgot-password, missing-reset-session, and confirmation-result routes rendered with one `h1`, correct metadata, and no horizontal overflow across 25 route/viewport combinations at 390px, 768px, 1024px, 1280px, and 1440px.
- Browser checks confirmed first-invalid-field focus, accessible error announcements, keyboard operation of password visibility, valid auth-page internal links, safe missing-configuration redirects, invalid confirmation handling, and no browser console errors or warnings.
- Hosted Auth configuration verification passed for the exact Site URL, three exact callback redirects, required email confirmation, secure email change, refresh rotation, and the letter-plus-number 8-character password minimum.
- Safe hosted API checks passed for invalid login, privacy-neutral nonexistent-account recovery, invalid refresh/logout, anonymous access to 12 published classes, and denial of anonymous profile, role-read, and role-injection attempts.
- Focused deployed browser checks passed for the login form, anonymous dashboard/admin guards, preserved safe `next` paths, and the invalid-confirmation state.
- Current verification commands passed: `pnpm test:auth` (4/4), `pnpm lint`, `pnpm typecheck`, and `pnpm exec next build --webpack`.
- Focused production registration verification passed on 2026-09-24: the canonical Vercel deployment reached Supabase `/signup`, delivered the confirmation email, confirmed the user, created exactly one profile and one `customer` role, and ignored an attempted admin-role field. The final clean Vercel production build completed successfully.
- **LIVE BROWSER VERIFIED (project lead):** confirmed customer login, `/dashboard` access, customer denial/rerouting from `/admin`, session persistence, sign out, protected-route enforcement after logout, and controlled admin access to `/admin` all passed on the deployed application.
- **AUTOMATED TEST VERIFIED:** `pnpm test:auth` passed 4/4 and `pnpm test:customer` passed 6/6 on 2026-09-25.
- **DATABASE VERIFIED:** migrations `20260924000100` and `20260925000100` are present in hosted history; hosted schema lint reports no errors; the failure-signaling rollback-only RLS suite passed 61/61; hosted counts are 12 published classes, 0 sessions, and 0 bookings.
- **AUTOMATED BUILD VERIFIED:** ESLint, strict TypeScript, `git diff --check`, and `pnpm exec next build --webpack` passed on 2026-09-25; all five customer routes are request-rendered behind Proxy.
- **LIVE BROWSER VERIFIED (Codex):** anonymous requests to all five local customer routes redirected to `/login` with the exact encoded destination, and the resulting route boundary had no horizontal overflow at 390, 768, 1024, 1280, and 1440 pixels.
- **NOT YET VERIFIED:** live booking creation/cancellation with a real future session, customer authenticated portal visuals at every breakpoint, and password-recovery email/reset behavior. The first two require legitimate staging data/access; recovery requires production SMTP.
- **MILESTONE 7 AUTOMATED VERIFIED:** `pnpm test:auth` passed 4/4, `pnpm test:customer` passed 6/6, `pnpm test:admin` passed 6/6, ESLint and strict TypeScript passed, and `pnpm exec next build --webpack` passed.
- **MILESTONE 7 DATABASE VERIFIED:** migration `20260925000200` is applied, hosted schema lint is clean, linked type generation matches the checked-in type, and the eight new rollback-only safety assertions passed 8/8. The prior 61/61 remains the latest full-suite run.
- **MILESTONE 7 INTEGRATION LIMIT:** no legitimate future session/customer credential set was available for a safe live end-to-end booking mutation, so the admin/customer lifecycle is not claimed as hosted browser-verified.
- **MILESTONE 7 DEPLOYMENT VERIFIED:** Vercel marked code-bearing commit `525c421` as a Production deployment with status Ready and assigned `https://yoga-website-three-kappa.vercel.app`; the subsequent documentation-only deployment was also Ready. Hosted smoke checks passed there for Classes, Schedule, Workshops, Gallery, Book a Trial Class, and the anonymous `/admin` → `/login?next=%2Fadmin` guard, with no application-error state.

## Exact recommended next implementation task

Provide an explicitly approved disposable confirmed-customer login and legitimate future test-session details, then run the hosted admin-create/publish → customer-book → admin-manage → customer-observe/cancel integration test without weakening confirmation, RLS, or history safeguards.
