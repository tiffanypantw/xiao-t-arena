/**
 * L2S1-W4 content — generated 2026-10-12 from Tiffany's「L2W4 小T財商概念競技場:完整上架包」
 *
 * 課程:L2 主題課 13-15|商業與市場(第一季)
 * 主題:毛利分析師(毛利與毛利率:賣得多,不等於留得多)
 *
 * 上架設定(沿用 L2S1 W1–W3 的 recipe):
 *  - 學習道路主題「商業與市場」(themeId: l2-s1)的第 4 關,weekNumber = 204(道路週 = 200 + n)
 *  - 題型:9 選擇 + 1 是非 + 開放題 1 題(評鑑層,走老師後台審核 → 徽章)
 *  - 上架包的 answer 已是選項全文,直接沿用
 *  - Q5 回顧 W3 供需,不加【回顧】標籤
 *  - rewardId 用 'B-L2Q1-W04' / 'C-L2Q1-W04'
 *  - published: false(草稿,要從 /admin/content/204 手動發佈)
 */

const quizQuestions = [
  // ---------- 記憶層(3 題) ----------
  {
    id: 1,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'multiple_choice',
    question: '營收減掉直接成本之後剩下的錢,叫做什麼?',
    options: ['毛利', '營收', '店租', '零用錢'],
    answer: '毛利',
    explanation:
      '毛利 = 營收 − 直接成本。它是一門生意扣掉「每做一個都要花的錢」之後,第一道留下來的錢。',
  },
  {
    id: 2,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'multiple_choice',
    question: 'Gross Margin 的中文是什麼?',
    options: ['毛利率', '營收', '直接成本', '價格'],
    answer: '毛利率',
    explanation:
      'Gross Margin 是毛利率,也就是毛利佔營收的比例。Gross Profit 是毛利,Revenue 是營收。',
  },
  {
    id: 3,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'true_false',
    question: '是非題:一杯飲料的杯子、茶葉、珍珠,屬於直接成本。',
    answer: true,
    explanation:
      '對。直接成本是每做一個商品就要花的錢。每做一杯飲料,就要用掉一個杯子、一份茶葉和一份珍珠。',
  },

  // ---------- 理解層(4 題) ----------
  {
    id: 4,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: '一家店的毛利率是 60%,這代表什麼?',
    options: [
      '每賣 100 元,扣掉直接成本後留下 60 元',
      '這家店一年賺了 60 元',
      '每賣 100 元,直接成本是 60 元',
      '這家店的東西賣 60 元',
    ],
    answer: '每賣 100 元,扣掉直接成本後留下 60 元',
    explanation:
      '毛利率 = 毛利 ÷ 營收。60% 的意思是:每收進 100 元,付完直接成本還剩 60 元。',
  },
  {
    id: 5,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question:
      '上週我們學到供需。2024 年台積電的毛利率是 56.12%,鴻海是 6.25%。用供需來解釋,哪一句最合理?',
    options: [
      '能做最先進晶片的公司很少、想要的客戶很多,所以價格撐得住',
      '台積電的員工比較努力',
      '鴻海的東西賣得比較少',
      '毛利率高低是隨機的',
    ],
    answer: '能做最先進晶片的公司很少、想要的客戶很多,所以價格撐得住',
    explanation:
      '供給少、需求多,價格就撐得住,毛利率也比較高。能做大量組裝的工廠比較多,大家搶訂單,價格就壓得比較緊。兩家公司做的事情不同,毛利率自然不同。',
  },
  {
    id: 6,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: '小明說:「鴻海營收比台積電大兩倍多,所以鴻海留下的錢一定比較多。」哪一句最能回應他?',
    options: [
      '營收大不等於留得多,還要看毛利率',
      '他說得對,營收大就一定留得多',
      '營收和毛利是同一件事',
      '只要看員工人數就知道',
    ],
    answer: '營收大不等於留得多,還要看毛利率',
    explanation:
      '2024 年鴻海毛利約 4,289 億元,台積電毛利約 1.6 兆元。營收大兩倍多,毛利卻只有約四分之一。賣得多,不等於留得多。',
  },
  {
    id: 7,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: '阿T 茶飲一杯 60 元,毛利 40 元。為什麼最後一杯只留下 8 元?',
    options: [
      '毛利之後,還要付店租、薪水、水電這些成本',
      '因為毛利算錯了',
      '因為茶葉漲價了',
      '因為客人殺價',
    ],
    answer: '毛利之後,還要付店租、薪水、水電這些成本',
    explanation:
      '毛利只扣掉直接成本。店租、薪水、水電不管賣幾杯都要付,40 元付掉 32 元之後,才剩下 8 元。毛利是第一道關卡。',
  },

  // ---------- 應用層(3 題) ----------
  {
    id: 8,
    block: '實際應用',
    bloom: 'apply',
    type: 'multiple_choice',
    question: '小美的雞排一塊賣 80 元,直接成本 35 元。她的毛利率大約是多少?',
    options: ['約 56%', '約 44%', '35%', '80%'],
    answer: '約 56%',
    explanation:
      '毛利 = 80 − 35 = 45 元;毛利率 = 45 ÷ 80 ≈ 56%。約 44% 是直接成本佔價格的比例,剛好反過來。',
  },
  {
    id: 9,
    block: '實際應用',
    bloom: 'apply',
    type: 'multiple_choice',
    question:
      '你的飲料攤一杯 35 元,直接成本 11 元。改用鮮奶後,直接成本多 8 元。毛利率會變成大約多少?',
    options: ['約 46%', '約 69%', '約 54%', '約 23%'],
    answer: '約 46%',
    explanation:
      '改用鮮奶後直接成本 19 元,毛利 = 35 − 19 = 16 元,毛利率 = 16 ÷ 35 ≈ 46%。原本是約 69%,一個選擇就讓毛利率少了二十多個百分點。',
  },
  {
    id: 10,
    block: '實際應用',
    bloom: 'apply',
    type: 'multiple_choice',
    question:
      '小華想讓自己手作書籤的毛利率變高。哪一個做法「一定」會讓毛利率變高(假設賣得出去)?',
    options: [
      '價格不變,把直接成本降低',
      '價格不變,改用更貴的紙',
      '價格降低,直接成本不變',
      '多做一點,價格和直接成本都不變',
    ],
    answer: '價格不變,把直接成本降低',
    explanation:
      '毛利率 = (價格 − 直接成本)÷ 價格。價格不變、直接成本降低,毛利變大,毛利率就變高。多做一點會讓毛利總額變多,毛利率卻不變。',
  },
];

