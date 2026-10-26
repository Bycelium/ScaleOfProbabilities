import { basicsFR } from "./families/basics";
import { dice_gamesFR } from "./families/dice_games";
import { cardsFR } from "./families/cards";
import { casinoFR } from "./families/casino";
import { lotteriesFR } from "./families/lotteries";
import { securityFR } from "./families/security";
import { matterFR } from "./families/matter";
import { astronomyFR } from "./families/astronomy";
import { biology_healthFR } from "./families/biology_health";
import { weather_sportsFR } from "./families/weather_sports";
import { servicesFR } from "./families/services";
import { transportFR } from "./families/transport";
import { collectiblesFR } from "./families/collectibles";
import { assembleLandmarkTranslations } from "../helpers";

export const frLandmarks = assembleLandmarkTranslations([
  basicsFR,
  dice_gamesFR,
  cardsFR,
  casinoFR,
  lotteriesFR,
  securityFR,
  matterFR,
  astronomyFR,
  biology_healthFR,
  weather_sportsFR,
  servicesFR,
  transportFR,
  collectiblesFR,
]);
