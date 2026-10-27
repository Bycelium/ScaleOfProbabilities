import { expect, test, type TestInfo } from "@playwright/test";

test.use({ hasTouch: true, reducedMotion: "no-preference" });

test("keeps several bright travel rays inside the mobile scene", async ({ page }, testInfo: TestInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?travel-rays#d=180");
  await page.evaluate(() => {
    sessionStorage.setItem("probability-scale-intro-seen", "true");
    localStorage.setItem("probability-scale-all-references", "true");
  });
  await page.reload();

  const scale = page.locator(".scale");
  await page.locator("[data-return-zero]").click();
  await expect(scale).toHaveAttribute("data-fast-forward", "inward");

  await expect.poll(() => scale.evaluate(element => {
    const scene = element.getBoundingClientRect();
    const layer = element.querySelector<HTMLElement>("[data-hyperspace]")!;
    const layerStyle = getComputedStyle(layer);
    if (layerStyle.display === "none") return 0;
    const layerOpacity = Number(layerStyle.opacity);
    return [...layer.querySelectorAll<HTMLElement>("i")].filter(ray => {
      const box = ray.getBoundingClientRect();
      const centerX = box.left + box.width / 2;
      const centerY = box.top + box.height / 2;
      return layerOpacity * Number(getComputedStyle(ray).opacity) > .1
        && centerX > scene.left && centerX < scene.right
        && centerY > scene.top && centerY < scene.bottom;
    }).length;
  })).toBeGreaterThanOrEqual(6);

  const screenshot = testInfo.outputPath("mobile-return-rays.png");
  await page.screenshot({ path: screenshot });
  await testInfo.attach("mobile-return-rays", { path: screenshot, contentType: "image/png" });

  await expect(scale).not.toHaveAttribute("data-fast-forward");
  await expect.poll(() => scale.locator("[data-hyperspace]").evaluate(layer => getComputedStyle(layer).opacity)).toBe("0");
});
