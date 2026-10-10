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
 * Step 4 shows each partner's name above their video and nothing else. The city
 * line is gone: it cost a second line on every card and was not something a
 * viewer weighs. Names are a first name plus a last initial throughout.
 *
 * All 22 clips are portrait and share one 177.78% (9:16) box, so the grid is even
 * and every row lines up. The two landscape clips this section used to carry, and
 * the side stack built to hold them, are gone — both were reshot vertical.
 *
 * Two embed snippets are in play. The older clips use Vidalytics' self-contained
 * loader; the newer ones use its player.settings.json form, which fetches the
 * player config itself and then waits for the player to exist. `loader: "settings"`
 * marks the latter. Both run on the same page — see loadVidalytics below.
 */
type Partner = {
  name: string;
  videoId: string;
  loader?: "settings";
};

/** The first eleven are in a deliberate order; the rest follow in any order. */
const PARTNERS: Partner[] = [
  { name: "Josh C.", videoId: "UH3YggU0nB1bDod_" },
  { name: "Patricia G.", videoId: "9ZMBSpvLpcRNeL8m", loader: "settings" },
  { name: "Helen Q.", videoId: "_3LhJcZabSuVtAqn", loader: "settings" },
  { name: "Rob V.", videoId: "AT3E6HoGHbMxB4ug", loader: "settings" },
  { name: "Ravi R.", videoId: "d6GhhPiwXRTZIh55", loader: "settings" },
  { name: "Mike E.", videoId: "S2udtgRr3weGPAMJ", loader: "settings" },
  { name: "Sajeed A.", videoId: "o9Ho5JnqweHAsKkj", loader: "settings" },
  { name: "Kevin M.", videoId: "AtKNDCr00S_Yyh0G", loader: "settings" },
  { name: "John S.", videoId: "TBDybqUkvVpuF5cy", loader: "settings" },
  { name: "Devang B.", videoId: "BEIWJ7hHIaXtj5E9", loader: "settings" },
  { name: "Greg L.", videoId: "O6XYSCu2jX0XvhUf", loader: "settings" },
  { name: "Andy D.", videoId: "WoB8QPzALc0OUKH6" },
  { name: "Kajana D.", videoId: "YMTcLkxOfEPogHig" },
  { name: "Fasi K.", videoId: "KCxrI1vlcJ71GTP9" },
  { name: "Dylan M.", videoId: "C873MB3yzcU4eiHP" },
  { name: "Jason L.", videoId: "Q7FZIMLXMLWHNdDk" },
  { name: "Dennis L.", videoId: "LUuJ8wfnCQ7QS1d3" },
  { name: "Trevor J.", videoId: "WkyXHrLIcfaeY4yr" },
  { name: "Trevor H.", videoId: "pJPnsekIVIAUwxYD" },
  { name: "Gaurav D.", videoId: "5KPTZEDzewMmOnXu", loader: "settings" },
  { name: "Tony G.", videoId: "cWgx4DGVi2lkzUK4", loader: "settings" },
  { name: "Jessica", videoId: "zx8wRA3vo22fIHNK", loader: "settings" },
];

/** 9:16 — every partner clip renders in this box. */
const PORTRAIT_RATIO = 177.78;

/**
 * Bonus card. Two landscape clips, stacked so each gets a full-width slot.
 *
 * These carry a headline rather than the bare name used in Step 4:
 * a case study is sold by its result, and the person is named inside the line.
 */
const CASE_STUDIES: { title: string; videoId: string }[] = [
  {
    title: "Two Years Ago, Kajana Was Let Go. Today, She Runs 21 Airbnb Properties.",
    videoId: "r8cg1w54h5ld2Yqh",
  },
  {
    title: "How We Took Patricia From 1 to 13 Properties in Under One Year",
    videoId: "Giqo4Xgx53dNyznB",
  },
];

