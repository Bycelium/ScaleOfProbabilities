import type { LandmarkCopyFamily } from "../../types";

export const astronomyZH = {
  "solar-terrestrial": {
    title: "太阳系中的类地行星",
    shortTitle: "类地行星",
    explanation: "太阳系八颗行星中有四颗是类地行星：水星、金星、地球和火星。",
    calculation: "p = 4 颗类地行星 / 8 颗行星 = 1/2",
    assumptions: "从八颗行星中等概率选择。排除矮行星，也不按质量、大小或人口加权。",
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

  "planet-with-moon": {
    title: "拥有卫星的太阳系行星",
    shortTitle: "拥有卫星的行星",
    explanation: "太阳系八颗行星中有六颗至少拥有一颗已知天然卫星；水星和金星没有卫星。",
    calculation: "p = 6 颗有卫星的行星 / 8 颗行星 = 3/4",
    assumptions: "每颗行星被选中的概率相等，各行星的卫星数量不影响取样。",
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
    explanation: "NASA 估计太阳约占太阳系总质量的 99.85%，即每 100 个质量单位中占 99.85 个。",
    calculation: "p ≈ 0.9985",
    assumptions: "按质量比例取样，并非在太阳、行星、卫星和小天体之间均匀选择。公布的百分比经过舍入。",
  },

  "solar-eclipse-local-year": {
    title: "一年内居住地发生日全食",
    shortTitle: "居住地日全食·一年",
    explanation: "对一个有代表性的固定地点，长期估计平均每出现一个日全食覆盖的年份，对应 374 个没有日全食的年份。NASA 给出的同一地点两次日全食平均间隔约为 375 年。",
    calculation: "p ≈ 1/375，来自长期平均重现间隔",
    assumptions: "这是代表性固定地点基于频率的年度近似值。实际间隔和当地发生率各异。事件不考虑云层，也不是对特定城市或年份的预测。",
  },
} satisfies LandmarkCopyFamily;
