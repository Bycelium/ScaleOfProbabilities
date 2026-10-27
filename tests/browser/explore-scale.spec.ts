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

for (const [name, viewport] of [["desktop", { width: 1365, height: 900 }], ["mobile", { width: 390, height: 844 }]] as const) {
  test(`keeps illustration centers at exact positions through arrival and return on ${name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/?arrival#d=0");
    await page.evaluate(() => {
      sessionStorage.setItem("probability-scale-intro-seen", "true");
      localStorage.setItem("probability-scale-all-references", "true");
    });
    await page.reload();

    const journeys = await page.evaluate(async () => {
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
      const recordJourney = (control: HTMLButtonElement, arrived: () => boolean) => {
        const positions = [inspect()];
        control.click();
        return new Promise<typeof positions>(resolve => {
          const sample = () => {
            positions.push(inspect());
            if (arrived()) resolve(positions);
            else requestAnimationFrame(sample);
          };
          requestAnimationFrame(sample);
        });
      };
      const toward = await recordJourney(document.querySelector<HTMLButtonElement>('[data-landmark="die-six"]')!, () => details.open);
      const returning = await recordJourney(document.querySelector<HTMLButtonElement>("[data-return-zero]")!, () => Number(scale.dataset.depth) === 0);
      return [toward, returning];
    });
    expect(journeys[0].at(-1)!.depth).toBeCloseTo(-6.989700043360188, 10);
    expect(journeys[1].at(-1)!.depth).toBe(0);
    for (const samples of journeys) {
      expect(samples.length).toBeGreaterThan(3);
      expect(samples.some(sample => sample.zoom !== 1)).toBe(true);
      expect(samples.at(-1)!.zoom).toBe(1);
      const largest = samples.reduce((previous, sample) => sample.worst.error > previous.worst.error ? sample : previous);
      expect(largest.worst.error, JSON.stringify(largest)).toBeLessThanOrEqual(0.6);
    }
  });
}

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
  const introPreferencesToggle = intro.locator('[data-preferences-toggle="intro"]');
  const preferencesMenu = page.locator("[data-preferences-menu]");
  await expect(introPreferencesToggle).toContainText("English");
  await introPreferencesToggle.click();
  await expect(preferencesMenu).toBeVisible();
  await expect(preferencesMenu.locator("[data-preferences-language-label]")).toHaveText("Language");
  await expect(preferencesMenu.locator(".preferences-options label")).toHaveText(["English", "Français", "简体中文", "Español"]);
  await expect(preferencesMenu.locator('[data-locale-choice="en"]')).toBeChecked();
  await expect(preferencesMenu.locator("[data-all-references]")).toBeVisible();
  await expect(intro.getByRole("button", { name: "Explore the scale" })).toBeInViewport();
  await preferencesMenu.locator('[data-locale-choice="fr"]').check();
  await expect(preferencesMenu).toBeVisible();
  await expect(introPreferencesToggle).toContainText("Français");
  await page.keyboard.press("Escape");
  await expect(preferencesMenu).toBeHidden();
  await expect(intro.getByRole("button", { name: "Explorer l’échelle" })).toBeInViewport();
  await intro.locator("details").evaluateAll(details => details.forEach(detail => { (detail as HTMLDetailsElement).open = true; }));
  await expect(intro.getByRole("button", { name: "Explorer l’échelle" })).toBeInViewport();
  await intro.locator("details").evaluateAll(details => details.forEach(detail => { (detail as HTMLDetailsElement).open = false; }));
  await capture(page, testInfo, "desktop-french-about-language-choice");
  await introPreferencesToggle.click();
  await preferencesMenu.locator('[data-locale-choice="en"]').check();
  await page.keyboard.press("Escape");
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

  const toolbarPreferencesToggle = page.locator('[data-preferences-toggle="toolbar"]');
  await toolbarPreferencesToggle.click();
  await expect(preferencesMenu).toBeVisible();
  await preferencesMenu.locator('[data-locale-choice="fr"]').check();
  await expect(preferencesMenu).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page).toHaveTitle("L’échelle des probabilités");
  await expect(page.locator("[data-detail-title]")).toHaveText("Au moins un as parmi cinq cartes");
  await expect(page.locator("[data-detail-kind]")).toHaveText("Modèle exact");
  await expect(scale).toHaveAttribute("data-depth", depthBeforeLocale!);
  await expect(page.locator("[data-open-intro]")).toHaveText("À propos");
  await expect(preferencesMenu.locator('[data-locale-choice="fr"]')).toBeFocused();
  await expect(page.locator("[data-center-marker] .probability")).toContainText(" %");
  await expect(page.locator("[data-center-marker] .probability")).toContainText("Probabilité :");
  await expect(page.locator("[data-center-marker] .odds")).toContainText("Cote :");
  await capture(page, testInfo, "desktop-french-open-details");

  await preferencesMenu.locator("[data-all-references]").check();
  await expect(preferencesMenu).toBeVisible();
  await expect(details).toBeVisible();
  await expect(scale).toHaveAttribute("data-depth", depthBeforeLocale!);
  await page.keyboard.press("Escape");
  await expect(preferencesMenu).toBeHidden();
  await expect(toolbarPreferencesToggle).toBeFocused();
  await expect(details).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(details).toBeHidden();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await page.locator('[data-preferences-toggle="toolbar"]').click();
  await expect(page.locator("[data-all-references]")).toBeChecked();
});

test("keeps French depth exploration readable and tappable on mobile", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();

  const intro = page.locator("[data-scale-intro]");
  await intro.locator('[data-preferences-toggle="intro"]').click();
  await page.locator('[data-preferences-menu] [data-locale-choice="fr"]').check();
  await page.keyboard.press("Escape");
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
  expect(readoutBox!.x + readoutBox!.width).toBeLessThanOrEqual(320);
  await capture(page, testInfo, "mobile-french-extreme");
});

test("keeps Chinese and Spanish choices and open details readable on a narrow screen", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();

  const intro = page.locator("[data-scale-intro]");
  const introPreferencesToggle = intro.locator('[data-preferences-toggle="intro"]');
  await introPreferencesToggle.click();
  const preferencesMenu = page.locator("[data-preferences-menu]");
  await expect(preferencesMenu.locator(".preferences-options label")).toHaveText(["English", "Français", "简体中文", "Español"]);
  const introLayout = await intro.evaluate(panel => {
    const panelBox = panel.getBoundingClientRect();
    const scroll = panel.querySelector<HTMLElement>(".intro-scroll")!;
    return {
      contentFits: scroll.scrollWidth <= scroll.clientWidth,
      triggerFits: (() => {
        const box = panel.querySelector<HTMLElement>('[data-preferences-toggle="intro"]')!.getBoundingClientRect();
        return box.left >= panelBox.left && box.right <= panelBox.right;
      })(),
    };
  });
  expect(introLayout).toEqual({ contentFits: true, triggerFits: true });
  const menuLayout = await preferencesMenu.evaluate(menu => {
    const box = menu.getBoundingClientRect();
    const targets = [...menu.querySelectorAll<HTMLElement>("label")].map(label => label.getBoundingClientRect().height);
    return { left: box.left, right: box.right, width: innerWidth, targets };
  });
  expect(menuLayout.left).toBeGreaterThanOrEqual(0);
  expect(menuLayout.right).toBeLessThanOrEqual(menuLayout.width);
  expect(menuLayout.targets.every(height => height >= 44)).toBe(true);

  await preferencesMenu.locator('[data-locale-choice="en"]').focus();
  await page.keyboard.press("ArrowDown");
  await expect(preferencesMenu.locator('[data-locale-choice="fr"]')).toBeChecked();
  await expect(preferencesMenu).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(preferencesMenu.locator("[data-all-references]")).toBeFocused();

  await preferencesMenu.locator('[data-locale-choice="zh"]').check();
  await page.keyboard.press("Escape");
  await expect(intro.getByRole("button", { name: "探索尺度" })).toBeVisible();
  await capture(page, testInfo, "mobile-chinese-about");
  await intro.getByRole("button", { name: "探索尺度" }).click();
  await page.locator('[data-landmark="ace-in-five-cards"]').click();
  const scale = page.locator(".scale");
  const depth = await scale.getAttribute("data-depth");
  await expect(page.locator("[data-detail-title]")).toHaveText("五张牌中至少有一张 A");
  await capture(page, testInfo, "mobile-chinese-open-details");

  await page.locator('[data-preferences-toggle="toolbar"]').click();
  const toolbarMenuBox = await preferencesMenu.boundingBox();
  expect(toolbarMenuBox).not.toBeNull();
  expect(toolbarMenuBox!.x).toBeGreaterThanOrEqual(0);
  expect(toolbarMenuBox!.x + toolbarMenuBox!.width).toBeLessThanOrEqual(320);
  await preferencesMenu.locator('[data-locale-choice="es"]').check();
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.locator("[data-detail-title]")).toHaveText("Al menos un as en cinco cartas");
  await expect(scale).toHaveAttribute("data-depth", depth!);
  expect(await page.locator("[data-detail-panel]").evaluate(panel => panel.scrollWidth <= panel.clientWidth)).toBe(true);
  await capture(page, testInfo, "mobile-chinese-spanish-open-details");
});

test("keeps the shared preferences menu within a short viewport", async ({ page }) => {
  await page.setViewportSize({ width: 568, height: 320 });
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();

  await page.locator('[data-preferences-toggle="intro"]').click();
  const layout = await page.locator("[data-preferences-menu]").evaluate(menu => {
    const box = menu.getBoundingClientRect();
    return {
      top: box.top,
      bottom: box.bottom,
      viewportHeight: innerHeight,
      scrollable: menu.scrollHeight > menu.clientHeight,
    };
  });
  expect(layout.top).toBeGreaterThanOrEqual(0);
  expect(layout.bottom).toBeLessThanOrEqual(layout.viewportHeight);
  expect(layout.scrollable).toBe(true);
});
