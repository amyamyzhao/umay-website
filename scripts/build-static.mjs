import { cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const outputDirectory = fileURLToPath(new URL("../dist/", import.meta.url));

const siteDirectories = ["blog", "css", "images", "js", "products"];
const siteFiles = [
  "_redirects",
  "about.html",
  "index.html",
  "llms.txt",
  "materials-customization.html",
  "robots.txt",
  "sitemap.xml",
];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

for (const directory of siteDirectories) {
  await cp(
    new URL(`../${directory}/`, import.meta.url),
    new URL(`../dist/${directory}/`, import.meta.url),
    { recursive: true },
  );
}

for (const file of siteFiles) {
  await cp(
    new URL(`../${file}`, import.meta.url),
    new URL(`../dist/${file}`, import.meta.url),
  );
}

console.log(`Prepared Cloudflare static assets in ${outputDirectory}`);
