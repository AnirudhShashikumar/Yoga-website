# Prabha Yogashala Design System

## Extracted direction

All four Stitch export folders contain the same `DESIGN.md`; the screenshots cover Home, About, Classes, and Schedule. Additional standalone screenshots cover a public concept, class cards, Admin, and Customer Dashboard. Together they establish an editorial, calm, premium, traditional, and accessible direction.

The generated HTML is not production source. Its CDN scripts, remote temporary images, placeholder phone number, material icon font, arbitrary utility values, and invented business content must not be copied directly.

## Visual thesis

Quiet editorial discipline: warm ivory canvas, deep forest typography, readable humanist body text, measured serif headlines, light sage and sky accents, spacious composition, restrained depth, and natural photography. Typography, photography, and layout carry the identity; avoid lotus, mandala, chakra, neon, heavy glass effects, and generic SaaS patterns.

## Official brand identity

- The client-approved master logo is preserved unchanged at `assets-source/branding/prabha-yogashala-logo-original.png`.
- `public/brand/prabha-yogashala-logo.png` is the transparent, tightly cropped full lockup for contexts with enough vertical space, principally the public footer. It retains the official PRABHA and Yogashala lettering.
- `public/brand/prabha-yogashala-mark.png` is the square, transparent symbol derivative containing only the official tree, meditating figure, and supporting hand. It is used in compact headers and as the source for browser/app icons.
- Compact headers pair the official mark with existing supporting brand text. The image uses empty alternative text because the link's visible name and accessible label already identify Prabha Yogashala.
- The complete lockup carries `alt="Prabha Yogashala"` where it is the sole visible identity. Do not repeat adjacent brand-name text.
- Preserve artwork proportions and colors. Do not stretch, redraw, recolor, animate, glow, watermark, or use the logo as general section decoration.
- Public, auth, customer, and admin headers remain approximately 80px high. The symbol is 44–48px so navigation and account controls keep their established alignment.
- App Router file conventions provide the multi-size symbol favicon, 512px standard icon, and 180px warm-ivory Apple touch icon. Do not add conflicting metadata icon declarations.
- No web manifest or Open Graph image architecture currently exists. Do not introduce a PWA solely for branding; a composed social-sharing image can be added with later SEO work using only verified messaging.

## Canonical color tokens

| Token | Value | Purpose |
| --- | --- | --- |
| `background` | `#FBF9F6` | Default warm ivory canvas |
| `surface` | `#FFFFFF` | Elevated cards and sheets |
| `surface-subtle` | `#F5F3F0` | Form controls and quiet panels |
| `surface-muted` | `#EFEEEB` | Nested or inactive surfaces |
| `foreground` | `#1B1C1A` | Primary body text |
| `muted` | `#424844` | Secondary readable text |
| `brand` | `#1E3A2F` | Primary buttons, headings, strong accents |
| `brand-strong` | `#07241A` | Highest-emphasis forest tone |
| `brand-soft` | `#CDE5D6` | Soft sage emphasis |
| `sage` | `#DCEBE2` | Status and thematic tint |
| `sky` | `#DCEAF2` | Informational/breathwork tint; not body text |
| `ochre` | `#C5A059` | Sparse credential and focus accent |
| `border` | `#D8DDD9` | Thin neutral-green perimeter |
| `error` | `#BA1A1A` | Error text and destructive actions |
| `error-soft` | `#FFDAD6` | Error background |

The Stitch source uses both `#07241A` and `#1E3A2F` as “primary.” The production system keeps both with explicit semantic roles rather than treating the inconsistency as interchangeable.

## Typography

- Display and headings: Playfair Display, weights 500–600.
- Body, labels, navigation, forms, and data: Plus Jakarta Sans, weights 400–700.
- Use `next/font` so fonts are self-hosted by the build and do not require runtime Google Fonts requests.

| Role | Desktop | Mobile | Guidance |
| --- | --- | --- | --- |
| Display | 56/64, 600 | 38/44, 600 | Hero-only; keep line length controlled |
| Heading 1 | 36/44, 500 | 32/40, 500 | Primary page heading |
| Heading 2 | 36/44, 500 | 28/36, 500 | Major sections |
| Heading 3 | 26/34, 500 | 24/32, 500 | Card groups and subsections |
| Heading 4 | 20/28, 600 | 20/28, 600 | Cards and compact modules |
| Body large | 18/28, 400 | 18/28, 400 | Introductions and summaries |
| Body | 16/24, 400 | 16/24, 400 | Default reading text |
| Body small | 14/20, 400 | 14/20, 400 | Secondary content only |
| Label | 14–15/20, 600 | 14–15/20, 600 | Buttons and routine controls |
| Metadata | 12–13/18, 600 | 12–13/18, 600 | Nonessential tags only |

Do not use 11px generated labels for controls. The production floor is 14px for text people use regularly and 12px for genuinely secondary metadata.

## Spacing and layout

- Base spacing unit: 4px.
- Common steps: 8, 12, 16, 24, 32, 40, 48, 64, 80, 112px.
- Container: maximum 1280px.
- Outer gutters: 20px mobile, 24px tablet, 32px desktop.
- Public content uses a 4-column mental model on mobile and a 12-column grid on desktop.
- Major public sections: 64px mobile, 80px tablet, 112px desktop vertical padding.
- Card padding: 24px mobile, up to 32px desktop.
- Dashboard surfaces may use tighter rhythm, but not smaller text or touch targets.

## Shape and elevation