const openQuestion =
  '園遊會的 B 攤用鮮奶和現煮配料,毛利率只有約 29%,A 攤是 60%。如果你是 B 攤的老闆,你會繼續用好材料嗎?說說你的理由,以及你會怎麼讓這個選擇值得。提示:想一想,好材料可能帶來什麼?客人會不會願意多付錢、會不會回來再買?';

const taskDescription = `替一樣你熟悉的商品做一張毛利試算表,看看它每賣 100 元留下多少。

選一樣你熟悉的商品:飲料、雞排、文具、手作小物都可以。
寫下價格,列出至少 3 項直接成本並估出金額(估的數字標上「估」),用公式算出毛利與毛利率。
最後寫一句分析:如果要讓毛利率變高,可以從哪裡著手?這樣做可能會付出什麼代價?

【請回答這四題】
① 你選了什麼商品?它賣多少錢?
　拍一張照片,或直接寫下名字和價格。
　例:夜市雞排,一塊 80 元
② 列出至少 3 項直接成本,每一項估一個金額
　可以上網查原料價格,或問家裡的大人。估的數字標上「估」。
　例:雞肉 25 元(估)、炸粉與油 6 元(估)、紙袋 4 元(估)
③ 算出毛利與毛利率
　毛利 = 價格 − 直接成本;毛利率 = 毛利 ÷ 價格。
　例:毛利 80 − 35 = 45 元,毛利率 45 ÷ 80 ≈ 56%
④ 如果要讓毛利率變高,可以從哪裡著手?這樣做可能會付出什麼代價?
　想一想價格與直接成本兩個方向,再想想客人的感受。
　例:換便宜一點的炸油可以降低成本,可能會讓雞排沒那麼好吃。

🔍 從哪裡找:
🧋 學校附近的手搖飲店菜單
🍗 夜市或小吃攤的招牌品項
🏪 便利商店的熱食與飲料
✏️ 文具店的筆記本和筆
🛍️ 網路上的手作小物店
📰 新聞裡提到的「毛利率」

格式:文字、照片、截圖、畫圖都可以。至少 1 個商品,四題都要回答。老師會親自回覆你。`;

export const L2S1_W4_BADGE_DATA = {
  rewardId: 'B-L2Q1-W04',
  type: 'badge',
  name: '毛利分析師',
  nameEn: 'Margin Analyst',
  description:
    '完成「商業與市場」第一季 W4 的 10 題概念練習 + 開放題通過老師審核 → 解鎖。你學會了分辨營收和毛利:賣得多,不等於留得多。',
  weekLabel: 'W4',
  chapter: 'L2 商業與市場 · 第一季',
  earnedFromWeek: 204,
  earnedVia: 'quiz-approval',
  image: '/images/L2W4_Badge_毛利分析師_MarginAnalyst_L2S1.png',
};

export const L2S1_W4_CARD_DATA = {
  rewardId: 'C-L2Q1-W04',
  type: 'card',
  name: '留下來的那一塊',
  nameEn: 'The Part That Stays',
  cardNumber: 'L2Q1-W04-001',
  rarity: 'Rare ★★',
  description: '完成 W4 毛利試算表任務 + 老師親自回覆 → 解鎖。「賣得多,不等於留得多。」',
  weekLabel: 'W4',
  chapter: 'L2 商業與市場 · 第一季',
  earnedFromWeek: 204,
  earnedVia: 'task-approval',
  image: '/images/L2W4_Card_留下來的那一塊_ThePartThatStays_L2S1.png',
};

export const L2S1_W4_WEEK_DATA = {
  weekNumber: 204,
  title: '商業與市場 · W4',
  quarter: 1,
  chapter: 'L2S1',
  question: '賣得多,就一定留得多嗎?',

  themeId: 'l2-s1',
  roadWeek: 4,

  hasQuiz: true,
  hasOpenQuestion: true,
  hasTask: true,

  videoUrl: null,
  videoCaption: null,

  quizQuestions,

  openQuestion,
  openQuestionMinChars: 50,

  taskTitle: '毛利分析師 · 出任務',
  taskDescription,
  taskMinChars: 50,

  badgeId: L2S1_W4_BADGE_DATA.rewardId,
  cardId: L2S1_W4_CARD_DATA.rewardId,

  published: false, // 草稿 — 之後到 /admin/content/204 改成 true
};
