# Prabha Yogashala Implementation Status

Last updated: 2026-09-23

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
- Added the root document layout, optimized font setup, metadata foundation, theme color, and a provisional lettermark favicon.
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

## In progress

- None. Milestone 4 is complete at source level. Runtime database verification awaits an environment with Supabase CLI and Docker.

## Remaining

- Milestone 5: Authentication and route/session protection.
- Milestone 6: Customer portal.
- Milestone 7: Booking integration.
- Milestone 8: Admin portal.
- Milestone 9: Connect public classes and schedule to live published data.
- Milestone 10: Accessibility and responsive audit.
- Milestone 11: SEO and performance.
- Milestone 12: Production hardening and release verification.

## Client information required

- Original logo asset.
- Instructor/founder name, approved biography, approved portrait, and exact qualification wording.
- Confirmed phone, social links, public email, address, and service area.
- Approved class copy, benefits, formats, durations, capacities, and schedule.
- Pricing decision and approved prices.
- Booking cancellation/rescheduling policy.
- Workshop and gallery content.
- Approved photographs and usage rights.
- Replacement photography for `hero-practice.svg`, `gallery-movement.svg`, `gallery-breath.svg`, and `gallery-stillness.svg`, with final captions and alt text where images are meaningful.
- Final approved FAQ wording, Privacy Policy, and Terms & Conditions.
- Legal business identity, governing jurisdiction, privacy-request contact, and policy effective dates.
- Domain, Vercel, Supabase, and business-email ownership decisions.
- Decision on dark mode and any later multilingual work.

## Known issues and risks

- The supplied logo is referenced in the questionnaire but is not present in the workspace. The current favicon is a clearly provisional “P” lettermark, not a replacement brand logo.
- The Stitch HTML uses temporary Google-hosted images and a fake phone number; none may be shipped.
- The Stitch pages contain invented instructor identities, testimonials, exact schedules, capacities, statistics, claims, and policies. They remain visual references only.
- The dashboard screenshots contain revenue, memberships, progress, invoices, certificates, capacity, and fictional people. Those modules are outside V1 or must be replaced with real-data/empty-state patterns.
- The questionnaire requests several features excluded from the current V1. Scope must continue to follow `PROJECT_CONTEXT.md` unless the client explicitly reauthorizes them.
- No Git repository existed at audit time. A repository is initialized during this foundation milestone, but no commit is created automatically.
- Supabase and Vercel projects are not yet connected, and no local secrets should be added to Git.
- The light design system is approved; dark-mode tokens are not.
- The project is intentionally pinned to TypeScript 6 and ESLint 9 because the current Next.js lint plugins do not yet support TypeScript 7 or ESLint 10. Revisit together during a controlled dependency upgrade.
- The Homepage uses abstract local placeholders, not production photography. Their paths and replacement status are centralized in `src/config/media.ts`.
- The About founder image and Gallery media are abstract development placeholders. Production photography, captions, ordering, alt text, and usage rights remain client dependencies.
- Contact and Trial Enquiry forms currently validate in the browser and prepare an unsent WhatsApp message. Persistence, spam protection, server validation, consent recording, and administrative processing belong to later backend milestones.
- Privacy and Terms are structured drafts, not approved legal documents, and are marked `noindex` until reviewed.
- This machine has neither the Supabase CLI nor Docker installed, and no remote Supabase credentials were supplied. The clean reset, seed execution, database lint, generated types, and 48-assertion pgTAP RLS suite could not be executed in this run; no runtime RLS-pass claim has been made.
- Admin role provisioning is intentionally outside the Data API. Before production launch, establish an audited operational process or a narrowly scoped server-only provisioning workflow.
- Public trial-enquiry insertion is only a database capability. The frontend must not use it until a server-validated, rate-limited, bot-aware submission boundary is implemented.

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
- Supabase runtime checks were not executable because the Supabase CLI and Docker are unavailable in this environment.
- ESLint and strict TypeScript validation passed after Milestone 4.
- The Next.js production build passed with the framework-supported webpack fallback. The default Turbopack build could not run in this sandbox because its CSS worker was prohibited from binding a local port; no application compilation error was reported.

## Exact recommended next implementation task

Implement Milestone 5: add Supabase email authentication and server-managed session protection for registration, email verification, login, logout, password recovery/reset, and guarded customer/admin route groups. Preserve the protected database role model, default every registration to `customer`, verify server-side authorization, and do not begin customer/admin dashboard features, live bookings, payments, or public live-data migration.
