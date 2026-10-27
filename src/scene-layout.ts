import { catalogueSlots, type LandmarkId } from "./catalogue/order";

const degrees = (value: number): number => value * Math.PI / 180;

type FamilyRailDefinition = Readonly<{
  id: string;
  angle: number;
  members: readonly LandmarkId[];
  memberAngles?: Readonly<Partial<Record<LandmarkId, number>>>;
  path: "line" | "polyline" | "branched";
}>;

export const familyRailDefinitions = [
  {
    id: "roulette",
    angle: 0,
    members: [
      "roulette-straight-up", "roulette-split", "roulette-street", "roulette-corner",
      "roulette-six-line", "roulette-dozen-column", "roulette-even-money", "roulette-two-dozens-columns",
    ],
    path: "line",
  },
  {
    id: "polyhedral-highest-face",
    angle: degrees(200),
    members: ["die-d4-highest", "die-six", "die-d12-highest", "die-d20-highest"],
    path: "line",
  },
  {
    id: "pokemon-destined-rivals",
    angle: degrees(138),
    members: [
      "pokemon-destined-rivals-double-rare", "pokemon-destined-rivals-illustration-rare",
      "pokemon-destined-rivals-special-illustration-rare",
    ],
    path: "line",
  },
  {
    id: "birthdays-365",
    angle: degrees(305),
    members: ["birthday-10", "birthday-20", "birthday-30", "birthday-40", "birthday-50", "birthday-60"],
    path: "line",
  },
  {
    id: "all-identical-dice",
    angle: degrees(170),
    members: [
      "two-dice-any-double", "three-dice-any-triple", "four-dice-all-identical", "first-roll-yahtzee",
    ],
    path: "line",
  },
  {
    id: "any-pair-dice",
    angle: degrees(150),
    members: ["four-dice-any-match", "yahtzee-any-match"],
    memberAngles: {
      "four-dice-any-match": degrees(142),
      "yahtzee-any-match": degrees(158),
    },
    path: "polyline",
  },
  {
    id: "holdem-seven-card-hands",
    angle: degrees(250),
    members: [
      "holdem-one-pair", "holdem-high-card", "holdem-two-pair", "holdem-three-kind", "holdem-straight",
      "holdem-flush", "holdem-full-house", "holdem-four-kind", "holdem-straight-flush", "holdem-royal-flush",
    ],
    memberAngles: {
      "holdem-three-kind": degrees(238),
      "holdem-straight": degrees(262),
      "holdem-flush": degrees(238),
      "holdem-full-house": degrees(262),
    },
    path: "branched",
  },
] as const satisfies readonly FamilyRailDefinition[];

const familyRailLandmarks = new Set<LandmarkId>(familyRailDefinitions.flatMap(family => [...family.members]));

export const isFamilyRailLandmark = (id: LandmarkId): boolean => familyRailLandmarks.has(id);

export const landmarkArtFactor = (id: LandmarkId): number => isFamilyRailLandmark(id) ? .55 : 1;

// Curated once against the complete catalogue. These dense bands keep their
// geometry when a locale or regional filter changes the visible subset.
const angleOverrides: Readonly<Partial<Record<LandmarkId, number>>> = {
  "green-pea": degrees(325),
  "rps-win": degrees(190),
  "ace-in-five-cards": degrees(30),
  "coin-heads": degrees(80),
  "four-dice-any-six": degrees(225),
  "month-31-days": degrees(58),
  "three-dice-sum-ten": degrees(250),
  "numbered-card": degrees(75),
  "weekday": degrees(200),
  "ocean-point": degrees(20),
  "yellow-pea": degrees(50),
  "full-moon-15-days": degrees(145),
  "french-scrabble-consonant": degrees(325),
  "french-scrabble-vowel": degrees(195),
  "french-scrabble-blank": degrees(213),
  "french-scrabble-consonant-rack": degrees(250),
  "french-scrabble-blank-rack": degrees(226),
  "stellar-hydrogen-mass": degrees(135),
  "stellar-helium-mass": degrees(157),
  "lunar-eclipse-year": degrees(152),
  "solar-eclipse-year": degrees(225),
  "frozen-freshwater": degrees(280),
  "red-dwarf-star": degrees(170),
  "rain-hilo": degrees(105),
  "nba-free-throw-2023-24": degrees(217),
  "mensik-first-serve-miami-2025": degrees(335),
  "rain-brest-december": degrees(115),
  "covid-scenario-positive": degrees(90),
  "d20-avoid-natural-one-advantage": degrees(135),
  "blackjack-natural-six-deck": degrees(155),
  "euromillions-main-prize": degrees(75),
  "france-loto-main-prize": degrees(105),
  "four-leaf-clover": degrees(35),
  "uk-recent-car-breakdown-2021": degrees(90),
  "fr-person-smartphone-2025": degrees(45),
  "fr-household-television-2025": degrees(235),
  "rubik-state": degrees(150),
  "enigma-m3-known-rings": degrees(36),
  "enigma-m3-after-clues": degrees(36),
  "enigma-i-known-rings": degrees(210),
  "enigma-i-two-unknown-rings": degrees(210),
  "enigma-m4-known-rings": degrees(330),
  "sahara-grain": degrees(90),
};

export const landmarkAngle = (id: LandmarkId): number => {
  const family = (familyRailDefinitions as readonly FamilyRailDefinition[])
    .find(candidate => candidate.members.includes(id));
  return family ? family.memberAngles?.[id] ?? family.angle : angleOverrides[id]
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
