// Generate PWA and Apple icons from the canonical public/logo.svg.
// Run: node scripts/generate-icons.mjs
import { readFile, mkdir } from "node:fs/promises";
import sharp from "sharp";

const logo = await readFile(new URL("../public/logo.svg", import.meta.url));
const output = new URL("../public/icons/", import.meta.url);
await mkdir(output, { recursive: true });

for (const size of [192, 512]) {
  await sharp(logo, { density: 300 })
    .resize(size, size)
    .png()
    .toFile(new URL(`logo-${size}.png`, output).pathname);
}
// Keep the entire mark inside the 80% safe zone for maskable icons.
const mark = await sharp(logo, { density: 300 }).resize(400, 400).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: "#fd874c" } })
  .composite([{ input: mark, gravity: "centre" }])
  .png()
  .toFile(new URL("logo-maskable-512.png", output).pathname);
// iOS expects an opaque touch icon.
await sharp(logo, { density: 300 })
  .resize(180, 180)
  .flatten({ background: "#fd874c" })
  .png()
  .toFile(new URL("logo-apple-touch.png", output).pathname);
