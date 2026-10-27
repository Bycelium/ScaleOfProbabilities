import type { LandmarkCopyFamily } from "../../types";

const holdem = "标准 52 张牌不含鬼牌。两张底牌和五张公共牌发出前均未知。由七张中最佳五张决定精确牌型，因此排除更强牌型。弃牌、对手和获胜概率不在模型内。";

export const cardsZH = {
  "ace-in-five-cards": {
    title: "五张牌中至少有一张 A",
    shortTitle: "五张牌中有 A",
    explanation: "发出五张牌，手里出现至少一张 A 的概率约为三分之一。",
    calculation: "p = 1 − C(48, 5) / C(52, 5) = 886656 / 2598960",
    assumptions: "充分洗匀的标准 52 张牌无放回发牌。",
  },

  "holdem-one-pair": {
    title: "德州扑克：恰好一对",
    shortTitle: "一对",
    explanation: "单独一对是德州扑克最常见的画面：约 44% 的七张牌组合以它为最佳牌型。",
    calculation: "p = 58,627,800 种一对牌 / C(52, 7) = 58,627,800 / 133,784,560",
    assumptions: holdem,
  },

  "numbered-card": {
    title: "标准牌组中的 2–10 数字牌",
    shortTitle: "2–10 数字牌",
    explanation: "翻开一张牌，出现普通 2 至 10 数字牌的概率超过三分之二。",
    calculation: "p = 36 / 52 = 9/13",
    assumptions: "充分洗匀的标准 52 张牌中每张等可能。A 和人头牌不属于 2–10 数字牌。",
  },

  "any-ace": {
    title: "从标准牌组抽到 A",
    shortTitle: "任意 A",
    explanation: "翻开一张牌，四张 A 中任一张都算，概率为十三分之一。",
    calculation: "p = 4 张 A / 52 张牌 = 1/13",
    assumptions: "充分洗匀的标准 52 张牌中每张等可能。",
  },

  "ace-of-spades": {
    title: "从牌组抽到黑桃 A",
    shortTitle: "黑桃 A",
    explanation: "整副牌里只有一张黑桃 A，平均每 52 次单张抽取会遇到一次。",
    calculation: "p = 1 张匹配牌 / 52 张牌 = 1/52",
    assumptions: "充分洗匀的标准 52 张牌中每张等可能。",
  },

  "shuffled-deck-specified-order": {
    title: "重现一个指定的牌序",
    shortTitle: "精确洗牌",
    explanation: "充分洗匀 52 张牌：你手中的顺序很可能在人类历史上从未出现过。在人类时间尺度内，再见到同一顺序也同样渺茫。",
    calculation: "p = 1 / 52! ≈ 1.24 × 10⁻⁶⁸",
    assumptions: "牌组包含 52 张各不相同的牌，不含大小王。先指定曾出现过的顺序，再进行一次独立洗牌，并假定每种排列等可能。人类历史上实际产生过多少种不同牌序并不已知。在给定任意有限个、预先固定且互不相同的 N 种比较牌序（无论来自过去还是未来）时，命中其中任一种的概率为 N / 52!。",
  },
  "shuffled-tarot-specified-order": {
    title: "重现一个指定的 78 张塔罗牌顺序",
    shortTitle: "78 张塔罗牌精确洗牌",
    explanation: "充分洗匀一副完整的法国塔罗牌，78 张牌构成的顺序空间远远大于 52 张牌。回到一个预先选定的顺序，几乎是难以想象的巧合。",
    calculation: "p = 1 / 78! ≈ 8.83 × 10⁻¹¹⁶",
    assumptions: "牌组包含 78 张各不相同的牌：56 张花色牌、21 张王牌和愚人牌。目标顺序在一次独立、均匀的洗牌前指定。对任何预先固定的 N 个有限且互不相同的顺序，命中其中任一个的概率为 N / 78!。",
  },
  "shuffled-belote-specified-order": {
    title: "重现一个指定的 32 张 Belote 牌顺序",
    shortTitle: "32 张牌精确洗牌",
    explanation: "把一副 Belote 牌按特定顺序排好，再收拢并充分洗牌。即使只有 32 张牌，恰好回到原排列仍然惊人地渺茫。",
    calculation: "p = 1 / 32! ≈ 3.80 × 10⁻³⁶",
    assumptions: "牌组包含 32 张各不相同的牌：四种花色各有从 7 到 A 的八个点数。目标顺序在一次独立、均匀的洗牌前指定。对任何预先固定的 N 个有限且互不相同的顺序，命中其中任一个的概率为 N / 32!。",
  },

  "holdem-high-card": {
    title: "德州扑克：高牌",
    shortTitle: "高牌",
    explanation: "有时七张牌彼此都接不上：没有对子、顺子、同花或更强牌型。约每六手就有一手只能以高牌为最佳结果。",
    calculation: "p = 23,294,460 种高牌 / C(52, 7) = 23,294,460 / 133,784,560",
    assumptions: holdem,
  },

  "holdem-two-pair": {
    title: "德州扑克：恰好两对",
    shortTitle: "两对",
    explanation: "近四分之一的七张牌组合会以两对为最佳牌型，第五张则是另一点数。",
    calculation: "p = 31,433,400 种两对 / C(52, 7) = 31,433,400 / 133,784,560",
    assumptions: holdem,
  },

  "holdem-three-kind": {
    title: "德州扑克：三条",
    shortTitle: "三条",
    explanation: "约每 21 组七张牌就有一组以三条作为最佳五张牌型。",
    calculation: "p = 6,461,620 种三条 / C(52, 7) = 6,461,620 / 133,784,560",
    assumptions: holdem,
  },

  "holdem-straight": {
    title: "德州扑克：顺子",
    shortTitle: "顺子",
    explanation: "约每 22 组七张牌就有一组以五个连续点数作为最佳牌型。",
    calculation: "p = 6,180,020 种顺子 / C(52, 7) = 6,180,020 / 133,784,560",
    assumptions: holdem,
  },

  "holdem-flush": {
    title: "德州扑克：同花",
    shortTitle: "同花",
    explanation: "约 3% 的七张牌组合会以五张同花色牌作为最佳牌型。",
    calculation: "p = 4,047,644 种同花 / C(52, 7) = 4,047,644 / 133,784,560",
    assumptions: holdem,
  },

  "holdem-full-house": {
    title: "德州扑克：葫芦",
    shortTitle: "葫芦",
    explanation: "三条再遇上一对，约每 39 组七张牌就有一组以葫芦作为最佳五张牌型。",
    calculation: "p = 3,473,184 种葫芦 / C(52, 7) = 3,473,184 / 133,784,560",
    assumptions: holdem,
  },

  "holdem-four-kind": {
    title: "德州扑克：四条",
    shortTitle: "四条",
    explanation: "同一点数的四张牌约每 595 组七张牌才会聚齐一次。",
    calculation: "p = 224,848 种四条 / C(52, 7) = 224,848 / 133,784,560",
    assumptions: holdem,
  },

  "holdem-straight-flush": {
    title: "德州扑克：非皇家同花顺",
    shortTitle: "同花顺",
    explanation: "约每 3,590 组七张牌就有一组以非皇家同花顺作为最佳五张牌型。",
    calculation: "p =（含皇家同花顺的 41,584 种同花顺 − 4,324 种皇家同花顺）/ C(52, 7) = 37,260 / 133,784,560",
    assumptions: holdem,
  },

  "holdem-royal-flush": {
    title: "德州扑克：皇家同花顺",
    shortTitle: "皇家同花顺",
    explanation: "同一花色的 10、J、Q、K 和 A 约每 31,000 组七张牌才会一同出现。",
    calculation: "p = 4,324 种含皇家同花顺的七张牌 / C(52, 7) = 4,324 / 133,784,560",
    assumptions: holdem,
  },
} satisfies LandmarkCopyFamily;
