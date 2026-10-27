import type { LandmarkCopyFamily } from "../../types";

export const lotteriesZH = {
  "euromillions-main-prize": {
    title: "一注 EuroMillions 赢得任一主开奖奖项",
    shortTitle: "EuroMillions 任意奖项",
    explanation: "一注 EuroMillions 平均约每 13 次可赢得一次主开奖奖项，全部 13 个奖级均计入。",
    calculation: "p = 10,778,691 个中奖结果 / 139,838,160 个可能结果",
    assumptions: "一注从 50 个主号码选 5 个，从 12 个幸运星选 2 个。排除 My Million、UK Millionaire Maker、El Millón 及其他抽奖或选项。规则核对于 2026 年 10 月 25 日。",
  },

  "france-loto-main-prize": {
    title: "一注法国 Loto 赢得任一主开奖奖项",
    shortTitle: "法国 Loto 任意奖项",
    explanation: "一注法国 Loto 平均约每六次可赢得一次主开奖奖项，全部九个奖级均计入，包括退还本金。",
    calculation: "p = 3,185,973 个中奖结果 / 19,068,840 个可能结果",
    assumptions: "一注从 49 个主号码选 5 个，并从 10 个幸运号选 1 个。排除代码抽奖、附加抽奖、2nd Tirage 和 Joker+。规则核对于 2026 年 10 月 25 日。",
  },

  "france-loto-main-loss": {
    title: "一注法国 Loto 未赢得主开奖奖项",
    shortTitle: "法国 Loto 未中奖",
    explanation: "约每六注法国 Loto 中有五注没有主开奖奖项，连只中幸运号的返还奖也没有。",
    calculation: "p = 15,882,867 个未中奖结果 / 19,068,840 个可能结果",
    assumptions: "考察一次开奖的一注号码。一注从 49 个主号码选 5 个，并从 10 个幸运号选 1 个。排除代码抽奖、附加抽奖、2nd Tirage 和 Joker+。规则核对于 2026 年 10 月 25 日。",
  },

  "euromillions-main-loss": {
    title: "一注 EuroMillions 未赢得主开奖奖项",
    shortTitle: "EuroMillions 未中奖",
    explanation: "约每 13 注 EuroMillions 中有 12 注没有主开奖奖项。",
    calculation: "p = 129,059,469 个未中奖结果 / 139,838,160 个可能结果",
    assumptions: "考察一次开奖的一注号码。一注从 50 个主号码选 5 个，从 12 个幸运星选 2 个。排除 My Million、UK Millionaire Maker、El Millón 及其他抽奖或选项。规则核对于 2026 年 10 月 25 日。",
  },

  "france-loto-jackpot": {
    title: "一注法国 Loto 赢得头奖",
    shortTitle: "法国 Loto 头奖",
    explanation: "同时匹配五个主号码和幸运号：每 19,068,840 种可能结果中只有一注法国 Loto 做到。",
    calculation: "p = 1 个头奖结果 / (C(49, 5) × 10) = 1/19,068,840",
    assumptions: "一注从 49 个主号码选 5 个，并从 10 个幸运号选 1 个。排除代码抽奖、附加抽奖、2nd Tirage 和 Joker+。规则核对于 2026 年 10 月 25 日。",
  },

  "uk-lotto-jackpot": {
    title: "一注英国 Lotto 在任一轮匹配六个号码",
    shortTitle: "英国 Lotto 匹配六个",
    explanation: "在一个开奖夜，一注英国 Lotto 有两次相互独立的机会匹配全部六个号码。两轮都匹配只计一次。",
    calculation: "p = 2/N − 1/N² = 90,114,947 / 2,030,175,963,260,676，其中 N = C(59, 6) = 45,057,474",
    assumptions: "2026 年现行形式使用同一 59 个号码池、两套新球和两台机器。此处计算一个开奖夜的一注。规则核对于 2026 年 10 月 25 日。",
  },

  "euromillions-jackpot": {
    title: "一注 EuroMillions 赢得头奖",
    shortTitle: "EuroMillions 头奖",
    explanation: "同时匹配五个主号码和两个幸运星：每 139,838,160 种可能结果中只有一注 EuroMillions 做到。",
    calculation: "p = 1 个头奖结果 / (C(50, 5) × C(12, 2)) = 1/139,838,160",
    assumptions: "一注从 50 个主号码选 5 个，从 12 个幸运星选 2 个。排除 My Million、UK Millionaire Maker、El Millón 及其他抽奖或选项。规则核对于 2026 年 10 月 25 日。",
  },

  "us-powerball-jackpot": {
    title: "一注美国 Powerball 赢得头奖",
    shortTitle: "美国 Powerball 头奖",
    explanation: "同时匹配五个白球号码和红色 Powerball：每 292,201,338 种可能结果中只有一注做到。",
    calculation: "p = 1 个匹配结果 / 292,201,338 个可能结果",
    assumptions: "按 2026 年 10 月 25 日核实的规则，一注从 69 个白球选 5 个，并从 26 个红球选 1 个。",
  },

  "us-mega-millions-jackpot": {
    title: "一注美国 Mega Millions 赢得头奖",
    shortTitle: "美国 Mega Millions 头奖",
    explanation: "同时匹配五个白球号码和 Mega Ball：每 290,472,336 种可能结果中只有一注做到。",
    calculation: "p = 1 个头奖结果 / 290,472,336 个可能结果",
    assumptions: "现行矩阵从 70 个白球选 5 个，并从 24 个 Mega Ball 号码选 1 个。规则核对于 2026 年 10 月 25 日。",
  },
} satisfies LandmarkCopyFamily;
