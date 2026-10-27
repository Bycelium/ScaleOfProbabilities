import { expect, test } from "@playwright/test";

const fixture = "/tests/browser/analytics-fixture.html";

type RecorderState = Readonly<{
  starts: number;
  stops: number;
  events: Array<{ type: string; [key: string]: unknown }>;
}>;

type FixtureWindow = Window & {
  __analyticsRecorder: {
    ready(): void;
    starts: number;
    stops: number;
    events: Array<{ type: string; [key: string]: unknown }>;
  };
};

const recorderState = (page: import("@playwright/test").Page) => page.evaluate(() => {
  const recorder = (window as unknown as FixtureWindow).__analyticsRecorder;
  return { starts: recorder.starts, stops: recorder.stops, events: recorder.events } satisfies RecorderState;
});

const readyRecorder = (page: import("@playwright/test").Page) => page.evaluate(() => {
  (window as unknown as FixtureWindow).__analyticsRecorder.ready();
});

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.clear();
    localStorage.clear();
  });
});

test("keeps analytics inactive after decline and clears pending events on withdrawal", async ({ page }) => {
  await page.goto(fixture);
  const intro = page.locator("[data-scale-intro]");
  await expect(intro.locator("[data-dismiss-intro]")).toBeDisabled();
  expect(await recorderState(page)).toMatchObject({ starts: 0, events: [] });

  const decline = intro.locator('[data-intro-consent] [data-consent-choice="declined"]');
  const participate = intro.locator('[data-intro-consent] [data-consent-choice="accepted"]');
  const explore = intro.locator("[data-dismiss-intro]");
  await decline.click();
  await expect(decline).toHaveAttribute("aria-pressed", "true");
  await expect(participate).toHaveAttribute("aria-pressed", "false");
  await expect(decline).toHaveCSS("background-color", "rgb(40, 100, 84)");
  await expect(explore).toBeEnabled();
  await expect(explore).toHaveCSS("background-color", "rgb(40, 100, 84)");
  await explore.click();
  await page.locator('[data-landmark="die-six"]').click();
  await expect(page.locator("[data-detail-panel][open]")).toBeVisible();
  expect(await recorderState(page)).toMatchObject({ starts: 0, events: [] });

  await page.locator("[data-open-intro]").click();
  await page.locator("[data-privacy-from-intro]").click();
  await page.locator('[data-consent-choice="accepted"]').last().click();
  await expect.poll(() => recorderState(page).then(state => state.starts)).toBe(1);
  await page.locator('[data-consent-choice="declined"]').last().click();
  await expect.poll(() => recorderState(page).then(state => state.stops)).toBe(1);
  await readyRecorder(page);
  expect((await recorderState(page)).events).toEqual([]);
});

test("records stable Chinese event identifiers only after consent", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("probability-scale-locale", "zh"));
  await page.goto(fixture);
  const intro = page.locator("[data-scale-intro]");
  await intro.locator('[data-intro-consent] [data-consent-choice="accepted"]').click();
  await intro.locator("[data-dismiss-intro]").click();
  await expect.poll(() => recorderState(page).then(state => state.starts)).toBe(1);
  await readyRecorder(page);
  await expect.poll(() => recorderState(page).then(state => state.events.length)).toBeGreaterThan(0);
  await page.locator('[data-landmark="die-six"]').click();
  await expect(page.locator("[data-detail-panel][open]")).toBeVisible();

  await expect.poll(() => recorderState(page).then(state =>
    state.events.some(event => event.type === "example_opened"),
  )).toBe(true);
  const nonDurationEvents = (await recorderState(page)).events.filter(event =>
    event.type !== "site_time" && event.type !== "example_time",
  );
  expect(nonDurationEvents).toEqual([
    { type: "pageview" },
    { type: "example_opened", exampleId: "die-six", locale: "zh" },
  ]);
});

test("does not show a choice or block Explore when analytics is unavailable", async ({ page }) => {
  await page.goto("/");
  const intro = page.locator("[data-scale-intro]");
  await expect(intro.locator("[data-intro-consent]")).toBeHidden();
  await expect(intro.locator("[data-dismiss-intro]")).toBeEnabled();
});
