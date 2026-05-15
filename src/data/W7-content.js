/**
 * W7 content — generated 2026-05-15 from Tiffany's W7 完整上架包
 *
 * 主題:5 罐子建築師(主動分配 vs 被動花光)
 * 章節:Ch.2 破曉探索(第 3 週,W5-W8)
 *
 * 上架選擇(2026-05-15):
 *  - 大問題:為什麼錢明明剛拿到,就「不見了」?
 *  - 徽章 / 卡片:不上(badgeId / cardId = null),等圖做好再加
 *  - latestAvailableWeek:不動(維持 6)
 *  - published:false(草稿)
 *
 * Schema 轉換:
 *  - 原始 correctIndex (int) → answer (option string) for student app compatibility
 *  - MISSION.uploadQuestions + intro + whereToLook flattened into taskDescription string
 */

const rawQuestions = [
  // ────────── L1 記住 Remember (Q1-Q3) ──────────
  {
    id: 1,
    block: '基礎記憶',
    bloomLevel: 'L1',
    type: 'multiple_choice',
    question: 'Tiffany 老師說的「5 個罐子」分別是?',
    options: [
      '吃、喝、玩、樂、學',
      '存、借、賺、花、送',
      '花、存、學、投、給',
      '收入、支出、儲蓄、投資、消費',
    ],
    correctIndex: 2,
    explanation:
      '5 個罐子的口訣是「花存學投給」 — 花 40%、存 20%、學 15%、投 15%、給 10%。把錢分開,每一個都有它的任務。',
  },
  {
    id: 2,
    block: '基礎記憶',
    bloomLevel: 'L1',
    type: 'multiple_choice',
    question: 'Tiffany 說「先支付自己」(Pay Yourself First)的意思最接近?',
    options: [
      '每天先給自己零用錢',
      '拿到錢的時候,先把存的部分挪出去',
      '先花再存',
      '工作完先請自己吃飯',
    ],
    correctIndex: 1,
    explanation:
      '「先支付自己」是錢進來時,先把存的部分撥到存罐,剩下才是「能花的」。不是先花完才看剩多少能存 — 那樣常常一塊都不剩。',
  },
  {
    id: 3,
    block: '基礎記憶',
    bloomLevel: 'L1',
    type: 'multiple_choice',
    question: '「存」罐有兩個用途,以下哪一個是「🛡️ 安全網」?',
    options: [
      '存錢買新的腳踏車',
      '存錢買新的樂高',
      '存錢出國旅遊',
      '存錢等鞋子突然壞掉、東西突然要修、生病要看醫生時用',
    ],
    correctIndex: 3,
    explanation:
      '「存」罐的兩個用途是 🎯 想要的未來(腳踏車、樂高、出國)+ 🛡️ 安全網 = 緊急開銷(鞋子破、東西壞、生病)。安全網 = 為了那個你不知道哪天會發生的事先準備好,讓你不會慌。',
  },
  // ────────── L2 理解 Understand (Q4-Q7) ──────────
  {
    id: 4,
    block: '概念理解',
    bloomLevel: 'L2',
    type: 'multiple_choice',
    question:
      '小華這個月拿到 1000 元零用錢。按照 5 罐子的範例比例(40 / 20 / 15 / 15 / 10),他應該放多少錢到「🟢 學」罐?',
    options: ['100 元', '150 元', '200 元', '400 元'],
    correctIndex: 1,
    explanation:
      '「學」罐的範例比例是 15%。1000 × 15% = 150 元。這些錢可以拿來買書、上課、學樂器 — 投資自己,變成「沒有人能拿走」的東西。',
  },
  {
    id: 5,
    block: '概念理解',
    bloomLevel: 'L2',
    type: 'multiple_choice',
    question:
      '⭐ 回顧上週:小美在便利商店看到「限量 100 個」的零食很想買。如果她已經學會 W6 行銷稀缺 + W7 5 罐子,她最聰明的做法是?',
    options: [
      '立刻買,因為怕沒了',
      '先問自己「這是花罐的錢嗎?還是要動到其他罐?」再決定',
      '全部用花罐的錢買 10 個囤起來',
      '拿存罐的錢買',
    ],
    correctIndex: 1,
    explanation:
      '這題連結 W6「行銷的稀缺」(限量是設計出來的)+ W7「5 罐分配」。先看穿「限量」是行銷,再用 5 罐子看「從哪個罐子出」。買不買不是重點,有沒有先想過才是重點。',
  },
  {
    id: 6,
    block: '概念理解',
    bloomLevel: 'L2',
    type: 'multiple_choice',
    question:
      'Tiffany 說 MC Hammer 賺超過 3000 萬美金(約 10 億台幣),卻在 1996 年宣告破產。最主要的原因是?',
    options: [
      '他人很差',
      '他做了壞事',
      '他沒有分罐子,賺到的錢全部進「花」罐(豪宅、跑車、200 個員工)',
      '他被人騙錢',
    ],
    correctIndex: 2,
    explanation:
      'Tiffany 說兩個人的差別「不是賺多少,是有沒有先分罐子」。MC Hammer 全部進花罐 → 賺再多也會花完。巴菲特 11 歲就開始分罐子(存 + 投 + 給)→ 95 歲身價 1500 億美金,還捐了 500 億美金做善事。',
  },
  {
    id: 7,
    block: '概念理解',
    bloomLevel: 'L2',
    type: 'multiple_choice',
    question:
      '小李的腳踏車輪子壞了,要花 300 元修。按照 Tiffany 教的 5 罐子,這筆錢應該從哪個罐子出?',
    options: [
      '花罐(因為要花錢)',
      '存罐 — 🛡️ 安全網的部分(緊急開銷)',
      '投罐(因為腳踏車是資產)',
      '學罐(因為可以學修腳踏車)',
    ],
    correctIndex: 1,
    explanation:
      '「東西壞了要修」屬於 🛡️ 安全網(緊急開銷)。這就是為什麼「存」要分兩個用途 — 一部分留給想要的未來,一部分留給你不知道哪天會發生的事。安全網讓你不會慌。',
  },
  // ────────── L3 應用 Apply (Q8-Q10) ──────────
  {
    id: 8,
    block: '實際應用',
    bloomLevel: 'L3',
    type: 'multiple_choice',
    question:
      '小明 5 月計畫:花 40% / 存 20% / 學 15% / 投 15% / 給 10%。月底實際:花 65% / 存 10% / 學 5% / 投 0% / 給 0%。Tiffany 說對帳(Reconcile)的重點是?',
    options: [
      '罵自己沒做好',
      '重新發誓下個月一定要做到',
      '看見落差,下個月調整',
      '放棄,改用別的方法',
    ],
    correctIndex: 2,
    explanation:
      'Tiffany 說「對帳的重點,不是責怪自己 — 是看見落差,下個月調整」。第一個月 80% 的孩子實際都會偏掉,這很正常。重點是你知道偏在哪 — 你才能調。',
  },
  {
    id: 9,
    block: '實際應用',
    bloomLevel: 'L3',
    type: 'multiple_choice',
    question:
      '⭐ Tiffany 老師建議你「想花錢前問自己 4 個問題」。以下哪一個 不是 她說的問題?',
    options: [
      '這是需要還是想要?',
      '它是消耗品還是資產?',
      '這個東西別人有沒有?',
      '從哪個罐子出?',
    ],
    correctIndex: 2,
    explanation:
      'Tiffany 的 4 個問題是:① 需要還是想要? ② 消耗品還是資產? ③ 從哪個罐子出? ④ 1 個月後會後悔嗎? 「別人有沒有」是被廣告 / 朋友影響的反應,Tiffany 要你練習的是「自己跟自己對話」。問一個,就可能省下一筆不必要的錢。',
  },
  {
    id: 10,
    block: '實際應用',
    bloomLevel: 'L3',
    type: 'multiple_choice',
    question:
      'Tiffany 說「告訴你的錢哪裡去,而不是問它去了哪。」這句話最接近?',
    options: ['不要花錢', '多賺錢就好', '提前做好分配,而不是事後才問錢跑哪去了', '預算就是限制'],
    correctIndex: 2,
    explanation:
      '這是 W7 最重要的金句。「分配」就是告訴你的錢要去哪個罐子做什麼任務;不分配,就會像品佳一樣翻錢包說「200 塊不見了」。預告 W8 — 我們會講「花完才後悔的秘密」:那些沒分罐子的人,後來怎麼想?',
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

const taskDescription = `你的錢,你來分。設你的 5 罐子比例 + 記滿 5 筆 6 欄記錄 — 你就是自己金錢的建築師。

這週的任務有兩個層次:

【第一層】設計你的 5 罐子比例
拿一張紙、開一個 Notes,寫下你每個月的零用錢要怎麼分到 🟠 花 / 🟡 存 / 🟢 學 / 🔵 投 / 🟣 給 5 個罐子。範例是 40 / 20 / 15 / 15 / 10,你可以自己調 — 只要加總 = 100%。

【第二層】記錄你 5 筆真實的金錢進出
6 個欄位:日期、進/出、項目、金額、罐子(5 罐之一)、備註/心情。不用記 50 筆,5 筆就好,但每一筆都要對應到 5 罐之一 — 這是內化分配思維的關鍵。

完成後,在下方告訴 Tiffany 老師:
① 你設計的 5 罐子比例(寫出 5 個罐子各佔多少 %,加總 = 100%)
② 上傳你的 6 欄記錄表(至少 5 筆。可以拍紙本、Notes 截圖、Excel 截圖,或直接打字)
③ 這 5 筆裡面,哪個罐子的錢花最多?(🟠花 / 🟡存 / 🟢學 / 🔵投 / 🟣給)
④ 你發現自己這週有沒有「想花卻沒花」的時刻?Tiffany 教的 4 個問題有幫到你嗎?

🔍 可以觀察的時刻:
💰 媽媽 / 爸爸給的零用錢進來時
🍱 學校午餐、飲料、零食
✏️ 文具店、書店
🎮 想買的玩具、樂高、遊戲
🎁 朋友生日、家人生日
👟 鞋子、衣服、運動裝備
📱 7-11、全家、超市`;

export const W7_BADGE_DATA = {
  rewardId: 'B-Q1-W07',
  type: 'badge',
  name: '5 罐子建築師',
  description:
    '完成 W7 競技場 10 題達 80% 以上 → 解鎖。學會把錢分到「花、存、學、投、給」5 個罐子,讓每一塊錢都有它的任務。',
  weekLabel: 'W7',
  chapter: 'Ch.2',
  earnedFromWeek: 7,
  earnedVia: 'quiz-approval',
  image: '/images/W7_Badge_5罐子建築師_MoneyArchitect_Ch2.png',
};

export const W7_CARD_DATA = {
  rewardId: 'C-Q1-W07',
  type: 'card',
  name: '5 罐子建築師之證',
  description:
    '完成 W7 任務 + 上傳 5 罐子比例 + 6 欄記錄 + 老師通過 → 解鎖。「告訴你的錢哪裡去 — 而不是問它去了哪。」',
  weekLabel: 'W7',
  chapter: 'Ch.2',
  earnedFromWeek: 7,
  earnedVia: 'task-approval',
  image: '/images/W7_Card_5罐子建築師之證_MoneyArchitect_Ch2.png',
};

export const W7_WEEK_DATA = {
  weekNumber: 7,
  title: 'Week 7',
  quarter: 1,
  chapter: 'Ch.2',
  question: '為什麼錢明明剛拿到,就「不見了」?',

  hasQuiz: true,
  hasOpenQuestion: false,
  hasTask: true,

  videoUrl: null,
  videoCaption: null,

  quizQuestions,

  openQuestion: null,
  openQuestionMinChars: 30,

  taskTitle: '5 罐子建築師 · 出任務',
  taskDescription,
  taskMinChars: 50,

  badgeId: W7_BADGE_DATA.rewardId,
  cardId: W7_CARD_DATA.rewardId,

  published: false, // 草稿 — 之後到 /admin/content/7 改成 true
};
