import { expect, test, type Page } from "@playwright/test";

const frenchLotoTitle = "Une grille du Loto français gagne le jackpot";
const frenchLotoUrl = "https://deciban.bycelium.com/fr/examples/france-loto-jackpot/";
const feedbackHref = "mailto:feedback.scaleofprobabilities@bycelium.com";

test.use({ reducedMotion: "reduce" });

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

const openLotoRoute = async (page: Page, locale: "en" | "fr") => {
  await page.goto(`/${locale}/examples/france-loto-jackpot/`);
  const intro = page.locator("[data-scale-intro]");
  await expect(intro).toBeVisible();
  await intro.locator("[data-dismiss-intro]").click();
  await expect(page.locator("[data-detail-panel]")).toBeVisible();
};

test("the global Share button invokes native sharing with the localized deep link and leaves cancellation quiet", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: async (payload: ShareData) => {
        Object.assign(window, { __capturedSharePayload: payload });
        throw new DOMException("The user canceled sharing", "AbortError");
      },
    });
  });
  await openLotoRoute(page, "fr");

  const share = page.locator("[data-open-share]");
  await expect(share).toHaveCount(1);
  await share.click();

  await expect.poll(() => page.evaluate(() => (
    window as typeof window & { __capturedSharePayload?: ShareData }
  ).__capturedSharePayload)).not.toBeUndefined();
  const payload = await page.evaluate(() => (
    window as typeof window & { __capturedSharePayload: ShareData }
  ).__capturedSharePayload);
  expect(payload).toMatchObject({ title: frenchLotoTitle, url: frenchLotoUrl });
  expect(payload.text).toContain("Explorez cette probabilité");
  expect(payload.text).toContain(frenchLotoTitle);
  await expect(page.locator("[data-share-dialog]")).toBeHidden();
  await expect(share).toBeFocused();
  await expect(page.locator("[data-feedback-link]")).toHaveAttribute("href", feedbackHref);
});

test("the fallback sheet offers equal provider actions, a selectable copy fallback, and restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", { configurable: true, value: undefined });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => { throw new Error("Clipboard unavailable"); } },
    });
  });
  await openLotoRoute(page, "fr");

  const trigger = page.locator("[data-open-share]");
  const dialog = page.locator("[data-share-dialog]");
  const sheet = dialog.locator("[data-share-sheet]");
  await trigger.click();
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("[data-close-share]")).toBeFocused();

  const providerLinks = {
    x: dialog.locator("[data-share-x]"),
    linkedIn: dialog.locator("[data-share-linkedin]"),
    bluesky: dialog.locator("[data-share-bluesky]"),
  };
  const xUrl = new URL((await providerLinks.x.getAttribute("href"))!);
  const linkedInUrl = new URL((await providerLinks.linkedIn.getAttribute("href"))!);
  const blueskyUrl = new URL((await providerLinks.bluesky.getAttribute("href"))!);
  expect(xUrl.searchParams.get("url")).toBe(frenchLotoUrl);
  expect(linkedInUrl.searchParams.get("url")).toBe(frenchLotoUrl);
  expect(blueskyUrl.searchParams.get("text")).toContain(frenchLotoUrl);

  const primary = dialog.locator("[data-copy-link], [data-share-x], [data-share-linkedin], [data-share-bluesky]");
  await expect(primary).toHaveCount(4);
  const primarySizes = await primary.evaluateAll(elements => elements.map(element => {
    const { width, height } = element.getBoundingClientRect();
    return { width: Math.round(width), height: Math.round(height) };
  }));
  expect(new Set(primarySizes.map(size => size.width)).size).toBe(1);
  expect(new Set(primarySizes.map(size => size.height)).size).toBe(1);

  await dialog.locator("[data-copy-link]").click();
  const fallback = dialog.locator("[data-share-fallback]");
  await expect(fallback).toBeVisible();
  await expect(fallback).toHaveAttribute("readonly", "");
  await expect(fallback).toHaveValue(frenchLotoUrl);
  await expect(fallback).toBeFocused();
  expect(await fallback.evaluate((element: HTMLInputElement | HTMLTextAreaElement) => ({
    start: element.selectionStart,
    end: element.selectionEnd,
    length: element.value.length,
  }))).toEqual({ start: 0, end: frenchLotoUrl.length, length: frenchLotoUrl.length });
  await expect(dialog.locator("[data-share-status]")).not.toBeEmpty();
  await expect(dialog.locator("[data-copy-citation]")).toBeVisible();
  await expect(dialog.locator("[data-download-gif]")).toHaveAttribute("href", "/social/loto-journey.gif");

  const mobileSheet = await sheet.evaluate(element => {
    const { left, right, bottom, width } = element.getBoundingClientRect();
    return { left, right, bottom, width, viewportWidth: innerWidth, viewportHeight: innerHeight };
  });
  expect(mobileSheet.left).toBeLessThanOrEqual(1);
  expect(mobileSheet.right).toBeGreaterThanOrEqual(mobileSheet.viewportWidth - 1);
  expect(mobileSheet.bottom).toBeGreaterThanOrEqual(mobileSheet.viewportHeight - 1);

  await dialog.locator("[data-close-share]").click();
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();

  await page.setViewportSize({ width: 1000, height: 800 });
  await trigger.click();
  const desktopSheet = await sheet.evaluate(element => {
    const { top, bottom, width } = element.getBoundingClientRect();
    return { top, bottom, width, viewportHeight: innerHeight };
  });
  expect(desktopSheet.width).toBeLessThan(600);
  expect(desktopSheet.top).toBeGreaterThan(40);
  expect(desktopSheet.bottom).toBeLessThan(desktopSheet.viewportHeight - 40);
});

for (const scenario of [
  { locale: "fr" as const, width: 320, height: 640 },
  { locale: "en" as const, width: 390, height: 844 },
]) {
  test(`keeps all five ${scenario.locale} toolbar controls usable at ${scenario.width}px`, async ({ page }) => {
    await page.setViewportSize({ width: scenario.width, height: scenario.height });
    await openLotoRoute(page, scenario.locale);

    const toolbar = page.locator(".explorer-tools");
    const controls = toolbar.locator("button:visible, a:visible");
    await expect(controls).toHaveCount(5);
    await expect(toolbar.locator("[data-open-share]")).toHaveCount(1);
    await expect(toolbar.locator("[data-feedback-link]")).toHaveAttribute("href", feedbackHref);
    await expect(toolbar.locator("[data-return-label]")).toBeHidden();

    const geometry = await controls.evaluateAll((elements, viewport) => {
      const boxes = elements.map(element => {
        const { left, right, top, bottom } = element.getBoundingClientRect();
        return { left, right, top, bottom };
      }).sort((first, second) => first.left - second.left);
      return {
        boxes,
        withinViewport: boxes.every(box => box.left >= 0 && box.right <= viewport.width && box.top >= 0 && box.bottom <= viewport.height),
        separated: boxes.every((box, index) => index === boxes.length - 1 || box.right <= boxes[index + 1].left + .5),
        pageWidth: document.documentElement.scrollWidth,
      };
    }, { width: scenario.width, height: scenario.height });
    expect(geometry.withinViewport).toBe(true);
    expect(geometry.separated).toBe(true);
    expect(geometry.pageWidth).toBeLessThanOrEqual(scenario.width);
  });
}
