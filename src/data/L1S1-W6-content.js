/**
 * L1S1-W6 content — generated 2026-10-14 from Tiffany's「L1W6 小T財商概念競技場:完整上架包」
 *
 * 課程:L1 主題課 10-12｜我的零用錢,我作主(第一季)
 * 主題:機會成本與取捨(最後 100 元)
 * 本週身份:取捨觀察員 / Trade-off Spotter
 *
 * 一致性:
 *   主課頁面 → 夜市最後 100 元:第一雞排、第二夾娃娃 10 次、第三芒果冰;選雞排,機會成本是夾娃娃
 *              漫畫:小禾的星期六下午,第一打電動、第二練球、第三睡午覺;機會成本是練球
 *   生活案例 → 漫畫、打球、壓歲錢
 *   競技場任務 → 做一張自己的取捨紀錄卡
 *   家長語音 → Netflix 執行長:我們在跟睡眠競爭
 *
 * 上架設定(沿用 W1–W5 的 recipe):
 *  - 學習道路主題 l1-g1 的第 6 關,weekNumber = 106(道路週 = 100 + n)
 *  - 題型:選擇 7 題 + 是非 1 題 + 簡答 2 題(Q6、Q9)
 *    上架包的 short_answer 已轉成播放器用的 type 'text' + minChars,
 *    sampleAnswer 放進 placeholder 當作「例:」
 *  - 上架包 MISSION 的 description + 3 個上傳問題 + whereToLook 合併成一段 taskDescription(W1–W5 格式)
 *  - 上架包 REWARDS 寫「10 題達 80% 以上」:系統規則是全對 + 老師審核,描述已改成系統實際規則
 *  - rewardId 用 'B-L1S1-W06' / 'C-L1S1-W06'
 *  - published: false(草稿,要從 /admin/content/106 手動發佈)
 *  - 徽章/卡片圖檔檔名照上架包:L1W6_Badge_取捨觀察員_TradeoffSpotter_L1S1.png / L1W6_Card_最後100元_L1S1.png
 */

const quizQuestions = [
  // ---------- 記憶層(3 題) ----------
  {
    id: 1,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'multiple_choice',
    question: '做選擇時,你放掉的選項裡「下一個最好的那一個」,叫做什麼?',
    options: ['機會成本', '利潤', '收入', '店租'],
    answer: '機會成本',
    explanation:
      '機會成本是你放掉的下一個最好的選擇。它看不見,卻是每一個選擇都會付出的代價。',
  },
  {
    id: 2,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'multiple_choice',
    question: '錢和時間都有限,選了一個就沒辦法同時選另一個。這叫做什麼?',
    options: ['取捨', '虧損', '原料', '找零'],
    answer: '取捨',
    explanation: '取捨就是在有限的錢和時間裡做選擇。有取捨,就會有機會成本。',
  },
  {
    id: 3,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'true_false',
    question: '是非題:機會成本可以是錢能買的東西,也可以是時間能做的事。',
    answer: true,
    explanation:
      '對。夜市選了雞排,放掉的是夾娃娃;星期六選了打電動,放掉的是練球。錢和時間都會有機會成本。',
  },

  // ---------- 理解層(4 題,其中 1 題簡答) ----------
  {
    id: 4,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question:
      '夜市只剩 100 元。第一想要雞排,第二想要夾娃娃 10 次,第三想要芒果冰。選了雞排,機會成本是什麼?',
    options: ['夾娃娃 10 次', '芒果冰', '夾娃娃加芒果冰', '雞排'],
    answer: '夾娃娃 10 次',
    explanation:
      '機會成本只算下一個最好的。不選雞排的話,你會改選夾娃娃,所以機會成本是夾娃娃 10 次。',
  },
  {
    id: 5,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: '小禾說:「我選了打電動,機會成本是練球加睡午覺。」哪一句最能幫他修正?',
    options: [
      '機會成本只算下一個最好的,所以是練球',
      '機會成本是打電動',
      '他說得對,所有沒選的都要加起來',
      '時間沒有機會成本',
    ],
    answer: '機會成本只算下一個最好的,所以是練球',
    explanation:
      '小禾排第二的是練球。就算不打電動,他也會去練球,睡午覺本來就排在後面,所以只算練球。',
  },
  {
    id: 6,
    block: '概念理解',
    bloom: 'understand',
    type: 'text',
    grading: 'teacher_light',
    minChars: 15,
    question: '用你自己的話說說看:為什麼機會成本只算「下一個最好的」,不把所有沒選的加起來?',
    placeholder: '例:因為就算不選第一個,我也只會改選第二個,不可能同時做全部的事。',
    explanation:
      '你一次只能選一個。放棄第一名,你會拿到第二名,所以真正失去的是第二名。說得出這一點,你就懂機會成本了。',
  },
  {
    id: 7,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: '看見機會成本之後,最重要的是什麼?',
    options: [
      '看清楚每個選擇放掉了什麼,再由自己決定下一次怎麼選',
      '以後都不要打電動',
      '永遠選最便宜的',
      '做選擇之前先問別人該選哪個',
    ],
    answer: '看清楚每個選擇放掉了什麼,再由自己決定下一次怎麼選',
    explanation:
      '機會成本是一面鏡子,它幫你看見放掉的東西。小禾玩電動很開心,也看見了放掉的練球,下一次由他自己決定。',
  },

  // ---------- 應用層(3 題,其中 1 題簡答) ----------
  {
    id: 8,
    block: '實際應用',
    bloom: 'apply',
    type: 'multiple_choice',
    question:
      '小美有 50 元。第一想買漫畫,第二想買貼紙,第三想買餅乾。她買了漫畫,機會成本是什麼?',
    options: ['貼紙', '餅乾', '漫畫', '貼紙和餅乾'],
    answer: '貼紙',
    explanation: '小美排第二的是貼紙,所以買漫畫的機會成本是貼紙。',
  },
  {
    id: 9,
    block: '實際應用',
    bloom: 'apply',
    type: 'text',
    grading: 'teacher_light',
    minChars: 20,
    question: '寫下你這週的一次選擇:你選了什麼?放掉的下一個最好的是什麼?',
    placeholder: '例:我放學後選了看卡通,放掉的下一個最好的是去公園騎腳踏車。',
    explanation:
      '能說出自己選了什麼、放掉什麼,你就是一位取捨觀察員了。選得對不對由你自己判斷,重點是看得見。這題老師會親自看你的回答。',
  },
  {
    id: 10,
    block: '實際應用',
    bloom: 'apply',
    type: 'multiple_choice',
    question: 'W4 我們學了成本,是付出去的錢。這週學了機會成本。哪一句把兩個詞分清楚了?',
    options: [
      '成本是付出去的錢;機會成本是放掉的那個選擇',
      '成本和機會成本是同一件事',
      '機會成本一定比成本大',
      '只有花錢才有機會成本',
    ],
    answer: '成本是付出去的錢;機會成本是放掉的那個選擇',
    explanation:
      '買雞排的成本是 100 元;機會成本是你沒辦法再去夾的娃娃。一個看得見,一個看不見,兩個都是代價。',
  },
];

