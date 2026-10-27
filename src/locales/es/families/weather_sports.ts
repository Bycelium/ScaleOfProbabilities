import type { LandmarkCopyFamily } from "../../types";

export const weather_sportsES = {
  "rain-hilo": {
    title: "Un día con lluvia en Hilo, Hawái",
    shortTitle: "lluvia en Hilo",
    explanation: "La normal de la NOAA de 1991–2020 registra al menos 0,01 pulgadas de precipitación durante 273 días de un año representativo de 365 días en Hilo.",
    calculation: "p ≈ 273 días de precipitación / 365 días = 0,74795",
    assumptions: "La estación es el Aeropuerto Internacional de Hilo, Hawái. Un día de precipitación registra al menos 0,01 pulgadas, es decir, 0,254 mm. Un chubasco breve cumple el criterio; esto no significa que llueva todo el día y no es un pronóstico.",
  },
  "sunshine-phoenix": {
    title: "Un momento diurno es soleado en Phoenix",
    shortTitle: "sol en Phoenix",
    explanation: "La NOAA indica que el sol llegó al suelo durante el 85 % del tiempo diurno posible en Phoenix entre enero de 1965 y diciembre de 1983.",
    calculation: "p ≈ 0,85 del tiempo de sol diurno posible",
    assumptions: "Esta estadística histórica de la estación mide la duración de la insolación como fracción del tiempo diurno posible. No significa que el 85 % de los días naturales sean completamente soleados y no es un pronóstico.",
  },
  "nba-free-throw-2023-24": {
    title: "Un tiro libre de la NBA entra en 2023–24",
    shortTitle: "tiro libre de la NBA anotado",
    explanation: "Los jugadores anotaron 78,4 de cada 100 intentos de tiro libre durante la temporada regular completa de la NBA 2023–24.",
    calculation: "p ≈ 0,784 de porcentaje de tiros libres de toda la liga",
    assumptions: "Los intentos se agrupan entre todos los jugadores de la temporada regular completa. Se muestrea un tiro, no un jugador, y no se predice un intento futuro.",
  },
  "mensik-first-serve-miami-2025": {
    title: "Jakub Mensik acierta un primer servicio en Miami 2025",
    shortTitle: "primer servicio de Mensik dentro",
    explanation: "Jakub Mensik colocó el 68,6 % de sus primeros servicios en el cuadro de saque correcto durante seis partidos del Miami Open de 2025.",
    calculation: "p ≈ 0,686 primeros servicios dentro",
    assumptions: "La estadística cubre los seis partidos completos de Mensik en el Miami Open de 2025. Mide si el primer servicio entra, no si gana el punto, y no predice otro partido.",
  },
  "premier-league-penalty-2023-24": {
    title: "Un penalti de la Premier League se marca en 2023–24",
    shortTitle: "penalti de la Premier League marcado",
    explanation: "La Premier League indica que el 90 % de los penaltis durante partidos se convirtieron en gol en la temporada completa 2023–24.",
    calculation: "p ≈ 0,90 de tasa de conversión de penaltis indicada",
    assumptions: "Esta estadística histórica cubre los penaltis durante los partidos de la Premier League 2023–24. La liga no tiene tandas de penaltis. La tasa redondeada de la temporada no predice el próximo penalti de un jugador concreto.",
  },
  "rain-brest-december": {
    title: "Lluvia en Brest en diciembre",
    shortTitle: "lluvia en diciembre en Brest",
    explanation: "La normal de Météo-France de 1991–2020 registra al menos 1 mm de precipitación en 17,8 de los 31 días de diciembre en Brest-Guipavas.",
    calculation: "p ≈ 17,8 días de precipitación / 31 días de diciembre = 0,57419",
    assumptions: "Esta es una estimación de la normal climática para la estación de Brest-Guipavas, no para toda Bretaña. Un día cumple el criterio tras al menos 1 mm de precipitación medida; esto no implica lluvia durante todo el día y no es un pronóstico.",
  },
} satisfies LandmarkCopyFamily;
