/**
 * L1S1-W5 content — generated 2026-10-13 from Tiffany's「L1W5 小T財商概念競技場:完整上架包」
 *
 * 課程:L1 主題課 10-12｜我的零用錢,我作主(第一季)
 * 主題:利潤與虧損(我賺了 100 元嗎?)
 * 本週身份:利潤檢查員 / Profit Checker
 *
 * 一致性:
 *   主課頁面 → 檸檬水攤:星期六收入 100、成本 60、利潤 40;
 *              星期日收入 150、成本 160、虧損 10;換你算:收入 100、成本 120、虧損 20
 *   生活案例 → 跳蚤市場、手作卡片、幫鄰居洗車
 *   競技場任務 → 做一份自己的利潤小帳本
 *   家長語音 → Amazon 從 1994 年創立到 2003 年第一個全年獲利
 *
 * 上架設定(沿用 W1–W4 的 recipe):
 *  - 學習道路主題 l1-g1 的第 5 關,weekNumber = 105(道路週 = 100 + n)
 *  - 題型:選擇 7 題 + 是非 1 題 + 簡答 2 題(Q6、Q10)
 *    上架包的 short_answer 已轉成播放器用的 type 'text' + minChars,
 *    sampleAnswer 放進 placeholder 當作「例:」
 *  - 上架包 MISSION 的 description + 4 個上傳問題 + whereToLook 合併成一段 taskDescription(W1–W4 格式)
 *  - 上架包 REWARDS 寫「10 題達 80% 以上」:系統規則是全對 + 老師審核,描述已改成系統實際規則
 *  - rewardId 用 'B-L1S1-W05' / 'C-L1S1-W05'
 *  - published: false(草稿,要從 /admin/content/105 手動發佈)
 *  - 徽章/卡片圖檔檔名照上架包:L1W5_Badge_利潤檢查員_ProfitChecker_L1S1.png / L1W5_Card_錢罐裡的真相_L1S1.png
 */

const quizQuestions = [
  // ---------- 記憶層(3 題) ----------
  {
    id: 1,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'multiple_choice',
    question: '收入減掉成本之後,剩下的錢叫做什麼?',
    options: ['利潤', '收入', '成本', '價格'],
    answer: '利潤',
    explanation:
      '利潤 = 收入 − 成本。收進來的錢先付掉成本,剩下的才是真正留下來的。',
  },
  {
    id: 2,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'multiple_choice',
    question: '成本比收入還多,錢不夠付,少掉的那一塊叫做什麼?',
    options: ['虧損', '利潤', '收入', '零用錢'],
    answer: '虧損',
    explanation:
      '成本比收入多的時候,錢不夠付,少掉的那一塊叫虧損。虧損很正常,看懂是哪一筆成本讓結果變了,就是很好的檢查。',
  },
  {
    id: 3,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'true_false',
    question: '是非題:利潤的公式是「利潤 = 收入 − 成本」。',
    answer: true,
    explanation:
      '對。這是這週最重要的一條公式。收入和成本是你在 W3、W4 學過的兩個詞,這週把它們放在一起。',
  },

  // ---------- 理解層(4 題,其中 1 題簡答) ----------
  {
    id: 4,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: '小T 的錢罐裡有 100 元,他大喊:「我賺了 100 元!」利潤檢查員會先問什麼?',
    options: [
      '你為了賣檸檬水,先花了多少成本?',
      '你要怎麼把 100 元花掉?',
      '你明天要賣幾杯?',
      '你的錢罐是在哪裡買的?',
    ],
    answer: '你為了賣檸檬水,先花了多少成本?',
    explanation:
      '錢罐裡的 100 元是收入。要知道賺了多少,得先把成本扣掉。星期六的成本是 60 元,利潤是 40 元。',
  },
  {
    id: 5,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: '星期日收入 150 元,比星期六的 100 元多。為什麼星期日反而虧損了?',
    options: [
      '因為多租了帳篷、買了氣球,成本變成 160 元,比收入還多',
      '因為檸檬水變難喝了',
      '因為收入越多,一定越容易虧損',
      '因為星期日不能做生意',
    ],
    answer: '因為多租了帳篷、買了氣球,成本變成 160 元,比收入還多',
    explanation:
      '150 − 160,少了 10 元,所以虧損 10 元。收入變多的同時,成本變得更多。收得多,不等於賺得多。',
  },
  {
    id: 6,
    block: '概念理解',
    bloom: 'understand',
    type: 'text',
    grading: 'teacher_light',
    minChars: 15,
    question: '用你自己的話說說看:為什麼「收得多」不一定「賺得多」?',
    placeholder: '例:因為收入變多的時候,成本也可能變多。如果成本變得比收入還多,就會虧損。',
    explanation:
      '利潤要同時看收入和成本兩邊。只看收入,就像只看錢罐,看不見帳單。說得出兩邊,你就是一位利潤檢查員了。',
  },
  {
    id: 7,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: '小安說:「我這次賣東西虧損了,我是不是很失敗?」哪一句回應最像利潤檢查員?',
    options: [
      '虧損很正常,我們一起看看是哪一筆成本讓結果變了',
      '對,虧損就是失敗',
      '以後都不要做生意了',
      '不要算帳就不會虧損了',
    ],
    answer: '虧損很正常,我們一起看看是哪一筆成本讓結果變了',
    explanation:
      '很多做生意的人都遇過虧損。把帳攤開來看,找出是哪一筆成本讓結果變了,下一次就知道要改哪裡。',
  },

  // ---------- 應用層(3 題,其中 1 題簡答) ----------
  {
    id: 8,
    block: '實際應用',
    bloom: 'apply',
    type: 'multiple_choice',
    question: '小芸做卡片賣給親戚,收入 160 元,材料花了 70 元。她的利潤是多少?',
    options: ['90 元', '230 元', '160 元', '70 元'],
    answer: '90 元',
    explanation: '利潤 = 收入 − 成本 = 160 − 70 = 90 元。',
  },
  {
    id: 9,
    block: '實際應用',
    bloom: 'apply',
    type: 'multiple_choice',
    question: '有一天,你的收入是 100 元,成本是 120 元。結果是什麼?',
    options: ['虧損 20 元', '利潤 20 元', '利潤 220 元', '剛好打平'],
    answer: '虧損 20 元',
    explanation:
      '成本 120 元比收入 100 元多 20 元,錢不夠付,所以是虧損 20 元。',
  },
  {
    id: 10,
    block: '實際應用',
    bloom: 'apply',
    type: 'text',
    grading: 'teacher_light',
    minChars: 20,
    question:
      '上週我們把成本分成兩堆:每做一個都要花的,和不管賣幾個都要付的。星期日的檸檬水攤,你會先減掉哪一筆成本,讓它下次有利潤?說說你的理由。',
    placeholder:
      '例:我會不買氣球,因為氣球只是裝飾,少花 20 元,成本變成 140 元,就會有利潤 10 元。',
    explanation:
      '帳篷和氣球屬於不管賣幾杯都要付的那一堆,一共 70 元。少掉其中一筆,星期日就有機會從虧損變成利潤。說得出改哪裡、為什麼,就是利潤檢查員在做的事。這題老師會親自看你的回答。',
  },
];

