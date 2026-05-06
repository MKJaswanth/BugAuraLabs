import { createRequire } from "module";
import { pathToFileURL } from "url";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { mkdirSync, writeFileSync } from "fs";

const require = createRequire(import.meta.url);
const artifactPath = require.resolve("@oai/artifact-tool");
const {
  Presentation,
  PresentationFile,
  column,
  row,
  grid,
  layers,
  panel,
  text,
  shape,
  rule,
  fill,
  hug,
  fixed,
  wrap,
  grow,
  fr,
  auto,
} = await import(pathToFileURL(artifactPath).href);

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const outputDir = join(rootDir, "output");
const previewDir = join(rootDir, "scratch", "previews");
mkdirSync(outputDir, { recursive: true });
mkdirSync(previewDir, { recursive: true });

const W = 1920;
const H = 1080;

const C = {
  ink: "#07100E",
  forest: "#0A2925",
  deep: "#10211E",
  teal: "#006E61",
  mint: "#CCEFE2",
  gold: "#D59B3B",
  copper: "#B9543F",
  cream: "#F7F3E8",
  paper: "#FFFDF7",
  line: "#D5D9CF",
  muted: "#56615D",
  white: "#FFFFFF",
};

const FONT = {
  display: "Aptos Display",
  body: "Aptos",
  serif: "Georgia",
};

const presentation = Presentation.create({
  slideSize: { width: W, height: H },
});

function bgSlide(slide, content, opts = {}) {
  const fillColor = opts.fill ?? C.cream;
  slide.compose(
    layers(
      { name: "root", width: fill, height: fill },
      [
        shape({ name: "background", width: fill, height: fill, fill: fillColor }),
        content,
      ],
    ),
    { frame: { left: 0, top: 0, width: W, height: H }, baseUnit: 8 },
  );
}

function foot(note, color = C.muted) {
  return text(note, {
    name: "footer",
    width: fill,
    height: hug,
    style: { fontFamily: FONT.body, fontSize: 19, color },
  });
}

function chip(label, opts = {}) {
  return panel(
    {
      name: `chip-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      width: hug,
      height: hug,
      padding: { x: 18, y: 9 },
      fill: opts.fill ?? C.deep,
      borderRadius: "rounded-full",
    },
    text(label, {
      name: "chip-text",
      width: hug,
      height: hug,
      style: {
        fontFamily: FONT.body,
        fontSize: opts.fontSize ?? 20,
        bold: true,
        color: opts.color ?? C.mint,
      },
    }),
  );
}

function openTitle(title, subtitle, color = C.ink, subtitleColor = C.muted) {
  return column(
    { name: "title-stack", width: fill, height: hug, gap: 22 },
    [
      text(title, {
        name: "slide-title",
        width: wrap(1280),
        height: hug,
        style: {
          fontFamily: FONT.display,
          fontSize: 62,
          bold: true,
          color,
        },
      }),
      text(subtitle, {
        name: "slide-subtitle",
        width: wrap(1160),
        height: hug,
        style: {
          fontFamily: FONT.body,
          fontSize: 25,
          color: subtitleColor,
          lineSpacingMultiple: 1.22,
        },
      }),
    ],
  );
}

function priceColumn(name, price, details, accent, featured = false) {
  return panel(
    {
      name: `price-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      width: fill,
      height: fixed(520),
      padding: { x: 32, y: 32 },
      fill: featured ? C.forest : C.paper,
      borderRadius: 10,
    },
    column(
      { name: "price-content", width: fill, height: fill, gap: 18 },
      [
        text(name, {
          name: "price-name",
          width: fill,
          height: hug,
          style: { fontFamily: FONT.body, fontSize: 25, bold: true, color: featured ? C.mint : C.forest },
        }),
        text(price, {
          name: "price-value",
          width: fill,
          height: hug,
          style: { fontFamily: FONT.display, fontSize: 46, bold: true, color: featured ? C.gold : accent },
        }),
        rule({ name: "price-rule", width: fill, stroke: featured ? "#31514A" : C.line, weight: 2 }),
        text(details.join("\n"), {
          name: "price-details",
          width: fill,
          height: hug,
          style: {
            fontFamily: FONT.body,
            fontSize: 22,
            color: featured ? C.mint : C.muted,
            lineSpacingMultiple: 1.28,
          },
        }),
      ],
    ),
  );
}

