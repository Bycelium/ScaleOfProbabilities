import "../../src/style.css";
import { createAnalytics } from "../../src/analytics";
import { resolveInitialLocale } from "../../src/locales";
import { createScale } from "../../src/scale";
import { FakeAnalyticsProvider } from "../helpers/fake-analytics-provider";

const recorder = new FakeAnalyticsProvider();
Object.assign(window, { __analyticsRecorder: recorder });
const analytics = createAnalytics({ provider: "vercel" }, resolveInitialLocale().code, {
  window,
  document,
  wallNow: () => Date.now(),
  monotonicNow: () => performance.now(),
  providerFactory: () => recorder,
});

createScale(document.querySelector<HTMLElement>("#app")!, {
  analytics,
});
