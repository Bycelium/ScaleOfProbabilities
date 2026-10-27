import { describe, expect, it } from "vitest";
import { displayLandmarks } from "../src/catalogue";
import { catalogueSlots, type LandmarkId } from "../src/catalogue/order";
import { familyRailDefinitions, isFamilyRailLandmark, landmarkAngle, landmarkArtFactor, suppressedTitleIds, type LayoutBox, type TitleCandidate } from "../src/scene-layout";

describe("scene layout", () => {
  it("keeps catalogue-slot angles deterministic and applies curated dense angles", () => {
    const expectedDefault = (-45 + ((catalogueSlots["drop-garden-pool"] * 137.508) % 360) / 360 * 270) * Math.PI / 180;
    expect(landmarkAngle("drop-garden-pool")).toBeCloseTo(expectedDefault, 12);
    expect(landmarkAngle("coin-heads")).toBeCloseTo(80 * Math.PI / 180, 12);
    expect(landmarkAngle("four-dice-any-six")).toBeCloseTo(225 * Math.PI / 180, 12);
    expect(landmarkAngle("french-scrabble-consonant")).toBeCloseTo(325 * Math.PI / 180, 12);
    expect(landmarkAngle("month-31-days")).toBeCloseTo(58 * Math.PI / 180, 12);
    expect(landmarkAngle("red-dwarf-star")).toBeCloseTo(170 * Math.PI / 180, 12);
    expect(landmarkAngle("rain-hilo")).toBeCloseTo(105 * Math.PI / 180, 12);
    expect(landmarkAngle("france-loto-main-prize")).toBeCloseTo(105 * Math.PI / 180, 12);
    expect(landmarkAngle("euromillions-main-prize")).toBeCloseTo(75 * Math.PI / 180, 12);
    expect(landmarkAngle("mensik-first-serve-miami-2025")).toBeCloseTo(335 * Math.PI / 180, 12);
    expect(landmarkAngle("fr-household-television-2025")).toBeCloseTo(235 * Math.PI / 180, 12);
    expect(landmarkAngle("enigma-m3-known-rings")).toBeCloseTo(36 * Math.PI / 180, 12);
  });

  it("clears every reported dense artwork pair on the 320-pixel mobile projection", () => {
    const byId = new Map(displayLandmarks.map(item => [item.id, item]));
    const bounds = (id: LandmarkId): LayoutBox => {
      const item = byId.get(id)!;
      const factor = 10 ** (item.position / 10);
      const radius = 320 * .78 / 2 * factor;
      const size = item.size * .76 * landmarkArtFactor(id) * factor;
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
      ["birthday-30", "month-31-days"],
      ["birthday-30", "frozen-freshwater"],
      ["birthday-30", "mensik-first-serve-miami-2025"],
      ["birthday-40", "fr-household-television-2025"],
      ["birthday-20", "french-scrabble-consonant"],
      ["four-dice-any-match", "red-dwarf-star"],
      ["four-dice-any-match", "rain-hilo"],
      ["france-loto-main-prize", "pokemon-destined-rivals-double-rare"],
      ["any-ace", "euromillions-main-prize"],
    ];
    for (const [first, second] of pairs) expect(overlaps(bounds(first), bounds(second)), `${first} / ${second}`).toBe(false);
  });

  it("suppresses titles behind artwork, outside the viewport, and behind higher-priority titles", () => {
    const box = (left: number, top: number, right: number, bottom: number): LayoutBox => ({ left, top, right, bottom });
    const candidates: TitleCandidate[] = [
      { id: "coin-heads", priority: 0, title: box(10, 10, 30, 20), obstructions: [] },
      { id: "birthday-30", priority: 1, title: box(25, 10, 45, 20), obstructions: [] },
      { id: "solar-terrestrial", priority: 2, title: box(60, 10, 80, 20), obstructions: [box(78, 0, 90, 30)] },
      { id: "full-moon-15-days", priority: 3, title: box(100, 10, 120, 20), obstructions: [] },
    ];
    const suppressed = suppressedTitleIds(candidates);
    expect([...suppressed]).toEqual(["birthday-30", "solar-terrestrial"]);
    expect(suppressedTitleIds(candidates, 0)).toEqual(suppressed);
  });

  it("connects explicit compact families with mobile artwork clearance", () => {
    expect(familyRailDefinitions.map(family => family.id)).toEqual([
      "roulette", "polyhedral-highest-face", "pokemon-destined-rivals", "birthdays-365", "all-identical-dice", "any-pair-dice",
      "holdem-seven-card-hands",
    ]);
    expect(landmarkArtFactor("roulette-corner")).toBe(.55);
    expect(landmarkArtFactor("die-six")).toBe(.55);
    expect(landmarkArtFactor("pokemon-destined-rivals-illustration-rare")).toBe(.55);
    expect(landmarkArtFactor("birthday-60")).toBe(.55);
    expect(landmarkArtFactor("four-dice-any-match")).toBe(.55);
    expect(landmarkArtFactor("holdem-full-house")).toBe(.55);
    expect(landmarkArtFactor("coin-heads")).toBe(1);
    expect(isFamilyRailLandmark("roulette-corner")).toBe(true);
    expect(isFamilyRailLandmark("coin-heads")).toBe(false);
    for (const id of ["birthday-10", "birthday-20", "birthday-30", "birthday-40", "birthday-50", "birthday-60"] as const) {
      expect(landmarkAngle(id)).toBeCloseTo(305 * Math.PI / 180, 12);
    }
    for (const id of ["holdem-one-pair", "holdem-high-card", "holdem-two-pair", "holdem-four-kind", "holdem-straight-flush", "holdem-royal-flush"] as const) {
      expect(landmarkAngle(id)).toBeCloseTo(250 * Math.PI / 180, 12);
    }
    expect(landmarkAngle("holdem-three-kind")).toBeCloseTo(238 * Math.PI / 180, 12);
    expect(landmarkAngle("holdem-straight")).toBeCloseTo(262 * Math.PI / 180, 12);
    expect(landmarkAngle("holdem-flush")).toBeCloseTo(238 * Math.PI / 180, 12);
    expect(landmarkAngle("holdem-full-house")).toBeCloseTo(262 * Math.PI / 180, 12);
    for (const id of ["two-dice-any-double", "three-dice-any-triple", "four-dice-all-identical", "first-roll-yahtzee"] as const) {
      expect(landmarkAngle(id)).toBeCloseTo(170 * Math.PI / 180, 12);
    }
    expect(landmarkAngle("four-dice-any-match")).toBeCloseTo(142 * Math.PI / 180, 12);
    expect(landmarkAngle("yahtzee-any-match")).toBeCloseTo(158 * Math.PI / 180, 12);
    const byId = new Map(displayLandmarks.map(item => [item.id, item]));
    for (const family of familyRailDefinitions) {
      const projected = family.members.map(id => {
        const item = byId.get(id)!;
        const scale = 10 ** (item.position / 10);
        const radius = 320 * .78 / 2 * scale;
        const angle = landmarkAngle(id);
        const size = item.size * .76 * landmarkArtFactor(id) * scale;
        return { id, radius, size, x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
      });
      for (const member of projected) expect(Math.hypot(member.x, member.y)).toBeCloseTo(member.radius, 10);
      for (let index = 0; index < projected.length; index++) for (let other = index + 1; other < projected.length; other++) {
        const first = projected[index];
        const second = projected[other];
        const separated = Math.abs(first.x - second.x) >= (first.size + second.size) / 2
          || Math.abs(first.y - second.y) >= (first.size + second.size) / 2;
        expect(separated, `${first.id} / ${second.id}`).toBe(true);
      }
    }
    expect(94 * .76 * landmarkArtFactor("holdem-full-house")).toBeGreaterThan(39);
  });

  it("keeps each birthday illustration and displaced neighbor clear at its exact mobile depth", () => {
    const birthdays = ["birthday-10", "birthday-20", "birthday-30", "birthday-40", "birthday-50", "birthday-60"] as const;
    const auditedLandmarks = [
      ...birthdays, "french-scrabble-consonant", "mensik-first-serve-miami-2025", "fr-household-television-2025",
    ] as const;
    const project = (id: LandmarkId, currentDepth: number) => {
      const item = displayLandmarks.find(candidate => candidate.id === id)!;
      const scale = 10 ** ((item.position - currentDepth) / 10);
      const radius = 320 * .78 / 2 * scale;
      const size = item.size * .76 * landmarkArtFactor(id) * scale;
      const angle = landmarkAngle(id);
      const x = 160 + Math.cos(angle) * radius;
      const y = 370 + Math.sin(angle) * radius;
      return { left: x - size / 2, right: x + size / 2, top: y - size / 2, bottom: y + size / 2, size };
    };
    const overlaps = (first: LayoutBox, second: LayoutBox) => first.left < second.right && first.right > second.left
      && first.top < second.bottom && first.bottom > second.top;
    const visible = (box: ReturnType<typeof project>) => box.size >= .5
      && box.right >= 0 && box.left <= 320 && box.bottom >= 0 && box.top <= 740;
    for (const id of auditedLandmarks) {
      const current = displayLandmarks.find(item => item.id === id)!;
      const birthdayBox = project(id, current.position);
      expect(visible(birthdayBox)).toBe(true);
      for (const other of displayLandmarks) {
        if (other.id === id) continue;
        const otherBox = project(other.id, current.position);
        if (visible(otherBox)) expect(overlaps(birthdayBox, otherBox), `${id} / ${other.id}`).toBe(false);
      }
    }
  });
});
