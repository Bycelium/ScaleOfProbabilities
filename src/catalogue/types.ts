import type { Chance } from "../probability";
import type { LandmarkId } from "./order";
import type { SourceId } from "./sources";

export type BinaryTestModel = Readonly<{
  population: number;
  prevalence: number;
  sensitivity: number;
  specificity: number;
  infected: number;
  uninfected: number;
  truePositive: number;
  falsePositive: number;
  falseNegative: number;
  trueNegative: number;
  positiveTotal: number;
  negativeTotal: number;
  positiveLikelihoodRatio: number;
  negativeLikelihoodRatio: number;
  positiveShift: number;
  negativeShift: number;
}>;

export type LandmarkDiagnostic = Readonly<{
  kind: "binary-test";
  model: BinaryTestModel;
  selected: "prior" | "positive" | "negative";
}>;

export type LandmarkModel = Readonly<{
  id: LandmarkId;
  chance: Chance;
  size: number;
  art: string;
  sourceIds: readonly SourceId[];
  advice?: Readonly<{ relatedId: LandmarkId }>;
  diagnostic?: LandmarkDiagnostic;
  classification?: "Exact model" | "Estimate" | "Historical estimate" | "Defined model";
}>;
