# Handoff: Vacarya — Call Confirmation Page

## Overview
A post-booking confirmation page for **Vacarya** (short-term-rental / co-hosting business). A prospect lands here immediately after booking a sales call. The page's job is to (a) confirm the booking, (b) drive show-up rate by getting the prospect to watch a video and accept the calendar invite, and (c) pre-handle objections with an FAQ video grid and heavy social proof before the call happens.

The layout is a **deliberate structural replica** of `budgetdogacademy.com/call-confirmation` (a known high-converting confirmation page), rebuilt with Vacarya's copy, brand color, and typography. Structure and spacing were matched intentionally — do not "improve" the hierarchy without asking.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, **not production code to copy directly**.

The task is to **recreate this design in the target codebase's existing environment** (Next.js, Astro, React, WordPress/Elementor, a landing-page builder, etc.) using its established patterns, components, and conventions. If no environment exists yet, pick the most appropriate one for a single marketing landing page — a static-first framework (Astro or Next.js static export) is the natural fit, since the page has no auth, no data fetching, and no app state.

Two files are included:
- `Vacarya - Variant B (Post Personalization).html` — **the reference build.** Standalone, opens in any browser, includes the live Vidalytics embed for Step 1. Use this as the visual source of truth.
- `Call Confirmation - Post Personalization.dc.html` — the authoring version. Same markup; the wins grid is generated from a loop with a `winsCount` prop. Useful for seeing which parts are meant to be repeated/data-driven.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, and copy. All measurements below are exact and taken from the built file. Recreate pixel-perfectly.

One important note on the numbers: the original page was measured at 67% browser zoom, so **many values are non-integer** (`53.3px`, `21.3px`, `33.3px`, `26.7px`). These are intentional and internally consistent — a 1.5× scale relationship runs through the whole page (e.g. `13.3 × 1.5 = 20`, `26.7 × 1.5 = 40`). Either keep the fractional values as-is, or multiply the entire page by 1.5 uniformly to land on round numbers. **Do not round values individually** — that breaks the rhythm.

## Screens / Views

Single page, no routes, no view states. Vertical stack of sections at `max-width: 1146.7px` centered, `padding: 0 13.3px`.

### Page shell
- Background: `#fbfbfb` (both `html/body` and the page wrapper)
- Font: `'Poppins', Helvetica, Arial, sans-serif` — loaded from Google Fonts, weights 400/500/600/700 + italics of each
- Base text color: `#000000`
- `-webkit-font-smoothing: antialiased`
- Top padding: `53.3px`

### 1. Hero (no card, no background — sits directly on page bg)
Constrained to `max-width: 748px`, centered.

- **H1**: `Congrats! Your Call Is Booked!`
  - Poppins **700 italic**, `44px / 50.7px`, centered, `text-wrap: balance`, `#000`
  - Preceded by an inline **SVG circular checkmark**, `41 × 41`, `vertical-align: -5px`, `margin-right: 9px`
    - Circle: `r=12` in a `0 0 24 24` viewBox, fill `#00ABE5`
    - Check path: `M6.6 12.4 L10.2 16 L17.4 8.5`, stroke `#fff`, `stroke-width: 2.6`, round caps + joins, no fill
- **Paragraph 1** (`margin-top: 24px`, `21.3px / 26.7px`, weight 400, left-aligned):
  > We look forward to speaking with you during your scheduled time! Please be in a quiet spot where we can speak about your goals.
- **Paragraph 2** (`margin-top: 26px`, same type):
  > **We will not take calls when you're on the go or can't devote your full attention.** <u>This call may decide the fate of your financial future, please treat it that way</u>.
  - First sentence `font-weight: 700`; second sentence `text-decoration: underline`, weight 400.
- Spacer below hero: `40.7px`

### 2. Section card (the repeating pattern — used by Steps 1–4 and both Bonuses)

Every section shares one shell:

```
container:  background #ffffff
            border-radius 6.7px
            box-shadow 0 3px 6.7px rgba(0,0,0,0.07)
            overflow hidden

header h2:  background #00ABE5
            color #000000          ← black text on blue, not white
            font-weight 700
            font-size 33.3px
            line-height 1.1
            letter-spacing 0
            text-transform uppercase
            text-align center
            padding 23.3px 16px
            margin 0

body:       padding varies per section (see below)
```

**Divider between every pair of cards:** a vertical tick — `width: 4px; height: 26.7px; background: #dddddd; margin: 30px auto 26px`.

