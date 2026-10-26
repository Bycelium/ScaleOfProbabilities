import { expect, test, type Page, type TestInfo } from "@playwright/test";

test.use({ hasTouch: true, reducedMotion: "reduce" });

const capture = async (page: Page, testInfo: TestInfo, name: string) => {
  const path = testInfo.outputPath(`${name}.png`);
  await page.screenshot({ path });
  await testInfo.attach(name, { path, contentType: "image/png" });
};

const sceneArtworkText = (page: Page, id: string, key: string) => page.locator(`[data-landmark="${id}"] .art img`).evaluate((image, artworkKey) => {
  const source = (image as HTMLImageElement).getAttribute("src")!;
  const artwork = new DOMParser().parseFromString(decodeURIComponent(source.slice(source.indexOf(",") + 1)), "image/svg+xml");
  return artwork.querySelector(`[data-art-text="${artworkKey}"]`)?.textContent;
}, key);

test("keeps illustration centers at their exact projected positions through arrival", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/?arrival#d=0");
  await page.evaluate(() => {
    sessionStorage.setItem("probability-scale-intro-seen", "true");
    localStorage.setItem("probability-scale-all-references", "true");
  });
  await page.reload();

  const samples = await page.evaluate(async () => {
    const scale = document.querySelector<HTMLElement>(".scale")!;
    const scene = document.querySelector<HTMLElement>("[data-depth-scene]")!;
    const details = document.querySelector<HTMLDialogElement>("[data-detail-panel]")!;
    const inspect = () => {
      const bounds = scale.getBoundingClientRect();
      const zoom = Number(scene.dataset.sceneZoom);
      const offsets = [...document.querySelectorAll<HTMLButtonElement>("[data-landmark]")]
        .filter(button => !button.hidden)
        .map(button => {
          const art = button.querySelector<HTMLImageElement>(".art img")!.getBoundingClientRect();
          const expectedX = bounds.left + bounds.width / 2 + (Number.parseFloat(button.style.left) - bounds.width / 2) * zoom;
          return { id: button.dataset.landmark, error: Math.abs(art.left + art.width / 2 - expectedX) };
        });
      return { depth: Number(scale.dataset.depth), zoom, worst: offsets.sort((first, second) => second.error - first.error)[0] };
    };
    const positions = [inspect()];
    document.querySelector<HTMLButtonElement>('[data-landmark="die-six"]')!.click();
    return new Promise<typeof positions>(resolve => {
      const sample = () => {
        positions.push(inspect());
        if (details.open) resolve(positions);
        else requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
  });
  expect(samples.length).toBeGreaterThan(3);
  expect(samples.some(sample => sample.zoom !== 1)).toBe(true);
  expect(samples.at(-1)!.depth).toBeCloseTo(-6.989700043360188, 10);
  expect(samples.at(-1)!.zoom).toBe(1);
  expect(samples.filter(sample => sample.worst.error > 0.6)).toEqual([]);
});

test("explores radial depth and switches an open explanation to French", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();

  const intro = page.locator("[data-scale-intro]");
  await expect(intro).toBeVisible();
  await expect(intro.getByRole("heading", { name: "The Scale of Probability" })).toBeVisible();
  await expect(intro).toContainText("introduced by Alan Turing");
  await expect(intro.getByRole("button", { name: "English" })).toHaveAttribute("aria-pressed", "true");
  await expect(intro.getByRole("button", { name: "Français" })).toBeVisible();
  await expect(intro.getByRole("button", { name: "Explore the scale" })).toBeInViewport();
  await intro.getByRole("button", { name: "Français" }).click();
  await expect(intro.getByRole("button", { name: "Explorer l’échelle" })).toBeInViewport();
  await intro.locator("details").evaluateAll(details => details.forEach(detail => { (detail as HTMLDetailsElement).open = true; }));
  await expect(intro.getByRole("button", { name: "Explorer l’échelle" })).toBeInViewport();
  await intro.locator("details").evaluateAll(details => details.forEach(detail => { (detail as HTMLDetailsElement).open = false; }));
  await capture(page, testInfo, "desktop-french-about-language-choice");
  await intro.getByRole("button", { name: "English" }).click();
  await capture(page, testInfo, "desktop-about-language-choice");
  await intro.getByRole("button", { name: "Explore the scale" }).click();

  const scale = page.locator(".scale");
  await expect(page.locator("[data-center-marker] .probability")).toHaveText("Probability: 50%");
  await expect(page.locator("[data-center-marker] .odds")).toContainText("Odds: 1 to 1");
  await expect(page.locator("[data-current-depth-marker]")).toContainText("0 dBan");
  await expect(page.locator("[data-current-depth-ring]")).toBeVisible();
  await expect(page.locator("[data-depth-spoke]")).toBeVisible();
  await expect(page.locator("[data-landmark-preview]")).toHaveCount(0);

  const initialDepth = await scale.getAttribute("data-depth");
  const scaleBox = await scale.boundingBox();
  expect(scaleBox).not.toBeNull();
  await page.mouse.move(scaleBox!.x + 220, scaleBox!.y + 340);
  await page.mouse.down();
  await page.mouse.move(scaleBox!.x + 220, scaleBox!.y + 230);
  await page.mouse.up();
  await expect(scale).toHaveAttribute("data-depth", initialDepth!);

  await scale.hover();
  await page.mouse.wheel(0, -120);
  await expect.poll(async () => Number(await scale.getAttribute("data-depth"))).toBeLessThan(0);
  await page.locator("[data-return-zero]").click();
  await expect(scale).toHaveAttribute("data-depth", "0");

  await page.locator('[data-landmark="holdem-one-pair"]').click();
  const details = page.locator("[data-detail-panel]");
  await expect(details).toBeVisible();
  await expect(page.locator("[data-detail-title]")).toHaveText("Texas Hold’em: exactly one pair");
  await expect(page.locator("[data-detail-related] h3")).toHaveText("Explore on the scale");
  await expect(page.locator('[data-related-landmark="holdem-two-pair"] svg')).toBeVisible();
  await expect(page.locator("[data-page-content]")).not.toHaveAttribute("inert", "");
  await page.locator('[data-related-landmark="holdem-two-pair"]').click();
  await expect(page.locator("[data-detail-title]")).toHaveText("Texas Hold’em: exactly two pair");
  await expect(page.locator("[data-close-detail]")).toBeFocused();
  await page.locator('[data-related-landmark="holdem-one-pair"]').click();
  await expect(page.locator("[data-detail-title]")).toHaveText("Texas Hold’em: exactly one pair");
  await expect(page.locator("[data-close-detail]")).toBeFocused();

  await page.locator('[data-landmark="ace-in-five-cards"]').click();
  await expect(page.locator("[data-detail-title]")).toHaveText("At least one ace in five cards");
  const depthBeforeLocale = await scale.getAttribute("data-depth");

  await page.locator("[data-language-toggle]").click();
  const languageMenu = page.locator("[data-language-menu]");
  await expect(languageMenu).toBeVisible();
  await languageMenu.getByRole("button", { name: "Français" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page).toHaveTitle("L’échelle des probabilités");
  await expect(page.locator("[data-detail-title]")).toHaveText("Au moins un as parmi cinq cartes");
  await expect(page.locator("[data-detail-kind]")).toHaveText("Modèle exact");
  await expect(scale).toHaveAttribute("data-depth", depthBeforeLocale!);
  await expect(page.locator("[data-open-intro]")).toHaveText("À propos");
  await expect(page.locator("[data-language-toggle]")).toBeFocused();
  await expect(page.locator("[data-center-marker] .probability")).toContainText(" %");
  await expect(page.locator("[data-center-marker] .probability")).toContainText("Probabilité :");
  await expect(page.locator("[data-center-marker] .odds")).toContainText("Cote :");
  await capture(page, testInfo, "desktop-french-open-details");

  await page.keyboard.press("Escape");
  await expect(details).toBeHidden();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
});

test("keeps French depth exploration readable and tappable on mobile", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();

  const intro = page.locator("[data-scale-intro]");
  await intro.getByRole("button", { name: "Français" }).click();
  await expect(intro).toContainText("Une augmentation de 10 dBan multiplie la cote par dix");
  await expect(intro).toContainText("travaux de décryptage de la Seconde Guerre mondiale");
  await capture(page, testInfo, "mobile-french-about");
  await intro.getByRole("button", { name: "Explorer l’échelle" }).click();

  const dimensions = await page.locator("body").evaluate(() => ({
    scrollWidth: document.body.scrollWidth,
    scrollHeight: document.body.scrollHeight,
    width: innerWidth,
    height: innerHeight,
  }));
  expect(dimensions.scrollWidth).toBe(dimensions.width);
  expect(dimensions.scrollHeight).toBeLessThanOrEqual(dimensions.height);
  await expect(page.locator("[data-depth-spoke]")).toBeVisible();
  await expect(page.locator("[data-current-depth-ring]")).toBeVisible();

  const d4 = page.locator('[data-landmark="die-d4-highest"]');
  const d4Box = await d4.boundingBox();
  expect(d4Box).not.toBeNull();
  expect(d4Box!.width).toBeLessThan(44);
  await page.touchscreen.tap(d4Box!.x + d4Box!.width / 2, d4Box!.y + d4Box!.height / 2);
  await expect(page.locator("[data-detail-title]")).toHaveText("Un quatre avec un d4 équilibré");
  await expect(page.locator("[data-detail-panel]")).toBeVisible();
  await expect(page.locator("[data-page-content]")).not.toHaveAttribute("inert", "");
  await capture(page, testInfo, "mobile-french-tiny-landmark-details");

  await page.goto("/?weekday#d=4");
  expect(await sceneArtworkText(page, "weekday", "weekdayMonday")).toBe("L");
  expect(await sceneArtworkText(page, "weekday", "weekdayWeekend")).toBe("S D");

  await page.goto("/?needle#d=-80.27101362442018");
  const currentBadge = page.locator("[data-current-depth-marker] strong");
  const currentBox = await currentBadge.boundingBox();
  expect(currentBox).not.toBeNull();
  const overlap = await page.locator(".spoke-tick small:visible, .spoke-event-marker small:visible").evaluateAll((labels, badge) => {
    const current = badge as { left: number; right: number; top: number; bottom: number };
    return labels.some(label => {
      const box = label.getBoundingClientRect();
      return box.left < current.right && box.right > current.left && box.top < current.bottom && box.bottom > current.top;
    });
  }, { left: currentBox!.x, right: currentBox!.x + currentBox!.width, top: currentBox!.y, bottom: currentBox!.y + currentBox!.height });
  expect(overlap).toBe(false);
  await expect(page.locator("[data-current-depth-marker]")).toContainText("−80,3 dBan");

  await page.goto("/?extreme#d=525.36");
  await expect(page.locator("[data-center-marker] .probability")).toContainText("(100 −");
  await expect(page.locator("[data-center-marker] .probability")).toContainText(" %");
  const readoutBox = await page.locator("[data-center-marker]").boundingBox();
  expect(readoutBox).not.toBeNull();
  expect(readoutBox!.x).toBeGreaterThanOrEqual(0);
  expect(readoutBox!.x + readoutBox!.width).toBeLessThanOrEqual(360);
  await capture(page, testInfo, "mobile-french-extreme");
});
