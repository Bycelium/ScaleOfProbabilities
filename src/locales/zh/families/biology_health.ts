import type { LandmarkCopyFamily } from "../../types";

export const biology_healthZH = {
  "green-pea": {
    title: "一粒绿色豌豆种子",
    shortTitle: "绿色豌豆种子",
    explanation: "两株都携带黄色和绿色变体的植株产生四种等可能组合，其中一种形成绿色种子。绿色为隐性，因此双亲都必须传递该变体。",
    calculation: "p = 1 种绿色组合 / 4 种组合 = 1/4",
    assumptions: "该 Yy × Yy 杂交采用简单的单基因孟德尔模型。亲本基因不同的豌豆可能有不同概率。",
  },

  "yellow-pea": {
    title: "一粒黄色豌豆种子",
    shortTitle: "黄色豌豆种子",
    explanation: "两株都携带黄色和绿色变体的植株产生四种等可能组合，其中三种形成黄色种子，因为黄色为显性。",
    calculation: "p = 3 种黄色组合 / 4 种组合 = 3/4",
    assumptions: "该 Yy × Yy 杂交采用简单的单基因孟德尔模型。亲本基因不同的豌豆可能有不同概率。",
  },

  "double-yolk-young-hens": {
    title: "幼龄母鸡产下一枚双黄蛋",
    shortTitle: "双黄蛋",
    explanation: "一项生产研究报告，刚开始产蛋的幼龄商品蛋鸡每 100 枚蛋约产 2 枚双黄蛋。",
    calculation: "p ≈ 0.02",
    assumptions: "该估计适用于刚开始生产的幼龄蛋鸡。年龄、遗传、饮食、鸡群管理和鸡蛋分拣都会改变比例，因此它不是所有超市鸡蛋的通用概率。",
  },

  "dna-nucleotide-copied-correctly": {
    title: "一个 DNA 核苷酸被正确复制",
    shortTitle: "正确复制 DNA 核苷酸",
    explanation: "标准分子生物学估计认为，经校对和错配修复后，每复制十亿个核苷酸约出现一次错误，因此约有 999,999,999 个被正确复制。",
    calculation: "p ≈ 1 − 10⁻⁹",
    assumptions: "这是经校对和错配修复后的教科书级数量级估计。保真度随生物、细胞、条件和修复系统而异。事件针对单个核苷酸，并非整个基因组。",
  },

  "covid-scenario-prior": {
    title: "接受快速抗原检测前已感染 COVID",
    shortTitle: "COVID·检测前",
    explanation: "设想 {population} 名疑似接触病毒但无症状的人接受 COVID 检测。在假设感染率 {prevalence}% 下，检测前有 {infected} 人感染。",
    calculation: "先验 p = 0.005；先验胜算 = 0.005 / 0.995",
    assumptions: "0.5% 感染率是假设输入，并非当前实测感染率或个人风险估计。两种检测结果的更新都使用同一感染假设和同一人群。",
  },

  "covid-scenario-positive": {
    title: "快速抗原检测阳性者已感染 COVID",
    shortTitle: "COVID·阳性",
    explanation: "假设 {population} 人中有 {infected} 人感染，即 {prevalence}%。约有 {positiveTotal} 人检测呈阳性，其中 {truePositive} 人确实感染，另 {falsePositive} 人是假阳性。感染概率约为三分之一。",
    calculation: "p = (0.005 × 0.586) / [(0.005 × 0.586) + (0.995 × (1 − 0.994))] ≈ 0.3292",
    assumptions: "计算从假设的 0.5% 感染率开始，采用疑似接触病毒的无症状人群的汇总敏感度 0.586 和特异度 0.994。这些历史汇总估计合并了截至 2022 年 2 月的不同检测和研究。表现随试剂、时机、采样和环境而异。本计算不是个人诊断。",
  },

  "covid-scenario-negative": {
    title: "快速抗原检测阴性者已感染 COVID",
    shortTitle: "COVID·阴性",
    explanation: "假设 {population} 人中有 {infected} 人感染，即 {prevalence}%。约有 {negativeTotal} 人检测呈阴性，其中检测漏掉 {falseNegative} 例感染，约每 479 个阴性结果中有一名感染者。",
    calculation: "p = (0.005 × (1 − 0.586)) / [(0.005 × (1 − 0.586)) + (0.995 × 0.994)] ≈ 0.00209",
    assumptions: "计算从假设的 0.5% 感染率开始，采用疑似接触病毒的无症状人群的汇总敏感度 0.586 和特异度 0.994。这些历史汇总估计合并了截至 2022 年 2 月的不同检测和研究。表现随试剂、时机、采样和环境而异。本计算不是个人诊断。",
  },

  "human-denovo-snv": {
    title: "一代人中新出现一个 DNA 字母突变",
    shortTitle: "新发 DNA 字母突变",
    explanation: "一项针对 283 个冰岛父母—子女三人组的研究估计，每代每 7750 万个传递位点约出现一个新的单核苷酸变异，发生率为 1.29 × 10⁻⁸。",
    calculation: "p ≈ 每代每个传递位点 1.29 × 10⁻⁸",
    assumptions: "经覆盖度和可检出性校正后，95% 置信区间为 1.27–1.30 × 10⁻⁸。研究观察均值约为每人 63 个新发 SNV。发生率随父母年龄和序列环境而异。这里抽样的是一个传递位点，并非孩子出现任何突变或疾病的概率，也不同于细胞复制错误模型。",
  },

  "four-leaf-clover": {
    title: "一株四叶白车轴草",
    shortTitle: "四叶白车轴草",
    explanation: "引用的估计表明，每 5,076 株三叶白车轴草对应一株四叶白车轴草。在这些三叶和四叶植株中，比例为 5,077 分之一。",
    calculation: "p ≈ 1 / (5,076 + 1) = 1 / 5,077",
    assumptions: "比较仅限于三叶或四叶白车轴草。这是近似出现率，并非精确的全球调查。遗传、环境和草丛会改变比例；搜索方法、时长和地点决定一次搜索中找到它的机会。",
  },
} satisfies LandmarkCopyFamily;
