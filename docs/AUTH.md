# Prabha Yogashala Authentication

## Architecture

Supabase Auth owns email/password identity. `@supabase/ssr` stores the session in secure cookies; `src/proxy.ts` calls `getClaims()` before rendering so expired tokens can be refreshed into the response. Server Components and protected layouts never trust `getSession()` or browser state for authorization.

`/dashboard/*` and `/admin/*` are protected twice:

1. Proxy verifies the signed session and resolves `user_roles` for early redirects.
2. Each protected route-group layout independently verifies the session and protected role before rendering.

Customers are redirected away from `/admin` to `/dashboard`. Admins use `/admin` exclusively and are redirected there from `/dashboard`. Database RLS remains the final data-access boundary.

Public registration sends only `full_name` and `phone` as safe profile metadata. It never accepts or sends a role. The database trigger creates a blank profile and the hard-coded `customer` role; after confirmation, the callback validates and copies the safe profile metadata into `profiles`. Only `user_roles` determines authorization.

## Auth flows

- Registration: Server Action validation → `signUp` → verification email → `/auth/confirm` → verified cookie session → `/verify-email`.
- Login: Server Action validation → password authentication → protected role lookup → role-compatible safe redirect.
- Logout: server-side Supabase sign-out → public homepage.
- Recovery: privacy-neutral request → recovery email → `/auth/confirm` → verified session plus 15-minute HTTP-only recovery marker → `/reset-password` → password update → sign out → login.
- Public header: browser session state changes only the account link. It is presentation, not an authorization boundary.

Login redirects are restricted to `/dashboard/*` for customers and `/admin/*` for admins. Absolute URLs, protocol-relative URLs, backslashes, control characters, malformed encoding, unrelated paths, and cross-role portal paths fall back to the caller's portal home.

## Required environment and Supabase configuration

Copy `.env.example` to an uncommitted `.env.local` and supply:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL
```

No service-role key is used or permitted in browser-visible configuration.

In every hosted Supabase environment:

- Set Site URL to the canonical application origin.
- Allow the exact preview/production `/auth/confirm` redirect origins required by deployment; do not use broad production wildcards.
- Keep email confirmation enabled.
- Configure a production SMTP provider and approved sender identity before launch.
- Copy `supabase/templates/confirmation.html` and `supabase/templates/recovery.html` into the hosted Auth email-template settings. These templates send `TokenHash` to the server callback; the default fragment-based template is not the intended SSR flow.
- Align the hosted password policy with the application minimum: 8–72 characters with at least one letter and one number, or deliberately strengthen both together.
- Disable link tracking that rewrites authentication URLs.

Local template paths are versioned in `supabase/config.toml`. The templates become active after restarting the local Supabase stack.

## Hosted staging status

Verified on 2026-09-24:

- Site URL is exactly `https://yoga-website-three-kappa.vercel.app`.
- The only allowed Auth redirects are `https://yoga-website-three-kappa.vercel.app/auth/confirm`, `http://localhost:3000/auth/confirm`, and `http://127.0.0.1:3000/auth/confirm`. Previous broad wildcard entries were removed.
- Email/password signup is enabled and email confirmation remains required.
- The hosted minimum password length is 8 with at least one letter and one number. The application additionally enforces its documented 72-character maximum.
- Secure email change and refresh-token rotation are enabled.
- The project still uses Supabase's default development email provider; custom SMTP is not configured. This is not production-ready email delivery.
- The checked-in confirmation and recovery templates are not active on the hosted project. Supabase rejected template modification because this Free-tier project is using the default email provider. One disposable hosted signup received and completed the default confirmation email, but this does not establish production SMTP capacity or hosted template parity.

To close the email blocker, configure a production SMTP provider and verified sender in Supabase Auth, then paste the subject/content from `supabase/templates/confirmation.html` and `supabase/templates/recovery.html` into their respective hosted templates. Disable provider link tracking, retain the exact Site URL and redirect list above, and send confirmation/recovery messages to an explicitly approved test mailbox.

Safe hosted checks that do not require a real identity passed: invalid credentials return a generic failure; recovery for a nonexistent address returns the same neutral success shape; invalid refresh and logout tokens fail closed; anonymous users can read the 12 published class records but cannot read profiles or roles or inject a role. Deployed browser checks also confirm anonymous `/dashboard` and `/admin` requests reach `/login` with safe internal `next` values, and malformed confirmation tokens reach the invalid-link state.

A non-PII disposable identity verified valid hosted registration, email delivery, confirmation, one matching profile, and one hard-coded `customer` role with no injected role metadata. Valid login, cookie refresh, logout, password recovery, and customer-versus-admin route behavior still require approved long-lived customer and admin test identities. The rollback-only pgTAP suite proves the database RLS contexts; it does not substitute for those remaining live Auth/session checks.

## Repeatable verification checklist

Run database reset, RLS tests, and type generation first as documented in `DATABASE.md`. Then test against the connected Supabase environment:

### Registration and email

- Valid registration creates an Auth user, profile, and only a `customer` role.
- Duplicate email behavior is privacy-safe.
- Invalid email, weak password, mismatch, missing terms, and invalid profile fields are rejected.
- Added `role=admin` form/query/metadata values do not create admin access.
- Valid confirmation establishes a cookie session and copies only validated name/phone.
- Reused, malformed, and expired confirmation links show the invalid-link state.

### Login, routing, and session

- Correct credentials route customer → `/dashboard` and admin → `/admin`.
- Incorrect credentials and unverified accounts receive a safe generic failure.
- Anonymous `/dashboard/*` and `/admin/*` requests route to login with a safe internal `next` value.
- Customer `/admin/*` routes to `/dashboard`; admin `/dashboard/*` routes to `/admin`.
- Customer role mutation attempts remain blocked by PostgreSQL privileges/RLS.
- External, protocol-relative, JavaScript, encoded-backslash, malformed, public-page, and cross-role redirects are rejected.
- Refreshing a protected page keeps the valid session; expiry refreshes cookies through Proxy.
- Logout invalidates the Supabase session and a protected-page revisit requires login.

### Recovery

- Forgot-password messaging does not reveal whether an account exists.
- A valid recovery link creates the short-lived recovery state and permits one password update.
- Direct, malformed, reused, and expired reset links cannot update a password.
- Successful reset removes the recovery marker, signs out the recovery session, and accepts the new password at login.

### UI and resilience

- Exercise keyboard order, visible focus, password visibility controls, error focus/announcements, pending buttons, password-manager autocomplete, and mobile navigation.
- Verify auth pages at 390, 768, 1024, 1280, and 1440 pixels with no horizontal overflow.
- Confirm public pages remain usable when Supabase is unavailable and protected pages fail closed without revealing content.
