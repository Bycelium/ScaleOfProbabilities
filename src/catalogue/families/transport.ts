import { carArtwork, flightArtwork } from "../../artwork";
import { lower, upper } from "../helpers";
import type { LandmarkModel } from "../types";
const gbCarInjuryCollisionRatePerKm = 484 / (1_000_000_000 * 1.609344);
const injuryCollisionOver = (kilometres: number): number => -Math.expm1(-gbCarInjuryCollisionRatePerKm * kilometres);
const gbCarInjuryCollision20Km = injuryCollisionOver(20);
const gbCarInjuryCollision500Km = injuryCollisionOver(500);

export const transportModels = [
  { id: "commercial-flight-no-accident-2025", chance: upper(1.32 / 1_000_000), size: 98, art: flightArtwork("safe", "#548da4"), sourceIds: ["iata-safety"], classification: "Historical estimate" },
  { id: "commercial-flight-accident-2025", chance: lower(1.32 / 1_000_000), size: 98, art: flightArtwork("accident", "#637f91"), sourceIds: ["iata-safety"], classification: "Historical estimate" },
  { id: "gb-injury-collision-20km", chance: lower(gbCarInjuryCollision20Km), size: 96, art: carArtwork("collision", "#53798d"), sourceIds: ["gb-road-casualties"], classification: "Defined model" },
  { id: "gb-no-injury-collision-20km", chance: upper(gbCarInjuryCollision20Km), size: 96, art: carArtwork("road-safe", "#4f8b7b"), sourceIds: ["gb-road-casualties"], classification: "Defined model" },
  { id: "gb-injury-collision-500km", chance: lower(gbCarInjuryCollision500Km), size: 96, art: carArtwork("collision", "#657789"), sourceIds: ["gb-road-casualties"], classification: "Defined model" },
  { id: "gb-no-injury-collision-500km", chance: upper(gbCarInjuryCollision500Km), size: 96, art: carArtwork("road-safe", "#4f8277"), sourceIds: ["gb-road-casualties"], classification: "Defined model" },
  { id: "uk-recent-car-breakdown-2021", chance: lower(0.049), size: 96, art: carArtwork("breakdown", "#806d5b"), sourceIds: ["which-car-reliability"], classification: "Historical estimate" },
  { id: "uk-recent-car-no-breakdown-2021", chance: upper(0.049), size: 96, art: carArtwork("no-breakdown", "#4f8878"), sourceIds: ["which-car-reliability"], classification: "Historical estimate" },
] satisfies readonly LandmarkModel[];