function addCover() {
  const slide = presentation.slides.add();
  bgSlide(
    slide,
    layers(
      { name: "cover-stage", width: fill, height: fill },
      [
        shape({ name: "cover-bg", width: fill, height: fill, fill: C.ink }),
        grid(
          {
            name: "cover-grid",
            width: fill,
            height: fill,
            padding: { x: 112, y: 84 },
            columns: [fr(1)],
            rows: [auto, fr(1), auto],
          },
          [
            row(
              { name: "cover-top", width: fill, height: hug, justify: "between", align: "center" },
              [
                text("BugAuraLabs", {
                  name: "brand",
                  width: hug,
                  height: hug,
                  style: { fontFamily: FONT.display, fontSize: 34, bold: true, color: C.white },
                }),
                chip("Release-risk QA audits", { fill: "#122924", color: C.mint }),
              ],
            ),
            column(
              { name: "cover-main", width: fill, height: fill, justify: "center", gap: 34 },
              [
                text("Proof before production.", {
                  name: "cover-title",
                  width: wrap(1220),
                  height: hug,
                  style: {
                    fontFamily: FONT.serif,
                    fontSize: 118,
                    bold: true,
                    color: C.white,
                    lineSpacingMultiple: 0.9,
                  },
                }),
                text("A premium manual audit for agencies, ecommerce builders and MVP teams who need confidence before a client handoff, founder demo or public launch.", {
                  name: "cover-subtitle",
                  width: wrap(980),
                  height: hug,
                  style: { fontFamily: FONT.body, fontSize: 31, color: C.mint, lineSpacingMultiple: 1.18 },
                }),
              ],
            ),
            row(
              { name: "cover-bottom", width: fill, height: hug, justify: "between", align: "end" },
              [
                text("48-hour scoped audits | Evidence-backed reports | Clear fix priority", {
                  name: "cover-note",
                  width: wrap(980),
                  height: hug,
                  style: { fontFamily: FONT.body, fontSize: 22, bold: true, color: C.gold },
                }),
                text("May 2026", {
                  name: "cover-date",
                  width: hug,
                  height: hug,
                  style: { fontFamily: FONT.body, fontSize: 20, color: "#7EA79B" },
                }),
              ],
            ),
          ],
        ),
        shape({ name: "gold-spine", width: fixed(12), height: fill, fill: C.gold }),
      ],
    ),
    { fill: C.ink },
  );
}

function addTrustMoments() {
  const slide = presentation.slides.add();
  bgSlide(
    slide,
    grid(
      {
        name: "trust-grid",
        width: fill,
        height: fill,
        padding: { x: 104, y: 76 },
        columns: [fr(1)],
        rows: [auto, fr(1), auto],
        rowGap: 44,
      },
      [
        openTitle(
          "Clients don’t judge code. They judge trust moments.",
          "The risky parts are the moments where a buyer, founder, or client expects the product to simply work.",
        ),
        grid(
          {
            name: "moments",
            width: fill,
            height: fill,
            columns: [fr(1), fr(1), fr(1)],
            columnGap: 42,
          },
          [
            column({ name: "moment-1", width: fill, height: fill, gap: 16 }, [
              text("01", { name: "m1-num", width: fill, height: hug, style: { fontFamily: FONT.display, fontSize: 38, bold: true, color: C.gold } }),
              text("Decision paths", { name: "m1-title", width: fill, height: hug, style: { fontFamily: FONT.display, fontSize: 36, bold: true, color: C.forest } }),
              text("Where users choose, compare, sign up, enquire, book or buy. These paths decide whether confidence grows or leaks away.", { name: "m1-copy", width: fill, height: hug, style: { fontFamily: FONT.body, fontSize: 25, color: C.muted, lineSpacingMultiple: 1.22 } }),
            ]),
            column({ name: "moment-2", width: fill, height: fill, gap: 16 }, [
              text("02", { name: "m2-num", width: fill, height: hug, style: { fontFamily: FONT.display, fontSize: 38, bold: true, color: C.teal } }),
              text("Handoff pressure", { name: "m2-title", width: fill, height: hug, style: { fontFamily: FONT.display, fontSize: 36, bold: true, color: C.forest } }),
              text("Agencies ship under deadlines. A focused external audit catches visible risk before the client, founder, or campaign traffic does.", { name: "m2-copy", width: fill, height: hug, style: { fontFamily: FONT.body, fontSize: 25, color: C.muted, lineSpacingMultiple: 1.22 } }),
            ]),
            column({ name: "moment-3", width: fill, height: fill, gap: 16 }, [
              text("03", { name: "m3-num", width: fill, height: hug, style: { fontFamily: FONT.display, fontSize: 38, bold: true, color: C.copper } }),
              text("Launch polish", { name: "m3-title", width: fill, height: hug, style: { fontFamily: FONT.display, fontSize: 36, bold: true, color: C.forest } }),
              text("The final layer is not decoration. It is clarity, working feedback, clean mobile behavior and no unfinished production signals.", { name: "m3-copy", width: fill, height: hug, style: { fontFamily: FONT.body, fontSize: 25, color: C.muted, lineSpacingMultiple: 1.22 } }),
            ]),
          ],
        ),
        foot("BugAuraLabs positions QA as trust protection, not generic testing."),
      ],
    ),
  );
}

