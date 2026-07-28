/**
 * L1S1-W2 content — generated 2026-07-27 from Tiffany's「06_L1W2_競技場上架包.js」
 *
 * 課程:L1 主題課 10-12｜我的零用錢,我作主(第一季)
 * 主題:購物車守門員(購物車裡的偷渡客)
 *
 * 上架設定(沿用 W1 的 recipe):
 *  - 學習道路主題 l1-g1 的第 2 關,weekNumber = 102(道路週 = 100 + n)
 *  - 題型:選擇 5 題 + 是非 1 題 + 配對 1 題 + 簡答 2 題 + 圖文 1 題
 *    簡答/圖文題作答後存進 weeklyProgress.quizTextAnswers,老師在後台審核時看得到
 *  - rewardId 用 'B-L1S1-W02' / 'C-L1S1-W02'
 *    (上架包裡的 B-CG-5H7K / C-CG-3N8R 是兌換碼命名,不是 rewardId,道路週靠審核解鎖)
 *  - published: false(草稿,要從 /admin/content/102 手動發佈)
 *  - 徽章/卡片圖檔:路徑照上架包檔名預留(PNG 放進 public/images/ 即接上)
 */

const quizQuestions = [
  // ---------- 記憶層(3 題) ----------
  {
    id: 1,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'multiple_choice',
    question: '「需要」是什麼?',
    options: [
      '負責讓日子更開心的東西',
      '生活要靠它才能運作的東西',
      '同學都有的東西',
      '打折的東西',
    ],
    answer: '生活要靠它才能運作的東西',
    explanation: '需要是生活要靠它才能運作的東西,像功課要靠筆芯才寫得下去。想要的工作則是讓日子更開心,兩個都很正常。',
  },
  {
    id: 2,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'true_false',
    question: '是非題:守門員的工作,是把所有「想要」都踢出購物車。',
    answer: false,
    explanation: '守門員的工作是看見:讓每一樣東西說得出它為什麼在這裡,最後放行誰由你決定。想要很正常,人人都有,它也可以留在你的購物車。',
  },
  {
    id: 3,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'matching',
    question: '配對題:把需求金字塔的三層,連到正確的內容。',
    pairs: [
      { left: '活下去(底層)', right: '吃飽、睡好、安全、健康' },
      { left: '和人在一起(中層)', right: '朋友、被喜歡、有歸屬' },
      { left: '變成更好的自己(頂層)', right: '學會新東西、完成目標、靠近夢想' },
    ],
    explanation: '人的需求有層次,像一座三層金字塔。底層是地基,最寬;越往上越靠近「你想成為的樣子」。它的全名叫「馬斯洛需求金字塔」,一百年前心理學家馬斯洛畫出來的,你會用它一輩子。',
  },

  // ---------- 理解層(4 題) ----------
  {
    id: 4,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: '「偷渡客」指的是什麼?',
    options: [
      '所有用零用錢買的東西',
      '趁你想著別的事、自己溜進購物車的東西',
      '比較貴的東西',
      '爸媽不准你買的東西',
    ],
    answer: '趁你想著別的事、自己溜進購物車的東西',
    explanation: '偷渡客是趁你想著別的事、自己溜上船的乘客。它可能是需要也可能是想要,重點是:帶它走這件事,少了你的決定。',
  },
  {
    id: 5,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: '班上大家都在收集同一款吊飾,你也超想要。照本週學的,這個想要最可能坐在金字塔的哪一層?',
    options: [
      '活下去:沒有吊飾會生病',
      '和人在一起:大家都有,你想跟大家一起',
      '變成更好的自己:吊飾會讓你變聰明',
      '它不在金字塔上',
    ],
    answer: '和人在一起:大家都有,你想跟大家一起',
    explanation: '吊飾背後坐著第二層:想跟同學一起、想有歸屬感。看懂想要坐在哪一層,你就開始看懂自己真正想要的是什麼。',
  },
  {
    id: 6,
    block: '概念理解',
    bloom: 'understand',
    type: 'text',
    grading: 'teacher_light',
    minChars: 10,
    question: '舉例題:寫一樣你生活裡真正的「需要」,用一句話說明你的生活哪裡要靠它。',
    placeholder: '例:我的眼鏡,上課看黑板全靠它。',
    explanation: '需要的判斷看「你的生活」:它天天在幫你做哪件重要的事。每個人的需要清單長得都有自己的樣子,這很正常。',
  },
  {
    id: 7,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: '為什麼餅乾和飲料常常會「卡在中間」,好難分?',
    options: [
      '因為它們太便宜了',
      '因為要看你當下的狀況:肚子餓的時候它接近需要,嘴饞的時候它是想要',
      '因為它們不算東西',
      '因為店員不告訴你答案',
    ],
    answer: '因為要看你當下的狀況:肚子餓的時候它接近需要,嘴饞的時候它是想要',
    explanation: '同一樣東西會因為「你的狀況」改變位置。守門員的做法是先誠實問一下肚子,再決定它的位置。兩種答案都可以,重點是誠實。',
  },

  // ---------- 應用層(2 題) ----------
  {
    id: 8,
    block: '實際應用',
    bloom: 'apply',
    type: 'multiple_choice',
    question: '你站在結帳櫃檯前,發現籃子裡多了一包本來沒打算買的軟糖。照守門員三問,你會先問哪一句?',
    options: [
      '這包軟糖好吃嗎?',
      '同學有沒有買過這款?',
      '它是需要還是想要?它是我自己決定放進來的嗎?',
      '下次還會不會打折?',
    ],
    answer: '它是需要還是想要?它是我自己決定放進來的嗎?',
    explanation: '守門員三問:需要還是想要、坐在哪一層、是我自己決定放進來的嗎。問完再決定放行誰,決定權在你手上。',
  },
  {
    id: 9,
    block: '實際應用',
    bloom: 'apply',
    type: 'text',
    grading: 'teacher_light',
    minChars: 15,
    question: '情境練習:表哥每次網購都為了湊免運多買兩三樣,收到之後常常連拆都沒拆。請用「守門員三問」的做法,寫一句你會給表哥的建議。',
    placeholder: '例:表哥,按結帳之前先幫湊免運的那樣東西問一句:它真的是我要的嗎?',
    explanation: '這題的答案由你來寫。重點是把守門員三問用在結帳前的那一刻,讓表哥看見「湊免運的那樣」常常是偷渡客,決定權還是在他手上。',
  },

  // ---------- 分析層(1 題,老師批改) ----------
  {
    id: 10,
    block: '守門員挑戰',
    bloom: 'analyze',
    type: 'text_or_image',
    grading: 'teacher',
    minChars: 20,
    question: '比較題:找一樣東西,它對某個人接近「需要」,對另一個人卻是「想要」(例如腳踏車、手機、便當盒)。各用兩句話分析為什麼,可以拍照或畫圖。',
    placeholder: '例:腳踏車對每天騎車上學的同學接近需要(上學全靠它)/對家裡已經有兩台的我是想要(它負責多一份開心)。',
    explanation: '能分析出「同一樣東西對不同人位置不同」,你就抓到需要和想要的關鍵了:看它在那個人的生活裡做了多少事。這題老師會親自回覆你。',
  },
];

