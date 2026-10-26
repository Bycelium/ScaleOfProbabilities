import type { LandmarkId } from "../catalogue/order";
import type { SourceId } from "../catalogue/sources";
import type { LocaleCode, LocaleMetadata } from "./metadata";

export type { LocaleCode } from "./metadata";

export type LandmarkTranslation = Readonly<{
  title: string;
  shortTitle: string;
  explanation: string;
  calculation: string;
  assumptions: string;
  advice?: Readonly<{ before: string; relatedLabel: string; after: string }>;
}>;

export type LandmarkCopyFamily = Readonly<Partial<Record<LandmarkId, LandmarkTranslation>>>;
export type LandmarkTranslationRegistry = Readonly<Record<LandmarkId, LandmarkTranslation>>;
export type SourceTranslation = Readonly<{ label: string; note?: string }>;
export type SourceTranslationRegistry = Readonly<Record<SourceId, SourceTranslation>>;

export type UiTranslation = Readonly<{
  title: string;
  about: string;
  returnZero: string;
  language: string;
  scaleAria: string;
  howToUse: string;
  allReferences: string;
  allReferencesHelp: string;
  introDirectionRarer: string;
  introDirectionLikely: string;
  introNavigation: string;
  probabilityExplanation: string;
  oddsExplanation: string;
  probabilityToOdds: string;
  oddsEquationAria: string;
  probabilityDefinition: string;
  decibansExplanation: string;
  oddsToDecibans: string;
  decibansEquationAria: string;
  creditPrefix: string;
  creditTitle: string;
  creditBy: string;
  explore: string;
  closeDetails: string;
  exploreOnScale: string;
  calculation: string;
  assumptions: string;
  securityAdvice: string;
  sources: string;
  probabilityLabel: string;
  oddsLabel: string;
  oddsWord: string;
  difference: string;
  diagnostic: Readonly<{
    heading: string;
    expectedResults: string;
    infectionPresent: string;
    infectionAbsent: string;
    positiveResult: string;
    negativeResult: string;
    truePositive: string;
    falsePositive: string;
    falseNegative: string;
    trueNegative: string;
    evidence: string;
    positiveEvidence: string;
    negativeEvidence: string;
    positiveFormula: string;
    negativeFormula: string;
  }>;
  classification: Readonly<Record<"Exact model" | "Estimate" | "Historical estimate" | "Defined model", string>>;
  art: Readonly<Record<"coinSide" | "weekdayMonday" | "weekdayTuesday" | "weekdayWednesday" | "weekdayThursday" | "weekdayFriday" | "weekdayWeekend" | "sixWords" | "wordList" | "postalTwoDays" | "postalThreeDays" | "postalFiveDays", string>>;
}>;

export type LocaleDefinition = Readonly<{
  code: LocaleCode;
} & LocaleMetadata & {
  ui: UiTranslation;
  landmarks: LandmarkTranslationRegistry;
  sources: SourceTranslationRegistry;
}>;