function addOffer() {
  const slide = presentation.slides.add();
  bgSlide(
    slide,
    grid(
      {
        name: "offer-grid",
        width: fill,
        height: fill,
        padding: { x: 104, y: 76 },
        columns: [fr(1)],
        rows: [auto, fr(1), auto],
        rowGap: 42,
      },
      [
        openTitle(
          "We verify the flows that carry reputation.",
          "A scoped audit turns vague quality worries into a prioritized release decision.",
        ),
        grid(
          {
            name: "offer-table",
            width: fill,
            height: fill,
            columns: [fr(0.95), fr(1.25)],
            columnGap: 58,
          },
          [
            column(
              { name: "offer-left", width: fill, height: fill, justify: "center", gap: 22 },
              [
                text("Trust-flow inspection", {
                  name: "offer-hero",
                  width: wrap(680),
                  height: hug,
                  style: { fontFamily: FONT.serif, fontSize: 56, bold: true, color: C.forest },
                }),
                text("Manual, evidence-led, and focused on the moments that make a product feel ready.", {
                  name: "offer-hero-copy",
                  width: wrap(640),
                  height: hug,
                  style: { fontFamily: FONT.body, fontSize: 27, color: C.muted, lineSpacingMultiple: 1.2 },
                }),
              ],
            ),
            column(
              { name: "offer-right", width: fill, height: fill, gap: 24, justify: "center" },
              [
                row({ name: "row-a", width: fill, height: hug, gap: 24 }, [
                  chip("Journey", { fill: C.forest, color: C.mint }),
                  text("Critical paths behave cleanly from first click to final confirmation.", { name: "row-a-copy", width: fill, height: hug, style: { fontFamily: FONT.body, fontSize: 24, color: C.ink } }),
                ]),
                row({ name: "row-b", width: fill, height: hug, gap: 24 }, [
                  chip("Signals", { fill: C.teal, color: C.white }),
                  text("Inputs, feedback, redirects and state changes give the right message at the right time.", { name: "row-b-copy", width: fill, height: hug, style: { fontFamily: FONT.body, fontSize: 24, color: C.ink } }),
                ]),
                row({ name: "row-c", width: fill, height: hug, gap: 24 }, [
                  chip("Devices", { fill: C.gold, color: C.ink }),
                  text("Mobile and desktop interactions stay usable, aligned and persuasive.", { name: "row-c-copy", width: fill, height: hug, style: { fontFamily: FONT.body, fontSize: 24, color: C.ink } }),
                ]),
                row({ name: "row-d", width: fill, height: hug, gap: 24 }, [
                  chip("Polish", { fill: C.copper, color: C.white }),
                  text("Launch-facing content feels finished, credible and safe to show a client.", { name: "row-d-copy", width: fill, height: hug, style: { fontFamily: FONT.body, fontSize: 24, color: C.ink } }),
                ]),
              ],
            ),
          ],
        ),
        foot("Best for web agencies, ecommerce builders, MVP studios and founders close to launch."),
      ],
    ),
  );
}

