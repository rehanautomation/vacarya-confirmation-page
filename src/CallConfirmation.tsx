import { useEffect, useRef, type ReactNode } from "react";


/* -------------------------------------------------------------------------- */
/* Content                                                                     */
/* -------------------------------------------------------------------------- */

const FAQ_QUESTIONS = [
  "What is Vacarya?",
  "What types of results can I get?",
  "How much capital do I need to start?",
  "Do I need to buy any property?",
  "Do I need any experience to do this?",
  "How much time will this take each week?",
  "How do I know this will work in my market?",
  "What if a unit underperforms?",
  "What if a guest damages the property?",
  "What if the rules change in my city?",
  "How much does Vacarya cost?",
  "What if my partner isn’t aligned?",
] as const;

/**
 * `before` / `highlight` / `after` split the quote so the metric can carry the
 * blue italic emphasis.
 *
 * Punctuation matches BudgetDog exactly: straight double quotes (U+0022) around
 * the quotation, curly apostrophes (U+2019) inside contractions. Do not "fix"
 * the straight quotes to typographic ones — theirs are straight.
 */
type Testimonial = {
  before: string;
  highlight: string;
  after: string;
  attribution: string;
  name: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    before: "\"I’m at ",
    highlight: "25 units doing around $90,000 a month",
    after: ". My first one was live in 13 days.\"",
    attribution: "- Josh C., Hamilton, ON",
    name: "Josh C.",
  },
  {
    before: "\"",
    highlight: "Nine large units doing about $70,000 a month.",
    after: " Ten days from signing to live.\"",
    attribution: "- Rob V., Toronto, ON",
    name: "Rob V.",
  },
  {
    before: "\"",
    highlight: "23 units, around $63,000 a month",
    after: ", and the business qualified me for my E-2 visa.\"",
    attribution: "- Andy D., Nova Scotia",
    name: "Andy D.",
  },
  {
    before: "\"",
    highlight: "Three units, roughly $10,000 a month",
    after: ", and I was live in two weeks.\"",
    attribution: "- Fasi K., Brampton, ON",
    name: "Fasi K.",
  },
  {
    before: "\"Five days from handover to live. ",
    highlight: "I’m at nine units now, about $24,000 a month.",
    after: "\"",
    attribution: "- Jason L., Toronto, ON",
    name: "Jason L.",
  },
  {
    before: "\"I started with two large units. ",
    highlight: "They’re doing around $15,000 a month between them.",
    after: "\"",
    attribution: "- Dennis L., Cookstown, ON",
    name: "Dennis L.",
  },
  {
    before: "\"I came in with one unit and no idea how far it could go. ",
    highlight: "We’re at 30 units now, and it’s a seven-figure business.",
    after: "\"",
    attribution: "- Dylan M., Ancaster, ON",
    name: "Dylan M.",
  },
  {
    before: "\"The turnaround time completely exceeded what I expected. ",
    highlight: "Eight units, live in 15 days.",
    after: "\"",
    attribution: "- Kajana D., Mississauga, ON",
    name: "Kajana D.",
  },
  {
    before: "\"The setup and the management were effortless. ",
    highlight: "They handled all of it",
    after: " and I just watched it go live.\"",
    attribution: "- Trevor H., Rockvale, TN",
    name: "Trevor H.",
  },
  {
    before: "\"",
    highlight: "We’re holding a 25-30% profit margin",
    after: ", even in the slow season.\"",
    attribution: "- Jessica & James, St. Petersburg, FL",
    name: "Jessica & James",
  },
];

const WINS_COUNT = 15;

const LEGAL_DISCLAIMER =
  "DISCLAIMER: Please understand results are not typical. Your results will vary and depend on many factors including but not limited to your capital, your market, your timing, your background, experience, and work ethic. All business entails risk as well as taking regular and consistent effort and action. Vacarya can not and does not make any guarantees about your ability to secure leases, generate bookings, achieve any profit margin, or earn any money with our ideas, information, tools, or strategies. Nothing on this page, any of our websites, or any of our content or curriculum is a promise or guarantee of results or future earnings, and we do not offer any legal, medical, tax, immigration or other professional advice. Any financial numbers referenced here, or on any of our sites, are illustrative of concepts only and should not be considered average earnings, exact earnings, or promises for actual or future performance. Short-term rental rules vary by city, state, province, and building, and are subject to change. Use caution and always consult your accountant, lawyer or professional advisor before acting on this or any information related to a lifestyle change or your business or finances. You alone are responsible and accountable for your decisions, actions and results in life, and by your registration here you agree not to attempt to hold us liable for your decisions, actions or results, at any time, under any circumstance.";

/* -------------------------------------------------------------------------- */
/* Pending inputs — see design_handoff README "Assets" table                    */
/* -------------------------------------------------------------------------- */

/** TODO: real reviews page URL (Trustpilot or equivalent). Required before launch. */
const REVIEWS_URL = "#";
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
 * approach the viewport — the page carries 25 embeds once all assets land.
 */