/**
 * Client review screenshots, Step 5.
 *
 * Order is deliberate and is the ranking: most persuasive to a reader who has
 * booked but not committed, first. The ranking weighs, in order, a concrete
 * number of units or a before/after ("1 unit to 13"), a named objection the
 * writer had and got past, operational detail only a real partner would know,
 * and length. Generic praise with no number ranks last however warm it is.
 *
 * The packer below fills columns in this order, so the top of the three desktop
 * columns is ranks 1-3 and nothing strong is buried at the bottom of the card.
 * Reordering this array is all it takes to re-rank them.
 *
 * Sizes vary widely — the set runs from 0.35 to 2.54 in height-to-width — so they
 * are laid out as a masonry rather than a grid: a grid sizes every row to its
 * tallest item and leaves dead space under the shorter ones.
 *
 * Dimensions are the real pixel sizes of the files and are set on each <img> so
 * the browser reserves the correct space and nothing shifts while they load.
 */
type Review = { src: string; width: number; height: number };

const REVIEWS: Review[] = [
  // Devang — 4 units since 2024, multiple five-figure months, and the only one
  // that names the overwhelm a prospect feels and then answers it.
  { src: "/reviews/review-20.webp", width: 786, height: 1999 },
  // Andy — 25 units, plus an E-2 visa out of the process.
  { src: "/reviews/review-14.webp", width: 800, height: 348 },
  // Patricia — 1 unit to 13 in under a year.
  { src: "/reviews/review-4.webp", width: 800, height: 441 },
  // Rob — 0 to 15 properties, all run remotely.
  { src: "/reviews/review-15.webp", width: 800, height: 414 },
  // John — career investor, moving money out of other holdings to put it here.
  { src: "/reviews/review-13.webp", width: 800, height: 823 },
  // Shawn — "on the fence at the beginning", then two US properties.
  { src: "/reviews/review-2.webp", width: 800, height: 997 },
  // Kajana — long, specific on the weekly calls and the confidence gained.
  { src: "/reviews/review-3.webp", width: 800, height: 1114 },
  // Sajeed — 2 units in St. Louis run from Canada; answers "can I do this remotely".
  { src: "/reviews/review-12.webp", width: 800, height: 416 },
  // Mike — 7 units since May.
  { src: "/reviews/review-11.webp", width: 800, height: 342 },
  // Fasi — detailed on the process, no numbers.
  { src: "/reviews/review-9.webp", width: 800, height: 597 },
  // Gaurav — 3 units, early, and candid that it is early. Credible for that.
  { src: "/reviews/review-17.webp", width: 800, height: 942 },
  // Aaron — 2 units live as planned; carries Trustpilot's "Unprompted" badge.
  { src: "/reviews/review-1.webp", width: 800, height: 506 },
  // Ravi — several US units, launched fast.
  { src: "/reviews/review-18.webp", width: 800, height: 411 },
  // Jesenia — "didn't have to lift a finger".
  { src: "/reviews/review-10.webp", width: 800, height: 389 },
  // Dharmesh — community and growth, no figures.
  { src: "/reviews/review-7.webp", width: 800, height: 399 },
  // Rob S. — setup and operations.
  { src: "/reviews/review-5.webp", width: 800, height: 336 },
  // Denis — short, no stress, no numbers.
  { src: "/reviews/review-8.webp", width: 800, height: 376 },
  // Greg — support and group calls only.
  { src: "/reviews/review-16.webp", width: 800, height: 314 },
  // H Quinn — warm but entirely general.
  { src: "/reviews/review-19.webp", width: 800, height: 477 },
  // Fast Moving Homes — two lines, no specifics.
  { src: "/reviews/review-6.webp", width: 800, height: 276 },
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

const EARNINGS = Array.from({ length: EARNINGS_COUNT }, (_, i) => `/revenue/earning-${i + 1}.webp`);

const REVIEW_COLUMNS_DESKTOP = 3;
const REVIEW_COLUMNS_MOBILE = 2;
const REVIEW_MOBILE_QUERY = "(max-width: 767px)";

/**
 * Fills columns from the ranked order above, always adding the next review to
 * whichever column is currently shortest.
 *
 * This used to sort tallest-first, which balanced the columns beautifully and
 * threw the ranking away — the longest screenshots led regardless of what they
 * said. Taking them in rank order instead puts ranks 1-3 at the top of the three
 * columns, and the shortest-column rule still lands the columns within about a
 * fifth of a column height of each other across this set.
 */
function packColumns(items: Review[], columnCount: number): Review[][] {
  const columns: Review[][] = Array.from({ length: columnCount }, () => []);
  const heights: number[] = new Array(columnCount).fill(0);

  for (const item of items) {
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

const AGREEMENT_URL = "/Vacarya-Partnership-Agreement.pdf";
/** TODO: real Terms URL. */
const TERMS_URL = "https://hostvacarya.com/termsofservice/";
/** TODO: real Privacy URL. */
const PRIVACY_URL = "https://hostvacarya.com/privacy/";

/* -------------------------------------------------------------------------- */
/* Video                                                                       */
/* -------------------------------------------------------------------------- */

const VIDALYTICS_ACCOUNT = "xWCLYwSv";

/**
 * Runs one Vidalytics player. The loader is global and a player must only be run
 * once per embed id, so a module-level set guards against React strict-mode
 * double effects and hot reloads.
 *
 * Vidalytics issues two different embed snippets and this page carries both.
 *
 *   "classic"  — the self-contained loader. It fetches loader.min.js and
 *                player.min.js itself, then runs the embed.
 *   "settings" — fetches player.settings.json, hands the result to
 *                window._vidalytics.embeds[id], then waits for the player class
 *                to exist and runs the embed against it.
 *
 * The second kind never fetches the player: it polls for it once a second and
 * relies on something else on the page having pulled it in. Step 1's video is
 * classic and eager, so in practice it always arrives — but a page that lost
 * every classic embed would leave all 13 of these spinning forever. ensurePlayer
 * below removes that dependency by loading the two scripts itself, without
 * running anything, which is safe to do alongside the classic snippet.
 */
const initializedEmbeds = new Set<string>();

const embedUrl = (videoId: string) =>
  `https://fast.vidalytics.com/embeds/${VIDALYTICS_ACCOUNT}/${videoId}/`;

/** Loads loader.min.js then player.min.js, once per page. Resolves when the
 *  player class is defined. Does not run any embed. */
let playerLoading: Promise<void> | null = null;

function ensurePlayer(videoId: string): Promise<void> {
  if (playerLoading) return playerLoading;
  const base = embedUrl(videoId);

  const addScript = (src: string) =>
    new Promise<void>((resolve) => {
      const el = document.createElement("script");
      el.type = "text/javascript";
      el.async = true;
      el.src = src;
      el.onload = () => resolve();
      el.onerror = () => resolve();
      document.head.appendChild(el);
    });

  playerLoading = addScript(base + "loader.min.js")
    .then(() => addScript(base + "player.min.js"))
    .then(() => undefined);

  return playerLoading;
}

/** The classic snippet, verbatim from the embed code Vidalytics issues. */
function loadClassic(videoId: string) {
  const embedId = `vidalytics_embed_${videoId}`;
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.text = `(function (v, i, d, a, l, y, t, c, s) {
 y='_'+d.toLowerCase();c=d+'L';if(!v[d]){v[d]={};}if(!v[c]){v[c]={};}if(!v[y]){v[y]={};}var vl='Loader',vli=v[y][vl],vsl=v[c][vl + 'Script'],vlf=v[c][vl + 'Loaded'],ve='Embed';
 if (!vsl){vsl=function(u,cb){
  if(t){cb();return;}s=i.createElement("script");s.type="text/javascript";s.async=1;s.src=u;
  if(s.readyState){s.onreadystatechange=function(){if(s.readyState==="loaded"||s.readyState=="complete"){s.onreadystatechange=null;vlf=1;cb();}};}else{s.onload=function(){vlf=1;cb();};}
  i.getElementsByTagName("head")[0].appendChild(s);
 };}
 vsl(l+'loader.min.js',function(){if(!vli){var vlc=v[c][vl];vli=new vlc();}vli.loadScript(l+'player.min.js',function(){var vec=v[d][ve];t=new vec();t.run(a);});});
})(window, document, 'Vidalytics', '${embedId}', '${embedUrl(videoId)}');`;
  document.body.appendChild(script);
}

/**
 * The player.settings.json snippet. The container id is the raw video id here,
 * not the vidalytics_embed_ prefix the classic snippet uses — that is how
 * Vidalytics issues it, and the id in the markup has to match.
 */
function loadFromSettings(videoId: string) {
  const w = window as unknown as Record<string, any>;
  w._vidalytics = w._vidalytics || {};
  w._vidalytics.embeds = w._vidalytics.embeds || {};

  ensurePlayer(videoId);

  const run = () => {
    if (w.Vidalytics && w.Vidalytics.Embed) {
      const embed = new w.Vidalytics.Embed();
      embed.run(videoId);
      embed.loadCss();
    } else {
      setTimeout(run, 500);
    }
  };

  const request = new XMLHttpRequest();
  request.open("GET", `${embedUrl(videoId)}player.settings.json?ac=${Date.now()}`, true);
  request.onreadystatechange = () => {
    if (request.readyState !== 4) return;
    if (request.status !== 200 && request.status !== 304) return;
    w._vidalytics.embeds[videoId] = { type: "video", options: JSON.parse(request.responseText) };
    run();
  };
  request.send();
}

function loadVidalytics(videoId: string, loader?: "settings") {
  if (initializedEmbeds.has(videoId)) return;
  initializedEmbeds.add(videoId);
  if (loader === "settings") loadFromSettings(videoId);
  else loadClassic(videoId);
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
  loader,
}: {
  videoId: string;
  eager?: boolean;
  ratio?: number;
  loader?: "settings";
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (eager) {
      loadVidalytics(videoId, loader);
      return;
    }
    const node = mountRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      loadVidalytics(videoId, loader);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadVidalytics(videoId, loader);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [videoId, eager, loader]);

  return (
    <div ref={mountRef} className="vcc-video">
      <div
        id={loader === "settings" ? videoId : `vidalytics_embed_${videoId}`}
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

function PartnerName({ name }: { name: string }) {
  return <p className="vcc-partner__name">- {name}</p>;
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
                Expect a quick call or text from +1 302-279-2464 prior to your scheduled call from
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
              {PARTNERS.map(({ name, videoId, loader }) => (
                <div key={videoId} className="vcc-partner">
                  <PartnerName name={name} />
                  <VidalyticsVideo videoId={videoId} ratio={PORTRAIT_RATIO} loader={loader} />
                </div>
              ))}
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
            {CASE_STUDIES.map(({ title, videoId }) => (
              <div key={videoId} className="vcc-case-study">
                <h3 className="vcc-case-study__title">{title}</h3>
                <VidalyticsVideo videoId={videoId} />
              </div>
            ))}
          </SectionCard>
        </div>

        {/*
          Deliberately not a section card: no blue banner, no white panel. A dark
          full-bleed band with one bordered panel floating in it, so the last
          thing before the footer reads as a distinct moment rather than a
          seventh card.
        */}
        <section className="vcc-agreement" id="partnership">
          <div className="vcc-agreement__panel">
            <p className="vcc-agreement__eyebrow">Want to review the agreement before your call?</p>
            <h2 className="vcc-agreement__title">Review the Partnership Agreement</h2>
            <p className="vcc-agreement__body">
              We believe in being completely transparent upfront. You can review the partnership
              agreement before your call so you know exactly how everything is structured and what
              to expect. If you have any questions, bring them to the call and we can walk through
              them together.
            </p>
            {/* `download` rather than target=_blank: the PDF is same-origin, so
                the browser saves it straight away instead of opening a viewer. */}
            <a className="vcc-agreement__cta" href={AGREEMENT_URL} download>
              Review Partnership Agreement
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="vcc-footer">
          <div className="vcc-footer__inner">
            <img
              className="vcc-footer__logo"
              src="/vacarya-logo.webp"
              alt="Vacarya"
              width={800}
              height={118}
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
 * 22 clips over three columns leave one alone on the last row, hard against the
 * left edge. Pulling it into the middle column keeps the block symmetrical.
 *
 * Desktop only: at two columns 22 divides evenly, and this selector would still
 * match the final card there and move one that is already where it belongs.
 */
@media (min-width: 768px) {
  .vcc-partner:last-child:nth-child(3n + 1) { grid-column: 2; }
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

/* Stacked rather than side by side, so each clip gets the card's full width —
   at two-up they were half the size of the Step 1 and 2 videos above them. */
.vcc-case-studies {
  display: flex;
  flex-direction: column;
  gap: 52px;
  padding: 44px 15px 44px;
}

/*
 * Held in from the card edges rather than filling it. At full width these ran
 * 1090px — wider than the Step 1 and 2 videos above them — which made a feature
 * slot read as the biggest thing on the page.
 *
 * The border matters as much as the size: these clips are screen recordings on a
 * white background, so without an edge they bleed into the white card and the
 * frame is impossible to place.
 */
.vcc-case-study { width: 100%; max-width: 880px; margin: 0 auto; }

/* Montserrat 800 keeps it in the same family as the partner labels, but upright
   and a step larger, because this is a headline rather than an attribution. */
.vcc-case-study__title {
  margin: 0 0 12px;
  font-family: 'Montserrat', Helvetica, Arial, sans-serif;
  font-weight: 800;
  font-size: 23px;
  line-height: 30px;
  text-align: center;
  text-wrap: balance;
  color: #000000;
}

.vcc-case-study .vcc-video {
  border: 1px solid #e6e6e6;
  border-radius: 4px;
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
/* The top margin lets the page background show between the last card and this
   band, so the card's shadow reads as an edge instead of the two merging. */
.vcc-agreement {
  background: #041C25;
  padding: 72px 13.3px;
  margin-top: 60px;
  /* Deep-link target: leaves a sliver of page above the band on a jump. */
  scroll-margin-top: 20px;
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

/* The wordmark is 6.8:1, so it is sized by width — set a height and it would
   run most of the footer's width. White lettering on transparency, which is why
   it needs the black band under it. */
.vcc-footer__logo {
  display: block;
  width: 280px;
  height: auto;
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
  .vcc-partners__grid { grid-template-columns: repeat(2, 1fr); row-gap: 28px; }

  /* Two columns here comes from packColumns, not CSS — this only tightens the
     gaps to match the rest of the page at this width. */
  .vcc-body.vcc-step5 { padding: 24px 15px 20px; }
  .vcc-reviews { gap: 12px; }
  .vcc-reviews__column { gap: 12px; }

  /* Two columns here, so one column wide would leave the button off-centre —
     it takes a comfortable share of the width instead. */
  .vcc-more { width: 100%; max-width: 340px; font-size: 21px; }
  .vcc-earnings { grid-template-columns: repeat(2, 1fr); gap: 12px; }

  .vcc-body.vcc-case-studies { padding: 30px 15px 30px; gap: 34px; }

  .vcc-agreement { padding: 52px 15px; margin-top: 44px; }
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

  /* Mobile sizing is already right — only the gaps move. */
  .vcc-body.vcc-case-studies { padding: 20px 10px 24px; gap: 26px; }
  .vcc-case-study__title { font-size: 18px; line-height: 24px; }

  .vcc-agreement { padding: 40px 10px; margin-top: 32px; }
  .vcc-agreement__panel { padding: 28px 20px 32px; border-radius: 12px; }
  .vcc-agreement__eyebrow { font-size: 16px; letter-spacing: 0.1em; }
  .vcc-agreement__title { font-size: 32px; }
  .vcc-agreement__body { font-size: 17px; line-height: 25px; }
  .vcc-agreement__cta { font-size: 18px; padding: 14px 22px 16px; }


  .vcc-footer__inner { padding: 0 10px; }
  .vcc-footer__logo { width: 190px; margin-bottom: 14px; }
  .vcc-footer__links { font-size: 18px; }
  .vcc-footer__copy { font-size: 14px; }
}
`;