function addWorkflow() {
  const slide = presentation.slides.add();
  bgSlide(
    slide,
    grid(
      {
        name: "workflow-grid",
        width: fill,
        height: fill,
        padding: { x: 104, y: 76 },
        columns: [fr(1)],
        rows: [auto, fr(1), auto],
        rowGap: 48,
      },
      [
        openTitle("Simple engagement. Serious clarity.", "A buyer should never need QA jargon to understand what happened, what matters, and what to fix first."),
        grid(
          {
            name: "steps-grid",
            width: fill,
            height: fill,
            columns: [fr(1), fr(1), fr(1), fr(1)],
            columnGap: 24,
          },
          [
            column({ name: "step-1", width: fill, height: fill, gap: 16 }, [
              text("01", { name: "s1-num", width: fill, height: hug, style: { fontFamily: FONT.display, fontSize: 48, bold: true, color: C.gold } }),
              text("Scope the risk", { name: "s1-title", width: fill, height: hug, style: { fontFamily: FONT.display, fontSize: 35, bold: true, color: C.forest } }),
              text("Pick the 3-8 journeys that decide trust: signup, enquiry, purchase, dashboard, booking, lead flow, or mobile path.", { name: "s1-copy", width: fill, height: hug, style: { fontFamily: FONT.body, fontSize: 23, color: C.muted, lineSpacingMultiple: 1.2 } }),
            ]),
            column({ name: "step-2", width: fill, height: fill, gap: 16 }, [
              text("02", { name: "s2-num", width: fill, height: hug, style: { fontFamily: FONT.display, fontSize: 48, bold: true, color: C.teal } }),
              text("Inspect like a user", { name: "s2-title", width: fill, height: hug, style: { fontFamily: FONT.display, fontSize: 35, bold: true, color: C.forest } }),
              text("Manual checks across expected behavior, edge states, mobile usability, messages, links, and business rules.", { name: "s2-copy", width: fill, height: hug, style: { fontFamily: FONT.body, fontSize: 23, color: C.muted, lineSpacingMultiple: 1.2 } }),
            ]),
            column({ name: "step-3", width: fill, height: fill, gap: 16 }, [
              text("03", { name: "s3-num", width: fill, height: hug, style: { fontFamily: FONT.display, fontSize: 48, bold: true, color: C.copper } }),
              text("Report with evidence", { name: "s3-title", width: fill, height: hug, style: { fontFamily: FONT.display, fontSize: 35, bold: true, color: C.forest } }),
              text("Each finding includes impact, reproduction steps, visual proof, severity, and a fix-priority recommendation.", { name: "s3-copy", width: fill, height: hug, style: { fontFamily: FONT.body, fontSize: 23, color: C.muted, lineSpacingMultiple: 1.2 } }),
            ]),
            column({ name: "step-4", width: fill, height: fill, gap: 16 }, [
              text("04", { name: "s4-num", width: fill, height: hug, style: { fontFamily: FONT.display, fontSize: 48, bold: true, color: C.forest } }),
              text("Verify the fixes", { name: "s4-title", width: fill, height: hug, style: { fontFamily: FONT.display, fontSize: 35, bold: true, color: C.forest } }),
              text("Optional retest confirms whether launch-blockers are resolved before the product reaches real users.", { name: "s4-copy", width: fill, height: hug, style: { fontFamily: FONT.body, fontSize: 23, color: C.muted, lineSpacingMultiple: 1.2 } }),
            ]),
          ],
        ),
        foot("Starter scoped audits can be delivered in 48 hours when access and scope are ready."),
      ],
    ),
  );
}

