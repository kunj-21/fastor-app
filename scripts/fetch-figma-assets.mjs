// Downloads every image and icon used by the app from the Figma MCP export
// into public/assets. Run once on your machine:  npm run assets
//
// These URLs were issued by Figma on 11 Oct 2026 and expire after 7 days.
// If they've expired, re-export from Figma (or ask Claude to re-run the export).

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "assets");

const AUTH = "https://www.figma.com/api/mcp/asset/269fee73-d421-4d25-a597-88a8704caca1";
const OTP = "https://www.figma.com/api/mcp/asset/3f7cb10a-2327-47d1-bb4b-472f603cee22";
const HOME = "https://www.figma.com/api/mcp/asset/8790ffa1-9f49-4b70-a6b3-b5913e739e40";
const PRODUCT = "https://www.figma.com/api/mcp/asset/ef0bd466-d448-481a-bc24-2e7a26a569dd";

const assets = {
  // Icons
  "icons/back-arrow.svg": `${AUTH}/d9b54.svg`,
  "icons/otp-dash.svg": `${OTP}/f879c.svg`,
  "icons/call.svg": `${HOME}/dea60.svg`,
  "icons/wallet.svg": `${HOME}/d8f75.svg`,
  "icons/banner-shape.svg": `${HOME}/37b2b.svg`,
  "icons/ring-lg.svg": `${HOME}/54911.svg`,
  "icons/ring-sm.svg": `${HOME}/9dc8a.svg`,
  "icons/divider.svg": `${HOME}/e5e6b.svg`,
  "icons/radio-empty.svg": `${PRODUCT}/e5619.svg`,
  "icons/radio-filled.svg": `${PRODUCT}/f89fc.svg`,
  "icons/plus.svg": `${PRODUCT}/d4c76.svg`,
  "icons/minus.svg": `${PRODUCT}/8d7c7.svg`,
  // Food photos
  "images/sushi.png": `${HOME}/5f69c.png`,
  "images/curry.png": `${HOME}/500c7.png`,
  "images/lasagna.png": `${HOME}/68e41.png`,
  "images/cupcake.png": `${HOME}/92317.png`,
  "images/pizza.png": `${HOME}/188d6.png`,
  "images/strawberry-shake.png": `${HOME}/10f5e.png`,
  "images/chicken-burger.png": `${HOME}/b3883.png`,
  "images/strawberry-shake-2.png": `${HOME}/9f77f.png`,
};

let failed = 0;
await Promise.all(
  Object.entries(assets).map(async ([file, url]) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length === 0) throw new Error("empty file");
      const out = join(root, file);
      await mkdir(dirname(out), { recursive: true });
      await writeFile(out, buf);
      console.log(`✓ ${file} (${(buf.length / 1024).toFixed(1)} KB)`);
    } catch (err) {
      failed++;
      console.error(`✗ ${file} — ${err.message}`);
    }
  }),
);

if (failed) {
  console.error(`\n${failed} asset(s) failed. The Figma links may have expired — re-export them.`);
  process.exit(1);
}
console.log(`\nAll ${Object.keys(assets).length} assets saved to public/assets`);
