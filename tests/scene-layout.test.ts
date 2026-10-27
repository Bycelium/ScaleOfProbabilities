import { describe, expect, it } from "vitest";
import { displayLandmarks } from "../src/catalogue";
import { catalogueSlots, type LandmarkId } from "../src/catalogue/order";
import { landmarkAngle, suppressedTitleIds, type LayoutBox, type TitleCandidate } from "../src/scene-layout";

describe("scene layout", () => {
  it("keeps catalogue-slot angles deterministic and applies curated dense angles", () => {
    const expectedDefault = (-45 + ((catalogueSlots["drop-garden-pool"] * 137.508) % 360) / 360 * 270) * Math.PI / 180;
    expect(landmarkAngle("drop-garden-pool")).toBeCloseTo(expectedDefault, 12);
    expect(landmarkAngle("coin-heads")).toBeCloseTo(80 * Math.PI / 180, 12);
    expect(landmarkAngle("four-dice-any-six")).toBeCloseTo(315 * Math.PI / 180, 12);
    expect(landmarkAngle("enigma-m3-known-rings")).toBeCloseTo(36 * Math.PI / 180, 12);
  });

  it("clears every reported dense artwork pair on the 320-pixel mobile projection", () => {
    const byId = new Map(displayLandmarks.map(item => [item.id, item]));
    const bounds = (id: LandmarkId): LayoutBox => {
      const item = byId.get(id)!;
      const factor = 10 ** (item.position / 10);
      const radius = 320 * .78 / 2 * factor;
      const size = item.size * .76 * factor;
      const angle = landmarkAngle(id);
      const x = 160 + Math.cos(angle) * radius;
      const y = 370 + Math.sin(angle) * radius;
      return { left: x - size / 2, right: x + size / 2, top: y - size / 2, bottom: y + size / 2 };
    };
    const overlaps = (first: LayoutBox, second: LayoutBox) => first.left < second.right && first.right > second.left
      && first.top < second.bottom && first.bottom > second.top;
    const pairs: readonly (readonly [LandmarkId, LandmarkId])[] = [
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
      ["four-dice-any-six", "coin-heads"],
      ["four-dice-any-six", "rain-brest-december"],
    ];
    for (const [first, second] of pairs) expect(overlaps(bounds(first), bounds(second)), `${first} / ${second}`).toBe(false);
  });

  it("suppresses titles behind artwork, outside the viewport, and behind higher-priority titles", () => {
    const box = (left: number, top: number, right: number, bottom: number): LayoutBox => ({ left, top, right, bottom });
    const candidates: TitleCandidate[] = [
      { id: "coin-heads", priority: 0, title: box(10, 10, 30, 20), obstructions: [] },
      { id: "birthday-23", priority: 1, title: box(25, 10, 45, 20), obstructions: [] },
      { id: "solar-terrestrial", priority: 2, title: box(60, 10, 80, 20), obstructions: [box(78, 0, 90, 30)] },
      { id: "full-moon-15-days", priority: 3, title: box(100, 10, 120, 20), obstructions: [] },
    ];
    const suppressed = suppressedTitleIds(candidates);
    expect([...suppressed]).toEqual(["birthday-23", "solar-terrestrial"]);
    expect(suppressedTitleIds(candidates, 0)).toEqual(suppressed);
  });
});
