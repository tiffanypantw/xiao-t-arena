/**
 * L1S1-W4 content — generated 2026-10-12 from Tiffany's「L1W4 小T財商概念競技場:完整上架包」
 *
 * 課程:L1 主題課 10-12｜我的零用錢,我作主(第一季)
 * 主題:成本(一杯 60 元的秘密)
 * 本週身份:成本透視員 / Cost X-Ray Scout
 *
 * 一致性:
 *   主課頁面 → 阿T 茶飲 60 元拆解:第一堆 20 元、第二堆 32 元、留下 8 元
 *   生活案例 → 茶葉蛋、筆記本、雞排攤
 *   競技場任務 → 拆一樣自己常買的東西,列 3 種成本並分兩堆
 *
 * 上架設定(沿用 W1–W3 的 recipe):
 *  - 學習道路主題 l1-g1 的第 4 關,weekNumber = 104(道路週 = 100 + n)
 *  - 題型:選擇 7 題 + 是非 1 題 + 簡答 2 題(Q6、Q8)
 *    上架包的 short_answer 已轉成播放器用的 type 'text' + minChars,
 *    sampleAnswer 放進 placeholder 當作「例:」
 *  - 上架包 MISSION 的 description + 3 個上傳問題 + whereToLook 合併成一段 taskDescription(W1–W3 格式)
 *  - 上架包 REWARDS 寫「10 題達 80% 以上」:系統規則是全對 + 老師審核,描述已改成系統實際規則
 *  - rewardId 用 'B-L1S1-W04' / 'C-L1S1-W04'
 *  - published: false(草稿,要從 /admin/content/104 手動發佈)
 *  - 徽章/卡片圖檔檔名照上架包:L1W4_Badge_成本透視員_CostXRayScout_L1S1.png / L1W4_Card_60元的秘密_L1S1.png
 */

const quizQuestions = [
  // ---------- 記憶層(3 題) ----------
  {
    id: 1,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'multiple_choice',
    question: '店家為了做出一樣東西、把它交到你手上,花掉的錢叫做什麼?',
    options: ['成本', '收入', '零用錢', '找零'],
    answer: '成本',
    explanation:
      '成本就是店家為了做出東西、送到你手上所花的錢。你付的價格,有一大部分是先拿去付這些成本。',
  },
  {
    id: 2,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'multiple_choice',
    question: '一杯珍奶用到的茶葉、牛奶、珍珠、糖,我們叫它們什麼?',
    options: ['原料', '店租', '薪水', '價格'],
    answer: '原料',
    explanation:
      '做東西用到的材料叫做原料。珍奶的原料是茶葉、牛奶、珍珠和糖,每做一杯都要用掉一份。',
  },
  {
    id: 3,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'true_false',
    question: '是非題:店家每個月付給房東、借用店面的錢,叫做店租,它也是一種成本。',
    answer: true,
    explanation:
      '對。店租是店家為了有地方做生意而付的錢,當然也是成本。它不會出現在杯子裡,卻藏在每一杯的價格裡。',
  },

  // ---------- 理解層(4 題,其中 1 題簡答) ----------
  {
    id: 4,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: '下面哪一個,是「不管今天賣幾杯,都要付」的成本?',
    options: ['店租', '珍珠', '杯子', '牛奶'],
    answer: '店租',
    explanation:
      '珍珠、杯子、牛奶跟著杯數走,多做一杯就多用一份。店租每個月都要付,今天賣 10 杯要付,賣 300 杯也要付。',
  },
  {
    id: 5,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: '小美說:「一杯珍奶 60 元,店家就賺了 60 元。」哪一句最能幫她看清楚?',
    options: [
      '60 元裡面要先付掉原料、店租、薪水這些成本',
      '店家一定賺很多,因為很多人排隊',
      '60 元全部都是店家的',
      '價格越貴,店家就一定賺越多',
    ],
    answer: '60 元裡面要先付掉原料、店租、薪水這些成本',
    explanation:
      '價格是你付出去的錢,成本是店家要先付掉的錢。60 元扣掉所有成本,剩下的才是店家留下來的。透視員看的是價格裡面的東西。',
  },
  {
    id: 6,
    block: '概念理解',
    bloom: 'understand',
    type: 'text',
    grading: 'teacher_light',
    minChars: 15,
    question: '用你自己的話說說看:為什麼一杯飲料的價格,會比茶葉加牛奶的錢貴很多?',
    placeholder: '例:因為還要付店租、店員薪水、水電,這些看不到的東西也是成本。',
    explanation:
      '杯子裡看得到的原料只是第一堆。店租、薪水、水電是第二堆,看不見,卻一樣要付。說得出第二堆,你的透視眼就開了。',
  },
  {
    id: 7,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: '在阿T 茶飲的例子裡,哪一堆成本比較大?',
    options: [
      '不管賣幾杯都要付的那一堆(店租、薪水、水電)',
      '每做一杯都要花的那一堆(茶葉、牛奶、珍珠)',
      '兩堆一樣大',
      '阿T 茶飲沒有成本',
    ],
    answer: '不管賣幾杯都要付的那一堆(店租、薪水、水電)',
    explanation:
      '第一堆是 20 元,第二堆是 32 元。很多人以為材料最花錢,透視之後才發現,看不見的那一堆更大。',
  },

  // ---------- 應用層(3 題,其中 1 題簡答) ----------
  {
    id: 8,
    block: '實際應用',
    bloom: 'apply',
    type: 'text',
    grading: 'teacher_light',
    minChars: 20,
    question: '小華在學校旁邊擺雞排攤。幫他列出 3 種成本,並寫出每一種屬於哪一堆。',
    placeholder: '例:雞肉(每炸一塊都要花)、炸油(每炸一塊都要花)、攤位租金(不管賣幾塊都要付)。',
    explanation:
      '雞肉、炸粉、油跟著塊數走;攤車、瓦斯桶、攤位租金不管賣幾塊都要付。分得出兩堆,你就看得懂一個攤子的帳。這題老師會親自看你的回答。',
  },
  {
    id: 9,
    block: '實際應用',
    bloom: 'apply',
    type: 'multiple_choice',
    question:
      '小李賣手作書籤,一張 50 元。材料每張 10 元,攤位租金平均分到每張是 15 元。小李每賣一張,留下幾元?',
    options: ['25 元', '40 元', '35 元', '50 元'],
    answer: '25 元',
    explanation:
      '50 − 10 − 15 = 25。價格先扣掉每做一張都要花的材料,再扣掉平均分到每張的租金,剩下的才是小李留下來的。',
  },
  {
    id: 10,
    block: '實際應用',
    bloom: 'apply',
    type: 'multiple_choice',
    question: '上一週我們學到:收入是幫忙的回報。這一週學了成本。哪一句把兩週連起來了?',
    options: [
      '幫別人做事會帶來收入,收入進來之後,要先付掉做這件事的成本',
      '有收入就一定不會有成本',
      '成本越高,收入就一定越高',
      '收入和成本是同一件事',
    ],
    answer: '幫別人做事會帶來收入,收入進來之後,要先付掉做這件事的成本',
    explanation:
      '收入是顧客謝謝你的錢,成本是你為了幫忙先花掉的錢。兩個一起看,才看得懂一門生意。',
  },
];

