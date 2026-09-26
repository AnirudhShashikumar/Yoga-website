# Prabha Yogashala Project Context

## Purpose

This document is the stable source of project requirements and scope boundaries for future implementation sessions. Read it before inspecting raw Stitch exports or the client questionnaire. The raw source material remains available for verification, but should not be re-audited unless requirements change or a documented fact needs to be traced.

## Source priority

When sources disagree, use this order:

1. The latest explicit client or project-lead instruction.
2. The production brief supplied with this workspace.
3. The client discovery questionnaire.
4. Stitch screenshots as visual references only.
5. Stitch HTML and generated copy as implementation references only.

The production brief narrows V1 compared with the discovery questionnaire. For example, the questionnaire mentions payments, memberships, blog, multilingual support, and dark mode; these are not part of the current V1 unless explicitly restored by a later requirement.

## Product

Prabha Yogashala is a production yoga and wellness platform. V1 includes:

- A public marketing website.
- Supabase authentication and customer accounts.
- A customer portal.
- Trial enquiry and class-booking infrastructure.
- An admin portal for customers, classes, schedules, bookings, enquiries, workshops, gallery items, and settings.

The product must be maintainable, secure, accessible, fast, responsive, extensible, and visually consistent with the approved Stitch direction.

## Verified business facts

- Brand: Prabha Yogashala.
- Philosophy supplied by the client: “Positive & Healthy Life.”
- The approved official logo is preserved unchanged at `assets-source/branding/prabha-yogashala-logo-original.png` (SHA-256 `869a1c284fa2782f0ee1d157e1b12e9018a8e8e081fa66df0c3ff32c9cf02e9c`). Its tree, meditating figure, supporting hand, lettering, proportions, and green palette must not be redrawn or reinterpreted.
- Teaching experience: 7 years. Do not silently convert this to “7+ years.”
- Qualifications supplied: “M.Sc” and “NIS Certification Course.” Do not expand, rename, or imply an accrediting body until exact wording is confirmed.
- Audience: ages 10 and above; beginner, intermediate, and advanced practitioners.
- General availability: morning 5:00 AM–8:00 AM and evening 5:00 PM–8:00 PM.
- Exact sessions and class schedule: not finalized.
- Trial classes: offered.
- Retreats: not currently offered.
- Delivery: online and offline classes are offered.
- Client-supplied WhatsApp number: +91 73532 42875. Reconfirm before public launch.
- Client-supplied social profiles: Instagram `prabha_yogashala` and YouTube `@prabhayogashala`. Reconfirm canonical URLs before public launch.

## Confirmed services

- Hatha Yoga
- Ashtanga Yoga
- Power Yoga
- Yin Yoga
- Yoga Sports
- Meditation
- Pranayama
- Group Classes
- Personal Sessions
- Online Classes
- Offline Classes
- Corporate Yoga
- Prenatal Yoga
- Kids Yoga
- Therapy Yoga
- Workshops

The centrally managed public practice list uses “Personal Yoga” as the display name for personal sessions.

## Information architecture

### Public

`/`, `/about`, `/classes`, `/classes/[slug]`, `/schedule`, `/pricing`, `/workshops`, `/gallery`, `/faq`, `/contact`, `/book`, `/privacy`, `/terms`

### Authentication

`/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`

### Customer

`/dashboard`, `/dashboard/bookings`, `/dashboard/classes`, `/dashboard/schedule`, `/dashboard/profile`

### Admin

`/admin`, `/admin/bookings`, `/admin/customers`, `/admin/customers/[id]`, `/admin/classes`, `/admin/classes/new`, `/admin/classes/[id]`, `/admin/schedule`, `/admin/schedule/new`, `/admin/schedule/[id]`, `/admin/enquiries`, `/admin/enquiries/[id]`, `/admin/workshops`, `/admin/workshops/new`, `/admin/workshops/[id]`, `/admin/gallery`, `/admin/gallery/[id]`, `/admin/settings`

