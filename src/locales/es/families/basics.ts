import type { LandmarkCopyFamily } from "../../types";

export const basicsES = {
  "coin-heads": {
    title: "Una cara elegida de una moneda equilibrada",
    shortTitle: "cara o cruz",
    explanation: "Uno de los dos resultados igualmente probables de la moneda coincide con la cara elegida de antemano: cara o cruz.",
    calculation: "p = 1 cara elegida / 2 caras = 1/2",
    assumptions: "La moneda tiene la misma probabilidad de caer de cara que de cruz y no cae de canto.",
  },
  "birthday-23": {
    title: "Un cumpleaños compartido en un grupo de 23",
    shortTitle: "un cumpleaños compartido",
    explanation: "Es ligeramente más probable que un grupo modelizado de 23 personas contenga un cumpleaños compartido que 23 cumpleaños distintos. Se cuentan todas las parejas posibles, no solo las personas que cumplen años el mismo día que tú.",
    calculation: "p = 1 − ∏ₖ₌₀²² (365 − k) / 365",
    assumptions: "Los cumpleaños son independientes y se distribuyen uniformemente entre 365 fechas. Se ignoran los días bisiestos.",
  },
  "month-31-days": {
    title: "Un mes elegido tiene 31 días",
    shortTitle: "mes de 31 días",
    explanation: "Siete de los doce meses tienen 31 días. Cuatro tienen 30 días y febrero tiene 28 o 29.",
    calculation: "p = 7 meses / 12 meses = 7/12",
    assumptions: "Cada uno de los doce meses tiene la misma probabilidad de ser elegido. Los años bisiestos no cambian qué meses tienen 31 días.",
  },
  weekday: {
    title: "Un día elegido es de lunes a viernes",
    shortTitle: "lunes–viernes",
    explanation: "Cinco de los siete días van de lunes a viernes. Los otros dos son sábado y domingo.",
    calculation: "p = 5 días / 7 días = 5/7",
    assumptions: "Esta es una categoría uniforme del calendario. No se modeliza ningún horario laboral ni personal.",
  },
  "ocean-point": {
    title: "Un punto al azar cae en el océano",
    shortTitle: "un punto del océano",
    explanation: "Unos 71 de cada 100 puntos elegidos uniformemente sobre la Tierra caen en agua oceánica, de acuerdo con la proporción estimada de la superficie terrestre cubierta por océanos.",
    calculation: "p ≈ 0,71 a partir del área superficial cubierta por océanos indicada",
    assumptions: "Se usa como estimación de superficie el 71 % indicado de cobertura oceánica.",
  },
  "annual-flood": {
    title: "Superar un umbral anual de inundación del 1 %",
    shortTitle: "inundación anual del 1 %",
    explanation: "En el lugar definido, el modelo prevé una superación del umbral por cada 99 años sin superación, en promedio. Una probabilidad anual del 1 % no garantiza una inundación cada 100 años.",
    calculation: "p = 0,01 para el lugar, el umbral y el año definidos",
    assumptions: "El umbral corresponde a un lugar concreto. Las viviendas y cursos de agua de otros lugares tienen riesgos distintos.",
  },
  "birthday-50": {
    title: "Un cumpleaños compartido en un grupo de 50",
    shortTitle: "cumpleaños compartido entre 50",
    explanation: "Unos 97 de cada 100 grupos modelizados de 50 personas contienen al menos un cumpleaños compartido. El cálculo resta la probabilidad de que las 50 fechas sean distintas.",
    calculation: "p = 1 − ∏ₖ₌₀⁴⁹ (365 − k) / 365 ≈ 0,97037358",
    assumptions: "Los cumpleaños son independientes y se distribuyen uniformemente entre 365 fechas. Se ignoran los días bisiestos.",
  },
  "birthday-70": {
    title: "Un cumpleaños compartido en un grupo de 70",
    shortTitle: "cumpleaños compartido entre 70",
    explanation: "Unos 1189 grupos modelizados de 70 personas contienen un cumpleaños compartido por cada grupo con 70 cumpleaños distintos. El cálculo resta la pequeña probabilidad de que todas las fechas sean diferentes.",
    calculation: "p ≈ 0,999159576 a partir de 1 menos la probabilidad de que los 70 cumpleaños sean distintos",
    assumptions: "Los cumpleaños son independientes y se distribuyen uniformemente entre 365 fechas. Se ignoran los días bisiestos.",
  },
  "birthday-79": {
    title: "Un cumpleaños compartido en un grupo de 79",
    shortTitle: "cumpleaños compartido entre 79",
    explanation: "Unos 9146 grupos modelizados de 79 personas contienen un cumpleaños compartido por cada grupo con 79 cumpleaños distintos. El cálculo resta la diminuta probabilidad de que todas las fechas sean diferentes.",
    calculation: "p ≈ 0,999890668 a partir de 1 menos la probabilidad de que los 79 cumpleaños sean distintos",
    assumptions: "Los cumpleaños son independientes y se distribuyen uniformemente entre 365 fechas. Se ignoran los días bisiestos.",
  },
  "lightning-year": {
    title: "Impacto de un rayo en un año (estimación de EE. UU.)",
    shortTitle: "impacto anual de un rayo en EE. UU.",
    explanation: "La estimación histórica es de aproximadamente una persona alcanzada en un año por cada 1 222 000 residentes de EE. UU. Se obtiene dividiendo el promedio anual de personas alcanzadas entre la población.",
    calculation: "p ≈ 1 / 1 222 000 a partir de los impactos anuales divididos entre la población",
    assumptions: "La estimación usa promedios de impactos de 2009–2018 y la población estadounidense de 2019. El lugar, el trabajo y el tiempo que una persona pasa al aire libre pueden cambiar mucho su riesgo.",
  },
} satisfies LandmarkCopyFamily;
