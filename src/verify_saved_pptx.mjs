import { createRequire } from "module";
import { pathToFileURL } from "url";
import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const artifactPath = require.resolve("@oai/artifact-tool");
const { PresentationFile } = await import(pathToFileURL(artifactPath).href);

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const pptxPath = join(rootDir, "output", "BugAuraLabs_pitch_deck.pptx");
const parityDir = join(rootDir, "scratch", "pptx-parity");
mkdirSync(parityDir, { recursive: true });

const bytes = readFileSync(pptxPath);
const deck = await PresentationFile.importPptx(bytes);

async function saveBlob(blob, path) {
  if (blob && typeof blob.save === "function") {
    await blob.save(path);
    return;
  }
  if (blob && typeof blob.arrayBuffer === "function") {
    writeFileSync(path, Buffer.from(await blob.arrayBuffer()));
    return;
  }
  if (Buffer.isBuffer(blob) || blob instanceof Uint8Array) {
    writeFileSync(path, blob);
    return;
  }
  throw new Error(`Unsupported blob for ${path}`);
}

for (let i = 0; i < deck.slides.count; i += 1) {
  const slide = deck.slides.getItem(i);
  const png = await slide.export({ format: "png", width: 1920 });
  await saveBlob(png, join(parityDir, `slide-${String(i + 1).padStart(2, "0")}.png`));
}

const report = await deck.inspect({ kind: "textbox,shape,slide", maxChars: 50000 });
writeFileSync(join(parityDir, "inspect.ndjson"), report.ndjson ?? String(report));

console.log(`Imported saved PPTX with ${deck.slides.count} slides`);
console.log(`Saved parity previews to ${parityDir}`);
