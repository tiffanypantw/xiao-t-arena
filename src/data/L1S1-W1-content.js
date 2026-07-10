/**
 * L1S1-W1 content — generated 2026-07-10 from Tiffany's「L1 第一季 W1 完整上架包」
 *
 * 課程:L1 主題課 10-12｜我的零用錢,我作主(第一季)
 * 主題:新鮮感觀察員(新鮮感的保存期限)
 *
 * 上架選擇(2026-07-10):
 *  - 這是「學習道路」主題(themeId: l1-g1,已改名為「我的零用錢,我作主」)的第 1 關
 *  - weekNumber 用 101(= 100 + 道路第 1 關),避免跟舊第一季 W1–W12 撞號
 *    → 學生看到的都是「W1」,系統內部存 101
 *  - 題型:選擇 5 題 + 是非 1 題 + 配對 1 題 + 簡答 2 題 + 圖文 1 題
 *    簡答/圖文題作答後存進 weeklyProgress.quizTextAnswers,老師在後台審核時看得到
 *  - rewardId 用上架包的 'B-L1S1-W01' / 'C-L1S1-W01'
 *  - published: false(草稿,要從 /admin/content/101 手動發佈)
 *  - 徽章/卡片圖檔:還沒做,路徑先照上架包檔名預留(放進 public/images/ 即接上)
 */

const quizQuestions = [
  // ---------- 記憶層(3 題) ----------
  {
    id: 1,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'multiple_choice',
    question: '「新鮮感」是什麼?',
    options: [
      '新東西給的開心,在剛得到的時候最強',
      '東西放在冰箱裡的天數',
      '標籤上的數字',
      '同學有沒有稱讚你',
    ],
    answer: '新東西給的開心,在剛得到的時候最強',
    explanation: '新鮮感是新東西剛到手時最強的那股開心。我們用 0 到 10 分幫它量體溫。',
  },
  {
    id: 2,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'true_false',
    question: '是非題:買的東西開心退燒了,代表你買錯了、很浪費。',
    answer: false,
    explanation: '開心會退燒很正常,大腦天生對「新」興奮、習慣了就安靜下來。觀察員的工作是看見它,沒有人做錯事。',
  },
  {
    id: 3,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'matching',
    question: '配對題:把每個詞連到正確的描述。',
    pairs: [
      { left: '新鮮感', right: '剛得到時最強的開心' },
      { left: '退燒', right: '開心隨時間慢慢變淡' },
      { left: '保存期限', right: '這份開心大概能維持多久' },
    ],
    explanation: '三個詞連起來就是本週的故事:新鮮感會退燒,每樣東西的保存期限不一樣。',
  },

  // ---------- 理解層(4 題) ----------
  {
    id: 4,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: '為什麼超想要的東西,到手一個月後常常就沒感覺了?',
    options: [
      '東西壞掉了',
      '大腦對「新」特別興奮,習慣了之後就安靜下來',
      '同學偷偷換走了它',
      '因為它變便宜了',
    ],
    answer: '大腦對「新」特別興奮,習慣了之後就安靜下來',
    explanation: '東西沒變,變的是大腦的反應。「新」的感覺過去了,興奮就降回平常,這是全人類共同的設計。',
  },
  {
    id: 5,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: '小美發現爸爸的新手機第一週連吃飯都在摸,一個月後就放在旁邊了。這說明什麼?',
    options: [
      '爸爸不喜歡那支手機了',
      '手機品質變差了',
      '開心退燒是大人小孩都有的正常現象',
      '爸爸應該再買一支新的',
    ],
    answer: '開心退燒是大人小孩都有的正常現象',
    explanation: '開心退燒全人類通用。看見大人也一樣,你就知道這是大腦的運作方式,跟年齡沒有關係。',
  },
  {
    id: 6,
    block: '概念理解',
    bloom: 'understand',
    type: 'text',
    grading: 'teacher_light',
    minChars: 10,
    question: '舉例題:寫一樣你「開心退得很慢」的東西,用一句話說它為什麼耐放。',
    placeholder: '例:我的水壺,每天都用它,每次用開心就補一點回來。',
    explanation: '退得慢的東西通常一直在為你做事。每次使用,開心就補一點,所以保存期限特別長。',
  },
  {
    id: 7,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: '預測題:小華今天買了班上最新流行的盲盒吊飾,開心 10 分。照本週學的,一個月後最可能是幾分?',
    options: [
      '還是 10 分,流行小物永遠保鮮',
      '大約 2 到 4 分,因為它的工作主要是「新」',
      '變成 15 分,越放越開心',
      '0 分,而且小華會大哭一場',
    ],
    answer: '大約 2 到 4 分,因為它的工作主要是「新」',
    explanation: '收集型流行小物的保存期限常常只有兩三個星期,因為它最主要的工作就是「新」。「新」過期,它就下班了。',
  },

  // ---------- 應用層(2 題) ----------
  {
    id: 8,
    block: '實際應用',
    bloom: 'apply',
    type: 'multiple_choice',
    question: '你現在超想要班上新流行的小物,溫度 10 分。照主課教的,Tiffany 老師會建議你先問自己哪個問題?',
    options: [
      '同學會借我嗎?',
      '我的超想要,是對這個東西,還是對「新」的感覺?',
      '它以後會漲價嗎?',
      '我可以跟爸媽多要多少零用錢?',
    ],
    answer: '我的超想要,是對這個東西,還是對「新」的感覺?',
    explanation: '這是觀察員的第一個問題。分清楚想要的是東西本身,還是「新」的感覺,再決定也不遲。',
  },
  {
    id: 9,
    block: '實際應用',
    bloom: 'apply',
    type: 'text',
    grading: 'teacher_light',
    minChars: 15,
    question: '情境練習:小李每一波流行都買,每次三個星期就退燒,零用錢常常月初就花光。請用「新鮮感追蹤卡」的做法,寫一句你會給小李的建議。',
    placeholder: '例:小李,買之前先翻你上一張追蹤卡,看看上次的保存期限多長,再決定這次要花多少。',
    explanation: '這題沒有標準答案。重點是把過去的紀錄拿出來當參考,讓小李自己看見自己的模式,決定權還是在他手上。',
  },

  // ---------- 分析層(1 題,老師批改) ----------
  {
    id: 10,
    block: '觀察員挑戰',
    bloom: 'analyze',
    type: 'text_or_image',
    grading: 'teacher',
    minChars: 20,
    question: '比較題:從你的房間找兩樣東西,一樣「開心退得快」,一樣「開心退得慢」。各用兩句話分析為什麼,可以拍照或畫圖。',
    placeholder: '例:退得快:上一波流行卡片(工作只有「新」,三週就進抽屜)/退得慢:腳踏車(每天載我上學,開心一直補回來)。',
    explanation: '能分析出「退得快慢的原因」,你就是真正的新鮮感觀察員了。這題老師會親自回覆你。',
  },
];

