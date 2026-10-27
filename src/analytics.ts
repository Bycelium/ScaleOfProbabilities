import type { AnalyticsConfig } from "./analytics-config";
import { createVercelAnalyticsProvider } from "./analytics-providers/vercel";

export type { AnalyticsConfig } from "./analytics-config";

export type AnalyticsConsent = "unknown" | "accepted" | "declined";
export type AnalyticsConsentListener = (consent: AnalyticsConsent) => void;

export type AnalyticsDomainEvent =
  | Readonly<{ type: "pageview" }>
  | Readonly<{ type: "example_opened"; exampleId: string; locale: string }>
  | Readonly<{ type: "site_time"; seconds: number; locale: string }>
  | Readonly<{ type: "example_time"; exampleId: string; seconds: number; locale: string }>;

export type AnalyticsProvider = Readonly<{
  start(onReady: () => void): void;
  send(event: AnalyticsDomainEvent): void;
  stop(): void;
  dispose(): void;
}>;

export type Analytics = Readonly<{
  available: boolean;
  getConsent(): AnalyticsConsent;
  setConsent(consent: Exclude<AnalyticsConsent, "unknown">): void;
  subscribe(listener: AnalyticsConsentListener): () => void;
  setLocale(locale: string): void;
  openExample(id: string): void;
  closeExample(): void;
  setExampleVisible(visible: boolean): void;
  dispose(): void;
}>;

export type AnalyticsProviderFactory = (
  config: AnalyticsConfig,
  environment: Readonly<{ window: Window; document: Document }>,
) => AnalyticsProvider;

export type AnalyticsDependencies = Readonly<{
  window: Window;
  document: Document;
  wallNow(): number;
  monotonicNow(): number;
  providerFactory?: AnalyticsProviderFactory;
}>;

type ConsentRecord = Readonly<{
  version: 2;
  consent: Exclude<AnalyticsConsent, "unknown">;
  timestamp: number;
}>;

const CONSENT_STORAGE_KEY = "probability-scale-analytics-consent";
// Bump whenever the provider, measurement purpose, or material consent notice changes.
const CONSENT_VERSION = 2;
const CONSENT_TTL_MS = 183 * 24 * 60 * 60 * 1_000;
const FLUSH_INTERVAL_MS = 60_000;
const MAX_TIMEOUT_MS = 2_147_483_647;

const parseConsentRecord = (value: string | null, now: number): ConsentRecord | null => {
  if (!value) return null;
  try {
    const candidate = JSON.parse(value) as Partial<ConsentRecord>;
    if (
      candidate.version !== CONSENT_VERSION
      || (candidate.consent !== "accepted" && candidate.consent !== "declined")
      || typeof candidate.timestamp !== "number"
      || !Number.isFinite(candidate.timestamp)
      || candidate.timestamp > now
      || now - candidate.timestamp >= CONSENT_TTL_MS
    ) return null;
    return candidate as ConsentRecord;
  } catch {
    return null;
  }
};

const defaultDependencies = (): AnalyticsDependencies => ({
  window,
  document,
  wallNow: () => Date.now(),
  monotonicNow: () => performance.now(),
});

