import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";
import { displayLandmarks, type DisplayLandmark } from "../src/catalogue";
import { en } from "../src/locales/en";
import { locales, type LocaleCode, type LocaleDefinition } from "../src/locales";
import { renderReferenceArticle } from "../src/reference";
import { buildSiteMetadata, localeLanguageTag, routeLanguageLinks } from "../src/seo";
import { parseSiteRoute, sitePath, siteUrl, type SiteRoute } from "../src/site";
import { renderSocialPreviewPngAsync, renderSocialPreviewSvg } from "./social-preview";

const localeCodes = Object.keys(locales) as LocaleCode[];
const landmarkById = new Map<string, DisplayLandmark>(displayLandmarks.map(item => [item.id, item]));

const escapeHtml = (value: string): string => value.replace(/[&<>"']/g, character => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
})[character]!);

const staticHead = (route: SiteRoute, item: DisplayLandmark | undefined, locale: LocaleDefinition): string => {
  const metadata = buildSiteMetadata(route, item, locale);
  const alternateLinks = metadata.alternates.map(alternate => `<link data-static-seo rel="alternate" hreflang="${alternate.hreflang}" href="${alternate.href}" />`).join("");
  const alternateLocales = localeCodes.filter(code => code !== locale.code).map(code => `<meta data-static-seo property="og:locale:alternate" content="${buildSiteMetadata(route, item, locales[code]).locale}" />`).join("");
  return `<title data-static-seo>${escapeHtml(metadata.title)}</title>
<meta data-static-seo name="description" content="${escapeHtml(metadata.description)}" />
<link data-static-seo rel="canonical" href="${metadata.canonicalUrl}" />
${alternateLinks}
<meta data-static-seo property="og:type" content="website" />
<meta data-static-seo property="og:title" content="${escapeHtml(metadata.title)}" />
<meta data-static-seo property="og:description" content="${escapeHtml(metadata.description)}" />
<meta data-static-seo property="og:url" content="${metadata.canonicalUrl}" />
<meta data-static-seo property="og:image" content="${metadata.imageUrl}" />
<meta data-static-seo property="og:image:alt" content="${escapeHtml(metadata.imageAlt)}" />
<meta data-static-seo property="og:image:type" content="image/png" />
<meta data-static-seo property="og:image:width" content="1200" />
<meta data-static-seo property="og:image:height" content="630" />
<meta data-static-seo property="og:locale" content="${metadata.locale}" />
<meta data-static-seo property="og:site_name" content="${escapeHtml(metadata.siteName)}" />
${alternateLocales}
<meta data-static-seo name="twitter:card" content="summary_large_image" />
<meta data-static-seo name="twitter:title" content="${escapeHtml(metadata.title)}" />
<meta data-static-seo name="twitter:description" content="${escapeHtml(metadata.description)}" />
<meta data-static-seo name="twitter:image" content="${metadata.imageUrl}" />
<meta data-static-seo name="twitter:image:alt" content="${escapeHtml(metadata.imageAlt)}" />
<meta data-static-seo name="twitter:image:type" content="image/png" />
<script data-static-seo data-site-json-ld type="application/ld+json">${JSON.stringify(metadata.jsonLd).replace(/</g, "\\u003c")}</script>`;
};

const fallbackBody = (route: SiteRoute, item: DisplayLandmark | undefined, locale: LocaleDefinition): string => {
  const languageNav = `<nav class="prerender-languages" aria-label="${escapeHtml(locale.ui.language)}">${routeLanguageLinks(route)}</nav>`;
  if (item) return `<section data-prerender-reference>${languageNav}${renderReferenceArticle(item, locale, 1)}</section>`;
  const description = buildSiteMetadata(route, undefined, locale).description;
  const catalogue = displayLandmarks.map(landmark => {
    const title = locale.landmarks[landmark.id].title;
    return `<li><a href="${sitePath({ locale: route.locale, landmarkId: landmark.id })}">${escapeHtml(title)}</a></li>`;
  }).join("");
  return `<section data-prerender-catalogue><h1>${escapeHtml(locale.ui.title)}</h1><p>${escapeHtml(description)}</p>${languageNav}<ol>${catalogue}</ol></section>`;
};

const stripStaticSeo = (html: string): string => html
  .replace(/<title\b[^>]*data-static-seo[^>]*>[\s\S]*?<\/title>/giu, "")
  .replace(/<(?:meta|link)\b[^>]*data-static-seo[^>]*>/giu, "")
  .replace(/<script\b[^>]*data-static-seo[^>]*>[\s\S]*?<\/script>/giu, "");