- Small radius: 4px for minor indicators only.
- Medium radius: 8px.
- Large radius: 12px.
- Control radius: 16px.
- Card radius: 24px.
- Pill radius: fully rounded.
- Resting card shadow: `0 4px 20px -2px rgba(30,58,47,0.04)`.
- Floating surface shadow: `0 12px 36px -4px rgba(30,58,47,0.09)`.
- Sticky/action shadow: `0 8px 28px rgba(30,58,47,0.12)`.

Prefer a thin border and tonal separation over stronger shadow. Do not reproduce the inconsistent radius values embedded in the Stitch Tailwind configuration.

## Components

### Buttons

- Primary: forest background, white text, pill shape, 48–52px tall.
- Secondary: ivory background, subtle forest border, forest text.
- Ghost: transparent with clear hover/focus state.
- Destructive: red only for genuine destructive actions.
- Disabled states must remain readable and must not rely only on opacity.

### Cards

Use white surfaces, 24px corners, thin green-tinted borders, and restrained shadows. Public cards may use 4:5 or 16:10 imagery. Admin and customer cards prioritize scanability and real data over decoration.

### Forms

Inputs, selects, and textareas use a minimum 52px control height, 16px corners, visible labels above fields, explicit help/error IDs, strong focus outlines, and `aria-invalid`/`aria-describedby` when validation is implemented. Errors must be announced and described in text, not color alone.

### Badges and statuses

Use sage for positive/available, sky for information, ochre for limited emphasis, neutral gray-green for inactive/default, and red for errors or cancelled/destructive states. Do not use colored dots unless they convey live status.

### Accordion

Prefer native `details`/`summary` when it meets the interaction. Preserve keyboard behavior and a visible expanded state. Do not add a JavaScript accordion solely for animation.

### Empty and loading states

Empty states explain the actual absence of data and may offer one relevant next action. Skeletons reserve layout without suggesting fictional content. Never render mock records as a loading or empty-state substitute.

## Public, customer, and admin surfaces

- Public pages are editorial and photography-led with generous whitespace.
- Customer pages are calm working surfaces; the first viewport prioritizes the next real action or truthful empty state.
- Admin pages are denser but retain typography, colors, and accessibility. Revenue, membership, capacity, and other unsupported metrics shown in concept screenshots must not appear.

### Customer portal system

- Desktop uses a restrained forest sidebar and an ivory content canvas. Mobile replaces the sidebar with a compact account header and horizontally scrollable, keyboard-accessible section navigation; the desktop rail is never squeezed into a small viewport.
- The active section uses text, fill, and `aria-current="page"`, not color alone. Public Website and Sign Out remain separate from the primary task navigation.
- Overview prioritizes the customer's real name, next confirmed session, upcoming bookings, and five grounded actions. New accounts receive an intentional empty state instead of fabricated activity or decorative metrics.
- Booking and session records use responsive bordered cards rather than dense tables. Class, date, time, format, and canonical status retain the same reading order on every breakpoint.
- Destructive cancellation uses the error color only after the user opens an inline two-step confirmation. Pending, success, and failure messages are announced to assistive technology.
- Profile editing uses persistent labels, supported fields only, a visible unsaved-change state, discard control, submit loading feedback, and a browser-leave warning while edits are dirty.
- Portal loading states reserve the shell and content rhythm without implying records. Empty and error states offer one useful recovery or navigation action.

### Admin portal system

The standalone admin Stitch screenshot is a direction reference, not a source of data or features. The production portal extracts its calm light workspace, dark forest navigation, compact summary cards, rounded panels, restrained borders, and serif/sans hierarchy while discarding fictional revenue, membership, customer, and attendance content.

- Desktop uses a sticky left navigation rail and a bounded main workspace; smaller screens collapse navigation into a horizontally scrollable landmark without hiding destinations.
- Page headers pair one clear `h1` with a short operational description and an optional primary action.
- Record collections use responsive card grids and compact definition lists instead of fragile wide tables. Status is always written in text and never communicated by color alone.
- Forms use the shared labels, help/error relationships, 52px controls, visible focus rings, pending states, and live action feedback. Confirmation is required before cancellation or archival.
- Empty states state the real absence of records and offer only valid next actions. Loading and error boundaries preserve the shell and never substitute fake dashboard content.
- Admin surfaces use the same forest, ivory, white, sage, border, ochre, and error tokens as the public/customer products; there is no separate dashboard theme or dark mode.

## Imagery

- Use natural daylight, authentic movement, calm studio textures, and varied ages/abilities when licensed assets are available.
- Do not treat Stitch’s temporary Google-hosted image URLs as production assets or proof of client identity.
- The client currently reports no professional photography. Image selection and rights remain unresolved.
- Never use an AI-generated face as the real instructor or founder.
- All meaningful images require useful alt text; decorative images use empty alt text.

## Motion

Allow subtle opacity/position reveals, hover feedback, image transitions, menus, and accordion transitions. Avoid scroll hijacking, parallax, WebGL, custom cursors, or a large animation dependency. The global foundation disables nonessential motion when `prefers-reduced-motion: reduce` is active.

## Responsive behavior

Test at 390, 768, 1024, 1280, and 1440px. Navigation becomes a keyboard-accessible mobile menu. Public card grids collapse without losing hierarchy. Dashboard navigation becomes a practical mobile pattern, not a squeezed desktop sidebar. Tables must reflow or scroll within labeled regions without causing viewport overflow.

## Dark mode status

The questionnaire asks for dark mode, but the approved Stitch references define only the light warm-ivory system. Dark mode is not implemented in Milestone 1 and requires either approved tokens or an explicit scope decision before implementation.
