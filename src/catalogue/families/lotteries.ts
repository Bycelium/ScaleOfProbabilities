import { lotteryArtwork } from "../../artwork";
import { lowerRatio, upperRatio, oneIn, exact } from "../helpers";
import type { LandmarkModel } from "../types";

export const lotteriesModels = [
  { id: "euromillions-main-prize", chance: lowerRatio(10778691, 139838160), size: 84, art: lotteryArtwork("euromillions", "prize", "#4b789a", "#e7f2e9"), sourceIds: ["loterias-y-apuestas-how-to-play-euromillions", "fdj-euromillions-statistics"], classification: exact },
  { id: "france-loto-main-prize", chance: lowerRatio(3185973, 19068840), size: 84, art: lotteryArtwork("france", "prize", "#527b9f", "#f3efe2"), sourceIds: ["fdj-loto-rules"], classification: exact },
  { id: "france-loto-main-loss", chance: upperRatio(3185973, 19068840), size: 84, art: lotteryArtwork("france", "loss", "#527b9f", "#f3efe2"), sourceIds: ["fdj-loto-rules"], classification: exact },
  { id: "euromillions-main-loss", chance: upperRatio(10778691, 139838160), size: 84, art: lotteryArtwork("euromillions", "loss", "#4b789a", "#e7f2e9"), sourceIds: ["loterias-y-apuestas-how-to-play-euromillions", "fdj-euromillions-statistics"], classification: exact },
  { id: "france-loto-jackpot", chance: oneIn(19068840), size: 84, art: lotteryArtwork("france", "jackpot", "#527b9f", "#f3efe2"), sourceIds: ["fdj-loto-rules"], classification: exact },
  { id: "uk-lotto-jackpot", chance: lowerRatio(90114947, 2030175963260676), size: 84, art: lotteryArtwork("united-kingdom", "jackpot", "#6c6cb0", "#f2edff"), sourceIds: ["allwyn-two-uk-lotto-rounds", "national-lottery-lotto-winner-story"], classification: exact },
  { id: "euromillions-jackpot", chance: oneIn(139838160), size: 84, art: lotteryArtwork("euromillions", "jackpot", "#4b789a", "#e7f2e9"), sourceIds: ["loterias-y-apuestas-how-to-play-euromillions", "fdj-euromillions-statistics"], classification: exact },
  { id: "us-powerball-jackpot", chance: oneIn(292201338), size: 84, art: lotteryArtwork("united-states", "jackpot", "#db6a58", "#fff3d5"), sourceIds: ["powerball-prize-chart"], classification: exact },
  { id: "us-mega-millions-jackpot", chance: oneIn(290472336), size: 84, art: lotteryArtwork("united-states", "jackpot", "#c95e65", "#fff1d5"), sourceIds: ["virginia-lottery-mega-millions"], classification: exact },
] satisfies readonly LandmarkModel[];
