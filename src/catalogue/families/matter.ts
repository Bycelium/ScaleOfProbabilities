import { artwork, atomArtwork, glacierArtwork, moleculeArtwork } from "../../artwork";
import { lower, upper, oneIn } from "../helpers";
import type { LandmarkModel } from "../types";

export const matterModels = [
  { id: "nitrogen-molecule", chance: upper(0.2192), size: 89, art: moleculeArtwork("N₂", "#5c82c4", "#89ace4"), sourceIds: ["nasa-earth-fact-sheet"], classification: "Estimate" },
  { id: "oxygen-molecule", chance: lower(0.2095), size: 84, art: moleculeArtwork("O₂", "#64a6a1", "#9ed6c8"), sourceIds: ["nasa-earth-fact-sheet"], classification: "Estimate" },
  { id: "argon-atom", chance: lower(0.00934), size: 79, art: atomArtwork("Ar", "#a072bb", "#d9abe9"), sourceIds: ["nasa-earth-fact-sheet"], classification: "Estimate" },
  { id: "carbon-dioxide-molecule", chance: lower(0.000420), size: 82, art: moleculeArtwork("CO₂", "#808f83", "#c0d0c2", 3), sourceIds: ["nasa-earth-fact-sheet"], classification: "Estimate" },
  { id: "carbon-12", chance: upper(0.0107), size: 89, art: atomArtwork("C", "#6e9aa6", "#c7e2df"), sourceIds: ["nist-isotopic-composition-carbon"], classification: "Estimate" },
  { id: "oxygen-16", chance: upper(0.00243), size: 91, art: atomArtwork("O", "#4e92ad", "#b9e4e8"), sourceIds: ["nist-isotopic-composition-oxygen"], classification: "Estimate" },
  { id: "beach-grain", chance: oneIn(2.1220659078919385e15), size: 88, art: artwork("beach", "#dca95a", "#ffe0a0"), sourceIds: ["geometric-example-model"], classification: "Defined model" },
  { id: "sahara-grain", chance: oneIn(7.97896781367369e23), size: 96, art: artwork("dune", "#d98a3e", "#ffe0a0"), sourceIds: ["nasa-earth-matters-sahara-area", "utah-geological-survey-dune-fraction"], classification: "Defined model" },
  { id: "radon-222-decay", chance: upper(1.2169612008468613e-29), size: 90, art: atomArtwork("Rn", "#a174b5", "#e1bde5"), sourceIds: ["us-epa-radionuclide-basics-radon"], classification: "Defined model" },
  { id: "carbon-14-decay", chance: upper(2.9122197472011283e-53), size: 92, art: atomArtwork("¹⁴C", "#527d76", "#b8ded2"), sourceIds: ["ciaaw-carbon-isotopic-data"], classification: "Defined model" },
  { id: "needle-haystack", chance: lower(9.39504e-9), size: 94, art: artwork("needle-hay", "#c99742", "#f3d889"), sourceIds: ["john-james-needle-guide-sharps-size-7", "new-holland-roll-bar-125"], classification: "Defined model" },
  { id: "frozen-freshwater", chance: lower(0.687), size: 92, art: glacierArtwork("#78b7c8"), sourceIds: ["usgs-water-science-school-ice-snow-glaciers-and-the-water-cycle"], classification: "Estimate" },
] satisfies readonly LandmarkModel[];
