/**
 * Writes dist/copy.html — a one-button page that puts the whole WordPress block
 * on the clipboard. Runs after the generator, as part of `npm run build`.
 *
 * The block lives in a hidden <textarea> rather than a <script type="text/plain">
 * or a fetch(). A script block would end early at the first </script> inside the
 * Vidalytics snippet, and a fetch needs a second file to keep in step. A
 * textarea's contents are raw text up to </textarea>, which the block never
 * contains — only "&" has to be escaped going in, and the browser decodes it
 * back when the button reads .value, so what lands on the clipboard is
 * byte-for-byte the generated file.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const block = fs.readFileSync(path.join(root, "wordpress/vacarya-call-confirmation.html"), "utf8");
const kb = (Buffer.byteLength(block) / 1024).toFixed(1);

const count = (re) => (block.match(re) || []).length;
const stats = [
  [count(/class="vcc-video"/g), "videos"],
  [count(/class="vcc-review"/g), "reviews"],
  [count(/class="vcc-earning"/g), "revenue shots"],
  [`${kb} KB`, "total"],
];

const FONT = "https://vacarya-confirmation-page.vercel.app/fonts";

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Copy the call-confirmation block</title>
<style>
  @font-face{font-family:'Barlow';font-style:normal;font-weight:400;font-display:swap;src:url('${FONT}/barlow-400.woff2') format('woff2');}
  @font-face{font-family:'Barlow';font-style:normal;font-weight:700;font-display:swap;src:url('${FONT}/barlow-700.woff2') format('woff2');}
  @font-face{font-family:'Barlow Semi Condensed';font-style:normal;font-weight:700;font-display:swap;src:url('${FONT}/barlow-semi-condensed-700.woff2') format('woff2');}

  :root { --blue:#00ABE5; --band:#041C25; --panel:#0A2C38; }
  * { box-sizing:border-box; }
  body {
    margin:0; min-height:100vh; padding:48px 16px;
    background:var(--band); color:#fff;
    font-family:'Barlow',Helvetica,Arial,sans-serif;
    display:flex; align-items:center; justify-content:center;
  }
  .wrap { width:100%; max-width:620px; }
  h1 {
    margin:0 0 8px; font-family:'Barlow Semi Condensed',Helvetica,Arial,sans-serif;
    font-weight:700; font-size:42px; line-height:1.05; color:var(--blue);
  }
  .sub { margin:0 0 28px; font-size:18px; line-height:26px; color:rgba(255,255,255,.72); }

  button {
    width:100%; padding:22px 24px; border:0; border-radius:8px;
    background:var(--blue); color:#000; cursor:pointer;
    font-family:'Barlow Semi Condensed',Helvetica,Arial,sans-serif;
    font-weight:700; font-size:26px; line-height:1.1; letter-spacing:.04em;
    text-transform:uppercase; transition:background-color .15s ease;
  }
  button:hover { background:#4fc9f0; }
  button:focus-visible { outline:3px solid #fff; outline-offset:3px; }
  button.done { background:#17c07b; }

  .stats { display:flex; flex-wrap:wrap; gap:10px; margin:16px 0 0; padding:0; list-style:none; }
  .stats li {
    flex:1 1 120px; padding:12px 14px; border:1px solid rgba(0,171,229,.35);
    border-radius:6px; background:var(--panel); font-size:15px; color:rgba(255,255,255,.72);
  }
  .stats b { display:block; font-size:22px; color:#fff; font-weight:700; }

  ol { margin:32px 0 0; padding:0 0 0 20px; font-size:17px; line-height:28px; color:rgba(255,255,255,.86); }
  ol li { margin:0 0 6px; }
  ol b { color:#fff; }
  .note {
    margin:28px 0 0; padding:16px 18px; border-left:3px solid var(--blue);
    background:var(--panel); font-size:15px; line-height:24px; color:rgba(255,255,255,.72);
  }
  a { color:var(--blue); }
  textarea { position:absolute; left:-9999px; top:0; width:10px; height:10px; opacity:0; }
</style>
</head>
<body>
  <div class="wrap">
    <h1>Copy the call-confirmation block</h1>
    <p class="sub">One click puts the whole page on your clipboard, ready to paste into WordPress.</p>

    <button id="copy" type="button">Copy the code</button>

    <ul class="stats">
      ${stats.map(([n, label]) => `<li><b>${n}</b>${label}</li>`).join("\n      ")}
    </ul>

    <ol>
      <li>Click <b>Copy the code</b> above.</li>
      <li>In WordPress, open the call-confirmation page and <b>edit the existing Custom HTML block</b> — don't add a second one.</li>
      <li>Select everything already in that block and <b>paste over it</b>.</li>
      <li><b>Update</b>, then open the live page and play one video to confirm.</li>
    </ol>

    <p class="note">
      It has to be a <b>Custom HTML</b> block, and you have to be signed in as an
      administrator — WordPress strips <code>&lt;script&gt;</code> tags from a
      paragraph block, and from any user without the <code>unfiltered_html</code>
      capability. Images, fonts and the PDF load from this deploy, so leave it running.
    </p>

    <textarea id="src" readonly aria-hidden="true">${block.replace(/&/g, "&amp;")}</textarea>
  </div>

<script>
(function () {
  var button = document.getElementById('copy');
  var source = document.getElementById('src');
  var label = button.textContent;
  var timer;

  function flash(text, done) {
    clearTimeout(timer);
    button.textContent = text;
    button.classList.toggle('done', !!done);
    timer = setTimeout(function () {
      button.textContent = label;
      button.classList.remove('done');
    }, 2500);
  }

  button.addEventListener('click', function () {
    var text = source.value;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () {
        flash('Copied \\u2014 now paste it into WordPress', true);
      }, fallback);
      return;
    }
    fallback();

    // execCommand still works where the async clipboard is blocked, and needs
    // the textarea on screen to select from.
    function fallback() {
      source.style.position = 'static';
      source.style.opacity = '0';
      source.focus();
      source.select();
      source.setSelectionRange(0, text.length);
      var worked = false;
      try { worked = document.execCommand('copy'); } catch (e) {}
      source.style.position = 'absolute';
      flash(worked ? 'Copied \\u2014 now paste it into WordPress' : 'Press Ctrl/Cmd+C to copy', worked);
    }
  });
})();
</script>
</body>
</html>
`;

const out = path.join(root, "dist/copy.html");
if (!fs.existsSync(path.dirname(out))) throw new Error("dist/ is missing — run `vite build` first");
fs.writeFileSync(out, page);
console.log(`wrote dist/copy.html     ${(Buffer.byteLength(page) / 1024).toFixed(1)} KB (one-click copy of the ${kb} KB block)`);
