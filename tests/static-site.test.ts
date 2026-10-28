import { describe, expect, it } from "vitest";
import type { IncomingMessage, ServerResponse } from "node:http";
import { displayLandmarks } from "../src/catalogue";
import { locales } from "../src/locales";
import { renderSocialPreviewPngAsync, renderSocialPreviewSvg } from "../build/social-preview";
import { rejectUnknownHtmlRoute, renderStaticPage } from "../build/static-site";

const shell = '<!doctype html><html lang="en"><head><title data-static-seo>Old</title><meta data-static-seo name="description" content="Old"></head><body><main id="app"><p>Old</p></main><script type="module" src="/assets/app.js"></script></body></html>';

const requestResource = (pathname: string): Readonly<{ next: boolean; status?: number }> => {
  let next = false;
  let ended = false;
  const request = { method: "GET", url: pathname, headers: { accept: "text/html" } } as unknown as IncomingMessage;
  const response = {
    statusCode: 200,
    setHeader: () => undefined,
    end: () => { ended = true; },
  } as unknown as ServerResponse;
  rejectUnknownHtmlRoute(request, response, () => { next = true; });
  return { next, status: ended ? response.statusCode : undefined };
};

describe("static page generation", () => {
  it("renders localized hub and example documents around root-absolute shared assets", () => {
    const hub = renderStaticPage(shell, { locale: "es" }, undefined, locales.es);
    expect(hub).toContain('<html lang="es">');
    expect(hub).toContain('data-prerender-catalogue');
    expect(hub).toContain('rel="canonical" href="https://deciban.bycelium.com/es/"');
    expect(hub).toContain('src="/assets/app.js"');
    expect(hub).not.toContain(">Old<");

    const item = displayLandmarks.find(candidate => candidate.id === "weekday")!;
    const example = renderStaticPage(shell, { locale: "zh", landmarkId: item.id }, item, locales.zh);
    expect(example).toContain('<html lang="zh-Hans">');
    expect(example).toContain('data-prerender-reference');
    expect(example).toContain(`<h1>${locales.zh.landmarks[item.id].title}</h1>`);
    expect(example).not.toContain(`<h2>${locales.zh.landmarks[item.id].title}</h2>`);
    expect(example).toContain('property="og:image:alt"');
    expect(example).toContain('name="twitter:image:type" content="image/png"');
    expect(example).toContain('hreflang="x-default"');
  });

  it("passes generated resources through for browser navigation and rejects unknown dotted pages", () => {
    const landmarkId = displayLandmarks[0].id;
    for (const pathname of [
      "/favicon.svg",
      "/robots.txt",
      "/sitemap.xml",
      "/assets/index-123.js",
      "/assets/index-123.css",
      "/assets/index-123.js.map",
      "/social/neutral/home.png",
      `/social/en/${landmarkId}.png`,
      "/tests/helpers/fake-analytics-provider.ts",
    ]) expect(requestResource(pathname), pathname).toEqual({ next: true, status: undefined });

    for (const pathname of [
      "/missing.html",
      "/assets/missing.html",
      "/social/en/missing.png",
      "/social/unknown/home.png",
      "/tests/helpers/missing.html",
    ]) expect(requestResource(pathname), pathname).toEqual({ next: false, status: 404 });
  });
});

describe("social previews", () => {
  it("renders localized home, artwork and full long titles", () => {
    const item = displayLandmarks.find(candidate => candidate.id === "weekday")!;
    const home = renderSocialPreviewSvg(undefined, locales.fr);
    const event = renderSocialPreviewSvg(item, locales.zh);
    expect(home).toContain(locales.fr.ui.title);
    expect(home).toContain(locales.fr.ui.oddsLabel.replace(/\s*[:：]\s*$/u, ""));
    expect(home).not.toContain(" · odds · ");
    expect(home).toContain('font-family="Noto Sans, sans-serif"');
    expect(home).toContain('x="475"');
    expect(event.replace(/<[^>]+>/g, "")).toContain(locales.zh.landmarks[item.id].title);
    expect(event).toContain(locales.zh.ui.art.weekdayMonday);
    expect(event).toContain('font-family="Noto Sans CJK SC, sans-serif"');
    expect(event).toContain("deciban.bycelium.com");
  });

  it("produces well-formed XML for every localized catalogue preview", () => {
    for (const locale of Object.values(locales)) {
      for (const item of displayLandmarks) {
        const svg = renderSocialPreviewSvg(item, locale);
        const document = new DOMParser().parseFromString(svg, "image/svg+xml");
        expect(document.querySelector("parsererror"), `${locale.code}/${item.id}`).toBeNull();
        expect(svg, `${locale.code}/${item.id}`).not.toMatch(/var\(--/u);
      }
    }
    const clover = displayLandmarks.find(item => item.id === "four-leaf-clover")!;
    expect(renderSocialPreviewSvg(clover, locales.en)).toContain('data-clover-leaf=""');
    const lottery = displayLandmarks.find(item => item.id === "france-loto-jackpot")!;
    const lotterySvg = renderSocialPreviewSvg(lottery, locales.zh);
    expect(lotterySvg).toContain('fill="#f3efe2" stroke="#527b9f"');
    expect(lotterySvg).toContain('font-family="Noto Sans, sans-serif" font-size="31"');
    expect(lotterySvg).toContain("⁻⁶");
  }, 15_000);

  it("rasterizes the production SVG asynchronously", async () => {
    const blackjack = displayLandmarks.find(item => item.id === "blackjack-natural-six-deck")!;
    const svg = renderSocialPreviewSvg(blackjack, locales.en);
    expect(svg).toContain("♠");
    expect(svg).toContain("♥");
    const png = await renderSocialPreviewPngAsync(svg, "en");
    expect([...png.slice(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  });
});
