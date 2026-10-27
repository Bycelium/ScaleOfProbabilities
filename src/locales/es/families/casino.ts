import type { LandmarkCopyFamily } from "../../types";

const rouletteAssumptions = "Cada uno de los 37 números, incluido el cero, es igualmente probable. El cálculo sigue las reglas francesas de la ruleta inglesa. La pérdida media se calcula sobre jugadas repetidas.";

export const casinoES = {
  "roulette-straight-up": {
    title: "Ganar una apuesta plena en la ruleta",
    shortTitle: "ruleta · un número",
    explanation: "Elige un número en una ruleta de un solo cero: gana una vez de cada 37 giros por término medio.",
    calculation: "p = 1/37; retorno neto esperado = [(1 × 3500 €) − (36 × 100 €)] / 37 = −100 €/37 ≈ −2,70 € por cada 100 €",
    assumptions: rouletteAssumptions,
  },
  "roulette-split": {
    title: "Ganar una apuesta a caballo en la ruleta",
    shortTitle: "ruleta · caballo",
    explanation: "Coloca una apuesta a caballo entre dos números contiguos: cualquiera de los dos gana, cubriendo dos de las 37 casillas.",
    calculation: "p = 2/37; retorno neto esperado = [(2 × 1700 €) − (35 × 100 €)] / 37 = −100 €/37 ≈ −2,70 € por cada 100 €",
    assumptions: rouletteAssumptions,
  },
  "roulette-street": {
    title: "Ganar una apuesta a transversal en la ruleta",
    shortTitle: "ruleta · transversal",
    explanation: "Cubre una fila de tres números en el tapete: tres de las 37 casillas de la rueda ganan la apuesta.",
    calculation: "p = 3/37; retorno neto esperado = [(3 × 1100 €) − (34 × 100 €)] / 37 = −100 €/37 ≈ −2,70 € por cada 100 €",
    assumptions: rouletteAssumptions,
  },
  "roulette-corner": {
    title: "Ganar una apuesta a cuadro en la ruleta",
    shortTitle: "ruleta · cuadro",
    explanation: "Coloca una ficha donde se juntan cuatro números: cualquiera de esas cuatro casillas gana la apuesta a cuadro.",
    calculation: "p = 4/37; retorno neto esperado = [(4 × 800 €) − (33 × 100 €)] / 37 = −100 €/37 ≈ −2,70 € por cada 100 €",
    assumptions: rouletteAssumptions,
  },
  "roulette-six-line": {
    title: "Ganar una apuesta a seisena en la ruleta",
    shortTitle: "ruleta · seisena",
    explanation: "Cubre dos filas contiguas del tapete: seis de las 37 casillas de la rueda ganan la seisena.",
    calculation: "p = 6/37; retorno neto esperado = [(6 × 500 €) − (31 × 100 €)] / 37 = −100 €/37 ≈ −2,70 € por cada 100 €",
    assumptions: rouletteAssumptions,
  },
  "roulette-dozen-column": {
    title: "Ganar una apuesta a docena o columna en la ruleta",
    shortTitle: "ruleta · docena o columna",
    explanation: "Elige una docena o columna: 12 de las 37 casillas de la ruleta de un solo cero ganan la apuesta.",
    calculation: "p = 12/37; retorno neto esperado = [(12 × 200 €) − (25 × 100 €)] / 37 = −100 €/37 ≈ −2,70 € por cada 100 €",
    assumptions: rouletteAssumptions,
  },
  "roulette-even-money": {
    title: "Ganar una apuesta al rojo en la ruleta",
    shortTitle: "ruleta · rojo",
    explanation: "Apuesta al rojo: ganan 18 de las 37 casillas. Con la regla francesa de reparto, el cero devuelve la mitad de la apuesta.",
    calculation: "p = 18/37; retorno neto esperado = [(18 × 100 €) − (18 × 100 €) − 50 €] / 37 = −100 €/74 ≈ −1,35 € por cada 100 €",
    assumptions: rouletteAssumptions,
  },
  "roulette-two-dozens-columns": {
    title: "Ganar una apuesta a dos docenas o dos columnas en la ruleta",
    shortTitle: "ruleta · 24 casillas",
    explanation: "Reparte la apuesta entre dos docenas o dos columnas: 24 de las 37 casillas de la rueda producen una ganancia neta.",
    calculation: "p = 24/37; retorno neto esperado = [(24 × 50 €) − (13 × 100 €)] / 37 = −100 €/37 ≈ −2,70 € por cada 100 €",
    assumptions: rouletteAssumptions,
  },
  "blackjack-natural-six-deck": {
    title: "Un blackjack natural de un sabot de seis barajas",
    shortTitle: "blackjack natural · 6 barajas",
    explanation: "Aproximadamente uno de cada 21,06 repartos iniciales de dos cartas de un sabot completo de seis barajas de casino es un blackjack natural: un as y un diez, jota, reina o rey, en cualquier orden.",
    calculation: "p = 2 × (24 ases / 312 cartas) × (96 cartas con valor diez / 311 cartas restantes) ≈ 0,047489488",
    assumptions: "El sabot de 312 cartas contiene 24 ases y 96 cartas con valor diez, y se baraja uniformemente. Un natural es la mano inicial de dos cartas, por lo que se excluye un 21 obtenido después de dividir. Recibir un natural no significa ganar a la banca. Las cartas quemadas o intermedias desconocidas no cambian esta probabilidad incondicional. Conocer las cartas retiradas del sabot puede cambiarla.",
  },
} satisfies LandmarkCopyFamily;