const taskDescription = `這週你是新鮮感觀察員。找一樣你以前「超想要、也真的得到」的東西 — 買的、生日收到的都可以。用主課教的「新鮮感追蹤卡」記下它的開心溫度變化,拍照上傳。

沒有人買錯東西,老師想看的是你「看見」的能力,我會親自回覆你。

【記錄這三件事】
① 它是什麼?剛拿到那天,開心幾分?(0 到 10)
　例:上個月買的流行吊飾,剛拿到那天 10 分,走路都在轉它。
② 現在再量一次,剩幾分?你覺得為什麼?
　誠實量就好,分數變低很正常、分數沒變也很棒,寫下你的觀察。
　例:現在剩 3 分,因為班上不流行了,我也很少拿出來。
③ 它的新鮮感保存期限,大概是多久?
　(幾天/兩三個星期/幾個月/到現在還在保鮮中)用你的兩次溫度猜猜看,沒有標準答案。

🔍 從哪裡找:
🗄 抽屜和櫃子深處:那些曾經超想要、現在很少碰的東西
🎒 書包和鉛筆盒:上一波流行時你入手的小物
🧸 床邊和書架:生日或節日收到的禮物
🚲 每天都在用的東西:腳踏車、水壺、常穿的外套(退得慢的也算!)
📱 平板或手機裡:以前吵著要買的 App 或遊戲

格式:文字、照片、畫圖都可以。至少記錄 1 樣東西,三題都要寫。`;

export const L1S1_W1_BADGE_DATA = {
  rewardId: 'B-L1S1-W01',
  type: 'badge',
  name: '新鮮感觀察員',
  nameEn: 'Freshness Observer',
  description:
    '完成「我的零用錢,我作主」第一季 W1 的 10 題概念練習 + 老師審核通過 → 解鎖。你學會了:新鮮感在剛得到時最強、開心會退燒很正常、每樣東西的保存期限不一樣。',
  weekLabel: 'W1',
  chapter: 'L1 我的零用錢,我作主 · 第一季',
  earnedFromWeek: 101,
  earnedVia: 'quiz-approval',
  image: '/images/L1W1_Badge_新鮮感觀察員_FreshnessObserver_L1S1.png',
};

export const L1S1_W1_CARD_DATA = {
  rewardId: 'C-L1S1-W01',
  type: 'card',
  name: '觀察員的溫度計',
  nameEn: "OBSERVER'S THERMOMETER",
  cardNumber: 'L1S1-W01-001',
  rarity: 'Rare ★★',
  description:
    '完成 W1 新鮮感追蹤卡任務 + 老師親自回覆 → 解鎖。「開心會退燒,知道它會退的人,錢會花得更聰明。」',
  weekLabel: 'W1',
  chapter: 'L1 我的零用錢,我作主 · 第一季',
  earnedFromWeek: 101,
  earnedVia: 'task-approval',
  image: '/images/L1W1_Card_觀察員的溫度計_L1S1.png',
};

export const L1S1_W1_WEEK_DATA = {
  weekNumber: 101,
  title: '我的零用錢,我作主 · W1',
  quarter: 1,
  chapter: 'L1S1',
  question: '超想要的那股開心,可以保鮮多久?',

  // 學習道路主題週的標記:
  themeId: 'l1-g1', // 對應 arenaStructure / unlockedThemes 的主題 id
  roadWeek: 1, // 道路上的第幾關(學生看到的 W1)

  hasQuiz: true,
  hasOpenQuestion: false, // 簡答題已內建在練習題裡(quizTextAnswers)
  hasTask: true,

  videoUrl: null,
  videoCaption: null,

  quizQuestions,

  openQuestion: null,
  openQuestionMinChars: 30,

  taskTitle: '新鮮感觀察員 · 出任務',
  taskDescription,
  taskMinChars: 50,

  badgeId: L1S1_W1_BADGE_DATA.rewardId,
  cardId: L1S1_W1_CARD_DATA.rewardId,

  published: false, // 草稿 — 之後到 /admin/content/101 改成 true
};
