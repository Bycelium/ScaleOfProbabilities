import type { LandmarkCopyFamily } from "../../types";

export const casinoEN = {
  "roulette-straight-up": {
    title: "Winning a straight-up roulette bet",
    shortTitle: "roulette · one number",
    explanation: "One chosen straight-up bet covers one number, or one of the 37 pockets on a single-zero roulette wheel. A win pays €3,500 net and returns the €100 stake. Otherwise, the €100 stake is lost. Over many spins, the average loss is €2.70 per €100 bet.",
    calculation: "p = 1/37; expected net return = [(1 × €3,500) − (36 × €100)] / 37 = −€100/37 ≈ −€2.70 per €100",
    assumptions: "Each of the 37 numbers, including zero, is equally likely. The calculation follows French roulette anglaise rules. The average loss is over repeated plays.",
  },
  "roulette-split": {
    title: "Winning a split roulette bet",
    shortTitle: "roulette · split",
    explanation: "One chosen split bet covers two adjacent numbers on the roulette layout, or two of the 37 wheel pockets. A win pays €1,700 net and returns the €100 stake. Otherwise, the €100 stake is lost. Over many spins, the average loss is €2.70 per €100 bet.",
    calculation: "p = 2/37; expected net return = [(2 × €1,700) − (35 × €100)] / 37 = −€100/37 ≈ −€2.70 per €100",
    assumptions: "Each of the 37 numbers, including zero, is equally likely. The calculation follows French roulette anglaise rules. The average loss is over repeated plays.",
  },
  "roulette-street": {
    title: "Winning a street roulette bet",
    shortTitle: "roulette · street",
    explanation: "One chosen street bet covers the three numbers in one row of the roulette layout, or three of the 37 wheel pockets. A win pays €1,100 net and returns the €100 stake. Otherwise, the €100 stake is lost. Over many spins, the average loss is €2.70 per €100 bet.",
    calculation: "p = 3/37; expected net return = [(3 × €1,100) − (34 × €100)] / 37 = −€100/37 ≈ −€2.70 per €100",
    assumptions: "Each of the 37 numbers, including zero, is equally likely. The calculation follows French roulette anglaise rules. The average loss is over repeated plays.",
  },
  "roulette-corner": {
    title: "Winning a corner roulette bet",
    shortTitle: "roulette · corner",
    explanation: "One chosen corner bet covers four numbers meeting at one corner of the roulette layout, or four of the 37 wheel pockets. A win pays €800 net and returns the €100 stake. Otherwise, the €100 stake is lost. Over many spins, the average loss is €2.70 per €100 bet.",
    calculation: "p = 4/37; expected net return = [(4 × €800) − (33 × €100)] / 37 = −€100/37 ≈ −€2.70 per €100",
    assumptions: "Each of the 37 numbers, including zero, is equally likely. The calculation follows French roulette anglaise rules. The average loss is over repeated plays.",
  },
  "roulette-six-line": {
    title: "Winning a six-line roulette bet",
    shortTitle: "roulette · six-line",
    explanation: "One chosen six-line bet covers six adjacent numbers on two rows of the roulette layout, or six of the 37 wheel pockets. A win pays €500 net and returns the €100 stake. Otherwise, the €100 stake is lost. Over many spins, the average loss is €2.70 per €100 bet.",
    calculation: "p = 6/37; expected net return = [(6 × €500) − (31 × €100)] / 37 = −€100/37 ≈ −€2.70 per €100",
    assumptions: "Each of the 37 numbers, including zero, is equally likely. The calculation follows French roulette anglaise rules. The average loss is over repeated plays.",
  },
  "roulette-dozen-column": {
    title: "Winning a dozen or column roulette bet",
    shortTitle: "roulette · dozen or column",
    explanation: "One chosen dozen or column covers 12 of the 37 pockets on a single-zero roulette wheel. A win pays €200 net and returns the €100 stake. Otherwise, the €100 stake is lost. Over many spins, the average loss is €2.70 per €100 bet.",
    calculation: "p = 12/37; expected net return = [(12 × €200) − (25 × €100)] / 37 = −€100/37 ≈ −€2.70 per €100",
    assumptions: "Each of the 37 numbers, including zero, is equally likely. The calculation follows French roulette anglaise rules. The average loss is over repeated plays.",
  },
  "roulette-even-money": {
    title: "Winning a roulette bet on red",
    shortTitle: "roulette · red",
    explanation: "A bet on red covers 18 of the 37 pockets on a single-zero roulette wheel. Black, odd, even, low, and high are equivalent even-money choices. Red adds €100 net and returns the €100 stake. Black loses the €100 stake. Zero returns €50, a €50 net loss. Over many spins, the average loss is €1.35 per €100 bet.",
    calculation: "p = 18/37; expected net return = [(18 × €100) − (18 × €100) − €50] / 37 = −€100/74 ≈ −€1.35 per €100",
    assumptions: "Each of the 37 numbers, including zero, is equally likely. The calculation follows French roulette anglaise rules. The average loss is over repeated plays.",
  },
  "roulette-two-dozens-columns": {
    title: "Winning a two-dozen or two-column roulette bet",
    shortTitle: "roulette · 24 pockets",
    explanation: "A €100 total stake, split as €50 on each of two chosen dozens or columns, covers 24 of the 37 pockets on a single-zero roulette wheel. A covered number returns €150, a €50 net gain. The other 13 numbers, including zero, lose the €100 total stake. Over many spins, the average loss is €2.70 per €100 bet.",
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
