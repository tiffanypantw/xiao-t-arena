/**
 * L2S1-W6 content — generated 2026-10-14 from Tiffany's「L2W6 小T財商概念競技場:完整上架包」
 *
 * 課程:L2 主題課 13-15|商業與市場(第一季)
 * 主題:報酬率評估員(投資報酬率:回不回本)
 *
 * 上架設定(沿用 L2S1 W1–W5 的 recipe):
 *  - 學習道路主題「商業與市場」(themeId: l2-s1)的第 6 關,weekNumber = 206(道路週 = 200 + n)
 *  - 題型:9 選擇 + 1 是非 + 開放題 1 題(評鑑層,走老師後台審核 → 徽章)
 *  - 上架包的 answer 已是選項全文,直接沿用
 *  - Q7 回顧 W4 毛利率,不加【回顧】標籤
 *  - rewardId 用 'B-L2Q1-W06' / 'C-L2Q1-W06'
 *  - published: false(草稿,要從 /admin/content/206 手動發佈)
 */

const quizQuestions = [
  // ---------- 記憶層(3 題) ----------
  {
    id: 1,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'multiple_choice',
    question: '投資報酬率的公式是哪一個?',
    options: [
      '(回收 − 投入)÷ 投入',
      '(回收 − 投入)÷ 回收',
      '回收 + 投入',
      '投入 ÷ 回收',
    ],
    answer: '(回收 − 投入)÷ 投入',
    explanation:
      '投資報酬率 =(回收 − 投入)÷ 投入。分母是投入,所以它回答的是:每投入 100 元,多回來多少。',
  },
  {
    id: 2,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'multiple_choice',
    question: 'ROI 是哪一個詞的縮寫?',
    options: ['Return on Investment', 'Rate of Income', 'Revenue on Item', 'Return of Interest'],
    answer: 'Return on Investment',
    explanation: 'ROI 是 Return on Investment,中文是投資報酬率。',
  },
  {
    id: 3,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'true_false',
    question: '是非題:時間也是一種投入。',
    answer: true,
    explanation:
      '對。擺攤花了兩個週末,做書籤花了 10 小時,這些時間本來可以做別的事,也是投入。',
  },

  // ---------- 理解層(4 題) ----------
  {
    id: 4,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: '一筆投入的報酬率是 20%,這代表什麼?',
    options: [
      '每投入 100 元,多回來 20 元',
      '每投入 100 元,只回來 20 元',
      '一共賺了 20 元',
      '花了 20 小時',
    ],
    answer: '每投入 100 元,多回來 20 元',
    explanation:
      '投入 3,000 元、回收 3,600 元,多回來 600 元;600 ÷ 3,000 = 20%,也就是每投入 100 元,多回來 20 元。',
  },
  {
    id: 5,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: '方案 A 報酬率 20%、賺 600 元;方案 B 報酬率 80%、賺 400 元。哪一句說得對?',
    options: [
      '報酬率高的是 B,賺得多的是 A,兩個數字要一起看',
      'B 報酬率比較高,所以 B 一定賺得比較多',
      'A 賺得比較多,所以 A 的報酬率一定比較高',
      '報酬率和賺到的錢是同一件事',
    ],
    answer: '報酬率高的是 B,賺得多的是 A,兩個數字要一起看',
    explanation:
      '報酬率讓大小不同的投入可以比較;賺到的金額告訴你實際多了多少。B 投入少、比例高;A 投入多、金額大。',
  },
  {
    id: 6,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: '品妍為了擺攤,放掉了兩個週末的樂團練團。練團是什麼?',
    options: ['時間的機會成本', '回收', '報酬率', '直接成本'],
    answer: '時間的機會成本',
    explanation:
      '花掉的時間本來可以做別的事。品妍放掉的下一個最好選擇是練團,這就是時間的機會成本。',
  },
  {
    id: 7,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: 'W4 的毛利率和這週的報酬率,分母各是什麼?',
    options: [
      '毛利率的分母是營收,報酬率的分母是投入',
      '兩個的分母都是營收',
      '兩個的分母都是投入',
      '毛利率的分母是投入,報酬率的分母是營收',
    ],
    answer: '毛利率的分母是營收,報酬率的分母是投入',
    explanation:
      '毛利率是「每賣 100 元留下多少」,報酬率是「每投入 100 元多回來多少」。分母不同,回答的問題也不同。',
  },

  // ---------- 應用層(3 題) ----------
  {
    id: 8,
    block: '實際應用',
    bloom: 'apply',
    type: 'multiple_choice',
    question: '你花 2,000 元買舊腳踏車和零件,修好後賣了 2,600 元。報酬率是多少?',
    options: ['30%', '23%', '60%', '130%'],
    answer: '30%',
    explanation: '(2,600 − 2,000)÷ 2,000 = 600 ÷ 2,000 = 30%。約 23% 是用回收當分母算錯的結果。',
  },
  {
    id: 9,
    block: '實際應用',
    bloom: 'apply',
    type: 'multiple_choice',
    question: '修腳踏車一共花了 6 小時,賺了 600 元。每小時換到多少?',
    options: ['100 元', '60 元', '360 元', '30 元'],
    answer: '100 元',
    explanation: '600 ÷ 6 = 100 元。把時間算進去,是比較兩個選擇的另一把尺。',
  },
  {
    id: 10,
    block: '實際應用',
    bloom: 'apply',
    type: 'multiple_choice',
    question: '擺攤賺 600 元、花 16 小時;做書籤賺 400 元、花 10 小時。每小時換到比較多的是哪一個?',
    options: ['做書籤,每小時 40 元', '擺攤,每小時 37.5 元', '兩個一樣', '擺攤,每小時 600 元'],
    answer: '做書籤,每小時 40 元',
    explanation:
      '擺攤 600 ÷ 16 = 37.5 元;書籤 400 ÷ 10 = 40 元。書籤每小時換到的比較多,擺攤賺到的總金額比較多。',
  },
];

