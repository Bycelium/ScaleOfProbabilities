import type { LandmarkCopyFamily } from "../../types";

export const collectiblesFR = {
  "pokemon-destined-rivals-double-rare": {
    title: "Un booster Pokémon Rivalités Destinées contient une carte Pokémon ex Double Rare",
    shortTitle: "Pokémon · ex classique",
    explanation: "Après avoir ouvert plus de 8 000 boosters Destined Rivals, TCGplayer estime la présence d’une carte Double Rare dans 19,83 % des paquets, soit environ un sur cinq. Les 17 cartes Double Rare sont des Pokémon ex en version classique.",
    calculation: "p ≈ 0,1983 par booster",
    assumptions: "Il s’agit d’une estimation observée par booster avec un intervalle de confiance à 95 % de ±0,84 point de pourcentage, calculé par TCGplayer avec une approximation normale. L’événement couvre toute carte de rareté Double Rare. L’article ne précise ni la langue d’impression ni le marché de l’échantillon. Le résultat peut donc varier selon la langue ou le tirage.",
  },
  "pokemon-destined-rivals-illustration-rare": {
    title: "Un booster Pokémon Rivalités Destinées contient une carte Illustration Rare",
    shortTitle: "Pokémon · carte illustrée",
    explanation: "Après avoir ouvert plus de 8 000 boosters Destined Rivals, TCGplayer estime la présence d’une carte Illustration Rare dans 8,29 % des paquets, soit environ un sur 12. Les 23 cartes de cette rareté sont des illustrations alternatives pleine carte de Pokémon non-ex.",
    calculation: "p ≈ 0,0829 par booster",
    assumptions: "Il s’agit d’une estimation observée par booster avec un intervalle de confiance à 95 % de ±0,58 point de pourcentage, calculé par TCGplayer avec une approximation normale. L’événement couvre toute carte de rareté Illustration Rare. L’article ne précise ni la langue d’impression ni le marché de l’échantillon. Le résultat peut donc varier selon la langue ou le tirage.",
  },
  "pokemon-destined-rivals-special-illustration-rare": {
    title: "Un booster Pokémon Rivalités Destinées contient une carte Illustration rare spéciale",
    shortTitle: "Pokémon · illustration spéciale",
    explanation: "Après avoir ouvert plus de 8 000 boosters Destined Rivals, TCGplayer estime la présence d’une carte Illustration rare spéciale dans 1,06 % des paquets, soit environ un sur 94. Cette rareté comprend huit Pokémon ex en illustration alternative et trois cartes Dresseur.",
    calculation: "p ≈ 0,0106 par booster",
    assumptions: "Il s’agit d’une estimation observée par booster avec un intervalle de confiance à 95 % de ±0,22 point de pourcentage, calculé par TCGplayer avec une approximation normale. L’événement couvre toute carte de rareté Illustration rare spéciale. L’article ne précise ni la langue d’impression ni le marché de l’échantillon. Le résultat peut donc varier selon la langue ou le tirage.",
  },
} satisfies LandmarkCopyFamily;
