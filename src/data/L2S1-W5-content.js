/**
 * L2S1-W5 content — generated 2026-10-13 from Tiffany's「L2W5 小T財商概念競技場:完整上架包」
 *
 * 課程:L2 主題課 13-15|商業與市場(第一季)
 * 主題:商業模式拆解師(免費的代價與商業模式:免費的東西,誰在付錢?)
 *
 * 上架設定(沿用 L2S1 W1–W4 的 recipe):
 *  - 學習道路主題「商業與市場」(themeId: l2-s1)的第 5 關,weekNumber = 205(道路週 = 200 + n)
 *  - 題型:9 選擇 + 1 是非 + 開放題 1 題(評鑑層,走老師後台審核 → 徽章)
 *  - 上架包的 answer 已是選項全文,直接沿用
 *  - Q7 回顧 W4 營收與成本,不加【回顧】標籤
 *  - rewardId 用 'B-L2Q1-W05' / 'C-L2Q1-W05'
 *  - published: false(草稿,要從 /admin/content/205 手動發佈)
 */

const quizQuestions = [
  // ---------- 記憶層(3 題) ----------
  {
    id: 1,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'multiple_choice',
    question: '「一門生意的錢從哪裡來、怎麼留下來的設計」叫做什麼?',
    options: ['商業模式', '毛利率', '廣告主', '直接成本'],
    answer: '商業模式',
    explanation:
      '商業模式 Business Model 講的是一門生意怎麼賺錢、錢怎麼留下來。免費的 App 也有商業模式。',
  },
  {
    id: 2,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'multiple_choice',
    question: '基本功能免費,少數人付費升級或買道具。這種模式的英文是什麼?',
    options: ['Freemium', 'Advertiser', 'Gross Margin', 'Revenue'],
    answer: 'Freemium',
    explanation:
      'Freemium 是 Free(免費)加 Premium(進階)組成的字,中文叫免費增值。大部分人免費用,少數人付費撐起整個服務。',
  },
  {
    id: 3,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'true_false',
    question: '是非題:廣告主是付錢買廣告、想讓更多人看見自己東西的人或公司。',
    answer: true,
    explanation: '對。在免費 App 裡,廣告主付錢給 App,換使用者看他的廣告幾秒鐘。',
  },

  // ---------- 理解層(4 題) ----------
  {
    id: 4,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: '你在遊戲裡「看一支廣告,換一把寶石」。這時候,誰付錢給誰?',
    options: [
      '廣告主付錢給遊戲,你付出的是時間和注意力',
      '你付錢給廣告主',
      '遊戲付錢給你',
      '沒有任何人付錢',
    ],
    answer: '廣告主付錢給遊戲,你付出的是時間和注意力',
    explanation:
      '寶石是遊戲送你的,錢是廣告主付給遊戲的。你用 30 秒的注意力,換到了寶石。這就是一筆交換。',
  },
  {
    id: 5,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: '2024 年,Google 的母公司 Alphabet 總收入大約 3,500 億美元。其中大約多少來自廣告?',
    options: ['大約四分之三', '大約十分之一', '大約一半', '幾乎沒有'],
    answer: '大約四分之三',
    explanation:
      '2024 年 Alphabet 的廣告收入大約 2,646 億美元,約佔總收入的 75.6%。搜尋和看影片不收錢,付錢的是廣告主。',
  },
  {
    id: 6,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: 'Unity 2024 年的報告統計,只有 1.83% 的手遊玩家會花錢內購。這代表什麼?',
    options: [
      '每 100 位玩家不到 2 位付錢,少數付錢的人撐起了大家都能免費玩的遊戲',
      '大部分玩家都會花錢',
      '手遊都沒有營收',
      '付錢的人越多,遊戲就越不好玩',
    ],
    answer: '每 100 位玩家不到 2 位付錢,少數付錢的人撐起了大家都能免費玩的遊戲',
    explanation:
      '這就是免費增值的設計。98 位以上的玩家免費玩,少數付錢的玩家加上廣告收入,一起撐起遊戲的營收。',
  },
  {
    id: 7,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: '上週我們學到營收與成本。一款免費遊戲為什麼一定要找到營收?',
    options: [
      '因為工程師、美術、伺服器都是成本,沒有營收就付不出來',
      '因為法律規定遊戲一定要賺錢',
      '因為免費遊戲沒有任何成本',
      '因為玩家一定會付錢',
    ],
    answer: '因為工程師、美術、伺服器都是成本,沒有營收就付不出來',
    explanation:
      '不收玩家的錢,成本還是在。所以免費遊戲要從別的地方找營收:廣告主、少數付費玩家或訂閱會員。',
  },

  // ---------- 應用層(3 題) ----------
  {
    id: 8,
    block: '實際應用',
    bloom: 'apply',
    type: 'multiple_choice',
    question: '「小鯨大冒險」有 100 萬位玩家,2% 付費,平均每人花 500 元。內購營收是多少?',
    options: ['1,000 萬元', '500 萬元', '2 萬元', '5 億元'],
    answer: '1,000 萬元',
    explanation: '100 萬 × 2% = 2 萬人;2 萬 × 500 元 = 1,000 萬元。',
  },
  {
    id: 9,
    block: '實際應用',
    bloom: 'apply',
    type: 'multiple_choice',
    question:
      '每位玩家每天看 3 支廣告,一支 30 秒,一個月 30 天。一位玩家一個月花多少時間看廣告?',
    options: ['45 分鐘', '90 秒', '15 分鐘', '3 小時'],
    answer: '45 分鐘',
    explanation:
      '3 × 30 天 × 30 秒 = 2,700 秒,也就是 45 分鐘。這就是「免費」背後,你付出的時間。',
  },
  {
    id: 10,
    block: '實際應用',
    bloom: 'apply',
    type: 'multiple_choice',
    question:
      '一個影音 App 讓你免費看,但要看廣告;也可以付月費,看影片不用看廣告。它走了哪兩條錢的路?',
    options: ['廣告和訂閱會員', '廣告和內購', '訂閱會員和賣硬體', '只有廣告'],
    answer: '廣告和訂閱會員',
    explanation:
      '免費看靠廣告主付錢,付月費不看廣告是訂閱會員。很多 App 會同時走好幾條路,讓不同的人用不同的方式付錢。',
  },
];

