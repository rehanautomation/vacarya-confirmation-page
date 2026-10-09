/**
 * Emits a single self-contained HTML file for pasting into a WordPress Custom
 * HTML block: wordpress/vacarya-call-confirmation.html
 *
 * Everything is read out of src/CallConfirmation.tsx so the two never drift —
 * the stylesheet, the copy and the video ids all come from there. Re-run this
 * after any change to the page.
 *
 *   node scripts/build-wordpress-html.mjs
 *
 * Assets (fonts, images, PDF) are referenced from ASSET_BASE rather than
 * base64-inlined. Inlining would put all 38 images in the document, so they
 * would download and decode on load even though the 28 revenue shots are not
 * shown until the reader clicks — turning a ~45KB page into ~1.4MB. Referencing
 * keeps them lazy-loadable and cacheable.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const source = fs.readFileSync(path.join(root, "src/CallConfirmation.tsx"), "utf8");

/** Change this one line to move the assets somewhere else (e.g. WP uploads). */
const ASSET_BASE = "https://vacarya-confirmation-page.vercel.app";

/* ---------------------------------------------------------------- extraction */

const between = (start, end) => {
  const a = source.indexOf(start);
  if (a < 0) throw new Error(`missing marker: ${start}`);
  const b = source.indexOf(end, a + start.length);
  if (b < 0) throw new Error(`missing end marker for: ${start}`);
  return source.slice(a + start.length, b);
};

/** Evaluates an array literal lifted straight from the source. Handles both
 *  `];` and `] as const;` endings. */
const literal = (start) => {
  const a = source.indexOf(start);
  if (a < 0) throw new Error(`missing marker: ${start}`);
  const b = source.indexOf("\n]", a + start.length);
  if (b < 0) throw new Error(`missing end marker for: ${start}`);
  return eval(`[${source.slice(a + start.length, b)}]`); // eslint-disable-line no-eval
};

const PAGE_CSS = between("const PAGE_CSS = `", "`;\n");
const FAQ = literal("const FAQ_QUESTIONS = [");
const PORTRAIT = literal("const PARTNERS_PORTRAIT: Partner[] = [");
const LANDSCAPE = literal("const PARTNERS_LANDSCAPE: (Partner & { ratio: number })[] = [");
const CASE_STUDIES = literal("const CASE_STUDIES: { title: string; videoId: string }[] = [");
const REVIEWS = literal("const REVIEWS: Review[] = [");

const pick = (name) => {
  const m = source.match(new RegExp(`const ${name} = ([^;]+);`));
  if (!m) throw new Error(`missing const: ${name}`);
  return eval(m[1]); // eslint-disable-line no-eval
};

const PORTRAIT_RATIO = pick("PORTRAIT_RATIO");
const EARNINGS_COUNT = pick("EARNINGS_COUNT");
const EARNING_WIDTH = pick("EARNING_WIDTH");
const EARNING_HEIGHT = pick("EARNING_HEIGHT");
const TERMS_URL = pick("TERMS_URL");
const PRIVACY_URL = pick("PRIVACY_URL");
const AGREEMENT_URL = pick("AGREEMENT_URL");
const VIDALYTICS_ACCOUNT = pick("VIDALYTICS_ACCOUNT");

/* ------------------------------------------------------------------- helpers */

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const asset = (p) => ASSET_BASE + p;

/** Same order-preserving packing the React page uses: the REVIEWS array is a
 *  ranking, so columns fill in that order rather than tallest-first. */
function packColumns(items, columnCount) {
  const columns = Array.from({ length: columnCount }, () => []);
  const heights = new Array(columnCount).fill(0);
  for (const item of items) {
    let shortest = 0;
    for (let i = 1; i < columnCount; i += 1) if (heights[i] < heights[shortest]) shortest = i;
    columns[shortest].push(item);
    heights[shortest] += item.height / item.width;
  }
  return columns;
}

