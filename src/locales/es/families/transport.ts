import type { LandmarkCopyFamily } from "../../types";

export const transportES = {
  "commercial-flight-no-accident-2025": {
    title: "Un vuelo comercial sin un accidente según la definición de la IATA en 2025",
    shortTitle: "vuelo comercial sin accidente · 2025",
    explanation: "El informe de 2025 registró 51 accidentes según la definición de la IATA en 38,7 millones de vuelos. Con su tasa redondeada, unos 758 000 vuelos no tuvieron uno de esos accidentes por cada vuelo que sí lo tuvo.",
    calculation: "p ≈ 1 − 1,32 / 1 000 000",
    assumptions: "El modelo muestrea un vuelo entre las operaciones cubiertas de pasajeros y carga con aviones a reacción y turbohélices comerciales. Los accidentes incluyen sucesos como golpes de cola, daños en el tren de aterrizaje y salidas de pista, además de sucesos más graves. Esta es una estimación histórica por vuelo, no un riesgo de mortalidad de pasajeros ni un pronóstico.",
  },
  "commercial-flight-accident-2025": {
    title: "Un accidente según la definición de la IATA en un vuelo comercial en 2025",
    shortTitle: "accidente de vuelo comercial · 2025",
    explanation: "El informe de 2025 registró 51 accidentes según la definición de la IATA en 38,7 millones de vuelos, aproximadamente uno de cada 758 000 vuelos con la tasa redondeada publicada.",
    calculation: "p ≈ 1,32 / 1 000 000",
    assumptions: "El modelo muestrea un vuelo entre las operaciones cubiertas de pasajeros y carga con aviones a reacción y turbohélices comerciales. Los accidentes incluyen golpes de cola, daños en el tren de aterrizaje y salidas de pista, además de sucesos más graves. Esta es una estimación histórica por vuelo, no un riesgo de mortalidad de pasajeros ni un pronóstico.",
  },
  "gb-injury-collision-20km": {
    title: "Una colisión con lesiones registrada durante un viaje en coche de 20 km",
    shortTitle: "colisión con lesiones · 20 km",
    explanation: "Con la tasa nacional de Gran Bretaña de 2025, el modelo predice aproximadamente un viaje de 20 km en el que el coche se ve implicado en una colisión con lesiones registrada por la policía por cada 166 000 viajes sin una. La tasa es de 484 implicaciones de coches por cada mil millones de millas recorridas por vehículos.",
    calculation: "λ = 484 / (1 000 000 000 × 1,609344) por km; p = 1 − e^(−λ × 20) ≈ 6,0149 × 10⁻⁶",
    assumptions: "Este modelo definido aplica una tasa de Poisson constante por distancia a un viaje en coche de 20 km. El agregado nacional excluye las colisiones con solo daños materiales y las no registradas. Describe la implicación del vehículo, no la probabilidad de que un ocupante resulte herido o muera. La distancia elegida es ilustrativa. Las condiciones de la vía, el tráfico, el conductor y el tiempo varían.",
  },
  "gb-no-injury-collision-20km": {
    title: "Ninguna colisión con lesiones registrada durante un viaje en coche de 20 km",
    shortTitle: "20 km sin colisión con lesiones",
    explanation: "Por cada viaje de 20 km en el que un coche se ve implicado en una colisión con lesiones registrada por la policía en Gran Bretaña, el modelo predice aproximadamente 166 000 viajes sin una. Usa la tasa nacional de 2025 de 484 implicaciones de coches por cada mil millones de millas recorridas por vehículos.",
    calculation: "λ = 484 / (1 000 000 000 × 1,609344) por km; p = e^(−λ × 20) ≈ 0,9999939851",
    assumptions: "Este modelo definido aplica una tasa de Poisson constante por distancia a un viaje en coche de 20 km. El agregado nacional excluye las colisiones con solo daños materiales y las no registradas. Describe la implicación del vehículo, no todos los tipos de incidente o problema mecánico. La distancia elegida es ilustrativa. Las condiciones de la vía, el tráfico, el conductor y el tiempo varían.",
  },
  "gb-injury-collision-500km": {
    title: "Una colisión con lesiones registrada durante un viaje en coche de 500 km",
    shortTitle: "colisión con lesiones · 500 km",
    explanation: "Con la tasa nacional de Gran Bretaña de 2025, el modelo predice aproximadamente un viaje de 500 km en el que el coche se ve implicado en una colisión con lesiones registrada por la policía por cada 6650 viajes sin una. La tasa es de 484 implicaciones de coches por cada mil millones de millas recorridas por vehículos.",
    calculation: "λ = 484 / (1 000 000 000 × 1,609344) por km; p = 1 − e^(−λ × 500) ≈ 1,5036 × 10⁻⁴",
    assumptions: "Este modelo definido aplica una tasa de Poisson constante por distancia a un viaje en coche de 500 km. El agregado nacional excluye las colisiones con solo daños materiales y las no registradas. Describe la implicación del vehículo, no la probabilidad de que un ocupante resulte herido o muera. La distancia elegida es ilustrativa. Las condiciones de los viajes largos pueden diferir de la media nacional.",
  },
  "gb-no-injury-collision-500km": {
    title: "Ninguna colisión con lesiones registrada durante un viaje en coche de 500 km",
    shortTitle: "500 km sin colisión con lesiones",
    explanation: "Por cada viaje de 500 km en el que un coche se ve implicado en una colisión con lesiones registrada por la policía en Gran Bretaña, el modelo predice aproximadamente 6650 viajes sin una. Usa la tasa nacional de 2025 de 484 implicaciones de coches por cada mil millones de millas recorridas por vehículos.",
    calculation: "λ = 484 / (1 000 000 000 × 1,609344) por km; p = e^(−λ × 500) ≈ 0,9998496395",
    assumptions: "Este modelo definido aplica una tasa de Poisson constante por distancia a un viaje en coche de 500 km. El agregado nacional excluye las colisiones con solo daños materiales y las no registradas. Describe la implicación del vehículo, no todos los tipos de incidente o problema mecánico. La distancia elegida es ilustrativa. Las condiciones de los viajes largos pueden diferir de la media nacional.",
  },
  "uk-recent-car-breakdown-2021": {
    title: "Una avería o un fallo de arranque en un año para un coche reciente",
    shortTitle: "avería en un año · coche reciente",
    explanation: "En la encuesta de coches de Which? de 2021 en el Reino Unido, el 4,9 % de los coches de hasta cuatro años tuvo al menos una avería o un fallo de arranque durante los 12 meses anteriores, cerca de uno de cada 20 coches de ese grupo de edad.",
    calculation: "p ≈ 0,049 con al menos una avería o un fallo de arranque",
    assumptions: "Este resultado retrospectivo cubre coches del Reino Unido de 0–4 años en 2021. La encuesta completa incluyó a 48 034 participantes que informaron sobre 56 853 coches. El artículo publicado no da el tamaño de muestra separado del grupo de edad. El resultado anual no es una tasa por viaje y no describe todas las edades de los coches ni la fiabilidad actual.",
  },
  "uk-recent-car-no-breakdown-2021": {
    title: "Un año sin avería ni fallo de arranque para un coche reciente",
    shortTitle: "un año sin avería · coche reciente",
    explanation: "En la encuesta de coches de Which? de 2021 en el Reino Unido, el 95,1 % de los coches de hasta cuatro años no tuvo ninguna avería ni fallo de arranque durante los 12 meses anteriores, cerca de 19 sin uno por cada coche que sí lo tuvo.",
    calculation: "p ≈ 1 − 0,049 = 0,951 sin avería ni fallo de arranque",
    assumptions: "Este resultado retrospectivo cubre coches del Reino Unido de 0–4 años en 2021. La encuesta completa incluyó a 48 034 participantes que informaron sobre 56 853 coches. El artículo publicado no da el tamaño de muestra separado del grupo de edad. El resultado anual no es una tasa por viaje y no describe todas las edades de los coches ni la fiabilidad actual.",
  },
} satisfies LandmarkCopyFamily;
