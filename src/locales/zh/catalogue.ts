import { basicsZH } from "./families/basics";
import { dice_gamesZH } from "./families/dice_games";
import { cardsZH } from "./families/cards";
import { casinoZH } from "./families/casino";
import { lotteriesZH } from "./families/lotteries";
import { securityZH } from "./families/security";
import { matterZH } from "./families/matter";
import { astronomyZH } from "./families/astronomy";
import { biology_healthZH } from "./families/biology_health";
import { weather_sportsZH } from "./families/weather_sports";
import { servicesZH } from "./families/services";
import { transportZH } from "./families/transport";
import { collectiblesZH } from "./families/collectibles";
import { assembleLandmarkTranslations } from "../helpers";

export const zhLandmarks = assembleLandmarkTranslations([
  basicsZH,
  dice_gamesZH,
  cardsZH,
  casinoZH,
  lotteriesZH,
  securityZH,
  matterZH,
  astronomyZH,
  biology_healthZH,
  weather_sportsZH,
  servicesZH,
  transportZH,
  collectiblesZH,
]);