const taskDescription = `這週你是購物車守門員。列出你這週(或最近)想買的 5 樣東西,正在想買的、已經買的,都可以列。用主課教的「購物車守門卡」幫每一樣回答守門員三問,把它們分上需求金字塔,排出放行順序,最後寫一句你的發現,拍照上傳。

需要和想要都很正常,老師想看的是你「看見」和「排序」的能力,我會親自回覆你。

【記錄這三件事】
① 你的 5 樣想買清單,每樣是需要還是想要?
　正在想買的、已經買的,都可以列。誠實分就好,卡在中間的就寫「卡在中間」。
　例:筆記本(需要)、新款吊飾(想要)、果汁軟糖(想要)、限量卡片(想要)、畫畫課材料費(需要)。
② 把它們分上金字塔:每樣坐在哪一層?有幾個是偷渡客?
　三層:活下去/和人在一起/變成更好的自己。偷渡客=自己溜進清單裡的那種。
　例:吊飾和卡片都坐第二層,軟糖是嘴饞,偷渡客有 2 個。
③ 排出放行順序:如果只能放行一樣,先放誰?把五樣排出 1 到 5,並寫一句你的發現。
　順序由你決定,理由才是重點。發現一句就好。
　例:1 筆記本、2 材料費、3 吊飾、4 卡片、5 軟糖。我發現五樣裡有三樣都是「想跟大家一起」,原來我真正想要的是這個。

🔍 從哪裡找:
🛒 這週逛便利商店、文具店時,手伸出去拿過的東西
📱 購物網站或遊戲裡,你放進購物車還沒結帳的東西
🏫 班上最近開始流行、你也開始想要的小物
🍪 結帳的時候順手拿的零食飲料(偷渡客最愛的上船地點!)
🎨 你為了學東西、練技能想買的工具(這種常常坐在金字塔上層)

格式:文字、照片、畫圖都可以。至少列 5 樣東西,三題都要寫。`;

