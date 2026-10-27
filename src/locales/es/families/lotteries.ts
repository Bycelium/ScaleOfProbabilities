import type { LandmarkCopyFamily } from "../../types";

export const lotteriesES = {
  "euromillions-main-prize": {
    title: "Una apuesta de EuroMillions gana algún premio del sorteo principal",
    shortTitle: "cualquier premio de EuroMillions",
    explanation: "Una apuesta de EuroMillions gana algo del sorteo principal cerca de una vez entre 13 jugadas, contando los 13 niveles de premios.",
    calculation: "p = 10 778 691 resultados premiados / 139 838 160 resultados posibles",
    assumptions: "Una apuesta elige 5 de 50 números principales y 2 de 12 estrellas. Se excluyen My Million, UK Millionaire Maker, El Millón y otros sorteos u opciones. Reglas comprobadas el 25 de octubre de 2026.",
  },
  "france-loto-main-prize": {
    title: "Una apuesta de Loto francés gana algún premio del sorteo principal",
    shortTitle: "cualquier premio del Loto francés",
    explanation: "Una apuesta del Loto francés gana un premio principal cerca de una vez entre seis jugadas, contando los nueve niveles, incluida la devolución de lo apostado.",
    calculation: "p = 3 185 973 resultados premiados / 19 068 840 resultados posibles",
    assumptions: "Una apuesta elige 5 de 49 números principales y 1 Número de la Suerte entre 10. Se excluyen códigos, sorteos, 2nd Tirage y Joker+. Reglas comprobadas el 25 de octubre de 2026.",
  },
  "france-loto-main-loss": {
    title: "Una apuesta del Loto francés no gana ningún premio del sorteo principal",
    shortTitle: "Loto francés sin premio",
    explanation: "Cerca de cinco de cada seis apuestas del Loto francés no ganan ningún premio principal, ni siquiera la devolución solo por el Número de la Suerte.",
    calculation: "p = 15 882 867 resultados sin premio / 19 068 840 resultados posibles",
    assumptions: "Se sigue una apuesta en un sorteo. Una apuesta elige 5 de 49 números principales y 1 Número de la Suerte entre 10. Se excluyen códigos, sorteos, 2nd Tirage y Joker+. Reglas comprobadas el 25 de octubre de 2026.",
  },
  "euromillions-main-loss": {
    title: "Una apuesta de EuroMillions no gana ningún premio del sorteo principal",
    shortTitle: "EuroMillions sin premio",
    explanation: "Cerca de 12 de cada 13 apuestas de EuroMillions no ganan ningún premio del sorteo principal.",
    calculation: "p = 129 059 469 resultados sin premio / 139 838 160 resultados posibles",
    assumptions: "Se sigue una apuesta en un sorteo. Una apuesta elige 5 de 50 números principales y 2 de 12 estrellas. Se excluyen My Million, UK Millionaire Maker, El Millón y otros sorteos u opciones. Reglas comprobadas el 25 de octubre de 2026.",
  },
  "france-loto-jackpot": {
    title: "Una apuesta del Loto francés gana el bote",
    shortTitle: "bote del Loto francés",
    explanation: "Acertar los cinco números principales y el Número de la Suerte ocurre en una apuesta del Loto francés entre 19 068 840 resultados posibles.",
    calculation: "p = 1 resultado con bote / (C(49, 5) × 10) = 1/19 068 840",
    assumptions: "Una apuesta elige 5 de 49 números principales y 1 Número de la Suerte entre 10. Se excluyen códigos, sorteos, 2nd Tirage y Joker+. Reglas comprobadas el 25 de octubre de 2026.",
  },
  "uk-lotto-jackpot": {
    title: "Una apuesta de UK Lotto acierta los seis números en una de las dos rondas",
    shortTitle: "seis aciertos de UK Lotto",
    explanation: "Una apuesta de UK Lotto tiene dos oportunidades independientes de acertar los seis números en una noche de sorteo. Un acierto doble se cuenta una sola vez.",
    calculation: "p = 2/N − 1/N² = 90 114 947 / 2 030 175 963 260 676, donde N = C(59, 6) = 45 057 474",
    assumptions: "El formato vigente en 2026 usa dos juegos nuevos de bolas y dos máquinas del mismo conjunto de 59 números. Se cuenta una apuesta en una noche de sorteo. Reglas comprobadas el 25 de octubre de 2026.",
  },
  "euromillions-jackpot": {
    title: "Una apuesta de EuroMillions gana el bote",
    shortTitle: "bote de EuroMillions",
    explanation: "Acertar los cinco números principales y las dos estrellas ocurre en una apuesta de EuroMillions entre 139 838 160 resultados posibles.",
    calculation: "p = 1 resultado con bote / (C(50, 5) × C(12, 2)) = 1/139 838 160",
    assumptions: "Una apuesta elige 5 de 50 números principales y 2 de 12 estrellas. Se excluyen My Million, UK Millionaire Maker, El Millón y otros sorteos u opciones. Reglas comprobadas el 25 de octubre de 2026.",
  },
  "us-powerball-jackpot": {
    title: "Una apuesta de Powerball de EE. UU. gana el bote",
    shortTitle: "bote de Powerball de EE. UU.",
    explanation: "Acertar los cinco números blancos y el Powerball rojo ocurre en una apuesta entre 292 201 338 resultados posibles.",
    calculation: "p = 1 resultado coincidente / 292 201 338 resultados posibles",
    assumptions: "Una apuesta usa cinco de 69 bolas blancas y una de 26 bolas rojas según las reglas verificadas el 25 de octubre de 2026.",
  },
  "us-mega-millions-jackpot": {
    title: "Una apuesta de Mega Millions de EE. UU. gana el bote",
    shortTitle: "bote de Mega Millions de EE. UU.",
    explanation: "Acertar los cinco números blancos y la Mega Ball ocurre en una apuesta entre 290 472 336 resultados posibles.",
    calculation: "p = 1 resultado con bote / 290 472 336 resultados posibles",
    assumptions: "La matriz actual elige 5 de 70 bolas blancas y 1 Mega Ball entre 24. Reglas comprobadas el 25 de octubre de 2026.",
  },
} satisfies LandmarkCopyFamily;