const video = (videoId, ratio = 56.25) =>
  `<div class="vcc-video" data-video="${videoId}" data-ratio="${ratio}">` +
  `<div id="vidalytics_embed_${videoId}" class="vcc-video-mount" style="padding-top:${ratio}%"></div></div>`;

const partnerName = (name, location) =>
  `<p class="vcc-partner__name">- ${esc(name)}<br>${esc(location)}</p>`;

const card = (title, bodyClass, inner) =>
  `<section class="vcc-card"><h2 class="vcc-card__header">${esc(title)}</h2>` +
  `<div class="${bodyClass}">${inner}</div></section>`;

const divider = `<div class="vcc-divider" aria-hidden="true">|</div>`;

const caption = () =>
  `<p class="vcc-caption"><strong>Important:</strong> <span>Make sure to add this call to your ` +
  `calendar and ensure your spouse/business partner is available for this time</span></p>`;

/* -------------------------------------------------------------------- markup */

const reviewColumns = (count) =>
  packColumns(REVIEWS, count)
    .map(
      (column) =>
        `<div class="vcc-reviews__column">` +
        column
          .map(
            (r) =>
              `<img class="vcc-review" src="${asset(r.src)}" width="${r.width}" height="${r.height}" ` +
              `alt="Client review" loading="lazy" decoding="async">`,
          )
          .join("") +
        `</div>`,
    )
    .join("");

const body = `
<main class="vcc-page">
  <div class="vcc-container">
    <header class="vcc-hero">
      <h1 class="vcc-hero__title"><svg viewBox="0 0 24 24" width="41" height="41" aria-hidden="true" class="vcc-check"><circle cx="12" cy="12" r="12" fill="#00ABE5"></circle><path d="M6.6 12.4 L10.2 16 L17.4 8.5" fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"></path></svg>Your Call Is Confirmed!</h1>
      <p class="vcc-hero__body">We look forward to speaking with you during your scheduled time!</p>
      <p class="vcc-hero__body vcc-hero__body--tight">Before your call, <span class="vcc-underline">make sure you watch the videos on this page.</span> They&rsquo;re an important part of the process and will give you the context you need, so when we speak we can build on that and get into how this would actually apply to you.</p>
      <p class="vcc-hero__body vcc-hero__body--tight"><strong>Expect a quick call or text from +1 (302) 566 0034 prior to your scheduled call from a member of our advisory team.</strong></p>
    </header>

    <div class="vcc-hero-spacer"></div>

    ${card("Step 1: Call Confirmation", "vcc-body vcc-body--wide", video("1bPO1F19aT_fHl5g") + caption())}
    ${divider}
    ${card("Step 2: How It All Works", "vcc-body vcc-body--wide", video("gdS3zkX56PY3q7QX") + caption())}
    ${divider}
    ${card(
      "Step 3: Get Your Questions Answered",
      "vcc-body vcc-faq",
      FAQ.map(
        (q) =>
          `<div class="vcc-faq__item"><h3 class="vcc-faq__question">${esc(q.question)}</h3>${video(q.videoId)}</div>`,
      ).join(""),
    )}
    ${divider}
    ${card(
      "Step 4: Hear From Our Partners",
      "vcc-body vcc-partners",
      `<div class="vcc-partners__grid">` +
        PORTRAIT.map(
          (p) =>
            `<div class="vcc-partner">${partnerName(p.name, p.location)}${video(p.videoId, PORTRAIT_RATIO)}</div>`,
        ).join("") +
        `<div class="vcc-partners__stack">` +
        LANDSCAPE.map(
          (p) =>
            `<div class="vcc-partner-wide">${partnerName(p.name, p.location)}${video(p.videoId, p.ratio)}</div>`,
        ).join("") +
        `</div></div>`,
    )}
    ${divider}
    ${card(
      "Step 5: Reviews & Written Wins",
      "vcc-body vcc-step5",
      `<div class="vcc-reviews" id="vcc-reviews">${reviewColumns(3)}</div>` +
        `<button type="button" class="vcc-more" id="vcc-more" aria-expanded="false">More Client Numbers</button>` +
        `<div class="vcc-earnings" id="vcc-earnings" hidden>` +
        Array.from(
          { length: EARNINGS_COUNT },
          (_, i) =>
            `<img class="vcc-earning" data-src="${asset(`/revenue/earning-${i + 1}.webp`)}" ` +
            `width="${EARNING_WIDTH}" height="${EARNING_HEIGHT}" alt="Client revenue" loading="lazy" decoding="async">`,
        ).join("") +
        `</div>`,
    )}
    ${divider}
    ${card(
      "Bonus: Recent Case Studies",
      "vcc-body vcc-case-studies",
      CASE_STUDIES.map(
        (c) =>
          `<div class="vcc-case-study"><h3 class="vcc-case-study__title">${esc(c.title)}</h3>${video(c.videoId)}</div>`,
      ).join(""),
    )}
  </div>

  <section class="vcc-agreement" id="partnership">
    <div class="vcc-agreement__panel">
      <p class="vcc-agreement__eyebrow">Want to review the agreement before your call?</p>
      <h2 class="vcc-agreement__title">Review the Partnership Agreement</h2>
      <p class="vcc-agreement__body">We believe in being completely transparent upfront. You can review the partnership agreement before your call so you know exactly how everything is structured and what to expect. If you have any questions, bring them to the call and we can walk through them together.</p>
      <a class="vcc-agreement__cta" href="${asset(AGREEMENT_URL)}" target="_blank" rel="noopener">Review Partnership Agreement</a>
    </div>
  </section>

  <footer class="vcc-footer">
    <div class="vcc-footer__inner">
      <img class="vcc-footer__logo" src="${asset("/vacarya-logo.webp")}" alt="Vacarya" width="260" height="223">
      <p class="vcc-footer__links"><a href="${TERMS_URL}">TERMS</a> | <a href="${PRIVACY_URL}">PRIVACY</a></p>
      <p class="vcc-footer__copy">All rights reserved 2026. This program is brought to you and copyrighted by Vacarya LP</p>
    </div>
  </footer>
</main>`;