const openQuestion =
  '方案 A 擺攤:報酬率 20%、賺 600 元、花 16 小時。方案 B 手作書籤:報酬率 80%、賺 400 元、花 10 小時。如果是你,你會選哪一個?除了錢,你還考慮了什麼?你的選擇放掉了什麼?提示:想一想,你比較在意報酬率、賺到的金額,還是時間?這段時間你本來可以做什麼?';

const taskDescription = `替兩個你正在考慮的選擇,各算一次報酬率和每小時換到多少。

想兩個你正在考慮、或曾經考慮過的選擇,都要投入錢或時間。
替兩個選擇各寫下投入多少錢、回收多少錢、花多少時間(用估的就標「估」),再各算一次報酬率和每小時換到多少。
最後寫一句判斷:你會選哪一個?除了錢,它還會帶給你什麼?它的機會成本是什麼?

【請回答這四題】
① 你在比較哪兩個選擇?
　兩個想擺的攤、兩種賺零用錢的方式、兩個想報名的營隊都可以。
　例:方案 A 園遊會賣飲料;方案 B 網路賣手作書籤
② 兩個選擇各投入多少錢、回收多少錢、花多少時間?
　估的數字標上「估」。
　例:A 投入 1,500、回收 1,800、8 小時(估);B 投入 300、回收 600、6 小時(估)
③ 各算一次報酬率和每小時換到多少
　報酬率 =(回收 − 投入)÷ 投入;每小時 =(回收 − 投入)÷ 小時
　例:A 報酬率 20%、每小時 37.5 元;B 報酬率 100%、每小時 50 元
④ 你會選哪一個?除了錢還考慮了什麼?它的機會成本是什麼?
　想一想學到的經驗、你的時間,以及放掉的下一個最好選擇。
　例:我選 B,因為段考快到了;機會成本是跟朋友一起擺攤的經驗

🔍 從哪裡找:
🎪 園遊會或市集想擺的攤
✂️ 手作小物、二手書、舊玩具
🚲 修好再賣的舊東西
🏕️ 兩個想報名的營隊或課程
📦 幫同學團購或代購
📰 新聞裡的「回本」「報酬率」

格式:文字、照片、截圖、畫圖都可以。至少 1 組比較,四題都要回答。老師會親自回覆你。`;

export const L2S1_W6_BADGE_DATA = {
  rewardId: 'B-L2Q1-W06',
  type: 'badge',
  name: '報酬率評估員',
  nameEn: 'ROI Evaluator',
  description:
    '完成「商業與市場」第一季 W6 的 10 題概念練習 + 開放題通過老師審核 → 解鎖。你學會了算投資報酬率,也把時間放進來一起比較:花出去的,回來多少。',
  weekLabel: 'W6',
  chapter: 'L2 商業與市場 · 第一季',
  earnedFromWeek: 206,
  earnedVia: 'quiz-approval',
  image: '/images/L2W6_Badge_報酬率評估員_ROIEvaluator_L2S1.png',
};

export const L2S1_W6_CARD_DATA = {
  rewardId: 'C-L2Q1-W06',
  type: 'card',
  name: '回來了多少',
  nameEn: 'WHAT CAME BACK',
  cardNumber: 'L2Q1-W06-001',
  rarity: 'Rare ★★',
  description: '完成 W6 兩個方案比較任務 + 老師親自回覆 → 解鎖。「報酬率:花出去的,回來多少。」',
  weekLabel: 'W6',
  chapter: 'L2 商業與市場 · 第一季',
  earnedFromWeek: 206,
  earnedVia: 'task-approval',
  image: '/images/L2W6_Card_回來了多少_WhatCameBack_L2S1.png',
};

export const L2S1_W6_WEEK_DATA = {
  weekNumber: 206,
  title: '商業與市場 · W6',
  quarter: 1,
  chapter: 'L2S1',
  question: '花出去的錢和時間,回來了多少?',

  themeId: 'l2-s1',
  roadWeek: 6,

  hasQuiz: true,
  hasOpenQuestion: true,
  hasTask: true,

  videoUrl: null,
  videoCaption: null,

  quizQuestions,

  openQuestion,
  openQuestionMinChars: 50,

  taskTitle: '報酬率評估員 · 出任務',
  taskDescription,
  taskMinChars: 50,

  badgeId: L2S1_W6_BADGE_DATA.rewardId,
  cardId: L2S1_W6_CARD_DATA.rewardId,

  published: false, // 草稿 — 之後到 /admin/content/206 改成 true
};
