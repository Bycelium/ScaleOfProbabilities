import { landmarkModels } from "./catalogue/models";
import { catalogueOrder } from "./catalogue/order";
import { regionalLandmarkLocales } from "./catalogue/regions";
import { relatedLandmarkIds } from "./catalogue/relations";
import { sourceReferences, type SourceId } from "./catalogue/sources";
import type { LandmarkDiagnostic, LandmarkModel } from "./catalogue/types";
import { enLandmarks } from "./locales/en/catalogue";
import { enSources } from "./locales/en/sources";
import type { LandmarkTranslation } from "./locales/types";
import { decibans } from "./probability";

export type Source = Readonly<{ id: SourceId; label: string; href?: string; note?: string }>;
export type LandmarkAdvice = Readonly<{ before: string; relatedId: LandmarkModel["id"]; relatedLabel: string; after: string }>;
export type { BinaryTestModel, LandmarkDiagnostic } from "./catalogue/types";

export type Landmark = Readonly<{
  id: LandmarkModel["id"];
  title: string;
  shortTitle: string;
  chance: LandmarkModel["chance"];
  size: number;
  art: string;
  explanation: string;
  calculation: string;
  assumptions: string;
  sources: readonly Source[];
  advice?: LandmarkAdvice;
  diagnostic?: LandmarkDiagnostic;
  classification?: LandmarkModel["classification"];
  opening?: true;
}>;

const modelById = new Map(landmarkModels.map(model => [model.id, model]));

const materializeSource = (id: SourceId): Source => ({
  id,
  ...sourceReferences[id],
  ...enSources[id],
});

const materializeLandmark = (model: LandmarkModel, copy: LandmarkTranslation): Landmark => ({
  id: model.id,
  chance: model.chance,
  size: model.size,
  art: model.art,
  ...copy,
  sources: model.sourceIds.map(materializeSource),
  advice: model.advice && copy.advice ? { ...model.advice, ...copy.advice } : undefined,
  diagnostic: model.diagnostic,
  classification: model.classification,
  opening: model.opening,
});

export const landmarks: readonly Landmark[] = catalogueOrder.map(id => materializeLandmark(modelById.get(id)!, enLandmarks[id]));

export type DisplayLandmark = Landmark & Readonly<{ displayId: string; position: number }>;

export const displayLandmarks: readonly DisplayLandmark[] = landmarks.map(item => ({
  ...item,
  displayId: item.id,
  position: decibans(item.chance),
}));

export { catalogueOrder, landmarkModels, regionalLandmarkLocales, relatedLandmarkIds, sourceReferences };