### 3. Step 1 — "Step 1: Watch This Video Now"
- Body padding: `20.7px 35.3px 27.3px`
- **Live Vidalytics video.** Mount point: `<div id="vidalytics_embed_1bPO1F19aT_fHl5g" style="width:100%;position:relative;padding-top:56.25%">`
  - Video ID: `1bPO1F19aT_fHl5g`
  - Loader base URL: `https://fast.vidalytics.com/embeds/xWCLYwSv/1bPO1F19aT_fHl5g/`
  - The embed snippet is in the `<script>` at the bottom of the `.dc.html` file — copy it verbatim into the new implementation. It injects `loader.min.js` then `player.min.js`, then runs the player against the div id. In a React/Next implementation, fire it once from a mount effect and guard against double-init (the reference does this with a `window.__vidalyticsStep1` flag).
  - Requires internet; there is no offline fallback.
- **Caption below** (`margin-top: 10.7px`, `18.7px / 26.7px`, centered):
  > ***Important:*** *Please send this page to your spouse right now. It has important information they need to know about the call.*
  - "Important:" is `700 italic`; the rest is `400 italic`.

### 4. Step 2 — "Step 2: Accept The Calendar Invite"
- Body padding: `20.7px 35.3px 27.3px`
- One 16:9 video slot (**placeholder in the reference — needs a real Vidalytics embed**). Renders `1024 × 576` at a 1920 viewport.
- Caption (`10.7px` top margin, `18.7px / 26.7px`, centered):
  > ***Important:*** *Make sure your partner is available for this time. It's very hard to build a business together if you're not aligned.*

### 5. Step 3 — "Step 3: Get Your Questions Answered"
- Body padding: `20.7px 11.3px 22.7px`
- **CSS grid**, `grid-template-columns: 1fr 1fr`, `column-gap: 10.7px`, `row-gap: 40px`
- **12 FAQ cells.** Each cell = an H3 question above a 16:9 video slot (each slot renders `536 × 302` at a 1920 viewport).
  - H3: weight 700, `26px / 29.3px`, centered, `#000`, `margin: 0`
- The 12 questions, in order:
  1. What is Vacarya?
  2. What types of results can I get?
  3. How much capital do I need to start?
  4. Do I need to buy any property?
  5. Do I need any experience to do this?
  6. How much time will this take each week?
  7. How do I know this will work in my market?
  8. What if a unit underperforms?
  9. What if a guest damages the property?
  10. What if the rules change in my city?
  11. How much does Vacarya cost?
  12. What if my partner isn't aligned?
- All 12 videos are **placeholders** — real Vidalytics embeds pending.

### 6. Step 4 — "Step 4: Read Our Reviews"
- Body padding: `20.7px 35.3px 20px`
- One 16:9 video slot (placeholder).
- **CTA button** — a full-width block `<a>`, `margin-top: 20.7px`:
  - `background: #00b67a` (Trustpilot green), `padding: 17.3px 13.3px`, centered, no underline, no border-radius
  - Line 1: weight 700, `28px`, `line-height: 1.2`, uppercase, `#ffffff` — "Click Here To Read Our Unbiased Reviews"
  - Line 2: weight 500, `18px`, `line-height: 1.2`, uppercase, `#eafff6` — "We cannot delete or hide reviews, ensuring transparent, unfiltered feedback"
  - `target="_blank" rel="noopener"`
  - **`href` is currently `#` — needs the real reviews URL** (Trustpilot or equivalent). This is a required input before launch.

### 7. Bonus #1 — "Bonus #1: Listen To What Real Clients Have To Say"
- Body padding: `38px 11.3px 20px`
- **CSS grid**, `grid-template-columns: 1fr 1fr`, `column-gap: 10.7px` (no row-gap — spacing comes from per-item margins)
- Pattern repeats in bands of four DOM children: **two quotes side by side, then their two videos side by side.** Five bands = 10 testimonials.
- **Quote styling**: weight 700, `20px / 26.7px`, centered, `margin: 0`, `#000`
  - The metric inside each quote is wrapped in `color: #00ABE5; font-style: italic` — this is the emphasis device that carries the whole section. Keep it.
  - Attribution on its own line after a `<br>`, `font-style: italic`, same size/weight.
- **Video slots**: 16:9, `margin: 2.7px 0 67.3px` (the last band uses `margin: 2.7px 0 0`).
- The 10 testimonials, in DOM order:

