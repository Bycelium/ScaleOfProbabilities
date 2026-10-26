import { basicsModels } from "./families/basics";
import { dice_gamesModels } from "./families/dice_games";
import { cardsModels } from "./families/cards";
import { casinoModels } from "./families/casino";
import { lotteriesModels } from "./families/lotteries";
import { securityModels } from "./families/security";
import { matterModels } from "./families/matter";
import { astronomyModels } from "./families/astronomy";
import { biology_healthModels } from "./families/biology_health";
import { weather_sportsModels } from "./families/weather_sports";
import { servicesModels } from "./families/services";
import { transportModels } from "./families/transport";
import { collectiblesModels } from "./families/collectibles";
import type { LandmarkModel } from "./types";

export const landmarkModels: readonly LandmarkModel[] = [
  ...basicsModels,
  ...dice_gamesModels,
  ...cardsModels,
  ...casinoModels,
  ...lotteriesModels,
  ...securityModels,
  ...matterModels,
  ...astronomyModels,
  ...biology_healthModels,
  ...weather_sportsModels,
  ...servicesModels,
  ...transportModels,
  ...collectiblesModels,
];
