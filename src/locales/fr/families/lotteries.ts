import type { LandmarkCopyFamily } from "../../types";

export const lotteriesFR = {
  "euromillions-main-prize": {
    title: "Une grille EuroMillions gagne un lot au tirage principal",
    shortTitle: "un lot EuroMillions",
    explanation: "Une grille EuroMillions gagne quelque chose au tirage principal environ une fois sur 13, en comptant les 13 rangs de gains.",
    calculation: "p = 10 778 691 résultats gagnants / 139 838 160 résultats possibles",
    assumptions: "Une grille choisit 5 numéros parmi 50 et 2 Étoiles parmi 12. Les tirages et options nationaux sont exclus. Règles vérifiées le 25 octobre 2026.",
  },
  "france-loto-main-prize": {
    title: "Une grille du Loto français gagne un lot au tirage principal",
    shortTitle: "un lot au Loto français",
    explanation: "Une grille du Loto français gagne un lot principal environ une fois sur six, en comptant les neuf rangs, y compris le remboursement de la mise.",
    calculation: "p = 3 185 973 résultats gagnants / 19 068 840 résultats possibles",
    assumptions: "Une grille choisit 5 numéros parmi 49 et 1 numéro Chance parmi 10. Les codes, tirages additionnels et Joker+ sont exclus. Règles vérifiées le 25 octobre 2026.",
  },
  "france-loto-main-loss": {
    title: "Une grille du Loto français ne gagne aucun lot principal",
    shortTitle: "aucun lot au Loto français",
    explanation: "Environ cinq grilles du Loto français sur six ne gagnent aucun lot principal, pas même le remboursement au seul numéro Chance.",
    calculation: "p = 15 882 867 résultats perdants / 19 068 840 résultats possibles",
    assumptions: "Une seule grille est suivie pendant un tirage. Les codes, tirages additionnels et Joker+ sont exclus. Règles vérifiées le 25 octobre 2026.",
  },
  "euromillions-main-loss": {
    title: "Une grille EuroMillions ne gagne aucun lot principal",
    shortTitle: "aucun lot EuroMillions",
    explanation: "Environ 12 grilles EuroMillions sur 13 ne gagnent aucun lot du tirage principal.",
    calculation: "p = 129 059 469 résultats perdants / 139 838 160 résultats possibles",
    assumptions: "Une seule grille est suivie pendant un tirage. Les tirages et options nationaux sont exclus. Règles vérifiées le 25 octobre 2026.",
  },
  "france-loto-jackpot": {
    title: "Une grille du Loto français gagne le jackpot",
    shortTitle: "jackpot du Loto français",
    explanation: "Trouver les cinq numéros principaux et le numéro Chance arrive à une grille du Loto français sur 19 068 840 résultats possibles.",
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
    explanation: "Trouver les cinq numéros principaux et les deux Étoiles arrive à une grille EuroMillions sur 139 838 160 résultats possibles.",
    calculation: "p = 1 résultat jackpot / (C(50, 5) × C(12, 2)) = 1/139 838 160",
    assumptions: "Une grille choisit 5 numéros parmi 50 et 2 Étoiles parmi 12. Les tirages et options nationaux sont exclus. Règles vérifiées le 25 octobre 2026.",
  },
  "us-powerball-jackpot": {
    title: "Une grille Powerball américaine gagne le jackpot",
    shortTitle: "jackpot Powerball américain",
    explanation: "Trouver les cinq numéros blancs et le Powerball rouge arrive à une grille sur 292 201 338 résultats possibles.",
    calculation: "p = 1 résultat correspondant / 292 201 338 résultats possibles",
    assumptions: "Une grille choisit cinq boules blanches parmi 69 et une boule rouge parmi 26. Règles vérifiées le 25 octobre 2026.",
  },
  "us-mega-millions-jackpot": {
    title: "Une grille Mega Millions américaine gagne le jackpot",
    shortTitle: "jackpot Mega Millions américain",
    explanation: "Trouver les cinq numéros blancs et la Mega Ball arrive à une grille sur 290 472 336 résultats possibles.",
    calculation: "p = 1 résultat jackpot / 290 472 336 résultats possibles",
    assumptions: "La formule actuelle choisit 5 boules blanches parmi 70 et 1 Mega Ball parmi 24. Règles vérifiées le 25 octobre 2026.",
  },
} satisfies LandmarkCopyFamily;