const openQuestion =
  '你最常用的免費 App 是哪一個?你付出了時間、注意力和資料,換到了它的服務。你覺得這筆交換對你划算嗎?說說你的理由,以及你會不會改變使用它的方式。提示:想一想,它帶給你什麼?你一週花多少時間在上面?如果它開始收月費,你會不會付?';

const taskDescription = `拆解一個你常用的免費 App,看看誰在付錢、你又付出了什麼。

選一個你最常用的免費 App 或遊戲。
拆出它靠什麼賺錢,至少 2 條路(廣告、免費增值、訂閱會員或其他),每一條標上「確定」或「我猜的」。
寫下你付出了什麼:一週花了幾小時、用一次看到幾則廣告、它可能知道你哪些事。
最後寫一句判斷:這筆交換對你來說划算嗎?為什麼?

【請回答這四題】
① 你選了哪一個免費 App 或遊戲?
　截一張它的主畫面,或直接寫下名字。
　例:一款我每天玩的跑酷手遊
② 它靠什麼賺錢?至少 2 條路,標上「確定」或「我猜的」
　想一想:有沒有廣告?能不能買東西?有沒有付費會員?
　例:廣告(確定,每關結束都會跳廣告);賣造型(確定,商店有賣);訂閱(我猜的)
③ 你付出了什麼?時間、注意力、資料各寫一句
　打開手機的「螢幕使用時間」看看一週花了多少。
　例:一週約 5 小時;玩一次看到 4 則廣告;它知道我玩到第幾關、每天幾點玩
④ 這筆交換對你來說划算嗎?為什麼?
　可以想想它帶給你什麼,以及你願不願意改變使用的方式。
　例:划算,因為它讓我放鬆;我想把時間控制在一天 30 分鐘

🔍 從哪裡找:
📱 你手機裡最常打開的那個 App
🎮 每天都會玩一下的免費手遊
🎬 看影片、聽音樂的平台
🔍 搜尋引擎和地圖 App
💬 聊天和社群 App
📰 新聞裡的「免費」「訂閱」「廣告」

格式:文字、照片、截圖、畫圖都可以。至少 1 個 App,四題都要回答。老師會親自回覆你。`;

export const L2S1_W5_BADGE_DATA = {
  rewardId: 'B-L2Q1-W05',
  type: 'badge',
  name: '商業模式拆解師',
  nameEn: 'Business Model Decoder',
  description:
    '完成「商業與市場」第一季 W5 的 10 題概念練習 + 開放題通過老師審核 → 解鎖。你學會了拆解免費背後的商業模式:免費的東西,有人在付錢。',
  weekLabel: 'W5',
  chapter: 'L2 商業與市場 · 第一季',
  earnedFromWeek: 205,
  earnedVia: 'quiz-approval',
  image: '/images/L2W5_Badge_商業模式拆解師_BusinessModelDecoder_L2S1.png',
};

export const L2S1_W5_CARD_DATA = {
  rewardId: 'C-L2Q1-W05',
  type: 'card',
  name: '看不見的帳單',
  nameEn: 'The Invisible Bill',
  cardNumber: 'L2Q1-W05-001',
  rarity: 'Rare ★★',
  description: '完成 W5 免費 App 拆解任務 + 老師親自回覆 → 解鎖。「免費的東西,有人在付錢。」',
  weekLabel: 'W5',
  chapter: 'L2 商業與市場 · 第一季',
  earnedFromWeek: 205,
  earnedVia: 'task-approval',
  image: '/images/L2W5_Card_看不見的帳單_TheInvisibleBill_L2S1.png',
};

export const L2S1_W5_WEEK_DATA = {
  weekNumber: 205,
  title: '商業與市場 · W5',
  quarter: 1,
  chapter: 'L2S1',
  question: '免費的東西,誰在付錢?',

  themeId: 'l2-s1',
  roadWeek: 5,

  hasQuiz: true,
  hasOpenQuestion: true,
  hasTask: true,

  videoUrl: null,
  videoCaption: null,

  quizQuestions,

  openQuestion,
  openQuestionMinChars: 50,

  taskTitle: '商業模式拆解師 · 出任務',
  taskDescription,
  taskMinChars: 50,

  badgeId: L2S1_W5_BADGE_DATA.rewardId,
  cardId: L2S1_W5_CARD_DATA.rewardId,

  published: false, // 草稿 — 之後到 /admin/content/205 改成 true
};
