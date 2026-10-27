import { expect, test } from "@playwright/test";

test.use({ hasTouch: true, reducedMotion: "reduce" });

for (const locale of ["en", "fr", "zh", "es"] as const) {
  test(`keeps the detail close control available while long ${locale} content scrolls on mobile`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto("/");
    await page.evaluate(code => {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem("probability-scale-locale", code);
      localStorage.setItem("probability-scale-all-references", "true");
      sessionStorage.setItem("probability-scale-intro-seen", "true");
    }, locale);
    await page.reload();

    await page.locator('[data-landmark="covid-scenario-positive"]').click();
    const detail = page.locator("[data-detail-panel]");
    const close = page.locator("[data-close-detail]");
    const content = page.locator("[data-detail-content]");
    await expect(detail).toBeVisible();
    await expect(close).toBeVisible();

    const before = await close.boundingBox();
    expect(before).not.toBeNull();
    const scroll = await content.evaluate(element => {
      element.scrollTop = element.scrollHeight;
      return { clientHeight: element.clientHeight, scrollHeight: element.scrollHeight, scrollTop: element.scrollTop };
    });
    expect(scroll.scrollHeight).toBeGreaterThan(scroll.clientHeight);
    expect(scroll.scrollTop).toBeGreaterThan(0);

    const after = await close.boundingBox();
    expect(after).not.toBeNull();
    expect(after!.x).toBeCloseTo(before!.x, 1);
    expect(after!.y).toBeCloseTo(before!.y, 1);
    await expect(close).toBeInViewport();
    await expect(page.locator("[data-detail-sources]")).toBeInViewport();

    await close.click();
    await expect(detail).toBeHidden();
  });
}
