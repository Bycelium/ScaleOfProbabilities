import type { LandmarkCopyFamily } from "../../types";

export const lotteriesFR = {
  "euromillions-main-prize": {
    title: "Une grille EuroMillions gagne un lot au tirage principal",
    shortTitle: "un lot EuroMillions",
    explanation: "Parmi les 139 838 160 résultats possibles d’une grille EuroMillions, 10 778 691 gagnent un lot du tirage principal. Les 13 rangs de gains comptent.",
    calculation: "p = 10 778 691 résultats gagnants / 139 838 160 résultats possibles",
    assumptions: "Une grille choisit 5 numéros parmi 50 et 2 Étoiles parmi 12. Les tirages et options nationaux sont exclus. Règles vérifiées le 25 octobre 2026.",
  },
  "france-loto-main-prize": {
    title: "Une grille du Loto français gagne un lot au tirage principal",
    shortTitle: "un lot au Loto français",
    explanation: "Parmi les 19 068 840 résultats possibles d’une grille du Loto français, 3 185 973 gagnent un lot du tirage principal. Les neuf rangs comptent, y compris le remboursement de la mise.",
    calculation: "p = 3 185 973 résultats gagnants / 19 068 840 résultats possibles",
    assumptions: "Une grille choisit 5 numéros parmi 49 et 1 numéro Chance parmi 10. Les codes, tirages additionnels et Joker+ sont exclus. Règles vérifiées le 25 octobre 2026.",
  },
  "france-loto-main-loss": {
    title: "Une grille du Loto français ne gagne aucun lot principal",
    shortTitle: "aucun lot au Loto français",
    explanation: "Parmi les 19 068 840 résultats possibles d’une grille du Loto français, 15 882 867 ne gagnent aucun lot principal. Ils manquent à la fois le gain au seul numéro Chance et tous les gains avec au moins deux numéros principaux.",
    calculation: "p = 15 882 867 résultats perdants / 19 068 840 résultats possibles",
    assumptions: "Une seule grille est suivie pendant un tirage. Les codes, tirages additionnels et Joker+ sont exclus. Règles vérifiées le 25 octobre 2026.",
  },
  "euromillions-main-loss": {
    title: "Une grille EuroMillions ne gagne aucun lot principal",
    shortTitle: "aucun lot EuroMillions",
    explanation: "Parmi les 139 838 160 résultats possibles d’une grille EuroMillions, 129 059 469 ne gagnent aucun lot principal.",
    calculation: "p = 129 059 469 résultats perdants / 139 838 160 résultats possibles",
    assumptions: "Une seule grille est suivie pendant un tirage. Les tirages et options nationaux sont exclus. Règles vérifiées le 25 octobre 2026.",
  },
  "france-loto-jackpot": {
    title: "Une grille du Loto français gagne le jackpot",
    shortTitle: "jackpot du Loto français",
    explanation: "Un seul des 19 068 840 résultats possibles trouve les cinq numéros principaux et le numéro Chance.",
    calculation: "p = 1 résultat jackpot / (C(49, 5) × 10) = 1/19 068 840",
    assumptions: "Une grille choisit 5 numéros parmi 49 et 1 numéro Chance parmi 10. Les codes, tirages additionnels et Joker+ sont exclus. Règles vérifiées le 25 octobre 2026.",
  },
  "uk-lotto-jackpot": {
    title: "Une grille du Lotto britannique trouve six numéros dans l’un des deux tirages",
    shortTitle: "six numéros au Lotto britannique",
    explanation: "Une même grille du Lotto britannique a deux occasions indépendantes de trouver les six numéros pendant une soirée. Un double gain n’est compté qu’une fois.",
    calculation: "p = 2/N − 1/N² = 90 114 947 / 2 030 175 963 260 676, avec N = C(59, 6) = 45 057 474",
    assumptions: "Le format 2026 utilise deux jeux de boules et deux machines avec 59 numéros. Une grille est suivie pendant une soirée. Règles vérifiées le 25 octobre 2026.",
  },
  "euromillions-jackpot": {
    title: "Une grille EuroMillions gagne le jackpot",
    shortTitle: "jackpot EuroMillions",
    explanation: "Un seul des 139 838 160 résultats possibles trouve les cinq numéros principaux et les deux Étoiles.",
    calculation: "p = 1 résultat jackpot / (C(50, 5) × C(12, 2)) = 1/139 838 160",
    assumptions: "Une grille choisit 5 numéros parmi 50 et 2 Étoiles parmi 12. Les tirages et options nationaux sont exclus. Règles vérifiées le 25 octobre 2026.",
  },
  "us-powerball-jackpot": {
    title: "Une grille Powerball américaine gagne le jackpot",
    shortTitle: "jackpot Powerball américain",
    explanation: "Un seul des 292 201 338 résultats possibles correspond aux cinq numéros blancs et au Powerball rouge.",
    calculation: "p = 1 résultat correspondant / 292 201 338 résultats possibles",
    assumptions: "Une grille choisit cinq boules blanches parmi 69 et une boule rouge parmi 26. Règles vérifiées le 25 octobre 2026.",
  },
  "us-mega-millions-jackpot": {
    title: "Une grille Mega Millions américaine gagne le jackpot",
    shortTitle: "jackpot Mega Millions américain",
    explanation: "Un seul des 290 472 336 résultats possibles correspond aux cinq numéros blancs et à la Mega Ball.",
    calculation: "p = 1 résultat jackpot / 290 472 336 résultats possibles",
    assumptions: "La formule actuelle choisit 5 boules blanches parmi 70 et 1 Mega Ball parmi 24. Règles vérifiées le 25 octobre 2026.",
  },
} satisfies LandmarkCopyFamily;
