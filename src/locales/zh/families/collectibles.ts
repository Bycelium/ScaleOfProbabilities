import type { LandmarkCopyFamily } from "../../types";

export const collectiblesZH = {
  "pokemon-destined-rivals-double-rare": {
    title: "一包 Destined Rivals 补充包中有双稀有（Double Rare）Pokémon ex 卡",
    shortTitle: "宝可梦·普通 ex",
    explanation: "TCGplayer 开启超过 8,000 包 Destined Rivals 后，估计 19.83% 的补充包中含有双稀有（Double Rare）卡，约五包一张。17 张双稀有卡全是普通版本 Pokémon ex。",
    calculation: "p ≈ 每包补充包 0.1983",
    assumptions: "这是 TCGplayer 用正态近似计算的每包观测估计，95% 置信区间为 ±0.84 个百分点，涵盖严格属于双稀有（Double Rare）级别的任意卡。文章未说明抽样印刷语言或市场，因此其他语言或印次的比例可能不同。",
  },

  "pokemon-destined-rivals-illustration-rare": {
    title: "一包 Destined Rivals 补充包中有插画稀有（Illustration Rare）卡",
    shortTitle: "宝可梦·插画卡",
    explanation: "TCGplayer 开启超过 8,000 包 Destined Rivals 后，估计 8.29% 的补充包中含有插画稀有（Illustration Rare）卡，约十二包一张。该级别的 23 张卡都是非 ex 宝可梦的满版替代插画。",
    calculation: "p ≈ 每包补充包 0.0829",
    assumptions: "这是 TCGplayer 用正态近似计算的每包观测估计，95% 置信区间为 ±0.58 个百分点，涵盖严格属于插画稀有（Illustration Rare）级别的任意卡。文章未说明抽样印刷语言或市场，因此不假定结果适用于所有语言或印次。",
  },

  "pokemon-destined-rivals-special-illustration-rare": {
    title: "一包 Destined Rivals 补充包中有特别插画稀有（Special Illustration Rare）卡",
    shortTitle: "宝可梦·特别插画",
    explanation: "TCGplayer 开启超过 8,000 包 Destined Rivals 后，估计 1.06% 的补充包中含有特别插画稀有（Special Illustration Rare）卡，约九十四包一张。该级别包含八张替代插画 Pokémon ex 和三张训练家卡。",
    calculation: "p ≈ 每包补充包 0.0106",
    assumptions: "这是 TCGplayer 用正态近似计算的每包观测估计，95% 置信区间为 ±0.22 个百分点，涵盖严格属于特别插画稀有（Special Illustration Rare）级别的任意卡。文章未说明抽样印刷语言或市场，因此不假定结果适用于所有语言或印次。",
  },
} satisfies LandmarkCopyFamily;
