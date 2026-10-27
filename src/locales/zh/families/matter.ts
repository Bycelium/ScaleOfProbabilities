import type { LandmarkCopyFamily } from "../../types";

const air = "在理想气体模型下，公布的干燥空气体积分数等于粒子数分数。当地组成会变化。";

export const matterZH = {
  "nitrogen-molecule": {
    title: "随机选取的干燥空气粒子是氮",
    shortTitle: "干燥空气中的氮",
    explanation: "按粒子数计，氮分子约占代表性干燥空气样本的 78%。",
    calculation: "p ≈ 0.7808（按粒子数）",
    assumptions: air,
  },

  "oxygen-molecule": {
    title: "随机选取的干燥空气粒子是氧",
    shortTitle: "干燥空气中的氧",
    explanation: "按粒子数计，氧分子约占代表性干燥空气样本的 21%。",
    calculation: "p ≈ 0.2095（按粒子数）",
    assumptions: air,
  },

  "argon-atom": {
    title: "随机选取的干燥空气粒子是氩",
    shortTitle: "干燥空气中的氩",
    explanation: "按粒子数计，氩原子约占代表性干燥空气样本的 0.934%。",
    calculation: "p ≈ 0.00934（按粒子数）",
    assumptions: air,
  },

  "carbon-dioxide-molecule": {
    title: "随机选取的干燥空气粒子是二氧化碳",
    shortTitle: "干燥空气中的二氧化碳",
    explanation: "按粒子数计，二氧化碳分子约占所述干燥空气样本的 0.042%。",
    calculation: "p ≈ 0.000420（按粒子数）",
    assumptions: "在理想气体模型下，公布的干燥空气体积分数等于粒子数分数。代表值带有日期，且大气 CO₂ 随时间和地点变化。",
  },

  "carbon-12": {
    title: "随机选取的天然碳原子是碳-12",
    shortTitle: "碳-12",
    explanation: "在代表性天然组成中，碳-12 约占碳原子的 98.93%。",
    calculation: "碳-12 的 p ≈ 0.9893",
    assumptions: "模型采用代表性的天然同位素组成。同位素比例随材料而异。",
  },

  "oxygen-16": {
    title: "随机选取的天然氧原子是氧-16",
    shortTitle: "氧-16",
    explanation: "在代表性天然组成中，氧-16 约占氧原子的 99.757%。",
    calculation: "氧-16 的 p ≈ 0.99757",
    assumptions: "模型采用代表性的天然同位素组成。同位素比例随材料而异。",
  },

  "beach-grain": {
    title: "从海滩选中特定的一粒沙",
    shortTitle: "特定的一粒海滩沙",
    explanation: "指定的海滩尺寸和沙粒模型估计得到 2.122 × 10¹⁵ 粒沙。概率指从中选中预先指定的一粒。",
    calculation: "p = 2.122 × 10¹⁵ 分之一。N = 1000 × 50 × 1 × 0.60 / ((π/6) × 0.0003³)",
    assumptions: "假设海滩长 1 km、宽 50 m、深 1 m。沙粒建模为直径 0.3 mm 的球体，固体堆积率 60%。",
  },

  "sahara-grain": {
    title: "从撒哈拉选中特定的一粒沙",
    shortTitle: "特定的一粒撒哈拉沙",
    explanation: "指定的撒哈拉尺寸和沙粒模型估计得到 7.98 × 10²³ 粒沙。概率指从中选中预先指定的一粒。",
    calculation: "p = 7.98 × 10²³ 分之一。N = 9.4 × 10¹² × 0.20 × 10 × 0.60 / ((π/6) × 0.0003³)",
    assumptions: "模型采用 940 万 km² 总面积，假设沙丘覆盖其中 20%，深 10 m。沙粒建模为直径 0.3 mm 的球体，固体堆积率 60%。",
  },

  "radon-222-decay": {
    title: "一个氡-222 原子在未来一年内衰变",
    shortTitle: "氡在一年内衰变",
    explanation: "采用舍入后的 3.8 天半衰期，一个氡-222 原子在未来 365 天内衰变的累积概率极接近一。",
    calculation: "p = 1 − 2^(−365/3.8)",
    assumptions: "模型采用恒定的指数衰变率和 EPA 舍入后的半衰期。一大群氡-222 原子中约有一半会在 3.8 天内衰变。",
  },

  "carbon-14-decay": {
    title: "一个碳-14 原子在一百万年内衰变",
    shortTitle: "碳-14 在一百万年内衰变",
    explanation: "碳-14 半衰期为 5,730 年，一个碳-14 原子在未来一百万年内衰变的累积概率极接近一。",
    calculation: "p = 1 − 2⁻ᵗ⁄ᵀ½，其中 t = 1,000,000 年，T½ = 5,730 年",
    assumptions: "模型在整个区间采用恒定的指数衰变率。一大群碳-14 原子中约有一半会在 5,730 年内衰变。",
  },

  "needle-haystack": {
    title: "大海捞针",
    shortTitle: "干草堆中的针",
    explanation: "若按体积均匀抽取一点，该点落在隐藏针内的概率等于模型中针与草捆的体积比。",
    calculation: "p = (0.00069 / 1.25)² × (0.037 / 1.20) ≈ 9.40 × 10⁻⁹ ≈ 1.06 亿分之一",
    assumptions: "所有尺寸均换算为米。针建模为长 37 mm、宽 0.69 mm 的实心圆柱；草捆建模为直径 1.25 m、宽 1.20 m 的圆柱，包括空气间隙。针完全位于草捆内，忽略针尖和针眼。计算模拟均匀取样的一点，不代表徒手寻找。",
  },

  "frozen-freshwater": {
    title: "冻结的淡水",
    shortTitle: "冻结淡水",
    explanation: "地球淡水体积约有 68.7% 储存在冰川、冰盖或永久积雪中。",
    calculation: "p ≈ 地球淡水体积的 68.7%",
    assumptions: "分母不含海洋。该百分比是以水当量计的各储水库体积估计。",
  },

  "drop-olympic-pool": {
    title: "奥运泳池中的一滴水",
    shortTitle: "奥运泳池中的一滴",
    explanation: "该泳池可容纳相当于 150 亿滴、每滴 0.25 mL 的水。若从这些等体积份额中均匀选择一份，选中指定份额的概率为 150 亿分之一。",
    calculation: "V = 50 × 25 × 3 × 1,000 = 3,750,000 L；每滴 = 0.25 mL = 0.00025 L；p = 0.00025 / 3,750,000 = 1 / 15,000,000,000",
    assumptions: "长方体模型采用伦敦水上运动中心比赛池公布的 50 × 25 × 3 m 尺寸。采用 USGS 的 0.25 mL 水龙头水滴估计。概念上把水体分成等大的水滴份额，均匀选择一份，且预先指定其中一份。",
  },

  "drop-garden-pool": {
    title: "庭院泳池中的一滴水",
    shortTitle: "庭院泳池中的一滴",
    explanation: "一个 6 m × 3 m、水深 1.5 m 的泳池可容纳相当于 1.08 亿滴、每滴 0.25 mL 的水。均匀选择一份时，选中指定份额的概率为 1.08 亿分之一。",
    calculation: "V = 6 × 3 × 1.5 × 1,000 = 27,000 L；每滴 = 0.25 mL = 0.00025 L；p = 0.00025 / 27,000 = 1 / 108,000,000",
    assumptions: "庭院泳池是示例性长方体模型，长 6 m、宽 3 m、水深 1.5 m。采用 USGS 的 0.25 mL 水龙头水滴估计。概念上把水体分成等大的水滴份额，均匀选择一份，且预先指定其中一份。",
  },
} satisfies LandmarkCopyFamily;