const taskDescription = `替一件你做過、或很想做的小生意,做一份利潤小帳本。

選一件你做過、或很想做的小生意:擺攤、跳蚤市場、手作小物、幫忙家事換零用錢都可以。

寫下它的收入,列出至少 2 項成本,用「利潤 = 收入 − 成本」算出結果。成本比收入多,就寫下虧損幾元。還沒做過的,用估的數字並標上「估」。

【回答這四題】
① 你選了什麼小生意?收入是多少?
　賣了幾個、一個多少錢,加起來收進多少。可以拍照或直接寫。
　例:跳蚤市場賣舊漫畫,賣了 6 本,一本 20 元,收入 120 元
② 列出至少 2 項成本,每一項寫一個金額
　想一想:做這件事之前,你先花了哪些錢?
　例:標價貼紙 10 元
③ 用公式算出利潤或虧損
　利潤 = 收入 − 成本。成本比較多,就寫虧損幾元。
　例:120 − 10 = 110,利潤 110 元
④ 下次要讓利潤變多,你會改哪一個地方?
　可以想想:收入能不能多一點?哪一筆成本可以少一點?
　例:我會自己畫標價,不買貼紙

🔍 從哪裡找:
🍋 自己擺過的攤位或班上的跳蚤市場
🎨 做過的手作小物、卡片、書籤
🧽 幫家人或鄰居做事換到的零用錢
📚 想賣掉的舊書、舊玩具
🏫 學校園遊會的班級攤位
💭 一個你很想試試看的小生意

格式:文字、照片、截圖、畫圖都可以。至少做 1 份小帳本,四題都要回答。老師會親自回覆你。`;

export const L1S1_W5_BADGE_DATA = {
  rewardId: 'B-L1S1-W05',
  type: 'badge',
  name: '利潤檢查員',
  nameEn: 'Profit Checker',
  description:
    '完成「我的零用錢,我作主」第一季 W5 的 10 題概念練習 + 老師審核通過 → 解鎖。你學會了:利潤 = 收入 − 成本,成本比收入多就是虧損,收得多不一定賺得多,看懂是哪一筆成本讓結果變了,下一次就知道要改哪裡。',
  weekLabel: 'W5',
  chapter: 'L1 我的零用錢,我作主 · 第一季',
  earnedFromWeek: 105,
  earnedVia: 'quiz-approval',
  image: '/images/L1W5_Badge_利潤檢查員_ProfitChecker_L1S1.png',
};

export const L1S1_W5_CARD_DATA = {
  rewardId: 'C-L1S1-W05',
  type: 'card',
  name: '錢罐裡的真相',
  nameEn: 'WHAT THE JAR REALLY HOLDS',
  cardNumber: 'L1S1-W05-001',
  rarity: 'Rare ★★',
  description:
    '完成 W5 利潤小帳本任務 + 老師親自回覆 → 解鎖。「收入減掉成本,剩下的才是利潤。」',
  weekLabel: 'W5',
  chapter: 'L1 我的零用錢,我作主 · 第一季',
  earnedFromWeek: 105,
  earnedVia: 'task-approval',
  image: '/images/L1W5_Card_錢罐裡的真相_L1S1.png',
};

export const L1S1_W5_WEEK_DATA = {
  weekNumber: 105,
  title: '我的零用錢,我作主 · W5',
  quarter: 1,
  chapter: 'L1S1',
  question: '錢罐裡有 100 元,我真的賺了 100 元嗎?',

  // 學習道路主題週的標記:
  themeId: 'l1-g1', // 對應 arenaStructure / unlockedThemes 的主題 id
  roadWeek: 5, // 道路上的第幾關(學生看到的 W5)

  hasQuiz: true,
  hasOpenQuestion: false, // 簡答題已內建在練習題裡(quizTextAnswers)
  hasTask: true,

  videoUrl: null,
  videoCaption: null,

  quizQuestions,

  openQuestion: null,
  openQuestionMinChars: 30,

  taskTitle: '利潤檢查員 · 出任務',
  taskDescription,
  taskMinChars: 50,

  badgeId: L1S1_W5_BADGE_DATA.rewardId,
  cardId: L1S1_W5_CARD_DATA.rewardId,

  published: false, // 草稿 — 之後到 /admin/content/105 改成 true
};
