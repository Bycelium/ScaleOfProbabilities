import { basicsES } from "./families/basics";
import { dice_gamesES } from "./families/dice_games";
import { cardsES } from "./families/cards";
import { casinoES } from "./families/casino";
import { lotteriesES } from "./families/lotteries";
import { securityES } from "./families/security";
import { matterES } from "./families/matter";
import { astronomyES } from "./families/astronomy";
import { biology_healthES } from "./families/biology_health";
import { weather_sportsES } from "./families/weather_sports";
import { servicesES } from "./families/services";
import { transportES } from "./families/transport";
import { collectiblesES } from "./families/collectibles";
import { assembleLandmarkTranslations } from "../helpers";

export const esLandmarks = assembleLandmarkTranslations([
  basicsES,
  dice_gamesES,
  cardsES,
  casinoES,
  lotteriesES,
  securityES,
  matterES,
  astronomyES,
  biology_healthES,
  weather_sportsES,
  servicesES,
  transportES,
  collectiblesES,
]);
