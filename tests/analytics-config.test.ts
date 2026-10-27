import { describe, expect, it } from "vitest";
import { ANALYTICS_PRODUCTION_HOST, getAnalyticsConfig, resolveAnalyticsConfig } from "../src/analytics-config";

describe("analytics configuration", () => {
  it("enables Vercel Analytics only on the production site", () => {
    expect(resolveAnalyticsConfig(
      { PROD: true },
      { hostname: ANALYTICS_PRODUCTION_HOST },
    )).toEqual({ provider: "vercel" });
  });

  it.each([
    [{ PROD: false }, { hostname: ANALYTICS_PRODUCTION_HOST }],
    [{ PROD: undefined }, { hostname: ANALYTICS_PRODUCTION_HOST }],
    [{ PROD: true }, { hostname: "preview.example" }],
  ])("fails closed outside production", (environment, location) => {
    expect(resolveAnalyticsConfig(environment, location)).toBeNull();
  });

  it("reads Vite's current public environment through the default helper", () => {
    expect(getAnalyticsConfig()).toBeNull();
  });
});