| # | Quote (blue italic portion in **bold**) | Attribution |
|---|---|---|
| 1 | "I'm at **25 units doing around $90,000 a month**. My first one was live in 13 days." | Josh C., Hamilton, ON |
| 2 | "**Nine large units doing about $70,000 a month.** Ten days from signing to live." | Rob V., Toronto, ON |
| 3 | "**23 units, around $63,000 a month**, and the business qualified me for my E-2 visa." | Andy D., Nova Scotia |
| 4 | "**Three units, roughly $10,000 a month**, and I was live in two weeks." | Fasi K., Brampton, ON |
| 5 | "Five days from handover to live. **I'm at nine units now, about $24,000 a month.**" | Jason L., Toronto, ON |
| 6 | "I started with two large units. **They're doing around $15,000 a month between them.**" | Dennis L., Cookstown, ON |
| 7 | "I came in with one unit and no idea how far it could go. **We're at 30 units now, and it's a seven-figure business.**" | Dylan M., Ancaster, ON |
| 8 | "The turnaround time completely exceeded what I expected. **Eight units, live in 15 days.**" | Kajana D., Mississauga, ON |
| 9 | "The setup and the management were effortless. **They handled all of it** and I just watched it go live." | Trevor H., Rockvale, TN |
| 10 | "**We're holding a 25-30% profit margin**, even in the slow season." | Jessica & James, St. Petersburg, FL |

All 10 testimonial videos are **placeholders** — real Vidalytics embeds pending. Note the copy uses **curly typographic quotes and apostrophes** (`"` `"` `'`) throughout — preserve them.

### 8. Bonus #2 — "Bonus #2: Read Wins Posts From Our Client Community"
- Body padding: `20.7px 11.3px 20px`
- **CSS grid**, `grid-template-columns: repeat(3, 1fr)`, `gap: 10.7px`
- **15 portrait screenshot slots**, `aspect-ratio: 3/4`, ~`352px` wide per column at a 1920 viewport.
- These are screenshots of client wins posts from the private community. **All 15 are placeholders — real images pending.**
- In the authoring file this count is a prop (`winsCount`, default 15, step 3) so it stays a clean multiple of the 3-column grid. In production, drive it from an image array.

### 9. Footer
- Constrained to `max-width: 748px`, `padding: 42.7px 13.3px 60px`, centered text
- Line 1: `TERMS | PRIVACY` — weight 700, `21.3px / 26.7px`; both links `color: #000000`, no underline. **Both hrefs are `#` — need real URLs.**
- Line 2 (`margin-top: 16px`, weight 400, `21.3px / 26.7px`): "All rights reserved 2026. This program is brought to you and copyrighted by Vacarya LP"
- Line 3 — **legal disclaimer**, `margin-top: 21.3px`, `13.3px / 20px`, weight 400, `color: #555555`, **`text-align: left`** (deliberately left-aligned inside the otherwise-centered footer). Full text is in the HTML file — copy it verbatim, do not paraphrase or shorten. It covers results-not-typical, no earnings guarantees, and short-term-rental rules varying by jurisdiction. **Have legal/compliance sign off before launch.**

## Interactions & Behavior
Intentionally minimal — this is a static conversion page.

