import type { LandmarkCopyFamily } from "../../types";

export const basicsZH = {
  "coin-heads": {
    title: "公平硬币出现预先选定的一面",
    shortTitle: "正面或反面",
    explanation: "硬币有两个等可能的结果，其中一个与预先选定的一面相符：正面或反面。",
    calculation: "p = 1 个选定面 / 2 个面 = 1/2",
    assumptions: "硬币出现正面和反面的概率相等，且不会立在边缘。",
  },

  "birthday-23": {
    title: "23 人中有人生日相同",
    shortTitle: "生日相同",
    explanation: "在模型中，23 人的小组出现至少两人生日相同的可能性略高于 23 人生日各不相同。计算考虑每一对人，不仅考虑是否有人与你同一天生日。",
    calculation: "p = 1 − ∏ₖ₌₀²² (365 − k) / 365",
    assumptions: "每个人的生日相互独立，并均匀分布在 365 个日期上。忽略闰日。",
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
    explanation: "在地球表面均匀选点，每 100 个点约有 71 个落在海水中，对应海洋占地球表面积的估计比例。",
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
    explanation: "在模型中，每 100 个 50 人小组约有 97 个包含至少一对生日相同的人。计算先求 50 个日期全都不同的概率，再用 1 减去它。",
    calculation: "p = 1 − ∏ₖ₌₀⁴⁹ (365 − k) / 365 ≈ 0.97037358",
    assumptions: "每个人的生日相互独立，并均匀分布在 365 个日期上。忽略闰日。",
  },

  "birthday-70": {
    title: "70 人中有人生日相同",
    shortTitle: "70 人中生日相同",
    explanation: "在模型中，每出现一个 70 人生日各不相同的小组，约有 1,189 个小组包含相同生日。计算用 1 减去所有日期均不同的小概率。",
    calculation: "p ≈ 0.999159576，即 1 减去 70 个生日全都不同的概率",
    assumptions: "每个人的生日相互独立，并均匀分布在 365 个日期上。忽略闰日。",
  },

  "birthday-79": {
    title: "79 人中有人生日相同",
    shortTitle: "79 人中生日相同",
    explanation: "在模型中，每出现一个 79 人生日各不相同的小组，约有 9,146 个小组包含相同生日。计算用 1 减去所有日期均不同的极小概率。",
    calculation: "p ≈ 0.999890668，即 1 减去 79 个生日全都不同的概率",
    assumptions: "每个人的生日相互独立，并均匀分布在 365 个日期上。忽略闰日。",
  },

  "lightning-year": {
    title: "一年内遭雷击（美国估计）",
    shortTitle: "美国年度雷击",
    explanation: "历史估计显示，每年每 1,222,000 名美国居民中约有一人遭雷击。该数字以年均遭雷击人数除以人口得出。",
    calculation: "p ≈ 1 / 1,222,000，来自年遭雷击人数除以人口",
    assumptions: "估计采用 2009–2018 年平均遭雷击人数和 2019 年美国人口。个人所在地点、工作和户外活动时间会显著改变风险。",
  },
} satisfies LandmarkCopyFamily;
