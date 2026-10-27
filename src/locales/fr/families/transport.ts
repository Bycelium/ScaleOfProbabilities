import type { LandmarkCopyFamily } from "../../types";

export const transportFR = {
  "commercial-flight-no-accident-2025": {
    title: "Un vol commercial sans accident défini par l’IATA en 2025",
    shortTitle: "vol commercial sans accident · 2025",
    explanation: "Le bilan 2025 relève 51 accidents définis par l’IATA sur 38,7 millions de vols. D’après le taux arrondi publié, environ 758 000 vols n’ont eu aucun de ces accidents pour un vol qui en a eu un.",
    calculation: "p ≈ 1 − 1,32 / 1 000 000",
    assumptions: "Le modèle échantillonne un vol parmi les opérations commerciales de passagers et de fret en avions à réaction et turbopropulseurs. Les accidents comprennent notamment les touchers de queue, dommages au train et sorties de piste, ainsi que des événements plus graves. Il s’agit d’une estimation historique par vol, pas du risque de décès d’un passager ni d’une prévision.",
  },
  "commercial-flight-accident-2025": {
    title: "Un accident défini par l’IATA sur un vol commercial en 2025",
    shortTitle: "accident de vol commercial · 2025",
    explanation: "Le bilan 2025 relève 51 accidents définis par l’IATA sur 38,7 millions de vols, soit environ un pour 758 000 vols d’après le taux arrondi publié.",
    calculation: "p ≈ 1,32 / 1 000 000",
    assumptions: "Le modèle échantillonne un vol parmi les opérations commerciales de passagers et de fret en avions à réaction et turbopropulseurs. Les accidents comprennent les touchers de queue, dommages au train et sorties de piste, ainsi que des événements plus graves. Il s’agit d’une estimation historique par vol, pas du risque de décès d’un passager ni d’une prévision.",
  },
  "gb-injury-collision-20km": {
    title: "Un accident corporel déclaré sur un trajet automobile de 20 km",
    shortTitle: "accident corporel · 20 km",
    explanation: "Pour un trajet automobile modélisé de 20 km au taux national de Grande-Bretagne en 2025, l’implication dans un accident corporel déclaré à la police arrive environ une fois sur 166 000.",
    calculation: "λ = 484 / (1 000 000 000 × 1,609344) par km ; p = 1 − e^(−λ × 20) ≈ 6,0149 × 10⁻⁶",
    assumptions: "Ce modèle défini applique un taux de Poisson constant par distance à un trajet automobile de 20 km. L’agrégat national exclut les collisions avec dégâts matériels seuls et celles qui ne sont pas déclarées. Il décrit l’implication du véhicule, pas la probabilité qu’un occupant soit blessé ou tué. La distance choisie est illustrative. La route, la circulation, le conducteur et la météo varient.",
  },
  "gb-no-injury-collision-20km": {
    title: "Aucun accident corporel déclaré sur un trajet automobile de 20 km",
    shortTitle: "20 km sans accident corporel",
    explanation: "Au taux national de Grande-Bretagne en 2025, environ 166 000 trajets automobiles modélisés de 20 km sur 166 001 évitent toute implication dans un accident corporel déclaré à la police.",
    calculation: "λ = 484 / (1 000 000 000 × 1,609344) par km ; p = e^(−λ × 20) ≈ 0,9999939851",
    assumptions: "Ce modèle défini applique un taux de Poisson constant par distance à un trajet automobile de 20 km. L’agrégat national exclut les collisions avec dégâts matériels seuls et celles qui ne sont pas déclarées. Il décrit l’implication du véhicule, pas tous les types d’incident ni les problèmes mécaniques. La distance choisie est illustrative. La route, la circulation, le conducteur et la météo varient.",
  },
  "gb-injury-collision-500km": {
    title: "Un accident corporel déclaré sur un trajet automobile de 500 km",
    shortTitle: "accident corporel · 500 km",
    explanation: "Pour un trajet automobile modélisé de 500 km au taux national de Grande-Bretagne en 2025, l’implication dans un accident corporel déclaré à la police arrive environ une fois sur 6 650.",
    calculation: "λ = 484 / (1 000 000 000 × 1,609344) par km ; p = 1 − e^(−λ × 500) ≈ 1,5036 × 10⁻⁴",
    assumptions: "Ce modèle défini applique un taux de Poisson constant par distance à un trajet automobile de 500 km. L’agrégat national exclut les collisions avec dégâts matériels seuls et celles qui ne sont pas déclarées. Il décrit l’implication du véhicule, pas la probabilité qu’un occupant soit blessé ou tué. La distance choisie est illustrative. Les conditions d’un long trajet peuvent différer de la moyenne nationale.",
  },
  "gb-no-injury-collision-500km": {
    title: "Aucun accident corporel déclaré sur un trajet automobile de 500 km",
    shortTitle: "500 km sans accident corporel",
    explanation: "Au taux national de Grande-Bretagne en 2025, environ 6 650 trajets automobiles modélisés de 500 km sur 6 651 évitent toute implication dans un accident corporel déclaré à la police.",
    calculation: "λ = 484 / (1 000 000 000 × 1,609344) par km ; p = e^(−λ × 500) ≈ 0,9998496395",
    assumptions: "Ce modèle défini applique un taux de Poisson constant par distance à un trajet automobile de 500 km. L’agrégat national exclut les collisions avec dégâts matériels seuls et celles qui ne sont pas déclarées. Il décrit l’implication du véhicule, pas tous les types d’incident ni les problèmes mécaniques. La distance choisie est illustrative. Les conditions d’un long trajet peuvent différer de la moyenne nationale.",
  },
  "uk-recent-car-breakdown-2021": {
    title: "Une panne ou un défaut de démarrage en un an pour une voiture récente",
    shortTitle: "panne dans l’année · voiture récente",
    explanation: "Dans l’enquête automobile britannique 2021 de Which?, 4,9 % des voitures âgées de quatre ans au plus ont connu au moins une panne ou un défaut de démarrage pendant les douze mois précédents, soit environ une sur 20.",
    calculation: "p ≈ 0,049 avec au moins une panne ou un défaut de démarrage",
    assumptions: "Ce résultat rétrospectif porte sur les voitures britanniques âgées de 0 à 4 ans en 2021. L’enquête complète comptait 48 034 personnes et 56 853 voitures. L’article ne donne pas l’effectif propre à cette tranche d’âge. Le résultat annuel n’est pas un taux par trajet et ne décrit ni tous les âges de voitures ni la fiabilité actuelle.",
  },
  "uk-recent-car-no-breakdown-2021": {
    title: "Une année sans panne ni défaut de démarrage pour une voiture récente",
    shortTitle: "une année sans panne · voiture récente",
    explanation: "Dans l’enquête automobile britannique 2021 de Which?, 95,1 % des voitures âgées de quatre ans au plus n’ont connu aucune panne ni défaut de démarrage pendant les douze mois précédents, soit environ 19 sans incident pour une qui en a connu un.",
    calculation: "p ≈ 1 − 0,049 = 0,951 sans panne ni défaut de démarrage",
    assumptions: "Ce résultat rétrospectif porte sur les voitures britanniques âgées de 0 à 4 ans en 2021. L’enquête complète comptait 48 034 personnes et 56 853 voitures. L’article ne donne pas l’effectif propre à cette tranche d’âge. Le résultat annuel n’est pas un taux par trajet et ne décrit ni tous les âges de voitures ni la fiabilité actuelle.",
  },
} satisfies LandmarkCopyFamily;
