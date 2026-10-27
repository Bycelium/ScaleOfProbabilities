import type { LandmarkCopyFamily } from "../../types";

export const dice_gamesZH = {
  "rps-win": {
    title: "赢一局石头剪刀布",
    shortTitle: "石头剪刀布获胜",
    explanation: "固定的一种出法能战胜对手三种可能出法中的一种，与一种打平，并输给一种。",
    calculation: "p = 1 种可战胜的出法 / 3 种可能出法 = 1/3",
    assumptions: "对手以相等概率选择三种出法，且与自己的固定出法相互独立。",
  },

  "four-dice-any-six": {
    title: "四枚骰子至少出现一个六",
    shortTitle: "至少一个六",
    explanation: "四枚公平骰子的 1,296 种可能结果中，有 671 种至少含一个六。计算先数没有六的结果，再从全部结果中扣除。",
    calculation: "p = 1 − (5/6)⁴ = 671 / 1296",
    assumptions: "四枚公平六面骰子相互独立。",
  },

  "three-dice-sum-ten": {
    title: "三枚骰子点数和至少为 10",
    shortTitle: "骰子点数和 ≥ 10",
    explanation: "三枚公平骰子的 216 种有序结果中，恰有 135 种点数和至少为 10。",
    calculation: "p = 135 / 216 = 5/8",
    assumptions: "三枚公平六面骰子相互独立，将朝上面的点数相加。",
  },

  "die-six": {
    title: "一枚公平骰子掷出六",
    shortTitle: "一枚骰子的六",
    explanation: "平均而言，一枚公平骰子每掷出一次六，会掷出五次其他点数。",
    calculation: "p = 1 个六 / 6 个面 = 1/6",
    assumptions: "每个面等可能，骰子最终落在一个面上。",
  },

  "die-d4-highest": {
    title: "公平 d4 掷出四",
    shortTitle: "d4 掷出 4",
    explanation: "公平 d4 平均每四次有一次掷出四。",
    calculation: "p = 1 个最高结果 / 4 个结果 = 1/4",
    assumptions: "d4 公平地产生 1 至 4 中的一个数字。",
  },

  "die-d12-highest": {
    title: "公平 d12 掷出十二",
    shortTitle: "d12 掷出 12",
    explanation: "公平 d12 平均每十二次有一次掷出十二。",
    calculation: "p = 1 个最高结果 / 12 个结果 = 1/12",
    assumptions: "d12 公平地产生 1 至 12 中的一个数字。",
  },

  "die-d20-highest": {
    title: "d20 攻击检定掷出自然 20 暴击成功",
    shortTitle: "暴击成功",
    explanation: "公平 d20 的 20 个等可能结果中有一个是自然 20；2024 年 D&D 基础规则将其视为攻击检定的重击。",
    calculation: "p = 1 个自然 20 / 20 个结果 = 1/20",
    assumptions: "d20 公平且仅用于一次攻击检定。排除调整值、重掷、优势和劣势。其他检定或角色扮演系统的暴击规则可能不同。",
  },

  "two-dice-any-double": {
    title: "两枚骰子点数相同",
    shortTitle: "两枚骰子相同",
    explanation: "36 个等可能对子中有 6 个相同，从 1–1 到 6–6。",
    calculation: "p = 6 个相同对子 / 36 个等可能对子 = 1/6",
    assumptions: "两枚公平六面骰子相互独立。",
  },

  "two-dice-both-six": {
    title: "两枚骰子都掷出六",
    shortTitle: "两个六",
    explanation: "6–6 是 36 个等可能有序结果之一；每出现一次双六，对应 35 个其他对子。",
    calculation: "p = 1 个双六 / 36 个等可能对子 = 1/36",
    assumptions: "两枚公平六面骰子相互独立。",
  },

  "three-dice-any-triple": {
    title: "三枚骰子点数全相同",
    shortTitle: "三枚骰子相同",
    explanation: "216 个等可能三元组中有 6 个全相同，从 1–1–1 到 6–6–6。",
    calculation: "p = 6 个相同三元组 / 216 个等可能结果 = 1/36",
    assumptions: "三枚公平六面骰子相互独立。",
  },

  "three-dice-all-six": {
    title: "三枚骰子都掷出六",
    shortTitle: "三个六",
    explanation: "6–6–6 是 216 个等可能有序结果之一；每出现一次三个六，对应 215 个其他结果。",
    calculation: "p = 1 个三个六 / 216 个等可能结果 = 1/216",
    assumptions: "三枚公平六面骰子相互独立。",
  },

  "four-dice-all-identical": {
    title: "四枚骰子点数全相同",
    shortTitle: "四枚骰子相同",
    explanation: "1,296 个等可能四元组中有 6 个四枚骰子的点数全相同，从 1–1–1–1 到 6–6–6–6。",
    calculation: "p = 6 个相同四元组 / 6⁴ 个等可能结果 = 6/1296 = 1/216",
    assumptions: "四枚公平六面骰子相互独立。",
  },

  "first-roll-yahtzee": {
    title: "第一次投掷即得 Yams/Yahtzee",
    shortTitle: "首投 Yams",
    explanation: "五枚骰子首投的 7,776 种结果中有 6 种是五枚同点，即 Yams 或 Yahtzee。第一枚落定后，其余四枚都必须与它相同。",
    calculation: "p = 6 组全同结果 / 6⁵ 种结果 = 1/1296",
    assumptions: "五枚公平六面骰子相互独立。",
  },

  "rubik-state": {
    title: "两个打乱的 3 × 3 魔方状态相同",
    shortTitle: "两个相同的打乱魔方",
    explanation: "两个独立打乱的 3 × 3 魔方各有 43,252,003,274,489,856,000 个合法状态。对齐相同颜色的中心块后，第二个魔方在所有状态中只有一个状态与第一个相同。",
    calculation: "p = 1 个相同状态 / 43,252,003,274,489,856,000 个合法状态",
    assumptions: "每个魔方都从合法的 3 × 3 × 3 状态中独立且均匀地抽取。对齐相同颜色的中心块会消除整个魔方的旋转；手动打乱只用于说明这个均匀状态模型。",
  },

  "french-scrabble-consonant": {
    title: "在法语拼字游戏中抽到辅音",
    shortTitle: "拼字游戏辅音",
    explanation: "法语拼字游戏开始时，102 块牌中有 55 块是辅音牌。因此随机抽取一块牌，抽到辅音的概率约为 54%。",
    calculation: "p = 55 块辅音牌 / 102 块牌",
    assumptions: "使用完整的法语牌袋，并假设每块牌被抽到的概率相同。牌袋含 55 块辅音牌、包括 Y 在内的 45 块元音牌和两块空白牌。空白牌既非辅音也非元音。",
  },
  "french-scrabble-vowel": {
    title: "在法语拼字游戏中抽到元音",
    shortTitle: "拼字游戏元音",
    explanation: "法语拼字游戏开始时，102 块牌中有 45 块是元音牌。因此随机抽取一块牌，抽到元音牌的概率约为 44.1%。",
    calculation: "p = 45 块元音牌 / 102 块牌",
    assumptions: "使用完整的法语牌袋，并假设每块牌被抽到的概率相同。牌袋含 55 块辅音牌、包括 Y 在内的 45 块元音牌和两块空白牌。空白牌既非辅音也非元音。",
  },
  "french-scrabble-blank": {
    title: "在法语拼字游戏中抽到百搭牌",
    shortTitle: "拼字游戏百搭牌",
    explanation: "法语拼字游戏开始时，102 块牌中有 2 块是空白百搭牌。因此随机抽取一块牌，抽到百搭牌的概率约为 1.96%。",
    calculation: "p = 2 块空白百搭牌 / 102 块牌 ≈ 0.0196078",
    assumptions: "使用完整的法语牌袋，并假设每块牌被抽到的概率相同。牌袋含 55 块辅音牌、包括 Y 在内的 45 块元音牌和两块空白百搭牌。百搭牌既非辅音也非元音。",
  },

  "four-dice-any-match": {
    title: "四枚骰子中至少两枚相同",
    shortTitle: "四枚骰子有相同点数",
    explanation: "四枚公平骰子的 1,296 种结果中，有 936 种至少包含一对相同点数。",
    calculation: "p = 1 − (6 × 5 × 4 × 3) / 6⁴ = 1 − 360/1296 = 13/18",
    assumptions: "四枚公平骰子相互独立。任何重复点数都计入，包括三枚或四枚同点。",
  },

  "yahtzee-any-match": {
    title: "五枚骰子中至少两枚相同",
    shortTitle: "五枚骰子有相同点数",
    explanation: "五枚公平骰子首投的 7,776 种结果中，有 7,056 种至少包含一对相同点数。",
    calculation: "p = 1 − (6 × 5 × 4 × 3 × 2) / 6⁵ = 1 − 720/7776 = 49/54",
    assumptions: "五枚公平骰子相互独立。任何重复点数都计入，包括更多枚同点。不重掷骰子。",
  },

  "french-scrabble-vowel-rack": {
    title: "法语拼字游戏首抽七块中至少有一块元音",
    shortTitle: "七块法语牌中有元音",
    explanation: "从完整法语拼字游戏袋抽出的七块牌中，约每 100 组有 98.6 组至少含一块元音牌。",
    calculation: "p = 1 − C(57, 7) / C(102, 7) ≈ 0.9856833",
    assumptions: "无放回抽取七块牌。A、E、I、O、U 和 Y 共 45 块元音牌；55 块辅音牌和两块空白牌构成 57 块非元音牌。",
  },
  "french-scrabble-consonant-rack": {
    title: "法语拼字游戏首抽七块中至少有一块辅音",
    shortTitle: "七块牌中有辅音",
    explanation: "从完整法语拼字游戏袋首抽的七块牌中，约每 100 组有 99.7 组至少含一块辅音牌。",
    calculation: "p = 1 − C(47, 7) / C(102, 7) ≈ 0.9965944",
    assumptions: "从完整法语牌袋无放回抽取七块牌。A、E、I、O、U 和 Y 共 45 块元音牌；这 45 块元音牌和两块空白牌构成 47 块非辅音牌。55 块辅音牌是符合条件的牌，空白牌既非辅音也非元音。",
  },
  "french-scrabble-blank-rack": {
    title: "法语拼字游戏首抽七块中至少有一块百搭牌",
    shortTitle: "七块牌中有百搭牌",
    explanation: "从完整法语拼字游戏袋首抽的七块牌中，约每 100 组有 13.3 组至少含一块空白百搭牌。",
    calculation: "p = 1 − C(100, 7) / C(102, 7) ≈ 0.1331780",
    assumptions: "从完整法语牌袋无放回抽取七块牌。牌袋含 100 块字母牌和两块空白百搭牌，并假设每块牌被抽到的概率相同。百搭牌是唯一的空白牌。",
  },

  "die-d20-no-critical-failure": {
    title: "d20 攻击检定避开自然 1 的严重失败",
    shortTitle: "避开严重失败",
    explanation: "公平 d20 的 20 个结果中有 19 个能避开自然 1；2024 年 D&D 基础规则将自然 1 视为攻击检定自动未命中。",
    calculation: "p = 19 个非自然 1 结果 / 20 个结果 = 19/20",
    assumptions: "d20 公平且仅用于一次攻击检定。避开自然 1 不保证攻击成功。排除调整值、重掷、优势和劣势；其他检定或系统规则可能不同。",
  },

  "d20-avoid-natural-one-advantage": {
    title: "有优势的 d20 攻击检定避开自然 1",
    shortTitle: "有优势时避开自然 1",
    explanation: "有优势时掷出的 400 个等可能骰子对中，有 399 个因采用较高结果而避开自然 1。只有两枚都为 1 时结果仍是自然 1。",
    calculation: "p = 1 − (1/20)² = 399/400",
    assumptions: "骰子公平且相互独立，一次攻击采用较高点数。避开自然 1 不保证命中。排除调整值、重掷和其他游戏系统。",
  },
} satisfies LandmarkCopyFamily;
