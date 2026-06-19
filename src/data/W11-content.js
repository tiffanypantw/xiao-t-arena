/**
 * W11 content — generated 2026-06-20 from Tiffany's W11 完整上架包
 *
 * 主題:取捨領航員(機會成本|選一個,就要放棄一個)
 * 章節:Ch.3 月光森林(第三週,W9-W12)
 *
 * 上架選擇(2026-06-20,沿用 W10 convention):
 *  - 大問題:選了一個,你同時放棄的「那一個」,到底值不值得?
 *  - 徽章 / 卡片:跟 W7/W8/W9/W10 一樣,rewardId 用系統 convention 'B-Q1-W11' / 'C-Q1-W11'
 *    (Tiffany 源檔裡的 'B-TN-6Q4W' / 'C-TN-8R3K' 是兌換碼用的命名,跟 rewardId 是兩件事)
 *  - latestAvailableWeek:不動(維持目前值,W11 不會自動出現給學生)
 *  - published:false(草稿,要從 /admin/content/11 手動發佈)
 *
 * Schema 轉換:
 *  - 原始 correctIndex (int) → answer (option string) for student app compatibility
 *  - MISSION.intro + description + uploadQuestions + whereToLook + submissionFlow
 *    flattened into taskDescription string
 */

const rawQuestions = [
  // ────────── L1 記住 Remember (Q1-Q3) ──────────
  {
    id: 1,
    block: '基礎記憶',
    bloomLevel: 'L1',
    type: 'multiple_choice',
    question: 'Tiffany 老師說的「機會成本」是什麼意思?',
    options: [
      '你買東西花出去的那筆錢',
      '你做了一個選擇,同時放棄的「另一個選項」',
      '東西打折省下來的錢',
      '存進撲滿裡的零用錢',
    ],
    correctIndex: 1,
    explanation:
      '機會成本不是你花出去的錢,而是你選了這個、同時「放棄掉的那一個」。它是看不見的、當下沒感覺的隱形成本,可是它確實存在 — 每個選擇都帶著一個「影子」。',
  },
  {
    id: 2,
    block: '基礎記憶',
    bloomLevel: 'L1',
    type: 'multiple_choice',
    question: '機會成本「只算」哪一個?',
    options: [
      '你放棄的所有選項加起來',
      '你放棄的選項裡「最好的那一個」',
      '最便宜的那一個',
      '別人覺得最好的那一個',
    ],
    correctIndex: 1,
    explanation:
      '100 塊選了 A,你也放棄了 B、C、D。但機會成本只算「最好的那一個(你第二想要的 B)」,不是 B+C+D 加起來 — 因為這 100 塊本來也只能買一樣。',
  },
  {
    id: 3,
    block: '基礎記憶',
    bloomLevel: 'L1',
    type: 'multiple_choice',
    question: '除了「錢」,Tiffany 老師說還有什麼東西也有機會成本?',
    options: ['空氣', '時間', '名字', '影子'],
    correctIndex: 1,
    explanation:
      '時間也有機會成本,而且更重要 — 錢可以再賺,但時間每分每秒過去、不能重來,你也不能分身。星期六下午選了打球,就同時放棄了那段時間本來能做的其他事。',
  },
  // ────────── L2 理解 Understand (Q4-Q7) ──────────
  {
    id: 4,
    block: '理解概念',
    bloomLevel: 'L2',
    type: 'multiple_choice',
    question:
      '小華有 100 塊。最想要的是漫畫(A),第二想要貼紙(B),第三想要糖果(C)。他買了漫畫,他的機會成本是?',
    options: ['漫畫(A)', '貼紙(B)', '貼紙 + 糖果(B+C)', '100 塊錢'],
    correctIndex: 1,
    explanation:
      '他選了 A,放棄的選項裡「最好的那一個」是 B(貼紙)。機會成本就是 B,不是 B+C — 因為這 100 塊本來也只能買一樣東西。',
  },
  {
    id: 5,
    block: '理解概念',
    bloomLevel: 'L2',
    type: 'multiple_choice',
    question:
      '上週(W10)我們學會問「這東西對我值不值得?」。這週取捨領航員要「多問一個反向問題」,是哪一個?',
    options: [
      '這東西的標價是多少?',
      '別人有沒有買?',
      '我「放棄的那一個」,值不值得?',
      '什麼時候會打折?',
    ],
    correctIndex: 2,
    explanation:
      '【接續上週】W10 你會問「我買的值不值得」;W11 多問一個反向問題「我放棄的那一個值不值得」。正向 + 反向一起問,你就會更確定買下去的這個真的是你要的。',
  },
  {
    id: 6,
    block: '理解概念',
    bloomLevel: 'L2',
    type: 'multiple_choice',
    question: '小美想很久,最後什麼都沒買。這算「沒有做選擇」嗎?',
    options: [
      '算,她浪費了時間',
      '不算,她其實選了「把錢留下來」,換到下次再決定的自由',
      '算,沒花錢就是沒選',
      '不算,因為她一定會後悔',
    ],
    correctIndex: 1,
    explanation:
      '什麼都沒買,不等於沒選。小美選擇了「把錢留下來」— 她沒花掉這筆錢、保有了再決定一次的自由。有時候,這反而是最聰明的選擇。',
  },
  {
    id: 7,
    block: '理解概念',
    bloomLevel: 'L2',
    type: 'multiple_choice',
    question: '為什麼二選一的時候,常常會覺得「好痛、好捨不得」?',
    options: [
      '因為你不夠聰明',
      '因為兩邊對你來說可能都真的很有價值',
      '因為你太貪心',
      '因為錢不夠多',
    ],
    correctIndex: 1,
    explanation:
      '會痛、捨不得,正好證明兩邊都有價值,這很正常。如果放棄一個一點都不痛,那它從一開始就不算一個真正的選擇。知道自己為什麼選的人,放棄的時候反而心甘情願。',
  },
  // ────────── L3 應用 Apply (Q8-Q10) ──────────
  {
    id: 8,
    block: '實際應用',
    bloomLevel: 'L3',
    type: 'multiple_choice',
    question:
      '小李這個月把「想要」這格的預算放大,買了一個很貴的玩具。根據「預算=提前取捨」,接下來最可能發生什麼?',
    options: [
      '其他格(三餐、交通、學習)的錢會被擠小',
      '他的總預算會自動變多',
      '玩具會自己變便宜',
      '完全不會有任何影響',
    ],
    correctIndex: 0,
    explanation:
      '預算是提前做好的取捨。一格畫大,別的格就得縮小 — 「想要」放大、超過預算,就可能擠壓到三餐、交通、學習的錢。把取捨做在前面,後面花錢才不會慌。',
  },
  {
    id: 9,
    block: '實際應用',
    bloomLevel: 'L3',
    type: 'multiple_choice',
    question: '星期六下午,你選擇去打球。用「機會成本」來看,你同時放棄了什麼?',
    options: [
      '只放棄了打球的力氣',
      '什麼都沒放棄,因為打球不用錢',
      '同一個下午本來能做的其他事(看漫畫、陪家人、寫作業)',
      '下個星期六的下午',
    ],
    correctIndex: 2,
    explanation:
      '時間只有一段、不能分身。選了打球,就同時放棄了那個下午本來能做的別的事。選擇的代價不一定是錢 — 時間的機會成本常常更重要。',
  },
  {
    id: 10,
    block: '實際應用',
    bloomLevel: 'L3',
    type: 'multiple_choice',
    question:
      '你只有 100 塊,珍奶和雞排都很想要、也都很值得。用「取捨領航員」的方法,你會怎麼決定?',
    options: [
      '吵著要兩個都買',
      '隨便亂選一個就好',
      '問自己:「放棄哪一個我比較捨不得?過幾天再看我還會這樣選嗎?」',
      '兩個都不要,再也不買東西',
    ],
    correctIndex: 2,
    explanation:
      '兩個都值得、平手的時候,就翻面比 —「放棄哪一個我比較捨不得?」捨不得放的那個,對你價值更高。再加上取捨領航員的第三問「過幾天再看還會這樣選嗎」,你就會選得心甘情願、不後悔。',
  },
];

