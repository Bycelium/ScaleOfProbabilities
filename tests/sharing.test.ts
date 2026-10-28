import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { displayLandmarks, type DisplayLandmark } from "../src/catalogue";
import { locales } from "../src/locales";
import { citationText, createSharingControl, sharePayload, type ShareSelection } from "../src/sharing";

const coin = displayLandmarks.find(item => item.id === "coin-heads")!;

const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
};

const setNavigatorProperty = (property: "share" | "clipboard", value: unknown): void => {
  Object.defineProperty(navigator, property, { configurable: true, value });
};

const settle = async (): Promise<void> => {
  await Promise.resolve();
  await Promise.resolve();
};

describe("sharing", () => {
  let root: HTMLElement;
  let trigger: HTMLButtonElement;
  let selection: ShareSelection;

  beforeEach(() => {
    document.body.innerHTML = '<main id="app"><button data-trigger>Share</button></main>';
    root = document.querySelector<HTMLElement>("#app")!;
    trigger = root.querySelector<HTMLButtonElement>("[data-trigger]")!;
    selection = { item: coin, locale: locales.en, route: { locale: "en", landmarkId: coin.id } };
  });

  afterEach(() => {
    Reflect.deleteProperty(navigator, "share");
    Reflect.deleteProperty(navigator, "clipboard");
    vi.restoreAllMocks();
  });

  it("builds localized native payloads and source-backed citations", () => {
    expect(sharePayload(selection)).toEqual({
      title: "A chosen side of a fair coin",
      text: "Explore this probability: A chosen side of a fair coin",
      url: "https://deciban.bycelium.com/en/examples/coin-heads/",
    });
    expect(sharePayload({ locale: locales.fr, route: { locale: "fr" } })).toEqual({
      title: "L’échelle des probabilités",
      text: "Explorez des événements, des plus courants aux presque impossibles.",
      url: "https://deciban.bycelium.com/fr/",
    });

    const citation = citationText(selection, new Date("2026-01-02T12:00:00Z"));
    expect(citation).toContain("Bycelium. A chosen side of a fair coin. The Scale of Probability.");
    expect(citation).toContain("https://deciban.bycelium.com/en/examples/coin-heads/");
    expect(citation).toContain("Accessed January 2, 2026.");
    expect(citation).toContain("Sources:");

    const sourceWithLink: DisplayLandmark = { ...coin, sources: [{ ...coin.sources[0]!, href: "https://example.test/source" }] };
    expect(citationText({ ...selection, item: sourceWithLink }, new Date("2026-01-02T12:00:00Z"))).toContain("https://example.test/source");

    const sourceWithoutLink: DisplayLandmark = { ...coin, sources: [{ ...coin.sources[0]!, href: undefined }] };
    const unlinkedCitation = citationText({ ...selection, item: sourceWithoutLink }, new Date("2026-01-02T12:00:00Z"));
    expect(unlinkedCitation.split("\n")[1]).toBe(`Sources: ${locales.en.sources[coin.sources[0]!.id].label}.`);
    expect(citationText({ locale: locales.en, route: {} }, new Date("2026-01-02T12:00:00Z"))).not.toContain("Sources:");
  });

  it("keeps every localized Bluesky intent within its 300-grapheme limit", () => {
    for (const locale of Object.values(locales)) {
      const segmenter = new Intl.Segmenter(locale.numberLocale, { granularity: "grapheme" });
      for (const item of displayLandmarks) {
        const payload = sharePayload({ item, locale, route: { locale: locale.code, landmarkId: item.id } });
        const intentText = `${payload.text} ${payload.url}`;
        expect([...segmenter.segment(intentText)].length, `${locale.code}:${item.id}`).toBeLessThanOrEqual(300);
      }
    }
  });

  it("uses native sharing directly and keeps cancellation quiet", async () => {
    const first = deferred<void>();
    const second = deferred<void>();
    const third = deferred<void>();
    const syncFailure = new Error("synchronous device failure");
    const share = vi.fn()
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise)
      .mockReturnValueOnce(third.promise)
      .mockImplementationOnce(() => { throw syncFailure; });
    setNavigatorProperty("share", share);
    const beforeOpen = vi.fn();
    const control = createSharingControl(root, trigger, () => selection, beforeOpen);
    const dialog = root.querySelector<HTMLDialogElement>("[data-share-dialog]")!;

    trigger.click();
    expect(share).toHaveBeenCalledWith(sharePayload(selection));
    expect(share).toHaveBeenCalledTimes(1);
    expect(dialog.open).toBe(false);
    first.resolve();
    await settle();
    expect(dialog.open).toBe(false);

    trigger.click();
    second.reject({ name: "AbortError" });
    await settle();
    expect(dialog.open).toBe(false);

    trigger.click();
    third.reject(new Error("device share failed"));
    await settle();
    expect(dialog.open).toBe(true);
    expect(dialog.querySelector("[data-share-status]")?.textContent).toContain("Device sharing did not open");
    expect(document.activeElement).toBe(dialog.querySelector("[data-close-share]"));
    expect(beforeOpen).toHaveBeenCalledTimes(4);
    dialog.querySelector<HTMLButtonElement>("[data-close-share]")!.click();
    trigger.click();
    expect(dialog.open).toBe(true);
    expect(beforeOpen).toHaveBeenCalledTimes(6);
    control.destroy();
  });

  it("opens the accessible fallback, updates provider links, and restores focus", () => {
    setNavigatorProperty("share", undefined);
    const control = createSharingControl(root, trigger, () => selection);
    trigger.focus();
    trigger.click();
    const dialog = root.querySelector<HTMLDialogElement>("[data-share-dialog]")!;
    const close = dialog.querySelector<HTMLButtonElement>("[data-close-share]")!;

    expect(control.isOpen()).toBe(true);
    expect(document.activeElement).toBe(close);
    expect(dialog.querySelector("[data-copy-link-label]")?.textContent).toBe("Copy link");
    expect(dialog.querySelector<HTMLAnchorElement>("[data-share-x]")?.href).toContain("x.com/intent/tweet");
    expect(dialog.querySelector<HTMLAnchorElement>("[data-share-x]")?.href).toContain("url=https%3A%2F%2Fdeciban.bycelium.com%2Fen%2Fexamples%2Fcoin-heads%2F");
    expect(dialog.querySelector<HTMLAnchorElement>("[data-share-linkedin]")?.href).toContain("linkedin.com/sharing/share-offsite");
    expect(dialog.querySelector<HTMLAnchorElement>("[data-share-bluesky]")?.href).toContain(encodeURIComponent("https://deciban.bycelium.com/en/examples/coin-heads/"));
    close.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(dialog.querySelector<HTMLButtonElement>("[data-copy-citation]"));
    dialog.querySelector<HTMLButtonElement>("[data-copy-link]")!.focus();
    dialog.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(close);
    dialog.querySelector<HTMLButtonElement>("[data-copy-citation]")!.focus();
    dialog.querySelector<HTMLButtonElement>("[data-copy-citation]")!.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(close);
    const ordinaryKey = new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true });
    dialog.dispatchEvent(ordinaryKey);
    expect(ordinaryKey.defaultPrevented).toBe(false);

    selection = { locale: locales.fr, route: { locale: "fr" } };
    control.update();
    expect(dialog.querySelector("[data-share-title]")?.textContent).toBe("Partager l’échelle des probabilités");
    trigger.click();
    expect(control.isOpen()).toBe(true);
    dialog.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(control.isOpen()).toBe(false);
    expect(document.activeElement).toBe(trigger);

    trigger.click();
    close.click();
    expect(control.isOpen()).toBe(false);
    trigger.click();
    const cancel = new Event("cancel", { cancelable: true });
    dialog.dispatchEvent(cancel);
    expect(cancel.defaultPrevented).toBe(true);
    expect(control.isOpen()).toBe(false);
    trigger.click();
    dialog.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    expect(control.isOpen()).toBe(false);
    control.update();
    control.destroy();
  });

  it("copies links and citations and exposes selectable text when clipboard access fails", async () => {
    setNavigatorProperty("share", undefined);
    const writeText = vi.fn().mockResolvedValueOnce(undefined).mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error("denied"));
    setNavigatorProperty("clipboard", { writeText });
    const control = createSharingControl(root, trigger, () => selection);
    trigger.click();
    const dialog = root.querySelector<HTMLDialogElement>("[data-share-dialog]")!;
    const status = dialog.querySelector<HTMLElement>("[data-share-status]")!;
    const fallback = dialog.querySelector<HTMLTextAreaElement>("[data-share-fallback]")!;

    dialog.querySelector<HTMLButtonElement>("[data-copy-link]")!.click();
    await settle();
    expect(writeText).toHaveBeenLastCalledWith("https://deciban.bycelium.com/en/examples/coin-heads/");
    expect(status.textContent).toBe("Link copied.");
    expect(fallback.hidden).toBe(true);

    dialog.querySelector<HTMLButtonElement>("[data-copy-citation]")!.click();
    await settle();
    expect(writeText.mock.calls[1]![0]).toContain("Bycelium. A chosen side of a fair coin.");
    expect(status.textContent).toBe("Citation copied.");

    dialog.querySelector<HTMLButtonElement>("[data-copy-link]")!.click();
    await settle();
    expect(status.textContent).toContain("Copying is unavailable");
    expect(fallback.hidden).toBe(false);
    expect(fallback.readOnly).toBe(true);
    expect(fallback.value).toBe("https://deciban.bycelium.com/en/examples/coin-heads/");
    expect(fallback.selectionStart).toBe(0);
    expect(fallback.selectionEnd).toBe(fallback.value.length);
    expect(document.activeElement).toBe(fallback);

    setNavigatorProperty("clipboard", undefined);
    dialog.querySelector<HTMLButtonElement>("[data-copy-link]")!.click();
    await settle();
    expect(fallback.value).toBe("https://deciban.bycelium.com/en/examples/coin-heads/");

    const lateSuccess = deferred<void>();
    setNavigatorProperty("clipboard", { writeText: () => lateSuccess.promise });
    dialog.querySelector<HTMLButtonElement>("[data-copy-link]")!.click();
    dialog.querySelector<HTMLButtonElement>("[data-close-share]")!.click();
    lateSuccess.resolve();
    await settle();
    expect(dialog.open).toBe(false);
    control.destroy();
  });

  it("ignores stale native and clipboard completions after state changes or destruction", async () => {
    const first = deferred<void>();
    const second = deferred<void>();
    const third = deferred<void>();
    const share = vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise).mockReturnValueOnce(third.promise);
    setNavigatorProperty("share", share);
    const control = createSharingControl(root, trigger, () => selection);
    const dialog = root.querySelector<HTMLDialogElement>("[data-share-dialog]")!;

    trigger.click();
    selection = { locale: locales.fr, route: { locale: "fr" } };
    first.reject(new Error("late failure"));
    await settle();
    expect(dialog.open).toBe(false);

    trigger.click();
    trigger.click();
    second.reject(new Error("superseded"));
    third.resolve();
    await settle();
    expect(dialog.open).toBe(false);

    setNavigatorProperty("share", undefined);
    const clipboard = deferred<void>();
    setNavigatorProperty("clipboard", { writeText: () => clipboard.promise });
    trigger.click();
    dialog.querySelector<HTMLButtonElement>("[data-copy-link]")!.click();
    control.destroy();
    clipboard.reject(new Error("late clipboard failure"));
    await settle();
    expect(root.querySelector("[data-share-dialog]")).toBeNull();
  });
});
