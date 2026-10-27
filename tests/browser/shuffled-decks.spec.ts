import { expect, test, type Page } from "@playwright/test";
import { displayLandmarks } from "../../src/catalogue";

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

test("connects the three specified shuffled decks on mobile in every language", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  const standard = displayLandmarks.find(item => item.id === "shuffled-deck-specified-order")!;
  for (const locale of ["en", "fr", "zh", "es"]) {
    await openScene(page, locale, standard.position);
    await page.locator('[data-landmark="shuffled-deck-specified-order"]').click();
    await expect(page.locator("[data-detail-panel][open]")).toBeVisible();
    await expect(page.locator('[data-related-landmark="shuffled-tarot-specified-order"]')).toBeVisible();
    await page.locator('[data-related-landmark="shuffled-tarot-specified-order"]').click();
    await expect(page.locator('[data-related-landmark="shuffled-belote-specified-order"]')).toBeVisible();
    await page.locator('[data-related-landmark="shuffled-belote-specified-order"]').click();
    await expect(page.locator("[data-detail-panel][open]")).toBeVisible();
    await expect(page.locator('[data-related-landmark="shuffled-deck-specified-order"]')).toBeVisible();
  }
});
