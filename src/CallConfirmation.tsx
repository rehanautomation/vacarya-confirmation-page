import { useEffect, useRef, useState, type ReactNode } from "react";


/* -------------------------------------------------------------------------- */
/* Content                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Order here is the on-page arrangement — five rows of two, reading across.
 * Do not reorder: the questions were paired deliberately.
 */
const FAQ_QUESTIONS = [
  { question: "How much does each property cost to set up?", videoId: "t7pTqSqh8LgrPqod" },
  { question: "What is my role in the partnership?", videoId: "Jw0muBm0ZOlXzSrO" },
  { question: "Isn’t Airbnb getting too saturated?", videoId: "KDyAD0prpzmirbAs" },
  { question: "How do you protect against demand changes?", videoId: "6YvUtIN_HUohkWmq" },
  { question: "Why lease instead of buying the property?", videoId: "XC9gtxyFKgZsqtnV" },
  { question: "What happens when the lease ends?", videoId: "jcz7ZkI_OEg9Mhq2" },
  { question: "What about insurance and liability?", videoId: "Ff0GWu5njsWnobjl" },
  { question: "What about Airbnb regulations and city bans?", videoId: "myLcwKZgT5A_Vovr" },
  { question: "How much time does this take each week?", videoId: "p93i6145A9ThBsDv" },
  { question: "How do I know my property will get booked?", videoId: "d7XTmUEtYMBY2e2Q" },
] as const;

/**
 * Step 4 shows each partner's name and location above their video, nothing else.
 *
 * Ten portrait clips run three across; the two landscape clips stack beside the
 * tenth, filling the row it would otherwise leave half empty.
 *
 * Every portrait clip is pinned to a single 177.78% (9:16) box even though the
 * source embeds vary between 176.67% and 177.82%. That spread is under 1% — about
 * 2px at this size — and normalising it means all ten align exactly, which the
 * varied values would not.
 *
 * Name and location are stored apart so each renders on its own line, rather
 * than as one string that wraps wherever the column happens to break.
 */
type Partner = {
  name: string;
  location: string;
  videoId: string;
};

/** 9:16, three per row on desktop. */
const PARTNERS_PORTRAIT: Partner[] = [
  { name: "Josh C.", location: "Hamilton, ON", videoId: "UH3YggU0nB1bDod_" },
  { name: "Rob V.", location: "Toronto, ON", videoId: "VTab9sdlPcnqYsyw" },
  { name: "Andy D.", location: "Nova Scotia", videoId: "WoB8QPzALc0OUKH6" },
  { name: "Fasi K.", location: "Brampton, ON", videoId: "KCxrI1vlcJ71GTP9" },
  { name: "Dennis L.", location: "Cookstown, ON", videoId: "LUuJ8wfnCQ7QS1d3" },
  { name: "Jason L.", location: "Toronto, ON", videoId: "Q7FZIMLXMLWHNdDk" },
  { name: "Kajana D.", location: "Mississauga, ON", videoId: "YMTcLkxOfEPogHig" },
  { name: "Dylan M.", location: "Ancaster, ON", videoId: "C873MB3yzcU4eiHP" },
  { name: "Trevor J.", location: "Toronto", videoId: "WkyXHrLIcfaeY4yr" },
  { name: "Trevor H.", location: "Rockvale, TN", videoId: "pJPnsekIVIAUwxYD" },
];

/** Landscape. These stack beside the last portrait clip on desktop, and each
 *  keeps its own true aspect ratio — forcing them to match would letterbox one
 *  or crop the other. */
const PARTNERS_LANDSCAPE: (Partner & { ratio: number })[] = [
  { name: "Tony G.", location: "Toronto, ON", videoId: "EiwlSXCbZ9Lko_VD", ratio: 56.25 },
  {
    name: "Jessica & James",
    location: "St. Petersburg, FL",
    videoId: "RtMzfq3hSiEqkV8f",
    ratio: 66.67,
  },
];

/** 9:16 — every portrait partner clip renders in this box. */
const PORTRAIT_RATIO = 177.78;

/**
 * Client review screenshots, Step 5. Sizes vary widely — the set runs from 0.35
 * to 1.39 in height-to-width — so they are laid out as a masonry rather than a
 * grid: a grid sizes every row to its tallest item and leaves dead space under
 * the shorter ones.
 *
 * Dimensions are the real pixel sizes of the files and are set on each <img> so
 * the browser reserves the correct space and nothing shifts while they load.
 */
type Review = { src: string; width: number; height: number };

