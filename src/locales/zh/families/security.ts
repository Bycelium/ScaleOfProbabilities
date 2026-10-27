import type { LandmarkCopyFamily } from "../../types";

const passwordAssumptions = "从固定版本的 RockYou 2009 频率档案中 32,603,388 次密码出现记录均匀抽取一次。猜测必须与字符串完全相同。这个历史性、特定服务的语料库不能代表所有当代密码。在线防护和两步验证也会影响账户安全。";
const passwordAdvice = {
  before: "如果仍在使用此密码，请改为唯一的",
  relatedLabel: "由密码管理器生成的密码",
  after: "。避免键盘连按、姓名和生日等熟悉模式。可用时优先使用通行密钥；仍使用密码时启用两步验证。",
};

export const securityZH = {
  "password-123456": {
    title: "猜中“123456”",
    shortTitle: "猜“123456”",
    explanation: "在 RockYou 2009 语料库的 32,603,388 次密码出现记录中，“123456”出现 290,729 次。",
    calculation: "p = 290,729 / 32,603,388",
    assumptions: passwordAssumptions,
    advice: passwordAdvice,
  },

  "password-qwerty": {
    title: "猜中“qwerty”",
    shortTitle: "猜“qwerty”",
    explanation: "在 RockYou 2009 语料库的 32,603,388 次密码出现记录中，“qwerty”出现 13,456 次。",
    calculation: "p = 13,456 / 32,603,388",
    assumptions: passwordAssumptions,
    advice: passwordAdvice,
  },

  "password-password": {
    title: "猜中“password”",
    shortTitle: "猜“password”",
    explanation: "在 RockYou 2009 语料库的 32,603,388 次密码出现记录中，“password”出现 59,462 次。",
    calculation: "p = 59,462 / 32,603,388",
    assumptions: passwordAssumptions,
    advice: passwordAdvice,
  },

  "four-digit-pin": {
    title: "猜中四位 PIN",
    shortTitle: "四位 PIN",
    explanation: "一次随机猜测命中从 0000 到 9999 均匀选取的 PIN 的概率是 10,000 分之一。",
    calculation: "p = 1 / 10,000",
    assumptions: "全部 10,000 个四位字符串等可能，模型只涵盖一次猜测。设备和银行卡 PIN 系统通常限制重复尝试。",
    advice: {
      before: "请保留设备和银行账户的重试次数限制。在线账户可用时优先使用通行密钥，否则使用唯一的",
      relatedLabel: "由密码管理器生成的密码",
      after: "并启用两步验证。",
    }
  },

  "manager-password-16": {
    title: "猜中密码管理器生成的 16 字符密码",
    shortTitle: "16 字符生成密码",
    explanation: "由字母和数字随机组成的 16 字符密码，想一次就猜中准确内容，概率已经低得惊人。",
    calculation: "p = 1 / 62¹⁶ = 1 / 47,672,401,706,823,533,450,263,330,816",
    assumptions: "每个字符从大写字母、小写字母和数字中独立均匀抽取。概率只涵盖一次独立猜测。密码管理器设置和账户防护各异。",
  },

  "eff-passphrase-six": {
    title: "猜中六词随机口令短语",
    shortTitle: "六词口令短语",
    explanation: "六个常见单词随机组合后，也能成为出人意料地难猜的秘密。一次猜测必须按正确顺序命中每个词。",
    calculation: "p = 1 / 7,776⁶ = 1 / 221,073,919,720,733,357,899,776",
    assumptions: "每个词独立且均匀地从 7,776 个词中抽取。顺序重要，词可以重复，概率只涵盖一次独立猜测。",
  },

  "aes-128-key": {
    title: "猜中随机 128 位 AES 密钥",
    shortTitle: "128 位 AES 密钥",
    explanation: "面对随机生成的 128 位 AES 密钥，盲猜一次找到准确密钥的机会微乎其微。",
    calculation: "p = 1 / 2¹²⁸ = 1 / 340,282,366,920,938,463,463,374,607,431,768,211,456",
    assumptions: "AES 密钥均匀生成，概率只涵盖一次独立密钥猜测。实际数据保护还取决于软件和密钥管理。",
  },

  "aes-256-key": {
    title: "猜中随机 256 位 AES 密钥",
    shortTitle: "256 位 AES 密钥",
    explanation: "面对随机生成的 256 位 AES 密钥，盲猜一次就找到准确密钥，几乎难以想象。",
    calculation: "p = 1 / 2²⁵⁶ ≈ 1 / (1.158 × 10⁷⁷)",
    assumptions: "AES 密钥均匀生成，概率只涵盖一次独立密钥猜测。实际数据保护还取决于软件和密钥管理。",
  },

  "uuid-v4-pair-collision": {
    title: "两个 UUIDv4 值发生碰撞",
    shortTitle: "两个 UUIDv4 碰撞",
    explanation: "独立生成两个 UUIDv4，这一特定配对恰好得到相同值，会是极其罕见的巧合。",
    calculation: "p = 1 / 2¹²² = 1 / 5,316,911,983,139,663,491,615,228,241,121,378,304",
    assumptions: "两个 UUIDv4 都使用可靠生成器产生的独立、均匀 122 位随机字段。本模型只涵盖一对 UUIDv4。对于大量 UUIDv4，生日效应会计算许多可能的配对，从而提高至少发生一次碰撞的概率。",
  },

  "sha256-pair-collision": {
    title: "两个不同输入产生相同的 SHA-256 哈希",
    shortTitle: "一对 SHA-256 碰撞",
    explanation: "取两个不同输入：在理想 SHA-256 模型中，这一特定配对得到相同摘要，会是极其罕见的巧合。",
    calculation: "固定的一对：p = 1 / 2²⁵⁶ ≈ 1 / (1.158 × 10⁷⁷)",
    assumptions: "两个输入互不相同，其 SHA-256 摘要被建模为相互独立且均匀分布的 256 位值。本模型涵盖一个指定配对。对大量哈希的碰撞搜索有 n(n − 1)/2 个配对；约 2¹²⁸ 个哈希的生日界规模描述整个集合，而这个指定配对的概率仍为 2⁻²⁵⁶。",
  },

  "exact-hash-day": {
    title: "预先指定的比特币哈希在一天内出现",
    shortTitle: "一天内出现精确比特币哈希",
    explanation: "按模型中的全网速率，在一天内至少一次产生预先选定的特定 256 位哈希的概率约为 1.34 × 10⁵¹ 分之一。",
    calculation: "p = 1 − (1 − 2⁻²⁵⁶)ᴺ ≈ N / 2²⁵⁶ ≈ 1.34 × 10⁵¹ 分之一，其中 N ≈ 8.64 × 10²⁵",
    assumptions: "全网以舍入后的每秒 10²¹ 次速率，在 86,400 秒内进行 N 次独立均匀哈希尝试。普通挖矿接受任何低于目标阈值的哈希；匹配一个预选哈希是范围窄得多的事件。",
  },

  "eff-word-one": {
    title: "猜中 EFF 词表中的一个词",
    shortTitle: "7,776 个词中的一个",
    explanation: "五次掷骰会变成 EFF 词表中的一个词。精确猜测必须找到更长口令短语中的这一个组成部分。",
    calculation: "p = 1 / 6⁵ = 1 / 7,776",
    assumptions: "按顺序掷五次公平六面骰子来选词。全部 6⁵ 个序列等可能，模型只进行一次独立词语猜测。",
  },

  "enigma-i-known-rings": {
    title: "转子环已知时猜中 Enigma I 设置",
    shortTitle: "Enigma I，转子环已知",
    explanation: "知道 Enigma I 的转子环设置后，转子、起始位置和插线板仍把正确设置藏在海量可能之中。一次猜测必须找到准确组合。",
    calculation: "N = [26! / (6! × 10! × 2¹⁰)] × P(5, 3) × 26³ = 158,962,555,217,826,360,000。p = 1/N",
    assumptions: "反射器、接线和转子环设置已知。计数配置包括从五个转子中有序选择三个、每个转子 26 个起始位置之一，以及恰好 10 根插线连接 20 个字母，余下六个字母不连接。所有机械上可行的转子顺序均计入，不考虑历史操作限制。实际密码强度还取决于攻击方法和消息背景。若未定义 Bombe 测试后剩余的候选集合，不为其指定固定概率增益。",
  },

  "enigma-m3-known-rings": {
    title: "转子环已知时猜中 Enigma M3 设置",
    shortTitle: "Enigma M3，转子环已知",
    explanation: "转子环设置已知时，海军 Enigma M3 的转子、起始位置和插线板仍把正确设置藏在海量可能之中。一次猜测必须找到准确组合。",
    calculation: "N = [26! / (6! × 10! × 2¹⁰)] × P(8, 3) × 26³ = 890,190,309,219,827,616,000。p = 1/N",
    assumptions: "反射器、接线和转子环设置已知。计数配置包括从八个转子中有序选择三个、每个转子 26 个起始位置之一，以及恰好 10 根插线连接 20 个字母，余下六个字母不连接。所有机械上可行的转子顺序均计入，不考虑历史操作限制。实际密码强度还取决于攻击方法和消息背景。若未定义 Bombe 测试后剩余的候选集合，不为其指定固定概率增益。",
  },

  "enigma-m4-known-rings": {
    title: "转子环已知时猜中 Enigma M4 设置",
    shortTitle: "Enigma M4，转子环已知",
    explanation: "海军 Enigma M4 增加了第四个转子。转子环设置已知时，转子、起始位置和插线板仍为一次准确猜测留下海量可能。",
    calculation: "N = [26! / (6! × 10! × 2¹⁰)] × P(8, 3) × 2 × 26⁴ = 46,289,896,079,431,036,032,000。p = 1/N",
    assumptions: "反射器、接线和转子环设置已知。计数配置包括从八个转子中有序选择三个、一个 Beta 或 Gamma 希腊转子、四个转子各自 26 个起始位置之一，以及恰好 10 根插线连接 20 个字母，余下六个字母不连接。反射器固定。所有机械上可行的转子顺序均计入，不考虑历史操作限制。实际密码强度还取决于攻击方法和消息背景。",
  },

  "enigma-i-two-unknown-rings": {
    title: "两个转子环未知时猜中 Enigma I 设置",
    shortTitle: "Enigma I，两个转子环未知",
    explanation: "让 Enigma I 的两个转子环设置保持未知，这两个隐藏设置会让本已庞大的转子和插线板可能范围进一步倍增。一次猜测必须找到准确组合。",
    calculation: "N = 158,962,555,217,826,360,000 × 26² = 107,458,687,327,250,619,360,000。p = 1/N",
    assumptions: "左转子环固定在已知基准，因为其等效偏移已吸收到起始位置约定中。中、右转子环各有 26 种设置。反射器和接线已知。其余配置包括从五个转子中有序选择三个、各转子 26 个起始位置之一，以及恰好 10 根插线连接 20 个字母，余下六个不连接。所有机械上可行的转子顺序均计入，不考虑历史操作限制。实际密码强度还取决于攻击方法和消息背景。",
  },

  "enigma-m3-after-clues": {
    title: "获得 Banburismus 线索后猜中 Enigma M3 设置",
    shortTitle: "获得 Banburismus 线索后的 M3",
    explanation: "在 Tony Sale 的 Banburismus 示例中，线索把可能的转子顺序从 336 种缩小到约 20 种。起始位置和插线板仍为一次猜测留下庞大的范围。",
    calculation: "N = [26! / (6! × 10! × 2¹⁰)] × 20 × 26³ = 52,987,518,405,942,120,000。p = 1/N。相对全部 336 种顺序的变化 = 10 log₁₀[(890,190,309,219,827,616,000 − 1) / (52,987,518,405,942,120,000 − 1)] ≈ +12.3 dBan",
    assumptions: "反射器、接线和转子环设置已知。假定正确顺序仍在 20 个等可能转子顺序中。每个转子有 26 个起始位置。恰好 10 根插线连接 20 个字母，六个字母不连接。缩减至 20 个仅为示例，会随截获信息而变。实际密码强度还取决于攻击方法和消息背景。",
  },
} satisfies LandmarkCopyFamily;
