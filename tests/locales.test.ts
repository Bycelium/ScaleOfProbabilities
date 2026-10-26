import { describe, expect, it } from "vitest";
import { landmarks } from "../src/catalogue";
import { fillTemplate, assembleLandmarkTranslations } from "../src/locales/helpers";
import { localeChoices, localizeLandmark } from "../src/locales";
import type { LandmarkTranslation } from "../src/locales/types";

const translation: LandmarkTranslation = {
  title: "title",
  shortTitle: "short title",
  explanation: "explanation",
  calculation: "calculation",
  assumptions: "assumptions",
};

describe("locale content integrity", () => {
  it("rejects duplicate and incomplete translation families", () => {
    expect(() => assembleLandmarkTranslations([
      { "coin-heads": translation },
      { "coin-heads": translation },
    ])).toThrow("Duplicate landmark translation: coin-heads");
    expect(() => assembleLandmarkTranslations([{ "coin-heads": translation }])).toThrow("Missing landmark translations:");
  });

  it("requires values for every diagnostic template placeholder", () => {
    expect(fillTemplate("{known}", { known: "value" })).toBe("value");
    expect(() => fillTemplate("{known} {unknown}", { known: "value" })).toThrow("Missing template value: unknown");
  });

  it("fills every registered COVID and diagnostic UI template", () => {
    const templateValues = {
      expectedResults: { population: "1,000" },
      positiveEvidence: { factor: "2", shift: "+3 dBan" },
      negativeEvidence: { divisor: "2", shift: "−3 dBan" },
      positiveFormula: { sensitivity: "0.9", specificity: "0.8", ratio: "4.5" },
      negativeFormula: { sensitivity: "0.9", specificity: "0.8", ratio: "0.1" },
    } as const;
    const diagnosticLandmarks = landmarks.filter(landmark => landmark.diagnostic?.kind === "binary-test");

    for (const locale of localeChoices) {
      for (const [template, values] of Object.entries(templateValues)) {
        expect(fillTemplate(locale.ui.diagnostic[template as keyof typeof templateValues], values)).not.toMatch(/\{\w+\}/);
      }
      for (const landmark of diagnosticLandmarks) {
        expect(localizeLandmark(landmark, locale).explanation).not.toMatch(/\{\w+\}/);
      }
    }
  });
});