const REVIEWS: Review[] = [
  { src: "/reviews/review-1.webp", width: 800, height: 506 },
  { src: "/reviews/review-2.webp", width: 800, height: 997 },
  { src: "/reviews/review-3.webp", width: 800, height: 1114 },
  { src: "/reviews/review-4.webp", width: 800, height: 441 },
  { src: "/reviews/review-5.webp", width: 800, height: 336 },
  { src: "/reviews/review-6.webp", width: 800, height: 276 },
  { src: "/reviews/review-7.webp", width: 800, height: 399 },
  { src: "/reviews/review-8.webp", width: 800, height: 376 },
  { src: "/reviews/review-9.webp", width: 800, height: 597 },
  { src: "/reviews/review-10.webp", width: 800, height: 389 },
];

/**
 * Revenue screenshots, revealed inside the same card when the reader asks for
 * them. All 28 are identical at 272x444, so a plain grid is right here — equal
 * heights mean no dead space, and none of the masonry packing above is needed.
 *
 * 28 divides evenly by 4 and by 2, so neither breakpoint leaves an orphan row.
 * Four columns also renders each one 261px wide against a 272px source, just
 * under native size, so they stay sharp rather than being upscaled.
 */
const EARNINGS_COUNT = 28;
const EARNING_WIDTH = 272;
const EARNING_HEIGHT = 444;

const EARNINGS = Array.from({ length: EARNINGS_COUNT }, (_, i) => `/revenue/earning-${i + 1}.png`);

const REVIEW_COLUMNS_DESKTOP = 3;
const REVIEW_COLUMNS_MOBILE = 2;
const REVIEW_MOBILE_QUERY = "(max-width: 767px)";

/**
 * Packs reviews into balanced columns, placing the tallest first into whichever
 * column is currently shortest.
 *
 * Ordering by height is what makes the columns finish level. Anything that
 * preserves file order — including a plain CSS multi-column flow, which can only
 * break the sequence in place — leaves one column well short of the others with
 * this set, because two images are roughly three times taller than the rest.
 */
function packColumns(items: Review[], columnCount: number): Review[][] {
  const columns: Review[][] = Array.from({ length: columnCount }, () => []);
  const heights: number[] = new Array(columnCount).fill(0);
  const tallestFirst = [...items].sort((a, b) => b.height / b.width - a.height / a.width);

  for (const item of tallestFirst) {
    let shortest = 0;
    for (let i = 1; i < columnCount; i += 1) {
      if (heights[i] < heights[shortest]) shortest = i;
    }
    columns[shortest].push(item);
    // Relative height: every column renders at the same width.
    heights[shortest] += item.height / item.width;
  }

  return columns;
}

/**
 * The column count has to be known in JS, not just CSS, because the packing
 * above depends on it. Initialised from the media query rather than defaulting,
 * so a phone never paints three columns before correcting itself.
 */
