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
 * blue italic emphasis. Curly quotes and apostrophes are intentional — copy is
 * verbatim from the design handoff.
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
    before: "“I’m at ",
    highlight: "25 units doing around $90,000 a month",
    after: ". My first one was live in 13 days.”",
    attribution: "- Josh C., Hamilton, ON",
    name: "Josh C.",
  },
  {
    before: "“",
    highlight: "Nine large units doing about $70,000 a month.",
    after: " Ten days from signing to live.”",
    attribution: "- Rob V., Toronto, ON",
    name: "Rob V.",
  },
  {
    before: "“",
    highlight: "23 units, around $63,000 a month",
    after: ", and the business qualified me for my E-2 visa.”",
    attribution: "- Andy D., Nova Scotia",
    name: "Andy D.",
  },
  {
    before: "“",
    highlight: "Three units, roughly $10,000 a month",
    after: ", and I was live in two weeks.”",
    attribution: "- Fasi K., Brampton, ON",
    name: "Fasi K.",
  },
  {
    before: "“Five days from handover to live. ",
    highlight: "I’m at nine units now, about $24,000 a month.",
    after: "”",
    attribution: "- Jason L., Toronto, ON",
    name: "Jason L.",
  },
  {
    before: "“I started with two large units. ",
    highlight: "They’re doing around $15,000 a month between them.",
    after: "”",
    attribution: "- Dennis L., Cookstown, ON",
    name: "Dennis L.",
  },
  {
    before: "“I came in with one unit and no idea how far it could go. ",
    highlight: "We’re at 30 units now, and it’s a seven-figure business.",
    after: "”",
    attribution: "- Dylan M., Ancaster, ON",
    name: "Dylan M.",
  },
  {
    before: "“The turnaround time completely exceeded what I expected. ",
    highlight: "Eight units, live in 15 days.",
    after: "”",
    attribution: "- Kajana D., Mississauga, ON",
    name: "Kajana D.",
  },
  {
    before: "“The setup and the management were effortless. ",
    highlight: "They handled all of it",
    after: " and I just watched it go live.”",
    attribution: "- Trevor H., Rockvale, TN",
    name: "Trevor H.",
  },
  {
    before: "“",
    highlight: "We’re holding a 25-30% profit margin",
    after: ", even in the slow season.”",
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
  return <div className="vcc-divider" aria-hidden="true" />;
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
              <div key={question}>
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
          <p className="vcc-footer__links">
            <a href={TERMS_URL}>TERMS</a> | <a href={PRIVACY_URL}>PRIVACY</a>
          </p>
          <p className="vcc-footer__copy">
            All rights reserved 2026. This program is brought to you and copyrighted by Vacarya LP
          </p>
          <p className="vcc-footer__legal">{LEGAL_DISCLAIMER}</p>
        </footer>
      </main>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Styles                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * The page is a deliberate structural replica of a known high-converting
 * confirmation page, so measurements are exact rather than snapped to the app's
 * spacing scale. Fractional values (53.3 / 26.7 / 21.3 …) come from a 1.5×
 * relationship that runs through the whole design — do not round them
 * individually. Scoped here (rather than in styles.css) because this page opts
 * out of the app's dark theme entirely.
 */
const PAGE_CSS = `
html:has(.vcc-page),
body:has(.vcc-page) {
  background: #fbfbfb;
}

.vcc-page {
  background: #fbfbfb;
  color: #000000;
  font-family: 'Poppins', Helvetica, Arial, sans-serif;
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

.vcc-hero { max-width: 748px; margin: 0 auto; }

.vcc-hero__title {
  margin: 0;
  font-weight: 700;
  font-style: italic;
  font-size: 44px;
  line-height: 50.7px;
  text-align: center;
  color: #000000;
  text-wrap: balance;
}

.vcc-check { vertical-align: -5px; margin-right: 9px; }

.vcc-hero__body {
  margin: 24px 0 0;
  font-size: 21.3px;
  line-height: 26.7px;
  font-weight: 400;
  color: #000000;
}

.vcc-hero__body--tight { margin-top: 26px; }
.vcc-hero__body strong { font-weight: 700; }
.vcc-underline { text-decoration: underline; }

.vcc-hero-spacer { height: 40.7px; }

/* Section card ------------------------------------------------------------ */

.vcc-card {
  display: block;
  background: #ffffff;
  border-radius: 6.7px;
  box-shadow: 0 3px 6.7px rgba(0, 0, 0, 0.07);
  overflow: hidden;
}

.vcc-card__header {
  margin: 0;
  background: #00ABE5;
  color: #000000;
  font-weight: 700;
  font-size: 33.3px;
  line-height: 1.1;
  letter-spacing: 0;
  text-transform: uppercase;
  text-align: center;
  padding: 23.3px 16px;
}

.vcc-body { padding: 20.7px 11.3px 22.7px; }
.vcc-body--wide { padding: 20.7px 35.3px 27.3px; }
.vcc-body--reviews { padding: 20.7px 35.3px 20px; }

.vcc-divider {
  width: 4px;
  height: 26.7px;
  background: #dddddd;
  margin: 30px auto 26px;
}

/* Video ------------------------------------------------------------------- */

.vcc-video { width: 100%; }

.vcc-video-mount {
  width: 100%;
  position: relative;
  padding-top: 56.25%;
}

.vcc-caption {
  margin: 10.7px 0 0;
  font-size: 18.7px;
  line-height: 26.7px;
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

.vcc-faq {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 10.7px;
  row-gap: 40px;
}

.vcc-faq__question {
  margin: 0;
  font-weight: 700;
  font-size: 26px;
  line-height: 29.3px;
  text-align: center;
  color: #000000;
}

/* Step 4 — reviews CTA ---------------------------------------------------- */

.vcc-cta {
  display: block;
  margin: 20.7px 0 0;
  background: #00b67a;
  color: #ffffff;
  text-decoration: none;
  text-align: center;
  padding: 17.3px 13.3px;
  transition: background-color 0.15s ease;
}

.vcc-page .vcc-cta:hover { background: #00a06c; color: #ffffff; }

.vcc-cta__line1 {
  display: block;
  font-weight: 700;
  font-size: 28px;
  line-height: 1.2;
  text-transform: uppercase;
  color: #ffffff;
}

.vcc-cta__line2 {
  display: block;
  font-weight: 500;
  font-size: 18px;
  line-height: 1.2;
  text-transform: uppercase;
  color: #eafff6;
}

/* Bonus #1 — testimonials ------------------------------------------------- */

/*
 * Each testimonial is one DOM unit (quote + its own video) so the pair stays
 * together when the grid collapses to a single column. Subgrid on the row axis
 * keeps the desktop rendering identical to the reference: every quote
 * shares a row track and every video shares the next, so videos in a band stay
 * top-aligned regardless of how tall the quote above them runs.
 */
.vcc-testimonials {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 10.7px;
  padding: 38px 11.3px 20px;
}

.vcc-testimonial {
  display: grid;
  grid-row: span 2;
  grid-template-rows: subgrid;
  row-gap: 0;
}

.vcc-testimonial__quote {
  margin: 0;
  font-weight: 700;
  font-size: 20px;
  line-height: 26.7px;
  text-align: center;
  color: #000000;
}

.vcc-metric { color: #00ABE5; font-style: italic; }
.vcc-testimonial__attribution { font-style: italic; }

.vcc-testimonial__video { margin: 2.7px 0 67.3px; }
.vcc-testimonial--last .vcc-testimonial__video { margin: 2.7px 0 0; }

/* Bonus #2 — wins grid ---------------------------------------------------- */

.vcc-wins {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10.7px;
  padding: 20.7px 11.3px 20px;
}

/* Footer ------------------------------------------------------------------ */

.vcc-footer {
  max-width: 748px;
  margin: 0 auto;
  padding: 42.7px 13.3px 60px;
  text-align: center;
  box-sizing: border-box;
}

.vcc-footer__links {
  margin: 0;
  font-size: 21.3px;
  line-height: 26.7px;
  font-weight: 700;
  color: #000000;
}

.vcc-page .vcc-footer__links a { color: #000000; text-decoration: none; }

.vcc-footer__copy {
  margin: 16px 0 0;
  font-size: 21.3px;
  line-height: 26.7px;
  font-weight: 400;
  color: #000000;
}

.vcc-footer__legal {
  margin: 21.3px 0 0;
  font-size: 13.3px;
  line-height: 20px;
  font-weight: 400;
  color: #555555;
  text-align: left;
}

/* Responsive --------------------------------------------------------------
 * The reference is desktop-only. Confirmation-page traffic is mostly mobile,
 * so the grids collapse and the type scales down proportionally. Structure and
 * order are unchanged.
 */

@media (max-width: 900px) {
  .vcc-wins { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .vcc-page { padding-top: 32px; }

  .vcc-hero__title { font-size: 30px; line-height: 36px; }
  .vcc-check { width: 30px; height: 30px; vertical-align: -4px; margin-right: 7px; }
  .vcc-hero__body { margin-top: 18px; font-size: 17px; line-height: 24px; }
  .vcc-hero__body--tight { margin-top: 20px; }
  .vcc-hero-spacer { height: 28px; }

  .vcc-card__header { font-size: 21px; padding: 16px 12px; }

  .vcc-body { padding: 16px 12px 18px; }
  .vcc-body--wide,
  .vcc-body--reviews { padding: 16px 14px 20px; }

  .vcc-caption { font-size: 15.5px; line-height: 22px; }

  .vcc-faq { grid-template-columns: 1fr; row-gap: 28px; }
  .vcc-faq__question { font-size: 19px; line-height: 24px; }

  .vcc-cta { padding: 14px 12px; }
  .vcc-cta__line1 { font-size: 19px; }
  .vcc-cta__line2 { font-size: 13px; }

  .vcc-testimonials { grid-template-columns: 1fr; padding: 24px 12px 20px; }
  .vcc-testimonial { display: block; }
  .vcc-testimonial__quote { font-size: 17px; line-height: 23px; }
  .vcc-testimonial__video,
  .vcc-testimonial--last .vcc-testimonial__video { margin: 6px 0 32px; }
  .vcc-testimonial:last-child .vcc-testimonial__video { margin-bottom: 0; }

  .vcc-placeholder--md .vcc-placeholder__label { font-size: 15px; }
  .vcc-placeholder--sm .vcc-placeholder__label { font-size: 13px; }
  .vcc-placeholder--xs .vcc-placeholder__label { font-size: 12px; }

  .vcc-footer { padding: 30px 14px 44px; }
  .vcc-footer__links,
  .vcc-footer__copy { font-size: 17px; line-height: 23px; }
  .vcc-footer__legal { font-size: 12px; line-height: 18px; }
}

@media (max-width: 520px) {
  .vcc-wins { grid-template-columns: 1fr; }
  .vcc-hero__title { font-size: 26px; line-height: 32px; }
  .vcc-card__header { font-size: 18px; }
}
`;
