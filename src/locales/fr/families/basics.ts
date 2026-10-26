import type { LandmarkCopyFamily } from "../../types";

const birthdayAssumptions = "Les anniversaires sont indépendants et répartis uniformément sur 365 dates. Les 29 février sont ignorés.";
export const basicsFR = {
  "coin-heads": {
    title: "Un côté choisi d’une pièce équilibrée",
    shortTitle: "pile ou face",
    explanation: "L’un des deux résultats équiprobables correspond au côté choisi à l’avance : pile ou face.",
    calculation: "p = 1 côté choisi / 2 côtés = 1/2",
    assumptions: "La pièce a autant de chances de tomber sur pile que sur face et ne reste pas sur la tranche.",
  },
  "birthday-23": {
    title: "Un anniversaire commun parmi 23 personnes",
    shortTitle: "un anniversaire commun",
    explanation: "Un groupe modélisé de 23 personnes a un peu plus de chances de contenir un anniversaire commun que 23 dates toutes différentes. Toutes les paires possibles comptent.",
    calculation: "p = 1 − ∏ₖ₌₀²² (365 − k) / 365",
    assumptions: birthdayAssumptions,
  },
  "month-31-days": {
    title: "Un mois choisi compte 31 jours",
    shortTitle: "mois de 31 jours",
    explanation: "Sept des douze mois comptent 31 jours. Quatre en comptent 30, et février en compte 28 ou 29.",
    calculation: "p = 7 mois / 12 mois = 7/12",
    assumptions: "Chacun des douze mois nommés a la même probabilité d’être choisi. Les années bissextiles ne changent pas les mois de 31 jours.",
  },
  "weekday": {
    title: "Un jour choisi va du lundi au vendredi",
    shortTitle: "lundi–vendredi",
    explanation: "Cinq des sept jours vont du lundi au vendredi. Les deux autres sont le samedi et le dimanche.",
    calculation: "p = 5 jours nommés / 7 jours nommés = 5/7",
    assumptions: "Il s’agit d’une catégorie calendaire uniforme. Aucun emploi du temps professionnel ou personnel n’est modélisé.",
  },
  "ocean-point": {
    title: "Un point aléatoire tombe dans l’océan",
    shortTitle: "un point dans l’océan",
    explanation: "Environ 71 points sur 100 choisis uniformément sur la Terre tombent sur l’eau océanique, comme la part estimée de l’océan dans la surface de la planète.",
    calculation: "p ≈ 0,71 d’après la part publiée de la surface couverte par l’océan",
    assumptions: "La couverture océanique publiée de 71 % sert d’estimation de surface.",
  },
  "annual-flood": {
    title: "Dépasser un seuil annuel d’inondation de 1 %",
    shortTitle: "inondation annuelle à 1 %",
    explanation: "Pour le lieu défini, le modèle compte en moyenne un dépassement annuel du seuil pour 99 années sans dépassement. La probabilité annuelle de 1 % ne garantit pas une inondation tous les 100 ans.",
    calculation: "p = 0,01 pour le lieu, le seuil et l’année définis",
    assumptions: "Le seuil appartient à un lieu précis. D’autres habitations et cours d’eau ont des risques différents.",
  },
  "birthday-50": {
    title: "Un anniversaire commun parmi 50 personnes",
    shortTitle: "anniversaire commun parmi 50",
    explanation: "Environ 97 groupes modélisés sur 100 de 50 personnes contiennent au moins un anniversaire commun. Le calcul retranche la probabilité que toutes les dates diffèrent.",
    calculation: "p = 1 − ∏ₖ₌₀⁴⁹ (365 − k) / 365 ≈ 0,97037358",
    assumptions: birthdayAssumptions,
  },
  "birthday-70": {
    title: "Un anniversaire commun parmi 70 personnes",
    shortTitle: "anniversaire commun parmi 70",
    explanation: "Environ 1 189 groupes modélisés de 70 personnes contiennent un anniversaire commun pour un groupe où les 70 dates diffèrent. Le calcul retranche la faible probabilité que toutes les dates diffèrent.",
    calculation: "p ≈ 0,999159576",
    assumptions: birthdayAssumptions,
  },
  "birthday-79": {
    title: "Un anniversaire commun parmi 79 personnes",
    shortTitle: "anniversaire commun parmi 79",
    explanation: "Environ 9 146 groupes modélisés de 79 personnes contiennent un anniversaire commun pour un groupe où les 79 dates diffèrent. Le calcul retranche la très faible probabilité que toutes les dates diffèrent.",
    calculation: "p ≈ 0,999890668",
    assumptions: birthdayAssumptions,
  },
  "lightning-year": {
    title: "Être frappé par la foudre en un an aux États-Unis",
    shortTitle: "foudre annuelle aux États-Unis",
    explanation: "L’estimation historique compte environ une personne frappée en un an pour 1 222 000 résidents des États-Unis. Elle divise le nombre annuel moyen de personnes touchées par la population.",
    calculation: "p ≈ 1 / 1 222 000",
    assumptions: "L’estimation utilise la moyenne des impacts de 2009 à 2018 et la population américaine de 2019. Le lieu, l’activité et le temps passé dehors modifient fortement le risque individuel.",
  },
} satisfies LandmarkCopyFamily;