export const renderStaticPage = (shell: string, route: SiteRoute, item: DisplayLandmark | undefined, locale: LocaleDefinition): string => {
  const head = staticHead(route, item, locale);
  const body = fallbackBody(route, item, locale);
  return stripStaticSeo(shell)
    .replace(/<html\b[^>]*>/iu, `<html lang="${localeLanguageTag(locale.code)}">`)
    .replace("</head>", `${head}</head>`)
    .replace(/<main\s+id="app"[^>]*>[\s\S]*?<\/main>/iu, `<main id="app">${body}</main>`);
};

const routeEntries = (): readonly Readonly<{ route: SiteRoute; item?: DisplayLandmark; locale: LocaleDefinition }>[] => {
  const entries: Array<Readonly<{ route: SiteRoute; item?: DisplayLandmark; locale: LocaleDefinition }>> = [{ route: {}, locale: en }];
  for (const code of localeCodes) entries.push({ route: { locale: code }, locale: locales[code] });
  for (const item of displayLandmarks) {
    entries.push({ route: { landmarkId: item.id }, item, locale: en });
    for (const code of localeCodes) entries.push({ route: { locale: code, landmarkId: item.id }, item, locale: locales[code] });
  }
  return entries;
};

const writeRoute = async (outputDirectory: string, route: SiteRoute, html: string): Promise<void> => {
  const destination = join(outputDirectory, sitePath(route).slice(1), "index.html");
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, html);
};

const sitemap = (routes: readonly SiteRoute[]): string => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(route => `  <url><loc>${siteUrl(route)}</loc></url>`).join("\n")}\n</urlset>\n`;

const generatedResourcePath = (pathname: string): boolean => {
  if (pathname === "/favicon.svg" || pathname === "/robots.txt" || pathname === "/sitemap.xml") return true;
  if (/^\/assets\/(?:[^/]+\/)*[^/]+\.(?:css|js|map)$/iu.test(pathname)) return true;
  const socialPreview = pathname.match(/^\/social\/([^/]+)\/([^/]+)\.png$/iu);
  if (!socialPreview) return false;
  const [, locale, name] = socialPreview;
  return (locale === "neutral" || localeCodes.includes(locale as LocaleCode))
    && (name === "home" || landmarkById.has(name));
};

export const rejectUnknownHtmlRoute = (request: IncomingMessage, response: ServerResponse, next: () => void): void => {
  if (request.method !== "GET" && request.method !== "HEAD") return next();
  const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
  if (parseSiteRoute(pathname)) return next();
  const passthrough = pathname.startsWith("/tests/browser/")
    || /^\/tests\/helpers\/(?:[^/]+\/)*[^/]+\.ts$/iu.test(pathname)
    || pathname.startsWith("/src/")
    || pathname.startsWith("/@")
    || pathname.startsWith("/node_modules/")
    || generatedResourcePath(pathname);
  if (passthrough) return next();
  response.statusCode = 404;
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.end("<!doctype html><title>404 · The Scale of Probability</title><h1>Page not found</h1>");
};

export const staticSitePlugin = (): Plugin => {
  let outputDirectory = "dist";
  let build = false;
  return {
    name: "static-site-pages",
    configResolved(config) {
      outputDirectory = config.build.outDir;
      build = config.command === "build";
    },
    configureServer(server) {
      server.middlewares.use(rejectUnknownHtmlRoute);
    },
    configurePreviewServer(server) {
      server.middlewares.use(rejectUnknownHtmlRoute);
    },
    transformIndexHtml(html, context) {
      const pathname = new URL(context.originalUrl ?? context.path, "http://localhost").pathname;
      const route = parseSiteRoute(pathname);
      if (!route) return html;
      const locale = route.locale ? locales[route.locale] : en;
      const item = route.landmarkId ? landmarkById.get(route.landmarkId) : undefined;
      return renderStaticPage(html, route, item, locale);
    },
    async closeBundle() {
      if (!build) return;
      const shell = await readFile(join(outputDirectory, "index.html"), "utf8");
      const entries = routeEntries();
      for (let offset = 0; offset < entries.length; offset += 8) {
        await Promise.all(entries.slice(offset, offset + 8).map(async entry => {
          await writeRoute(outputDirectory, entry.route, renderStaticPage(shell, entry.route, entry.item, entry.locale));
          const imageDestination = join(outputDirectory, "social", entry.route.locale ?? "neutral", `${entry.item?.id ?? "home"}.png`);
          await mkdir(dirname(imageDestination), { recursive: true });
          const preview = renderSocialPreviewSvg(entry.item, entry.locale);
          await writeFile(imageDestination, await renderSocialPreviewPngAsync(preview, entry.locale.code));
        }));
      }
      await writeFile(join(outputDirectory, "sitemap.xml"), sitemap(entries.map(entry => entry.route)));
      await writeFile(join(outputDirectory, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${siteUrl({})}sitemap.xml\n`);
    },
  };
};