const taskDescription = `用你的透視眼,打開一樣你常買的東西,看看價格裡住著哪些成本。

選一樣你最近一個月常買的東西:飲料、零食、文具、遊戲點數都可以。

寫下它的名字和價格,列出至少 3 種可能的成本,再把它們分成兩堆:每做一個都要花的,和不管賣幾個都要付的。

分不出來很正常,先放在你覺得比較像的那一堆,再寫一句你為什麼不確定。

【回答這三題】
① 你選了什麼東西?它賣多少錢?
　拍一張它的照片,或直接寫下名字和價格。
　例:超商的茶葉蛋,一顆＿＿元
② 列出它至少 3 種可能的成本
　想一想:做它要用什麼材料?在哪裡賣?誰在幫忙?
　例:雞蛋、茶葉、電鍋的電、店員的薪水
③ 把你的成本分成兩堆:每做一個都要花的/不管賣幾個都要付的
　分不出來的,寫一句「我不確定,因為⋯⋯」。
　例:每做一個都要花:雞蛋、茶葉。不管賣幾個都要付:店員薪水、電費。

🔍 從哪裡找:
🧋 學校附近的手搖飲店
🏪 便利商店的熱食櫃與飲料櫃
✏️ 文具店的筆記本和筆
🍗 夜市或學校旁邊的小吃攤
🎮 你常儲值的遊戲點數
🍱 家裡常叫的便當或外送

格式:文字、照片、截圖、畫圖都可以。至少拆 1 樣東西,三題都要回答。老師會親自回覆你。`;

export const L1S1_W4_BADGE_DATA = {
  rewardId: 'B-L1S1-W04',
  type: 'badge',
  name: '成本透視員',
  nameEn: 'Cost X-Ray Scout',
  description:
    '完成「我的零用錢,我作主」第一季 W4 的 10 題概念練習 + 老師審核通過 → 解鎖。你學會了:價格裡住著好幾個成本、原料是每做一個都要花的、店租和薪水是不管賣幾個都要付的,價格扣掉成本,剩下的才是店家留下來的。',
  weekLabel: 'W4',
  chapter: 'L1 我的零用錢,我作主 · 第一季',
  earnedFromWeek: 104,
  earnedVia: 'quiz-approval',
  image: '/images/L1W4_Badge_成本透視員_CostXRayScout_L1S1.png',
};

export const L1S1_W4_CARD_DATA = {
  rewardId: 'C-L1S1-W04',
  type: 'card',
  name: '60 元的秘密',
  nameEn: 'THE 60-DOLLAR SECRET',
  cardNumber: 'L1S1-W04-001',
  rarity: 'Rare ★★',
  description:
    '完成 W4 成本透視任務 + 老師親自回覆 → 解鎖。「每一個價格裡,都住著好幾個成本。」',
  weekLabel: 'W4',
  chapter: 'L1 我的零用錢,我作主 · 第一季',
  earnedFromWeek: 104,
  earnedVia: 'task-approval',
  image: '/images/L1W4_Card_60元的秘密_L1S1.png',
};

export const L1S1_W4_WEEK_DATA = {
  weekNumber: 104,
  title: '我的零用錢,我作主 · W4',
  quarter: 1,
  chapter: 'L1S1',
  question: '一杯 60 元的飲料,你付出去的錢,都跑去哪裡了?',

  // 學習道路主題週的標記:
  themeId: 'l1-g1', // 對應 arenaStructure / unlockedThemes 的主題 id
  roadWeek: 4, // 道路上的第幾關(學生看到的 W4)

  hasQuiz: true,
  hasOpenQuestion: false, // 簡答題已內建在練習題裡(quizTextAnswers)
  hasTask: true,

  videoUrl: null,
  videoCaption: null,

  quizQuestions,

  openQuestion: null,
  openQuestionMinChars: 30,

  taskTitle: '成本透視員 · 出任務',
  taskDescription,
  taskMinChars: 50,

  badgeId: L1S1_W4_BADGE_DATA.rewardId,
  cardId: L1S1_W4_CARD_DATA.rewardId,

  published: false, // 草稿 — 之後到 /admin/content/104 改成 true
};
