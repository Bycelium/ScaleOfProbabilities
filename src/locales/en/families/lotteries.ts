import type { LandmarkCopyFamily } from "../../types";

export const lotteriesEN = {
  "euromillions-main-prize": {
    title: "A EuroMillions line wins any main-draw prize",
    shortTitle: "EuroMillions any prize",
    explanation: "Of the 139,838,160 possible results for one EuroMillions line, 10,778,691 win a main-draw prize. All 13 prize levels count.",
    calculation: "p = 10,778,691 prize-winning results / 139,838,160 possible results",
    assumptions: "One line picks 5 of 50 main numbers and 2 of 12 Lucky Stars. My Million, UK Millionaire Maker, El Millón, and other raffles or options are excluded. Rules checked 25 October 2026.",
  },
  "france-loto-main-prize": {
    title: "A France Loto line wins any main-draw prize",
    shortTitle: "France Loto any prize",
    explanation: "Of the 19,068,840 possible results for one France Loto line, 3,185,973 win a main-draw prize. All nine levels count, including the prize that only returns the stake.",
    calculation: "p = 3,185,973 prize-winning results / 19,068,840 possible results",
    assumptions: "One line picks 5 of 49 main numbers and 1 Lucky Number from 10. Codes, raffles, 2nd Tirage, and Joker+ are excluded. Rules checked 25 October 2026.",
  },
  "france-loto-main-loss": {
    title: "A France Loto line wins no main-draw prize",
    shortTitle: "France Loto no prize",
    explanation: "Of the 19,068,840 possible results for one France Loto line, 15,882,867 win no main-draw prize. These miss both the Lucky Number-only prize and every prize for matching at least two main numbers.",
    calculation: "p = 15,882,867 non-winning results / 19,068,840 possible results",
    assumptions: "This follows one line in one draw. One line picks 5 of 49 main numbers and 1 Lucky Number from 10. Codes, raffles, 2nd Tirage, and Joker+ are excluded. Rules checked 25 October 2026.",
  },
  "euromillions-main-loss": {
    title: "A EuroMillions line wins no main-draw prize",
    shortTitle: "EuroMillions no prize",
    explanation: "Of the 139,838,160 possible results for one EuroMillions line, 129,059,469 win no main-draw prize.",
    calculation: "p = 129,059,469 non-winning results / 139,838,160 possible results",
    assumptions: "This follows one line in one draw. One line picks 5 of 50 main numbers and 2 of 12 Lucky Stars. My Million, UK Millionaire Maker, El Millón, and other raffles or options are excluded. Rules checked 25 October 2026.",
  },
  "france-loto-jackpot": {
    title: "A France Loto line wins the jackpot",
    shortTitle: "France Loto jackpot",
    explanation: "Exactly one of 19,068,840 possible results matches all five main numbers and the Lucky Number.",
    calculation: "p = 1 jackpot result / (C(49, 5) × 10) = 1/19,068,840",
    assumptions: "One line picks 5 of 49 main numbers and 1 Lucky Number from 10. Codes, raffles, 2nd Tirage, and Joker+ are excluded. Rules checked 25 October 2026.",
  },
  "uk-lotto-jackpot": {
    title: "A UK Lotto line matches six in either round",
    shortTitle: "UK Lotto six matches",
    explanation: "One UK Lotto line has two independent chances to match all six numbers on one draw night. A double match is counted once.",
    calculation: "p = 2/N − 1/N² = 90,114,947 / 2,030,175,963,260,676, where N = C(59, 6) = 45,057,474",
    assumptions: "The current 2026 format uses two fresh sets of balls and two machines from the same 59-number pool. This counts one line on one draw night. Rules checked 25 October 2026.",
  },
  "euromillions-jackpot": {
    title: "A EuroMillions line wins the jackpot",
    shortTitle: "EuroMillions jackpot",
    explanation: "Exactly one of 139,838,160 possible results matches all five main numbers and both Lucky Stars.",
    calculation: "p = 1 jackpot result / (C(50, 5) × C(12, 2)) = 1/139,838,160",
    assumptions: "One line picks 5 of 50 main numbers and 2 of 12 Lucky Stars. My Million, UK Millionaire Maker, El Millón, and other raffles or options are excluded. Rules checked 25 October 2026.",
  },
  "us-powerball-jackpot": {
    title: "A US Powerball play wins the jackpot",
    shortTitle: "US Powerball jackpot",
    explanation: "Exactly one of 292,201,338 possible results matches all five white numbers and the red Powerball.",
    calculation: "p = 1 matching result / 292,201,338 possible results",
    assumptions: "One play uses five of 69 white balls and one of 26 red balls under rules verified 25 October 2026.",
  },
  "us-mega-millions-jackpot": {
    title: "A US Mega Millions play wins the jackpot",
    shortTitle: "US Mega Millions jackpot",
    explanation: "Exactly one of 290,472,336 possible results matches all five white numbers and the Mega Ball.",
    calculation: "p = 1 jackpot result / 290,472,336 possible results",
    assumptions: "The current matrix picks 5 of 70 white balls and 1 Mega Ball from 24. Rules checked 25 October 2026.",
  },
} satisfies LandmarkCopyFamily;
