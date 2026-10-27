import { expect, test, type Page } from "@playwright/test";

const densePairs = [
  ["coin-heads", "french-scrabble-consonant"],
  ["coin-heads", "rain-brest-december"],
  ["french-scrabble-consonant", "rain-brest-december"],
  ["holdem-one-pair", "full-moon-15-days"],
  ["numbered-card", "ocean-point"],
  ["numbered-card", "planet-with-moon"],
  ["ocean-point", "planet-with-moon"],
  ["weekday", "yellow-pea"],
  ["weekday", "four-dice-any-match"],
  ["yellow-pea", "four-dice-any-match"],
] as const;

const openScene = async (page: Page, locale: string, depth: number) => {
  await page.goto(`/#d=${depth}`);
  await page.evaluate(({ selectedLocale }) => {
    sessionStorage.setItem("probability-scale-intro-seen", "true");
    localStorage.setItem("probability-scale-all-references", "true");
    localStorage.setItem("probability-scale-locale", selectedLocale);
  }, { selectedLocale: locale });
  await page.reload();
  await expect(page.locator(".scale")).toHaveAttribute("data-depth", String(depth));
};

const auditScene = (page: Page) => page.locator(".scale").evaluate((scale, pairs) => {
  const scene = scale.querySelector<HTMLElement>("[data-depth-scene]")!;
  const sceneBounds = scale.getBoundingClientRect();
  const zoom = Number(scene.dataset.sceneZoom);
  const box = (id: string) => scale.querySelector<HTMLElement>(`[data-landmark="${id}"] .art img`)?.getBoundingClientRect();
  const overlapArea = (first: DOMRect, second: DOMRect) => Math.max(0, Math.min(first.right, second.right) - Math.max(first.left, second.left))
    * Math.max(0, Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top));
  const overlaps = pairs.flatMap(([first, second]) => {
    const firstBox = box(first);
    const secondBox = box(second);
    return firstBox && secondBox ? [{ first, second, area: overlapArea(firstBox, secondBox) }] : [];
  });
  const radiusErrors = [...scale.querySelectorAll<HTMLElement>("[data-landmark]")].filter(button => !button.hidden).map(button => {
    const art = button.querySelector<HTMLImageElement>(".art img")!.getBoundingClientRect();
    const radius = Math.hypot(art.left + art.width / 2 - (sceneBounds.left + sceneBounds.width / 2), art.top + art.height / 2 - (sceneBounds.top + sceneBounds.height / 2));
    return { id: button.dataset.landmark, error: Math.abs(radius - Number(button.dataset.ringSize!.slice(0, -2)) / 2 * zoom) };
  });
  const labels = [...scale.querySelectorAll<HTMLElement>(".landmark-title:not([hidden])")];
  const visibleArt = [...scale.querySelectorAll<HTMLElement>("[data-landmark]:not([hidden]) .art img")];
  const globalOverlaps: { first?: string; second?: string; area: number }[] = [];
  for (let index = 0; index < visibleArt.length; index++) for (let other = index + 1; other < visibleArt.length; other++) {
    const area = overlapArea(visibleArt[index].getBoundingClientRect(), visibleArt[other].getBoundingClientRect());
    if (area > 25) globalOverlaps.push({
      first: visibleArt[index].closest<HTMLElement>("[data-landmark]")?.dataset.landmark,
      second: visibleArt[other].closest<HTMLElement>("[data-landmark]")?.dataset.landmark,
      area,
    });
  }
  const labelProblems = labels.flatMap(label => {
    const labelBox = label.getBoundingClientRect();
    const owner = label.closest<HTMLElement>("[data-landmark]")!;
    const outside = labelBox.left < sceneBounds.left || labelBox.right > sceneBounds.right || labelBox.top < sceneBounds.top || labelBox.bottom > sceneBounds.bottom;
    const coversArt = visibleArt.some(art => art.closest("[data-landmark]") !== owner && overlapArea(labelBox, art.getBoundingClientRect()) > 1);
    return outside || coversArt ? [owner.dataset.landmark] : [];
  });
  const coin = box("coin-heads");
  const planet = box("solar-terrestrial");
  const fourDice = box("four-dice-any-six");
  const readoutOverlaps = fourDice ? ["[data-depth-readout]", "[data-current-readout-stack]", "[data-current-depth-marker] strong"]
    .map(selector => scale.querySelector<HTMLElement>(selector)?.getBoundingClientRect())
    .filter((box): box is DOMRect => box !== undefined)
    .map(readout => overlapArea(fourDice, readout)) : [];
  return {
    overlaps,
    worstRadiusError: Math.max(0, ...radiusErrors.map(item => item.error)),
    labelProblems,
    globalOverlaps,
    equalProbabilityCenterDistance: coin && planet ? Math.hypot(
      coin.left + coin.width / 2 - (planet.left + planet.width / 2),
      coin.top + coin.height / 2 - (planet.top + planet.height / 2),
    ) : null,
    readoutOverlaps,
  };
}, densePairs);

