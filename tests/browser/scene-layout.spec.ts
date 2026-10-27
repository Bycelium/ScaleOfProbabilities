import { expect, test, type Page } from "@playwright/test";
import { displayLandmarks } from "../../src/catalogue";

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
  ["birthday-30", "month-31-days"],
  ["birthday-30", "frozen-freshwater"],
  ["birthday-30", "mensik-first-serve-miami-2025"],
  ["birthday-40", "fr-household-television-2025"],
  ["birthday-20", "french-scrabble-consonant"],
  ["four-dice-any-match", "red-dwarf-star"],
  ["four-dice-any-match", "rain-hilo"],
  ["france-loto-main-prize", "pokemon-destined-rivals-double-rare"],
  ["any-ace", "euromillions-main-prize"],
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
  const scrabble = box("french-scrabble-consonant");
  const readoutBoxes = ["[data-depth-readout]", "[data-current-readout-stack]", "[data-current-depth-marker] strong"]
    .map(selector => scale.querySelector<HTMLElement>(selector)?.getBoundingClientRect())
    .filter((box): box is DOMRect => box !== undefined);
  const readoutOverlaps = fourDice ? readoutBoxes.map(readout => overlapArea(fourDice, readout)) : [];
  const scrabbleReadoutOverlaps = scrabble ? readoutBoxes.map(readout => overlapArea(scrabble, readout)) : [];
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
    scrabbleReadoutOverlaps,
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
      if (name !== "desktop" && depth === 0) {
        expect(audit.scrabbleReadoutOverlaps, `${locale} at ${depth} dBan`).toEqual([0, 0, 0]);
      }
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

test("renders compact family connectors through their exact members", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 740 });
  const inspectAtDepth = async (depth: number) => {
    await openScene(page, "en", depth);
    return page.locator("[data-family-rails]").evaluate(layer => {
      const inspect = (id: string, members: string[]) => {
        const rail = layer.querySelector<SVGGraphicsElement>(`[data-family-rail="${id}"]`)!;
        const matrix = rail.getScreenCTM()!;
        const screenPoint = (x: number, y: number) => {
          const point = (layer as SVGSVGElement).createSVGPoint();
          point.x = x;
          point.y = y;
          return point.matrixTransform(matrix);
        };
        const points = members.flatMap(member => {
          const button = document.querySelector<HTMLElement>(`[data-landmark="${member}"]`);
          if (!button) return [];
          const ringDiameter = Number.parseFloat(button.dataset.ringSize!);
          if (button.hidden) {
            const size = Number.parseFloat(button.style.getPropertyValue("--size")) * Number(button.dataset.depthScale);
            const point = screenPoint(Number.parseFloat(button.style.left), Number.parseFloat(button.style.top) + size / 2);
            return [{ member, rendered: false, ringDiameter, x: point.x, y: point.y, width: size, height: size }];
          }
          const art = button.querySelector<HTMLImageElement>(".art img")!.getBoundingClientRect();
          return [{ member, rendered: true, ringDiameter, x: art.left + art.width / 2, y: art.top + art.height / 2, width: art.width, height: art.height }];
        });
        const renderedPoints = points.filter(point => point.rendered);
        const viewBox = (layer as SVGSVGElement).viewBox.baseVal;
        const sceneCenter = screenPoint(viewBox.width / 2, viewBox.height / 2);
        const screenScale = Math.hypot(matrix.a, matrix.b);
        const radiusErrors = points.map(point => Math.abs(
          Math.hypot(point.x - sceneCenter.x, point.y - sceneCenter.y) - point.ringDiameter / 2 * screenScale,
        ));
        const intersections: number[] = [];
        for (let index = 0; index < renderedPoints.length; index++) for (let other = index + 1; other < renderedPoints.length; other++) {
          const first = renderedPoints[index];
          const second = renderedPoints[other];
          intersections.push(Math.max(0, Math.min(first.x + first.width / 2, second.x + second.width / 2) - Math.max(first.x - first.width / 2, second.x - second.width / 2))
            * Math.max(0, Math.min(first.y + first.height / 2, second.y + second.height / 2) - Math.max(first.y - first.height / 2, second.y - second.height / 2)));
        }
        const hidden = rail.hasAttribute("hidden");
        const localVertices = hidden ? [] : rail.tagName === "polyline"
          ? rail.getAttribute("points")!.trim().split(/\s+/).map(pair => pair.split(",").map(Number))
          : [[Number(rail.getAttribute("x1")), Number(rail.getAttribute("y1"))], [Number(rail.getAttribute("x2")), Number(rail.getAttribute("y2"))]];
        const vertices = localVertices.map(([x, y]) => screenPoint(x, y));
        return {
          hidden,
          path: rail.tagName,
          vertices: vertices.map(point => [point.x, point.y]),
          points,
          renderedPoints,
          radiusErrors,
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
        pokemon: inspect("pokemon-destined-rivals", [
          "pokemon-destined-rivals-double-rare", "pokemon-destined-rivals-illustration-rare",
          "pokemon-destined-rivals-special-illustration-rare",
        ]),
        birthdays: inspect("birthdays-365", [
          "birthday-10", "birthday-20", "birthday-30", "birthday-40", "birthday-50", "birthday-60",
        ]),
        identicalDice: inspect("all-identical-dice", [
          "two-dice-any-double", "three-dice-any-triple", "four-dice-all-identical", "first-roll-yahtzee",
        ]),
        anyPairDice: inspect("any-pair-dice", ["four-dice-any-match", "yahtzee-any-match"]),
        poker: inspect("holdem-seven-card-hands", [
          "holdem-one-pair", "holdem-high-card", "holdem-two-pair", "holdem-three-kind", "holdem-straight",
          "holdem-flush", "holdem-full-house", "holdem-four-kind", "holdem-straight-flush", "holdem-royal-flush",
        ]),
      };
    });
  };

  for (const scenario of [
    { depth: 0, families: ["roulette", "dice", "pokemon"] },
    { depth: 10, families: ["anyPairDice"] },
    { depth: -23, families: ["identicalDice"] },
    { depth: -13, families: ["poker"] },
    { depth: displayLandmarks.find(item => item.id === "birthday-20")!.position, families: ["birthdays"] },
    { depth: displayLandmarks.find(item => item.id === "birthday-40")!.position, families: ["birthdays"] },
    { depth: displayLandmarks.find(item => item.id === "birthday-60")!.position, families: ["birthdays"] },
  ] as const) {
    const rails = await inspectAtDepth(scenario.depth);
    expect(rails.ariaHidden).toBe("true");
    expect(rails.pointerEvents).toBe("none");
    for (const family of [rails.roulette, rails.dice, rails.pokemon, rails.birthdays, rails.identicalDice, rails.anyPairDice, rails.poker]) {
      expect(family.hidden).toBe(family.points.length < 2);
      if (family.hidden) expect(family.vertices).toEqual([]);
    }
    for (const key of scenario.families) {
      const family = rails[key];
      expect(family.hidden).toBe(false);
      expect(family.intersections.every(area => area === 0)).toBe(true);
      expect(Math.max(...family.radiusErrors)).toBeLessThanOrEqual(.6);
      expect(new Set(family.points.map(point => `${point.x},${point.y}`)).size).toBe(family.points.length);
      const byRadius = [...family.points].sort((first, second) => first.ringDiameter - second.ringDiameter);
      const expected = family.path === "polyline" ? byRadius : [byRadius[0], byRadius.at(-1)!];
      expect(family.vertices).toHaveLength(expected.length);
      for (let index = 0; index < expected.length; index++) {
        expect(family.vertices[index][0]).toBeCloseTo(expected[index].x, 1);
        expect(family.vertices[index][1]).toBeCloseTo(expected[index].y, 1);
      }
    }
    if (scenario.depth === 0) {
      expect(rails.roulette.vertices[0][1]).toBeCloseTo(rails.roulette.vertices[1][1], 8);
      const diceSlope = (rails.dice.vertices[1][1] - rails.dice.vertices[0][1]) / (rails.dice.vertices[1][0] - rails.dice.vertices[0][0]);
      expect(Math.abs(diceSlope)).toBeCloseTo(1, 1);
    }
    if (scenario.depth === -13) expect(rails.poker.path).toBe("polyline");
    await page.screenshot({ path: testInfo.outputPath(`connected-families-${scenario.depth}-320x740.png`) });
  }
});

