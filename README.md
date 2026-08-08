# Vacarya — Call Confirmation Page

The post-booking confirmation page for Vacarya. A prospect lands here immediately
after booking a sales call. The page confirms the booking, drives show-up rate by
getting the prospect to watch a video and accept the calendar invite, and
pre-handles objections with an FAQ video grid and social proof before the call.

Live route: `/` (single page — no routing, no state, no data fetching).

## Run it

Requires Node 20.19+ or 22+.

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Build

```bash
npm run build     # type-checks, then outputs static files to dist/
npm run preview   # serve the built output locally
```

`dist/` is fully static and can be hosted anywhere — Vercel, Netlify, S3,
Cloudflare Pages.

## Design source

`design_handoff_vacarya_call_confirmation/` holds the original handoff: the spec
(`README.md`) with every measurement and all copy, plus two reference HTML builds.
The layout is a deliberate structural replica of a known high-converting
confirmation page, so measurements are exact rather than rounded — the fractional
values (`53.3px`, `26.7px`, `21.3px`) come from a 1.5× scale that runs through the
whole design. Do not round them individually.

## Still needed before launch

| Item | Status |
|---|---|
| Step 1 video | ✅ Live — Vidalytics `1bPO1F19aT_fHl5g` |
| Step 2 video | ✅ Live — Vidalytics `gdS3zkX56PY3q7QX` |
| Step 3 FAQ videos | ❌ 10 Vidalytics embeds |
| Step 4 partner videos | ❌ 10 Vidalytics embeds |
| Step 5 reviews / written wins | ❌ 15 portrait screenshots (3:4) |
| Terms / Privacy URLs | ❌ currently `#` |

Every pending slot renders a dashed grey placeholder marked with a `TODO` in
`src/CallConfirmation.tsx`. **These are dev-only and must not ship** — strip each
one as its real asset lands. Adding a video is a one-line swap:

```tsx
<VidalyticsVideo videoId="..." />
```

Below-the-fold players lazy-load via IntersectionObserver, and a module-level
guard keeps each player from initialising twice.

Legal and compliance should sign off on the disclaimer and the earnings claims in
the testimonials before this goes live.
