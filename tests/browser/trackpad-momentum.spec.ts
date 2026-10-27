import { expect, test, type Locator, type Page } from "@playwright/test";
import { displayLandmarks } from "../../src/catalogue";

test.use({ reducedMotion: "no-preference", viewport: { width: 1365, height: 900 } });

const prepareScale = async (page: Page, depth = 0) => {
  await page.goto(`/?trackpad-momentum#d=${depth}`);
  await page.evaluate(() => {
    sessionStorage.setItem("probability-scale-intro-seen", "true");
    localStorage.setItem("probability-scale-all-references", "true");
  });
  await page.reload();
  return page.locator(".scale");
};

const trackpadBurst = (scale: Locator, values: readonly number[]) => scale.evaluate(async (element, deltas) => {
  const timestamps: number[] = [];
  for (const deltaY of deltas) {
    timestamps.push(performance.now());
    element.dispatchEvent(new WheelEvent("wheel", { bubbles: true, cancelable: true, deltaY }));
    await new Promise<void>(resolve => window.setTimeout(resolve, 16));
  }
  return timestamps;
}, values);

test("keeps the first trackpad burst adjacent, then gathers momentum across distinct bursts", async ({ page }) => {
  test.setTimeout(60_000);
  const scale = await prepareScale(page);
  const rays = page.locator("[data-hyperspace]");
  const immediateNext = displayLandmarks
    .filter(item => item.position > 1e-9)
    .sort((first, second) => first.position - second.position)[0].position;
  const envelope = [10, 35, 70, 100, 70, 40, 20, 8, 3];

  const firstBurstTimestamps = await trackpadBurst(scale, envelope);
  expect(Math.max(...firstBurstTimestamps.slice(1).map((timestamp, index) => timestamp - firstBurstTimestamps[index]))).toBeLessThan(120);
  await expect.poll(() => scale.getAttribute("data-fast-forward"), { timeout: 10_000 }).toBeNull();
  expect(Number(await scale.getAttribute("data-depth"))).toBeCloseTo(immediateNext, 8);
  await page.waitForTimeout(250);
  expect(Number(await scale.getAttribute("data-depth"))).toBeCloseTo(immediateNext, 8);

  await page.waitForTimeout(160);
  const beforeSecond = Number(await scale.getAttribute("data-depth"));
  await trackpadBurst(scale, envelope);
  await page.waitForTimeout(350);
  const secondBurstDistance = Number(await scale.getAttribute("data-depth")) - beforeSecond;

  await page.waitForTimeout(160);
  const beforeThird = Number(await scale.getAttribute("data-depth"));
  await trackpadBurst(scale, envelope);
  await page.waitForTimeout(350);
  const thirdBurstDistance = Number(await scale.getAttribute("data-depth")) - beforeThird;
  expect(secondBurstDistance).toBeGreaterThan(0);
  expect(thirdBurstDistance).toBeGreaterThan(secondBurstDistance);

  let peakRayOpacity = 0;
  for (let burst = 0; burst < 12; burst += 1) {
    await page.waitForTimeout(160);
    await trackpadBurst(scale, envelope);
    await page.waitForTimeout(96);
    peakRayOpacity = Math.max(peakRayOpacity, await rays.evaluate(element => Number((element as HTMLElement).style.getPropertyValue("--hyperspace-opacity"))));
  }
  expect(peakRayOpacity).toBeGreaterThan(0);

  const beforeBrake = Number(await scale.getAttribute("data-depth"));
  await page.waitForTimeout(160);
  await trackpadBurst(scale, envelope.map(delta => -delta));
  await expect.poll(() => scale.getAttribute("data-fast-forward"), { timeout: 2_000 }).toBeNull();
  const stopped = Number(await scale.getAttribute("data-depth"));
  expect(stopped).toBeGreaterThan(beforeBrake);

  await page.waitForTimeout(160);
  await trackpadBurst(scale, envelope.map(delta => -delta));
  await expect(scale).toHaveAttribute("data-fast-forward", "inward");
  await expect.poll(async () => Number(await scale.getAttribute("data-depth"))).toBeLessThan(stopped);
});

test("accelerates through one sparse trackpad gap without skipping its adjacent landmark", async ({ page }) => {
  test.setTimeout(30_000);
  const scale = await prepareScale(page, 100);
  const rays = page.locator("[data-hyperspace]");
  const immediateNext = displayLandmarks
    .filter(item => item.position > 100)
    .sort((first, second) => first.position - second.position)[0].position;
  const envelope = [10, 35, 70, 100, 70, 40, 20, 8, 3];

  await trackpadBurst(scale, envelope);
  await expect.poll(async () => Number(await rays.evaluate(element => (element as HTMLElement).style.getPropertyValue("--hyperspace-opacity"))), { timeout: 4_000 }).toBeGreaterThan(0);
  await expect.poll(() => scale.getAttribute("data-fast-forward"), { timeout: 16_000 }).toBeNull();
  expect(Number(await scale.getAttribute("data-depth"))).toBeCloseTo(immediateNext, 8);
});
