import { createRequire } from "node:module";
import { resolve } from "node:path";
import type { DisplayLandmark } from "../src/catalogue";
import { localizeLandmark, type LocaleCode, type LocaleDefinition } from "../src/locales";
import { formatDecibans, formatProbabilityPercent } from "../src/probability";

type RenderAsync = (svg: string, options: Readonly<Record<string, unknown>>) => Promise<Readonly<{ asPng: () => Uint8Array }>>;

const require = createRequire(import.meta.url);
const { renderAsync } = require("@resvg/resvg-js") as Readonly<{ renderAsync: RenderAsync }>;
const fontPaths: Readonly<Record<"latin" | "cjk", string>> = {
  latin: resolve(process.cwd(), "build/fonts/NotoSans.ttf"),
  cjk: resolve(process.cwd(), "build/fonts/NotoSansCJKsc-Regular.otf"),
};
const previewFont = (locale: LocaleCode): Readonly<{ family: string; path: string }> => locale === "zh"
  ? { family: "Noto Sans CJK SC", path: fontPaths.cjk }
  : { family: "Noto Sans", path: fontPaths.latin };

const escapeXml = (value: string): string => value.replace(/[&<>"']/g, character => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
})[character]!);

const characterWidth = (character: string): number => /[\u2e80-\u9fff\uf900-\ufaff]/u.test(character) ? 1 : character === " " ? .32 : .58;

const wrapPreviewText = (value: string, maximumWidth: number): readonly string[] => {
  const lines: string[] = [];
  let line = "";
  let width = 0;
  const tokens = value.match(/[\u2e80-\u9fff\uf900-\ufaff]|[^\s\u2e80-\u9fff\uf900-\ufaff]+(?:\s+|$)|\s+/gu) ?? [];
  for (const token of tokens) {
    const tokenWidth = [...token].reduce((total, character) => total + characterWidth(character), 0);
    if (line.trim() && width + tokenWidth > maximumWidth) {
      lines.push(line.trim());
      line = "";
      width = 0;
    }
    line += token;
    width += tokenWidth;
  }
  if (line) lines.push(line.trim());
  return lines;
};

const titleLayout = (title: string, availableWidth: number, maximumLines: number): Readonly<{ fontSize: number; lines: readonly string[] }> => {
  for (const fontSize of [49, 44, 39, 34, 30]) {
    const lines = wrapPreviewText(title, availableWidth / fontSize);
    if (lines.length <= maximumLines) return { fontSize, lines };
  }
  return { fontSize: 27, lines: wrapPreviewText(title, availableWidth / 27) };
};

const normalizeArtworkSvg = (art: string, locale: LocaleDefinition): string => {
  const declarations = art.match(/^<svg\b[^>]*\sstyle="([^"]*)"/u)?.[1] ?? "";
  const customProperties = new Map([...declarations.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+)/giu)].map(match => [match[1], match[2].trim()]));
  return art
    .replace(/var\(--([a-z0-9-]+)\)/giu, (value, name: string) => customProperties.get(name) ?? value)
    .replace(
    /(<text\b[^>]*data-art-text="([^"]+)"[^>]*>)(.*?)(<\/text>)/gu,
    (_match, opening: string, key: keyof LocaleDefinition["ui"]["art"], _content: string, closing: string) => `${opening}${escapeXml(locale.ui.art[key])}${closing}`,
    )
    .replace(/\s(data-[a-z0-9-]+)(?=\s|\/?>)/giu, ' $1=""');
};

export const renderSocialPreviewSvg = (item: DisplayLandmark | undefined, locale: LocaleDefinition): string => {
  const translated = item ? localizeLandmark(item, locale) : undefined;
  const title = translated?.title ?? locale.ui.title;
  const layout = titleLayout(title, 650, 4);
  const titleLines = layout.lines;
  const titleY = translated ? 174 : 260;
  const titleSize = translated ? layout.fontSize : Math.max(46, layout.fontSize);
  const font = previewFont(locale.code);
  const titleMarkup = titleLines.map((line, index) => `<text x="475" y="${titleY + index * (titleSize + 9)}">${escapeXml(line)}</text>`).join("");
  const artwork = translated
    ? `<g transform="translate(64 134) scale(3.15)">${normalizeArtworkSvg(item!.art, locale).replace("<svg", '<svg width="100" height="100"')}</g>`
    : `<g fill="none" stroke="#6cc3a0"><circle cx="260" cy="315" r="166" stroke-width="18"/><circle cx="260" cy="315" r="83" stroke-width="9" opacity=".65"/><circle cx="260" cy="315" r="21" fill="#6cc3a0" stroke="none"/></g>`;
  const values = item
    ? `<text x="475" y="510" font-family="Noto Sans, sans-serif" font-size="31" fill="#8fd8bb">${escapeXml(formatProbabilityPercent(item.chance, locale.code))} · ${escapeXml(formatDecibans(item.position, locale.code))}</text>`
    : `<text x="475" y="495" font-family="${font.family}, sans-serif" font-size="31" fill="#8fd8bb">${escapeXml(locale.ui.probabilityLabel.replace(/\s*[:：]\s*$/u, ""))} · ${escapeXml(locale.ui.oddsLabel.replace(/\s*[:：]\s*$/u, ""))} · dBan</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#081321"/>
  <path d="M0 594h1200" stroke="#244557" stroke-width="2"/>
  ${artwork}
  <g fill="#f2f6f4" font-family="${font.family}, sans-serif" font-weight="600" font-size="${titleSize}">${titleMarkup}</g>
  ${values}
  <text x="76" y="610" fill="#aac4c9" font-family="${font.family}, sans-serif" font-size="22">deciban.bycelium.com</text>
  <text x="1124" y="610" fill="#aac4c9" font-family="${font.family}, sans-serif" font-size="22" text-anchor="end">${escapeXml(locale.ui.title)}</text>
</svg>`;
};

const renderOptions = (svg: string, locale: LocaleCode) => {
  const font = previewFont(locale);
  const needsSymbolFallback = /[♠♥♦♣]/u.test(svg);
  return {
    fitTo: { mode: "original" },
    font: {
      fontFiles: locale === "zh"
        ? [font.path, fontPaths.latin]
        : needsSymbolFallback ? [font.path, fontPaths.cjk] : [font.path],
      loadSystemFonts: false,
      defaultFontFamily: font.family,
    },
  } as const;
};

export const renderSocialPreviewPngAsync = async (svg: string, locale: LocaleCode): Promise<Uint8Array> => {
  const rendered = await renderAsync(svg, renderOptions(svg, locale));
  return rendered.asPng();
};
