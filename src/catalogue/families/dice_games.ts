import { artwork, d20AdvantageArtwork, diceArtwork, diceOutcomeArtwork, polyhedralDieArtwork, scrabbleArtwork } from "../../artwork";
import { lowerRatio, upperRatio, oneIn, exact } from "../helpers";
import type { LandmarkModel } from "../types";

export const dice_gamesModels = [
  { id: "rps-win", chance: lowerRatio(1, 3), size: 88, art: artwork("hand", "#e9855e"), sourceIds: ["uniform-three-outcome-model"], classification: exact },
  { id: "four-dice-any-six", chance: lowerRatio(671, 1296), size: 78, art: diceOutcomeArtwork([6, 2, 3, 1], "#b96b62", "#fff0de"), sourceIds: ["fair-independent-dice-model"], classification: exact },
  { id: "three-dice-sum-ten", chance: lowerRatio(135, 216), size: 78, art: diceOutcomeArtwork([4, 3, 3], "#6c7fa4", "#eef2ff"), sourceIds: ["fair-independent-dice-model"], classification: exact },
  { id: "die-six", chance: lowerRatio(1, 6), size: 78, art: artwork("die-six", "#d56f61"), sourceIds: ["fair-die-model"], classification: exact },
  { id: "die-d4-highest", chance: lowerRatio(1, 4), size: 82, art: polyhedralDieArtwork(4, "#b7655f", "#ffe9d0"), sourceIds: ["dnd-dice"], classification: exact },
  { id: "die-d12-highest", chance: lowerRatio(1, 12), size: 84, art: polyhedralDieArtwork(12, "#8a668e", "#f4e5ff"), sourceIds: ["dnd-dice"], classification: exact },
  { id: "die-d20-highest", chance: lowerRatio(1, 20), size: 86, art: polyhedralDieArtwork(20, "#6577a5", "#eef1ff"), sourceIds: ["dnd-critical"], classification: exact },
  { id: "two-dice-any-double", chance: lowerRatio(1, 6), size: 78, art: diceArtwork(2, 4, "#c66f53", "#fff1d8"), sourceIds: ["fair-independent-dice-model"], classification: exact },
  { id: "two-dice-both-six", chance: lowerRatio(1, 36), size: 78, art: diceArtwork(2, 6, "#ba5d68", "#ffe8df"), sourceIds: ["fair-independent-dice-model"], classification: exact },
  { id: "three-dice-any-triple", chance: lowerRatio(1, 36), size: 78, art: diceArtwork(3, 4, "#9b668f", "#f5e6ff"), sourceIds: ["fair-independent-dice-model"], classification: exact },
  { id: "three-dice-all-six", chance: lowerRatio(1, 216), size: 78, art: diceArtwork(3, 6, "#885d91", "#f5e6ff"), sourceIds: ["fair-independent-dice-model"], classification: exact },
  { id: "four-dice-all-identical", chance: lowerRatio(1, 216), size: 78, art: diceOutcomeArtwork([4, 4, 4, 4], "#a86b8f", "#ffe8f2"), sourceIds: ["fair-independent-dice-model"], classification: exact },
  { id: "first-roll-yahtzee", chance: lowerRatio(1, 1296), size: 78, art: diceArtwork(5, 4, "#b65a79", "#ffe8f2"), sourceIds: ["five-dice-model"], classification: exact },
  { id: "rubik-state", chance: oneIn(43252003274489856000), size: 91, art: artwork("cube", "#d56645", "#f2d35d"), sourceIds: ["god-s-number-state-count"], classification: exact },
  { id: "french-scrabble-consonant", chance: lowerRatio(55, 102), size: 88, art: scrabbleArtwork("consonant", "#7c694d"), sourceIds: ["french-scrabble-federation-letter-distribution", "international-french-language-classic-scrabble-rules", "hasbro-english-scrabble-letter-distribution"], classification: exact },
  { id: "four-dice-any-match", chance: lowerRatio(13, 18), size: 82, art: diceOutcomeArtwork([4, 4, 2, 5], "#8a6d9d", "#f4e8ff"), sourceIds: ["fair-independent-dice-model"], classification: exact },
  { id: "yahtzee-any-match", chance: lowerRatio(49, 54), size: 84, art: diceOutcomeArtwork([4, 4, 2, 5, 1], "#9b617f", "#ffe9f3"), sourceIds: ["fair-independent-dice-model"], classification: exact },
  { id: "french-scrabble-vowel-rack", chance: upperRatio(264385836, 18466953120), size: 92, art: scrabbleArtwork("vowel-rack", "#806746"), sourceIds: ["french-scrabble-federation-letter-distribution", "international-french-language-classic-scrabble-rules", "hasbro-english-scrabble-letter-distribution"], classification: exact },
  { id: "die-d20-no-critical-failure", chance: upperRatio(1, 20), size: 86, art: polyhedralDieArtwork(20, "#4f8c78", "#e6fff4", "2–20"), sourceIds: ["dnd-critical"], classification: exact },
  { id: "d20-avoid-natural-one-advantage", chance: upperRatio(1, 400), size: 94, art: d20AdvantageArtwork("#527e9d", "#edf5ff"), sourceIds: ["dnd-advantage", "dnd-critical"], classification: exact },
] satisfies readonly LandmarkModel[];
