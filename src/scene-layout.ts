import { catalogueSlots, type LandmarkId } from "./catalogue/order";

const degrees = (value: number): number => value * Math.PI / 180;

// Curated once against the complete catalogue. These dense bands keep their
// geometry when a locale or regional filter changes the visible subset.
const angleOverrides: Readonly<Partial<Record<LandmarkId, number>>> = {
  "green-pea": degrees(325),
  "rps-win": degrees(190),
  "ace-in-five-cards": degrees(30),
  "holdem-one-pair": degrees(250),
  "coin-heads": degrees(80),
  "birthday-23": degrees(195),
  "four-dice-any-six": degrees(150),
  "month-31-days": degrees(175),
  "three-dice-sum-ten": degrees(250),
  "numbered-card": degrees(75),
  "weekday": degrees(200),
  "ocean-point": degrees(20),
  "yellow-pea": degrees(50),
  "die-d4-highest": degrees(110),
  "solar-terrestrial": degrees(40),
  "full-moon-15-days": degrees(145),
  "french-scrabble-consonant": degrees(350),
  "solar-eclipse-year": degrees(225),
  "frozen-freshwater": degrees(280),
  "four-dice-any-match": degrees(105),
  "red-dwarf-star": degrees(130),
  "planet-with-moon": degrees(250),
  "rain-hilo": degrees(165),
  "mensik-first-serve-miami-2025": degrees(345),
  "rain-brest-december": degrees(115),
  "covid-scenario-positive": degrees(338),
  "roulette-dozen-column": degrees(70),
  "roulette-even-money": degrees(225),
  "roulette-two-dozens-columns": degrees(317),
  "d20-avoid-natural-one-advantage": degrees(135),
  "pokemon-destined-rivals-double-rare": degrees(138),
  "pokemon-destined-rivals-illustration-rare": degrees(100),
  "pokemon-destined-rivals-special-illustration-rare": degrees(220),
  "roulette-six-line": degrees(280),
  "roulette-corner": degrees(252),
  "roulette-street": degrees(320),
  "roulette-split": degrees(292),
  "roulette-straight-up": degrees(330),
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

export const landmarkAngle = (id: LandmarkId): number => angleOverrides[id]
  ?? degrees(-45 + ((catalogueSlots[id] * 137.508) % 360) / 360 * 270);

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
