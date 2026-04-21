import { readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const rootDirectory = process.cwd();
const imagesDirectory = join(rootDirectory, "images");
const outputFile = join(rootDirectory, "gallery-manifest.json");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const excludedFiles = new Set(["aquila-logo.jpg"]);

const images = readdirSync(imagesDirectory)
  .filter((file) => {
    const lowercase = file.toLowerCase();
    return (
      !excludedFiles.has(lowercase) &&
      [...imageExtensions].some((extension) => lowercase.endsWith(extension))
    );
  })
  .sort((a, b) => a.localeCompare(b));

writeFileSync(outputFile, `${JSON.stringify({ images }, null, 2)}\n`);
console.log(`Generated gallery-manifest.json with ${images.length} images.`);