function useReviewColumnCount() {
  const [count, setCount] = useState(() =>
    typeof window !== "undefined" && window.matchMedia(REVIEW_MOBILE_QUERY).matches
      ? REVIEW_COLUMNS_MOBILE
      : REVIEW_COLUMNS_DESKTOP,
  );

  useEffect(() => {
    const query = window.matchMedia(REVIEW_MOBILE_QUERY);
    const apply = () => setCount(query.matches ? REVIEW_COLUMNS_MOBILE : REVIEW_COLUMNS_DESKTOP);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return count;
}


/* -------------------------------------------------------------------------- */
/* Pending inputs — see design_handoff README "Assets" table                    */
/* -------------------------------------------------------------------------- */

/** TODO: real client agreement PDF. */
const AGREEMENT_URL = "#";
/** TODO: real Terms URL. */
const TERMS_URL = "#";
/** TODO: real Privacy URL. */
const PRIVACY_URL = "#";

/* -------------------------------------------------------------------------- */
/* Video                                                                       */
/* -------------------------------------------------------------------------- */

const VIDALYTICS_ACCOUNT = "xWCLYwSv";

/**
 * Injects the Vidalytics loader for one player. The loader is global and the
 * player must only be run once per embed id, so a module-level set guards
 * against React strict-mode double effects and hot reloads.
 */
const initializedEmbeds = new Set<string>();

function loadVidalytics(videoId: string) {
  const embedId = `vidalytics_embed_${videoId}`;
  if (initializedEmbeds.has(embedId)) return;
  initializedEmbeds.add(embedId);

  const baseUrl = `https://fast.vidalytics.com/embeds/${VIDALYTICS_ACCOUNT}/${videoId}/`;
  const script = document.createElement("script");
  script.type = "text/javascript";
  // Vidalytics' own loader snippet, verbatim from the embed code.
  script.text = `(function (v, i, d, a, l, y, t, c, s) {
 y='_'+d.toLowerCase();c=d+'L';if(!v[d]){v[d]={};}if(!v[c]){v[c]={};}if(!v[y]){v[y]={};}var vl='Loader',vli=v[y][vl],vsl=v[c][vl + 'Script'],vlf=v[c][vl + 'Loaded'],ve='Embed';
 if (!vsl){vsl=function(u,cb){
  if(t){cb();return;}s=i.createElement("script");s.type="text/javascript";s.async=1;s.src=u;
  if(s.readyState){s.onreadystatechange=function(){if(s.readyState==="loaded"||s.readyState=="complete"){s.onreadystatechange=null;vlf=1;cb();}};}else{s.onload=function(){vlf=1;cb();};}
  i.getElementsByTagName("head")[0].appendChild(s);
 };}
 vsl(l+'loader.min.js',function(){if(!vli){var vlc=v[c][vl];vli=new vlc();}vli.loadScript(l+'player.min.js',function(){var vec=v[d][ve];t=new vec();t.run(a);});});
})(window, document, 'Vidalytics', '${embedId}', '${baseUrl}');`;
  document.body.appendChild(script);
}

/**
 * A live Vidalytics player. Below-the-fold players stay unloaded until they
 * approach the viewport — the page carries 24 embeds once all assets land.
 *
 * `ratio` is the padding-top percentage that reserves the player's box before it
 * loads: 56.25 for 16:9, 177.78 for 9:16. Defaults to 16:9.
 */
function VidalyticsVideo({
  videoId,
  eager = false,
  ratio = 56.25,
}: {
  videoId: string;
  eager?: boolean;
  ratio?: number;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (eager) {
      loadVidalytics(videoId);
      return;
    }
    const node = mountRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      loadVidalytics(videoId);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadVidalytics(videoId);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [videoId, eager]);

  return (
    <div ref={mountRef} className="vcc-video">
      <div
        id={`vidalytics_embed_${videoId}`}
        className="vcc-video-mount"
        style={{ paddingTop: `${ratio}%` }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Section shell                                                               */
/* -------------------------------------------------------------------------- */

function SectionCard({
  title,
  bodyClassName,
  children,
}: {
  title: string;
  bodyClassName: string;
  children: ReactNode;
}) {
  return (
    <section className="vcc-card">
      <h2 className="vcc-card__header">{title}</h2>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

/**
 * Reserves a 16:9 slot for a video that hasn't been supplied yet. Dev-only —
 * delete each one as its embed lands, and the component with the last of them.
 */
function VideoSlot({ label }: { label: string }) {
  return (
    <div className="vcc-slot">
      <span className="vcc-slot__label">{label}</span>
    </div>
  );
}

/** Name on the first line, location on the second — never split mid-location by
 *  the column width. */
function PartnerName({ name, location }: { name: string; location: string }) {
  return (
    <p className="vcc-partner__name">
      - {name}
      <br />
      {location}
    </p>
  );
}

function Divider() {
  return (
    <div className="vcc-divider" aria-hidden="true">
      |
    </div>
  );
}

function VideoCaption({ children }: { children: ReactNode }) {
  return (
    <p className="vcc-caption">
      <strong>Important:</strong> <span>{children}</span>
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

export default function CallConfirmationPage() {
  const reviewColumns = useReviewColumnCount();
  const [showEarnings, setShowEarnings] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if ("scrollRestoration" in history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />

      <main className="vcc-page">
        <div className="vcc-container">
          {/* Hero */}
          <header className="vcc-hero">
            <h1 className="vcc-hero__title">
              <svg
                viewBox="0 0 24 24"
                width="41"
                height="41"
                aria-hidden="true"
                className="vcc-check"
              >
                <circle cx="12" cy="12" r="12" fill="#00ABE5" />
                <path
                  d="M6.6 12.4 L10.2 16 L17.4 8.5"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Your Call Is Confirmed!
            </h1>
            <p className="vcc-hero__body">
              We look forward to speaking with you during your scheduled time!
            </p>
            <p className="vcc-hero__body vcc-hero__body--tight">
              Before your call,{" "}
              <span className="vcc-underline">make sure you watch the videos on this page.</span>{" "}
              They&rsquo;re an important part of the process and will give you the context you need,
              so when we speak we can build on that and get into how this would actually apply to
              you.
            </p>
            <p className="vcc-hero__body vcc-hero__body--tight">
              <strong>
                Expect a quick call or text from +1 (302) 566 0034 prior to your scheduled call from
                a member of our advisory team.
              </strong>
            </p>
          </header>

          <div className="vcc-hero-spacer" />

          {/* Step 1 */}
          <SectionCard title="Step 1: Call Confirmation" bodyClassName="vcc-body vcc-body--wide">
            <VidalyticsVideo videoId="1bPO1F19aT_fHl5g" eager />
            <VideoCaption>
              Make sure to add this call to your calendar and ensure your spouse/business partner is
              available for this time
            </VideoCaption>
          </SectionCard>

          <Divider />

          {/* Step 2 */}
          <SectionCard title="Step 2: How It All Works" bodyClassName="vcc-body vcc-body--wide">
            <VidalyticsVideo videoId="gdS3zkX56PY3q7QX" />
            <VideoCaption>
              Make sure to add this call to your calendar and ensure your spouse/business partner is
              available for this time
            </VideoCaption>
          </SectionCard>

          <Divider />

          {/* Step 3 */}
          <SectionCard title="Step 3: Get Your Questions Answered" bodyClassName="vcc-body vcc-faq">
            {FAQ_QUESTIONS.map(({ question, videoId }) => (
              <div key={videoId} className="vcc-faq__item">
                <h3 className="vcc-faq__question">{question}</h3>
                <VidalyticsVideo videoId={videoId} />
              </div>
            ))}
          </SectionCard>

          <Divider />

          {/* Step 4 */}
          <SectionCard title="Step 4: Hear From Our Partners" bodyClassName="vcc-body vcc-partners">
            <div className="vcc-partners__grid">
              {PARTNERS_PORTRAIT.map(({ name, location, videoId }) => (
                <div key={videoId} className="vcc-partner">
                  <PartnerName name={name} location={location} />
                  <VidalyticsVideo videoId={videoId} ratio={PORTRAIT_RATIO} />
                </div>
              ))}
              {/* Spans the two columns beside the tenth portrait clip on desktop,
                  and the full width once the grid drops to two columns. */}
              <div className="vcc-partners__stack">
                {PARTNERS_LANDSCAPE.map(({ name, location, videoId, ratio }) => (
                  <div key={videoId} className="vcc-partner-wide">
                    <PartnerName name={name} location={location} />
                    <VidalyticsVideo videoId={videoId} ratio={ratio} />
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          <Divider />

          {/* Step 5 */}
          <SectionCard
            title="Step 5: Reviews & Written Wins"
            bodyClassName="vcc-body vcc-step5"
          >
            <div className="vcc-reviews">
              {packColumns(REVIEWS, reviewColumns).map((column, index) => (
                <div key={index} className="vcc-reviews__column">
                  {column.map((review) => (
                    <img
                      key={review.src}
                      className="vcc-review"
                      src={review.src}
                      width={review.width}
                      height={review.height}
                      alt="Client review"
                      loading="lazy"
                      decoding="async"
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* The button is replaced by the screenshots rather than kept above
                them, so the expanded card simply ends after the last image. */}
            {showEarnings ? (
              <div className="vcc-earnings">
                {EARNINGS.map((src) => (
                  <img
                    key={src}
                    className="vcc-earning"
                    src={src}
                    width={EARNING_WIDTH}
                    height={EARNING_HEIGHT}
                    alt="Client revenue"
                    loading="lazy"
                    decoding="async"
                  />
                ))}
              </div>
            ) : (
              <button
                type="button"
                className="vcc-more"
                onClick={() => setShowEarnings(true)}
                aria-expanded={false}
              >
                More Client Numbers
              </button>
            )}
          </SectionCard>

          <Divider />

          {/* Bonus */}
          <SectionCard
            title="Bonus: Recent Case Studies"
            bodyClassName="vcc-body vcc-case-studies"
          >
            {/* TODO: replace both with <VidalyticsVideo videoId="..." /> once the
                embeds land. */}
            <VideoSlot label="Case study 1" />
            <VideoSlot label="Case study 2" />
          </SectionCard>
        </div>

        {/*
          Deliberately not a section card: no blue banner, no white panel. A dark
          full-bleed band with one bordered panel floating in it, so the last
          thing before the footer reads as a distinct moment rather than a
          seventh card.
        */}
        <section className="vcc-agreement">
          <div className="vcc-agreement__panel">
            <p className="vcc-agreement__eyebrow">Want to review our agreement before our call?</p>
            <h2 className="vcc-agreement__title">Review Client Agreement</h2>
            <p className="vcc-agreement__body">
              We pride ourselves on transparency and communication. Please take some time to review
              our client agreement ahead of our call so you know exactly what to expect. The last
              thing we want is an agreement getting in the way of us building a business together.
              If you have any questions, please bring them to our call together and we can address
              them one by one!
            </p>
            <a className="vcc-agreement__cta" href={AGREEMENT_URL} target="_blank" rel="noopener">
              Download Client Agreement
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="vcc-footer">
          <div className="vcc-footer__inner">
            <img
              className="vcc-footer__logo"
              src="/Vacarya-White-e1762058976289.png"
              alt="Vacarya"
              width={876}
              height={751}
            />
            <p className="vcc-footer__links">
              <a href={TERMS_URL}>TERMS</a> | <a href={PRIVACY_URL}>PRIVACY</a>
            </p>
            <p className="vcc-footer__copy">
              All rights reserved 2026. This program is brought to you and copyrighted by Vacarya LP
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Styles                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Every value below is measured from budgetdogacademy.com/call-confirmation via
 * getComputedStyle — this page is a deliberate replica of theirs and the founder
 * wants it exact. Do not "tidy" these numbers: they are what BudgetDog renders.
 *
 * Three faces, matching theirs:
 *   Barlow Semi Condensed — headlines, hero copy, section headers, CTA
 *   Barlow                — FAQ questions, captions, footer
 *   Montserrat 800        — testimonial quotes only
 *
 * The only intentional deviations from BudgetDog are the brand color (their
 * yellow → our blue) and Vacarya's copy.
 */
const PAGE_CSS = `
html:has(.vcc-page),
body:has(.vcc-page) {
  background: #fbfbfb;
}

.vcc-page {
  background: #fbfbfb;
  color: #000000;
  font-family: 'Barlow', Helvetica, Arial, sans-serif;
  padding: 53.3px 0 0;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

.vcc-page a { color: #00ABE5; text-decoration: none; }
.vcc-page a:hover { color: #0090c2; }

.vcc-container {
  width: 100%;
  max-width: 1146.7px;
  margin: 0 auto;
  padding: 0 13.3px;
  box-sizing: border-box;
}

/* Hero -------------------------------------------------------------------- */

.vcc-hero { max-width: 749px; margin: 0 auto; }

/* BudgetDog: Barlow Semi Condensed 44px/57.2px. The weight and italic live on an
   inner <strong><em> in their markup, so the rendered text is 700 italic. */
.vcc-hero__title {
  margin: 0;
  font-family: 'Barlow Semi Condensed', Helvetica, Arial, sans-serif;
  font-weight: 700;
  font-style: italic;
  font-size: 44px;
  line-height: 57.2px;
  text-align: center;
  color: #000000;
  text-wrap: balance;
}

.vcc-check { vertical-align: -5px; margin-right: 9px; }

/* BudgetDog: Barlow Semi Condensed 22px, normal line-height, #140c0c, left. */
.vcc-hero__body {
  margin: 24px 0 0;
  font-family: 'Barlow Semi Condensed', Helvetica, Arial, sans-serif;
  font-size: 22px;
  line-height: normal;
  font-weight: 400;
  color: #140c0c;
  text-align: center;
}

.vcc-hero__body--tight { margin-top: 26px; }
.vcc-hero__body strong { font-weight: 700; }
.vcc-underline { text-decoration: underline; }

.vcc-hero-spacer { height: 40.7px; }

/* Section card ------------------------------------------------------------ */

/* BudgetDog: radius 10px, shadow 0 1px 5px rgba(0,0,0,0.2). */
.vcc-card {
  display: block;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

/* BudgetDog: Barlow Semi Condensed 34px/44.2px, uppercase. Their inner
   <strong><span style="color:var(--black)"> carries the weight and color, so the
   rendered header is 700 and BLACK. Only the background differs (yellow → blue). */
.vcc-card__header {
  margin: 0;
  background: #00ABE5;
  color: #000000;
  font-family: 'Barlow Semi Condensed', Helvetica, Arial, sans-serif;
  font-weight: 700;
  font-size: 34px;
  line-height: 44.2px;
  letter-spacing: normal;
  text-transform: uppercase;
  text-align: center;
  /* Their bar measures 84px tall against a 44.2px line box → 19.9px each side. */
  padding: 19.9px 16px;
}

.vcc-body { padding: 20.7px 11.3px 22.7px; }
.vcc-body--wide { padding: 20.7px 35.3px 27.3px; }

/* BudgetDog renders the between-card divider as a literal "|" glyph, not a
   drawn box: Barlow Semi Condensed 32px/41.6px, weight 500, 15% grey. */
.vcc-divider {
  /* Measured: 20px from the card above to the glyph, 20px to the card below. */
  margin: 20px auto;
  font-family: 'Barlow Semi Condensed', Helvetica, Arial, sans-serif;
  font-size: 32px;
  line-height: 41.6px;
  font-weight: 500;
  color: rgba(47, 47, 47, 0.15);
  text-align: center;
  user-select: none;
}

/* Video ------------------------------------------------------------------- */

.vcc-video { width: 100%; }

.vcc-video-mount {
  width: 100%;
  position: relative;
  padding-top: 56.25%;
}

/* BudgetDog: Barlow 20px, with "Important:" as bold italic. */
.vcc-caption {
  margin: 10.7px 0 0;
  font-family: 'Barlow', Helvetica, Arial, sans-serif;
  font-size: 20px;
  line-height: normal;
  text-align: center;
  color: #000000;
}

.vcc-caption strong { font-weight: 700; font-style: italic; }
.vcc-caption span { font-style: italic; }

/* Step 3 — FAQ grid ------------------------------------------------------- */

/* Measured: 10px side padding, 10px gap → two 545px columns in a 1120px card.
   Row gap 40px matches their video-bottom-to-next-question distance exactly. */
.vcc-faq {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 10px;
  row-gap: 40px;
  padding: 20.7px 10px 22.7px;
}

/*
 * Each cell spans two row tracks with subgrid, so every question in a row shares
 * one track and the videos beneath them start at the same y — they stay aligned
 * even if a question wraps. Same technique as the testimonials below.
 */
.vcc-faq__item {
  grid-row: span 2;
  display: grid;
  grid-template-rows: subgrid;
  row-gap: 0;
}

/* BudgetDog: Barlow 24px, centered, single line. Their <strong> wrapper makes
   the rendered weight 700. */
.vcc-faq__question {
  margin: 0;
  font-family: 'Barlow', Helvetica, Arial, sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: normal;
  text-align: center;
  color: #000000;
}

/* Step 4 — partner videos ------------------------------------------------ */

/*
 * One grid holds everything. Ten portrait clips (9:16) flow three across, which
 * leaves the tenth alone on the last row; the two landscape clips sit in a
 * stack that spans the two free columns beside it. That fills the last row
 * instead of stranding one clip in the middle with a separate row underneath.
 *
 * Portrait video is mobile-native, so on desktop the constraint is height, not
 * width: two columns would make each clip 537×955px, taller than the usable
 * viewport on a typical laptop. Three gives 353×628, the largest that still fits
 * on screen.
 *
 * Spacing is uniform: side padding equals the column gap (15px), so the space
 * outside the outer videos matches the space between them. Row gap is larger
 * (40px) because each row carries a name above its video.
 *
 * Each portrait partner is a subgrid unit spanning the name track and the video
 * track, so names sharing a row share a height and every video in that row
 * starts at the same y, even when a name runs long.
 */
.vcc-partners {
  padding: 38px 15px 24px;
}

.vcc-partners__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 15px;
  row-gap: 40px;
}

.vcc-partner {
  display: grid;
  grid-row: span 2;
  grid-template-rows: subgrid;
  row-gap: 0;
}

/*
 * The landscape pair occupies the two columns left free by the tenth portrait
 * clip. Its width is capped so the two stacked clips plus their names come out
 * the same height as the portrait clip beside them — at full span they would
 * overshoot it by roughly 300px and leave the row visibly ragged.
 */
.vcc-partners__stack {
  grid-column: span 2;
  grid-row: span 2;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 444px;
  margin: 0 auto;
}

/* Montserrat 800 is used for these names only — nothing else on the page uses
   this face. */
.vcc-partner__name {
  margin: 0 0 6px;
  font-family: 'Montserrat', Helvetica, Arial, sans-serif;
  font-weight: 800;
  font-size: 20px;
  line-height: 26px;
  font-style: italic;
  text-align: center;
  color: #000000;
}

/* Step 5 — reviews ---------------------------------------------------------- */

/*
 * Masonry. Flex columns rather than a grid, because the screenshots range from
 * 0.35 to 1.39 in height-to-width and a grid would size each row to its tallest
 * item, leaving dead space beneath the rest. Columns are equal width and fill
 * independently, so images keep their natural height and nothing is padded out.
 *
 * Equal-flex columns mean the count is whatever packColumns produced — three on
 * desktop, two below 767px — with no column-count to keep in sync here.
 *
 * Gaps match the partner grid above (15px) so the two sections read as one page.
 */
/* Padding lives on the card body so the masonry, the button and the revenue
   grid all share one set of edges. */
.vcc-step5 {
  padding: 38px 15px 24px;
}

.vcc-reviews {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.vcc-reviews__column {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* The screenshots are mostly white, so they need an edge against the white card. */
.vcc-review {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
}

/*
 * Reveal control. Takes the section header's treatment — Barlow Semi Condensed,
 * uppercase, black on brand blue — so it reads as part of the page rather than a
 * bolted-on control, at the CTA's 5px radius rather than the card's 10px.
 *
 * Exactly one review column wide and centred, which on the three-column desktop
 * grid places it under the middle column. Derived from the same track maths as
 * the grid, so it follows if the gap or padding ever changes.
 */
.vcc-more {
  display: block;
  width: calc((100% - 30px) / 3);
  margin: 30px auto 6px;
  padding: 16px 20px 18px;
  border: 0;
  border-radius: 5px;
  background: #00ABE5;
  color: #000000;
  font-family: 'Barlow Semi Condensed', Helvetica, Arial, sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 1.1;
  text-transform: uppercase;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.vcc-more:hover { background: #0090c2; }
.vcc-more:focus-visible { outline: 3px solid #000000; outline-offset: 3px; }

/*
 * All 28 revenue screenshots are the same 272x444, so a plain grid suits them —
 * equal heights leave no dead space. Four columns divides 28 evenly and renders
 * each 261px against a 272px source, just under native size.
 */
.vcc-earnings {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-top: 30px;
}

.vcc-earning {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
}

/* Bonus — case studies ------------------------------------------------------ */

.vcc-case-studies {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  padding: 38px 15px 24px;
}

/* Dev-only slot for a video still to come. */
.vcc-slot {
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ededed;
  border: 1px dashed #c7c7c7;
  border-radius: 4px;
}

.vcc-slot__label {
  font-family: 'Barlow', Helvetica, Arial, sans-serif;
  font-weight: 700;
  font-size: 17px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #5a5a5a;
}

/* Agreement ----------------------------------------------------------------- */

/*
 * The one section on the page that is not a card. A dark full-bleed band with a
 * single bordered panel floating inside it, so the last beat before the footer
 * lands as its own moment.
 *
 * Colours are the brand blue's own hue taken down to near-black for the band and
 * the panel, which keeps the accent reading as light rather than as a stripe of
 * unrelated colour. The band is a shade off the pure-black footer beneath it so
 * the two stay distinct.
 */
.vcc-agreement {
  background: #041C25;
  padding: 72px 13.3px;
}

.vcc-agreement__panel {
  max-width: 940px;
  margin: 0 auto;
  padding: 48px 52px 52px;
  background: #0A2C38;
  border: 1px solid #00ABE5;
  border-radius: 16px;
  box-sizing: border-box;
}

.vcc-agreement__eyebrow {
  margin: 0;
  font-family: 'Barlow Semi Condensed', Helvetica, Arial, sans-serif;
  font-weight: 500;
  font-size: 19px;
  line-height: 1.3;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.72);
}

.vcc-agreement__title {
  margin: 14px 0 0;
  font-family: 'Barlow Semi Condensed', Helvetica, Arial, sans-serif;
  font-weight: 700;
  font-size: 56px;
  line-height: 1.05;
  color: #00ABE5;
}

.vcc-agreement__body {
  margin: 24px 0 0;
  font-family: 'Barlow', Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 30px;
  color: rgba(255, 255, 255, 0.86);
}

/* Same treatment as the reveal button, so the page has one button language. */
.vcc-agreement__cta {
  display: inline-block;
  margin: 34px 0 0;
  padding: 16px 30px 18px;
  border-radius: 5px;
  background: #00ABE5;
  font-family: 'Barlow Semi Condensed', Helvetica, Arial, sans-serif;
  font-weight: 700;
  font-size: 22px;
  line-height: 1.1;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  transition: background-color 0.15s ease;
}

.vcc-page .vcc-agreement__cta { color: #000000; text-decoration: none; }
.vcc-page .vcc-agreement__cta:hover { background: #4fc9f0; color: #000000; }

/* Footer ------------------------------------------------------------------ */

/*
 * BudgetDog's footer is a full-bleed black band (padding 20px 0 30px) carrying
 * white text, which is what separates it from the page above. Type is Barlow:
 * links 20px/700 white, copy and disclaimer 16px/400 at 42% white, all centered.
 */
.vcc-footer {
  background: #000000;
  padding: 20px 0 30px;
  /* No top margin: the agreement band sits directly above and a gap here would
     show the light page background as a seam between the two dark areas. */
  font-family: 'Barlow', Helvetica, Arial, sans-serif;
}

.vcc-footer__inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 15px;
  text-align: center;
  box-sizing: border-box;
}

/* Sized by height so the near-square mark (876×751) stays proportionate above
   the links. Sits on the black band, which the PNG's transparency relies on. */
.vcc-footer__logo {
  display: block;
  height: 110px;
  width: auto;
  margin: 0 auto 18px;
}

.vcc-footer__links {
  margin: 0;
  font-size: 20px;
  line-height: normal;
  font-weight: 700;
  color: #ffffff;
}

.vcc-page .vcc-footer__links a { color: #ffffff; text-decoration: none; }
.vcc-page .vcc-footer__links a:hover { color: #ffffff; text-decoration: underline; }

.vcc-footer__copy {
  margin: 16px 0 0;
  font-size: 16px;
  line-height: normal;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.42);
}


/* Responsive --------------------------------------------------------------
 * Measured from BudgetDog at 390 / 640 / 767 / 768. They use two breakpoints:
 *
 *   767px — grids collapse to one column (at 768 they are still two-up)
 *   480px — headline type steps down; everything above 480 stays desktop-sized
 *
 * The important finding is what does NOT change: their FAQ questions stay 24px
 * and their testimonial quotes stay 20px/26px at every width. Only the H1,
 * section headers and hero copy scale. Do not add size overrides for the
 * question or quote here — that would break parity with their mobile.
 */

@media (max-width: 767px) {
  .vcc-faq { grid-template-columns: 1fr; row-gap: 28px; }
  .vcc-faq__item { display: block; }

  /* Portrait clips step down to three across; landscape stays two-up. Qualified
     with .vcc-body because both classes sit on the same element and the
     .vcc-body mobile padding below would otherwise win on source order. */
  /* Two across rather than three: ten splits evenly into 2 or 5 columns only, and
     three would leave a single orphan on the last row. */
  .vcc-body.vcc-partners { padding: 24px 15px 20px; }
  /* Two portrait clips across; the landscape stack then spans both columns at
     full width, so it needs no cap here. */
  .vcc-partners__grid { grid-template-columns: repeat(2, 1fr); row-gap: 28px; }
  .vcc-partners__stack { max-width: none; gap: 28px; }

  /* Two columns here comes from packColumns, not CSS — this only tightens the
     gaps to match the rest of the page at this width. */
  .vcc-body.vcc-step5 { padding: 24px 15px 20px; }
  .vcc-reviews { gap: 12px; }
  .vcc-reviews__column { gap: 12px; }

  /* Two columns here, so one column wide would leave the button off-centre —
     it takes a comfortable share of the width instead. */
  .vcc-more { width: 100%; max-width: 340px; font-size: 21px; }
  .vcc-earnings { grid-template-columns: repeat(2, 1fr); gap: 12px; }

  .vcc-body.vcc-case-studies { padding: 24px 15px 20px; gap: 12px; }

  .vcc-agreement { padding: 52px 15px; }
  .vcc-agreement__panel { padding: 36px 32px 40px; }
  .vcc-agreement__title { font-size: 40px; }
}

@media (max-width: 480px) {
  /* Measured: H1 32px/41.6px, section header 22px/28.6px, hero copy 18px, and
     every card full-bleed at the viewport width (390px at 390px) — so the
     container loses its side padding and the hero keeps its own. */
  .vcc-page { padding-top: 32px; }
  .vcc-container { padding: 0; }
  .vcc-hero { padding: 0 10px; }

  .vcc-hero__title { font-size: 32px; line-height: 41.6px; }
  .vcc-check { width: 30px; height: 30px; vertical-align: -4px; margin-right: 7px; }
  .vcc-hero__body { margin-top: 18px; font-size: 18px; }
  .vcc-hero__body--tight { margin-top: 20px; }
  .vcc-hero-spacer { height: 28px; }

  .vcc-card__header { font-size: 22px; line-height: 28.6px; padding: 16px 12px; }

  .vcc-body { padding: 16px 10px 18px; }
  .vcc-body--wide { padding: 16px 12px 20px; }
  /* Their FAQ video is 370px at 10px inset in a 390px card. */
  .vcc-body.vcc-faq { padding: 16px 10px 18px; }

  /* Two portrait clips still read well side by side on a phone; the landscape
     pair stacks, since two 16:9 boxes at half a phone width are unwatchable. */
  .vcc-body.vcc-partners { padding: 16px 10px 20px; }
  .vcc-partners__grid { grid-template-columns: repeat(2, 1fr); column-gap: 10px; }
  .vcc-partner__name { font-size: 16px; line-height: 21px; }

  .vcc-body.vcc-step5 { padding: 16px 10px 20px; }
  .vcc-reviews { gap: 10px; }
  .vcc-reviews__column { gap: 10px; }
  .vcc-more { font-size: 19px; padding: 14px 14px 16px; }
  .vcc-earnings { gap: 10px; }

  /* Two 16:9 slots side by side on a phone are unwatchable, so they stack. */
  .vcc-body.vcc-case-studies { grid-template-columns: 1fr; padding: 16px 10px 20px; gap: 10px; }

  .vcc-agreement { padding: 40px 10px; }
  .vcc-agreement__panel { padding: 28px 20px 32px; border-radius: 12px; }
  .vcc-agreement__eyebrow { font-size: 16px; letter-spacing: 0.1em; }
  .vcc-agreement__title { font-size: 32px; }
  .vcc-agreement__body { font-size: 17px; line-height: 25px; }
  .vcc-agreement__cta { font-size: 18px; padding: 14px 22px 16px; }


  .vcc-footer__inner { padding: 0 10px; }
  .vcc-footer__logo { height: 84px; margin-bottom: 14px; }
  .vcc-footer__links { font-size: 18px; }
  .vcc-footer__copy { font-size: 14px; }
}
`;
