import type { LocaleCode } from "../locales/types";
import type { LandmarkId } from "./order";

export const regionalLandmarkLocales: Readonly<Partial<Record<string, readonly LocaleCode[]>>> = {
  "fr-letter-green-j3-2025": ["fr"],
  "fr-letter-green-j5-2025": ["fr"],
  "fr-colissimo-counter-j2-2025": ["fr"],
  "idf-electricity-available-2024": ["fr"],
  "fr-household-television-2025": ["fr"],
  "fr-person-smartphone-2025": ["fr"],
  "fr-person-mobile-phone-2025": ["fr"],
  "rain-brest-december": ["fr"],
  "france-loto-main-prize": ["fr"],
  "france-loto-main-loss": ["fr"],
  "france-loto-jackpot": ["fr"],
  "rain-hilo": ["en"],
  "sunshine-phoenix": ["en"],
  "us-electricity-available-2024": ["en"],
  "uk-lotto-jackpot": ["en"],
  "us-powerball-jackpot": ["en"],
  "us-mega-millions-jackpot": ["en"],
} satisfies Readonly<Partial<Record<LandmarkId, readonly LocaleCode[]>>>;
