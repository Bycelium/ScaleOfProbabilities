import type { LocaleCode } from "./locales/types";

export type Tail =
  | { kind: "ratio"; numerator: number; denominator: number }
  | { kind: "decimal"; value: number }
  | { kind: "one-in"; denominator: number };

export type Chance = Readonly<{
  tail: Tail;
  side: "lower" | "upper";
}>;

const superscripts: Record<string, string> = {
  "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
};

export const tailValue = (tail: Tail): number => {
  if (tail.kind === "ratio") return tail.numerator / tail.denominator;
  if (tail.kind === "one-in") return 1 / tail.denominator;
  return tail.value;
};

export const chance = (tail: Tail, side: Chance["side"] = "lower"): Chance => ({ tail, side });

export const decibans = (value: Chance): number => {
  const tail = tailValue(value.tail);
  const magnitude = 10 * (Math.log10(1 - tail) - Math.log10(tail));
  return value.side === "lower" ? -magnitude : magnitude;
};

export const chanceAt = (position: number): Chance => {
  const tail = 1 / (1 + 10 ** (Math.abs(position) / 10));
  return chance({ kind: "decimal", value: tail }, position < 0 ? "lower" : "upper");
};

const trim = (value: string): string => value.replace(/\.0+$|(?<=\.[0-9]*?)0+$/, "");

const localeName = (locale: LocaleCode): string => locale === "fr" ? "fr-FR" : "en-US";

const scientific = (value: number, locale: LocaleCode = "en"): string => {
  if (value >= 1_000 && value < 1_000_000) return Math.round(value).toLocaleString(localeName(locale));
  const [coefficient, rawExponent] = value.toExponential(2).split("e");
  const exponent = rawExponent.replace("+", "").split("").map(character => superscripts[character]).join("");
  return `${trim(coefficient).replace(".", locale === "fr" ? "," : ".")} × 10${exponent}`;
};

export const formatProbability = (value: Chance, locale: LocaleCode = "en"): string => {
  const tail = tailValue(value.tail);
  if (tail <= 0.0001) {
    const denominator = scientific(1 / tail, locale);
    return value.side === "lower" ? `${locale === "fr" ? "1 sur" : "1 in"} ${denominator}` : `1 − 1 / (${denominator})`;
  }
  const probability = value.side === "lower" ? tail : 1 - tail;
  const percent = probability * 100;
  const distanceFromEndpoint = Math.min(percent, 100 - percent);
  const decimals = Math.min(4, Math.max(1, 2 - Math.floor(Math.log10(distanceFromEndpoint))));
  const formatted = trim(percent.toFixed(decimals)).replace(".", locale === "fr" ? "," : ".");
  return `${formatted}${locale === "fr" ? " %" : "%"}`;
};

export const formatProbabilityPercent = (value: Chance, locale: LocaleCode = "en"): string => {
  const tailPercent = tailValue(value.tail) * 100;
  if (tailPercent < 0.01) {
    const formattedTail = scientific(tailPercent, locale);
    const space = locale === "fr" ? " " : "";
    return value.side === "lower" ? `${formattedTail}${space}%` : `(100 − ${formattedTail})${space}%`;
  }
  const percent = value.side === "lower" ? tailPercent : 100 - tailPercent;
  const distanceFromEndpoint = Math.min(percent, 100 - percent);
  const decimals = Math.min(4, Math.max(1, 2 - Math.floor(Math.log10(distanceFromEndpoint))));
  const formatted = trim(percent.toFixed(decimals)).replace(".", locale === "fr" ? "," : ".");
  return `${formatted}${locale === "fr" ? " %" : "%"}`;
};

export const formatDecibans = (position: number, locale: LocaleCode = "en"): string => {
  const magnitude = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    useGrouping: false,
  }).format(Math.abs(position)).replace(".", locale === "fr" ? "," : ".");
  const signed = magnitude === "0" ? magnitude : position > 0 ? `+${magnitude}` : `−${magnitude}`;
  return `${signed} dBan`;
};

export const formatOdds = (position: number, locale: LocaleCode = "en"): string => {
  if (Math.abs(position) < 0.0005) return locale === "fr" ? "1 pour 1" : "1 to 1";
  const magnitude = 10 ** (Math.abs(position) / 10);
  const ratio = magnitude >= 1_000_000
    ? `(${scientific(magnitude, locale)})`
    : Number(magnitude.toPrecision(magnitude < 100 ? 2 : 3)).toLocaleString(localeName(locale));
  const joiner = locale === "fr" ? "pour" : "to";
  return position < 0 ? `1 ${joiner} ${ratio}` : `${ratio} ${joiner} 1`;
};