## Content integrity rules

Generated Stitch copy is not evidence. Preserve layout intent, not invented claims.

Never invent or publish:

- Testimonials, ratings, customer counts, revenue, or attendance statistics.
- Medical, therapeutic, scientific, or guaranteed health outcomes.
- Prices, memberships, discounts, capacities, availability counts, or spots remaining.
- Exact class dates, times, durations, recurrence rules, or holidays beyond the two verified broad windows.
- Instructor names, additional instructors, degrees, certifications, awards, branches, addresses, or facilities.
- Refund, cancellation, rescheduling, payment, email, or notification policies.
- Zoom arrangements, global reach, response times, or international participation claims.

Use neutral copy, “To be confirmed,” and truthful empty states. Do not use fabricated content simply to fill a design.

## V1 scope boundaries

The following are outside the current V1 unless a later explicit requirement changes scope:

- Razorpay or other payments.
- Subscriptions, automated memberships, invoices, coupons, and billing history.
- Testimonials.
- Blog publishing.
- Retreats.
- Certificates and progress tracking.
- SMS and advanced email automation.
- AI chatbot.
- Mobile app.
- Nutrition platform.
- Wearable integrations.
- Corporate customer portal.
- Complex CMS.
- Multiple instructors and multiple branches.
- Multilingual infrastructure.

The client questionnaire requested some of these capabilities. They are recorded for future planning, not authorized for V1 implementation.

## Required product behavior

- Anonymous visitors may submit trial enquiries without creating an account.
- Signed-in users should have known profile information prefilled in enquiry and booking forms.
- Registration must never allow the user to choose an admin role.
- Authorization must be enforced server-side and in PostgreSQL row-level security, never only in the UI.
- Public schedules show only published, verified sessions. Until those exist, show only the broad morning and evening availability windows.
- Customer and admin views must show real records or explicit empty states, never fictional dashboard data.
- Admin removal should prefer archival or unpublishing where deletion could break relationships or history.
- Admin management uses the existing schema only. Settings is intentionally read-only until a settings schema and business rules are approved.
- Admin schedule entry and display use `Asia/Kolkata` (India Standard Time) as the provisional operating timezone. Stored timestamps remain UTC instants; the client must reconfirm the business timezone before launch.
- Published classes, sessions, workshops, and gallery items are authoritative for public/customer surfaces. Static class editorial copy may supplement, but never override, managed records.
- Trial enquiries persist only after server validation and affirmative consent. Public errors remain generic; internal provider/database details are never shown to visitors.

## Standard language

- Primary CTA: “Book a Trial Class.”
- Secondary CTA: “WhatsApp Us.”
- Contextual CTAs: “Explore Classes,” “View Class,” “View Schedule,” “Learn More,” and “Contact Us.”

Do not use generated phrases such as “Consult Master,” “Enquire Shala,” “Reserve Spot,” “Book Complimentary Trial,” or “WhatsApp Acharya Consultation.”

## Client information required

- Instructor or founder name and approved biography.
- Exact M.Sc discipline and official NIS course/certification wording.
- Physical studio address, service area, and whether Google Maps should be used.
- Public email address and confirmation of the WhatsApp number and social URLs.
- Approved class descriptions, benefits, levels, formats, durations, days, and capacities.
- Final schedule and scheduling rules.
- Confirmation that `Asia/Kolkata` is the operating timezone for all managed schedules.
- Pricing, tax treatment, and whether a public pricing page should launch as a placeholder or remain unpublished.
- Cancellation and rescheduling rules.
- Workshop details and publication process.
- Approved photography and image-use rights.
- Gallery content and captions.
- FAQ answers.
- Privacy policy, terms, governing jurisdiction, and legal business identity.
- Domain choice, Vercel ownership, Supabase project ownership, and business email plan.
- Transactional email provider and approved templates when email work begins.
