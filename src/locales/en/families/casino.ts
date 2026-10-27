import type { LandmarkCopyFamily } from "../../types";

export const casinoEN = {
  "roulette-straight-up": {
    title: "Winning a straight-up roulette bet",
    shortTitle: "roulette · one number",
    explanation: "Choose one number on a single-zero roulette wheel: it wins once in 37 spins on average.",
    calculation: "p = 1/37; expected net return = [(1 × €3,500) − (36 × €100)] / 37 = −€100/37 ≈ −€2.70 per €100",
    assumptions: "Each of the 37 numbers, including zero, is equally likely. The calculation follows French roulette anglaise rules. The average loss is over repeated plays.",
  },
  "roulette-split": {
    title: "Winning a split roulette bet",
    shortTitle: "roulette · split",
    explanation: "Place a split across two adjacent numbers: either number wins, covering two of the wheel’s 37 pockets.",
    calculation: "p = 2/37; expected net return = [(2 × €1,700) − (35 × €100)] / 37 = −€100/37 ≈ −€2.70 per €100",
    assumptions: "Each of the 37 numbers, including zero, is equally likely. The calculation follows French roulette anglaise rules. The average loss is over repeated plays.",
  },
  "roulette-street": {
    title: "Winning a street roulette bet",
    shortTitle: "roulette · street",
    explanation: "Cover one row of three numbers on the roulette layout: the bet wins on three of the wheel’s 37 pockets.",
    calculation: "p = 3/37; expected net return = [(3 × €1,100) − (34 × €100)] / 37 = −€100/37 ≈ −€2.70 per €100",
    assumptions: "Each of the 37 numbers, including zero, is equally likely. The calculation follows French roulette anglaise rules. The average loss is over repeated plays.",
  },
  "roulette-corner": {
    title: "Winning a corner roulette bet",
    shortTitle: "roulette · corner",
    explanation: "Place a chip where four numbers meet: any of those four pockets wins the corner bet.",
    calculation: "p = 4/37; expected net return = [(4 × €800) − (33 × €100)] / 37 = −€100/37 ≈ −€2.70 per €100",
    assumptions: "Each of the 37 numbers, including zero, is equally likely. The calculation follows French roulette anglaise rules. The average loss is over repeated plays.",
  },
  "roulette-six-line": {
    title: "Winning a six-line roulette bet",
    shortTitle: "roulette · six-line",
    explanation: "Cover two adjacent rows of the roulette layout: six of the wheel’s 37 pockets win the bet.",
    calculation: "p = 6/37; expected net return = [(6 × €500) − (31 × €100)] / 37 = −€100/37 ≈ −€2.70 per €100",
    assumptions: "Each of the 37 numbers, including zero, is equally likely. The calculation follows French roulette anglaise rules. The average loss is over repeated plays.",
  },
  "roulette-dozen-column": {
    title: "Winning a dozen or column roulette bet",
    shortTitle: "roulette · dozen or column",
    explanation: "Choose one dozen or column: 12 of the single-zero wheel’s 37 pockets win the bet.",
    calculation: "p = 12/37; expected net return = [(12 × €200) − (25 × €100)] / 37 = −€100/37 ≈ −€2.70 per €100",
    assumptions: "Each of the 37 numbers, including zero, is equally likely. The calculation follows French roulette anglaise rules. The average loss is over repeated plays.",
  },
  "roulette-even-money": {
    title: "Winning a roulette bet on red",
    shortTitle: "roulette · red",
    explanation: "Bet on red and 18 of the wheel’s 37 pockets win. Under the French half-loss rule, zero returns half the stake.",
    calculation: "p = 18/37; expected net return = [(18 × €100) − (18 × €100) − €50] / 37 = −€100/74 ≈ −€1.35 per €100",
    assumptions: "Each of the 37 numbers, including zero, is equally likely. The calculation follows French roulette anglaise rules. The average loss is over repeated plays.",
  },
  "roulette-two-dozens-columns": {
    title: "Winning a two-dozen or two-column roulette bet",
    shortTitle: "roulette · 24 pockets",
    explanation: "Split the stake across two dozens or two columns and 24 of the wheel’s 37 pockets produce a net win.",
    calculation: "p = 24/37; expected net return = [(24 × €50) − (13 × €100)] / 37 = −€100/37 ≈ −€2.70 per €100",
    assumptions: "Each of the 37 numbers, including zero, is equally likely. The calculation follows French roulette anglaise rules. The average loss is over repeated plays.",
  },
  "blackjack-natural-six-deck": {
    title: "A natural blackjack from a six-deck shoe",
    shortTitle: "natural blackjack · 6 decks",
    explanation: "About one in 21.06 initial two-card deals from a full six-deck casino shoe is a natural blackjack: an ace and a ten, jack, queen, or king, in either order.",
    calculation: "p = 2 × (24 aces / 312 cards) × (96 ten-valued cards / 311 remaining cards) ≈ 0.047489488",
    assumptions: "The 312-card shoe contains 24 aces and 96 ten-valued cards and is uniformly shuffled. A natural is the initial two-card hand, so a 21 made after a split is excluded. Receiving a natural does not mean winning against the dealer. Unknown burned or intervening cards do not change this unconditional chance. Known shoe depletion can change it.",
  },
} satisfies LandmarkCopyFamily;
