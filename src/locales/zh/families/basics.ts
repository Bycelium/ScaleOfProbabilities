import type { LandmarkCopyFamily } from "../../types";

const birthdayAssumptions = "每个人的生日相互独立，并均匀分布在 365 个日期上。忽略闰日。";

export const basicsZH = {
  "coin-heads": {
    title: "公平硬币出现预先选定的一面",
    shortTitle: "正面或反面",
    explanation: "在一枚公平硬币落下前先猜正面或反面，你猜中的概率是一半。",
    calculation: "p = 1 个选定面 / 2 个面 = 1/2",
    assumptions: "硬币出现正面和反面的概率相等，且不会立在边缘。",
  },

  "birthday-10": {
    title: "10 人中有人生日相同",
    shortTitle: "10 人中生日相同",
    explanation: "即使一桌只有 10 个人，每 100 个模型小组中也约有 12 个出现生日相同的人。",
    calculation: "p = 1 − ∏ₖ₌₀⁹ (365 − k) / 365 ≈ 0.11694818",
    assumptions: birthdayAssumptions,
  },
  "birthday-20": {
    title: "20 人中有人生日相同",
    shortTitle: "20 人中生日相同",
    explanation: "把 20 个人聚在一起，每 100 个模型小组中约有 41 个出现生日相同的人。",
    calculation: "p = 1 − ∏ₖ₌₀¹⁹ (365 − k) / 365 ≈ 0.41143838",
    assumptions: birthdayAssumptions,
  },
  "birthday-30": {
    title: "30 人中有人生日相同",
    shortTitle: "30 人中生日相同",
    explanation: "房间里有 30 个人时，出现共同生日已经更为可能：每 100 个模型小组中约有 71 个会出现。",
    calculation: "p = 1 − ∏ₖ₌₀²⁹ (365 − k) / 365 ≈ 0.70631624",
    assumptions: birthdayAssumptions,
  },
  "birthday-40": {
    title: "40 人中有人生日相同",
    shortTitle: "40 人中生日相同",
    explanation: "房间里有 40 个人时，每 100 个模型小组中约有 89 个出现生日相同的人。",
    calculation: "p = 1 − ∏ₖ₌₀³⁹ (365 − k) / 365 ≈ 0.89123181",
    assumptions: birthdayAssumptions,
  },

  "month-31-days": {
    title: "随机选中的月份有 31 天",
    shortTitle: "31 天的月份",
    explanation: "十二个月中有七个是 31 天，四个是 30 天，二月有 28 或 29 天。",
    calculation: "p = 7 个月 / 12 个月 = 7/12",
    assumptions: "十二个有名称的月份被选中的概率相等。闰年不会改变哪些月份有 31 天。",
  },
  weekday: {
    title: "随机选中的一天是星期一至星期五",
    shortTitle: "星期一至星期五",
    explanation: "一周七天中有五天是星期一至星期五，另两天是星期六和星期日。",
    calculation: "p = 5 个指定日 / 7 个指定日 = 5/7",
    assumptions: "这是均匀的日历类别模型，不考虑工作安排或个人日程。",
  },

  "ocean-point": {
    title: "随机一点落在海洋中",
    shortTitle: "海洋中的一点",
    explanation: "在地球上均匀落下一枚想象中的别针：每 100 次约有 71 次落入海洋。",
    calculation: "p ≈ 0.71，来自报告的海洋覆盖表面积",
    assumptions: "采用报告中的 71% 海洋覆盖率作为表面积估计。",
  },

  "annual-flood": {
    title: "超过年概率 1% 的洪水阈值",
    shortTitle: "年概率 1% 的洪水",
    explanation: "在指定地点，模型平均每出现一个超过阈值的年份，对应 99 个未超过的年份。年概率 1% 并不保证每 100 年恰好发生一次洪水。",
    calculation: "对于指定地点、阈值和年份，p = 0.01",
    assumptions: "该阈值属于特定地点。其他地点的住宅和水道面临不同风险。",
  },

  "birthday-50": {
    title: "50 人中有人生日相同",
    shortTitle: "50 人中生日相同",
    explanation: "聚集 50 个人，每 100 个模型小组中只有约 3 个能避开共同生日。",
    calculation: "p = 1 − ∏ₖ₌₀⁴⁹ (365 − k) / 365 ≈ 0.97037358",
    assumptions: birthdayAssumptions,
  },
  "birthday-60": {
    title: "60 人中有人生日相同",
    shortTitle: "60 人中生日相同",
    explanation: "在 60 个人中，每 100 个模型小组有超过 99 个会出现共同生日。",
    calculation: "p = 1 − ∏ₖ₌₀⁵⁹ (365 − k) / 365 ≈ 0.99412266",
    assumptions: birthdayAssumptions,
  },

  "lightning-year": {
    title: "一年内遭雷击（美国估计）",
    shortTitle: "美国年度雷击",
    explanation: "按美国历史估计，一年内每 1,222,000 名居民中约有一人遭雷击。",
    calculation: "p ≈ 1 / 1,222,000，来自年遭雷击人数除以人口",
    assumptions: "估计采用 2009–2018 年平均遭雷击人数和 2019 年美国人口。个人所在地点、工作和户外活动时间会显著改变风险。",
  },
} satisfies LandmarkCopyFamily;
