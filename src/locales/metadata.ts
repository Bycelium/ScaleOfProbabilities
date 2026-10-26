export const localeMetadata = {
  en: {
    nativeName: "English",
    numberLocale: "en-US",
    decimalSeparator: ".",
    percentSpace: "",
    oneIn: "1 in",
    oddsJoiner: "to",
  },
  fr: {
    nativeName: "Français",
    numberLocale: "fr-FR",
    decimalSeparator: ",",
    percentSpace: " ",
    oneIn: "1 sur",
    oddsJoiner: "pour",
  },
} as const;

export type LocaleCode = keyof typeof localeMetadata;
export type LocaleMetadata = (typeof localeMetadata)[LocaleCode];
