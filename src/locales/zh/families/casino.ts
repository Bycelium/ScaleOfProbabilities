import type { LandmarkCopyFamily } from "../../types";

const roulette = "包括零在内的 37 个数字等可能。计算遵循法国英式轮盘规则。平均损失按多次重复下注计算。";

export const casinoZH = {
  "roulette-straight-up": {
    title: "轮盘单号下注获胜",
    shortTitle: "轮盘·单号",
    explanation: "选定的单号下注覆盖一个数字，即单零轮盘 37 个格之一。获胜净赢 €3,500 并退回 €100 本金，否则损失 €100 本金。长期平均每下注 €100 损失 €2.70。",
    calculation: "p = 1/37；预期净收益 = [(1 × €3,500) − (36 × €100)] / 37 = −€100/37 ≈ 每 €100 为 −€2.70",
    assumptions: roulette,
  },

  "roulette-split": {
    title: "轮盘分注获胜",
    shortTitle: "轮盘·分注",
    explanation: "选定的分注覆盖布局中相邻的两个数字，即 37 个格中的两个。获胜净赢 €1,700 并退回 €100 本金，否则损失本金。长期平均每下注 €100 损失 €2.70。",
    calculation: "p = 2/37；预期净收益 = [(2 × €1,700) − (35 × €100)] / 37 = −€100/37 ≈ 每 €100 为 −€2.70",
    assumptions: roulette,
  },

  "roulette-street": {
    title: "轮盘街注获胜",
    shortTitle: "轮盘·街注",
    explanation: "选定的街注覆盖布局中一排三个数字，即 37 个格中的三个。获胜净赢 €1,100 并退回 €100 本金，否则损失本金。长期平均每下注 €100 损失 €2.70。",
    calculation: "p = 3/37；预期净收益 = [(3 × €1,100) − (34 × €100)] / 37 = −€100/37 ≈ 每 €100 为 −€2.70",
    assumptions: roulette,
  },

  "roulette-corner": {
    title: "轮盘角注获胜",
    shortTitle: "轮盘·角注",
    explanation: "选定的角注覆盖布局中在一角相接的四个数字，即 37 个格中的四个。获胜净赢 €800 并退回 €100 本金，否则损失本金。长期平均每下注 €100 损失 €2.70。",
    calculation: "p = 4/37；预期净收益 = [(4 × €800) − (33 × €100)] / 37 = −€100/37 ≈ 每 €100 为 −€2.70",
    assumptions: roulette,
  },

  "roulette-six-line": {
    title: "轮盘六线注获胜",
    shortTitle: "轮盘·六线注",
    explanation: "选定的六线注覆盖布局中相邻两排的六个数字，即 37 个格中的六个。获胜净赢 €500 并退回 €100 本金，否则损失本金。长期平均每下注 €100 损失 €2.70。",
    calculation: "p = 6/37；预期净收益 = [(6 × €500) − (31 × €100)] / 37 = −€100/37 ≈ 每 €100 为 −€2.70",
    assumptions: roulette,
  },

  "roulette-dozen-column": {
    title: "轮盘十二数注或列注获胜",
    shortTitle: "轮盘·十二数或列",
    explanation: "选定的十二数或一列覆盖单零轮盘 37 个格中的 12 个。获胜净赢 €200 并退回 €100 本金，否则损失本金。长期平均每下注 €100 损失 €2.70。",
    calculation: "p = 12/37；预期净收益 = [(12 × €200) − (25 × €100)] / 37 = −€100/37 ≈ 每 €100 为 −€2.70",
    assumptions: roulette,
  },

  "roulette-even-money": {
    title: "轮盘押红获胜",
    shortTitle: "轮盘·红",
    explanation: "押红覆盖单零轮盘 37 个格中的 18 个。黑、奇、偶、小和大是等价的等额赔率选项。红色净赢 €100 并退回本金；黑色损失 €100；零退回 €50，即净损失 €50。长期平均每下注 €100 损失 €1.35。",
    calculation: "p = 18/37；预期净收益 = [(18 × €100) − (18 × €100) − €50] / 37 = −€100/74 ≈ 每 €100 为 −€1.35",
    assumptions: roulette,
  },

  "roulette-two-dozens-columns": {
    title: "轮盘两个十二数或两列下注获胜",
    shortTitle: "轮盘·24 格",
    explanation: "将 €100 总本金分成两个 €50，押在两个选定的十二数或列上，可覆盖单零轮盘 37 格中的 24 格。命中覆盖数字返还 €150，净赚 €50；其余含零的 13 个数字损失全部本金。长期平均每下注 €100 损失 €2.70。",
    calculation: "p = 24/37；预期净收益 = [(24 × €50) − (13 × €100)] / 37 = −€100/37 ≈ 每 €100 为 −€2.70",
    assumptions: roulette,
  },

  "blackjack-natural-six-deck": {
    title: "六副牌牌靴发出天然二十一点",
    shortTitle: "天然二十一点·6 副牌",
    explanation: "装满六副牌的赌场牌靴中，初始两张牌约每 21.06 手有一手天然二十一点：一张 A 加一张 10、J、Q 或 K，顺序不限。",
    calculation: "p = 2 × (24 张 A / 312 张牌) × (96 张十点牌 / 剩余 311 张牌) ≈ 0.047489488",
    assumptions: "312 张牌中有 24 张 A 和 96 张十点牌，并均匀洗牌。天然二十一点仅指初始两张牌，分牌后组成 21 点不计。拿到天然二十一点不等于赢过庄家。未知的烧牌或中间牌不改变这个无条件概率；已知牌靴消耗情况会改变它。",
  },
} satisfies LandmarkCopyFamily;
