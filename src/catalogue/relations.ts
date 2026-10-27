import { landmarkModels } from "./models";
import type { LandmarkId } from "./order";

const declaredRelatedLandmarkIds = {
  "green-pea": ["dna-nucleotide-copied-correctly", "four-leaf-clover"],
  "four-leaf-clover": ["double-yolk-young-hens"],
  "coin-heads": ["die-d4-highest", "die-six"],
  "die-d4-highest": ["coin-heads", "die-six", "die-d12-highest"],
  "die-six": ["coin-heads", "die-d4-highest", "two-dice-any-double", "die-d12-highest"],
  "die-d12-highest": ["die-six", "die-d20-highest"],
  "die-d20-highest": ["die-d12-highest", "die-d20-no-critical-failure", "d20-avoid-natural-one-advantage"],
  "die-d20-no-critical-failure": ["die-d20-highest", "d20-avoid-natural-one-advantage"],
  "four-dice-any-six": ["die-six", "three-dice-sum-ten"],
  "three-dice-sum-ten": ["four-dice-any-six", "three-dice-any-triple"],
  "month-31-days": ["weekday", "birthday-23"],
  "weekday": ["month-31-days", "birthday-23"],
  "two-dice-any-double": ["three-dice-any-triple", "die-six"],
  "two-dice-both-six": ["die-six", "three-dice-all-six"],
  "three-dice-any-triple": ["two-dice-any-double", "four-dice-all-identical"],
  "three-dice-all-six": ["two-dice-both-six", "first-roll-yahtzee"],
  "four-dice-all-identical": ["three-dice-any-triple", "first-roll-yahtzee"],
  "first-roll-yahtzee": ["three-dice-all-six", "four-dice-all-identical"],
  "four-dice-any-match": ["two-dice-any-double", "three-dice-any-triple", "yahtzee-any-match"],
  "yahtzee-any-match": ["four-dice-any-match", "first-roll-yahtzee"],
  "password-123456": ["manager-password-16", "eff-passphrase-six"],
  "password-qwerty": ["manager-password-16", "eff-passphrase-six"],
  "password-password": ["manager-password-16", "eff-passphrase-six"],
  "four-digit-pin": ["password-123456", "manager-password-16"],
  "manager-password-16": ["eff-passphrase-six", "aes-128-key"],
  "eff-passphrase-six": ["manager-password-16", "eff-word-one", "aes-128-key"],
  "eff-word-one": ["eff-passphrase-six", "die-six"],
  "aes-128-key": ["eff-passphrase-six", "exact-hash-day", "aes-256-key"],
  "aes-256-key": ["aes-128-key", "exact-hash-day"],
  "exact-hash-day": ["aes-128-key", "aes-256-key"],
  "needle-haystack": ["beach-grain", "sahara-grain"],
  "drop-olympic-pool": ["drop-garden-pool", "needle-haystack", "beach-grain"],
  "drop-garden-pool": ["needle-haystack", "beach-grain"],
  "solar-terrestrial": ["planet-with-moon", "sun-mass"],
  "planet-with-moon": ["solar-terrestrial", "sun-mass", "lunar-eclipse-year"],
  "sun-mass": ["solar-terrestrial", "planet-with-moon", "red-dwarf-star"],
  "red-dwarf-star": ["sun-mass"],
  "full-moon-15-days": ["full-moon-28-days", "lunar-eclipse-year"],
  "full-moon-28-days": ["full-moon-15-days", "lunar-eclipse-year"],
  "solar-eclipse-year": ["solar-eclipse-local-year", "lunar-eclipse-year"],
  "solar-eclipse-local-year": ["solar-eclipse-year", "lunar-eclipse-year", "full-moon-15-days"],
  "lunar-eclipse-year": ["solar-eclipse-year", "full-moon-15-days", "full-moon-28-days"],
  "french-scrabble-consonant": ["french-scrabble-vowel-rack"],
  "frozen-freshwater": ["ocean-point"],
  "rain-hilo": ["rain-brest-december", "sunshine-phoenix"],
  "rain-brest-december": ["rain-hilo", "sunshine-phoenix"],
  "sunshine-phoenix": ["rain-hilo", "rain-brest-december"],
  "nba-free-throw-2023-24": ["mensik-first-serve-miami-2025", "premier-league-penalty-2023-24"],
  "mensik-first-serve-miami-2025": ["nba-free-throw-2023-24", "premier-league-penalty-2023-24"],
  "premier-league-penalty-2023-24": ["nba-free-throw-2023-24", "mensik-first-serve-miami-2025"],
  "fr-letter-green-j3-2025": ["fr-letter-green-j5-2025", "fr-colissimo-counter-j2-2025"],
  "fr-letter-green-j5-2025": ["fr-colissimo-counter-j2-2025"],
  "us-electricity-available-2024": ["idf-electricity-available-2024", "gmail-available-2013"],
  "idf-electricity-available-2024": ["stripe-available-2023"],
  "gmail-available-2013": ["stripe-available-2023", "commercial-flight-no-accident-2025"],
  "stripe-available-2023": ["commercial-flight-no-accident-2025"],
  "commercial-flight-no-accident-2025": ["commercial-flight-accident-2025"],
  "gb-injury-collision-20km": ["gb-no-injury-collision-20km", "gb-injury-collision-500km", "commercial-flight-accident-2025"],
  "gb-no-injury-collision-20km": ["gb-no-injury-collision-500km"],
  "gb-injury-collision-500km": ["gb-no-injury-collision-500km", "commercial-flight-accident-2025"],
  "gb-no-injury-collision-500km": ["commercial-flight-no-accident-2025"],
  "uk-recent-car-breakdown-2021": ["uk-recent-car-no-breakdown-2021"],
  "pokemon-destined-rivals-double-rare": ["pokemon-destined-rivals-illustration-rare", "pokemon-destined-rivals-special-illustration-rare"],
  "pokemon-destined-rivals-illustration-rare": ["pokemon-destined-rivals-special-illustration-rare"],
  "fr-household-television-2025": ["fr-person-smartphone-2025", "fr-person-mobile-phone-2025"],
  "fr-person-smartphone-2025": ["fr-person-mobile-phone-2025"],
  "covid-scenario-prior": ["covid-scenario-positive", "covid-scenario-negative"],
  "dna-nucleotide-copied-correctly": ["human-denovo-snv"],
  "enigma-i-known-rings": ["enigma-i-two-unknown-rings", "enigma-m3-known-rings", "aes-128-key"],
  "enigma-i-two-unknown-rings": ["enigma-i-known-rings", "enigma-m3-known-rings"],
  "enigma-m3-known-rings": ["enigma-i-known-rings", "enigma-i-two-unknown-rings", "enigma-m4-known-rings", "enigma-m3-after-clues"],
  "enigma-m3-after-clues": ["enigma-m3-known-rings"],
  "enigma-m4-known-rings": ["enigma-m3-known-rings", "aes-128-key"],
  "ace-in-five-cards": ["any-ace", "holdem-one-pair"],
  "any-ace": ["ace-of-spades", "ace-in-five-cards", "numbered-card", "blackjack-natural-six-deck"],
  "blackjack-natural-six-deck": ["ace-in-five-cards"],
  "roulette-straight-up": ["roulette-split"],
  "roulette-split": ["roulette-street"],
  "roulette-street": ["roulette-corner"],
  "roulette-corner": ["roulette-six-line"],
  "roulette-six-line": ["roulette-dozen-column"],
  "roulette-dozen-column": ["roulette-even-money"],
  "roulette-even-money": ["roulette-two-dozens-columns"],
  "numbered-card": ["any-ace", "ace-in-five-cards"],
  "birthday-23": ["month-31-days", "weekday", "birthday-50"],
  "ace-of-spades": ["any-ace", "holdem-one-pair"],
  "holdem-high-card": ["holdem-one-pair", "holdem-two-pair"],
  "holdem-one-pair": ["holdem-high-card", "holdem-two-pair", "ace-in-five-cards"],
  "holdem-two-pair": ["holdem-one-pair", "holdem-three-kind"],
  "holdem-three-kind": ["holdem-two-pair", "holdem-straight"],
  "holdem-straight": ["holdem-three-kind", "holdem-flush"],
  "holdem-flush": ["holdem-straight", "holdem-full-house"],
  "holdem-full-house": ["holdem-flush", "holdem-four-kind"],
  "holdem-four-kind": ["holdem-full-house", "holdem-straight-flush"],
  "holdem-straight-flush": ["holdem-four-kind", "holdem-royal-flush"],
  "holdem-royal-flush": ["holdem-straight-flush"],
  "france-loto-main-prize": ["france-loto-main-loss", "france-loto-jackpot"],
  "france-loto-main-loss": ["france-loto-main-prize", "france-loto-jackpot"],
  "france-loto-jackpot": ["france-loto-main-prize", "uk-lotto-jackpot"],
  "euromillions-main-prize": ["euromillions-main-loss", "euromillions-jackpot"],
  "euromillions-main-loss": ["euromillions-main-prize", "euromillions-jackpot"],
  "euromillions-jackpot": ["euromillions-main-prize", "uk-lotto-jackpot"],
  "uk-lotto-jackpot": ["france-loto-jackpot", "euromillions-jackpot"],
  "us-powerball-jackpot": ["us-mega-millions-jackpot"],
  "us-mega-millions-jackpot": ["us-powerball-jackpot"],
} satisfies Readonly<Partial<Record<LandmarkId, readonly LandmarkId[]>>>;

