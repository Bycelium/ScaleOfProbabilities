import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { BeforeSend, AnalyticsProps } from "@vercel/analytics";
import { createVercelAnalyticsProvider } from "../src/analytics-providers/vercel";

describe("Vercel Analytics provider adapter", () => {
  let injected: AnalyticsProps | undefined;
  let injectedConfiguration: string | undefined;
  let scripts: HTMLScriptElement[];
  const pageview = vi.fn();
  const track = vi.fn();

  const sdk = {
    inject: vi.fn((props: AnalyticsProps, configuration?: string) => {
      injected = props;
      injectedConfiguration = configuration;
      window.va ??= (event, properties) => {
        window.vaq ??= [];
        window.vaq.push([event, properties]);
      };
      window.va("beforeSend", props.beforeSend);
      const script = document.createElement("script");
      script.dataset.sdkn = "@vercel/analytics";
      script.src = "/_vercel/insights/script.js";
      document.head.append(script);
      scripts.push(script);
    }),
    pageview,
    track,
  };

  beforeEach(() => {
    injected = undefined;
    injectedConfiguration = undefined;
    scripts = [];
    document.head.innerHTML = "";
    Reflect.deleteProperty(window, "va");
    Reflect.deleteProperty(window, "vaq");
    Reflect.deleteProperty(window, "vai");
    vi.clearAllMocks();
    history.replaceState(null, "", "/?private=query#fragment");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads only when started, disables automatic views, and maps domain events to two properties", () => {
    const ready = vi.fn();
    const provider = createVercelAnalyticsProvider({
      window,
      document,
      sdk,
      configuration: '{"analytics":{"scriptSrc":"/_vercel/insights/x/script.js"}}',
    });
    expect(sdk.inject).not.toHaveBeenCalled();
    provider.send({ type: "pageview" });
    provider.start(ready);

    expect(injected).toMatchObject({ mode: "production", debug: false, disableAutoTrack: true });
    expect(injectedConfiguration).toBe('{"analytics":{"scriptSrc":"/_vercel/insights/x/script.js"}}');
    const beforeSend = injected!.beforeSend as BeforeSend;
    expect(beforeSend({ type: "pageview", url: "https://localhost/private?token=yes#secret" })).toEqual({
      type: "pageview",
      url: "http://localhost:3000/",
    });
    provider.send({ type: "pageview" });
    expect(pageview).not.toHaveBeenCalled();

    window.vai = true;
    scripts[0].dispatchEvent(new Event("load"));
    expect(ready).toHaveBeenCalledOnce();
    provider.send({ type: "pageview" });
    provider.send({ type: "example_opened", exampleId: "coin-heads", locale: "fr" });
    provider.send({ type: "site_time", seconds: 2.5, locale: "fr" });
    provider.send({ type: "example_time", exampleId: "coin-heads", seconds: 1.25, locale: "fr" });

    expect(pageview).toHaveBeenCalledWith({ route: "/", path: "/" });
    expect(track.mock.calls).toEqual([
      ["example_opened", { example_id: "coin-heads", locale: "fr" }],
      ["site_time", { seconds: 2.5, locale: "fr" }],
      ["example_time", { example_id: "coin-heads", seconds: 1.25 }],
    ]);

    provider.stop();
    expect(beforeSend({ type: "event", url: "https://localhost/?secret" })).toBeNull();
    provider.send({ type: "pageview" });
    expect(pageview).toHaveBeenCalledOnce();
    provider.start(ready);
    expect(ready).toHaveBeenCalledTimes(2);
    provider.dispose();
    provider.dispose();
    provider.start(vi.fn());
  });

  it("cancels a pending script and leaves a denial guard for a late runtime", () => {
    const ready = vi.fn();
    const provider = createVercelAnalyticsProvider({ window, document, sdk, configuration: "" });
    provider.start(ready);
    const canceledScript = scripts[0];
    provider.stop();

    expect(canceledScript.isConnected).toBe(false);
    expect(window.vaq).toHaveLength(1);
    expect(window.vaq?.[0]?.[0]).toBe("beforeSend");
    const withdrawalGuard = window.vaq?.[0]?.[1] as BeforeSend;
    expect(withdrawalGuard({ type: "event", url: "http://localhost:3000/private" })).toBeNull();
    canceledScript.dispatchEvent(new Event("load"));
    expect(ready).not.toHaveBeenCalled();

    provider.start(ready);
    expect(injectedConfiguration).toBeUndefined();
    expect(window.vaq).toHaveLength(2);
    const renewedGuard = window.vaq?.[1]?.[1] as BeforeSend;
    expect(renewedGuard({ type: "pageview", url: "http://localhost:3000/private?secret" })).toEqual({
      type: "pageview",
      url: "http://localhost:3000/",
    });
    window.vai = true;
    scripts[1].dispatchEvent(new Event("load"));
    expect(ready).toHaveBeenCalledOnce();
    provider.dispose();
  });

  it("preserves a runtime that executes before load through withdrawal and renewed consent", () => {
    const ready = vi.fn();
    const provider = createVercelAnalyticsProvider({ window, document, sdk });
    provider.start(ready);

    let runtimeGuard: BeforeSend = event => event;
    const runtimeRequests = vi.fn();
    window.va = (event, properties) => {
      if (event === "beforeSend") {
        runtimeGuard = properties as BeforeSend;
      } else if (event === "event") {
        const guarded = runtimeGuard({
          type: "event",
          url: "http://localhost:3000/private?secret=yes#fragment",
        });
        if (guarded) runtimeRequests(guarded);
      }
    };
    window.vai = true;
    for (const [event, properties] of window.vaq ?? []) {
      window.va(event as Parameters<NonNullable<Window["va"]>>[0], properties);
    }

    provider.stop();
    scripts[0].dispatchEvent(new Event("load"));
    expect(ready).not.toHaveBeenCalled();
    window.va("event", { name: "canceled_generation" });
    expect(runtimeRequests).not.toHaveBeenCalled();

    provider.start(ready);
    expect(ready).toHaveBeenCalledOnce();
    window.va("event", { name: "renewed_generation" });
    expect(runtimeRequests).toHaveBeenCalledOnce();
    expect(runtimeRequests.mock.calls[0][0]).toMatchObject({
      type: "event",
      url: "http://localhost:3000/",
    });

    provider.dispose();
    window.va("event", { name: "after_dispose" });
    expect(runtimeRequests).toHaveBeenCalledOnce();
  });

  it("registers the consent guard with an already-loaded SDK and isolates SDK failures", () => {
    window.vai = true;
    sdk.inject.mockImplementationOnce((props: AnalyticsProps) => { injected = props; });
    const ready = vi.fn();
    const provider = createVercelAnalyticsProvider({ window, document, sdk });
    provider.start(ready);
    expect(ready).toHaveBeenCalledOnce();
    expect(injected?.beforeSend).toEqual(expect.any(Function));

    pageview.mockImplementationOnce(() => { throw new Error("blocked"); });
    expect(() => provider.send({ type: "pageview" })).not.toThrow();
    provider.dispose();

    sdk.inject.mockImplementationOnce(() => { throw new Error("inject failed"); });
    const failed = createVercelAnalyticsProvider({ window, document, sdk });
    expect(() => failed.start(vi.fn())).not.toThrow();
    failed.dispose();
  });
});