function addDeliverables() {
  const slide = presentation.slides.add();
  bgSlide(
    slide,
    grid(
      {
        name: "deliverables",
        width: fill,
        height: fill,
        padding: { x: 104, y: 76 },
        columns: [fr(1)],
        rows: [auto, fr(1), auto],
        rowGap: 40,
      },
      [
        openTitle("What you receive is built for action.", "No vague feedback. No noise. Just a launch-readiness view that helps the team decide what to fix first."),
        grid(
          {
            name: "deliverable-grid",
            width: fill,
            height: fill,
            columns: [fr(1), fr(1)],
            rows: [fr(1), fr(1)],
            columnGap: 46,
            rowGap: 30,
          },
          [
            column({ name: "d1", width: fill, height: fill, gap: 10 }, [
              text("Risk ledger", { name: "d1-title", width: fill, height: hug, style: { fontFamily: FONT.display, fontSize: 38, bold: true, color: C.forest } }),
              text("A clean list of findings grouped by impact, priority and user/business risk.", { name: "d1-copy", width: fill, height: hug, style: { fontFamily: FONT.body, fontSize: 24, color: C.muted } }),
            ]),
            column({ name: "d2", width: fill, height: fill, gap: 10 }, [
              text("Evidence trail", { name: "d2-title", width: fill, height: hug, style: { fontFamily: FONT.display, fontSize: 38, bold: true, color: C.forest } }),
              text("Screenshots, exact steps and expected behavior so developers can reproduce quickly.", { name: "d2-copy", width: fill, height: hug, style: { fontFamily: FONT.body, fontSize: 24, color: C.muted } }),
            ]),
            column({ name: "d3", width: fill, height: fill, gap: 10 }, [
              text("Go / hold recommendation", { name: "d3-title", width: fill, height: hug, style: { fontFamily: FONT.display, fontSize: 38, bold: true, color: C.forest } }),
              text("A short release note explaining whether the current build is safe to show, ship or demo.", { name: "d3-copy", width: fill, height: hug, style: { fontFamily: FONT.body, fontSize: 24, color: C.muted } }),
            ]),
            column({ name: "d4", width: fill, height: fill, gap: 10 }, [
              text("White-label option", { name: "d4-title", width: fill, height: hug, style: { fontFamily: FONT.display, fontSize: 38, bold: true, color: C.forest } }),
              text("For agencies, reports can support your delivery process without confusing the client relationship.", { name: "d4-copy", width: fill, height: hug, style: { fontFamily: FONT.body, fontSize: 24, color: C.muted } }),
            ]),
          ],
        ),
        foot("The report language is business-readable first, developer-useful second."),
      ],
    ),
  );
}

function addPricing() {
  const slide = presentation.slides.add();
  bgSlide(
    slide,
    grid(
      {
        name: "pricing-grid",
        width: fill,
        height: fill,
        padding: { x: 104, y: 76 },
        columns: [fr(1)],
        rows: [auto, fr(1), auto],
        rowGap: 34,
      },
      [
        openTitle("Pricing that makes the first yes easy.", "Start with one scoped audit. Expand only when the value is clear."),
        grid(
          {
            name: "prices",
            width: fill,
            height: fill,
            columns: [fr(1), fr(1), fr(1)],
            columnGap: 28,
          },
          [
            priceColumn("Starter Audit", "INR 3k-5k", ["48-hour scoped review", "3-5 critical journeys", "Evidence report + priority map", "Best for first BugAuraLabs clients"], C.teal),
            priceColumn("Launch Audit", "INR 7.5k-12k", ["5-8 high-risk journeys", "Mobile + desktop confidence pass", "Go / hold summary", "One fix-verification round"], C.gold, true),
            priceColumn("Agency Partner", "INR 15k+/mo", ["Repeat audits for active projects", "White-label report option", "Priority turnaround", "Lightweight QA checklist library"], C.copper),
          ],
        ),
        foot("Early-client pricing is negotiable by scope. Final quote depends on access, number of flows, devices and retest needs."),
      ],
    ),
  );
}

function addAudience() {
  const slide = presentation.slides.add();
  bgSlide(
    slide,
    grid(
      {
        name: "audience-grid",
        width: fill,
        height: fill,
        padding: { x: 104, y: 76 },
        columns: [fr(1)],
        rows: [auto, fr(1), auto],
        rowGap: 46,
      },
      [
        openTitle("Best-fit clients are already shipping.", "BugAuraLabs works best when a team has real users, client delivery pressure or launch traffic coming soon."),
        grid(
          {
            name: "fit-grid",
            width: fill,
            height: fill,
            columns: [fr(1.05), fr(0.95)],
            columnGap: 70,
          },
          [
            column({ name: "fit-left", width: fill, height: fill, gap: 26, justify: "center" }, [
              text("Ideal fit", { name: "fit-head", width: fill, height: hug, style: { fontFamily: FONT.display, fontSize: 34, bold: true, color: C.gold } }),
              text("Small web/app agencies\nEcommerce builders\nMVP studios\nFounders preparing demos\nFreelancers with client delivery risk", {
                name: "fit-list",
                width: fill,
                height: hug,
                style: { fontFamily: FONT.serif, fontSize: 48, bold: true, color: C.forest, lineSpacingMultiple: 1.08 },
              }),
            ]),
            column({ name: "fit-right", width: fill, height: fill, gap: 26, justify: "center" }, [
              text("Not the fit", { name: "not-fit-head", width: fill, height: hug, style: { fontFamily: FONT.display, fontSize: 34, bold: true, color: C.copper } }),
              text("Huge enterprise QA replacements\nLong automation builds first\nUnscoped open-ended testing\nProjects with no launch goal", {
                name: "not-fit-list",
                width: fill,
                height: hug,
                style: { fontFamily: FONT.body, fontSize: 31, color: C.muted, lineSpacingMultiple: 1.22 },
              }),
            ]),
          ],
        ),
        foot("Positioning: an external release-confidence layer, not a generic full-time QA department."),
      ],
    ),
  );
}