const reciprocalRelations = (): Readonly<Record<string, readonly string[]>> => {
  const ids = new Set(landmarkModels.map(item => item.id));
  const related = new Map(landmarkModels.map(item => [item.id, [] as LandmarkId[]]));
  const connect = (source: LandmarkId, target: LandmarkId): void => {
    /* v8 ignore next -- static declarations are also checked by the exported reciprocal-relation invariant. */
    if (!ids.has(source) || !ids.has(target)) throw new Error(`Unknown related landmark: ${source} → ${target}`);
    /* v8 ignore next -- static declarations are also checked by the exported reciprocal-relation invariant. */
    if (source === target) throw new Error(`A landmark cannot relate to itself: ${source}`);
    const forward = related.get(source)!;
    const reverse = related.get(target)!;
    if (!forward.includes(target)) forward.push(target);
    if (!reverse.includes(source)) reverse.push(source);
  };
  for (const [source, targets] of Object.entries(declaredRelatedLandmarkIds)) {
    for (const target of targets) connect(source as LandmarkId, target);
  }
  for (const item of landmarkModels) {
    if (item.advice) connect(item.id, item.advice.relatedId);
  }
  return Object.fromEntries([...related].filter(([, targets]) => targets.length > 0));
};

export const relatedLandmarkIds = reciprocalRelations();
