import { blackHoleArtwork, eclipseArtwork, exoplanetArtwork, localEclipseArtwork, mainSequenceArtwork, moonStayArtwork, redDwarfArtwork, stellarCompositionArtwork, sunMassArtwork } from "../../artwork";
import { lowerRatio, lower, upper, oneIn } from "../helpers";
import type { LandmarkModel } from "../types";

export const astronomyModels = [
  { id: "earth-sized-observed-exoplanet", chance: lowerRatio(558, 4826), size: 92, art: exoplanetArtwork("terrestrial", "#a66d55"), sourceIds: ["nasa-exoplanet-archive-statistics"], classification: "Historical estimate" },
  { id: "full-moon-15-days", chance: lower(15 / 29.530589), size: 90, art: moonStayArtwork(15, "#7488a6"), sourceIds: ["nasa-moon-period"], classification: "Defined model" },
  { id: "solar-eclipse-year", chance: lowerRatio(67, 100), size: 92, art: eclipseArtwork("solar", "#26343c"), sourceIds: ["nasa-solar-eclipse"], classification: "Defined model" },
  { id: "red-dwarf-star", chance: lower(0.73), size: 90, art: redDwarfArtwork("#cf624f"), sourceIds: ["nasa-stars-and-red-dwarfs"], classification: "Estimate" },
  { id: "terrestrial-massive-moon", chance: lowerRatio(1, 12), size: 92, art: exoplanetArtwork("moon", "#4f8da5"), sourceIds: ["elser-massive-moons-2011"], classification: "Estimate" },
  { id: "lunar-eclipse-year", chance: lowerRatio(79, 100), size: 92, art: eclipseArtwork("lunar", "#a95245"), sourceIds: ["nasa-lunar-eclipse"], classification: "Defined model" },
  { id: "full-moon-28-days", chance: lower(28 / 29.530589), size: 92, art: moonStayArtwork(28, "#657aa0"), sourceIds: ["nasa-moon-period"], classification: "Defined model" },
  { id: "sun-mass", chance: upper(0.0015), size: 96, art: sunMassArtwork("#f0b83f"), sourceIds: ["nasa-basics-of-space-flight-the-solar-system"], classification: "Estimate" },
  { id: "solar-eclipse-local-year", chance: oneIn(375), size: 96, art: localEclipseArtwork("#202a31"), sourceIds: ["nasa-gsfc-total-solar-eclipses-and-local-recurrence"], classification: "Estimate" },
  { id: "stellar-hydrogen-mass", chance: lower(.70), size: 92, art: stellarCompositionArtwork("hydrogen"), sourceIds: ["nasa-stellar-composition"], classification: "Estimate" },
  { id: "stellar-helium-mass", chance: lower(.28), size: 90, art: stellarCompositionArtwork("helium"), sourceIds: ["nasa-stellar-composition"], classification: "Estimate" },
  { id: "main-sequence-star", chance: lower(.90), size: 92, art: mainSequenceArtwork(), sourceIds: ["nasa-star-types"], classification: "Estimate" },
  { id: "stellar-black-hole-baryonic-mass", chance: lower(.01), size: 94, art: blackHoleArtwork(), sourceIds: ["stellar-black-holes-sicilia-2022"], classification: "Estimate" },
] satisfies readonly LandmarkModel[];
