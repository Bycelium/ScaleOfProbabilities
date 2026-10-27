import type { LandmarkCopyFamily } from "../../types";

export const astronomyZH = {
  "earth-sized-observed-exoplanet": {
    title: "与地球一样大或更小的系外行星",
    shortTitle: "地球大小的已观测系外行星",
    explanation: "巨行星之间也藏着地球大小的世界。半径已知的已确认系外行星中，约 12% 不超过地球半径的 1.25 倍。",
    calculation: "p = 558 / 4,826 ≈ 0.1156",
    assumptions: "这项历史估计从 NASA 系外行星档案 2026 年 10 月 27 日快照中半径已知的已确认行星取样。探测和测量偏差塑造了观测目录。半径门槛不能证明行星由岩石构成或适宜居住，结果也不代表银河系全部行星的组成。",
  },

  "full-moon-15-days": {
    title: "停留 15 天期间遇到满月",
    shortTitle: "15 天内的满月",
    explanation: "若停留开始时刻在月相周期中均匀分布，模型中约每 100 次为期 15 天的停留有 51 次包含满月发生的瞬间。",
    calculation: "p = 15 天 / 29.530589 天 ≈ 0.50795",
    assumptions: "开始月相均匀分布，朔望月固定为 29.530589 天。模型只考虑天文学上的满月瞬间，忽略天气、日光和当地地平线。",
  },

  "solar-eclipse-year": {
    title: "一年中某处发生日全食",
    shortTitle: "发生日全食的年份",
    explanation: "NASA 日食目录显示，2001 至 2100 年的 100 个公历年份中，有 67 年地球某处至少发生一次日全食。",
    calculation: "p = 67 个有 T 型日食的年份 / 100 年",
    assumptions: "按 NASA 日食目录中的不同公历年份计数。T 和 T+ 型条目计为日全食；排除全环食，也不表示任何特定地点可见。",
  },

  "red-dwarf-star": {
    title: "银河系中的红矮星",
    shortTitle: "红矮星",
    explanation: "NASA 估计，银河系中每 100 颗恒星约有 73 颗是红矮星。",
    calculation: "p ≈ 0.73",
    assumptions: "从银河系估计恒星总体中取样。这并非从肉眼可见恒星中选择，因为亮度会改变其组成比例。",
  },

  "terrestrial-massive-moon": {
    title: "模拟类地行星形成大质量卫星",
    shortTitle: "拥有大质量卫星的类地行星",
    explanation: "在 Elser 等人的撞击模拟中，约每 12 颗类地行星会出现一次类似地月系统的结果。",
    calculation: "p ≈ 15 / 180 ≈ 1/12 ≈ 0.083；敏感性范围 ≈ 1/45 至 1/4",
    assumptions: "2011 年研究的名义估计在约 180 颗模拟行星中找到 15 个匹配结果，要求主行星质量超过 0.5 个地球质量，卫星质量超过 0.5 个月球质量。1/45 至 1/4 来自敏感性选择，并非置信区间或实测银河系频率。初始条件和较小的模拟样本增加了不确定性；卫星吸积效率取极端值时，结果范围会从几乎没有系统扩大到 180 个系统中约 60 个，即约三分之一。",
  },
  "stellar-hydrogen-mass": {
    title: "恒星中的氢",
    shortTitle: "普通恒星中的氢",
    explanation: "一颗有代表性的普通恒星按质量计算约有 70% 是氢。",
    calculation: "p ≈ 0.70，按质量",
    assumptions: "NASA 的代表性混合物按质量约为 70% 氢、28% 氦和 2% 更重元素。模型抽取等质量份额，而非按原子计数。这是近似教学组成，不是每颗恒星的精确值，也不是整个银河系的实测汇总。",
  },
  "stellar-helium-mass": {
    title: "恒星中的氦",
    shortTitle: "普通恒星中的氦",
    explanation: "一颗有代表性的普通恒星按质量计算约有 28% 是氦。",
    calculation: "p ≈ 0.28，按质量",
    assumptions: "NASA 的代表性混合物按质量约为 70% 氢、28% 氦和 2% 更重元素。模型抽取等质量份额，而非按原子计数。这是近似教学组成，不是每颗恒星的精确值，也不是整个银河系的实测汇总。",
  },
  "stellar-hydrogen-helium-mass": {
    title: "恒星中的氢或氦",
    shortTitle: "普通恒星中的氢或氦",
    explanation: "一颗有代表性的普通恒星几乎只由两种元素组成：按质量约有 98% 是氢或氦。",
    calculation: "p ≈ 0.70 + 0.28 = 0.98，按质量",
    assumptions: "NASA 的代表性混合物按质量约为 70% 氢、28% 氦和 2% 更重元素。模型抽取等质量份额，而非按原子计数。这是近似教学组成，不是每颗恒星的精确值，也不是整个银河系的实测汇总。",
  },
  "main-sequence-star": {
    title: "随机选择的恒星处于主序阶段",
    shortTitle: "主序星",
    explanation: "约每十颗恒星中有九颗是主序星，正在核心中进行氢聚变。",
    calculation: "p ≈ 0.90，按恒星数量",
    assumptions: "这是按恒星数量计算的近似比例，不代表恒星质量占比或一颗恒星的寿命占比。不同恒星群体可能有所不同。",
  },
  "stellar-black-hole-baryonic-mass": {
    title: "恒星遗迹黑洞中的普通宇宙物质",
    shortTitle: "恒星黑洞中的物质",
    explanation: "一个当今宇宙模型认为，约 1% 的普通物质位于恒星遗留的黑洞中。",
    calculation: "p ≈ 0.01 的重子质量，作为舍入后的数量级参照",
    assumptions: "Sicilia 等人 2022 年的研究模型认为，在当今局部宇宙中，最多约 1% 的普通物质（即重子物质）位于恒星遗迹黑洞中。舍入值是数量级参照，不是精确普查。分母不含暗物质和暗能量；模型不包括超大质量黑洞和原初黑洞。",
  },

  "lunar-eclipse-year": {
    title: "一年中某处发生月偏食或月全食",
    shortTitle: "发生月食的年份",
    explanation: "NASA 月食目录显示，2001 至 2100 年的 100 个公历年份中，有 79 年地球某处至少发生一次月偏食或月全食。",
    calculation: "p = 79 个符合条件的年份 / 100 年",
    assumptions: "按 NASA 月食目录中的不同公历年份计数。月偏食和月全食及其带后缀类型均计入；仅有半影月食的年份不计，也不表示任何特定地点可见。",
  },

  "full-moon-28-days": {
    title: "停留 28 天期间遇到满月",
    shortTitle: "28 天内的满月",
    explanation: "若停留开始时刻在月相周期中均匀分布，模型中约每 100 次为期 28 天的停留有 95 次包含满月发生的瞬间。",
    calculation: "p = 28 天 / 29.530589 天 ≈ 0.94817",
    assumptions: "开始月相均匀分布，朔望月固定为 29.530589 天。模型只考虑天文学上的满月瞬间，忽略天气、日光和当地地平线。",
  },

  "sun-mass": {
    title: "太阳占太阳系质量的比例",
    shortTitle: "太阳的质量占比",
    explanation: "按质量比例抽取太阳系物质，其中约 99.85% 属于太阳。",
    calculation: "p ≈ 0.9985",
    assumptions: "按质量比例取样，并非在太阳、行星、卫星和小天体之间均匀选择。公布的百分比经过舍入。",
  },

  "solar-eclipse-local-year": {
    title: "一年内居住地发生日全食",
    shortTitle: "居住地日全食·一年",
    explanation: "从长期看，在一个有代表性的固定地点，日全食覆盖该处的年份约每 375 年出现一次。",
    calculation: "p ≈ 1/375，来自长期平均重现间隔",
    assumptions: "这是代表性固定地点基于频率的年度近似值。实际间隔和当地发生率各异。事件不考虑云层，也不是对特定城市或年份的预测。",
  },
} satisfies LandmarkCopyFamily;
