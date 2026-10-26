import { sportArtwork, weatherArtwork } from "../../artwork";
import { lowerRatio, lower } from "../helpers";
import type { LandmarkModel } from "../types";

export const weather_sportsModels = [
  { id: "rain-hilo", chance: lowerRatio(273, 365), size: 92, art: weatherArtwork("hilo-rain", "#667b8c"), sourceIds: ["noaa-1991-2020-monthly-normals-hilo-international-airport"], classification: "Historical estimate" },
  { id: "sunshine-phoenix", chance: lower(0.85), size: 92, art: weatherArtwork("phoenix-sun", "#4c9a67"), sourceIds: ["noaa-comparative-climatic-data-percent-possible-sunshine", "noaa-comparative-climatic-data-product-definition"], classification: "Historical estimate" },
  { id: "nba-free-throw-2023-24", chance: lower(0.784), size: 92, art: sportArtwork("basketball", "#df7449"), sourceIds: ["nba-2023-24-league-scoring-averages"], classification: "Historical estimate" },
  { id: "mensik-first-serve-miami-2025", chance: lower(0.686), size: 92, art: sportArtwork("tennis", "#558c78"), sourceIds: ["atp-tour-mensik-s-miami-first-serve-performance"], classification: "Historical estimate" },
  { id: "premier-league-penalty-2023-24", chance: lower(0.90), size: 94, art: sportArtwork("football", "#4e806f"), sourceIds: ["premier-league-penalty-conversion-trends"], classification: "Historical estimate" },
  { id: "rain-brest-december", chance: lower(17.8 / 31), size: 92, art: weatherArtwork("brest-rain", "#62798a"), sourceIds: ["meteo-france-climate-normals-brest-guipavas"], classification: "Historical estimate" },
] satisfies readonly LandmarkModel[];
