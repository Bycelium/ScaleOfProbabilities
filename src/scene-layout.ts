import { catalogueSlots, type LandmarkId } from "./catalogue/order";

const degrees = (value: number): number => value * Math.PI / 180;

export const familyRailDefinitions = [
  {
    id: "roulette",
    angle: 0,
    members: [
      "roulette-straight-up", "roulette-split", "roulette-street", "roulette-corner",
      "roulette-six-line", "roulette-dozen-column", "roulette-even-money", "roulette-two-dozens-columns",
    ],
  },
  {
    id: "polyhedral-highest-face",
    angle: degrees(225),
    members: ["die-d4-highest", "die-six", "die-d12-highest", "die-d20-highest"],
  },
] as const satisfies readonly Readonly<{ id: string; angle: number; members: readonly LandmarkId[] }>[];

const familyRailLandmarks = new Set<LandmarkId>(familyRailDefinitions.flatMap(family => [...family.members]));

export const isFamilyRailLandmark = (id: LandmarkId): boolean => familyRailLandmarks.has(id);

export const landmarkArtFactor = (id: LandmarkId): number => isFamilyRailLandmark(id) ? .55 : 1;

// Curated once against the complete catalogue. These dense bands keep their
// geometry when a locale or regional filter changes the visible subset.
const angleOverrides: Readonly<Partial<Record<LandmarkId, number>>> = {
  "green-pea": degrees(325),
  "rps-win": degrees(190),
  "ace-in-five-cards": degrees(30),
  "holdem-one-pair": degrees(250),
  "coin-heads": degrees(80),
  "birthday-23": degrees(195),
  "four-dice-any-six": degrees(315),
  "month-31-days": degrees(175),
  "three-dice-sum-ten": degrees(250),
  "numbered-card": degrees(75),
  "weekday": degrees(200),
  "ocean-point": degrees(20),
  "yellow-pea": degrees(50),
  "solar-terrestrial": degrees(40),
  "full-moon-15-days": degrees(145),
  "french-scrabble-consonant": degrees(280),
  "solar-eclipse-year": degrees(225),
  "frozen-freshwater": degrees(280),
  "four-dice-any-match": degrees(105),
  "red-dwarf-star": degrees(130),
  "planet-with-moon": degrees(250),
  "rain-hilo": degrees(165),
  "mensik-first-serve-miami-2025": degrees(330),
  "rain-brest-december": degrees(115),
  "covid-scenario-positive": degrees(90),
  "d20-avoid-natural-one-advantage": degrees(135),
  "pokemon-destined-rivals-double-rare": degrees(138),
  "pokemon-destined-rivals-illustration-rare": degrees(100),
  "pokemon-destined-rivals-special-illustration-rare": degrees(220),
  "blackjack-natural-six-deck": degrees(155),
  "four-leaf-clover": degrees(35),
  "uk-recent-car-breakdown-2021": degrees(90),
  "fr-person-smartphone-2025": degrees(45),
  "rubik-state": degrees(150),
  "enigma-m3-known-rings": degrees(36),
  "enigma-m3-after-clues": degrees(36),
  "enigma-i-known-rings": degrees(210),
  "enigma-i-two-unknown-rings": degrees(210),
  "enigma-m4-known-rings": degrees(330),
  "sahara-grain": degrees(90),
};

export const landmarkAngle = (id: LandmarkId): number => {
  const family = familyRailDefinitions.find(candidate => (candidate.members as readonly LandmarkId[]).includes(id));
  return family?.angle ?? angleOverrides[id]
    ?? degrees(-45 + ((catalogueSlots[id] * 137.508) % 360) / 360 * 270);
};

export type LayoutBox = Readonly<{ left: number; top: number; right: number; bottom: number }>;
export type TitleCandidate = Readonly<{
  id: LandmarkId;
  priority: number;
  title: LayoutBox;
  obstructions: readonly LayoutBox[];
}>;

const boxesOverlap = (first: LayoutBox, second: LayoutBox, gap: number): boolean => first.left < second.right + gap
  && first.right > second.left - gap
  && first.top < second.bottom + gap
  && first.bottom > second.top - gap;

export const suppressedTitleIds = (candidates: readonly TitleCandidate[], gap = 4): ReadonlySet<LandmarkId> => {
  const accepted: LayoutBox[] = [];
  const suppressed = new Set<LandmarkId>();
  const ordered = [...candidates].sort((first, second) => first.priority - second.priority
    || catalogueSlots[first.id] - catalogueSlots[second.id]);
  for (const candidate of ordered) {
    const obstructed = candidate.obstructions.some(box => boxesOverlap(candidate.title, box, gap));
    if (obstructed || accepted.some(box => boxesOverlap(candidate.title, box, gap))) suppressed.add(candidate.id);
    else accepted.push(candidate.title);
  }
  return suppressed;
};
