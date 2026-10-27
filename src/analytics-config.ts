export const ANALYTICS_PRODUCTION_HOST = "deciban.bycelium.com";

export type AnalyticsConfig = Readonly<{
  provider: "vercel";
}>;

type PublicAnalyticsEnvironment = Readonly<{
  PROD?: boolean;
}>;

type PublicLocation = Readonly<{
  hostname: string;
}>;

export const resolveAnalyticsConfig = (
  environment: PublicAnalyticsEnvironment,
  location: PublicLocation,
): AnalyticsConfig | null => {
  if (environment.PROD !== true || location.hostname !== ANALYTICS_PRODUCTION_HOST) return null;
  return { provider: "vercel" };
};

export const getAnalyticsConfig = (): AnalyticsConfig | null =>
  resolveAnalyticsConfig(import.meta.env, window.location);
