import type { LandmarkCopyFamily } from "../../types";

export const weather_sportsEN = {
  "rain-hilo": {
    title: "A day with rain in Hilo, Hawaiʻi",
    shortTitle: "rain in Hilo",
    explanation: "The 1991–2020 NOAA normal records at least 0.01 inch of precipitation on 273 days in a representative 365-day year at Hilo.",
    calculation: "p ≈ 273 precipitation days / 365 days = 0.74795",
    assumptions: "The station is Hilo International Airport, Hawaiʻi. A precipitation day records at least 0.01 inch, or 0.254 mm. A brief shower qualifies, so this does not mean rain lasts all day and it is not a forecast.",
  },
  "sunshine-phoenix": {
    title: "A daylight moment is sunny in Phoenix",
    shortTitle: "sunshine in Phoenix",
    explanation: "NOAA reports sunshine reaching the ground during 85% of possible daylight time at Phoenix from January 1965 through December 1983.",
    calculation: "p ≈ 0.85 of possible daylight sunshine",
    assumptions: "This historical station statistic measures sunshine duration as a fraction of possible daylight time. It does not mean that 85% of calendar days are entirely sunny and it is not a forecast.",
  },
  "nba-free-throw-2023-24": {
    title: "An NBA free throw is made in 2023–24",
    shortTitle: "NBA free throw made",
    explanation: "Players made 78.4 of every 100 free-throw attempts across the completed 2023–24 NBA regular season.",
    calculation: "p ≈ 0.784 league-wide free-throw percentage",
    assumptions: "Attempts are pooled across all players in the completed regular season. This samples a shot, not a player, and does not forecast a future attempt.",
  },
  "mensik-first-serve-miami-2025": {
    title: "Jakub Mensik lands a first serve in Miami 2025",
    shortTitle: "Mensik first serve in",
    explanation: "Jakub Mensik landed 68.6% of his first serves in the correct service box across six matches at the 2025 Miami Open.",
    calculation: "p ≈ 0.686 first serves in",
    assumptions: "The statistic covers Mensik’s six completed matches at the 2025 Miami Open. It measures whether the first serve lands in, not whether he wins the point, and does not forecast another match.",
  },
  "premier-league-penalty-2023-24": {
    title: "A Premier League penalty is scored in 2023–24",
    shortTitle: "Premier League penalty scored",
    explanation: "The Premier League reports that 90% of in-match penalties were converted into goals during the completed 2023–24 season.",
    calculation: "p ≈ 0.90 reported penalty conversion rate",
    assumptions: "This historical statistic covers in-match penalties in the 2023–24 Premier League. The league has no penalty shootouts. The rounded season rate does not predict a particular player’s next penalty.",
  },
  "rain-brest-december": {
    title: "Rain in Brest in December",
    shortTitle: "December rain in Brest",
    explanation: "The 1991–2020 Météo-France normal records at least 1 mm of precipitation on 17.8 of December’s 31 days at Brest-Guipavas.",
    calculation: "p ≈ 17.8 precipitation days / 31 December days = 0.57419",
    assumptions: "This is a climate-normal estimate for the Brest-Guipavas station, not all of Brittany. A day qualifies after at least 1 mm of measured precipitation, which does not imply all-day rain and is not a forecast.",
  },
} satisfies LandmarkCopyFamily;
