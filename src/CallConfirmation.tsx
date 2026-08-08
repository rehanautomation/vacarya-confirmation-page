import { useEffect, useRef, type ReactNode } from "react";


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
 * The set is mixed-orientation, so it renders as two groups: ten portrait clips
 * in a 5×2 grid, then the two landscape clips at the end. Splitting them is what
 * keeps every video in a row the same size — mixing 9:16 and 16:9 in one grid
 * would give ragged rows whatever the column count.
 *
 * Every portrait clip is pinned to a single 177.78% (9:16) box even though the
 * source embeds vary between 176.67% and 177.82%. That spread is under 1% — about
 * 2px at this size — and normalising it means all ten align exactly, which the
 * varied values would not.
 */
type Partner = {
  attribution: string;
  videoId: string;
};

/** 9:16, five per row on desktop. */
const PARTNERS_PORTRAIT: Partner[] = [
  { attribution: "- Josh C., Hamilton, ON", videoId: "UH3YggU0nB1bDod_" },
  { attribution: "- Rob V., Toronto, ON", videoId: "VTab9sdlPcnqYsyw" },
  { attribution: "- Andy D., Nova Scotia", videoId: "WoB8QPzALc0OUKH6" },
  { attribution: "- Fasi K., Brampton, ON", videoId: "KCxrI1vlcJ71GTP9" },
  { attribution: "- Dennis L., Cookstown, ON", videoId: "LUuJ8wfnCQ7QS1d3" },
  { attribution: "- Jason L., Toronto, ON", videoId: "Q7FZIMLXMLWHNdDk" },
  { attribution: "- Kajana D., Mississauga, ON", videoId: "YMTcLkxOfEPogHig" },
  { attribution: "- Dylan M., Ancaster, ON", videoId: "C873MB3yzcU4eiHP" },
  { attribution: "- Trevor J., Toronto", videoId: "WkyXHrLIcfaeY4yr" },
  { attribution: "- Trevor H., Rockvale, TN", videoId: "pJPnsekIVIAUwxYD" },
];

/** Landscape, two per row, at the end. Each keeps its own true aspect ratio —
 *  forcing them to match would letterbox one or crop the other. */
const PARTNERS_LANDSCAPE: (Partner & { ratio: number })[] = [
  // TODO: no location supplied for Tony — confirm and add.
  { attribution: "- Tony", videoId: "EiwlSXCbZ9Lko_VD", ratio: 56.25 },
  { attribution: "- Jessica & James, St. Petersburg, FL", videoId: "RtMzfq3hSiEqkV8f", ratio: 66.67 },
];

/** 9:16 — every portrait partner clip renders in this box. */
const PORTRAIT_RATIO = 177.78;

const WINS_COUNT = 15;


/* -------------------------------------------------------------------------- */
/* Pending inputs — see design_handoff README "Assets" table                    */
/* -------------------------------------------------------------------------- */

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

/**
 * Dev-only slot marker standing in for an asset that hasn't been delivered.
 * Strip these as real embeds/screenshots land — they must not ship.
 */
