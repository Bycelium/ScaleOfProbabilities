import { expect, test, type Page } from "@playwright/test";
import { displayLandmarks } from "../../src/catalogue";

const loto = displayLandmarks.find(item => item.id === "france-loto-jackpot")!;
const frenchLotoTitle = "Une grille du Loto français gagne le jackpot";
const englishLotoTitle = "A France Loto line wins the jackpot";
const frenchLotoUrl = "https://deciban.bycelium.com/fr/examples/france-loto-jackpot/";

test.use({ reducedMotion: "reduce" });

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

const exploreLotoRoute = async (page: Page, path: string, title: string) => {
  const response = await page.goto(path);
  expect(response?.status()).toBe(200);
  const intro = page.locator("[data-scale-intro]");
  const scale = page.locator(".scale");
  const detail = page.locator("[data-detail-panel]");
  await expect(intro).toBeVisible();
  await expect(scale).toHaveAttribute("data-depth", "0");
  await expect(detail).toBeHidden();
  await intro.locator("[data-dismiss-intro]").click();
  await expect(detail).toBeVisible({ timeout: 4_000 });
  await expect(detail.locator("[data-detail-reference]")).toContainText(title);
  await expect.poll(async () => Number(await scale.getAttribute("data-depth"))).toBeCloseTo(loto.position, 8);
  return { detail, scale };
};

test("serves a French deep route with localized metadata and starts its arrival from 0 dBan", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const { detail } = await exploreLotoRoute(page, "/fr/examples/france-loto-jackpot/", frenchLotoTitle);
  await expect(page).toHaveTitle(`${frenchLotoTitle} · L’échelle des probabilités`);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", frenchLotoUrl);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", frenchLotoUrl);
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "fr_FR");
  await expect(detail).toContainText("1/19 068 840");
});

test("uses the recipient browser language for a neutral landmark route", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "languages", { configurable: true, value: ["fr-FR"] });
  });
  const { detail } = await exploreLotoRoute(page, "/examples/france-loto-jackpot/", frenchLotoTitle);
  await expect(page).toHaveURL(/\/examples\/france-loto-jackpot\/$/);
  await expect(detail).toBeVisible();
});

test("keeps an open detail while the locale picker adds a localized route prefix", async ({ page }) => {
  const { detail } = await exploreLotoRoute(page, "/fr/examples/france-loto-jackpot/", frenchLotoTitle);
  await page.locator('[data-preferences-toggle="toolbar"]').click();
  const menu = page.locator("[data-preferences-menu]");
  await menu.locator('[data-locale-choice="en"]').check();
  await expect(page).toHaveURL(/\/en\/examples\/france-loto-jackpot\/$/);
  await expect(detail).toBeVisible();
  await expect(detail.locator("[data-detail-reference]")).toContainText(englishLotoTitle);
});

test("opens a reduced-motion deep link immediately after Explore", async ({ page }) => {
  const response = await page.goto("/fr/examples/france-loto-jackpot/");
  expect(response?.status()).toBe(200);
  const intro = page.locator("[data-scale-intro]");
  const scale = page.locator(".scale");
  const detail = page.locator("[data-detail-panel]");
  await expect(intro).toBeVisible();
  await intro.locator("[data-dismiss-intro]").click();
  await expect(detail).toBeVisible({ timeout: 500 });
  await expect.poll(() => scale.getAttribute("data-fast-forward")).toBeNull();
  await expect.poll(async () => Number(await scale.getAttribute("data-depth"))).toBeCloseTo(loto.position, 8);
});

test("keeps the French mobile detail clear of the complete toolbar", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  const { detail } = await exploreLotoRoute(page, "/fr/examples/france-loto-jackpot/", frenchLotoTitle);
  const toolbar = page.locator(".explorer-tools");
  await expect(detail).toBeVisible();
  await expect(toolbar.locator("button:visible, a:visible")).toHaveCount(5);

  const bounds = await page.locator("body").evaluate(() => {
    const rectangle = (element: Element) => {
      const { left, right, top, bottom } = element.getBoundingClientRect();
      return { left, right, top, bottom };
    };
    const toolbarElement = document.querySelector<HTMLElement>(".explorer-tools")!;
    const detailElement = document.querySelector<HTMLDialogElement>("[data-detail-panel]")!;
    return {
      detail: rectangle(detailElement),
      toolbar: rectangle(toolbarElement),
      controls: [...toolbarElement.querySelectorAll<HTMLElement>("button:not([hidden]), a[href]")].map(rectangle),
    };
  });

  expect(bounds.detail.bottom).toBeLessThanOrEqual(bounds.toolbar.top);
  expect(bounds.controls.every(control => control.left >= 0 && control.right <= 320 && control.top >= 0 && control.bottom <= 640)).toBe(true);
});

test("restores two event routes and their metadata through Back and Forward without reopening About", async ({ page }) => {
  const { detail } = await exploreLotoRoute(page, "/fr/examples/france-loto-jackpot/", frenchLotoTitle);
  const intro = page.locator("[data-scale-intro]");
  const firstRoute = /\/fr\/examples\/france-loto-jackpot\/$/;
  const secondRoute = /\/fr\/examples\/france-loto-main-prize\/$/;
  await detail.locator('[data-related-landmark="france-loto-main-prize"]').click();
  await expect(page).toHaveURL(secondRoute);
  await expect(detail.locator("[data-reference-article]")).toHaveAttribute("data-landmark-id", "france-loto-main-prize");

  await page.goBack();
  await expect(page).toHaveURL(firstRoute);
  await expect(intro).toBeHidden();
  await expect(detail.locator("[data-reference-article]")).toHaveAttribute("data-landmark-id", "france-loto-jackpot");
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", frenchLotoUrl);

  await page.goForward();
  await expect(page).toHaveURL(secondRoute);
  await expect(intro).toBeHidden();
  await expect(detail.locator("[data-reference-article]")).toHaveAttribute("data-landmark-id", "france-loto-main-prize");
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", "https://deciban.bycelium.com/fr/examples/france-loto-main-prize/");
});

test("returns a real HTTP 404 for an unknown landmark route", async ({ page }) => {
  const response = await page.request.get("/en/examples/no-such-landmark/", { headers: { accept: "text/html" } });
  expect(response.status()).toBe(404);
  await expect(response.text()).resolves.toContain("Page not found");
});
