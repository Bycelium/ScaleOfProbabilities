import { expect, test, type CDPSession, type Page } from "@playwright/test";
import { displayLandmarks } from "../../src/catalogue";

test.use({ hasTouch: true, reducedMotion: "no-preference", viewport: { width: 390, height: 844 } });

const prepareScale = async (page: Page) => {
  await page.goto("/?travel-momentum#d=0");
  await page.evaluate(() => {
    sessionStorage.setItem("probability-scale-intro-seen", "true");
    localStorage.setItem("probability-scale-all-references", "true");
  });
  await page.reload();
  return page.locator(".scale");
};

const swipe = async (session: CDPSession, page: Page, startY: number, endY: number, onMove?: () => Promise<void>) => {
  const point = (y: number) => ({ x: 195, y, id: 1, radiusX: 1, radiusY: 1, force: 1 });
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [point(startY)] });
  for (let step = 1; step <= 6; step += 1) {
    await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [point(startY + (endY - startY) * step / 6)] });
    await page.waitForTimeout(20);
    await onMove?.();
  }
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
};

const tap = async (session: CDPSession, y: number) => {
  const point = { x: 195, y, id: 1, radiusX: 1, radiusY: 1, force: 1 };
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [point] });
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
};

test("repeated mobile swipes gather speed, show travel rays, brake, and reverse cleanly", async ({ page }) => {
  const scale = await prepareScale(page);
  const hyperspace = page.locator("[data-hyperspace]");
  const session = await page.context().newCDPSession(page);
  const firstInwardDestination = displayLandmarks
    .filter(item => item.position < -1e-9)
    .sort((first, second) => second.position - first.position)[0].position;
  let peakRayOpacity = 0;
  const sampleRays = async () => {
    peakRayOpacity = Math.max(peakRayOpacity, await hyperspace.evaluate(element => Number((element as HTMLElement).style.getPropertyValue("--hyperspace-opacity"))));
  };
  await swipe(session, page, 680, 380, sampleRays);
  await expect.poll(() => scale.getAttribute("data-fast-forward"), { timeout: 4_000 }).toBeNull();
  expect(Number(await scale.getAttribute("data-depth"))).toBeCloseTo(firstInwardDestination, 8);

  const swipeDepths: number[] = [];
  for (let gesture = 0; gesture < 12; gesture += 1) {
    await swipe(session, page, 680, 380, sampleRays);
    await page.waitForTimeout(32);
    await sampleRays();
    swipeDepths.push(Number(await scale.getAttribute("data-depth")));
  }

  const secondSwipeDistance = Math.abs(swipeDepths[0] - firstInwardDestination);
  const thirdSwipeDistance = Math.abs(swipeDepths[1] - swipeDepths[0]);
  expect(thirdSwipeDistance).toBeGreaterThan(secondSwipeDistance * 2);
  expect(Math.abs(swipeDepths.at(-1)! - swipeDepths[0])).toBeGreaterThan(Math.abs(swipeDepths[0] - firstInwardDestination));
  expect(Number(await scale.getAttribute("data-depth"))).toBeLessThan(firstInwardDestination);
  expect(peakRayOpacity).toBeGreaterThan(0);
  await expect.poll(() => scale.getAttribute("data-fast-forward"), { timeout: 8_000 }).toBeNull();
  const arrivedDepth = Number(await scale.getAttribute("data-depth"));
  expect(displayLandmarks.some(item => Math.abs(item.position - arrivedDepth) < 1e-9)).toBe(true);
  await page.waitForTimeout(200);
  expect(Number(await scale.getAttribute("data-depth"))).toBe(arrivedDepth);

  peakRayOpacity = 0;
  for (let gesture = 0; gesture < 16 && peakRayOpacity === 0; gesture += 1) {
    await swipe(session, page, 680, 380, sampleRays);
    await page.waitForTimeout(32);
    await sampleRays();
  }
  expect(peakRayOpacity).toBeGreaterThan(0);
  await expect(scale).toHaveAttribute("data-fast-forward", "inward");
  const beforeCounterGesture = Number(await scale.getAttribute("data-depth"));
  await swipe(session, page, 380, 680);
  await expect.poll(() => scale.getAttribute("data-fast-forward"), { timeout: 1_000 }).toBeNull();
  const firstStopDepth = Number(await scale.getAttribute("data-depth"));
  expect(firstStopDepth).toBeLessThan(beforeCounterGesture);

  await swipe(session, page, 380, 680);
  await expect(scale).toHaveAttribute("data-fast-forward", "outward");
  await expect.poll(async () => Number(await scale.getAttribute("data-depth"))).toBeGreaterThan(firstStopDepth);

  const beforeTap = Number(await scale.getAttribute("data-depth"));
  await tap(session, 620);
  await expect.poll(() => scale.getAttribute("data-fast-forward"), { timeout: 1_000 }).toBeNull();
  const stoppedDepth = Number(await scale.getAttribute("data-depth"));
  expect(stoppedDepth).toBeGreaterThanOrEqual(beforeTap);
  await page.waitForTimeout(250);
  expect(Number(await scale.getAttribute("data-depth"))).toBe(stoppedDepth);
  await session.detach();
});
