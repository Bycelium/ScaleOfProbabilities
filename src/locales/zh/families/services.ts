import type { LandmarkCopyFamily } from "../../types";

const post = "公布的服务质量指标遵循该产品的邮政工作日日历、收件日、寄出地和截件时间规则。这项年度观测比例并不保证单件邮件的送达时间。";

export const servicesZH = {
  "fr-letter-green-j3-2025": {
    title: "2025 年法国 Lettre verte 在三个工作日内送达",
    shortTitle: "Lettre verte·3 天",
    explanation: "ARCEP 报告称，在法国 2025 年普遍邮政服务测量中，每 100 封 Lettre verte 有 94.6 封达到三个工作日送达时限。",
    calculation: "p ≈ 0.946 在三个工作日内送达",
    assumptions: post,
  },

  "fr-letter-green-j5-2025": {
    title: "2025 年法国 Lettre verte 在五个工作日内送达",
    shortTitle: "Lettre verte·5 天",
    explanation: "ARCEP 报告称，在法国 2025 年普遍邮政服务测量中，每 100 封 Lettre verte 有 99.3 封达到五个工作日送达时限。",
    calculation: "p ≈ 0.993 在五个工作日内送达",
    assumptions: post,
  },

  "fr-colissimo-counter-j2-2025": {
    title: "2025 年柜台寄出的 Colissimo 在两个工作日内送达",
    shortTitle: "Colissimo·2 天",
    explanation: "ARCEP 报告称，在法国 2025 年普遍邮政服务测量中，每 100 件柜台寄出的 Colissimo 包裹有 91.5 件达到两个工作日送达时限。",
    calculation: "p ≈ 0.915 在两个工作日内送达",
    assumptions: "公布的服务质量指标遵循该产品的邮政工作日日历、收件日、寄出地和截件时间规则。这项年度观测比例并不保证单件包裹的送达时间。",
  },

  "us-electricity-available-2024": {
    title: "2024 年美国住宅电力可用",
    shortTitle: "美国电力可用·2024",
    explanation: "报告 IEEE 可靠性指标的美国公用事业单位，在闰年 2024 的 527,040 分钟中，平均每位客户停电 662.6 分钟。",
    calculation: "p ≈ 1 − 662.6 / (366 × 1,440)",
    assumptions: "该估计以一个客户分钟为抽样单位，将包含重大事件在内的报告年均停电时长换算而来。它涵盖有记录的非瞬时停电，并不保证某一住宅、公用事业单位或某一分钟的供电。",
  },

  "idf-electricity-available-2024": {
    title: "2024 年法兰西岛住宅电力可用",
    shortTitle: "法兰西岛电力可用·2024",
    explanation: "在法兰西岛，低压客户在闰年 2024 的 527,040 分钟中平均停电 44.7 分钟。",
    calculation: "p ≈ 1 − 44.7 / (366 × 1,440)",
    assumptions: "该估计以一个低压客户分钟为抽样单位，将该地区报告的全原因停电时长（含异常风暴）换算而来。它并不保证某一地址或某一分钟的供电。",
  },

  "gmail-available-2013": {
    title: "2013 年 Gmail 可用",
    shortTitle: "Gmail 可用·2013",
    explanation: "Google 报告 2013 年 Gmail 平均可用率为 99.978%，相当于每 100,000 个时刻约有 99,978 个可用。",
    calculation: "p ≈ 0.99978（报告的年度可用率）",
    assumptions: "模型从服务提供商报告的历史汇总数据中均匀抽取一个时刻。个人网络、设备、登录、账户访问和 Gmail 当前可用性不在指标内。该数字不是当前服务等级承诺。",
  },

  "stripe-available-2023": {
    title: "2023 年 Stripe 可用",
    shortTitle: "Stripe 可用·2023",
    explanation: "Stripe 年度信函报告其支付服务 2023 年可用率为 99.999%，相当于每 100,000 个时刻约有 99,999 个可用。",
    calculation: "p ≈ 0.99999（报告的年度可用率）",
    assumptions: "模型从服务提供商报告的历史汇总数据中均匀抽取一个时刻。这不表示每笔购买都获授权：银行卡拒付、欺诈检查、银行、客户网络和当前可用性均不在指标内。",
  },

  "fr-household-television-2025": {
    title: "2025 年下半年法国家庭拥有电视",
    shortTitle: "家中有电视·2025",
    explanation: "据 Arcom 和 Médiamétrie，2025 年下半年法国 89.1% 的家庭至少拥有一台电视。",
    calculation: "p ≈ 家庭的 0.891",
    assumptions: "抽样单位为家庭。Médiamétrie 基准调查每半年覆盖 10,000 户；本结果的调查期为 2025 年 8 月 19 日至 12 月 22 日。",
  },

  "fr-person-smartphone-2025": {
    title: "2025 年法国本土 12 岁及以上人群拥有智能手机",
    shortTitle: "智能手机·2025",
    explanation: "据《2026 数字晴雨表》，2025 年 6 月法国本土 12 岁及以上人群中 91% 拥有智能手机。",
    calculation: "p ≈ 12 岁及以上人群的 0.91",
    assumptions: "抽样单位为法国本土一名 12 岁及以上的人。调查于 2025 年 6 月 5 日至 21 日覆盖 4,145 人。智能手机是移动电话的一个子类。",
  },

  "fr-person-mobile-phone-2025": {
    title: "2025 年法国本土 12 岁及以上人群拥有移动电话",
    shortTitle: "移动电话·2025",
    explanation: "据《2026 数字晴雨表》，2025 年 6 月法国本土 12 岁及以上人群中 97% 拥有移动电话。",
    calculation: "p ≈ 12 岁及以上人群的 0.97",
    assumptions: "抽样单位为法国本土一名 12 岁及以上的人。调查于 2025 年 6 月 5 日至 21 日覆盖 4,145 人。移动电话包括智能手机和其他移动手持设备。",
  },
} satisfies LandmarkCopyFamily;
