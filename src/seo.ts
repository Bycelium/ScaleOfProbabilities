import type { DisplayLandmark } from "./catalogue";
import { localizeLandmark, type LocaleCode, type LocaleDefinition } from "./locales";
import { sitePath, siteUrl, type SiteRoute } from "./site";

const seoLocales: Readonly<Record<LocaleCode, Readonly<{ hreflang: string; og: string }>>> = {
  en: { hreflang: "en", og: "en_US" },
  fr: { hreflang: "fr", og: "fr_FR" },
  es: { hreflang: "es", og: "es_ES" },
  zh: { hreflang: "zh-Hans", og: "zh_CN" },
};

const homeDescriptions: Readonly<Record<LocaleCode, string>> = {
  en: "Explore familiar and extraordinary chances on a logarithmic scale of probability, odds and decibans.",
  fr: "Explorez des probabilités familières et extraordinaires sur une échelle logarithmique de probabilités, de cotes et de décibans.",
  es: "Explora probabilidades cotidianas y extraordinarias en una escala logarítmica de probabilidad, momios y decibanes.",
  zh: "在概率、赔率和分贝值的对数尺度上探索日常事件与非凡事件的可能性。",
};

export type SiteMetadata = Readonly<{
  title: string;
  description: string;
  canonicalUrl: string;
  imageUrl: string;
  imageAlt: string;
  siteName: string;
  locale: string;
  alternates: readonly Readonly<{ hreflang: string; href: string }>[];
  jsonLd: Readonly<Record<string, unknown>>;
}>;

const plainText = (value: string): string => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const summarize = (value: string): string => {
  const text = plainText(value);
  if (text.length <= 180) return text;
  const shortened = text.slice(0, 179);
  const boundary = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, boundary > 120 ? boundary : 179).trim()}…`;
};

export const socialImagePath = (route: SiteRoute): string => {
  const locale = route.locale ?? "neutral";
  return `/social/${locale}/${route.landmarkId ?? "home"}.png`;
};

export const buildSiteMetadata = (route: SiteRoute, item: DisplayLandmark | undefined, locale: LocaleDefinition): SiteMetadata => {
  const translated = item ? localizeLandmark(item, locale) : undefined;
  const neutralRoute = item ? { landmarkId: item.id } : {};
  const localizedRoutes = (Object.keys(seoLocales) as LocaleCode[]).map(code => ({
    hreflang: seoLocales[code].hreflang,
    href: siteUrl({ ...neutralRoute, locale: code }),
  }));
  const title = translated ? `${translated.title} · ${locale.ui.title}` : locale.ui.title;
  const description = translated ? summarize(translated.explanation) : homeDescriptions[locale.code];
  const canonicalUrl = siteUrl(route);
  const imageUrl = `${siteUrl({})}${socialImagePath(route).slice(1)}`;
  const imageAlt = translated?.title ?? locale.ui.title;
  const organization = { "@type": "Organization", "@id": "https://bycelium.com/#organization", name: "Bycelium", url: "https://bycelium.com/" };
  const webSite = { "@type": "WebSite", "@id": `${siteUrl({})}#website`, name: locale.ui.title, url: siteUrl({}), publisher: { "@id": organization["@id"] } };
  const webPage: Record<string, unknown> = {
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: title,
    description,
    inLanguage: seoLocales[locale.code].hreflang,
    isPartOf: { "@id": webSite["@id"] },
    publisher: { "@id": organization["@id"] },
    primaryImageOfPage: { "@type": "ImageObject", url: imageUrl, width: 1200, height: 630 },
  };
  if (translated) {
    webPage.about = { "@type": "Thing", name: translated.title };
    const citations = translated.sources.flatMap(source => source.href ? [source.href] : []);
    if (citations.length) webPage.citation = citations;
  }
  return {
    title,
    description,
    canonicalUrl,
    imageUrl,
    imageAlt,
    siteName: locale.ui.title,
    locale: seoLocales[locale.code].og,
    alternates: [...localizedRoutes, { hreflang: "x-default", href: siteUrl(neutralRoute) }],
    jsonLd: { "@context": "https://schema.org", "@graph": [organization, webSite, webPage] },
  };
};

