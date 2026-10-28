#!/usr/bin/env node

import { mkdtemp, mkdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "@playwright/test";

const usage = `Usage: node scripts/capture-social-gif.mjs --url <preview-url> --output <gif-path> [--ffmpeg <path>]`;

const parseArguments = (argumentsList) => {
  const options = { ffmpeg: "ffmpeg" };
  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    if (argument === "--help") {
      console.log(usage);
      process.exit(0);
    }
    if (!argument.startsWith("--")) throw new Error(`Unknown argument: ${argument}\n${usage}`);
    const key = argument.slice(2);
    if (!new Set(["url", "output", "ffmpeg"]).has(key)) throw new Error(`Unknown argument: ${argument}\n${usage}`);
    const value = argumentsList[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for ${argument}\n${usage}`);
    options[key] = value;
    index += 1;
  }
  if (!options.url || !options.output) throw new Error(usage);
  return options;
};

const run = (command, argumentsList) => new Promise((resolveRun, reject) => {
  const child = spawn(command, argumentsList, { stdio: ["ignore", "inherit", "inherit"] });
  child.once("error", error => reject(new Error(`Could not start ${command}: ${error.message}`)));
  child.once("exit", code => code === 0 ? resolveRun() : reject(new Error(`${command} exited with code ${code}`)));
});

const parseGif = async path => {
  const bytes = await readFile(path);
  const header = bytes.subarray(0, 6).toString("ascii");
  const width = bytes.readUInt16LE(6);
  const height = bytes.readUInt16LE(8);
  let frames = 0;
  for (let index = 0; index + 7 < bytes.length; index += 1) {
    if (bytes[index] === 0x21 && bytes[index + 1] === 0xf9 && bytes[index + 2] === 0x04) frames += 1;
  }
  return { header, width, height, frames, bytes: bytes.length };
};

const main = async () => {
  const { url, output, ffmpeg } = parseArguments(process.argv.slice(2));
  const destination = resolve(output);
  const captureDirectory = await mkdtemp(join(tmpdir(), "scale-of-probability-gif-"));
  const framesDirectory = join(captureDirectory, "frames");
  const palette = join(captureDirectory, "palette.png");
  const poster = "/tmp/loto-journey-poster.png";
  const contactSheet = "/tmp/loto-journey-contact-sheet.png";
  const home = new URL("/", url).toString();
  const route = new URL("/en/examples/france-loto-jackpot/", url).toString();
  let browser;

  try {
    await mkdir(framesDirectory, { recursive: true });
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 960, height: 640 }, deviceScaleFactor: 1, colorScheme: "dark" });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.clock.install({ time: new Date("2026-10-28T00:00:00Z") });
    await page.addInitScript(() => {
      localStorage.setItem("probability-scale-locale", "en");
      localStorage.setItem("probability-scale-all-references", "true");
    });
    await page.goto(home, { waitUntil: "networkidle" });
    const intro = page.locator("[data-scale-intro]");
    if (await intro.isVisible()) await intro.locator("[data-dismiss-intro]").click();
    await page.locator(".scale").waitFor();
    await page.clock.pauseAt(new Date("2026-10-28T00:10:00Z"));
    const installOverlay = () => page.evaluate(() => {
      document.querySelector("[data-social-capture-overlay]")?.remove();
      const style = document.createElement("style");
      style.dataset.socialCaptureStyle = "";
      style.textContent = `
        [data-detail-panel], .explorer-tools { display: none !important; }
        [data-social-capture-overlay] { color: #edf4eb; font-family: Georgia, serif; inset: 0; letter-spacing: .01em; pointer-events: none; position: fixed; text-shadow: 0 2px 12px #03101b; z-index: 300; }
        [data-social-capture-title] { color: #d7ebe7; font-size: 16px; position: absolute; right: 30px; text-align: right; top: 53px; }
        [data-social-capture-caption] { background: #0b202de8; border: 1px solid #547984; border-radius: 999px; bottom: 26px; font-size: 19px; left: 50%; padding: 9px 16px; position: absolute; transform: translateX(-50%); white-space: nowrap; }
        [data-social-capture-domain] { color: #9ed6c8; font: 600 14px/1 system-ui, sans-serif; letter-spacing: .08em; position: absolute; right: 30px; text-transform: uppercase; top: 32px; }
      `;
      document.head.append(style);
      const overlay = document.createElement("aside");
      overlay.dataset.socialCaptureOverlay = "";
      overlay.innerHTML = '<span data-social-capture-title>The Scale of Probability</span><span data-social-capture-caption></span><span data-social-capture-domain>deciban.bycelium.com</span>';
      document.body.append(overlay);
    });
    await installOverlay();

    const scale = page.locator(".scale");
    const returnToZero = page.locator("[data-return-zero]");
    const setCaption = caption => page.locator("[data-social-capture-caption]").evaluate((element, text) => { element.textContent = text; }, caption);
    let frame = 0;
    const capture = async () => {
      await page.screenshot({ path: join(framesDirectory, `frame-${String(frame).padStart(4, "0")}.png`) });
      frame += 1;
    };
    const captureFor = async (milliseconds, caption) => {
      await setCaption(caption);
      for (let elapsed = 0; elapsed < milliseconds; elapsed += 50) {
        await capture();
        await page.clock.runFor(50);
      }
    };
    const captureJourney = async (start, arrived, caption) => {
      await setCaption(caption);
      await start();
      await setCaption(caption);
      for (let elapsed = 0; elapsed < 3_500; elapsed += 50) {
        await capture();
        await page.clock.runFor(50);
        if (await arrived()) break;
      }
      if (!await arrived()) throw new Error("Timed out while waiting for the radial journey to finish");
    };

    await captureFor(1_150, "0 dBan · Probability 50%");
    await captureJourney(
      async () => {
        await page.goto(route, { waitUntil: "domcontentloaded" });
        await page.locator(".scale").waitFor();
        await installOverlay();
        const routeIntro = page.locator("[data-scale-intro]");
        if (await routeIntro.isVisible()) await routeIntro.locator("[data-dismiss-intro]").click();
      },
      () => scale.evaluate(element => !element.dataset.fastForward && Number(element.dataset.depth) < -70),
      "Travelling inward through the scale",
    );
    await captureFor(1_700, "France Loto jackpot · 1 in 19,068,840 · −72.8 dBan");
    await page.screenshot({ path: poster });
    await captureJourney(
      () => returnToZero.evaluate(button => button.click()),
      () => scale.evaluate(element => !element.dataset.fastForward && Number(element.dataset.depth) === 0),
      "Returning to 0 dBan",
    );
    await captureFor(450, "0 dBan · Probability 50%");

    await mkdir(dirname(destination), { recursive: true });
    const framePattern = join(framesDirectory, "frame-%04d.png");
    await run(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", "-framerate", "20", "-i", framePattern, "-vf", "fps=20,scale=960:640:flags=lanczos,palettegen=stats_mode=diff", "-frames:v", "1", "-update", "1", palette]);
    await run(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", "-framerate", "20", "-i", framePattern, "-i", palette, "-lavfi", "fps=20,scale=960:640:flags=lanczos[x];[x][1:v]paletteuse=dither=sierra2_4a", "-loop", "0", destination]);
    await run(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", "-framerate", "20", "-i", framePattern, "-vf", "select='eq(n,0)+eq(n,30)+eq(n,60)+eq(n,90)+eq(n,120)',scale=480:320,tile=5x1", "-frames:v", "1", "-update", "1", contactSheet]);
    const gif = await parseGif(destination);
    if ((gif.header !== "GIF87a" && gif.header !== "GIF89a") || gif.width !== 960 || gif.height !== 640 || gif.frames < 100) {
      throw new Error(`Invalid GIF: ${JSON.stringify(gif)}`);
    }
    console.log(`Created ${destination}`);
    console.log(`GIF ${gif.header}, ${gif.width}x${gif.height}, ${gif.frames} frames, ${(gif.bytes / 1024 / 1024).toFixed(2)} MiB`);
    console.log(`Poster: ${poster}`);
    console.log(`Contact sheet: ${contactSheet}`);
  } finally {
    await browser?.close();
    await rm(captureDirectory, { recursive: true, force: true });
  }
};

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