const taskDescription = `記下你這週的一次選擇,找出它的機會成本。

記下你這週做過的一次選擇,花錢或用時間都可以。

寫下至少 3 個選項並排出第一、第二、第三,寫下你選了哪一個,再圈出機會成本:放掉的下一個最好的那一個。

最後寫一句:如果重來一次,你還會這樣選嗎?為什麼?

【回答這三題】
① 你這週做了什麼選擇?當時有哪些選項?排出第一、第二、第三
　花錢或用時間都可以。可以拍照或直接寫。
　例:放學後一小時。第一:打球;第二:做美勞;第三:看卡通
② 你選了哪一個?它的機會成本是什麼?
　機會成本只寫一個:放掉的下一個最好的。
　例:我選了打球,機會成本是做美勞
③ 如果重來一次,你還會這樣選嗎?為什麼?
　還會這樣選、想換一個選,都是好答案。
　例:還會,因為打球讓我很開心;美勞明天再做也來得及

🔍 從哪裡找:
🍗 逛夜市或便利商店時的選擇
🎮 放學後或週末的時間安排
💰 零用錢或壓歲錢怎麼用
📚 先寫功課還是先玩
🎁 生日禮物想要哪一個
🏀 社團、才藝課、球隊練習

格式:文字、照片、截圖、畫圖都可以。至少做 1 張取捨紀錄卡,三題都要回答。老師會親自回覆你。`;

export const L1S1_W6_BADGE_DATA = {
  rewardId: 'B-L1S1-W06',
  type: 'badge',
  name: '取捨觀察員',
  nameEn: 'Trade-off Spotter',
  description:
    '完成「我的零用錢,我作主」第一季 W6 的 10 題概念練習 + 老師審核通過 → 解鎖。你學會了:錢和時間都有限,選了一個就會放掉另一個;放掉的下一個最好的,就是機會成本。成本是付出去的錢,機會成本是放掉的那個選擇,兩個都是代價。',
  weekLabel: 'W6',
  chapter: 'L1 我的零用錢,我作主 · 第一季',
  earnedFromWeek: 106,
  earnedVia: 'quiz-approval',
  image: '/images/L1W6_Badge_取捨觀察員_TradeoffSpotter_L1S1.png',
};

export const L1S1_W6_CARD_DATA = {
  rewardId: 'C-L1S1-W06',
  type: 'card',
  name: '最後 100 元',
  nameEn: 'THE LAST 100 DOLLARS',
  cardNumber: 'L1S1-W06-001',
  rarity: 'Rare ★★',
  description: '完成 W6 取捨紀錄卡任務 + 老師親自回覆 → 解鎖。「選了一個,就放掉另一個。」',
  weekLabel: 'W6',
  chapter: 'L1 我的零用錢,我作主 · 第一季',
  earnedFromWeek: 106,
  earnedVia: 'task-approval',
  image: '/images/L1W6_Card_最後100元_L1S1.png',
};

export const L1S1_W6_WEEK_DATA = {
  weekNumber: 106,
  title: '我的零用錢,我作主 · W6',
  quarter: 1,
  chapter: 'L1S1',
  question: '夜市只剩最後 100 元,選了一樣,放掉的是什麼?',

  // 學習道路主題週的標記:
  themeId: 'l1-g1', // 對應 arenaStructure / unlockedThemes 的主題 id
  roadWeek: 6, // 道路上的第幾關(學生看到的 W6)

  hasQuiz: true,
  hasOpenQuestion: false, // 簡答題已內建在練習題裡(quizTextAnswers)
  hasTask: true,

  videoUrl: null,
  videoCaption: null,

  quizQuestions,

  openQuestion: null,
  openQuestionMinChars: 30,

  taskTitle: '取捨觀察員 · 出任務',
  taskDescription,
  taskMinChars: 50,

  badgeId: L1S1_W6_BADGE_DATA.rewardId,
  cardId: L1S1_W6_CARD_DATA.rewardId,

  published: false, // 草稿 — 之後到 /admin/content/106 改成 true
};
