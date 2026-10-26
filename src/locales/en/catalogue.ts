import { basicsEN } from "./families/basics";
import { dice_gamesEN } from "./families/dice_games";
import { cardsEN } from "./families/cards";
import { casinoEN } from "./families/casino";
import { lotteriesEN } from "./families/lotteries";
import { securityEN } from "./families/security";
import { matterEN } from "./families/matter";
import { astronomyEN } from "./families/astronomy";
import { biology_healthEN } from "./families/biology_health";
import { weather_sportsEN } from "./families/weather_sports";
import { servicesEN } from "./families/services";
import { transportEN } from "./families/transport";
import { collectiblesEN } from "./families/collectibles";
import type { LandmarkTranslationRegistry } from "../types";

export const enLandmarks = {
  ...basicsEN,
  ...dice_gamesEN,
  ...cardsEN,
  ...casinoEN,
  ...lotteriesEN,
  ...securityEN,
  ...matterEN,
  ...astronomyEN,
  ...biology_healthEN,
  ...weather_sportsEN,
  ...servicesEN,
  ...transportEN,
  ...collectiblesEN,
} satisfies LandmarkTranslationRegistry;