// 把 correctIndex 轉成 answer (option string) — student app 讀的是 q.answer
const quizQuestions = rawQuestions.map((q) => ({
  id: q.id,
  block: q.block,
  bloomLevel: q.bloomLevel,
  type: q.type,
  question: q.question,
  options: q.options,
  answer: q.options[q.correctIndex],
  explanation: q.explanation,
}));

const taskDescription = `這禮拜你要當取捨領航員 — 機會成本是看不見的,把它「找出來、寫下來」,它才會現形。

這週是 Ch.3「月光森林」的第三週。W10 你學會了問「這東西對我值不值得」。這禮拜,你要多問一個反向問題 ——「我放棄的那一個,值不值得?」

【任務內容:當一個「取捨偵探」,觀察 3 個「取捨時刻」】
觀察你自己、或家人、朋友的 3 個「取捨時刻」 — 也就是「選了一個、同時放棄了另一個」的時刻。
(可以的話,訪問當事人:「為什麼你覺得值得?它解決了你什麼問題?」— 重點不是他答「值得」,是他「為什麼」覺得值得。)

每一個取捨時刻,記下這三件事:
① 這個人是誰?在什麼情況下,選了什麼?
   範例:媽媽在超市,牛奶有大瓶和小瓶,她選了小瓶。
② 他同時放棄了什麼?(最捨不得的那一個)
   提醒:機會成本只算「最好的那一個」,不是全部加起來。寫出那一個就好。
   範例:她放棄了大瓶(平均比較便宜),因為怕喝不完會壞掉、反而浪費。
③ 你覺得這個取捨值得嗎?為什麼?(同時想兩面:他「選的」值不值得?他「放棄的」值不值得?)
   (a) 值得 — 他選的這個比較符合需求
   (b) 不值得 — 我覺得放棄的那個其實更好
   (c) 不一定 — 過幾天再看可能會不一樣

⭐ 至少要寫 3 個取捨時刻。
⭐ 老師會在後台看你的觀察,跟你一來一往討論你有沒有「看見放棄的那一個」。

🔍 從哪裡找你的取捨時刻:
🛒 便利商店 / 超市 — 大瓶 vs 小瓶、這個牌子 vs 那個牌子
🍵 手搖飲 — 中杯 vs 大杯、珍奶 vs 別的
🍱 午餐 / 點心 — 吃了這個,就放棄了那個
👟 想要很久的東西 — 存錢買了 A,就買不了 B
🕐 週末時間 — 打球 vs 看漫畫 vs 陪家人(時間的取捨)
🏠 家裡 — 爸媽決定買哪個、去哪裡玩、先做哪件事
🛍️ 賣場囤貨 — 一次買很多,放棄了空間和「沒用完會壞」

格式:文字、照片、截圖、畫圖都可以。`;

