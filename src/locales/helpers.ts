import { catalogueOrder, type LandmarkId } from "../catalogue/order";
import type { LandmarkCopyFamily, LandmarkTranslation, LandmarkTranslationRegistry } from "./types";

export const assembleLandmarkTranslations = (
  families: readonly LandmarkCopyFamily[],
): LandmarkTranslationRegistry => {
  const translations: Partial<Record<LandmarkId, LandmarkTranslation>> = {};
  for (const family of families) {
    for (const [id, translation] of Object.entries(family) as [LandmarkId, LandmarkTranslation][]) {
      if (Object.hasOwn(translations, id)) throw new Error(`Duplicate landmark translation: ${id}`);
      translations[id] = translation;
    }
  }

  const missing = catalogueOrder.filter(id => !Object.hasOwn(translations, id));
  if (missing.length > 0) throw new Error(`Missing landmark translations: ${missing.join(", ")}`);
  return translations as LandmarkTranslationRegistry;
};
