import { blackjackArtwork, rouletteArtwork } from "../../artwork";
import { exact, lower, lowerRatio } from "../helpers";
import type { LandmarkId } from "../order";
import type { LandmarkModel } from "../types";

const rouletteBetModel = (id: LandmarkId, winningPockets: number, color: string): LandmarkModel => ({
  id,
  chance: lowerRatio(winningPockets, 37),
  size: 88,
  art: rouletteArtwork(winningPockets, color),
  sourceIds: ["roulette-rules", "roulette-operator"],
  classification: exact,
});

export const casinoModels = [
  rouletteBetModel("roulette-straight-up", 1, "#a34f58"),
  rouletteBetModel("roulette-split", 2, "#755f91"),
  rouletteBetModel("roulette-street", 3, "#547f93"),
  rouletteBetModel("roulette-corner", 4, "#a06673"),
  rouletteBetModel("roulette-six-line", 6, "#8b6b9b"),
  rouletteBetModel("roulette-dozen-column", 12, "#597c9b"),
  rouletteBetModel("roulette-even-money", 18, "#9e4249"),
  rouletteBetModel("roulette-two-dozens-columns", 24, "#4e8b78"),
  { id: "blackjack-natural-six-deck", chance: lower(2 * (24 / 312) * (96 / 311)), size: 92, art: blackjackArtwork("#806a9b"), sourceIds: ["blackjack-rules"], classification: exact },
] satisfies readonly LandmarkModel[];
