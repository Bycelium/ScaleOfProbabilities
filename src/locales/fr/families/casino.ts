import type { LandmarkCopyFamily } from "../../types";

const rouletteAssumptions = "Chacun des 37 numéros, zéro compris, a la même chance de sortir. Le calcul suit les règles françaises de la roulette anglaise. La perte moyenne correspond à de nombreux tours.";
export const casinoFR = {
  "roulette-straight-up": {
    title: "Gain sur un numéro plein à la roulette",
    shortTitle: "roulette · un numéro",
    explanation: "Un numéro plein vise une seule des 37 cases. Une mise de 100 € rapporte 3 500 € nets si ce numéro sort, en plus de la mise récupérée. Sinon, les 100 € sont perdus. La perte moyenne est d’environ 2,70 € pour 100 € misés.",
    calculation: "p = 1/37 ; espérance de gain net = [(1 × 3 500 €) − (36 × 100 €)] / 37 = −100 €/37 ≈ −2,70 € par mise de 100 €",
    assumptions: rouletteAssumptions,
  },
  "roulette-split": {
    title: "Gain sur un cheval à la roulette",
    shortTitle: "roulette · cheval",
    explanation: "Un cheval couvre deux numéros voisins sur le tapis, soit deux cases sur 37. Une mise de 100 € rapporte 1 700 € nets si l’un de ces numéros sort, en plus de la mise récupérée. Sinon, les 100 € sont perdus. La perte moyenne est d’environ 2,70 € pour 100 € misés.",
    calculation: "p = 2/37 ; espérance de gain net = [(2 × 1 700 €) − (35 × 100 €)] / 37 = −100 €/37 ≈ −2,70 € par mise de 100 €",
    assumptions: rouletteAssumptions,
  },
  "roulette-street": {
    title: "Gain sur une transversale pleine à la roulette",
    shortTitle: "roulette · transversale",
    explanation: "Une transversale pleine couvre les trois numéros d’une ligne du tapis. Une mise de 100 € rapporte 1 100 € nets si l’un de ces numéros sort, en plus de la mise récupérée. Sinon, les 100 € sont perdus. La perte moyenne est d’environ 2,70 € pour 100 € misés.",
    calculation: "p = 3/37 ; espérance de gain net = [(3 × 1 100 €) − (34 × 100 €)] / 37 = −100 €/37 ≈ −2,70 € par mise de 100 €",
    assumptions: rouletteAssumptions,
  },
  "roulette-corner": {
    title: "Gain sur un carré à la roulette",
    shortTitle: "roulette · carré",
    explanation: "Un carré réunit quatre numéros au même angle du tapis et couvre donc quatre cases. Une mise de 100 € rapporte 800 € nets si l’un de ces numéros sort, en plus de la mise récupérée. Sinon, les 100 € sont perdus. La perte moyenne est d’environ 2,70 € pour 100 € misés.",
    calculation: "p = 4/37 ; espérance de gain net = [(4 × 800 €) − (33 × 100 €)] / 37 = −100 €/37 ≈ −2,70 € par mise de 100 €",
    assumptions: rouletteAssumptions,
  },
  "roulette-six-line": {
    title: "Gain sur un sixain à la roulette",
    shortTitle: "roulette · sixain",
    explanation: "Un sixain couvre six numéros adjacents sur deux lignes du tapis, soit six des 37 cases. Une mise de 100 € rapporte 500 € nets si l’un de ces numéros sort, en plus de la mise récupérée. Sinon, les 100 € sont perdus. La perte moyenne est d’environ 2,70 € pour 100 € misés.",
    calculation: "p = 6/37 ; espérance de gain net = [(6 × 500 €) − (31 × 100 €)] / 37 = −100 €/37 ≈ −2,70 € par mise de 100 €",
    assumptions: rouletteAssumptions,
  },
  "roulette-dozen-column": {
    title: "Gain sur une douzaine ou une colonne à la roulette",
    shortTitle: "roulette · douzaine ou colonne",
    explanation: "Une douzaine ou une colonne choisie couvre 12 des 37 cases. Une mise de 100 € rapporte 200 € nets si l’un de ces numéros sort, en plus de la mise récupérée. Sinon, les 100 € sont perdus. La perte moyenne est d’environ 2,70 € pour 100 € misés.",
    calculation: "p = 12/37 ; espérance de gain net = [(12 × 200 €) − (25 × 100 €)] / 37 = −100 €/37 ≈ −2,70 € par mise de 100 €",
    assumptions: rouletteAssumptions,
  },
  "roulette-even-money": {
    title: "Gain d’une mise sur rouge à la roulette",
    shortTitle: "roulette · rouge",
    explanation: "Une mise de 100 € sur rouge couvre 18 des 37 cases. Noir, pair, impair, manque et passe sont des chances simples équivalentes. Si rouge sort, le gain net est de 100 € et la mise est rendue. Si noir sort, les 100 € sont perdus. Au zéro, la règle française rend 50 €, ce qui laisse une perte nette de 50 €. La perte moyenne est d’environ 1,35 € pour 100 € misés.",
    calculation: "p = 18/37 ; espérance de gain net = [(18 × 100 €) − (18 × 100 €) − 50 €] / 37 = −100 €/74 ≈ −1,35 € par mise de 100 €",
    assumptions: rouletteAssumptions,
  },
  "roulette-two-dozens-columns": {
    title: "Gain sur deux douzaines ou deux colonnes à la roulette",
    shortTitle: "roulette · 24 cases",
    explanation: "Répartir 100 € entre deux douzaines ou deux colonnes, 50 € sur chacune, couvre 24 des 37 cases. Quand l’une d’elles sort, 150 € reviennent, soit un gain net de 50 €. Les 13 autres numéros, zéro compris, font perdre les 100 €. La perte moyenne est d’environ 2,70 € pour 100 € misés.",
    calculation: "p = 24/37 ; espérance de gain net = [(24 × 50 €) − (13 × 100 €)] / 37 = −100 €/37 ≈ −2,70 € par mise de 100 €",
    assumptions: rouletteAssumptions,
  },
  "blackjack-natural-six-deck": {
    title: "Un blackjack naturel dans un sabot de six jeux",
    shortTitle: "blackjack naturel · 6 jeux",
    explanation: "Environ une distribution initiale sur 21,06 depuis un sabot complet de six jeux donne un blackjack naturel : un as et un dix, valet, dame ou roi, dans un ordre quelconque.",
    calculation: "p = 2 × (24 as / 312 cartes) × (96 cartes valant dix / 311 cartes restantes) ≈ 0,047489488",
    assumptions: "Le sabot de 312 cartes contient 24 as et 96 cartes valant dix et il est mélangé uniformément. Un naturel est la main initiale de deux cartes : un 21 obtenu après une séparation est exclu. Recevoir un blackjack naturel ne signifie pas gagner contre la banque. Les cartes brûlées ou intercalées inconnues ne changent pas cette probabilité inconditionnelle. Une composition connue du sabot peut la modifier.",
  },
} satisfies LandmarkCopyFamily;