/* ---------------------------------------------------------------------- css */

/*
 * WordPress themes style bare tags, and those rules land on our elements. This
 * resets exactly the tags used above, scoped inside .vcc-page so nothing else on
 * the site is touched. It goes before PAGE_CSS so our own rules still win.
 */
/*
 * The tag lists are wrapped in :where() deliberately. Written plainly,
 * `.vcc-page h1` scores 0,1,1 and outranks our own `.vcc-hero__title` at 0,1,0 —
 * the reset would beat the styles it is meant to protect. :where() contributes
 * nothing, so each selector scores 0,1,0: still above a theme's bare `h1`
 * (0,0,1), still below our classes, which also come later in the sheet.
 */
const RESET = `
.vcc-page, .vcc-page * { box-sizing: border-box; }
.vcc-page :where(h1, h2, h3, p) {
  margin: 0; padding: 0; border: 0; background: none;
  font: inherit; color: inherit; letter-spacing: normal; text-transform: none; text-shadow: none;
}
.vcc-page :where(img) { max-width: 100%; height: auto; border: 0; border-radius: 0; box-shadow: none; padding: 0; margin: 0; }
.vcc-page :where(a) { text-decoration: none; box-shadow: none; border: 0; }
.vcc-page :where(button) {
  margin: 0; border: 0; background: none; font: inherit; color: inherit;
  text-transform: none; letter-spacing: normal; box-shadow: none;
  -webkit-appearance: none; appearance: none;
}
.vcc-page :where(section, div, footer, header) { margin: 0; padding: 0; border: 0; }
.vcc-page :where(svg) { vertical-align: baseline; }
.vcc-page [hidden] { display: none !important; }
`;

