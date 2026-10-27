import { artwork, deckStackArtwork, numberCardArtwork, pokerArtwork } from "../../artwork";
import { lowerRatio, oneIn, exact } from "../helpers";
import type { LandmarkModel } from "../types";

const standardDeckPermutationCount = 8.065817517094388e67; // 52!
const tarotDeckPermutationCount = 1.1324281178206297e115; // 78!
const beloteDeckPermutationCount = 2.6313083693369352e35; // 32!

export const cardsModels = [
  { id: "ace-in-five-cards", chance: lowerRatio(886656, 2598960), size: 96, art: artwork("cards", "#dd5b5b"), sourceIds: ["five-card-hand-combinatorics"], classification: exact },
  { id: "holdem-one-pair", chance: lowerRatio(58627800, 133784560), size: 94, art: pokerArtwork([["K", "♠"], ["K", "♥"], ["9", "♣"], ["5", "♦"], ["2", "♠"]], "#9d6ab2"), sourceIds: ["brian-alspach-seven-card-poker-frequencies", "pokerstars-texas-hold-em-rules"], classification: exact },
  { id: "numbered-card", chance: lowerRatio(9, 13), size: 80, art: numberCardArtwork(7, "#c55d69"), sourceIds: ["standard-deck-model"], classification: exact },
  { id: "any-ace", chance: lowerRatio(1, 13), size: 80, art: artwork("cards", "#c9515b"), sourceIds: ["standard-deck-model"], classification: exact },
  { id: "ace-of-spades", chance: lowerRatio(1, 52), size: 80, art: artwork("spade", "#343a56"), sourceIds: ["standard-deck-model"], classification: exact },
  { id: "holdem-high-card", chance: lowerRatio(23294460, 133784560), size: 94, art: pokerArtwork([["A", "♠"], ["J", "♥"], ["8", "♣"], ["5", "♦"], ["2", "♠"]], "#557c9d"), sourceIds: ["brian-alspach-seven-card-poker-frequencies", "pokerstars-texas-hold-em-rules"], classification: exact },
  { id: "holdem-two-pair", chance: lowerRatio(31433400, 133784560), size: 94, art: pokerArtwork([["Q", "♠"], ["Q", "♥"], ["7", "♣"], ["7", "♦"], ["2", "♠"]], "#8a68a5"), sourceIds: ["brian-alspach-seven-card-poker-frequencies", "pokerstars-texas-hold-em-rules"], classification: exact },
  { id: "holdem-three-kind", chance: lowerRatio(6461620, 133784560), size: 94, art: pokerArtwork([["8", "♠"], ["8", "♥"], ["8", "♣"], ["K", "♦"], ["3", "♠"]], "#8b668e"), sourceIds: ["brian-alspach-seven-card-poker-frequencies", "pokerstars-texas-hold-em-rules"], classification: exact },
  { id: "holdem-straight", chance: lowerRatio(6180020, 133784560), size: 94, art: pokerArtwork([["9", "♠"], ["8", "♥"], ["7", "♣"], ["6", "♦"], ["5", "♠"]], "#537f91"), sourceIds: ["brian-alspach-seven-card-poker-frequencies", "pokerstars-texas-hold-em-rules"], classification: exact },
  { id: "holdem-flush", chance: lowerRatio(4047644, 133784560), size: 94, art: pokerArtwork([["A", "♥"], ["J", "♥"], ["8", "♥"], ["5", "♥"], ["2", "♥"]], "#567f88"), sourceIds: ["brian-alspach-seven-card-poker-frequencies", "pokerstars-texas-hold-em-rules"], classification: exact },
  { id: "holdem-full-house", chance: lowerRatio(3473184, 133784560), size: 94, art: pokerArtwork([["K", "♠"], ["K", "♥"], ["K", "♣"], ["7", "♦"], ["7", "♠"]], "#865f91"), sourceIds: ["brian-alspach-seven-card-poker-frequencies", "pokerstars-texas-hold-em-rules"], classification: exact },
  { id: "holdem-four-kind", chance: lowerRatio(224848, 133784560), size: 94, art: pokerArtwork([["9", "♠"], ["9", "♥"], ["9", "♣"], ["9", "♦"], ["A", "♠"]], "#8f5d79"), sourceIds: ["brian-alspach-seven-card-poker-frequencies", "pokerstars-texas-hold-em-rules"], classification: exact },
  { id: "holdem-straight-flush", chance: lowerRatio(37260, 133784560), size: 94, art: pokerArtwork([["9", "♣"], ["8", "♣"], ["7", "♣"], ["6", "♣"], ["5", "♣"]], "#597c78"), sourceIds: ["brian-alspach-seven-card-poker-frequencies", "pokerstars-texas-hold-em-rules"], classification: exact },
  { id: "holdem-royal-flush", chance: lowerRatio(4324, 133784560), size: 94, art: pokerArtwork([["A", "♦"], ["K", "♦"], ["Q", "♦"], ["J", "♦"], ["10", "♦"]], "#a06770"), sourceIds: ["brian-alspach-seven-card-poker-frequencies", "pokerstars-texas-hold-em-rules"], classification: exact },
  { id: "shuffled-deck-specified-order", chance: oneIn(standardDeckPermutationCount), size: 96, art: deckStackArtwork("#b3434c", 52), sourceIds: ["ucr-well-shuffled-deck"], classification: exact },
  { id: "shuffled-tarot-specified-order", chance: oneIn(tarotDeckPermutationCount), size: 96, art: deckStackArtwork("#8064a0", 78), sourceIds: ["french-tarot-rules", "ucr-well-shuffled-deck"], classification: exact },
  { id: "shuffled-belote-specified-order", chance: oneIn(beloteDeckPermutationCount), size: 96, art: deckStackArtwork("#4a7894", 32), sourceIds: ["french-belote-rules", "ucr-well-shuffled-deck"], classification: exact },
] satisfies readonly LandmarkModel[];
