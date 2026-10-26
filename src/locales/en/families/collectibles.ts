import type { LandmarkCopyFamily } from "../../types";

export const collectiblesEN = {
  "pokemon-destined-rivals-double-rare": {
    title: "A Destined Rivals booster contains a Double Rare Pokémon ex card",
    shortTitle: "Pokémon · regular ex",
    explanation: "After opening more than 8,000 Destined Rivals boosters, TCGplayer estimated a Double Rare in 19.83% of packs, or about one in five. All 17 Double Rare cards are regular-version Pokémon ex.",
    calculation: "p ≈ 0.1983 per booster pack",
    assumptions: "This is an observed per-pack estimate with a 95% confidence interval of ±0.84 percentage points, calculated by TCGplayer using a normal approximation. It covers any card of the exact Double Rare rarity. The article does not identify the sampled print language or market, so the estimate may differ across other languages or print runs.",
  },
  "pokemon-destined-rivals-illustration-rare": {
    title: "A Destined Rivals booster contains an Illustration Rare card",
    shortTitle: "Pokémon · illustrated card",
    explanation: "After opening more than 8,000 Destined Rivals boosters, TCGplayer estimated an Illustration Rare in 8.29% of packs, or about one in 12. All 23 cards of this rarity are full-card alternate illustrations of non-ex Pokémon.",
    calculation: "p ≈ 0.0829 per booster pack",
    assumptions: "This is an observed per-pack estimate with a 95% confidence interval of ±0.58 percentage points, calculated by TCGplayer using a normal approximation. It covers any card of the exact Illustration Rare rarity. The article does not identify the sampled print language or market, so the result is not assumed to describe every language or print run.",
  },
  "pokemon-destined-rivals-special-illustration-rare": {
    title: "A Destined Rivals booster contains a Special Illustration Rare card",
    shortTitle: "Pokémon · special illustration",
    explanation: "After opening more than 8,000 Destined Rivals boosters, TCGplayer estimated a Special Illustration Rare in 1.06% of packs, or about one in 94. This rarity contains eight alternate-art Pokémon ex and three Trainer cards.",
    calculation: "p ≈ 0.0106 per booster pack",
    assumptions: "This is an observed per-pack estimate with a 95% confidence interval of ±0.22 percentage points, calculated by TCGplayer using a normal approximation. It covers any card of the exact Special Illustration Rare rarity. The article does not identify the sampled print language or market, so the result is not assumed to describe every language or print run.",
  },
} satisfies LandmarkCopyFamily;
