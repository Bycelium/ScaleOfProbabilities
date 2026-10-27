import type { LandmarkCopyFamily } from "../../types";

export const weather_sportsZH = {
  "rain-hilo": {
    title: "夏威夷希洛一天下雨",
    shortTitle: "希洛下雨",
    explanation: "NOAA 1991–2020 年常年值显示，在希洛代表性 365 天的一年中，有 273 天降水量至少为 0.01 英寸。",
    calculation: "p ≈ 273 个降水日 / 365 天 = 0.74795",
    assumptions: "测站为夏威夷希洛国际机场。降水日指记录至少 0.01 英寸（0.254 mm）降水；短暂阵雨也符合，因此不表示整日下雨，也不是预报。",
  },

  "sunshine-phoenix": {
    title: "菲尼克斯一个日照时刻阳光充足",
    shortTitle: "菲尼克斯日照",
    explanation: "NOAA 报告，1965 年 1 月至 1983 年 12 月，菲尼克斯地面接收到阳光的时长占可能日照时长的 85%。",
    calculation: "p ≈ 可能日照时长的 0.85",
    assumptions: "这项历史测站统计把日照时长表示为可能日照时长的比例。它不表示 85% 的公历日全天晴朗，也不是预报。",
  },

  "nba-free-throw-2023-24": {
    title: "2023–24 赛季 NBA 罚球命中",
    shortTitle: "NBA 罚球命中",
    explanation: "在已结束的 2023–24 NBA 常规赛中，球员每 100 次罚球出手命中 78.4 次。",
    calculation: "p ≈ 0.784（全联盟罚球命中率）",
    assumptions: "汇总已结束常规赛所有球员的出手。抽样单位是一次投篮，并非一名球员，也不预测未来一次出手。",
  },

  "mensik-first-serve-miami-2025": {
    title: "Jakub Mensik 在 2025 年迈阿密赛事一发进区",
    shortTitle: "Mensik 一发进区",
    explanation: "在 2025 年迈阿密公开赛的六场比赛中，Jakub Mensik 有 68.6% 的一发落入正确发球区。",
    calculation: "p ≈ 0.686（一发进区）",
    assumptions: "统计涵盖 Mensik 在 2025 年迈阿密公开赛完成的六场比赛。它衡量一发是否进区，并非是否赢得该分，也不预测下一场比赛。",
  },

  "premier-league-penalty-2023-24": {
    title: "2023–24 英超联赛点球得分",
    shortTitle: "英超点球得分",
    explanation: "英超联赛报告，在已结束的 2023–24 赛季，比赛中判罚的点球有 90% 转化为进球。",
    calculation: "p ≈ 0.90（报告的点球转化率）",
    assumptions: "这项历史统计涵盖 2023–24 英超赛季比赛内的点球；联赛没有点球大战。舍入后的赛季比例不预测某位球员下一次点球。",
  },

  "rain-brest-december": {
    title: "布雷斯特十二月下雨",
    shortTitle: "布雷斯特十二月降雨",
    explanation: "法国气象局 1991–2020 年常年值显示，布雷斯特—吉帕瓦斯十二月 31 天中，平均有 17.8 天降水量至少为 1 mm。",
    calculation: "p ≈ 17.8 个降水日 / 十二月 31 天 = 0.57419",
    assumptions: "这是布雷斯特—吉帕瓦斯测站的气候常年值估计，并非整个布列塔尼。一天测得至少 1 mm 降水即符合，不表示整日下雨，也不是预报。",
  },
} satisfies LandmarkCopyFamily;
