import type { LandmarkCopyFamily } from "../../types";

const rouletteAssumptions = "Chacun des 37 numéros, zéro compris, a la même chance de sortir. Le calcul suit les règles françaises de la roulette anglaise. La perte moyenne correspond à de nombreux tours.";
export const casinoFR = {
  "roulette-straight-up": {
    title: "Gain sur un numéro plein à la roulette",
    shortTitle: "roulette · un numéro",
    explanation: "Choisissez un numéro sur une roulette à simple zéro : il gagne une fois sur 37 tours en moyenne.",
    calculation: "p = 1/37 ; espérance de gain net = [(1 × 3 500 €) − (36 × 100 €)] / 37 = −100 €/37 ≈ −2,70 € par mise de 100 €",
    assumptions: rouletteAssumptions,
  },
  "roulette-split": {
    title: "Gain sur un cheval à la roulette",
    shortTitle: "roulette · cheval",
    explanation: "Placez un cheval entre deux numéros voisins : l’un ou l’autre gagne, soit deux des 37 cases de la roulette.",
    calculation: "p = 2/37 ; espérance de gain net = [(2 × 1 700 €) − (35 × 100 €)] / 37 = −100 €/37 ≈ −2,70 € par mise de 100 €",
    assumptions: rouletteAssumptions,
  },
  "roulette-street": {
    title: "Gain sur une transversale pleine à la roulette",
    shortTitle: "roulette · transversale",
    explanation: "Couvrez une ligne de trois numéros sur le tapis : trois des 37 cases de la roulette gagnent la mise.",
    calculation: "p = 3/37 ; espérance de gain net = [(3 × 1 100 €) − (34 × 100 €)] / 37 = −100 €/37 ≈ −2,70 € par mise de 100 €",
    assumptions: rouletteAssumptions,
  },
  "roulette-corner": {
    title: "Gain sur un carré à la roulette",
    shortTitle: "roulette · carré",
    explanation: "Placez un jeton à l’angle de quatre numéros : chacune de ces quatre cases gagne le carré.",
    calculation: "p = 4/37 ; espérance de gain net = [(4 × 800 €) − (33 × 100 €)] / 37 = −100 €/37 ≈ −2,70 € par mise de 100 €",
    assumptions: rouletteAssumptions,
  },
  "roulette-six-line": {
    title: "Gain sur un sixain à la roulette",
    shortTitle: "roulette · sixain",
    explanation: "Couvrez deux lignes voisines du tapis : six des 37 cases de la roulette gagnent le sixain.",
    calculation: "p = 6/37 ; espérance de gain net = [(6 × 500 €) − (31 × 100 €)] / 37 = −100 €/37 ≈ −2,70 € par mise de 100 €",
    assumptions: rouletteAssumptions,
  },
  "roulette-dozen-column": {
    title: "Gain sur une douzaine ou une colonne à la roulette",
    shortTitle: "roulette · douzaine ou colonne",
    explanation: "Choisissez une douzaine ou une colonne : 12 des 37 cases de la roulette à simple zéro gagnent la mise.",
    calculation: "p = 12/37 ; espérance de gain net = [(12 × 200 €) − (25 × 100 €)] / 37 = −100 €/37 ≈ −2,70 € par mise de 100 €",
    assumptions: rouletteAssumptions,
  },
  "roulette-even-money": {
    title: "Gain d’une mise sur rouge à la roulette",
    shortTitle: "roulette · rouge",
    explanation: "Misez sur rouge : 18 des 37 cases gagnent. Avec la règle française du partage, le zéro rend la moitié de la mise.",
    calculation: "p = 18/37 ; espérance de gain net = [(18 × 100 €) − (18 × 100 €) − 50 €] / 37 = −100 €/74 ≈ −1,35 € par mise de 100 €",
    assumptions: rouletteAssumptions,
  },
  "roulette-two-dozens-columns": {
    title: "Gain sur deux douzaines ou deux colonnes à la roulette",
    shortTitle: "roulette · 24 cases",
    explanation: "Répartissez la mise sur deux douzaines ou deux colonnes : 24 des 37 cases de la roulette donnent un gain net.",
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