export const L1S1_W2_BADGE_DATA = {
  rewardId: 'B-L1S1-W02',
  type: 'badge',
  name: '購物車守門員',
  nameEn: 'Cart Gatekeeper',
  description:
    '完成「我的零用錢,我作主」第一季 W2 的 10 題概念練習 + 老師審核通過 → 解鎖。你學會了:需要是生活要靠它才能運作、想要負責讓日子更開心、需求金字塔有三層、偷渡客要靠守門員三問抓出來。',
  weekLabel: 'W2',
  chapter: 'L1 我的零用錢,我作主 · 第一季',
  earnedFromWeek: 102,
  earnedVia: 'quiz-approval',
  image: '/images/L1W2_Badge_購物車守門員_CartGatekeeper_L1S1.png',
};

export const L1S1_W2_CARD_DATA = {
  rewardId: 'C-L1S1-W02',
  type: 'card',
  name: '守門員的金字塔',
  nameEn: "GATEKEEPER'S PYRAMID",
  cardNumber: 'L1S1-W02-001',
  rarity: 'Rare ★★',
  description:
    '完成 W2 購物車守門卡任務 + 老師親自回覆 → 解鎖。「看懂想要坐在哪一層,你就開始看懂自己。」',
  weekLabel: 'W2',
  chapter: 'L1 我的零用錢,我作主 · 第一季',
  earnedFromWeek: 102,
  earnedVia: 'task-approval',
  image: '/images/L1W2_Card_守門員的金字塔_L1S1.png',
};

export const L1S1_W2_WEEK_DATA = {
  weekNumber: 102,
  title: '我的零用錢,我作主 · W2',
  quarter: 1,
  chapter: 'L1S1',
  question: '購物車裡的每一樣東西,都是你自己決定放進來的嗎?',

  // 學習道路主題週的標記:
  themeId: 'l1-g1', // 對應 arenaStructure / unlockedThemes 的主題 id
  roadWeek: 2, // 道路上的第幾關(學生看到的 W2)

  hasQuiz: true,
  hasOpenQuestion: false, // 簡答題已內建在練習題裡(quizTextAnswers)
  hasTask: true,

  videoUrl: null,
  videoCaption: null,

  quizQuestions,

  openQuestion: null,
  openQuestionMinChars: 30,

  taskTitle: '購物車守門員 · 出任務',
  taskDescription,
  taskMinChars: 50,

  badgeId: L1S1_W2_BADGE_DATA.rewardId,
  cardId: L1S1_W2_CARD_DATA.rewardId,

  published: false, // 草稿 — 之後到 /admin/content/102 改成 true
};
