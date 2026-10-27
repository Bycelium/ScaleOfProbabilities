import type { LandmarkCopyFamily } from "../../types";

export const astronomyES = {
  "solar-terrestrial": {
    title: "Un planeta terrestre del Sistema Solar",
    shortTitle: "un planeta terrestre",
    explanation: "Cuatro de los ocho planetas del Sistema Solar son terrestres: Mercurio, Venus, la Tierra y Marte.",
    calculation: "p = 4 planetas terrestres / 8 planetas = 1/2",
    assumptions: "Cada uno de los ocho planetas tiene la misma probabilidad de ser elegido. Se excluyen los planetas enanos y los planetas no se ponderan por masa, tamaño ni población.",
  },
  "full-moon-15-days": {
    title: "Luna llena durante una estancia de 15 días",
    shortTitle: "Luna llena en 15 días",
    explanation: "Unas 51 de cada 100 estancias modelizadas de 15 días incluyen el instante de una Luna llena cuando sus puntos de inicio se distribuyen uniformemente por el ciclo lunar.",
    calculation: "p = 15 días / 29,530589 días ≈ 0,50795",
    assumptions: "La fase inicial es uniforme y el mes sinódico se mantiene constante en 29,530589 días. El modelo se refiere al instante astronómico de Luna llena e ignora el tiempo meteorológico, la luz diurna y el horizonte local.",
  },
  "solar-eclipse-year": {
    title: "Un año con un eclipse solar total",
    shortTitle: "año con eclipse solar total",
    explanation: "El catálogo de la NASA registra al menos un eclipse solar total en algún lugar de la Tierra en 67 de los 100 años naturales de 2001 a 2100.",
    calculation: "p = 67 años con un eclipse de tipo T / 100 años",
    assumptions: "El recuento usa años naturales distintos del catálogo de la NASA. Las entradas T y T+ cuentan como eclipses totales. Se excluyen los eclipses híbridos y no se implica visibilidad desde ningún lugar concreto.",
  },
  "red-dwarf-star": {
    title: "Una enana roja de la Vía Láctea",
    shortTitle: "una estrella enana roja",
    explanation: "La NASA estima que unas 73 de cada 100 estrellas de la Vía Láctea son enanas rojas.",
    calculation: "p ≈ 0,73",
    assumptions: "Las estrellas se muestrean de la población estimada de la Vía Láctea. La selección no se limita a las estrellas visibles a simple vista, donde el brillo cambia la composición.",
  },
  "planet-with-moon": {
    title: "Un planeta del Sistema Solar con luna",
    shortTitle: "un planeta con luna",
    explanation: "Seis de los ocho planetas del Sistema Solar tienen al menos una luna natural conocida. Mercurio y Venus son los dos que no tienen lunas.",
    calculation: "p = 6 planetas con lunas / 8 planetas = 3/4",
    assumptions: "Cada planeta tiene la misma probabilidad de ser elegido. El número de lunas que rodean cada planeta no influye en el muestreo.",
  },
  "lunar-eclipse-year": {
    title: "Un año con un eclipse lunar parcial o total",
    shortTitle: "año con eclipse lunar",
    explanation: "El catálogo de la NASA registra al menos un eclipse lunar parcial o total en algún lugar de la Tierra en 79 de los 100 años naturales de 2001 a 2100.",
    calculation: "p = 79 años que cumplen la condición / 100 años",
    assumptions: "El recuento usa años naturales distintos del catálogo de la NASA. Cuentan los tipos de eclipse parcial y total, incluidas las variantes con sufijo. Se excluyen los eclipses únicamente penumbrales y no se implica visibilidad desde ningún lugar concreto.",
  },
  "full-moon-28-days": {
    title: "Luna llena durante una estancia de 28 días",
    shortTitle: "Luna llena en 28 días",
    explanation: "Unas 95 de cada 100 estancias modelizadas de 28 días incluyen el instante de una Luna llena cuando sus puntos de inicio se distribuyen uniformemente por el ciclo lunar.",
    calculation: "p = 28 días / 29,530589 días ≈ 0,94817",
    assumptions: "La fase inicial es uniforme y el mes sinódico se mantiene constante en 29,530589 días. El modelo se refiere al instante astronómico de Luna llena e ignora el tiempo meteorológico, la luz diurna y el horizonte local.",
  },
  "sun-mass": {
    title: "La proporción de masa del Sistema Solar que contiene el Sol",
    shortTitle: "la proporción de masa del Sol",
    explanation: "La NASA estima que el Sol contiene aproximadamente el 99,85 % de la masa del Sistema Solar, es decir, 99,85 unidades de cada 100.",
    calculation: "p ≈ 0,9985",
    assumptions: "El muestreo es proporcional a la masa. No es una elección uniforme entre el Sol, los planetas, las lunas y los cuerpos menores. El porcentaje publicado está redondeado.",
  },
  "solar-eclipse-local-year": {
    title: "Un eclipse solar total donde vives durante un año",
    shortTitle: "eclipse total donde vives · año",
    explanation: "En un lugar fijo representativo, la estimación a largo plazo da en promedio un año con un eclipse solar total por cada 374 años sin uno. La NASA indica un intervalo medio de unos 375 años entre eclipses totales en un mismo lugar.",
    calculation: "p ≈ 1/375 a partir del intervalo medio de retorno a largo plazo",
    assumptions: "Esta es una aproximación anual basada en frecuencias para un lugar fijo representativo. Los intervalos y las tasas locales reales varían. Las nubes quedan fuera del suceso y la estimación no es un pronóstico para una ciudad o un año concretos.",
  },
} satisfies LandmarkCopyFamily;
