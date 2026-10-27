import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createAnalytics,
  type AnalyticsConfig,
  type AnalyticsDependencies,
} from "../src/analytics";
import { FakeAnalyticsProvider } from "./helpers/fake-analytics-provider";

const CONFIG: AnalyticsConfig = { provider: "vercel" };
const STORAGE_KEY = "probability-scale-analytics-consent";
const SIX_MONTHS_MS = 183 * 24 * 60 * 60 * 1_000;
const CONSENT_VERSION = 2;

describe("consent-gated analytics controller", () => {
  let wallTime: number;
  let monotonicTime: number;
  let provider: FakeAnalyticsProvider;
  let dependencies: AnalyticsDependencies;

  const setVisibility = (state: DocumentVisibilityState): void => {
    Object.defineProperty(document, "visibilityState", { configurable: true, value: state });
    document.dispatchEvent(new Event("visibilitychange"));
  };

  const create = (config: AnalyticsConfig | null = CONFIG) => createAnalytics(config, "en", dependencies);

  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    wallTime = 2_000_000_000_000;
    monotonicTime = 0;
    provider = new FakeAnalyticsProvider();
    dependencies = {
      window,
      document,
      wallNow: () => wallTime,
      monotonicNow: () => monotonicTime,
      providerFactory: () => provider,
    };
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("starts the provider lazily and sends no pre-consent activity", () => {
    const analytics = create();
    analytics.openExample("coin-heads");
    monotonicTime = 70_000;
    vi.advanceTimersByTime(70_000);

    expect(analytics.available).toBe(true);
    expect(analytics.getConsent()).toBe("unknown");
    expect(provider.starts).toBe(0);
    expect(provider.events).toEqual([]);

    analytics.setConsent("accepted");
    expect(provider.starts).toBe(1);
    expect(provider.events).toEqual([]);
    provider.ready();
    expect(provider.events).toEqual([{ type: "pageview" }]);
    monotonicTime = 71_000;
    setVisibility("hidden");
    expect(provider.events).not.toContainEqual(expect.objectContaining({ type: "example_time" }));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual({
      version: CONSENT_VERSION,
      consent: "accepted",
      timestamp: wallTime,
    });
    analytics.dispose();
  });

  it("emits provider-neutral opens and visible duration fragments", () => {
    const analytics = create();
    analytics.setConsent("accepted");
    provider.ready();
    analytics.openExample("coin-heads");

    monotonicTime = 1_250;
    setVisibility("hidden");
    monotonicTime = 50_000;
    setVisibility("visible");
    monotonicTime = 52_500;
    analytics.setLocale("fr");
    monotonicTime = 53_000;
    analytics.setExampleVisible(false);
    monotonicTime = 58_000;
    analytics.closeExample();

    expect(provider.events).toEqual([
      { type: "pageview" },
      { type: "example_opened", exampleId: "coin-heads", locale: "en" },
      { type: "site_time", seconds: 1.25, locale: "en" },
      { type: "example_time", exampleId: "coin-heads", seconds: 1.25, locale: "en" },
      { type: "site_time", seconds: 2.5, locale: "en" },
      { type: "example_time", exampleId: "coin-heads", seconds: 2.5, locale: "en" },
      { type: "site_time", seconds: 0.5, locale: "fr" },
      { type: "example_time", exampleId: "coin-heads", seconds: 0.5, locale: "fr" },
      { type: "site_time", seconds: 5, locale: "fr" },
    ]);
    analytics.dispose();
  });

  it("does not double count background or bfcache time", () => {
    const analytics = create();
    analytics.setConsent("accepted");
    provider.ready();
    analytics.openExample("dice");
    analytics.setLocale("en");
    analytics.setExampleVisible(true);

    monotonicTime = 1_000;
    window.dispatchEvent(new PageTransitionEvent("pagehide", { persisted: true }));
    monotonicTime = 20_000;
    window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true }));
    monotonicTime = 20_250;
    vi.advanceTimersByTime(60_000);
    setVisibility("hidden");
    monotonicTime = 80_000;
    vi.advanceTimersByTime(60_000);

    expect(provider.events.filter(event => event.type === "site_time")).toEqual([
      { type: "site_time", seconds: 1, locale: "en" },
      { type: "site_time", seconds: 0.25, locale: "en" },
    ]);
    analytics.dispose();
  });

  it("counts explicit reopenings while locale changes keep one open", () => {
    const analytics = create();
    analytics.setConsent("accepted");
    provider.ready();
    analytics.openExample("coin-heads");
    analytics.setLocale("fr");
    analytics.openExample("coin-heads");
    analytics.closeExample();
    analytics.closeExample();

    expect(provider.events.filter(event => event.type === "example_opened")).toEqual([
      { type: "example_opened", exampleId: "coin-heads", locale: "en" },
      { type: "example_opened", exampleId: "coin-heads", locale: "fr" },
    ]);
    analytics.dispose();
  });

  it("revokes immediately and ignores a late provider callback", () => {
    const listener = vi.fn();
    const analytics = create();
    const unsubscribe = analytics.subscribe(listener);
    analytics.setConsent("accepted");
    analytics.openExample("coin-heads");
    monotonicTime = 12_000;
    analytics.setConsent("declined");
    provider.ready(0);
    vi.advanceTimersByTime(120_000);

    expect(listener.mock.calls).toEqual([["accepted"], ["declined"]]);
    expect(provider.events).toEqual([]);
    expect(provider.stops).toBe(1);
    expect(analytics.getConsent()).toBe("declined");
    unsubscribe();
    analytics.setConsent("accepted");
    expect(listener).toHaveBeenCalledTimes(2);
    analytics.dispose();
  });

  it("retries a canceled pageview and never duplicates a sent pageview", () => {
    const analytics = create();
    analytics.setConsent("accepted");
    analytics.setConsent("declined");
    provider.ready(0);
    analytics.setConsent("accepted");
    provider.ready(1);
    expect(provider.events).toEqual([{ type: "pageview" }]);
    analytics.setConsent("declined");
    analytics.setConsent("accepted");
    provider.ready(2);
    expect(provider.events).toEqual([{ type: "pageview" }]);
    analytics.dispose();
  });

  it("does not resume an old detail after revoke and reaccept", () => {
    const analytics = create();
    analytics.setConsent("accepted");
    provider.ready();
    analytics.openExample("coin-heads");
    monotonicTime = 1_000;
    analytics.setConsent("declined");
    analytics.setConsent("accepted");
    provider.ready();
    monotonicTime = 2_000;
    analytics.setLocale("fr");
    expect(provider.events.filter(event => event.type === "example_time")).toEqual([]);
    analytics.openExample("coin-heads");
    monotonicTime = 3_000;
    analytics.closeExample();
    expect(provider.events.filter(event => event.type === "example_time")).toEqual([
      { type: "example_time", exampleId: "coin-heads", seconds: 1, locale: "fr" },
    ]);
    analytics.dispose();
  });

  it("rejects corrupt, expired, future, and malformed stored choices", () => {
    const invalidRecords = [
      "not json",
      JSON.stringify({ version: 1, consent: "accepted", timestamp: wallTime }),
      JSON.stringify({ version: CONSENT_VERSION, consent: "maybe", timestamp: wallTime }),
      JSON.stringify({ version: CONSENT_VERSION, consent: "accepted", timestamp: "today" }),
      JSON.stringify({ version: CONSENT_VERSION, consent: "accepted", timestamp: null }),
      JSON.stringify({ version: CONSENT_VERSION, consent: "accepted", timestamp: wallTime + 1 }),
      JSON.stringify({ version: CONSENT_VERSION, consent: "accepted", timestamp: wallTime - SIX_MONTHS_MS }),
    ];
    for (const record of invalidRecords) {
      localStorage.setItem(STORAGE_KEY, record);
      const analytics = create();
      expect(analytics.getConsent()).toBe("unknown");
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
      analytics.dispose();
    }
  });

  it("restores valid choices and expires one while open", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: CONSENT_VERSION,
      consent: "accepted",
      timestamp: wallTime - SIX_MONTHS_MS + 1_000,
    }));
    const listener = vi.fn();
    const analytics = create();
    analytics.subscribe(listener);
    expect(analytics.getConsent()).toBe("accepted");
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => { throw new Error("blocked"); });
    wallTime += 1_000;
    vi.advanceTimersByTime(1_000);
    expect(analytics.getConsent()).toBe("unknown");
    expect(listener).toHaveBeenCalledWith("unknown");
    analytics.dispose();

    vi.restoreAllMocks();
    localStorage.clear();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: CONSENT_VERSION, consent: "declined", timestamp: wallTime }));
    const declined = create();
    expect(declined.getConsent()).toBe("declined");
    expect(provider.starts).toBe(1);
    declined.dispose();
  });

  it("synchronizes local-storage changes and rejects session-storage events", () => {
    const analytics = create();
    analytics.setConsent("accepted");
    provider.ready();
    window.dispatchEvent(new StorageEvent("storage", { key: "unrelated", newValue: null }));
    window.dispatchEvent(new StorageEvent("storage", {
      key: STORAGE_KEY,
      newValue: JSON.stringify({ version: CONSENT_VERSION, consent: "declined", timestamp: wallTime }),
      storageArea: sessionStorage,
    }));
    expect(analytics.getConsent()).toBe("accepted");
    window.dispatchEvent(new StorageEvent("storage", {
      key: STORAGE_KEY,
      newValue: JSON.stringify({ version: CONSENT_VERSION, consent: "declined", timestamp: wallTime }),
      storageArea: localStorage,
    }));
    expect(analytics.getConsent()).toBe("declined");
    window.dispatchEvent(new StorageEvent("storage", {
      key: STORAGE_KEY,
      newValue: JSON.stringify({ version: CONSENT_VERSION, consent: "accepted", timestamp: wallTime }),
    }));
    expect(analytics.getConsent()).toBe("accepted");
    window.dispatchEvent(new StorageEvent("storage", { key: null, newValue: null, storageArea: localStorage }));
    expect(analytics.getConsent()).toBe("unknown");
    analytics.dispose();
  });

  it("fails closed without config and tolerates unavailable storage", () => {
    const getItem = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    const analytics = create(null);
    analytics.setConsent("accepted");
    analytics.openExample("coin-heads");
    analytics.setExampleVisible(false);
    analytics.setLocale("fr");
    analytics.closeExample();
    expect(analytics.available).toBe(false);
    expect(analytics.getConsent()).toBe("accepted");
    expect(provider.starts).toBe(0);
    expect(getItem).toHaveBeenCalled();
    expect(setItem).toHaveBeenCalled();
    setVisibility("hidden");
    window.dispatchEvent(new PageTransitionEvent("pagehide"));
    analytics.dispose();
  });

  it("tolerates a localStorage getter that is unavailable", () => {
    const unavailableStorageWindow = new Proxy(window, {
      get(target, property) {
        if (property === "localStorage") throw new DOMException("blocked", "SecurityError");
        const value: unknown = Reflect.get(target, property, target);
        return typeof value === "function" ? value.bind(target) : value;
      },
    });
    const analytics = createAnalytics(null, "en", { ...dependencies, window: unavailableStorageWindow });
    analytics.setConsent("declined");
    expect(analytics.getConsent()).toBe("declined");
    analytics.dispose();
  });

  it("isolates provider failures and stops a queue changed during dispatch", () => {
    const analytics = create();
    provider.throwOnSend = true;
    analytics.setConsent("accepted");
    expect(() => provider.ready()).not.toThrow();
    expect(() => analytics.openExample("failed-direct-send")).not.toThrow();
    provider.throwOnSend = false;
    analytics.setConsent("declined");
    analytics.setConsent("accepted");
    analytics.openExample("first");
    analytics.openExample("second");
    provider.onSend = () => analytics.setConsent("declined");
    provider.ready();
    expect(provider.events.filter(event => event.type === "pageview")).toHaveLength(1);
    expect(analytics.getConsent()).toBe("declined");
    analytics.dispose();
  });

  it("survives failed cleanup of a corrupt stored choice", () => {
    localStorage.setItem(STORAGE_KEY, "corrupt");
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => { throw new Error("blocked"); });
    const analytics = create();
    expect(analytics.getConsent()).toBe("unknown");
    analytics.dispose();
  });

  it("revalidates expiry before sends and suspended lifecycle events", () => {
    const analytics = create();
    const listener = vi.fn();
    analytics.subscribe(listener);
    const expireThen = (action: () => void): void => {
      analytics.setConsent("accepted");
      provider.ready();
      wallTime += SIX_MONTHS_MS;
      action();
      expect(analytics.getConsent()).toBe("unknown");
      wallTime += 1;
    };
    monotonicTime = 1_000;
    expireThen(() => { monotonicTime += 1_000; analytics.setLocale("fr"); });
    expireThen(() => setVisibility("hidden"));
    expireThen(() => window.dispatchEvent(new PageTransitionEvent("pagehide", { persisted: true })));
    expireThen(() => window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true })));
    expect(listener.mock.calls.filter(([value]) => value === "unknown")).toHaveLength(4);
    analytics.dispose();
  });

  it("drops every duration snapshot and late-ready queue after expiry", () => {
    const analytics = create();
    analytics.setConsent("accepted");
    analytics.openExample("coin-heads");
    monotonicTime = 1_000;
    wallTime += SIX_MONTHS_MS;
    analytics.setLocale("fr");
    provider.ready(0);
    expect(analytics.getConsent()).toBe("unknown");
    expect(provider.events).toEqual([]);
    wallTime += 1;
    analytics.setConsent("accepted");
    provider.ready();
    expect(provider.events).toEqual([{ type: "pageview" }]);
    analytics.dispose();
  });

  it("revalidates expiry when a throttled provider becomes ready", () => {
    const analytics = create();
    analytics.setConsent("accepted");
    wallTime += SIX_MONTHS_MS;
    provider.ready();
    expect(analytics.getConsent()).toBe("unknown");
    expect(provider.events).toEqual([]);
    analytics.dispose();
  });

  it("supports default browser dependencies and repeated disposal", () => {
    const analytics = createAnalytics(null, "en");
    expect(analytics.available).toBe(false);
    analytics.dispose();
    analytics.dispose();
    analytics.setConsent("accepted");
    analytics.openExample("coin");
    analytics.setLocale("fr");
    analytics.closeExample();
    analytics.setExampleVisible(true);
    expect(analytics.subscribe(vi.fn())).toEqual(expect.any(Function));

    localStorage.clear();
    const defaultProviderAnalytics = createAnalytics(CONFIG, "en");
    defaultProviderAnalytics.setConsent("accepted");
    expect(document.querySelector('script[data-sdkn^="@vercel/analytics"]')).not.toBeNull();
    defaultProviderAnalytics.dispose();
  });
});