function addClose() {
  const slide = presentation.slides.add();
  bgSlide(
    slide,
    layers(
      { name: "close-stage", width: fill, height: fill },
      [
        shape({ name: "close-bg", width: fill, height: fill, fill: C.forest }),
        grid(
          {
            name: "close-grid",
            width: fill,
            height: fill,
            padding: { x: 112, y: 88 },
            columns: [fr(1)],
            rows: [fr(1), auto],
          },
          [
            column({ name: "close-main", width: fill, height: fill, justify: "center", gap: 30 }, [
              text("Pilot one project.", {
                name: "close-title",
                width: wrap(1000),
                height: hug,
                style: { fontFamily: FONT.serif, fontSize: 104, bold: true, color: C.white, lineSpacingMultiple: 0.92 },
              }),
              text("Send one live or staging build. BugAuraLabs will inspect the trust flows, return the evidence, and show exactly what deserves attention before launch.", {
                name: "close-copy",
                width: wrap(1040),
                height: hug,
                style: { fontFamily: FONT.body, fontSize: 31, color: C.mint, lineSpacingMultiple: 1.18 },
              }),
              row({ name: "close-chips", width: fill, height: hug, gap: 16 }, [
                chip("Scope in 15 minutes", { fill: C.gold, color: C.ink }),
                chip("Report in 48 hours", { fill: "#173B35", color: C.mint }),
                chip("Fix priority included", { fill: "#173B35", color: C.mint }),
              ]),
            ]),
            row({ name: "contact", width: fill, height: hug, justify: "between", align: "end" }, [
              text("BugAuraLabs", { name: "close-brand", width: hug, height: hug, style: { fontFamily: FONT.display, fontSize: 36, bold: true, color: C.white } }),
              text("jaswanth.mk63@gmail.com  |  +91 63743 76247", { name: "close-contact", width: hug, height: hug, style: { fontFamily: FONT.body, fontSize: 24, bold: true, color: C.gold } }),
            ]),
          ],
        ),
        shape({ name: "close-spine", width: fixed(12), height: fill, fill: C.gold }),
      ],
    ),
    { fill: C.forest },
  );
}

addCover();
addTrustMoments();
addOffer();
addWorkflow();
addDeliverables();
addPricing();
addAudience();
addClose();

const pptx = await PresentationFile.exportPptx(presentation);
const pptxPath = join(outputDir, "BugAuraLabs_pitch_deck.pptx");
await pptx.save(pptxPath);

async function saveArtifactBlob(blob, path) {
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
  throw new Error(`Unsupported export blob for ${path}`);
}

for (let i = 0; i < presentation.slides.count; i += 1) {
  const slide = presentation.slides.getItem(i);
  const png = await slide.export({ format: "png", width: 1920 });
  await saveArtifactBlob(png, join(previewDir, `slide-${String(i + 1).padStart(2, "0")}.png`));
}

const layoutBlob = await presentation.export({ format: "layout" });
await saveArtifactBlob(layoutBlob, join(outputDir, "BugAuraLabs_pitch_deck.layout.json"));

writeFileSync(
  join(outputDir, "BugAuraLabs_pitch_deck_sources.txt"),
  [
    "Positioning reference scan:",
    "QAura - launch readiness audits / release confidence",
    "SpecGrade QA - evidence-backed inspections / 48-hour turnaround",
    "On Tap - outsourced QA for ecommerce and agencies",
    "ReleaseReady QA - go/hold recommendation for startup teams",
    "PLUS QA - web and mobile launch quality support",
  ].join("\n"),
);

console.log(`Created ${pptxPath}`);
console.log(`Rendered previews to ${previewDir}`);
