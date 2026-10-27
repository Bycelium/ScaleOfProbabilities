import {
  inject as injectVercelAnalytics,
  pageview as trackVercelPageview,
  track as trackVercelEvent,
  type BeforeSend,
} from "@vercel/analytics";
import type { AnalyticsProvider } from "../analytics";

type VercelInjectProps = NonNullable<Parameters<typeof injectVercelAnalytics>[0]>;

type VercelSdk = Readonly<{
  inject(props: VercelInjectProps, configuration?: string): void;
  pageview(properties: { route: string; path: string }): void;
  track(name: string, properties: Record<string, string | number>): void;
}>;

export type VercelProviderDependencies = Readonly<{
  window: Window;
  document: Document;
  sdk?: VercelSdk;
  configuration?: string;
}>;

const defaultSdk: VercelSdk = {
  inject: injectVercelAnalytics,
  pageview: trackVercelPageview,
  track: trackVercelEvent,
};

export const createVercelAnalyticsProvider = ({
  window: runtimeWindow,
  document: runtimeDocument,
  sdk = defaultSdk,
  configuration = __VERCEL_OBSERVABILITY_CLIENT_CONFIG__,
}: VercelProviderDependencies): AnalyticsProvider => {
  let active = false;
  let ready = false;
  let disposed = false;
  let generation = 0;
  let script: HTMLScriptElement | null = null;
  let readyCallback: (() => void) | null = null;

  const beforeSend: BeforeSend = event => active
    ? { ...event, url: `${runtimeWindow.location.origin}/` }
    : null;

  const markReady = (expectedGeneration: number): void => {
    if (generation !== expectedGeneration) return;
    ready = true;
    readyCallback!();
  };

  const resetPendingSdk = (): void => {
    if (ready) return;
    script?.remove();
    script = null;
    const deny: BeforeSend = () => null;
    if (runtimeWindow.vai === true && runtimeWindow.va) {
      runtimeWindow.va("beforeSend", deny);
      return;
    }
    // Removing a script does not cancel an in-flight response. Leave a denial
    // guard for a late runtime to consume, and keep queueing through the same
    // shim so a later consent can install its fresh guard after this one.
    runtimeWindow.vaq = [["beforeSend", deny]];
    runtimeWindow.va = (event, properties): void => {
      runtimeWindow.vaq?.push([event, properties]);
    };
  };

  return {
    start(onReady): void {
      if (disposed) return;
      active = true;
      readyCallback = onReady;
      const expectedGeneration = generation;
      if (ready) {
        onReady();
        return;
      }
      try {
        sdk.inject(
          { mode: "production", debug: false, disableAutoTrack: true, beforeSend },
          configuration || undefined,
        );
      } catch {
        return;
      }
      if (runtimeWindow.vai === true) {
        markReady(expectedGeneration);
        return;
      }
      script = runtimeDocument.head.querySelector<HTMLScriptElement>('script[data-sdkn^="@vercel/analytics"]');
      script?.addEventListener("load", () => {
        if (runtimeWindow.vai === true) markReady(expectedGeneration);
      }, { once: true });
    },
    send(event): void {
      if (disposed || !active || !ready) return;
      try {
        if (event.type === "pageview") {
          sdk.pageview({ route: "/", path: "/" });
        } else if (event.type === "example_opened") {
          sdk.track("example_opened", { example_id: event.exampleId, locale: event.locale });
        } else if (event.type === "site_time") {
          sdk.track("site_time", { seconds: event.seconds, locale: event.locale });
        } else {
          sdk.track("example_time", { example_id: event.exampleId, seconds: event.seconds });
        }
      } catch {
        // Provider failures must never interrupt the scene.
      }
    },
    stop(): void {
      active = false;
      readyCallback = null;
      generation += 1;
      resetPendingSdk();
    },
    dispose(): void {
      if (disposed) return;
      active = false;
      readyCallback = null;
      generation += 1;
      resetPendingSdk();
      disposed = true;
    },
  };
};