const FONT_FACES = [
  ["Barlow", 400, "normal", "barlow-400.woff2"],
  ["Barlow", 400, "italic", "barlow-400-italic.woff2"],
  ["Barlow", 700, "normal", "barlow-700.woff2"],
  ["Barlow", 700, "italic", "barlow-700-italic.woff2"],
  ["Barlow Semi Condensed", 400, "normal", "barlow-semi-condensed-400.woff2"],
  ["Barlow Semi Condensed", 500, "normal", "barlow-semi-condensed-500.woff2"],
  ["Barlow Semi Condensed", 700, "normal", "barlow-semi-condensed-700.woff2"],
  ["Barlow Semi Condensed", 700, "italic", "barlow-semi-condensed-700-italic.woff2"],
  ["Montserrat", 800, "normal", "montserrat-800.woff2"],
]
  .map(
    ([family, weight, style, file]) =>
      `@font-face{font-family:'${family}';font-style:${style};font-weight:${weight};font-display:swap;src:url('${asset("/fonts/" + file)}') format('woff2');}`,
  )
  .join("\n");

/* ----------------------------------------------------------------- behaviour */

const SCRIPT = `
(function () {
  var BASE = ${JSON.stringify(ASSET_BASE)};
  var ACCOUNT = ${JSON.stringify(VIDALYTICS_ACCOUNT)};
  var REVIEWS = ${JSON.stringify(REVIEWS.map((r) => ({ ...r, src: asset(r.src) })))};

  /* --- Vidalytics: one loader per player, never twice ------------------- */
  var started = {};
  function load(videoId) {
    if (started[videoId]) return;
    started[videoId] = 1;
    var embedId = 'vidalytics_embed_' + videoId;
    var url = 'https://fast.vidalytics.com/embeds/' + ACCOUNT + '/' + videoId + '/';
    (function (v, i, d, a, l, y, t, c, s) {
      y='_'+d.toLowerCase();c=d+'L';if(!v[d]){v[d]={};}if(!v[c]){v[c]={};}if(!v[y]){v[y]={};}
      var vl='Loader',vli=v[y][vl],vsl=v[c][vl+'Script'],vlf=v[c][vl+'Loaded'],ve='Embed';
      if(!vsl){vsl=function(u,cb){
        if(t){cb();return;}s=i.createElement("script");s.type="text/javascript";s.async=1;s.src=u;
        s.onload=function(){vlf=1;cb();};
        i.getElementsByTagName("head")[0].appendChild(s);
      };}
      vsl(l+'loader.min.js',function(){if(!vli){var vlc=v[c][vl];vli=new vlc();}
        vli.loadScript(l+'player.min.js',function(){var vec=v[d][ve];t=new vec();t.run(a);});});
    })(window, document, 'Vidalytics', embedId, url);
  }

  var slots = [].slice.call(document.querySelectorAll('.vcc-video'));
  var first = slots[0];
  if (first) load(first.getAttribute('data-video'));          // Step 1 eager

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { load(e.target.getAttribute('data-video')); io.unobserve(e.target); }
      });
    }, { rootMargin: '400px' });
    slots.slice(1).forEach(function (el) { io.observe(el); });
  } else {
    slots.slice(1).forEach(function (el) { load(el.getAttribute('data-video')); });
  }

  /* --- Reviews masonry: repack when the column count changes ------------ */
  var grid = document.getElementById('vcc-reviews');
  var mq = window.matchMedia('(max-width: 767px)');
  var current = 0;

  function pack(items, n) {
    var cols = [], h = [], i;
    for (i = 0; i < n; i++) { cols.push([]); h.push(0); }
    // Rank order, each into the shortest column — must match packColumns above.
    items.forEach(function (it) {
      var s = 0;
      for (var j = 1; j < n; j++) if (h[j] < h[s]) s = j;
      cols[s].push(it); h[s] += it.height / it.width;
    });
    return cols;
  }

  function render() {
    var n = mq.matches ? 2 : 3;
    if (n === current) return;
    current = n;
    grid.innerHTML = pack(REVIEWS, n).map(function (col) {
      return '<div class="vcc-reviews__column">' + col.map(function (r) {
        return '<img class="vcc-review" src="' + r.src + '" width="' + r.width + '" height="' +
          r.height + '" alt="Client review" loading="lazy" decoding="async">';
      }).join('') + '</div>';
    }).join('');
  }

  render();
  if (mq.addEventListener) mq.addEventListener('change', render); else mq.addListener(render);

  /* --- Deep link straight to the agreement ------------------------------
   * Fires for #partnership and for any URL whose path ends in /partnership,
   * so the same code covers the hash link and a redirect on the pretty path.
   *
   * A single jump is not enough here: everything above this section is a
   * lazy-loaded video or image, and each one that resolves nudges the section
   * down. So re-aim until its offset stops changing (about 3s worst case), and
   * stand down the instant the visitor scrolls, taps or presses a key — after
   * that the page is theirs.
   */
  var agreement = document.getElementById('partnership');

  function wantsAgreement() {
    if ((window.location.hash || '').replace('#', '').toLowerCase() === 'partnership') return true;
    return /\/partnership$/.test(window.location.pathname.toLowerCase().replace(/\/+$/, ''));
  }

  if (agreement && wantsAgreement()) {
    var handOff = false;
    ['wheel', 'touchstart', 'keydown'].forEach(function (ev) {
      window.addEventListener(ev, function () { handOff = true; }, { passive: true });
    });

    var aim = function () {
      if (handOff) return;
      window.scrollTo(0, agreement.getBoundingClientRect().top + window.pageYOffset - 20);
    };

    aim();
    window.addEventListener('load', aim);

    var lastY = -1, tries = 0;
    var settle = setInterval(function () {
      if (handOff || ++tries > 24) { clearInterval(settle); return; }
      var y = Math.round(agreement.getBoundingClientRect().top + window.pageYOffset);
      if (y !== lastY) { lastY = y; aim(); }
    }, 125);
  }

  /* --- Reveal the revenue screenshots ----------------------------------- */
  var more = document.getElementById('vcc-more');
  var earnings = document.getElementById('vcc-earnings');
  if (more && earnings) {
    more.addEventListener('click', function () {
      [].forEach.call(earnings.querySelectorAll('img[data-src]'), function (img) {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
      });
      earnings.hidden = false;
      more.parentNode.removeChild(more);
    });
  }
})();
`;

