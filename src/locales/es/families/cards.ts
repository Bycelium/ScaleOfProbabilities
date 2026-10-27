import type { LandmarkCopyFamily } from "../../types";

const holdemAssumptions = "Una baraja estándar de 52 cartas no tiene comodines. Se reparten dos cartas privadas y cinco comunitarias sin conocer ninguna de antemano. La mejor mano de cinco entre las siete determina la categoría exacta, por lo que se excluyen las categorías superiores. Retirarse, los oponentes y la probabilidad de ganar quedan fuera de este modelo.";

export const cardsES = {
  "ace-in-five-cards": {
    title: "Al menos un as en cinco cartas",
    shortTitle: "un as en cinco cartas",
    explanation: "De las 2 598 960 manos posibles de cinco cartas, 886 656 contienen al menos un as. El cálculo cuenta primero las manos sin ases y luego las resta del total.",
    calculation: "p = 1 − C(48, 5) / C(52, 5) = 886656 / 2598960",
    assumptions: "Se reparten cartas sin reemplazo de una baraja estándar de 52 cartas bien barajada.",
  },
  "holdem-one-pair": {
    title: "Texas Hold’em: exactamente una pareja",
    shortTitle: "una pareja",
    explanation: "De los 133 784 560 conjuntos posibles de siete cartas, 58 627 800 tienen exactamente una pareja en la mejor mano de cinco cartas. Dos cartas comparten un valor y las otras tres tienen valores distintos.",
    calculation: "p = 58 627 800 manos con exactamente una pareja / C(52, 7) = 58 627 800 / 133 784 560",
    assumptions: holdemAssumptions,
  },
  "numbered-card": {
    title: "Una carta del 2 al 10 de una baraja estándar",
    shortTitle: "carta numerada del 2 al 10",
    explanation: "Treinta y seis de las 52 cartas tienen un número del 2 al 10: nueve valores numéricos en cada uno de los cuatro palos.",
    calculation: "p = 36 / 52 = 9/13",
    assumptions: "Una baraja estándar de 52 cartas bien barajada da la misma probabilidad a cada carta. Los ases y las figuras quedan fuera de la categoría numérica del 2 al 10.",
  },
  "any-ace": {
    title: "Un as de una baraja estándar",
    shortTitle: "cualquier as",
    explanation: "Cuatro de las 52 cartas son ases, uno de cada palo.",
    calculation: "p = 4 ases / 52 cartas = 1/13",
    assumptions: "Una baraja estándar de 52 cartas bien barajada da la misma probabilidad a cada carta.",
  },
  "ace-of-spades": {
    title: "El as de picas de una baraja",
    shortTitle: "as de picas",
    explanation: "Exactamente una de las 52 cartas es el as de picas.",
    calculation: "p = 1 carta coincidente / 52 cartas = 1/52",
    assumptions: "Una baraja estándar de 52 cartas bien barajada da la misma probabilidad a cada carta.",
  },
  "holdem-high-card": {
    title: "Texas Hold’em: carta alta",
    shortTitle: "carta alta",
    explanation: "De los 133 784 560 conjuntos posibles de siete cartas, 23 294 460 tienen carta alta como mejor categoría de cinco cartas: sin pareja, escalera, color ni una mano superior.",
    calculation: "p = 23 294 460 manos exactas de carta alta / C(52, 7) = 23 294 460 / 133 784 560",
    assumptions: holdemAssumptions,
  },
  "holdem-two-pair": {
    title: "Texas Hold’em: exactamente doble pareja",
    shortTitle: "doble pareja",
    explanation: "De los 133 784 560 conjuntos posibles de siete cartas, 31 433 400 tienen exactamente doble pareja como mejor categoría de cinco cartas. Dos valores aparecen dos veces y la quinta carta tiene otro valor.",
    calculation: "p = 31 433 400 manos exactas de doble pareja / C(52, 7) = 31 433 400 / 133 784 560",
    assumptions: holdemAssumptions,
  },
  "holdem-three-kind": {
    title: "Texas Hold’em: trío",
    shortTitle: "trío",
    explanation: "De los 133 784 560 conjuntos posibles de siete cartas, 6 461 620 tienen un trío como mejor categoría de cinco cartas, sin full ni póquer.",
    calculation: "p = 6 461 620 manos exactas de trío / C(52, 7) = 6 461 620 / 133 784 560",
    assumptions: holdemAssumptions,
  },
  "holdem-straight": {
    title: "Texas Hold’em: escalera",
    shortTitle: "escalera",
    explanation: "De los 133 784 560 conjuntos posibles de siete cartas, 6 180 020 tienen una escalera como mejor categoría de cinco cartas, sin color ni una mano superior.",
    calculation: "p = 6 180 020 manos exactas de escalera / C(52, 7) = 6 180 020 / 133 784 560",
    assumptions: holdemAssumptions,
  },
  "holdem-flush": {
    title: "Texas Hold’em: color",
    shortTitle: "color",
    explanation: "De los 133 784 560 conjuntos posibles de siete cartas, 4 047 644 tienen color como mejor categoría de cinco cartas, sin full ni una mano superior.",
    calculation: "p = 4 047 644 manos exactas de color / C(52, 7) = 4 047 644 / 133 784 560",
    assumptions: holdemAssumptions,
  },
  "holdem-full-house": {
    title: "Texas Hold’em: full",
    shortTitle: "full",
    explanation: "De los 133 784 560 conjuntos posibles de siete cartas, 3 473 184 tienen un full como mejor categoría de cinco cartas: tres cartas de un valor y dos de otro.",
    calculation: "p = 3 473 184 manos exactas de full / C(52, 7) = 3 473 184 / 133 784 560",
    assumptions: holdemAssumptions,
  },
  "holdem-four-kind": {
    title: "Texas Hold’em: póquer",
    shortTitle: "póquer",
    explanation: "De los 133 784 560 conjuntos posibles de siete cartas, 224 848 tienen póquer como mejor categoría de cinco cartas.",
    calculation: "p = 224 848 manos exactas de póquer / C(52, 7) = 224 848 / 133 784 560",
    assumptions: holdemAssumptions,
  },
  "holdem-straight-flush": {
    title: "Texas Hold’em: escalera de color no real",
    shortTitle: "escalera de color",
    explanation: "De los 133 784 560 conjuntos posibles de siete cartas, 37 260 tienen una escalera de color no real como mejor categoría de cinco cartas. Las escaleras reales se cuentan aparte.",
    calculation: "p = (41 584 escaleras de color incluidas las reales − 4324 reales) / C(52, 7) = 37 260 / 133 784 560",
    assumptions: holdemAssumptions,
  },
  "holdem-royal-flush": {
    title: "Texas Hold’em: escalera real",
    shortTitle: "escalera real",
    explanation: "De los 133 784 560 conjuntos posibles de siete cartas, 4324 contienen una escalera real: diez, jota, reina, rey y as del mismo palo.",
    calculation: "p = 4324 manos de siete cartas con escalera real / C(52, 7) = 4324 / 133 784 560",
    assumptions: holdemAssumptions,
  },
} satisfies LandmarkCopyFamily;
