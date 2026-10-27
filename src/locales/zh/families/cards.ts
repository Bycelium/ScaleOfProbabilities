import type { LandmarkCopyFamily } from "../../types";

const holdem = "标准 52 张牌不含鬼牌。两张底牌和五张公共牌发出前均未知。由七张中最佳五张决定精确牌型，因此排除更强牌型。弃牌、对手和获胜概率不在模型内。";

export const cardsZH = {
  "ace-in-five-cards": {
    title: "五张牌中至少有一张 A",
    shortTitle: "五张牌中有 A",
    explanation: "2,598,960 种五张牌组合中，886,656 种至少含一张 A。计算先数不含 A 的牌组，再从全部组合中扣除。",
    calculation: "p = 1 − C(48, 5) / C(52, 5) = 886656 / 2598960",
    assumptions: "充分洗匀的标准 52 张牌无放回发牌。",
  },

  "holdem-one-pair": {
    title: "德州扑克：恰好一对",
    shortTitle: "一对",
    explanation: "133,784,560 种七张牌组合中，有 58,627,800 种的最佳五张牌恰好是一对：两张同点数，其余三张点数互异。",
    calculation: "p = 58,627,800 种一对牌 / C(52, 7) = 58,627,800 / 133,784,560",
    assumptions: holdem,
  },

  "numbered-card": {
    title: "标准牌组中的 2–10 数字牌",
    shortTitle: "2–10 数字牌",
    explanation: "52 张牌中有 36 张数字为 2 至 10，即四种花色各有九个数字点数。",
    calculation: "p = 36 / 52 = 9/13",
    assumptions: "充分洗匀的标准 52 张牌中每张等可能。A 和人头牌不属于 2–10 数字牌。",
  },

  "any-ace": {
    title: "从标准牌组抽到 A",
    shortTitle: "任意 A",
    explanation: "52 张牌中有四张 A，每种花色各一张。",
    calculation: "p = 4 张 A / 52 张牌 = 1/13",
    assumptions: "充分洗匀的标准 52 张牌中每张等可能。",
  },

  "ace-of-spades": {
    title: "从牌组抽到黑桃 A",
    shortTitle: "黑桃 A",
    explanation: "52 张牌中恰有一张黑桃 A。",
    calculation: "p = 1 张匹配牌 / 52 张牌 = 1/52",
    assumptions: "充分洗匀的标准 52 张牌中每张等可能。",
  },

  "holdem-high-card": {
    title: "德州扑克：高牌",
    shortTitle: "高牌",
    explanation: "133,784,560 种七张牌组合中，有 23,294,460 种的最佳五张牌为高牌：没有对子、顺子、同花或更强牌型。",
    calculation: "p = 23,294,460 种高牌 / C(52, 7) = 23,294,460 / 133,784,560",
    assumptions: holdem,
  },

  "holdem-two-pair": {
    title: "德州扑克：恰好两对",
    shortTitle: "两对",
    explanation: "133,784,560 种七张牌组合中，有 31,433,400 种的最佳五张牌恰好为两对：两个点数各出现两次，第五张为另一点数。",
    calculation: "p = 31,433,400 种两对 / C(52, 7) = 31,433,400 / 133,784,560",
    assumptions: holdem,
  },

  "holdem-three-kind": {
    title: "德州扑克：三条",
    shortTitle: "三条",
    explanation: "133,784,560 种七张牌组合中，有 6,461,620 种的最佳五张牌为三条，且不是葫芦或四条。",
    calculation: "p = 6,461,620 种三条 / C(52, 7) = 6,461,620 / 133,784,560",
    assumptions: holdem,
  },

  "holdem-straight": {
    title: "德州扑克：顺子",
    shortTitle: "顺子",
    explanation: "133,784,560 种七张牌组合中，有 6,180,020 种的最佳五张牌为顺子，且不是同花或更强牌型。",
    calculation: "p = 6,180,020 种顺子 / C(52, 7) = 6,180,020 / 133,784,560",
    assumptions: holdem,
  },

  "holdem-flush": {
    title: "德州扑克：同花",
    shortTitle: "同花",
    explanation: "133,784,560 种七张牌组合中，有 4,047,644 种的最佳五张牌为同花，且不是葫芦或更强牌型。",
    calculation: "p = 4,047,644 种同花 / C(52, 7) = 4,047,644 / 133,784,560",
    assumptions: holdem,
  },

  "holdem-full-house": {
    title: "德州扑克：葫芦",
    shortTitle: "葫芦",
    explanation: "133,784,560 种七张牌组合中，有 3,473,184 种的最佳五张牌为葫芦：三张同一点数，另两张为另一点数。",
    calculation: "p = 3,473,184 种葫芦 / C(52, 7) = 3,473,184 / 133,784,560",
    assumptions: holdem,
  },

  "holdem-four-kind": {
    title: "德州扑克：四条",
    shortTitle: "四条",
    explanation: "133,784,560 种七张牌组合中，有 224,848 种的最佳五张牌为四条。",
    calculation: "p = 224,848 种四条 / C(52, 7) = 224,848 / 133,784,560",
    assumptions: holdem,
  },

  "holdem-straight-flush": {
    title: "德州扑克：非皇家同花顺",
    shortTitle: "同花顺",
    explanation: "133,784,560 种七张牌组合中，有 37,260 种的最佳五张牌为非皇家同花顺。皇家同花顺另行计数。",
    calculation: "p =（含皇家同花顺的 41,584 种同花顺 − 4,324 种皇家同花顺）/ C(52, 7) = 37,260 / 133,784,560",
    assumptions: holdem,
  },

  "holdem-royal-flush": {
    title: "德州扑克：皇家同花顺",
    shortTitle: "皇家同花顺",
    explanation: "133,784,560 种七张牌组合中，有 4,324 种包含皇家同花顺：同一花色的 10、J、Q、K 和 A。",
    calculation: "p = 4,324 种含皇家同花顺的七张牌 / C(52, 7) = 4,324 / 133,784,560",
    assumptions: holdem,
  },
} satisfies LandmarkCopyFamily;