function Placeholder({
  label,
  note,
  size = "md",
  ratio = "16 / 9",
  className,
}: {
  label: string;
  note: string;
  size?: "md" | "sm" | "xs";
  ratio?: string;
  className?: string;
}) {
  return (
    <div
      className={["vcc-placeholder", `vcc-placeholder--${size}`, className]
        .filter(Boolean)
        .join(" ")}
      style={{ aspectRatio: ratio }}
    >
      <div className="vcc-placeholder__label">{label}</div>
      <div className="vcc-placeholder__note">{note}</div>
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
              Before your call, make sure you watch the videos on this page. They&rsquo;re an
              important part of the process and will give you the context you need, so when we speak
              we can build on that and get into how this would actually apply to you.
            </p>
            <p className="vcc-hero__body vcc-hero__body--tight">
              Expect a quick call or text from +1 (302) 566 0034 prior to your scheduled call from a
              member of our advisory team.
            </p>
          </header>

          <div className="vcc-hero-spacer" />

          {/* Step 1 */}
          <SectionCard title="Step 1: Call Confirmation" bodyClassName="vcc-body vcc-body--wide">
            <VidalyticsVideo videoId="1bPO1F19aT_fHl5g" eager />
            <VideoCaption>
              Please send this page to your spouse right now. It has important information they need
              to know about the call.
            </VideoCaption>
          </SectionCard>

          <Divider />

          {/* Step 2 */}
          <SectionCard title="Step 2: How It All Works" bodyClassName="vcc-body vcc-body--wide">
            <VidalyticsVideo videoId="gdS3zkX56PY3q7QX" />
            <VideoCaption>
              Make sure your partner is available for this time. It&rsquo;s very hard to build a
              business together if you&rsquo;re not aligned.
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
            <div className="vcc-partners__portrait">
              {PARTNERS_PORTRAIT.map(({ attribution, videoId }) => (
                <div key={videoId} className="vcc-partner">
                  <p className="vcc-partner__name">{attribution}</p>
                  <VidalyticsVideo videoId={videoId} ratio={PORTRAIT_RATIO} />
                </div>
              ))}
            </div>
            <div className="vcc-partners__landscape">
              {PARTNERS_LANDSCAPE.map(({ attribution, videoId, ratio }) => (
                <div key={videoId} className="vcc-partner">
                  <p className="vcc-partner__name">{attribution}</p>
                  <VidalyticsVideo videoId={videoId} ratio={ratio} />
                </div>
              ))}
            </div>
          </SectionCard>

          <Divider />

          {/* Step 5 */}
          <SectionCard
            title="Step 5: Reviews & Written Wins"
            bodyClassName="vcc-body vcc-wins"
          >
            {Array.from({ length: WINS_COUNT }, (_, index) => (
              // TODO: drive from a real image array once the screenshots land.
              <Placeholder
                key={index}
                label={`Wins post screenshot ${index + 1}`}
                note={"portrait screenshot · ~352 px wide column"}
                size="xs"
                ratio="3 / 4"
              />
            ))}
          </SectionCard>
        </div>

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
  text-align: left;
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

/* Placeholders (dev only — remove with the real assets) -------------------- */

.vcc-placeholder {
  width: 100%;
  background: #ededed;
  border: 1px dashed #c7c7c7;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.vcc-placeholder--md { gap: 9.3px; padding: 16px; }
.vcc-placeholder--sm { gap: 8px; padding: 13.3px; }
.vcc-placeholder--xs { gap: 6.7px; padding: 12px; }

.vcc-placeholder__label {
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #5a5a5a;
}

.vcc-placeholder--md .vcc-placeholder__label { font-size: 22.7px; line-height: 1.15; }
.vcc-placeholder--sm .vcc-placeholder__label { font-size: 17.3px; }
.vcc-placeholder--xs .vcc-placeholder__label { font-size: 16px; }

.vcc-placeholder__note {
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  line-height: 1.5;
  color: #8a8a8a;
}

.vcc-placeholder--md .vcc-placeholder__note { font-size: 11.3px; }
.vcc-placeholder--sm .vcc-placeholder__note { font-size: 10px; }
.vcc-placeholder--xs .vcc-placeholder__note { font-size: 9.3px; }

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
 * Two grids, because the clips are mixed orientation. Ten portrait (9:16) run
 * five-up, then the two landscape clips run two-up underneath. Keeping them in
 * separate grids is what makes every video in a row identical in size — one
 * grid holding both shapes would give ragged rows at any column count.
 *
 * Spacing is deliberately uniform: the side padding equals the column gap
 * (15px), so the space outside the outer videos matches the space between them.
 * Row gap is larger (40px) because each row carries a name above its video.
 *
 * Each partner is one subgrid unit spanning the name track and the video track,
 * so names sharing a row share a height and every video in that row starts at
 * the same y — true even when a longer name wraps.
 */
.vcc-partners {
  padding: 38px 15px 24px;
}

.vcc-partners__portrait,
.vcc-partners__landscape {
  display: grid;
  column-gap: 15px;
  row-gap: 40px;
}

.vcc-partners__portrait { grid-template-columns: repeat(5, 1fr); }

.vcc-partners__landscape {
  grid-template-columns: repeat(2, 1fr);
  margin-top: 40px;
}

.vcc-partner {
  display: grid;
  grid-row: span 2;
  grid-template-rows: subgrid;
  row-gap: 0;
}

/* Montserrat 800 is used for these names only — nothing else on the page uses
   this face. Italic and size carried over from the original attribution line. */
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

/* Step 5 — reviews & written wins grid ---------------------------------------------------- */

.vcc-wins {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10.7px;
  padding: 20.7px 11.3px 20px;
}

/* Footer ------------------------------------------------------------------ */

/*
 * BudgetDog's footer is a full-bleed black band (padding 20px 0 30px) carrying
 * white text, which is what separates it from the page above. Type is Barlow:
 * links 20px/700 white, copy and disclaimer 16px/400 at 42% white, all centered.
 */
.vcc-footer {
  background: #000000;
  padding: 20px 0 30px;
  margin-top: 20px;
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
  .vcc-partners__portrait { grid-template-columns: repeat(2, 1fr); row-gap: 28px; }
  .vcc-partners__landscape { margin-top: 28px; row-gap: 28px; }

  .vcc-wins { grid-template-columns: repeat(2, 1fr); }
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
  .vcc-partners__portrait { grid-template-columns: repeat(2, 1fr); column-gap: 10px; }
  .vcc-partners__landscape { grid-template-columns: 1fr; column-gap: 10px; }
  .vcc-partner__name { font-size: 16px; line-height: 21px; }

  .vcc-wins { grid-template-columns: 1fr; }

  .vcc-placeholder--md .vcc-placeholder__label { font-size: 15px; }
  .vcc-placeholder--sm .vcc-placeholder__label { font-size: 13px; }
  .vcc-placeholder--xs .vcc-placeholder__label { font-size: 12px; }

  .vcc-footer__inner { padding: 0 10px; }
  .vcc-footer__logo { height: 84px; margin-bottom: 14px; }
  .vcc-footer__links { font-size: 18px; }
  .vcc-footer__copy { font-size: 14px; }
}
`;
