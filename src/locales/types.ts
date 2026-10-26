export type LocaleCode = "en" | "fr";

export type LandmarkTranslation = Readonly<{
  title: string;
  shortTitle: string;
  explanation: string;
  calculation: string;
  assumptions: string;
  advice?: Readonly<{ before: string; relatedLabel: string; after: string }>;
}>;

export type UiTranslation = Readonly<{
  title: string;
  about: string;
  returnZero: string;
  language: string;
  scaleAria: string;
  howToUse: string;
  allReferences: string;
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
  nativeName: string;
  numberLocale: string;
  ui: UiTranslation;
  landmarks: Readonly<Record<string, LandmarkTranslation>>;
  sourceLabels: Readonly<Record<string, string>>;
  sourceNotes: Readonly<Record<string, string>>;
}>;
