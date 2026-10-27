import type { LandmarkCopyFamily } from "../../types";

export const biology_healthES = {
  "green-pea": {
    title: "Una semilla de guisante verde",
    shortTitle: "semilla de guisante verde",
    explanation: "Una de las cuatro combinaciones igualmente probables de dos plantas portadoras de las variantes amarilla y verde produce una semilla verde. El verde es recesivo, por lo que ambos progenitores deben transmitir esa variante.",
    calculation: "p = 1 combinación verde / 4 combinaciones = 1/4",
    assumptions: "Este cruce Yy × Yy usa un modelo mendeliano simple de un solo gen. Los guisantes con otros genes parentales pueden tener probabilidades distintas.",
  },
  "yellow-pea": {
    title: "Una semilla de guisante amarillo",
    shortTitle: "semilla de guisante amarillo",
    explanation: "Tres de las cuatro combinaciones igualmente probables de dos plantas portadoras de las variantes amarilla y verde producen una semilla amarilla, porque el amarillo es dominante.",
    calculation: "p = 3 combinaciones amarillas / 4 combinaciones = 3/4",
    assumptions: "Este cruce Yy × Yy usa un modelo mendeliano simple de un solo gen. Los guisantes con otros genes parentales pueden tener probabilidades distintas.",
  },
  "double-yolk-young-hens": {
    title: "Un huevo de dos yemas de gallinas jóvenes",
    shortTitle: "un huevo de dos yemas",
    explanation: "Un estudio de producción registra unos dos huevos de dos yemas por cada 100 huevos de gallinas ponedoras comerciales jóvenes cerca del inicio de la puesta.",
    calculation: "p ≈ 0,02",
    assumptions: "La estimación se aplica a gallinas ponedoras jóvenes cerca del inicio de la producción. La edad, la genética, la alimentación, el manejo de la parvada y la clasificación de los huevos cambian la tasa, por lo que no es una probabilidad universal para los huevos de supermercado.",
  },
  "dna-nucleotide-copied-correctly": {
    title: "Un nucleótido de ADN se copia correctamente",
    shortTitle: "nucleótido de ADN copiado correctamente",
    explanation: "Una estimación habitual de biología molecular da aproximadamente un error tras la actividad correctora durante la copia y la reparación de desajustes por cada mil millones de nucleótidos copiados. Quedan unos 999 999 999 copiados correctamente.",
    calculation: "p ≈ 1 − 10⁻⁹",
    assumptions: "Esta es una estimación de orden de magnitud de un manual tras la actividad correctora durante la copia y la reparación de desajustes. La fidelidad varía entre organismos, células, condiciones y sistemas de reparación. El suceso se refiere a un nucleótido, no a un genoma entero.",
  },
  "covid-scenario-prior": {
    title: "Infección por COVID antes de una prueba rápida de antígenos",
    shortTitle: "COVID · antes de la prueba",
    explanation: "Imagina que {population} personas asintomáticas con exposición sospechada se someten a una prueba de COVID. Con la prevalencia hipotética del {prevalence} %, {infected} de ellas están infectadas antes de la prueba.",
    calculation: "p previa = 0,005; razón previa = 0,005 / 0,995",
    assumptions: "La prevalencia del 0,5 % es un dato hipotético, no una prevalencia actual medida ni una estimación del riesgo personal. Se usan la misma hipótesis de infección y la misma población para las actualizaciones de ambos resultados de la prueba.",
  },
  "covid-scenario-positive": {
    title: "Infección por COVID tras una prueba rápida de antígenos positiva",
    shortTitle: "COVID · positivo",
    explanation: "En este grupo hipotético de {population} personas con una prevalencia del {prevalence} %, cerca de {positiveTotal} obtienen un resultado positivo: {truePositive} están infectadas y {falsePositive} son falsos positivos. En este escenario, un resultado positivo corresponde a una probabilidad de infección cercana a una entre tres.",
    calculation: "p = (0,005 × 0,586) / [(0,005 × 0,586) + (0,995 × (1 − 0,994))] ≈ 0,3292",
    assumptions: "El cálculo parte de la prevalencia hipotética del 0,5 % y usa una sensibilidad combinada de 0,586 y una especificidad de 0,994 para personas asintomáticas con exposición sospechada. Estas estimaciones históricas combinan distintas pruebas y estudios hasta febrero de 2022. El rendimiento varía según el kit, el momento, la toma de la muestra y el entorno. Este cálculo no es un diagnóstico personal.",
  },
  "covid-scenario-negative": {
    title: "Infección por COVID tras una prueba rápida de antígenos negativa",
    shortTitle: "COVID · negativo",
    explanation: "En este grupo hipotético de {population} personas con una prevalencia del {prevalence} %, cerca de {negativeTotal} obtienen un resultado negativo. La prueba no detecta {falseNegative} infecciones entre ellas, cerca de una persona infectada por cada 479 resultados negativos.",
    calculation: "p = (0,005 × (1 − 0,586)) / [(0,005 × (1 − 0,586)) + (0,995 × 0,994)] ≈ 0,00209",
    assumptions: "El cálculo parte de la prevalencia hipotética del 0,5 % y usa una sensibilidad combinada de 0,586 y una especificidad de 0,994 para personas asintomáticas con exposición sospechada. Estas estimaciones históricas combinan distintas pruebas y estudios hasta febrero de 2022. El rendimiento varía según el kit, el momento, la toma de la muestra y el entorno. Este cálculo no es un diagnóstico personal.",
  },
  "human-denovo-snv": {
    title: "Una mutación de novo de una letra del ADN en una generación humana",
    shortTitle: "nueva mutación de una letra del ADN",
    explanation: "Un estudio de 283 tríos islandeses de progenitores y descendientes estimó aproximadamente una nueva variante de un solo nucleótido por cada 77,5 millones de posiciones transmitidas por generación, una tasa de 1,29 × 10⁻⁸.",
    calculation: "p ≈ 1,29 × 10⁻⁸ por posición transmitida y generación",
    assumptions: "El intervalo de confianza del 95 % es 1,27–1,30 × 10⁻⁸ tras corregir por la cobertura y por las posiciones en las que se podían detectar variantes. El promedio observado del estudio fue de unas 63 SNV de novo por persona. Las tasas varían con la edad parental y el contexto de la secuencia. Se muestrea una posición transmitida, no la probabilidad de que un niño tenga alguna mutación o enfermedad, y este modelo difiere del error de replicación celular.",
  },
  "four-leaf-clover": {
    title: "Un trébol blanco de cuatro hojas",
    shortTitle: "trébol blanco de cuatro hojas",
    explanation: "La estimación citada encuentra un trébol blanco de cuatro folíolos por cada 5076 de tres. Entre esos tréboles de tres y cuatro hojas, es uno de cada 5077.",
    calculation: "p ≈ 1 / (5076 + 1) = 1 / 5077",
    assumptions: "La comparación se limita a tréboles blancos de tres o cuatro hojas. Es una estimación aproximada de aparición, no un estudio mundial preciso. La genética, el entorno y la zona de tréboles pueden cambiar la tasa. El método, el tiempo y el lugar de búsqueda determinan la probabilidad de encontrar uno durante una búsqueda.",
  },
} satisfies LandmarkCopyFamily;
