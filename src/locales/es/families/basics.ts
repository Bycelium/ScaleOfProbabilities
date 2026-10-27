import type { LandmarkCopyFamily } from "../../types";

const birthdayAssumptions = "Los cumpleaños son independientes y se distribuyen uniformemente entre 365 fechas. Se ignoran los días bisiestos.";

export const basicsES = {
  "coin-heads": {
    title: "Una cara elegida de una moneda equilibrada",
    shortTitle: "cara o cruz",
    explanation: "Elige cara o cruz antes de que caiga una moneda equilibrada: el lado elegido gana la mitad de las veces.",
    calculation: "p = 1 cara elegida / 2 caras = 1/2",
    assumptions: "La moneda tiene la misma probabilidad de caer de cara que de cruz y no cae de canto.",
  },
  "birthday-10": {
    title: "Un cumpleaños compartido en un grupo de 10",
    shortTitle: "cumpleaños compartido entre 10",
    explanation: "Incluso alrededor de una mesa con solo 10 personas, unos 12 de cada 100 grupos modelizados contienen un cumpleaños compartido.",
    calculation: "p = 1 − ∏ₖ₌₀⁹ (365 − k) / 365 ≈ 0,11694818",
    assumptions: birthdayAssumptions,
  },
  "birthday-20": {
    title: "Un cumpleaños compartido en un grupo de 20",
    shortTitle: "cumpleaños compartido entre 20",
    explanation: "Reúne a 20 personas y unos 41 de cada 100 grupos modelizados contienen un cumpleaños compartido.",
    calculation: "p = 1 − ∏ₖ₌₀¹⁹ (365 − k) / 365 ≈ 0,41143838",
    assumptions: birthdayAssumptions,
  },
  "birthday-30": {
    title: "Un cumpleaños compartido en un grupo de 30",
    shortTitle: "cumpleaños compartido entre 30",
    explanation: "En una sala con 30 personas, un cumpleaños compartido ya es más probable que su ausencia: aparece en unos 71 de cada 100 grupos modelizados.",
    calculation: "p = 1 − ∏ₖ₌₀²⁹ (365 − k) / 365 ≈ 0,70631624",
    assumptions: birthdayAssumptions,
  },
  "birthday-40": {
    title: "Un cumpleaños compartido en un grupo de 40",
    shortTitle: "cumpleaños compartido entre 40",
    explanation: "Con 40 personas en la sala, unos 89 de cada 100 grupos modelizados contienen un cumpleaños compartido.",
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
    explanation: "Deja caer un alfiler imaginario uniformemente sobre la Tierra: unas 71 veces de cada 100 aterriza en el océano.",
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
    explanation: "Reúne a 50 personas y solo unos tres grupos modelizados de cada 100 evitan un cumpleaños compartido.",
    calculation: "p = 1 − ∏ₖ₌₀⁴⁹ (365 − k) / 365 ≈ 0,97037358",
    assumptions: birthdayAssumptions,
  },
  "birthday-60": {
    title: "Un cumpleaños compartido en un grupo de 60",
    shortTitle: "cumpleaños compartido entre 60",
    explanation: "Entre 60 personas, más de 99 de cada 100 grupos modelizados contienen un cumpleaños compartido.",
    calculation: "p = 1 − ∏ₖ₌₀⁵⁹ (365 − k) / 365 ≈ 0,99412266",
    assumptions: birthdayAssumptions,
  },
  "lightning-year": {
    title: "Impacto de un rayo en un año (estimación de EE. UU.)",
    shortTitle: "impacto anual de un rayo en EE. UU.",
    explanation: "Según la estimación histórica de EE. UU., aproximadamente una persona por cada 1 222 000 residentes recibe el impacto de un rayo durante un año.",
    calculation: "p ≈ 1 / 1 222 000 a partir de los impactos anuales divididos entre la población",
    assumptions: "La estimación usa promedios de impactos de 2009–2018 y la población estadounidense de 2019. El lugar, el trabajo y el tiempo que una persona pasa al aire libre pueden cambiar mucho su riesgo.",
  },
} satisfies LandmarkCopyFamily;
