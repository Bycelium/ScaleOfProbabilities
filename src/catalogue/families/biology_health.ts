import { artwork, cloverArtwork, covidTestArtwork, dnaCopyArtwork, doubleYolkArtwork } from "../../artwork";
import { decibans } from "../../probability";
import type { BinaryTestModel } from "../types";
import { lowerRatio, upperRatio, lower, upper, oneIn, exact } from "../helpers";
import type { LandmarkModel } from "../types";
const covidPrevalence = 0.005;
const covidSensitivity = 0.586;
const covidSpecificity = 0.994;
const covidPositivePosterior = covidPrevalence * covidSensitivity / (covidPrevalence * covidSensitivity + (1 - covidPrevalence) * (1 - covidSpecificity));
const covidNegativePosterior = covidPrevalence * (1 - covidSensitivity) / (covidPrevalence * (1 - covidSensitivity) + (1 - covidPrevalence) * covidSpecificity);
const covidPopulation = 100_000;
const covidInfected = Math.round(covidPopulation * covidPrevalence);
const covidUninfected = covidPopulation - covidInfected;
const covidTruePositive = Math.round(covidInfected * covidSensitivity);
const covidFalseNegative = covidInfected - covidTruePositive;
const covidFalsePositive = Math.round(covidUninfected * (1 - covidSpecificity));
const covidTrueNegative = covidUninfected - covidFalsePositive;
const covidDiagnosticModel: BinaryTestModel = {
  population: covidPopulation, prevalence: covidPrevalence, sensitivity: covidSensitivity, specificity: covidSpecificity,
  infected: covidInfected, uninfected: covidUninfected, truePositive: covidTruePositive, falsePositive: covidFalsePositive,
  falseNegative: covidFalseNegative, trueNegative: covidTrueNegative, positiveTotal: covidTruePositive + covidFalsePositive,
  negativeTotal: covidFalseNegative + covidTrueNegative, positiveLikelihoodRatio: covidSensitivity / (1 - covidSpecificity),
  negativeLikelihoodRatio: (1 - covidSensitivity) / covidSpecificity,
  positiveShift: decibans(lower(covidPositivePosterior)) - decibans(lower(covidPrevalence)),
  negativeShift: decibans(lower(covidNegativePosterior)) - decibans(lower(covidPrevalence)),
};

export const biology_healthModels = [
  { id: "green-pea", chance: lowerRatio(1, 4), size: 82, art: artwork("pea", "#72bd50", "#bdf27a"), sourceIds: ["mendel"], classification: exact, opening: true },
  { id: "yellow-pea", chance: upperRatio(1, 4), size: 82, art: artwork("pea", "#d7c743", "#fff29d"), sourceIds: ["mendel"], classification: exact, opening: true },
  { id: "double-yolk-young-hens", chance: lower(0.02), size: 90, art: doubleYolkArtwork("#c99d54"), sourceIds: ["flock-cavero-and-simons-double-yolk-eggs-in-laying-hens", "lohmann-breeders-double-yolk-eggs"], classification: "Historical estimate" },
  { id: "dna-nucleotide-copied-correctly", chance: upper(1e-9), size: 94, art: dnaCopyArtwork("correct", "#5794b1"), sourceIds: ["dna-fidelity"], classification: "Estimate" },
  { id: "covid-scenario-prior", chance: lower(covidPrevalence), size: 92, art: covidTestArtwork("prior", "#72869a"), diagnostic: { kind: "binary-test", model: covidDiagnosticModel, selected: "prior" }, sourceIds: ["covid-antigen"] },
  { id: "covid-scenario-positive", chance: lower(covidPositivePosterior), size: 92, art: covidTestArtwork("positive", "#bc5d68"), diagnostic: { kind: "binary-test", model: covidDiagnosticModel, selected: "positive" }, sourceIds: ["covid-antigen"] },
  { id: "covid-scenario-negative", chance: lower(covidNegativePosterior), size: 92, art: covidTestArtwork("negative", "#5d8b7e"), diagnostic: { kind: "binary-test", model: covidDiagnosticModel, selected: "negative" }, sourceIds: ["covid-antigen"] },
  { id: "human-denovo-snv", chance: lower(1.29e-8), size: 94, art: dnaCopyArtwork("mutation", "#5794b1"), sourceIds: ["denovo-mutation"], classification: "Historical estimate" },
  { id: "four-leaf-clover", chance: oneIn(5077), size: 90, art: cloverArtwork("#58a85e"), sourceIds: ["four-leaf-clover"], classification: "Estimate" },
] satisfies readonly LandmarkModel[];
