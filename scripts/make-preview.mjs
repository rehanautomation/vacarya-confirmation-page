/**
 * Overwrites dist/index.html with the WordPress fragment, so the deployed root
 * URL serves the exact block that gets pasted into WordPress rather than the
 * React build of the same page.
 *
 * Runs after `vite build`, which writes its own SPA shell there first. The React
 * app stays the way the page is edited (`npm run dev`); only what ships changes.
 *
 * The fragment has no <html>, charset or viewport of its own — a theme supplies
 * those. Served bare it would render in quirks mode and a phone would lay it out
 * at 980px, so the head below exists to make what you see at the root match what
 * the theme will show. It is the head from the project's index.html, minus the
 * module script that would boot React a second time.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const fragment = fs.readFileSync(path.join(root, "wordpress/vacarya-call-confirmation.html"), "utf8");

const doc = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>Congrats! Your Call Is Booked! · Vacarya</title>
    <meta
      name="description"
      content="Your call is booked. Watch the video, accept the calendar invite, and get your questions answered before we speak."
    />
    <style>
      html,
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
${fragment}
  </body>
</html>
`;

const out = path.join(root, "dist/index.html");
if (!fs.existsSync(path.dirname(out))) {
  throw new Error("dist/ is missing — run `vite build` first");
}
fs.writeFileSync(out, doc);
console.log(`wrote dist/index.html  ${(Buffer.byteLength(doc) / 1024).toFixed(1)} KB (the pasteable page, served at /)`);
