import type { LandmarkCopyFamily } from "../../types";

export const biology_healthFR = {
  "green-pea": {
    title: "Une graine de pois verte",
    shortTitle: "graine de pois verte",
    explanation: "Parmi les quatre combinaisons équiprobables de deux plants porteurs des variantes jaune et verte, une produit une graine verte. Le vert est récessif : les deux parents doivent transmettre cette variante.",
    calculation: "p = 1 combinaison verte / 4 combinaisons = 1/4",
    assumptions: "Le croisement Yy × Yy suit un modèle mendélien simple à un gène. Selon les variantes portées par les parents, cette probabilité change.",
  },
  "yellow-pea": {
    title: "Une graine de pois jaune",
    shortTitle: "graine de pois jaune",
    explanation: "Parmi les quatre combinaisons équiprobables de deux plants porteurs des variantes jaune et verte, trois produisent une graine jaune, car le jaune est dominant.",
    calculation: "p = 3 combinaisons jaunes / 4 combinaisons = 3/4",
    assumptions: "Le croisement Yy × Yy suit un modèle mendélien simple à un gène. Selon les variantes portées par les parents, cette probabilité change.",
  },
  "double-yolk-young-hens": {
    title: "Un œuf à deux jaunes pondu par de jeunes poules",
    shortTitle: "un œuf à deux jaunes",
    explanation: "Une étude de production rapporte environ deux œufs à deux jaunes pour 100 œufs de jeunes poules commerciales au début de la ponte.",
    calculation: "p ≈ 0,02",
    assumptions: "L’estimation concerne de jeunes poules au début de la production. L’âge, la génétique, l’alimentation, la gestion du troupeau et le tri des œufs modifient ce taux. Il ne s’agit pas d’une probabilité universelle pour un œuf de supermarché.",
  },
  "dna-nucleotide-copied-correctly": {
    title: "Une lettre de l’ADN est copiée correctement",
    shortTitle: "lettre de l’ADN copiée correctement",
    explanation: "Une estimation courante en biologie moléculaire donne environ une erreur, après relecture et réparation des mésappariements, par milliard de nucléotides copiés. Environ 999 999 999 sont donc copiés correctement.",
    calculation: "p ≈ 1 − 10⁻⁹",
    assumptions: "Il s’agit d’un ordre de grandeur donné par un manuel après relecture et réparation des mésappariements. La fidélité varie selon les organismes, cellules, conditions et systèmes de réparation. L’événement concerne un nucléotide, pas un génome entier.",
  },
  "covid-scenario-prior": {
    title: "Infection par le COVID avant un test antigénique rapide",
    shortTitle: "COVID · avant test",
    explanation: "Imaginons {population} personnes sans symptômes ayant eu une exposition suspectée qui passent un test COVID. Avec la prévalence hypothétique de {prevalence} %, {infected} d’entre elles sont infectées avant le test.",
    calculation: "probabilité initiale p = 0,005 ; cote initiale = 0,005 / 0,995",
    assumptions: "La prévalence de 0,5 % est une donnée hypothétique, pas une mesure actuelle ni une estimation de risque personnel. La même hypothèse d’infection et la même population servent aux deux mises à jour après test.",
  },
  "covid-scenario-positive": {
    title: "Infection par le COVID après un test antigénique rapide positif",
    shortTitle: "COVID · positif",
    explanation: "Dans ce groupe hypothétique de {population} personnes avec une prévalence de {prevalence} %, environ {positiveTotal} obtiennent un résultat positif : {truePositive} sont infectées et {falsePositive} sont des faux positifs. Dans ce scénario, un résultat positif correspond à environ une chance sur trois d’être infecté.",
    calculation: "p = (0,005 × 0,586) / [(0,005 × 0,586) + (0,995 × (1 − 0,994))] ≈ 0,3292",
    assumptions: "Le calcul part de la prévalence hypothétique de 0,5 % et utilise une sensibilité groupée de 0,586 et une spécificité de 0,994 chez des personnes asymptomatiques ayant eu une exposition suspectée. Ces estimations historiques réunissent différents tests et études jusqu’en février 2022. Les performances varient selon le test, le moment, le prélèvement et le contexte. Ce calcul ne constitue pas un diagnostic personnel.",
  },
  "covid-scenario-negative": {
    title: "Infection par le COVID après un test antigénique rapide négatif",
    shortTitle: "COVID · négatif",
    explanation: "Dans ce groupe hypothétique de {population} personnes avec une prévalence de {prevalence} %, environ {negativeTotal} obtiennent un résultat négatif. Le test manque {falseNegative} infections parmi elles, soit environ une personne infectée sur 479 résultats négatifs.",
    calculation: "p = (0,005 × (1 − 0,586)) / [(0,005 × (1 − 0,586)) + (0,995 × 0,994)] ≈ 0,00209",
    assumptions: "Le calcul part de la prévalence hypothétique de 0,5 % et utilise une sensibilité groupée de 0,586 et une spécificité de 0,994 chez des personnes asymptomatiques ayant eu une exposition suspectée. Ces estimations historiques réunissent différents tests et études jusqu’en février 2022. Les performances varient selon le test, le moment, le prélèvement et le contexte. Ce calcul ne constitue pas un diagnostic personnel.",
  },
  "human-denovo-snv": {
    title: "Une mutation de novo d’une lettre de l’ADN en une génération humaine",
    shortTitle: "nouvelle mutation d’une lettre d’ADN",
    explanation: "Une étude de 283 trios islandais parent-enfant estime environ un nouveau variant sur un seul nucléotide pour 77,5 millions de positions transmises par génération, soit un taux de 1,29 × 10⁻⁸.",
    calculation: "p ≈ 1,29 × 10⁻⁸ par position transmise et par génération",
    assumptions: "L’intervalle de confiance à 95 % est de 1,27 à 1,30 × 10⁻⁸ après correction de la couverture et de la détectabilité. L’étude observe en moyenne environ 63 variants de novo par personne. Le taux varie avec l’âge parental et le contexte de séquence. L’événement échantillonne une position transmise, pas la probabilité qu’un enfant ait une mutation quelconque ou une maladie. Son unité diffère du modèle d’erreur lors de la réplication cellulaire.",
  },
  "four-leaf-clover": {
    title: "Un trèfle blanc à quatre feuilles",
    shortTitle: "trèfle blanc à quatre feuilles",
    explanation: "L’estimation citée compte un trèfle blanc à quatre feuilles pour 5 076 trèfles à trois feuilles. Parmi ces trèfles à trois ou quatre feuilles, cela représente une chance sur 5 077.",
    calculation: "p ≈ 1 / (5 076 + 1) = 1 / 5 077",
    assumptions: "La comparaison se limite aux trèfles blancs à trois ou quatre feuilles. Il s’agit d’une estimation approximative de fréquence, pas d’une enquête mondiale précise. La génétique, l’environnement et la parcelle peuvent modifier ce taux. La méthode, la durée et le choix de la parcelle déterminent la probabilité d’en trouver un pendant une recherche.",
  },
} satisfies LandmarkCopyFamily;