export const W11_BADGE_DATA = {
  rewardId: 'B-Q1-W11',
  type: 'badge',
  name: '取捨領航員',
  description:
    '完成 W11 競技場 10 題達 80% 以上 + 上傳本週任務(3 個取捨時刻觀察) + 老師後台通過 → 解鎖。學會「選一個,就要放棄一個」,看見每個選擇背後那個放棄的影子。',
  weekLabel: 'W11',
  chapter: 'Ch.3',
  earnedFromWeek: 11,
  earnedVia: 'quiz-approval',
  image: '/images/W11_Badge_取捨領航員_TradeoffNavigator_Ch3.png',
};

export const W11_CARD_DATA = {
  rewardId: 'C-Q1-W11',
  type: 'card',
  name: '取捨領航員之印',
  description:
    '完成 W11 任務(3 個取捨時刻觀察)+ 上傳照片到後台 + 老師通過 → 解鎖。「選擇的真正代價,不是你付的錢,而是你放棄的那一個。會放棄的人,才真的會選擇。」',
  weekLabel: 'W11',
  chapter: 'Ch.3',
  earnedFromWeek: 11,
  earnedVia: 'task-approval',
  image: '/images/W11_Card_取捨領航員之印_TradeoffNavigator_Ch3.png',
};

export const W11_WEEK_DATA = {
  weekNumber: 11,
  title: 'Week 11',
  quarter: 1,
  chapter: 'Ch.3',
  question: '選了一個,你同時放棄的「那一個」,到底值不值得?',

  hasQuiz: true,
  hasOpenQuestion: false,
  hasTask: true,

  videoUrl: null,
  videoCaption: null,

  quizQuestions,

  openQuestion: null,
  openQuestionMinChars: 30,

  taskTitle: '取捨領航員 · 觀察 3 個「取捨時刻」',
  taskDescription,
  taskMinChars: 50,

  badgeId: W11_BADGE_DATA.rewardId,
  cardId: W11_CARD_DATA.rewardId,

  published: false, // 草稿 — 之後到 /admin/content/11 改成 true
};
