import type { DisplayLandmark, Landmark, Source } from "../catalogue";
import { en } from "./en";
import { fr } from "./fr";
import { fillTemplate } from "./helpers";
import type { LocaleCode, LocaleDefinition } from "./types";

export type { LocaleCode, LocaleDefinition } from "./types";

export const locales: Readonly<Record<LocaleCode, LocaleDefinition>> = { en, fr };
export const localeChoices = Object.values(locales);

const matchingLocale = (preference: string | null): LocaleDefinition | undefined => {
  const code = preference?.toLowerCase().split("-")[0] as LocaleCode | undefined;
  return code && Object.hasOwn(locales, code) ? locales[code] : undefined;
};

export const resolveInitialLocale = (): LocaleDefinition => {
  try {
    const saved = matchingLocale(localStorage.getItem("probability-scale-locale"));
    if (saved) return saved;
  } catch {
    // Browser language remains a safe fallback when local storage is unavailable.
  }
  const preferences = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const preference of preferences) {
    const preferred = matchingLocale(preference);
    if (preferred) return preferred;
  }
  return en;
};

export const saveLocale = (locale: LocaleDefinition): void => {
  try {
    localStorage.setItem("probability-scale-locale", locale.code);
  } catch {
    // The selected language still applies for the current page.
  }
};

export const localizeLandmark = <T extends Landmark | DisplayLandmark>(item: T, locale: LocaleDefinition): T => {
  const translated = locale.landmarks[item.id];
  const local = { ...item, ...translated };
  const sources = item.sources.map((source): Source => ({
    ...source,
    ...locale.sources[source.id],
  }));
  const advice = item.advice && translated.advice ? { ...item.advice, ...translated.advice } : item.advice;
  let explanation = local.explanation;
  if (item.diagnostic?.kind === "binary-test") {
    const model = item.diagnostic.model;
    const values: Readonly<Record<string, number>> = {
      population: model.population,
      prevalence: model.prevalence * 100,
      infected: model.infected,
      positiveTotal: model.positiveTotal,
      negativeTotal: model.negativeTotal,
      truePositive: model.truePositive,
      falsePositive: model.falsePositive,
      falseNegative: model.falseNegative,
    };
    const localizedValues = Object.fromEntries(Object.entries(values).map(([key, value]) => [
      key,
      value.toLocaleString(locale.numberLocale, { maximumFractionDigits: 1 }),
    ]));
    explanation = fillTemplate(explanation, localizedValues);
  }
  return { ...local, sources, advice, explanation };
};

export const translateArtwork = (container: ParentNode, locale: LocaleDefinition): void => {
  for (const node of container.querySelectorAll<HTMLElement>("[data-art-text]")) {
    const key = node.dataset.artText as keyof LocaleDefinition["ui"]["art"];
    node.textContent = locale.ui.art[key];
  }
};
