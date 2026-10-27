import type { LandmarkCopyFamily } from "../../types";

const birthdayAssumptions = "Les anniversaires sont indépendants et répartis uniformément sur 365 dates. Les 29 février sont ignorés.";
export const basicsFR = {
  "coin-heads": {
    title: "Un côté choisi d’une pièce équilibrée",
    shortTitle: "pile ou face",
    explanation: "Annoncez pile ou face avant qu’une pièce équilibrée retombe : le côté choisi gagne une fois sur deux.",
    calculation: "p = 1 côté choisi / 2 côtés = 1/2",
    assumptions: "La pièce a autant de chances de tomber sur pile que sur face et ne reste pas sur la tranche.",
  },
  "birthday-10": {
    title: "Un anniversaire commun parmi 10 personnes",
    shortTitle: "anniversaire commun parmi 10",
    explanation: "Même autour d’une table de seulement 10 personnes, environ 12 groupes modélisés sur 100 comptent un anniversaire commun.",
    calculation: "p = 1 − ∏ₖ₌₀⁹ (365 − k) / 365 ≈ 0,11694818",
    assumptions: birthdayAssumptions,
  },
  "birthday-20": {
    title: "Un anniversaire commun parmi 20 personnes",
    shortTitle: "anniversaire commun parmi 20",
    explanation: "Réunissez 20 personnes : environ 41 groupes modélisés sur 100 comptent un anniversaire commun.",
    calculation: "p = 1 − ∏ₖ₌₀¹⁹ (365 − k) / 365 ≈ 0,41143838",
    assumptions: birthdayAssumptions,
  },
  "birthday-30": {
    title: "Un anniversaire commun parmi 30 personnes",
    shortTitle: "anniversaire commun parmi 30",
    explanation: "Dans une salle de 30 personnes, un anniversaire commun est déjà plus probable que son absence : il apparaît dans environ 71 groupes modélisés sur 100.",
    calculation: "p = 1 − ∏ₖ₌₀²⁹ (365 − k) / 365 ≈ 0,70631624",
    assumptions: birthdayAssumptions,
  },
  "birthday-40": {
    title: "Un anniversaire commun parmi 40 personnes",
    shortTitle: "anniversaire commun parmi 40",
    explanation: "Avec 40 personnes dans la salle, environ 89 groupes modélisés sur 100 comptent un anniversaire commun.",
    calculation: "p = 1 − ∏ₖ₌₀³⁹ (365 − k) / 365 ≈ 0,89123181",
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
    explanation: "Lancez une épingle imaginaire uniformément sur la Terre : environ 71 fois sur 100, elle tombe dans l’océan.",
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
    explanation: "Réunissez 50 personnes : seuls trois groupes modélisés sur 100 environ évitent tout anniversaire commun.",
    calculation: "p = 1 − ∏ₖ₌₀⁴⁹ (365 − k) / 365 ≈ 0,97037358",
    assumptions: birthdayAssumptions,
  },
  "birthday-60": {
    title: "Un anniversaire commun parmi 60 personnes",
    shortTitle: "anniversaire commun parmi 60",
    explanation: "Parmi 60 personnes, plus de 99 groupes modélisés sur 100 comptent un anniversaire commun.",
    calculation: "p = 1 − ∏ₖ₌₀⁵⁹ (365 − k) / 365 ≈ 0,99412266",
    assumptions: birthdayAssumptions,
  },
  "lightning-year": {
    title: "Être frappé par la foudre en un an aux États-Unis",
    shortTitle: "foudre annuelle aux États-Unis",
    explanation: "Selon l’estimation historique américaine, environ une personne sur 1 222 000 résidents est frappée par la foudre au cours d’une année.",
    calculation: "p ≈ 1 / 1 222 000",
    assumptions: "L’estimation utilise la moyenne des impacts de 2009 à 2018 et la population américaine de 2019. Le lieu, l’activité et le temps passé dehors modifient fortement le risque individuel.",
  },
} satisfies LandmarkCopyFamily;
