/**
 * W8 content — generated 2026-05-23 from Tiffany's W8 完整上架包
 *
 * 主題:方向設計師(為什麼而存?目標,才是錢的方向)
 * 章節:Ch.2 破曉探索(收官週,W5-W8)
 *
 * 上架選擇(2026-05-23):
 *  - 大問題:沒有目標的存,是數字遊戲。那「有目標的存」長什麼樣?
 *  - 徽章 / 卡片:跟 W7 一樣,rewardId 用系統 convention 'B-Q1-W08' / 'C-Q1-W08'
 *    (Tiffany 源檔裡的 'B-DD-7HVK' / 'C-DD-3MFT' 是兌換碼用的命名,跟 rewardId 是兩件事)
 *  - latestAvailableWeek:不動(維持 7,W8 不會自動出現給學生)
 *  - published:false(草稿,要從 /admin/content/8 手動發佈)
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
    question: 'Tiffany 老師說的 W8 核心金句是「錢只是工具,_____ 才是方向」。空格應該填?',
    options: ['存款', '目標', '收入', '罐子'],
    correctIndex: 1,
    explanation:
      '完整金句是「錢只是工具,目標才是方向」。沒有目標的存,是數字遊戲;有目標的存,才是推進人生。錢本身不會帶你到任何地方 — 目標才是方向盤。',
  },
  {
    id: 2,
    block: '基礎記憶',
    bloomLevel: 'L1',
    type: 'multiple_choice',
    question: '存罐有兩個用途。Tiffany 老師說,哪一個是「先照顧自己」的部分?',
    options: [
      '存錢買新的腳踏車',
      '存錢去日本看櫻花',
      '存錢給「水壺不見、文具壞掉、突然要送朋友禮物」這種緊急開銷用',
      '存錢去上程式設計課',
    ],
    correctIndex: 2,
    explanation:
      '存罐的兩個用途是 ① 先照顧自己(緊急開銷的小盾牌)+ ② 再設計方向(為了想成為的樣子而存)。順序很重要 — 先安全感,再未來感。① 永遠先放好,不要全部花掉。',
  },
  {
    id: 3,
    block: '基礎記憶',
    bloomLevel: 'L1',
    type: 'multiple_choice',
    question: '16 歲的大谷翔平畫了一張 9×9 = 81 格的表,中間的核心目標是?',
    options: [
      '成為最強運動員',
      '成為 8 球團第一指名',
      '去美國打球',
      '球速 160 公里',
    ],
    correctIndex: 1,
    explanation:
      '大谷 16 歲時把「成為日本職棒 8 球團第一指名」放在 81 格的最中間,然後拆出 8 個方向(體格、控球、心理、運氣⋯⋯),每個方向再拆 8 件小事。1 個大目標 → 8 個方向 → 64 個小行動 = 81 格。他做了 13 年。',
  },
  // ────────── L2 理解 Understand (Q4-Q7) ──────────
  {
    id: 4,
    block: '概念理解',
    bloomLevel: 'L2',
    type: 'multiple_choice',
    question:
      '11 歲的 Warren Buffett 買了人生第一張股票。股票跌到 $27 時他賣掉了,後來漲到 $202。他學到的最重要的功課是?',
    options: [
      '不要再買股票了',
      '不要跟妹妹合夥',
      '耐心 — 投資需要時間,不能因為短期下跌就賣掉',
      '股票很危險',
    ],
    correctIndex: 2,
    explanation:
      '巴菲特自己說:「那是我學到『耐心』的第一堂課。」他 11 歲就懂了一件大人很多都還沒懂的事 — 投資是時間的遊戲,不是看誰反應快。他後來 95 歲,身價 1500 億美元。',
  },
  {
    id: 5,
    block: '概念理解',
    bloomLevel: 'L2',
    type: 'multiple_choice',
    question:
      '⭐ 回顧上週(W7):小華有一個目標 — 8 個月後想去上一個 12000 元的程式設計課程。按 5 罐子最聰明的做法是?',
    options: [
      '把花罐的錢都拿去存,完全不買零食',
      '只用存罐 — 但 8 個月可能存不夠',
      '存罐 + 學罐 + 投罐 一起加起來,讓三個罐子合力存到 12000',
      '不存錢,直接跟爸媽借',
    ],
    correctIndex: 2,
    explanation:
      '這題連結 W7「5 罐子」+ W8「目標 × 時間」。短期目標通常用花罐 + 一點存罐;中期目標主要用存罐;長期目標可以加上學罐 + 投罐 — 因為時間長,投資的錢可以滾。Tiffany 說:「不同的罐子幫你達成短中長期目標」。',
  },
  {
    id: 6,
    block: '概念理解',
    bloomLevel: 'L2',
    type: 'multiple_choice',
    question: 'Tiffany 說「沒有 WHY 的存」很容易發生什麼事?',
    options: [
      '罐子會破掉',
      '看到限時優惠,容易整罐掏空;或看到別人有,就跟著買',
      '錢自己會消失',
      '存比較慢',
    ],
    correctIndex: 1,
    explanation:
      '沒有 WHY 的存 = 數字遊戲。數字漲了開心,看到限時優惠就忍不住;看到別人買也想跟。有 WHY 的存 = 推進人生 — 你知道自己要去哪裡,別人怎麼說都不會影響你。',
  },
  {
    id: 7,
    block: '概念理解',
    bloomLevel: 'L2',
    type: 'multiple_choice',
    question: '大谷的 81 格曼陀羅裡,他把「運氣」當成什麼?',
    options: [
      '天生命定的東西',
      '可以被拆解 + 被自己的行為吸引來的東西(撿垃圾、打招呼、寫日記⋯⋯)',
      '看別人的臉色',
      '神給的禮物,不能改變',
    ],
    correctIndex: 1,
    explanation:
      '大谷在「運氣」這 1 格裡,寫了 8 件小事:撿垃圾、打招呼、撿球、不浪費物品、繼續走球、對人友善、書寫日記、為審判正直。他相信「運氣是被你的行為吸引而來的」。所以連看似不能控制的東西,他都把它拆解成「我可以做的小事」。',
  },
  // ────────── L3 應用 Apply (Q8-Q10) ──────────
  {
    id: 8,
    block: '實際應用',
    bloomLevel: 'L3',
    type: 'multiple_choice',
    question: '⭐ Tiffany 老師建議:寫下目標之後要做什麼?(反思題)',
    options: [
      '存得越多越好',
      '不告訴任何人,當作秘密',
      '多問自己幾次「為什麼」— 為什麼是這個?為什麼是這個品牌?為什麼是這個時間?',
      '跟朋友比誰的目標比較酷',
    ],
    correctIndex: 2,
    explanation:
      'Tiffany 老師的方法:寫下目標 → 多問幾次「為什麼」。為什麼想要一台腳踏車?為什麼不是別的?為什麼是這個品牌?為什麼是這個時間?多問幾次,你會發現有些目標經得起拆解,有些一拆就散掉了 — 散掉的本來就不是你的。',
  },
  {
    id: 9,
    block: '實際應用',
    bloomLevel: 'L3',
    type: 'multiple_choice',
    question: '小李想要一台 1800 元的腳踏車。按 Tiffany 老師說的目標規劃,他可以怎麼設計?',
    options: [
      '等爸媽買給他',
      '跟同學借',
      '3 個月期限,每個月從零用錢存 600 元',
      '隨便,有錢就買',
    ],
    correctIndex: 2,
    explanation:
      '這就是 Tiffany 在主課裡舉的例子。1800 元 ÷ 3 個月 = 每月 600 元。把目標拆成「金額 × 時間 × 每月行動」,大目標就變成可以執行的小步驟。然後跟爸媽溝通安全條件(戴安全帽、報備路線),目標就推進了。',
  },
  {
    id: 10,
    block: '實際應用',
    bloomLevel: 'L3',
    type: 'multiple_choice',
    question:
      '⭐ Ch.2 收官整合題:Ch.2「破曉探索」四週你學了 W5 分辨需要 vs 想要、W6 看穿稀缺、W7 主動分 5 罐子、W8 為什麼而存。這四件事的關係最接近?',
    options: [
      '它們是各自獨立的',
      'W5 最重要,其他都是附屬',
      '每一個都是工具,串起來幫你「自己選自己的人生方向」 — 從分辨 → 看穿 → 主動分 → 為什麼',
      '只是大人發明的概念',
    ],
    correctIndex: 2,
    explanation:
      'Ch.2「破曉探索」的完整路徑:W5 學會分辨(需要 vs 想要)→ W6 看穿陷阱(稀缺是真的還是假的)→ W7 主動分配(5 罐子)→ W8 設定方向(為什麼而存)。前面三週是「工具」,W8 給你「方向盤」。沒有方向盤,所有工具都是漫無目的的轉。下週進入第 3 章,我們會繼續用這些工具,打開新的世界。',
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

const taskDescription = `寫下你的短期、中期、長期目標各一個,然後多問幾次「為什麼」,看看哪些經得起拆解。

這週是 Ch.2「破曉探索」的最後一週。W5 你學會分辨「需要 vs 想要」、W6 看穿稀缺、W7 主動分 5 罐子。現在,你要把這些工具串起來 — 設計你自己的「方向」。

【任務內容】
1. 寫下 1 個短期目標(1-3 個月內想達成的)
2. 寫下 1 個中期目標(6-12 個月內想達成的)
3. 寫下 1 個長期目標(2 年以上想達成 / 想成為的)
4. 每一個目標都多問幾次「為什麼想要它」
5. 對應每個目標,你想用哪個罐子來存?(連結 W7)

【寫好後告訴 Tiffany 老師】
① 短期目標(1-3 個月)+ 為什麼(至少問 2 次)
   範例:我想要一台 1800 元的腳踏車。為什麼?① 我想自己騎去圖書館 ② 我想體驗「我可以自己決定去哪」的感覺
② 中期目標(6-12 個月)+ 為什麼
   範例:8 個月後我想去上一個 12000 元的程式設計課。為什麼?① 我想自己設計遊戲 ② 我喜歡解問題的感覺
③ 長期目標(2 年以上 / 想成為的樣子)+ 為什麼
   範例:我想 2 年後跟家人去日本看櫻花。為什麼?① 我喜歡櫻花的顏色 ② 我想看看不同國家的人怎麼生活
④ 對應這 3 個目標,你會用哪個罐子存錢?
   (短期常用花罐 + 存罐 / 中期主要存罐 / 長期可加學罐 + 投罐)

⭐ 新功能:這次老師會在後台跟你「一來一往」討論你的目標 — 老師會好奇地問你問題,讓你想得更深。你也可以回覆老師,我們一起把你的目標想清楚。

🔍 可以觀察的時刻:
✏️ 找一張白紙、筆記本、或下方輸入框寫下來
🧭 翻翻你 W7 的 5 罐子比例設定,想想哪個罐子能存到目標
💬 跟爸媽分享你寫的目標(可選),聽聽他們的反應
🌟 看看你的偶像/榜樣有什麼目標,問自己「我的版本是什麼?」
📓 過去一週寫的願望清單,挑 3 個放進來
🎯 不要寫太大!最好的目標是「具體 + 可以拆成小行動」

格式:文字、照片、截圖、畫圖都可以。`;

export const W8_BADGE_DATA = {
  rewardId: 'B-Q1-W08',
  type: 'badge',
  name: '方向設計師',
  description:
    '完成 W8 競技場 10 題達 80% 以上 → 解鎖。學會「錢只是工具,目標才是方向」,寫下短/中/長期目標 + 拆解 WHY,讓每一塊錢都推進你想成為的樣子。',
  weekLabel: 'W8',
  chapter: 'Ch.2',
  earnedFromWeek: 8,
  earnedVia: 'quiz-approval',
  image: '/images/W8_Badge_方向設計師_DirectionDesigner_Ch2.png',
};

export const W8_CARD_DATA = {
  rewardId: 'C-Q1-W08',
  type: 'card',
  name: '方向設計師之印',
  description:
    '完成 W8 任務 + 上傳 3 個目標(短/中/長期)+ 每個目標的「為什麼」+ 老師通過 → 解鎖。「錢只是工具 —— 目標,才是方向。」',
  weekLabel: 'W8',
  chapter: 'Ch.2',
  earnedFromWeek: 8,
  earnedVia: 'task-approval',
  image: '/images/W8_Card_方向設計師之印_DirectionDesigner_Ch2.png',
};

export const W8_WEEK_DATA = {
  weekNumber: 8,
  title: 'Week 8',
  quarter: 1,
  chapter: 'Ch.2',
  question: '錢只是工具 —— 目標,才是方向。你的方向是什麼?',

  hasQuiz: true,
  hasOpenQuestion: false,
  hasTask: true,

  videoUrl: null,
  videoCaption: null,

  quizQuestions,

  openQuestion: null,
  openQuestionMinChars: 30,

  taskTitle: '方向設計師 · 寫下你的 3 個目標',
  taskDescription,
  taskMinChars: 50,

  badgeId: W8_BADGE_DATA.rewardId,
  cardId: W8_CARD_DATA.rewardId,

  published: false, // 草稿 — 之後到 /admin/content/8 改成 true
};