function VidalyticsVideo({ videoId, eager = false }: { videoId: string; eager?: boolean }) {
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
      <div id={`vidalytics_embed_${videoId}`} className="vcc-video-mount" />
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
              Congrats! Your Call Is Booked!
            </h1>
            <p className="vcc-hero__body">
              We look forward to speaking with you during your scheduled time! Please be in a quiet
              spot where we can speak about your goals.
            </p>
            <p className="vcc-hero__body vcc-hero__body--tight">
              <strong>
                We will not take calls when you&rsquo;re on the go or can&rsquo;t devote your full
                attention.
              </strong>{" "}
              <span className="vcc-underline">
                This call may decide the fate of your financial future, please treat it that way
              </span>
              .
            </p>
          </header>

          <div className="vcc-hero-spacer" />

          {/* Step 1 */}
          <SectionCard title="Step 1: Watch This Video Now" bodyClassName="vcc-body vcc-body--wide">
            <VidalyticsVideo videoId="1bPO1F19aT_fHl5g" eager />
            <VideoCaption>
              Please send this page to your spouse right now. It has important information they need
              to know about the call.
            </VideoCaption>
          </SectionCard>

          <Divider />

          {/* Step 2 */}
          <SectionCard
            title="Step 2: Accept The Calendar Invite"
            bodyClassName="vcc-body vcc-body--wide"
          >
            {/* TODO: replace with <VidalyticsVideo videoId="..." /> once the embed lands. */}
            <Placeholder
              label={"Video placeholder — Step 2 “Calendar Invite”"}
              note={"Vidalytics embed · 16:9 · renders 1024 × 576 px at 1920 viewport"}
            />
            <VideoCaption>
              Make sure your partner is available for this time. It&rsquo;s very hard to build a
              business together if you&rsquo;re not aligned.
            </VideoCaption>
          </SectionCard>

          <Divider />

          {/* Step 3 */}
          <SectionCard title="Step 3: Get Your Questions Answered" bodyClassName="vcc-body vcc-faq">
            {FAQ_QUESTIONS.map((question) => (
              <div key={question} className="vcc-faq__item">
                <h3 className="vcc-faq__question">{question}</h3>
                {/* TODO: replace with <VidalyticsVideo videoId="..." /> once the embed lands. */}
                <Placeholder
                  label={`Video placeholder — “${question}”`}
                  note={"16:9 · 536 × 302 px at 1920 viewport"}
                  size="sm"
                />
              </div>
            ))}
          </SectionCard>

          <Divider />

          {/* Step 4 */}
          <SectionCard title="Step 4: Read Our Reviews" bodyClassName="vcc-body vcc-body--reviews">
            {/* TODO: replace with <VidalyticsVideo videoId="..." /> once the embed lands. */}
            <Placeholder
              label={"Video placeholder — Reviews"}
              note={"Vidalytics embed · 16:9 · renders 1024 × 576 px at 1920 viewport"}
            />
            <a className="vcc-cta" href={REVIEWS_URL} target="_blank" rel="noopener">
              <span className="vcc-cta__line1">Click Here To Read Our Unbiased Reviews</span>
              <span className="vcc-cta__line2">
                We cannot delete or hide reviews, ensuring transparent, unfiltered feedback
              </span>
            </a>
          </SectionCard>

          <Divider />

          {/* Bonus #1 */}
          <SectionCard
            title="Bonus #1: Listen To What Real Clients Have To Say"
            bodyClassName="vcc-body vcc-testimonials"
          >
            {TESTIMONIALS.map((testimonial, index) => (
              <div
                key={testimonial.attribution}
                className={[
                  "vcc-testimonial",
                  index >= TESTIMONIALS.length - 2 ? "vcc-testimonial--last" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <p className="vcc-testimonial__quote">
                  {testimonial.before}
                  <span className="vcc-metric">{testimonial.highlight}</span>
                  {testimonial.after}
                  <br />
                  <span className="vcc-testimonial__attribution">{testimonial.attribution}</span>
                </p>
                {/* TODO: replace with <VidalyticsVideo videoId="..." /> once the embed lands. */}
                <Placeholder
                  label={`Testimonial video ${index + 1} — ${testimonial.name}`}
                  note={"16:9 · 536 × 302 px at 1920 viewport"}
                  size="sm"
                  className="vcc-testimonial__video"
                />
              </div>
            ))}
          </SectionCard>

          <Divider />

          {/* Bonus #2 */}
          <SectionCard
            title="Bonus #2: Read Wins Posts From Our Client Community"
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
            <p className="vcc-footer__links">
              <a href={TERMS_URL}>TERMS</a> | <a href={PRIVACY_URL}>PRIVACY</a>
            </p>
            <p className="vcc-footer__copy">
              All rights reserved 2026. This program is brought to you and copyrighted by Vacarya LP
            </p>
            <p className="vcc-footer__legal">{LEGAL_DISCLAIMER}</p>
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
.vcc-body--reviews { padding: 20.7px 35.3px 20px; }

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

/* Step 4 — reviews CTA ---------------------------------------------------- */

/* BudgetDog: #00b67a, radius 5px, padding 16px 20px 18px. */
.vcc-cta {
  display: block;
  margin: 20.7px 0 0;
  background: #00b67a;
  color: #ffffff;
  text-decoration: none;
  text-align: center;
  padding: 16px 20px 18px;
  border-radius: 5px;
  font-family: 'Barlow Semi Condensed', Helvetica, Arial, sans-serif;
  transition: background-color 0.15s ease;
}

.vcc-page .vcc-cta:hover { background: #00a06c; color: #ffffff; }

/* BudgetDog: line 1 is 28px/700, line 2 is 15px/400 — both plain white. */
.vcc-cta__line1 {
  display: block;
  font-weight: 700;
  font-size: 28px;
  line-height: normal;
  text-transform: uppercase;
  color: #ffffff;
}

/* Their subline is NOT Barlow — it falls through to the system sans stack, which
   is why it reads wider and plainer than the condensed line above it. The softer
   grey-white comes from opacity 0.8 over the green, not a different hex. */
.vcc-cta__line2 {
  display: block;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: normal;
  text-transform: uppercase;
  color: #ffffff;
  opacity: 0.8;
}

/* Bonus #1 — testimonials ------------------------------------------------- */

/*
 * Each testimonial is one DOM unit (quote + its own video) so the pair stays
 * together when the grid collapses to a single column. Subgrid on the row axis
 * keeps the desktop rendering identical to the reference: every quote
 * shares a row track and every video shares the next, so videos in a band stay
 * top-aligned regardless of how tall the quote above them runs.
 */
/* Measured: 15px side padding, 10px gap → two 540px columns in a 1120px card.
   Wider inset than the FAQ grid above, which is why their testimonial videos sit
   further apart than ours did. */
.vcc-testimonials {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 10px;
  padding: 38px 15px 20px;
}

.vcc-testimonial {
  display: grid;
  grid-row: span 2;
  grid-template-rows: subgrid;
  row-gap: 0;
}

/* BudgetDog uses Montserrat 800 for the quotes only — nothing else on the page
   uses this face. */
.vcc-testimonial__quote {
  margin: 0;
  font-family: 'Montserrat', Helvetica, Arial, sans-serif;
  font-weight: 800;
  font-size: 20px;
  line-height: 26px;
  text-align: center;
  color: #000000;
}

.vcc-metric { color: #00ABE5; font-style: italic; }
.vcc-testimonial__attribution { font-style: italic; }

/*
 * Their <figure class="video-container"> carries 10px of padding, so a
 * testimonial video is 520px inside its 540px column — 25px from the card edge
 * with a 30px gap between the pair. The FAQ videos have no such padding and do
 * fill their columns, which is why only this grid needed the inset.
 */
/* width:auto overrides .vcc-placeholder's width:100% so the 10px side margins
   actually narrow the box rather than pushing it out of the column. */
.vcc-testimonial__video { width: auto; margin: 2.7px 10px 67.3px; }
.vcc-testimonial--last .vcc-testimonial__video { margin: 2.7px 10px 0; }

/* Bonus #2 — wins grid ---------------------------------------------------- */

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

.vcc-footer__legal {
  margin: 21.3px 0 0;
  font-size: 16px;
  line-height: normal;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.42);
  text-align: center;
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

  /* Measured at 390: quote inset 20px from the card edge, video a further 10px
     in at 30px — same 10px figure padding as desktop, wider column inset.
     Qualified with .vcc-body because both classes sit on this element and the
     .vcc-body mobile padding below would otherwise win on source order. */
  .vcc-body.vcc-testimonials { grid-template-columns: 1fr; padding: 24px 20px 20px; }
  .vcc-testimonial { display: block; }
  .vcc-testimonial__video,
  .vcc-testimonial--last .vcc-testimonial__video { margin: 6px 10px 32px; }
  .vcc-testimonial:last-child .vcc-testimonial__video { margin-bottom: 0; }

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
  .vcc-body--wide,
  .vcc-body--reviews { padding: 16px 12px 20px; }
  /* Their FAQ video is 370px at 10px inset in a 390px card. */
  .vcc-body.vcc-faq { padding: 16px 10px 18px; }

  .vcc-cta { padding: 14px 14px 16px; }
  .vcc-cta__line1 { font-size: 20px; }
  .vcc-cta__line2 { font-size: 13px; }

  .vcc-wins { grid-template-columns: 1fr; }

  .vcc-placeholder--md .vcc-placeholder__label { font-size: 15px; }
  .vcc-placeholder--sm .vcc-placeholder__label { font-size: 13px; }
  .vcc-placeholder--xs .vcc-placeholder__label { font-size: 12px; }

  .vcc-footer__inner { padding: 0 10px; }
  .vcc-footer__links { font-size: 18px; }
  .vcc-footer__copy,
  .vcc-footer__legal { font-size: 14px; }
}
`;
