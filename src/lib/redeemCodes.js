// 兌換碼資料庫
// type: 'badge' 或 'card'
// maxUses: 每個碼最多使用次數
// reward: 獎勵的 ID

export const REDEEM_CODES = {
  // ==================
  // 徽章碼 — 交換提問者 (Week 1)
  // ==================
  "B-EQ-K1U8": { type: "badge", rewardId: "badge-exchange-questioner", maxUses: 5 },
  "B-EQ-J9T1": { type: "badge", rewardId: "badge-exchange-questioner", maxUses: 5 },
  "B-EQ-H8S2": { type: "badge", rewardId: "badge-exchange-questioner", maxUses: 5 },
  "B-EQ-G7R3": { type: "badge", rewardId: "badge-exchange-questioner", maxUses: 5 },
  "B-EQ-F6Q4": { type: "badge", rewardId: "badge-exchange-questioner", maxUses: 5 },
  "B-EQ-E5P5": { type: "badge", rewardId: "badge-exchange-questioner", maxUses: 5 },
  "B-EQ-D4N6": { type: "badge", rewardId: "badge-exchange-questioner", maxUses: 5 },
  "B-EQ-B2L8": { type: "badge", rewardId: "badge-exchange-questioner", maxUses: 5 },
  "B-EQ-C3M7": { type: "badge", rewardId: "badge-exchange-questioner", maxUses: 5 },
  "B-EQ-A1K9": { type: "badge", rewardId: "badge-exchange-questioner", maxUses: 5 },

  // ==================
  // 卡片碼 — 交換卡關點
  // ==================
  "C-EF-K1U8": { type: "card", rewardId: "card-exchange-bottleneck", maxUses: 5 },
  "C-EF-J9T1": { type: "card", rewardId: "card-exchange-bottleneck", maxUses: 5 },
  "C-EF-H8S2": { type: "card", rewardId: "card-exchange-bottleneck", maxUses: 5 },
  "C-EF-G7R3": { type: "card", rewardId: "card-exchange-bottleneck", maxUses: 5 },
  "C-EF-F6Q4": { type: "card", rewardId: "card-exchange-bottleneck", maxUses: 5 },
  "C-EF-E5P5": { type: "card", rewardId: "card-exchange-bottleneck", maxUses: 5 },
  "C-EF-D4N6": { type: "card", rewardId: "card-exchange-bottleneck", maxUses: 5 },
  "C-EF-C3M7": { type: "card", rewardId: "card-exchange-bottleneck", maxUses: 5 },
  "C-EF-B2L8": { type: "card", rewardId: "card-exchange-bottleneck", maxUses: 5 },
  "C-EF-A1K9": { type: "card", rewardId: "card-exchange-bottleneck", maxUses: 5 },
};

// 獎勵內容定義
export const REWARDS = {
  // 徽章
  "badge-exchange-questioner": {
    type: "badge",
    name: "交換提問者",
    description: "完成 Week 1 財商概念測驗，理解交換的本質",
    week: 1,
    image: null, // 之後加入圖片
  },

  // 卡片
  "card-exchange-bottleneck": {
    type: "card",
    name: "交換的卡關點",
    description: "合作始於交換：我有什麼？需求未合、時間未合、價值難量",
    image: null, // 之後加入圖片
  },
};

// 週次定義（控制首頁顯示）
export const WEEKS = [
  {
    id: "week1",
    title: "Week 1",
    question: "如果世界沒有錢，真的會更公平嗎？",
    badgeId: "badge-exchange-questioner",
    route: "/Week1Practice",
    available: true,
  },
  {
    id: "week2",
    title: "Week 2",
    question: "價格是什麼？它跟價值一樣嗎？",
    badgeId: null, // 之後加入
    route: "/Week2Practice",
    available: false, // 鎖住
  },
  {
    id: "week3",
    title: "Week 3",
    question: "為什麼有些東西貴但大家還是搶著買？",
    badgeId: null,
    route: "/Week3Practice",
    available: false,
  },
];