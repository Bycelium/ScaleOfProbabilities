import { localeMetadata, type LocaleCode } from "./locales/metadata";

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
const decibanFormatters = new Map<LocaleCode, Intl.NumberFormat>();

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

const scientific = (value: number, locale: LocaleCode = "en"): string => {
  const metadata = localeMetadata[locale];
  if (value >= 1_000 && value < 1_000_000) return Math.round(value).toLocaleString(metadata.numberLocale);
  const [coefficient, rawExponent] = value.toExponential(2).split("e");
  const exponent = rawExponent.replace("+", "").split("").map(character => superscripts[character]).join("");
  return `${trim(coefficient).replace(".", metadata.decimalSeparator)} × 10${exponent}`;
};

export const formatProbability = (value: Chance, locale: LocaleCode = "en"): string => {
  const metadata = localeMetadata[locale];
  const tail = tailValue(value.tail);
  if (tail <= 0.0001) {
    const denominator = scientific(1 / tail, locale);
    return value.side === "lower" ? `${metadata.oneIn} ${denominator}` : `1 − 1 / (${denominator})`;
  }
  const probability = value.side === "lower" ? tail : 1 - tail;
  const percent = probability * 100;
  const distanceFromEndpoint = Math.min(percent, 100 - percent);
  const decimals = Math.min(4, Math.max(1, 2 - Math.floor(Math.log10(distanceFromEndpoint))));
  const formatted = trim(percent.toFixed(decimals)).replace(".", metadata.decimalSeparator);
  return `${formatted}${metadata.percentSpace}%`;
};

export const formatProbabilityPercent = (value: Chance, locale: LocaleCode = "en"): string => {
  const metadata = localeMetadata[locale];
  const tailPercent = tailValue(value.tail) * 100;
  if (tailPercent < 0.01) {
    const formattedTail = scientific(tailPercent, locale);
    return value.side === "lower" ? `${formattedTail}${metadata.percentSpace}%` : `(100 − ${formattedTail})${metadata.percentSpace}%`;
  }
  const percent = value.side === "lower" ? tailPercent : 100 - tailPercent;
  const distanceFromEndpoint = Math.min(percent, 100 - percent);
  const decimals = Math.min(4, Math.max(1, 2 - Math.floor(Math.log10(distanceFromEndpoint))));
  const formatted = trim(percent.toFixed(decimals)).replace(".", metadata.decimalSeparator);
  return `${formatted}${metadata.percentSpace}%`;
};

export const formatDecibans = (position: number, locale: LocaleCode = "en"): string => {
  let formatter = decibanFormatters.get(locale);
  if (!formatter) {
    formatter = new Intl.NumberFormat(localeMetadata[locale].numberLocale, { maximumFractionDigits: 1, useGrouping: false });
    decibanFormatters.set(locale, formatter);
  }
  const magnitude = formatter.format(Math.abs(position));
  const signed = magnitude === "0" ? magnitude : position > 0 ? `+${magnitude}` : `−${magnitude}`;
  return `${signed} dBan`;
};

export const formatOdds = (position: number, locale: LocaleCode = "en"): string => {
  const metadata = localeMetadata[locale];
  if (Math.abs(position) < 0.0005) return `1 ${metadata.oddsJoiner} 1`;
  const magnitude = 10 ** (Math.abs(position) / 10);
  const ratio = magnitude >= 1_000_000
    ? `(${scientific(magnitude, locale)})`
    : Number(magnitude.toPrecision(magnitude < 100 ? 2 : 3)).toLocaleString(metadata.numberLocale);
  return position < 0 ? `1 ${metadata.oddsJoiner} ${ratio}` : `${ratio} ${metadata.oddsJoiner} 1`;
};
