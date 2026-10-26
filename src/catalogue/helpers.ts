import { chance, type Chance } from "../probability";

export const lowerRatio = (numerator: number, denominator: number): Chance => chance({ kind: "ratio", numerator, denominator });
export const upperRatio = (lowerNumerator: number, denominator: number): Chance => chance({ kind: "ratio", numerator: lowerNumerator, denominator }, "upper");
export const lower = (value: number): Chance => chance({ kind: "decimal", value });
export const upper = (lowerTail: number): Chance => chance({ kind: "decimal", value: lowerTail }, "upper");
export const oneIn = (denominator: number): Chance => chance({ kind: "one-in", denominator });
export const exact = "Exact model" as const;
