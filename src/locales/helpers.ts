import type { LandmarkTranslation } from "./types";

export const t = (
  title: string,
  shortTitle: string,
  explanation: string,
  calculation: string,
  assumptions: string,
  extra: Partial<LandmarkTranslation> = {},
): LandmarkTranslation => ({ title, shortTitle, explanation, calculation, assumptions, ...extra });
