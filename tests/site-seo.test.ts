import { beforeEach, describe, expect, it } from "vitest";
import { displayLandmarks } from "../src/catalogue";
import { locales } from "../src/locales";
import { buildSiteMetadata, localeLanguageTag, routeLanguageLinks, socialImagePath, updateDocumentMetadata } from "../src/seo";
import { parseSiteRoute, SITE_ORIGIN, sitePath, siteUrl } from "../src/site";

describe("site routes", () => {
  it("parses neutral and pinned hub and example paths", () => {
    expect(parseSiteRoute("/")).toEqual({});
    expect(parseSiteRoute("/en/")).toEqual({ locale: "en" });
    expect(parseSiteRoute("/examples/coin-heads/")).toEqual({ landmarkId: "coin-heads" });
    expect(parseSiteRoute("/zh/examples/coin-heads")).toEqual({ locale: "zh", landmarkId: "coin-heads" });
    expect(parseSiteRoute("/%65n/examples/coin-heads/")).toEqual({ locale: "en", landmarkId: "coin-heads" });
  });

  it("rejects malformed, unknown and non-path inputs", () => {
    for (const path of ["en/", "/de/", "/en/extra/", "/examples/missing/", "/en/examples/", "/en//", "/%E0%A4%A", "/?x=1", "/#x"]) {
      expect(parseSiteRoute(path)).toBeNull();
    }
  });

  it("creates one canonical trailing-slash form", () => {
    expect(SITE_ORIGIN).toBe("https://deciban.bycelium.com");
    expect(sitePath({})).toBe("/");
    expect(sitePath({ locale: "fr" })).toBe("/fr/");
    expect(sitePath({ landmarkId: "coin-heads" })).toBe("/examples/coin-heads/");
    expect(sitePath({ locale: "es", landmarkId: "coin-heads" })).toBe("/es/examples/coin-heads/");
    expect(siteUrl({ locale: "fr" })).toBe("https://deciban.bycelium.com/fr/");
  });
});

describe("SEO metadata", () => {
  beforeEach(() => {
    document.documentElement.innerHTML = "<head></head><body></body>";
  });

  it("builds reciprocal localized metadata and JSON-LD for an example", () => {
    const item = displayLandmarks.find(candidate => candidate.id === "password-123456")!;
    const metadata = buildSiteMetadata({ locale: "fr", landmarkId: item.id }, item, locales.fr);
    expect(metadata.title).toContain(locales.fr.landmarks[item.id].title);
    expect(metadata.description.length).toBeLessThanOrEqual(180);
    expect(metadata.canonicalUrl).toBe(`${SITE_ORIGIN}/fr/examples/${item.id}/`);
    expect(metadata.imageUrl).toBe(`${SITE_ORIGIN}/social/fr/${item.id}.png`);
    expect(metadata.imageAlt).toBe(locales.fr.landmarks[item.id].title);
    expect(metadata.siteName).toBe(locales.fr.ui.title);
    expect(metadata.locale).toBe("fr_FR");
    expect(metadata.alternates).toHaveLength(5);
    expect(metadata.alternates.at(-1)).toEqual({ hreflang: "x-default", href: `${SITE_ORIGIN}/examples/${item.id}/` });
    expect(JSON.stringify(metadata.jsonLd)).toContain('"about"');
    expect(JSON.stringify(metadata.jsonLd)).toContain('"citation"');
    expect(JSON.stringify(metadata.jsonLd)).toContain('"Bycelium"');
    const uncited = displayLandmarks.find(candidate => candidate.id === "coin-heads")!;
    expect(JSON.stringify(buildSiteMetadata({ landmarkId: uncited.id }, uncited, locales.en).jsonLd)).not.toContain('"citation"');
  });

  it("provides concise localized home descriptions and image paths", () => {
    for (const locale of Object.values(locales)) {
      const metadata = buildSiteMetadata({ locale: locale.code }, undefined, locale);
      expect(metadata.description.length).toBeGreaterThan(20);
      expect(metadata.imageAlt).toBe(locale.ui.title);
      expect(JSON.stringify(metadata.jsonLd)).not.toContain('"about"');
      expect(localeLanguageTag(locale.code)).toBe(metadata.alternates.find(link => link.href === siteUrl({ locale: locale.code }))?.hreflang);
    }
    expect(socialImagePath({})).toBe("/social/neutral/home.png");
    expect(socialImagePath({ locale: "zh", landmarkId: "coin-heads" })).toBe("/social/zh/coin-heads.png");
  });

  it("shortens long descriptions at a useful boundary", () => {
    const item = displayLandmarks.find(candidate => candidate.id === "coin-heads")!;
    const spacedLocale = {
      ...locales.en,
      landmarks: { ...locales.en.landmarks, [item.id]: { ...locales.en.landmarks[item.id], explanation: "probability ".repeat(30) } },
    };
    const unspacedLocale = {
      ...locales.en,
      landmarks: { ...locales.en.landmarks, [item.id]: { ...locales.en.landmarks[item.id], explanation: "x".repeat(220) } },
    };
    expect(buildSiteMetadata({ landmarkId: item.id }, item, spacedLocale).description).toMatch(/…$/u);
    expect(buildSiteMetadata({ landmarkId: item.id }, item, unspacedLocale).description).toHaveLength(180);
  });

  it("updates and reuses document metadata nodes", () => {
    const item = displayLandmarks.find(candidate => candidate.id === "coin-heads")!;
    const route = { locale: "zh", landmarkId: item.id } as const;
    updateDocumentMetadata(route, item, locales.zh);
    updateDocumentMetadata(route, item, locales.zh);
    expect(document.documentElement.lang).toBe("zh-Hans");
    expect(document.title).toContain(locales.zh.landmarks[item.id].title);
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(siteUrl(route));
    expect(document.querySelectorAll('link[rel="alternate"]')).toHaveLength(5);
    expect(document.querySelector('meta[property="og:image:alt"]')?.getAttribute("content")).toBe(locales.zh.landmarks[item.id].title);
    expect([...document.querySelectorAll('meta[property="og:locale:alternate"]')].map(node => node.getAttribute("content"))).toEqual(["en_US", "fr_FR", "es_ES"]);
    expect(document.querySelector('meta[name="twitter:image:type"]')?.getAttribute("content")).toBe("image/png");
    expect(document.querySelectorAll('script[data-site-json-ld]')).toHaveLength(1);
  });

  it("renders discoverable links to every pinned language", () => {
    const links = routeLanguageLinks({ landmarkId: "coin-heads" });
    expect(links).toContain('/en/examples/coin-heads/');
    expect(links).toContain('lang="zh-Hans"');
    expect(links.match(/<a /g)).toHaveLength(4);
  });
});