export const createAnalytics = (
  config: AnalyticsConfig | null,
  initialLocale: string,
  dependencies: AnalyticsDependencies = defaultDependencies(),
): Analytics => {
  const runtimeWindow = dependencies.window;
  const runtimeDocument = dependencies.document;
  const subscribers = new Set<AnalyticsConsentListener>();
  const pendingEvents: AnalyticsDomainEvent[] = [];
  const provider = config
    ? dependencies.providerFactory?.(config, { window: runtimeWindow, document: runtimeDocument })
      ?? createVercelAnalyticsProvider({ window: runtimeWindow, document: runtimeDocument })
    : null;
  let consent: AnalyticsConsent = "unknown";
  let consentTimestamp: number | null = null;
  let locale = initialLocale;
  let exampleId: string | null = null;
  let exampleVisible = false;
  let visibleStartedAt: number | null = null;
  let siteMilliseconds = 0;
  let exampleMilliseconds = 0;
  let flushTimer: number | null = null;
  let expiryTimer: number | null = null;
  let providerReady = false;
  let generation = 0;
  let pageviewSent = false;
  let disposed = false;

  const storage = (() => {
    try {
      return runtimeWindow.localStorage;
    } catch {
      return null;
    }
  })();

  const expireConsentIfNeeded = (): boolean => {
    if (consentTimestamp === null) return false;
    const age = dependencies.wallNow() - consentTimestamp;
    if (age >= 0 && age < CONSENT_TTL_MS) return false;
    try { storage?.removeItem(CONSENT_STORAGE_KEY); } catch { /* Storage may become unavailable. */ }
    const changed = consent !== "unknown";
    consent = "unknown";
    consentTimestamp = null;
    deactivate();
    if (changed) for (const listener of subscribers) listener(consent);
    return true;
  };

  const send = (event: AnalyticsDomainEvent): void => {
    if (disposed || consent !== "accepted" || !provider || expireConsentIfNeeded() || consent !== "accepted") return;
    if (providerReady) {
      try {
        provider.send(event);
      } catch {
        // Analytics failures must never interrupt the scene.
      }
      return;
    }
    pendingEvents.push(event);
  };

  const flushPending = (expectedGeneration: number): void => {
    if (
      disposed
      || consent !== "accepted"
      || !provider
      || generation !== expectedGeneration
      || expireConsentIfNeeded()
      || consent !== "accepted"
    ) {
      pendingEvents.length = 0;
      return;
    }
    const events = pendingEvents.splice(0);
    for (const event of events) {
      if (
        disposed
        || consent !== "accepted"
        || generation !== expectedGeneration
        || expireConsentIfNeeded()
        || consent !== "accepted"
      ) return;
      try {
        provider.send(event);
        if (event.type === "pageview") pageviewSent = true;
      } catch {
        // Analytics failures must never interrupt the scene.
      }
    }
  };

  const sendDuration = (name: "site_time" | "example_time", milliseconds: number, id?: string): void => {
    if (milliseconds <= 0) return;
    const seconds = Math.round(milliseconds) / 1_000;
    if (name === "site_time") send({ type: name, seconds, locale });
    else if (id) send({ type: name, exampleId: id, seconds, locale });
  };

  const accrueVisibleTime = (): void => {
    if (visibleStartedAt === null) return;
    const now = dependencies.monotonicNow();
    const elapsed = Math.max(0, now - visibleStartedAt);
    siteMilliseconds += elapsed;
    if (exampleId && exampleVisible) exampleMilliseconds += elapsed;
    visibleStartedAt = now;
  };

  const flushDurations = (): void => {
    accrueVisibleTime();
    const elapsedSite = siteMilliseconds;
    const elapsedExample = exampleMilliseconds;
    const elapsedExampleId = exampleId;
    siteMilliseconds = 0;
    exampleMilliseconds = 0;
    sendDuration("site_time", elapsedSite);
    if (elapsedExampleId) sendDuration("example_time", elapsedExample, elapsedExampleId);
  };

  const stopTimers = (): void => {
    if (flushTimer !== null) runtimeWindow.clearInterval(flushTimer);
    if (expiryTimer !== null) runtimeWindow.clearTimeout(expiryTimer);
    flushTimer = null;
    expiryTimer = null;
  };

  const deactivate = (): void => {
    generation += 1;
    stopTimers();
    visibleStartedAt = null;
    siteMilliseconds = 0;
    exampleMilliseconds = 0;
    exampleId = null;
    exampleVisible = false;
    pendingEvents.length = 0;
    providerReady = false;
    provider?.stop();
  };

  const scheduleExpiry = (): void => {
    if (expiryTimer !== null) runtimeWindow.clearTimeout(expiryTimer);
    expiryTimer = null;
    if (consentTimestamp === null) return;
    if (expireConsentIfNeeded()) return;
    const remaining = consentTimestamp + CONSENT_TTL_MS - dependencies.wallNow();
    expiryTimer = runtimeWindow.setTimeout(scheduleExpiry, Math.min(remaining, MAX_TIMEOUT_MS));
  };

  const activate = (): void => {
    if (!provider) return;
    if (runtimeDocument.visibilityState === "visible") visibleStartedAt = dependencies.monotonicNow();
    flushTimer = runtimeWindow.setInterval(flushDurations, FLUSH_INTERVAL_MS);
    if (!pageviewSent) {
      send({ type: "pageview" });
    }
    const expectedGeneration = generation;
    provider.start(() => {
      if (disposed || consent !== "accepted" || generation !== expectedGeneration) return;
      providerReady = true;
      flushPending(expectedGeneration);
    });
  };

  const applyConsent = (next: AnalyticsConsent, timestamp: number | null): void => {
    const previous = consent;
    consent = next;
    consentTimestamp = timestamp;
    if (previous === "accepted" && next !== "accepted") deactivate();
    if (previous !== "accepted" && next === "accepted") activate();
    scheduleExpiry();
    if (previous !== next) for (const listener of subscribers) listener(next);
  };

  const readStoredConsent = (): ConsentRecord | null => {
    let raw: string | null = null;
    try { raw = storage?.getItem(CONSENT_STORAGE_KEY) ?? null; } catch { return null; }
    const record = parseConsentRecord(raw, dependencies.wallNow());
    if (raw && !record) {
      try { storage?.removeItem(CONSENT_STORAGE_KEY); } catch { /* Storage may become unavailable. */ }
    }
    return record;
  };

  const onVisibilityChange = (): void => {
    if (expireConsentIfNeeded()) return;
    if (consent !== "accepted" || !config) return;
    if (runtimeDocument.visibilityState === "hidden") {
      accrueVisibleTime();
      visibleStartedAt = null;
      flushDurations();
    } else if (visibleStartedAt === null) {
      visibleStartedAt = dependencies.monotonicNow();
    }
  };

  const onPageHide = (): void => {
    if (expireConsentIfNeeded()) return;
    if (consent !== "accepted" || !config) return;
    accrueVisibleTime();
    visibleStartedAt = null;
    flushDurations();
  };

  const onPageShow = (): void => {
    if (expireConsentIfNeeded()) return;
    if (consent === "accepted" && config && runtimeDocument.visibilityState === "visible" && visibleStartedAt === null) {
      visibleStartedAt = dependencies.monotonicNow();
    }
  };

  const onStorage = (event: StorageEvent): void => {
    if (event.storageArea !== null && event.storageArea !== storage) return;
    if (event.key !== null && event.key !== CONSENT_STORAGE_KEY) return;
    const record = parseConsentRecord(event.newValue, dependencies.wallNow());
    if (!record) {
      applyConsent("unknown", null);
      return;
    }
    applyConsent(record.consent, record.timestamp);
  };

  runtimeDocument.addEventListener("visibilitychange", onVisibilityChange);
  runtimeWindow.addEventListener("pagehide", onPageHide);
  runtimeWindow.addEventListener("pageshow", onPageShow);
  runtimeWindow.addEventListener("storage", onStorage);
  const storedConsent = readStoredConsent();
  if (storedConsent) applyConsent(storedConsent.consent, storedConsent.timestamp);

  return {
    available: config !== null,
    getConsent(): AnalyticsConsent {
      expireConsentIfNeeded();
      return consent;
    },
    setConsent(next): void {
      if (disposed) return;
      const timestamp = dependencies.wallNow();
      const record: ConsentRecord = { version: CONSENT_VERSION, consent: next, timestamp };
      try { storage?.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record)); } catch { /* Consent remains effective for this tab. */ }
      applyConsent(next, timestamp);
    },
    subscribe(listener): () => void {
      if (disposed) return () => undefined;
      subscribers.add(listener);
      return () => subscribers.delete(listener);
    },
    setLocale(nextLocale): void {
      if (disposed || nextLocale === locale) return;
      if (consent === "accepted" && config) flushDurations();
      locale = nextLocale;
    },
    openExample(id): void {
      if (disposed) return;
      if (expireConsentIfNeeded() || consent !== "accepted" || !config) {
        exampleId = null;
        exampleVisible = false;
        exampleMilliseconds = 0;
        return;
      }
      if (consent === "accepted" && config) flushDurations();
      exampleId = id;
      exampleVisible = true;
      if (consent === "accepted" && config) {
        send({ type: "example_opened", exampleId: id, locale });
      }
    },
    closeExample(): void {
      if (disposed || !exampleId) return;
      if (consent === "accepted" && config) flushDurations();
      exampleId = null;
      exampleVisible = false;
      exampleMilliseconds = 0;
    },
    setExampleVisible(visible): void {
      if (disposed || !exampleId || exampleVisible === visible) return;
      if (consent === "accepted" && config) flushDurations();
      exampleVisible = visible;
    },
    dispose(): void {
      if (disposed) return;
      if (consent === "accepted" && config) flushDurations();
      disposed = true;
      deactivate();
      provider?.dispose();
      subscribers.clear();
      runtimeDocument.removeEventListener("visibilitychange", onVisibilityChange);
      runtimeWindow.removeEventListener("pagehide", onPageHide);
      runtimeWindow.removeEventListener("pageshow", onPageShow);
      runtimeWindow.removeEventListener("storage", onStorage);
    },
  };
};