- **Video players**: all interaction is owned by the Vidalytics player (play/pause/scrub/volume). Do not build custom controls.
- **Reviews CTA**: opens in a new tab. No hover state is defined in the reference — if the codebase has a button hover convention, a subtle darken (~`#00a06c`) is appropriate.
- **Links**: global `a { color: #00ABE5 }`, `a:hover { color: #0090c2 }`. Footer and CTA links override to their own colors.
- No animations, transitions, loading states, error states, forms, or validation.
- **Responsive: not designed.** The reference is desktop-only (fixed max-widths, hard 2-col and 3-col grids). Real traffic to a confirmation page is heavily mobile, so **mobile is required work and needs a decision.** Recommended, pending approval:
  - Both 2-col grids (Step 3 FAQ, Bonus #1 testimonials) → 1 column below ~768px. For Bonus #1, the quote/video interleaving must be restructured so each quote stays adjacent to its own video — the current DOM order (quote, quote, video, video) will separate pairs when collapsed to one column. Cleanest fix: group each testimonial as one quote+video unit and let the grid handle placement.
  - Bonus #2 wins grid → 2 columns on tablet, 1 on phone.
  - Scale the type down proportionally; the 44px H1 and 33.3px section headers are too large for a phone.

## State Management
None. No state variables, no data fetching, no client-side routing.

The only stateful concern is the **Vidalytics init guard** — the loader must run exactly once per player, so guard against double-mounting (React strict-mode double-effects, hot reload). Ten-plus players on one page also means **lazy-loading below-the-fold embeds is strongly recommended** for page weight; the reference does not do this.

## Design Tokens

**Colors**
| Token | Value | Use |
|---|---|---|
| Brand blue | `#00ABE5` | Section header backgrounds, checkmark, quote metric emphasis, default link color |
| Brand blue (hover) | `#0090c2` | Link hover |
| Reviews green | `#00b67a` | Step 4 CTA background |
| Reviews green tint | `#eafff6` | Step 4 CTA subline text |
| Page background | `#fbfbfb` | `html`, `body`, page wrapper |
| Card surface | `#ffffff` | All section cards |
| Text | `#000000` | Body copy, headings, header text on blue |
| Muted text | `#555555` | Legal disclaimer |
| Divider | `#dddddd` | Vertical tick between cards |
| Placeholder fill | `#ededed` | Video/image placeholders (dev-only) |
| Placeholder border | `#c7c7c7` | Video/image placeholders (dev-only) |
| Placeholder label | `#5a5a5a` / `#8a8a8a` | Video/image placeholders (dev-only) |

**Typography** — Poppins throughout (400, 500, 700, plus italics)
| Role | Size / line-height | Weight | Notes |
|---|---|---|---|
| H1 | `44px / 50.7px` | 700 italic | centered, `text-wrap: balance` |
| Section header (H2) | `33.3px / 1.1` | 700 | uppercase, centered, black on blue |
| CTA line 1 | `28px / 1.2` | 700 | uppercase, white |
| FAQ question (H3) | `26px / 29.3px` | 700 | centered |
| Hero body / footer | `21.3px / 26.7px` | 400 / 700 | |
| Testimonial quote | `20px / 26.7px` | 700 | centered; metric in blue italic |
| Video caption | `18.7px / 26.7px` | 400/700 italic | centered |
| CTA line 2 | `18px / 1.2` | 500 | uppercase |
| Legal disclaimer | `13.3px / 20px` | 400 | `#555`, left-aligned |

**Spacing** (the 1.5×-derived scale) — `2.7 · 4 · 6.7 · 8 · 9.3 · 10.7 · 13.3 · 16 · 20 · 20.7 · 21.3 · 23.3 · 24 · 26 · 26.7 · 30 · 35.3 · 38 · 40 · 40.7 · 42.7 · 53.3 · 60 · 67.3`

**Radius** — `6.7px` on section cards. Everything else is square, including the CTA.

**Shadow** — one only: `0 3px 6.7px rgba(0,0,0,0.07)` on section cards.

**Layout widths** — outer container `1146.7px`; narrow text column (hero, footer) `748px`.

## Assets

**Nothing is a real asset yet except one video.** This is the main gap between the reference and a shippable page.

| Asset | Status | Needed |
|---|---|---|
| Step 1 video | ✅ Live | Vidalytics `1bPO1F19aT_fHl5g`, base `https://fast.vidalytics.com/embeds/xWCLYwSv/1bPO1F19aT_fHl5g/` |
| Step 2 video | ❌ Placeholder | 1 Vidalytics embed |
| Step 3 FAQ videos | ❌ Placeholder | 12 Vidalytics embeds |
| Step 4 reviews video | ❌ Placeholder | 1 Vidalytics embed |
| Bonus #1 testimonials | ❌ Placeholder | 10 Vidalytics embeds |
| Bonus #2 wins posts | ❌ Placeholder | 15 portrait screenshots (3:4), community wins posts |
| Reviews CTA URL | ❌ `#` | Real reviews page URL |
| Terms / Privacy URLs | ❌ `#` | Real URLs |
| Vacarya logo | ❌ Absent | The reference has no logo anywhere — confirm whether one belongs in the hero |

Placeholders are dashed-border grey boxes with a label and the pixel size they occupy at a 1920 viewport. They exist purely to communicate slot dimensions and must not ship — strip them entirely once real assets land.

Fonts are the only external dependency besides Vidalytics: Google Fonts Poppins, with `preconnect` to `fonts.googleapis.com` and `fonts.gstatic.com`. Self-hosting Poppins is worth doing for a paid-traffic landing page.

## Files
- `Vacarya - Variant B (Post Personalization).html` — standalone reference build, opens in a browser, live Step 1 video. **Visual source of truth.**
- `Call Confirmation - Post Personalization.dc.html` — authoring version; wins grid is loop-generated from a `winsCount` prop, and the Vidalytics init snippet lives in the script block at the bottom.

## Implementation checklist
1. Scaffold the page in the target framework; port the section-card pattern as one reusable component (header + body slot) — six sections use it.
2. Port hero, footer, and the legal disclaimer verbatim.
3. Build the three grids (FAQ 2-col, testimonials 2-col, wins 3-col), driven by arrays rather than hand-written repetition.
4. Wire the Step 1 Vidalytics embed with a once-only init guard; build the video component so the remaining 24 embeds are one-line additions.
5. Collect real assets and URLs from the table above.
6. Add lazy-loading for below-the-fold embeds.
7. Resolve the mobile question, then implement responsive.
8. Legal/compliance review of the disclaimer and all earnings claims in the testimonials.
