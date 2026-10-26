import { eclipseArtwork, localEclipseArtwork, moonStayArtwork, redDwarfArtwork, solarSystemArtwork } from "../../artwork";
import { lowerRatio, lower, upper, oneIn, exact } from "../helpers";
import type { LandmarkModel } from "../types";

export const astronomyModels = [
  { id: "solar-terrestrial", chance: lowerRatio(4, 8), size: 92, art: solarSystemArtwork("terrestrial", "#a66d55"), sourceIds: ["nasa-planets", "nasa-terrestrial"], classification: exact },
  { id: "full-moon-15-days", chance: lower(15 / 29.530589), size: 90, art: moonStayArtwork(15, "#7488a6"), sourceIds: ["nasa-moon-period"], classification: "Defined model" },
  { id: "solar-eclipse-year", chance: lowerRatio(67, 100), size: 92, art: eclipseArtwork("solar", "#26343c"), sourceIds: ["nasa-solar-eclipse"], classification: "Defined model" },
  { id: "red-dwarf-star", chance: lower(0.73), size: 90, art: redDwarfArtwork("#cf624f"), sourceIds: ["nasa-stars-and-red-dwarfs"], classification: "Estimate" },
  { id: "planet-with-moon", chance: lowerRatio(6, 8), size: 92, art: solarSystemArtwork("moon", "#4f8da5"), sourceIds: ["nasa-planets", "nasa-moons"], classification: exact },
  { id: "lunar-eclipse-year", chance: lowerRatio(79, 100), size: 92, art: eclipseArtwork("lunar", "#a95245"), sourceIds: ["nasa-lunar-eclipse"], classification: "Defined model" },
  { id: "full-moon-28-days", chance: lower(28 / 29.530589), size: 92, art: moonStayArtwork(28, "#657aa0"), sourceIds: ["nasa-moon-period"], classification: "Defined model" },
  { id: "sun-mass", chance: upper(0.0015), size: 96, art: solarSystemArtwork("sun-mass", "#f0b83f"), sourceIds: ["nasa-basics-of-space-flight-the-solar-system"], classification: "Estimate" },
  { id: "solar-eclipse-local-year", chance: oneIn(375), size: 96, art: localEclipseArtwork("#202a31"), sourceIds: ["nasa-gsfc-total-solar-eclipses-and-local-recurrence"], classification: "Estimate" },
] satisfies readonly LandmarkModel[];
