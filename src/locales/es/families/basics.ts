import type { LandmarkCopyFamily } from "../../types";

const birthdayAssumptions = "Los cumpleaños son independientes y se distribuyen uniformemente entre 365 fechas. Se ignoran los días bisiestos.";

export const basicsES = {
  "coin-heads": {
    title: "Una cara elegida de una moneda equilibrada",
    shortTitle: "cara o cruz",
    explanation: "Uno de los dos resultados igualmente probables de la moneda coincide con la cara elegida de antemano: cara o cruz.",
    calculation: "p = 1 cara elegida / 2 caras = 1/2",
    assumptions: "La moneda tiene la misma probabilidad de caer de cara que de cruz y no cae de canto.",
  },
  "birthday-10": {
    title: "Un cumpleaños compartido en un grupo de 10",
    shortTitle: "cumpleaños compartido entre 10",
    explanation: "Unos 12 de cada 100 grupos modelizados de 10 personas contienen al menos un cumpleaños compartido. Se cuentan todas las parejas posibles.",
    calculation: "p = 1 − ∏ₖ₌₀⁹ (365 − k) / 365 ≈ 0,11694818",
    assumptions: birthdayAssumptions,
  },
  "birthday-20": {
    title: "Un cumpleaños compartido en un grupo de 20",
    shortTitle: "cumpleaños compartido entre 20",
    explanation: "Unos 41 de cada 100 grupos modelizados de 20 personas contienen al menos un cumpleaños compartido. El cálculo resta la probabilidad de que las 20 fechas sean distintas.",
    calculation: "p = 1 − ∏ₖ₌₀¹⁹ (365 − k) / 365 ≈ 0,41143838",
    assumptions: birthdayAssumptions,
  },
  "birthday-30": {
    title: "Un cumpleaños compartido en un grupo de 30",
    shortTitle: "cumpleaños compartido entre 30",
    explanation: "Unos 71 de cada 100 grupos modelizados de 30 personas contienen al menos un cumpleaños compartido. El cálculo resta la probabilidad de que las 30 fechas sean distintas.",
    calculation: "p = 1 − ∏ₖ₌₀²⁹ (365 − k) / 365 ≈ 0,70631624",
    assumptions: birthdayAssumptions,
  },
  "birthday-40": {
    title: "Un cumpleaños compartido en un grupo de 40",
    shortTitle: "cumpleaños compartido entre 40",
    explanation: "Unos 89 de cada 100 grupos modelizados de 40 personas contienen al menos un cumpleaños compartido. El cálculo resta la probabilidad de que las 40 fechas sean distintas.",
    calculation: "p = 1 − ∏ₖ₌₀³⁹ (365 − k) / 365 ≈ 0,89123181",
    assumptions: birthdayAssumptions,
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
    assumptions: birthdayAssumptions,
  },
  "birthday-60": {
    title: "Un cumpleaños compartido en un grupo de 60",
    shortTitle: "cumpleaños compartido entre 60",
    explanation: "Más de 99 de cada 100 grupos modelizados de 60 personas contienen al menos un cumpleaños compartido. El cálculo resta la pequeña probabilidad de que las 60 fechas sean distintas.",
    calculation: "p = 1 − ∏ₖ₌₀⁵⁹ (365 − k) / 365 ≈ 0,99412266",
    assumptions: birthdayAssumptions,
  },
  "lightning-year": {
    title: "Impacto de un rayo en un año (estimación de EE. UU.)",
    shortTitle: "impacto anual de un rayo en EE. UU.",
    explanation: "La estimación histórica es de aproximadamente una persona alcanzada en un año por cada 1 222 000 residentes de EE. UU. Se obtiene dividiendo el promedio anual de personas alcanzadas entre la población.",
    calculation: "p ≈ 1 / 1 222 000 a partir de los impactos anuales divididos entre la población",
    assumptions: "La estimación usa promedios de impactos de 2009–2018 y la población estadounidense de 2019. El lugar, el trabajo y el tiempo que una persona pasa al aire libre pueden cambiar mucho su riesgo.",
  },
} satisfies LandmarkCopyFamily;
