/**
 * W10 content — generated 2026-06-06 from Tiffany's W10 完整上架包
 *
 * 主題:價值鑑定師(便宜 vs 划算|值不值得的判斷)
 * 章節:Ch.3 月光森林(第二週,W9-W12)
 *
 * 上架選擇(2026-06-06,沿用 W9 convention):
 *  - 大問題:一樣的東西,憑什麼有人買貴卻划算、有人買便宜卻浪費?
 *  - 徽章 / 卡片:跟 W7/W8/W9 一樣,rewardId 用系統 convention 'B-Q1-W10' / 'C-Q1-W10'
 *    (Tiffany 源檔裡的 'B-VA-7K3R' / 'C-VA-9P2M' 是兌換碼用的命名,跟 rewardId 是兩件事)
 *  - latestAvailableWeek:不動(維持目前值,W10 不會自動出現給學生)
 *  - published:false(草稿,要從 /admin/content/10 手動發佈)
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
    question: 'Tiffany 老師說「便宜」跟「划算」最大的不同是什麼?',
    options: [
      '便宜和划算其實是同一件事',
      '便宜看的是「標價(數字)」,划算看的是「對你值不值得」',
      '便宜比較好,划算比較不好',
      '只有貴的東西才談得上划算',
    ],
    correctIndex: 1,
    explanation:
      '便宜是用數字比出來的 — 10 塊比 15 塊便宜,很好量化。但划算沒辦法只用數字算,它要看「這個東西對『你的需求』值不值得」。所以同一個東西,有人覺得划算、有人覺得不划算,很正常。',
  },
  {
    id: 2,
    block: '基礎記憶',
    bloomLevel: 'L1',
    type: 'multiple_choice',
    question: '主課裡 Tiffany 老師給了一個「划算公式」。它是?',
    options: [
      '划算 = 標價 × 數量',
      '划算 = 我付出的代價 ÷ 滿足的需求',
      '划算 = 滿足我的需求 ÷ 我付出的代價',
      '划算 = 別人覺得貴不貴',
    ],
    correctIndex: 2,
    explanation:
      '划算 = 滿足我的需求(分子) ÷ 我付出的代價(分母)。便宜只看分母(你付了多少錢);划算要把分子「它滿足了我多少需求」一起加進來看。這個公式算不出精確數字,但它是一個你可以放在心裡問自己的方向。',
  },
  {
    id: 3,
    block: '基礎記憶',
    bloomLevel: 'L1',
    type: 'multiple_choice',
    question: '為什麼洋芋片要一直推出香菜、鹹蛋、煎蛋這些新口味?',
    options: [
      '因為新口味的成本比較高',
      '因為舊口味壞掉了',
      '因為新口味會製造「話題」,而話題就是免費的廣告',
      '因為政府規定要換口味',
    ],
    correctIndex: 2,
    explanation:
      'Tiffany 老師說:新口味讓大家討論「你吃過那個香菜口味嗎?」— 不知道的人都變知道了,這就是超級棒的免費廣告。它不是要讓你吃得更划算,是要讓你「想試試看」。',
  },
  // ────────── L2 理解 Understand (Q4-Q7) ──────────
  {
    id: 4,
    block: '概念理解',
    bloomLevel: 'L2',
    type: 'multiple_choice',
    question:
      '小明看到:600ml 飲料賣 30 元、1500ml 同款賣 60 元。他算出大瓶單價比較低,就買了大瓶,結果只喝了 600ml,剩下 900ml 倒掉。最準確的說法是?',
    options: [
      '大瓶單價低,所以一定比較划算',
      '大瓶算起來比較划算,但小明喝不完倒掉,反而買貴了 — 變得不划算',
      '小明做得很好,因為他買到便宜的',
      '兩種一樣,沒有差別',
    ],
    correctIndex: 1,
    explanation:
      '大瓶單價 0.04 元/ml,確實比小瓶 0.05 元/ml 低。但小明只喝得了 600ml,等於花 60 塊只用到 600ml — 他明明可以花 30 塊買小瓶!「划算」一定要把你『真正用得到多少』算進去,不是只看單價。',
  },
  {
    id: 5,
    block: '概念理解',
    bloomLevel: 'L2',
    type: 'multiple_choice',
    question:
      '⭐ 回顧上週(W9):我們學雪球 — 每天累積一點點,時間會把它變大。這週學「划算判斷」。兩週合起來,最完整的說法是?',
    options: [
      '兩件事沒有關係',
      '會滾雪球就好,買東西不用想划不划算',
      '累積了很久的錢,花出去時更要判斷值不值得 — 不然雪球白滾了',
      '划算比雪球重要,所以上週的可以忘了',
    ],
    correctIndex: 2,
    explanation:
      '主課一開始 Tiffany 老師就說:就算你累積了很多(雪球),終究有一天要買東西,那時候還是要問自己「這個選擇對我值不值得」。W9 教你「把錢變大」,W10 教你「把錢花對」— 兩個一起,你的雪球才不會花一次就破。',
  },
  {
    id: 6,
    block: '概念理解',
    bloomLevel: 'L2',
    type: 'multiple_choice',
    question:
      '同一款星巴克 Pike Place 咖啡豆,在全聯比門市便宜。可是 Tiffany 老師說,兩種地方買的人「都划算」。為什麼?',
    options: [
      '因為門市的人比較笨,被騙了',
      '因為全聯的豆子是假的',
      '因為兩種人的「需求」不一樣 — 全聯的人要自己煮(買食材),門市的人要環境和服務(買體驗)',
      '因為價格其實一樣',
    ],
    correctIndex: 2,
    explanation:
      '去全聯的人想自己煮、要的是食材本身;去門市的人想要被服務、要的是環境、體驗、有人幫你磨豆子。需求不一樣 → 滿足的價值不一樣 → 價格就可以不一樣。兩種人各自買到自己要的,所以都划算。',
  },
  {
    id: 7,
    block: '概念理解',
    bloomLevel: 'L2',
    type: 'multiple_choice',
    question:
      '下大雨,小華在自家樓下便利商店買了氣泡水,比家樂福貴 5 塊。Tiffany 老師說這多花的 5 塊,小華買到的是什麼?',
    options: [
      '什麼都沒有,就是被坑了',
      '買到了「方便」和「時間」— 不用冒雨坐 20 分鐘車去家樂福',
      '買到了比較好喝的氣泡水',
      '買到了比較大瓶的氣泡水',
    ],
    correctIndex: 1,
    explanation:
      '多的 5 塊,買的是「不用走過去那家店」的時間和方便。那一刻小華最需要的是省時間、不淋雨,不是省那 5 塊。划算,有時候要看你「當下最需要什麼」。(但老師也提醒:還是要回到 W7 五個罐子,別超過預算喔!)',
  },
  // ────────── L3 應用 Apply (Q8-Q10) ──────────
  {
    id: 8,
    block: '反思應用',
    bloomLevel: 'L3',
    type: 'multiple_choice',
    question:
      '⭐ 反思題:買東西前,Tiffany 老師最希望你先停下來三秒,問自己的「第一個問題」是什麼?',
    options: [
      '這個有沒有打折?',
      '別人有沒有買?',
      '我真正要滿足的需求是什麼?',
      '哪一個最便宜?',
    ],
    correctIndex: 2,
    explanation:
      '三個鑑定問題的第一個,就是「我真正要滿足的需求是什麼」。先停三秒、想清楚需求(例:我其實只喝得了 300ml),再去判斷買到的是什麼、值不值得。想清楚需求,你就不會被「看起來划算」騙走。',
  },
  {
    id: 9,
    block: '實際應用',
    bloomLevel: 'L3',
    type: 'multiple_choice',
    question:
      '小美本來只想買 1 罐果醬。店員說「限時買二送一」,算下來好像很划算,於是她帶了 3 罐回家。但她一個月只吃得完 1 罐。這 3 罐的選擇,最準確的說法是?',
    options: [
      '超划算!買越多送越多一定賺',
      '多買的 2 罐如果吃不完、會過期,那再便宜都是多花的',
      '一定要買,因為錯過就虧了',
      '果醬不會壞,所以買幾罐都划算',
    ],
    correctIndex: 1,
    explanation:
      'Tiffany 老師說:「需要的時候,便宜當然賺到;不需要的時候,再便宜都是多花的。」限時、買二送一是「特別設計給你看的划算」。先問「我真的需要這麼多嗎?」吃不完會過期,那 2 罐就不是省錢,是浪費。',
  },
  {
    id: 10,
    block: '實際應用',
    bloomLevel: 'L3',
    type: 'multiple_choice',
    question:
      '小李要買衛生紙。架上有大包(單價較低)和小包(單價較高)。以下哪個做法最像一個「價值鑑定師」?',
    options: [
      '直接買大包,因為單價低一定最划算',
      '直接買小包,因為總價低一定最便宜',
      '先想清楚需求 — 如果要隨身攜帶,就算小包單價高也選小包;如果家裡用、放得下,大包才划算',
      '兩個都買,反正都會用到',
    ],
    correctIndex: 2,
    explanation:
      '價值鑑定師不是「看哪個單價低就買」,是「先想清楚需求,再判斷」。要隨身帶 → 小包才滿足需求(攜帶方便),就算單價高也划算;家裡用、放得下 → 大包用得完才划算。先有需求,再談便宜划算 — 這就是這一週的核心。',
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

const taskDescription = `這禮拜你要當價值鑑定師 — 找 3 組「長得很像、價錢不一樣」的東西,用主課的三個問題,鑑定哪個對「你」最划算。

這週是 Ch.3「月光森林」的第二週。W9 你學會了滾雪球(把錢變大)。這禮拜,你要學「把錢花對」 — 判斷一個東西到底「值不值得」。

【任務內容:找 3 組「長得很像、價錢不一樣」的東西】
(例:大瓶 vs 小瓶、大包 vs 小包、夜市 vs 超商、自有品牌 vs 名牌)

每一組,先寫下你的需求,再用三個問題鑑定:
① 我真正要滿足的需求是什麼?
② 這個價格,除了東西本身,我還買到了什麼?(品質 / 時間 / 體驗 / 品牌 / 數量)
③ 對「我這個需求」來說,哪個比較划算?

⭐ 三組的答案可以都不一樣!因為需求不一樣,這非常正常。
⭐ 老師會在後台看你的鑑定,跟你討論你想清楚需求了沒。
⭐ 提醒:就算大包算起來比較划算,如果你用不完、吃不完,也不一定有它的價值喔。

【寫好 / 拍好後告訴 Tiffany 老師】
① 【找 3 組】把你找到的 3 組「同類不同價」的東西拍照或寫下來。它們各是什麼?價錢差多少?
   範例:第1組 — 600ml 飲料 30 元 vs 1500ml 同款 60 元;第2組 — 便利商店御飯糰 vs 超市御飯糰;第3組 — 夜市襪子 vs 百貨襪子。
② 【先想需求】針對其中一組,寫下「你真正要滿足的需求是什麼」?
   範例:我選飲料這組。我的需求是「我一個人喝,而且只喝得完 600ml,喝不完會倒掉」。
③ 【做鑑定】這個價格除了東西本身,你還買到了什麼?(品質/時間/體驗/品牌/數量)對你來說哪個比較划算?為什麼?
   範例:大瓶雖然單價低,但我喝不完會倒掉,等於買貴了。對「我這個需求」來說,600ml 小瓶才划算,因為我會剛好喝完、不浪費。
④ ⭐ 鑑定完三組之後,你最大的發現是什麼?

🔍 從哪裡找你的三組:
🛒 超市 / 大賣場 — 同款飲料的大瓶 vs 小瓶、大包 vs 小包
🏪 便利商店 vs 超市 — 同一個御飯糰、同一瓶水,兩邊價錢差多少?
🌃 夜市 vs 百貨 — 看起來很像的襪子、髮飾、小東西
🏷️ 自有品牌 vs 名牌 — 例如超市自有品牌餅乾 vs 知名品牌餅乾
📱 廣告 / 限時動態 — 找一個「買一送一 / 限時特價」,問自己「我本來需要嗎?」
☕ 同款不同店 — 像主課的咖啡豆:全聯 vs 門市
🌟 重點不是找最便宜的,是練習「先想需求,再做鑑定」

格式:文字、照片、截圖、畫圖都可以。`;

export const W10_BADGE_DATA = {
  rewardId: 'B-Q1-W10',
  type: 'badge',
  name: '價值鑑定師',
  description:
    '完成 W10 競技場 10 題達 80% 以上 + 上傳 3 組同類不同價鑑定 + 老師後台通過 → 解鎖。學會「便宜看標價,划算看對你值不值」,先想清楚需求再判斷。',
  weekLabel: 'W10',
  chapter: 'Ch.3',
  earnedFromWeek: 10,
  earnedVia: 'quiz-approval',
  image: '/images/W10_Badge_價值鑑定師_ValueAppraiser_Ch3.png',
};

export const W10_CARD_DATA = {
  rewardId: 'C-Q1-W10',
  type: 'card',
  name: '價值鑑定師之印',
  description:
    '完成 W10 任務(3 組同類不同價鑑定)+ 上傳照片到後台 + 老師通過 → 解鎖。「便宜是別人定的標價;划算,是你自己鑑定出來的答案。」',
  weekLabel: 'W10',
  chapter: 'Ch.3',
  earnedFromWeek: 10,
  earnedVia: 'task-approval',
  image: '/images/W10_Card_價值鑑定師之印_ValueAppraiser_Ch3.png',
};

export const W10_WEEK_DATA = {
  weekNumber: 10,
  title: 'Week 10',
  quarter: 1,
  chapter: 'Ch.3',
  question: '一樣的東西,憑什麼有人買貴卻划算、有人買便宜卻浪費?',

  hasQuiz: true,
  hasOpenQuestion: false,
  hasTask: true,

  videoUrl: null,
  videoCaption: null,

  quizQuestions,

  openQuestion: null,
  openQuestionMinChars: 30,

  taskTitle: '價值鑑定師 · 鑑定三組「長得很像、價錢不一樣」的東西',
  taskDescription,
  taskMinChars: 50,

  badgeId: W10_BADGE_DATA.rewardId,
  cardId: W10_CARD_DATA.rewardId,

  published: false, // 草稿 — 之後到 /admin/content/10 改成 true
};
