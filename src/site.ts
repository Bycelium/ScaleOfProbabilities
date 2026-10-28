import { catalogueOrder, type LandmarkId } from "./catalogue/order";
import { localeMetadata, type LocaleCode } from "./locales/metadata";

export const SITE_ORIGIN = "https://deciban.bycelium.com";

export type SiteRoute = Readonly<{
  landmarkId?: LandmarkId;
  locale?: LocaleCode;
}>;

const landmarkIds = new Set<string>(catalogueOrder);
const localeCodes = new Set<LocaleCode>(Object.keys(localeMetadata) as LocaleCode[]);

const routeSegments = (pathname: string): readonly string[] | null => {
  if (!pathname.startsWith("/") || pathname.includes("?") || pathname.includes("#")) return null;
  try {
    const decoded = decodeURIComponent(pathname);
    if (decoded.includes("//")) return null;
    return decoded.split("/").filter(Boolean);
  } catch {
    return null;
  }
};

export const parseSiteRoute = (pathname: string): SiteRoute | null => {
  let segments = routeSegments(pathname);
  if (!segments) return null;
  if (segments.length === 0) return {};

  let locale: LocaleCode | undefined;
  if (localeCodes.has(segments[0] as LocaleCode)) {
    locale = segments[0] as LocaleCode;
    segments = segments.slice(1);
  }
  if (segments.length === 0) return { locale: locale! };
  if (segments.length !== 2 || segments[0] !== "examples" || !landmarkIds.has(segments[1])) return null;
  const landmarkId = segments[1] as LandmarkId;
  return locale ? { locale, landmarkId } : { landmarkId };
};

export const sitePath = ({ landmarkId, locale }: SiteRoute): string => {
  const prefix = locale ? `/${locale}` : "";
  return landmarkId ? `${prefix}/examples/${landmarkId}/` : `${prefix}/`;
};

export const siteUrl = (route: SiteRoute): string => `${SITE_ORIGIN}${sitePath(route)}`;