for (const [name, viewport] of [
  ["compact mobile", { width: 320, height: 740 }],
  ["mobile", { width: 390, height: 844 }],
  ["desktop", { width: 1365, height: 900 }],
] as const) {
  test(`keeps dense scene geometry clear on ${name}`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    const scenarios = name === "mobile"
      ? ["en", "fr", "zh", "es"].flatMap(locale => [-7, -3, 0, 3, 7].map(depth => ({ locale, depth })))
      : [-3, 0, 3].map(depth => ({ locale: "fr", depth }));
    for (const { locale, depth } of scenarios) {
      await openScene(page, locale, depth);
      const audit = await auditScene(page);
      expect(audit.overlaps.filter(pair => pair.area > .5), `${locale} at ${depth} dBan`).toEqual([]);
      expect(audit.worstRadiusError).toBeLessThanOrEqual(.6);
      expect(audit.labelProblems, `${locale} at ${depth} dBan`).toEqual([]);
      expect(audit.readoutOverlaps.every(area => area === 0), `${locale} at ${depth} dBan`).toBe(true);
      if (depth === 0) expect(audit.readoutOverlaps, `${locale} at ${depth} dBan`).toEqual([0, 0, 0]);
      if (name === "mobile" && depth === 0) {
        expect(audit.globalOverlaps.length, `${locale} at ${depth} dBan`).toBeLessThanOrEqual(6);
        expect(audit.globalOverlaps.reduce((sum, pair) => sum + pair.area, 0)).toBeLessThan(2_000);
      }
      if (depth === 0) expect(audit.equalProbabilityCenterDistance).toBeGreaterThan(1);
      if (locale === "fr" && depth === 0) {
        await page.screenshot({ path: testInfo.outputPath(`dense-fr-0-${viewport.width}x${viewport.height}.png`) });
      }
    }
  });
}

test("renders compact roulette and highest-face rails between their exact members", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await openScene(page, "en", 0);
  const rails = await page.locator("[data-family-rails]").evaluate(layer => {
    const inspect = (id: string, members: string[]) => {
      const line = layer.querySelector<SVGLineElement>(`[data-family-rail="${id}"]`)!;
      const points = members.map(member => {
        const button = document.querySelector<HTMLElement>(`[data-landmark="${member}"]`)!;
        const art = button.querySelector<HTMLImageElement>(".art img")!.getBoundingClientRect();
        return { member, x: art.left + art.width / 2, y: art.top + art.height / 2, width: art.width, height: art.height };
      });
      const intersections = points.slice(1).map((point, index) => {
        const previous = points[index];
        return Math.max(0, Math.min(previous.x + previous.width / 2, point.x + point.width / 2) - Math.max(previous.x - previous.width / 2, point.x - point.width / 2))
          * Math.max(0, Math.min(previous.y + previous.height / 2, point.y + point.height / 2) - Math.max(previous.y - previous.height / 2, point.y - point.height / 2));
      });
      return {
        hidden: line.hasAttribute("hidden"),
        attributes: ["x1", "y1", "x2", "y2"].map(name => Number(line.getAttribute(name))),
        points,
        intersections,
      };
    };
    return {
      ariaHidden: layer.getAttribute("aria-hidden"),
      pointerEvents: getComputedStyle(layer).pointerEvents,
      roulette: inspect("roulette", [
        "roulette-straight-up", "roulette-split", "roulette-street", "roulette-corner",
        "roulette-six-line", "roulette-dozen-column", "roulette-even-money", "roulette-two-dozens-columns",
      ]),
      dice: inspect("polyhedral-highest-face", ["die-d4-highest", "die-six", "die-d12-highest", "die-d20-highest"]),
    };
  });
  expect(rails.ariaHidden).toBe("true");
  expect(rails.pointerEvents).toBe("none");
  for (const family of [rails.roulette, rails.dice]) {
    expect(family.hidden).toBe(false);
    expect(family.intersections.every(area => area === 0)).toBe(true);
    expect(new Set(family.points.map(point => `${point.x},${point.y}`)).size).toBe(family.points.length);
    expect(Math.min(family.attributes[0], family.attributes[2])).toBeCloseTo(Math.min(...family.points.map(point => point.x)), 1);
    expect(Math.max(family.attributes[0], family.attributes[2])).toBeCloseTo(Math.max(...family.points.map(point => point.x)), 1);
    expect(Math.min(family.attributes[1], family.attributes[3])).toBeCloseTo(Math.min(...family.points.map(point => point.y)), 1);
    expect(Math.max(family.attributes[1], family.attributes[3])).toBeCloseTo(Math.max(...family.points.map(point => point.y)), 1);
  }
  expect(rails.roulette.attributes[1]).toBeCloseTo(rails.roulette.attributes[3], 8);
  const diceSlope = (rails.dice.attributes[3] - rails.dice.attributes[1]) / (rails.dice.attributes[2] - rails.dice.attributes[0]);
  expect(Math.abs(diceSlope)).toBeCloseTo(1, 1);
});

test("keeps a current family title readable inside the mobile viewport", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const [id, depth] of [
    ["roulette-even-money", -.235],
    ["roulette-dozen-column", -3.188],
    ["die-d12-highest", -10.414],
  ] as const) {
    await openScene(page, "fr", depth);
    const title = page.locator(`[data-landmark="${id}"] .landmark-title`);
    await expect(title).toBeVisible();
    const bounds = await title.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(4);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(386);
    await page.screenshot({ path: testInfo.outputPath(`current-family-${id}.png`) });
  }
});
