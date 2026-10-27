import type { LandmarkCopyFamily } from "../../types";

const rouletteAssumptions = "Cada uno de los 37 números, incluido el cero, es igualmente probable. El cálculo sigue las reglas francesas de la ruleta inglesa. La pérdida media se calcula sobre jugadas repetidas.";

export const casinoES = {
  "roulette-straight-up": {
    title: "Ganar una apuesta plena en la ruleta",
    shortTitle: "ruleta · un número",
    explanation: "Una apuesta plena elegida cubre un número, es decir, una de las 37 casillas de una ruleta de un solo cero. Una victoria paga 3500 € netos y devuelve los 100 € apostados. En los demás casos se pierden los 100 €. Tras muchas tiradas, la pérdida media es de 2,70 € por cada apuesta de 100 €.",
    calculation: "p = 1/37; retorno neto esperado = [(1 × 3500 €) − (36 × 100 €)] / 37 = −100 €/37 ≈ −2,70 € por cada 100 €",
    assumptions: rouletteAssumptions,
  },
  "roulette-split": {
    title: "Ganar una apuesta a caballo en la ruleta",
    shortTitle: "ruleta · caballo",
    explanation: "Una apuesta a caballo elegida cubre dos números contiguos del tapete, es decir, dos de las 37 casillas de la rueda. Una victoria paga 1700 € netos y devuelve los 100 € apostados. En los demás casos se pierden los 100 €. Tras muchas tiradas, la pérdida media es de 2,70 € por cada apuesta de 100 €.",
    calculation: "p = 2/37; retorno neto esperado = [(2 × 1700 €) − (35 × 100 €)] / 37 = −100 €/37 ≈ −2,70 € por cada 100 €",
    assumptions: rouletteAssumptions,
  },
  "roulette-street": {
    title: "Ganar una apuesta a transversal en la ruleta",
    shortTitle: "ruleta · transversal",
    explanation: "Una apuesta a transversal elegida cubre los tres números de una fila del tapete, es decir, tres de las 37 casillas de la rueda. Una victoria paga 1100 € netos y devuelve los 100 € apostados. En los demás casos se pierden los 100 €. Tras muchas tiradas, la pérdida media es de 2,70 € por cada apuesta de 100 €.",
    calculation: "p = 3/37; retorno neto esperado = [(3 × 1100 €) − (34 × 100 €)] / 37 = −100 €/37 ≈ −2,70 € por cada 100 €",
    assumptions: rouletteAssumptions,
  },
  "roulette-corner": {
    title: "Ganar una apuesta a cuadro en la ruleta",
    shortTitle: "ruleta · cuadro",
    explanation: "Una apuesta a cuadro elegida cubre cuatro números que se juntan en una esquina del tapete, es decir, cuatro de las 37 casillas de la rueda. Una victoria paga 800 € netos y devuelve los 100 € apostados. En los demás casos se pierden los 100 €. Tras muchas tiradas, la pérdida media es de 2,70 € por cada apuesta de 100 €.",
    calculation: "p = 4/37; retorno neto esperado = [(4 × 800 €) − (33 × 100 €)] / 37 = −100 €/37 ≈ −2,70 € por cada 100 €",
    assumptions: rouletteAssumptions,
  },
  "roulette-six-line": {
    title: "Ganar una apuesta a seisena en la ruleta",
    shortTitle: "ruleta · seisena",
    explanation: "Una apuesta a seisena elegida cubre seis números contiguos en dos filas del tapete, es decir, seis de las 37 casillas de la rueda. Una victoria paga 500 € netos y devuelve los 100 € apostados. En los demás casos se pierden los 100 €. Tras muchas tiradas, la pérdida media es de 2,70 € por cada apuesta de 100 €.",
    calculation: "p = 6/37; retorno neto esperado = [(6 × 500 €) − (31 × 100 €)] / 37 = −100 €/37 ≈ −2,70 € por cada 100 €",
    assumptions: rouletteAssumptions,
  },
  "roulette-dozen-column": {
    title: "Ganar una apuesta a docena o columna en la ruleta",
    shortTitle: "ruleta · docena o columna",
    explanation: "Una docena o columna elegida cubre 12 de las 37 casillas de una ruleta de un solo cero. Una victoria paga 200 € netos y devuelve los 100 € apostados. En los demás casos se pierden los 100 €. Tras muchas tiradas, la pérdida media es de 2,70 € por cada apuesta de 100 €.",
    calculation: "p = 12/37; retorno neto esperado = [(12 × 200 €) − (25 × 100 €)] / 37 = −100 €/37 ≈ −2,70 € por cada 100 €",
    assumptions: rouletteAssumptions,
  },
  "roulette-even-money": {
    title: "Ganar una apuesta al rojo en la ruleta",
    shortTitle: "ruleta · rojo",
    explanation: "Una apuesta al rojo cubre 18 de las 37 casillas de una ruleta de un solo cero. Negro, impar, par, falta y pasa son opciones equivalentes con pago 1 a 1. El rojo añade 100 € netos y devuelve los 100 € apostados. El negro pierde los 100 €. El cero devuelve 50 €, una pérdida neta de 50 €. Tras muchas tiradas, la pérdida media es de 1,35 € por cada apuesta de 100 €.",
    calculation: "p = 18/37; retorno neto esperado = [(18 × 100 €) − (18 × 100 €) − 50 €] / 37 = −100 €/74 ≈ −1,35 € por cada 100 €",
    assumptions: rouletteAssumptions,
  },
  "roulette-two-dozens-columns": {
    title: "Ganar una apuesta a dos docenas o dos columnas en la ruleta",
    shortTitle: "ruleta · 24 casillas",
    explanation: "Una apuesta total de 100 €, repartida en 50 € sobre cada una de dos docenas o columnas elegidas, cubre 24 de las 37 casillas de una ruleta de un solo cero. Un número cubierto devuelve 150 €, una ganancia neta de 50 €. Los otros 13 números, incluido el cero, pierden los 100 € en total. Tras muchas tiradas, la pérdida media es de 2,70 € por cada apuesta de 100 €.",
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
