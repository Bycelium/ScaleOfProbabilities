import { pokemonCardArtwork } from "../../artwork";
import { lower } from "../helpers";
import type { LandmarkModel } from "../types";

export const collectiblesModels = [
  { id: "pokemon-destined-rivals-double-rare", chance: lower(0.1983), size: 92, art: pokemonCardArtwork("double"), sourceIds: ["pokemon-pull-rate"], classification: "Historical estimate" },
  { id: "pokemon-destined-rivals-illustration-rare", chance: lower(0.0829), size: 92, art: pokemonCardArtwork("illustration"), sourceIds: ["pokemon-pull-rate"], classification: "Historical estimate" },
  { id: "pokemon-destined-rivals-special-illustration-rare", chance: lower(0.0106), size: 92, art: pokemonCardArtwork("special"), sourceIds: ["pokemon-pull-rate"], classification: "Historical estimate" },
] satisfies readonly LandmarkModel[];