/* --------------------------------------------------------------------- emit */

const html = `<link rel="preconnect" href="https://fast.vidalytics.com" crossorigin>
<link rel="preconnect" href="${ASSET_BASE}" crossorigin>
<!--
  Vacarya — Call Confirmation
  Generated by scripts/build-wordpress-html.mjs. Do not edit by hand; edit
  src/CallConfirmation.tsx and re-run the script.

  Paste this whole file into a WordPress Custom HTML block.

  Assets load from ${ASSET_BASE}. To move them to the WordPress media library,
  change every occurrence of that origin to your uploads URL.

  Deep link: the agreement section carries id="partnership", so
  https://hostvacarya.com/call-confirmation/#partnership opens the page scrolled
  to it. The script at the bottom also answers to a /partnership path segment if
  a redirect or child page ever points there.
-->
<style>
${FONT_FACES}
${RESET}
${PAGE_CSS}
</style>

<link rel="preload" as="font" type="font/woff2" crossorigin href="${asset("/fonts/barlow-semi-condensed-700-italic.woff2")}">
<link rel="preload" as="font" type="font/woff2" crossorigin href="${asset("/fonts/barlow-semi-condensed-700.woff2")}">
${body}

<script>${SCRIPT}</script>
`;

const outDir = path.join(root, "wordpress");
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, "vacarya-call-confirmation.html");
fs.writeFileSync(outFile, html);

console.log(`wrote ${path.relative(root, outFile)}`);
console.log(`  ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`);
console.log(`  ${FAQ.length} FAQ · ${PORTRAIT.length + LANDSCAPE.length} partners · ${CASE_STUDIES.length} case studies`);
console.log(`  ${REVIEWS.length} reviews · ${EARNINGS_COUNT} revenue · assets from ${ASSET_BASE}`);