test("keeps a current family title readable inside the mobile viewport", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  let automaticTitles = 0;
  for (const [id, depth] of [
    ["roulette-even-money", -.235],
    ["roulette-dozen-column", -3.188],
    ["die-d12-highest", -10.414],
    ["pokemon-destined-rivals-illustration-rare", displayLandmarks.find(item => item.id === "pokemon-destined-rivals-illustration-rare")!.position],
    ["four-dice-any-match", displayLandmarks.find(item => item.id === "four-dice-any-match")!.position],
    ["holdem-straight", displayLandmarks.find(item => item.id === "holdem-straight")!.position],
    ["birthday-20", displayLandmarks.find(item => item.id === "birthday-20")!.position],
    ["birthday-40", displayLandmarks.find(item => item.id === "birthday-40")!.position],
    ["birthday-60", displayLandmarks.find(item => item.id === "birthday-60")!.position],
  ] as const) {
    await openScene(page, "fr", depth);
    const title = page.locator(`[data-landmark="${id}"] .landmark-title`);
    if (await title.isVisible()) {
      automaticTitles += 1;
      const coversArt = await title.evaluate(label => {
        const bounds = label.getBoundingClientRect();
        const owner = label.closest("[data-landmark]");
        return [...document.querySelectorAll("[data-landmark]:not([hidden]) .art img")].some(art => {
          if (art.closest("[data-landmark]") === owner) return false;
          const box = art.getBoundingClientRect();
          return Math.max(0, Math.min(bounds.right, box.right) - Math.max(bounds.left, box.left))
            * Math.max(0, Math.min(bounds.bottom, box.bottom) - Math.max(bounds.top, box.top)) > 1;
        });
      });
      expect(coversArt).toBe(false);
    }
    await page.locator(`[data-landmark="${id}"]`).focus();
    await expect(title).toBeVisible();
    const bounds = await title.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(4);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(386);
    expect(bounds!.y).toBeGreaterThanOrEqual(4);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(840);
    await page.screenshot({ path: testInfo.outputPath(`current-family-${id}.png`) });
  }
  expect(automaticTitles).toBeGreaterThan(0);
});
