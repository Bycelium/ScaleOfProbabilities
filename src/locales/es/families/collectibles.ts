import type { LandmarkCopyFamily } from "../../types";

export const collectiblesES = {
  "pokemon-destined-rivals-double-rare": {
    title: "Un sobre de Destined Rivals contiene una carta Pokémon ex Double Rare",
    shortTitle: "Pokémon · ex normal",
    explanation: "Tras abrir más de 8000 sobres de Destined Rivals, TCGplayer estimó una carta Double Rare en el 19,83 % de los sobres, aproximadamente uno de cada cinco. Las 17 cartas Double Rare son Pokémon ex de versión normal.",
    calculation: "p ≈ 0,1983 por sobre",
    assumptions: "Esta es una estimación observada por sobre con un intervalo de confianza del 95 % de ±0,84 puntos porcentuales, calculado por TCGplayer mediante una aproximación normal. Cubre cualquier carta de la rareza exacta Double Rare. El artículo no identifica el idioma ni el mercado de la impresión muestreada, por lo que la estimación puede diferir en otros idiomas o tiradas.",
  },
  "pokemon-destined-rivals-illustration-rare": {
    title: "Un sobre de Destined Rivals contiene una carta Illustration Rare",
    shortTitle: "Pokémon · carta ilustrada",
    explanation: "Tras abrir más de 8000 sobres de Destined Rivals, TCGplayer estimó una carta Illustration Rare en el 8,29 % de los sobres, aproximadamente uno de cada 12. Las 23 cartas de esta rareza son ilustraciones alternativas de carta completa de Pokémon que no son ex.",
    calculation: "p ≈ 0,0829 por sobre",
    assumptions: "Esta es una estimación observada por sobre con un intervalo de confianza del 95 % de ±0,58 puntos porcentuales, calculado por TCGplayer mediante una aproximación normal. Cubre cualquier carta de la rareza exacta Illustration Rare. El artículo no identifica el idioma ni el mercado de la impresión muestreada, por lo que no se supone que el resultado describa todos los idiomas o tiradas.",
  },
  "pokemon-destined-rivals-special-illustration-rare": {
    title: "Un sobre de Destined Rivals contiene una carta Special Illustration Rare",
    shortTitle: "Pokémon · ilustración especial",
    explanation: "Tras abrir más de 8000 sobres de Destined Rivals, TCGplayer estimó una carta Special Illustration Rare en el 1,06 % de los sobres, aproximadamente uno de cada 94. Esta rareza contiene ocho Pokémon ex con ilustración alternativa y tres cartas de Entrenador.",
    calculation: "p ≈ 0,0106 por sobre",
    assumptions: "Esta es una estimación observada por sobre con un intervalo de confianza del 95 % de ±0,22 puntos porcentuales, calculado por TCGplayer mediante una aproximación normal. Cubre cualquier carta de la rareza exacta Special Illustration Rare. El artículo no identifica el idioma ni el mercado de la impresión muestreada, por lo que no se supone que el resultado describa todos los idiomas o tiradas.",
  },
} satisfies LandmarkCopyFamily;
