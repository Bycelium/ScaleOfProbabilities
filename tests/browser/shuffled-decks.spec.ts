import { expect, test, type Page } from "@playwright/test";
import { displayLandmarks } from "../../src/catalogue";
import { locales, localizeLandmark, type LocaleCode } from "../../src/locales";

const openScene = async (page: Page, locale: string, depth: number) => {
  await page.goto(`/#d=${depth}`);
  await page.evaluate(selectedLocale => {
    sessionStorage.setItem("probability-scale-intro-seen", "true");
    localStorage.setItem("probability-scale-all-references", "true");
    localStorage.setItem("probability-scale-locale", selectedLocale);
  }, locale);
  await page.reload();
  await expect(page.locator(".scale")).toHaveAttribute("data-depth", String(depth));
};

const localesToTest = ["en", "fr", "zh", "es"] as const satisfies readonly LocaleCode[];

const titleFor = (id: string, locale: LocaleCode) => {
  const landmark = displayLandmarks.find(item => item.id === id)!;
  return localizeLandmark(landmark, locales[locale]).title;
};

const verifyDeckConnections = async (page: Page, locale: LocaleCode) => {
  await page.setViewportSize({ width: 320, height: 740 });
  const standard = displayLandmarks.find(item => item.id === "shuffled-deck-specified-order")!;
  await openScene(page, locale, standard.position);
  await page.locator('[data-landmark="shuffled-deck-specified-order"]').click();
  await expect(page.locator("[data-detail-panel][open]")).toBeVisible();
  await expect(page.locator("[data-detail-title]")).toHaveText(titleFor("shuffled-deck-specified-order", locale));
  await expect(page.locator('[data-related-landmark="shuffled-tarot-specified-order"]')).toBeVisible();
  await page.locator('[data-related-landmark="shuffled-tarot-specified-order"]').click();
  await expect(page.locator("[data-detail-title]")).toHaveText(titleFor("shuffled-tarot-specified-order", locale));
  await expect(page.locator('[data-related-landmark="shuffled-belote-specified-order"]')).toBeVisible();
  await page.locator('[data-related-landmark="shuffled-belote-specified-order"]').click();
  await expect(page.locator("[data-detail-panel][open]")).toBeVisible();
  await expect(page.locator("[data-detail-title]")).toHaveText(titleFor("shuffled-belote-specified-order", locale));
  await expect(page.locator('[data-related-landmark="shuffled-deck-specified-order"]')).toBeVisible();
};

for (const locale of localesToTest) {
  test(`connects the three specified shuffled decks on mobile in ${locale}`, async ({ page }) => {
    await verifyDeckConnections(page, locale);
  });
}