const upsertMeta = (selector: string, attribute: "name" | "property", value: string, content: string): void => {
  let node = document.head.querySelector<HTMLMetaElement>(selector);
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attribute, value);
    document.head.append(node);
  }
  node.content = content;
};

const upsertLink = (selector: string, rel: string, href: string): HTMLLinkElement => {
  let node = document.head.querySelector<HTMLLinkElement>(selector);
  if (!node) {
    node = document.createElement("link");
    node.rel = rel;
    document.head.append(node);
  }
  node.href = href;
  return node;
};

export const updateDocumentMetadata = (route: SiteRoute, item: DisplayLandmark | undefined, locale: LocaleDefinition): void => {
  const metadata = buildSiteMetadata(route, item, locale);
  document.documentElement.lang = seoLocales[locale.code].hreflang;
  document.title = metadata.title;
  upsertMeta('meta[name="description"]', "name", "description", metadata.description);
  upsertMeta('meta[property="og:type"]', "property", "og:type", "website");
  upsertMeta('meta[property="og:title"]', "property", "og:title", metadata.title);
  upsertMeta('meta[property="og:description"]', "property", "og:description", metadata.description);
  upsertMeta('meta[property="og:url"]', "property", "og:url", metadata.canonicalUrl);
  upsertMeta('meta[property="og:image"]', "property", "og:image", metadata.imageUrl);
  upsertMeta('meta[property="og:image:alt"]', "property", "og:image:alt", metadata.imageAlt);
  upsertMeta('meta[property="og:image:type"]', "property", "og:image:type", "image/png");
  upsertMeta('meta[property="og:image:width"]', "property", "og:image:width", "1200");
  upsertMeta('meta[property="og:image:height"]', "property", "og:image:height", "630");
  upsertMeta('meta[property="og:locale"]', "property", "og:locale", metadata.locale);
  upsertMeta('meta[property="og:site_name"]', "property", "og:site_name", metadata.siteName);
  document.head.querySelectorAll('meta[property="og:locale:alternate"]').forEach(node => node.remove());
  for (const code of Object.keys(seoLocales) as LocaleCode[]) {
    if (code === locale.code) continue;
    const node = document.createElement("meta");
    node.setAttribute("property", "og:locale:alternate");
    node.content = seoLocales[code].og;
    document.head.append(node);
  }
  upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
  upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", metadata.title);
  upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", metadata.description);
  upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", metadata.imageUrl);
  upsertMeta('meta[name="twitter:image:alt"]', "name", "twitter:image:alt", metadata.imageAlt);
  upsertMeta('meta[name="twitter:image:type"]', "name", "twitter:image:type", "image/png");
  upsertLink('link[rel="canonical"]', "canonical", metadata.canonicalUrl);

  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach(node => node.remove());
  for (const alternate of metadata.alternates) {
    const node = document.createElement("link");
    node.rel = "alternate";
    node.hreflang = alternate.hreflang;
    node.href = alternate.href;
    document.head.append(node);
  }

  let jsonLd = document.head.querySelector<HTMLScriptElement>('script[data-site-json-ld]');
  if (!jsonLd) {
    jsonLd = document.createElement("script");
    jsonLd.type = "application/ld+json";
    jsonLd.dataset.siteJsonLd = "";
    document.head.append(jsonLd);
  }
  jsonLd.textContent = JSON.stringify(metadata.jsonLd).replace(/</g, "\\u003c");
};

export const localeLanguageTag = (locale: LocaleCode): string => seoLocales[locale].hreflang;

export const routeLanguageLinks = (route: SiteRoute): string => (Object.keys(seoLocales) as LocaleCode[])
  .map(locale => `<a href="${sitePath({ landmarkId: route.landmarkId, locale })}" lang="${seoLocales[locale].hreflang}">${locale}</a>`)
  .join(" ");
