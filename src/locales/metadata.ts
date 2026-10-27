export const localeMetadata = {
  en: {
    nativeName: "English",
    numberLocale: "en-US",
    decimalSeparator: ".",
    percentSpace: "",
    oneInTemplate: "1 in {denominator}",
    oddsJoiner: "to",
  },
  fr: {
    nativeName: "Français",
    numberLocale: "fr-FR",
    decimalSeparator: ",",
    percentSpace: " ",
    oneInTemplate: "1 sur {denominator}",
    oddsJoiner: "pour",
  },
  zh: {
    nativeName: "简体中文",
    numberLocale: "zh-CN",
    decimalSeparator: ".",
    percentSpace: "",
    oneInTemplate: "{denominator} 分之一",
    oddsJoiner: "比",
  },
  es: {
    nativeName: "Español",
    numberLocale: "es-ES",
    decimalSeparator: ",",
    percentSpace: " ",
    oneInTemplate: "1 entre {denominator}",
    oddsJoiner: "a",
  },
} as const;

export type LocaleCode = keyof typeof localeMetadata;
export type LocaleMetadata = (typeof localeMetadata)[LocaleCode];
