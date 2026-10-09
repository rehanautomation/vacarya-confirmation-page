/**
 * Wraps the WordPress fragment in a minimal document so it can be opened
 * directly: public/call-confirmation.html
 *
 * The fragment has no <html>, charset or viewport of its own — a real theme
 * supplies those. Served bare it would render in quirks mode and a phone would
 * lay it out at 980px, so the wrapper exists purely to make what you see here
 * match what the theme will show.
 *
 *   node scripts/build-wordpress-html.mjs && node scripts/make-preview.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const fragment = fs.readFileSync(path.join(root, "wordpress/vacarya-call-confirmation.html"), "utf8");

const doc = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Vacarya — Call Confirmation</title>
<style>html,body{margin:0;padding:0;}</style>
</head>
<body>
${fragment}
</body>
</html>
`;

const out = path.join(root, "public/call-confirmation.html");
fs.writeFileSync(out, doc);
console.log(`wrote public/call-confirmation.html  ${(Buffer.byteLength(doc) / 1024).toFixed(1)} KB`);
