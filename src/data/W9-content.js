/**
 * W9 content — generated 2026-05-31 from Tiffany's W9 完整上架包
 *
 * 主題:時間放大師(等待,會長大|滾雪球篇)
 * 章節:Ch.3 月光森林(開章週,W9-W12)
 *
 * 上架選擇(2026-05-31):
 *  - 大問題:現在耐得住的「1」,會長成後面的「32」 —— 你願意先滾哪一顆小雪球?
 *  - 徽章 / 卡片:跟 W7/W8 一樣,rewardId 用系統 convention 'B-Q1-W09' / 'C-Q1-W09'
 *    (Tiffany 源檔裡的 'B-TA-4WPX' / 'C-TA-8SNH' 是兌換碼用的命名,跟 rewardId 是兩件事)
 *  - latestAvailableWeek:不動(維持目前值,W9 不會自動出現給學生)
 *  - published:false(草稿,要從 /admin/content/9 手動發佈)
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
    question:
      'Tiffany 老師說 Buffett 講過「人生就像滾雪球」。要讓雪球越滾越大,需要哪兩樣東西?',
    options: [
      '很多人推 + 很大的山',
      '夠濕的雪 + 夠長的坡',
      '很硬的雪 + 很冷的天氣',
      '很大的雪球 + 很短的路',
    ],
    correctIndex: 1,
    explanation:
      'Buffett 的原句是:「人生就像滾雪球。重要的是找到夠濕的雪 + 夠長的坡。」濕的雪會黏住,讓雪球越滾越大;短坡上雪球還沒長大就停了。雪 + 坡缺一不可。',
  },
  {
    id: 2,
    block: '基礎記憶',
    bloomLevel: 'L1',
    type: 'multiple_choice',
    question: '主課裡 B 組(每輪 ×2,從 1 開始)玩到第 10 輪,積木變成多少?',
    options: ['64 顆', '128 顆', '1,024 顆', '500 顆'],
    correctIndex: 2,
    explanation:
      '1 → 2 → 4 → 8 → 16 → 32 → 64 → 128 → 256 → 512 → 1,024。同樣 10 輪,A 組(每輪 +5)只有 55 顆。差快 20 倍。差別只有一件事 —— 一個願意等。',
  },
  {
    id: 3,
    block: '基礎記憶',
    bloomLevel: 'L1',
    type: 'multiple_choice',
    question:
      '「越後面長越快」這件事,大人給它取了一個名字。Tiffany 老師說那個名字是?',
    options: ['加倍', '指數', '複利', '存錢'],
    correctIndex: 2,
    explanation:
      '複利的意思就是「越後面長越快」。時間,是複利的燃料 —— 沒有時間,複利不會發生。Buffett 用「雪球」比喻它,因為比起死板的「複利」這兩個字,雪球更好想像。',
  },
  // ────────── L2 理解 Understand (Q4-Q7) ──────────
  {
    id: 4,
    block: '概念理解',
    bloomLevel: 'L2',
    type: 'multiple_choice',
    question:
      '小華參加積木遊戲在 B 組(×2)。前 5 輪她一直輸給 A 組(+5),很想換組。最準確的說法是?',
    options: [
      'B 組真的比較弱,應該換 A 組',
      '前面 B 組的數字很小,看起來慢,但它「長的速度」自己在變快',
      '遊戲不公平,A 組起點比較高',
      '只要 B 組更努力就會贏',
    ],
    correctIndex: 1,
    explanation:
      '翻倍的東西前面看起來像在原地,其實它在加速。第 5 輪,B 組第一次超過 A 組(32 vs 30);第 10 輪,B 組已經是 1024,A 組只有 55。「前面很小,不是沒在動,是它的速度自己在變快。」',
  },
  {
    id: 5,
    block: '概念理解',
    bloomLevel: 'L2',
    type: 'multiple_choice',
    question:
      '⭐ 回顧上週(W8):雪球需要「夠長的坡」。這個「長坡」跟 W8 學的「為什麼而存(目標/方向)」,最像哪一種關係?',
    options: [
      '沒有關係,兩件事完全分開',
      '有了目標(方向),長坡才有意義 —— 沒有方向的雪球只是亂滾',
      '長坡比目標重要,所以 W8 學的可以忘了',
      '目標只跟錢有關,跟雪球無關',
    ],
    correctIndex: 1,
    explanation:
      'W8 的「方向設計師」教你找到「為什麼而存」 —— 那是你雪球要滾向的方向。W9 的「時間放大師」教你時間會幫雪球變大。有方向 + 有時間 = 雪球變成你想要的樣子。沒方向的雪球,滾多久都只是亂滾。W8 + W9 合起來,雪球才真的活了。',
  },
  {
    id: 6,
    block: '概念理解',
    bloomLevel: 'L2',
    type: 'multiple_choice',
    question:
      '小李決定每天看 Tiffany 老師的影片 5 分鐘。看了 3 天,他覺得「我好像沒學到什麼東西」想放棄。對小李最有幫助的話是?',
    options: [
      '對啊,5 分鐘太少了,你應該一次看 1 小時',
      '你不適合學財商,做別的吧',
      '小雪球前面看起來慢是正常的。再撐到第 30 天,差別會明顯出來',
      '今天就放棄,反正沒效果',
    ],
    correctIndex: 2,
    explanation:
      '小雪球的本質就是「前面看起來像沒在動」。如果小李第 3 天就放棄,他永遠不會看到第 30 天的累積。Buffett 一生 99% 的財富在 50 歲之後才賺到 —— 不是他 50 歲突然變強,是他 50 歲之前一直在滾。',
  },
  {
    id: 7,
    block: '概念理解',
    bloomLevel: 'L2',
    type: 'multiple_choice',
    question:
      '主課裡,A 組玩到第 10 輪是 55 顆積木,B 組是 1,024 顆。Tiffany 老師說這個 18 倍的差距,真正的差別是?',
    options: [
      'B 組的人比較聰明',
      'B 組的人運氣比較好',
      'B 組的人更努力',
      '一個願意等,一個不願意等',
    ],
    correctIndex: 3,
    explanation:
      'Tiffany 老師原話:「沒有人比較聰明,沒有人比較努力,就只是『有沒有讓時間幫你做事』。」雪球理論的祕密 —— 不是力氣,不是天份,是耐心。',
  },
  // ────────── L3 應用 Apply (Q8-Q10) ──────────
  {
    id: 8,
    block: '反思應用',
    bloomLevel: 'L3',
    type: 'multiple_choice',
    question: '⭐ 反思題:看完這集主課,Tiffany 老師最希望你問自己什麼問題?',
    options: [
      '我什麼時候可以變成 Buffett?',
      '什麼時候會有 1024 顆積木?',
      '我要選哪一件事,開始滾我自己的小雪球?',
      '我要怎麼讓別人也來滾雪球?',
    ],
    correctIndex: 2,
    explanation:
      '這集真正的任務不是「懂複利」,是「找到一件你願意每天做一點點的事」。可以是練琴 1 首、看老師影片 5 分鐘、每天存 1 塊。重點不在做什麼,在「你選了什麼,然後開始」。',
  },
  {
    id: 9,
    block: '實際應用',
    bloomLevel: 'L3',
    type: 'multiple_choice',
    question:
      '小美想存錢買一台 1,200 元的繪圖板。她每週只能存 30 塊,要存 40 週(快 10 個月)。第 8 週她只存到 240 塊,只佔目標的 20%,覺得「永遠存不到」。最像「時間放大師」會做的選擇是?',
    options: [
      '放棄,直接跟爸媽要',
      '一次拿全部生日紅包丟進去,免得每週存太慢',
      '繼續每週存,因為小雪球前面看起來慢是正常的;同時想想有沒有第二件可以滾的小事',
      '把目標降低,改買 240 塊的便宜貨',
    ],
    correctIndex: 2,
    explanation:
      '存錢是線性的(每週 +30),沒有翻倍效果。但「持續做下去」這個習慣本身就是雪球 —— 等存到繪圖板那一天,小美學到的不只是 1200 塊,是「我會等」這個能力。這個能力,是未來所有大目標的起點。',
  },
  {
    id: 10,
    block: '實際應用',
    bloomLevel: 'L3',
    type: 'multiple_choice',
    question: '以下 4 個選擇,哪一個最像在滾「真的會長大的小雪球」?',
    options: [
      '今天一次練琴 3 小時,之後不再練',
      '每天看 5 小時 YouTube,連續看 30 天',
      '每天練琴 15 分鐘 / 看老師影片 5 分鐘 / 存 1 塊錢,連續做 30 天',
      '心情好的時候做一下,沒心情就跳過',
    ],
    correctIndex: 2,
    explanation:
      '雪球的三個條件:小 + 一直做 + 長坡(時間)。選項 A 一次做完就停 —— 沒有長坡。選項 B 連續做 30 天,但看 YouTube 不是讓你變強的事 —— 沒有「濕的雪」。選項 D 不持續 —— 雪球滾兩步就停了。只有 C 是真的小雪球:每天一點點,連續做,做的是會讓你長大的事。',
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

const taskDescription = `這禮拜你有三件任務,從「等一次」到「等 30 天」,慢慢練出你自己的雪球。

這週是 Ch.3「月光森林」的第一週。W8 你學會了問「為什麼而存」 —— 找到方向。這禮拜,你要練「時間怎麼幫你把那個方向變大」 —— 滾雪球。

【任務內容(三件,可分批完成)】
1. 24 小時等待挑戰 —— 挑一個你「現在超想要」的東西,先不要買、先不要吃,等 24 小時。記錄等待前後的渴望度(1-10)。
2. 翻倍計算格 —— 從 1 開始,每一格都翻倍。一格一格寫,看你可以寫到多大。寫到 1024 是基本;能繼續往下寫的話更好。
3. 我的小雪球(30 天) —— 選一件你想長期做的事(每天練琴一首 / 每天看老師影片 5 分鐘 / 每天存 1 塊或 5 塊 / 每天跟家人說「謝謝」),連續做 30 天,看累積會變成什麼樣子。

⭐ 沒做完 30 天也可以先上傳!先上傳「我選了什麼 + 第幾天進度」就能解鎖徽章 + 卡片,30 天後可以再回來補上完整紀錄。

【寫好 / 拍好後告訴 Tiffany 老師】
① 24 小時等待挑戰:你挑了什麼?等待前的渴望度?24 小時後變成多少?你發現了什麼?
   範例:我挑了「想買的扭蛋」。等待前渴望度 = 9。24 小時後 = 5。我發現:其實沒那麼想要了,我可能是看到別人有才想要。
② 翻倍計算格:把你寫的計算格拍照上傳(紙本手寫 / Excel / 任何形式都行)。
③ 我的小雪球:你選了哪一件事要連續做 30 天?為什麼選這件事?(可先上「啟動照片」,30 天後再補)
   範例:我選了「每天看老師影片 5 分鐘」。因為我看影片常常看一下就跑去玩,我想練「能撐住」這個能力。我今天是第 1 天。
④ 你覺得學到「等待會長大」之後,最大的發現是什麼?

⭐ 新功能:老師會在後台跟你「一來一往」討論你選了什麼、為什麼選 —— 一起把你的雪球設計得更清楚。

🔍 從哪裡找你的小雪球:
🍬 從「我現在超想要的那個東西」開始 —— 24 小時挑戰
📝 找一張紙、Excel、或 iPad 筆記,寫翻倍計算格
🎹 想想你會的樂器、運動、技能 —— 有沒有可以每天 15 分鐘的版本?
🎥 老師的影片庫 —— 每天 5 分鐘看一段,30 天等於看了 2.5 小時
💰 你的零錢罐 —— 每天投 1 塊或 5 塊,30 天後看罐子
💌 想想家人 —— 每天說一句「謝謝」或「我愛你」也是小雪球
🌟 不要選太大的!最好的小雪球是「小到你每天都不會找藉口」

格式:文字、照片、截圖、畫圖都可以。`;

export const W9_BADGE_DATA = {
  rewardId: 'B-Q1-W09',
  type: 'badge',
  name: '時間放大師',
  description:
    '完成 W9 競技場 10 題達 80% 以上 + 上傳三件任務(可先上啟動照片)+ 老師後台通過 → 解鎖。學會「等待,會長大」,讓時間幫你把小東西滾成大雪球。',
  weekLabel: 'W9',
  chapter: 'Ch.3',
  earnedFromWeek: 9,
  earnedVia: 'quiz-approval',
  image: '/images/W9_Badge_時間放大師_TimeAmplifier_Ch3.png',
};

export const W9_CARD_DATA = {
  rewardId: 'C-Q1-W09',
  type: 'card',
  name: '時間放大師之印',
  description:
    '完成 W9 任務(24h 挑戰 + 翻倍計算格 + 我的小雪球啟動)+ 上傳照片到後台 + 老師通過 → 解鎖。「現在耐得住的『1』,會長成後面的『32』。」',
  weekLabel: 'W9',
  chapter: 'Ch.3',
  earnedFromWeek: 9,
  earnedVia: 'task-approval',
  image: '/images/W9_Card_時間放大師之印_TimeAmplifier_Ch3.png',
};

export const W9_WEEK_DATA = {
  weekNumber: 9,
  title: 'Week 9',
  quarter: 1,
  chapter: 'Ch.3',
  question: '現在耐得住的「1」,會長成後面的「32」。你願意先滾哪一顆小雪球?',

  hasQuiz: true,
  hasOpenQuestion: false,
  hasTask: true,

  videoUrl: null,
  videoCaption: null,

  quizQuestions,

  openQuestion: null,
  openQuestionMinChars: 30,

  taskTitle: '時間放大師 · 滾一顆屬於你的小雪球',
  taskDescription,
  taskMinChars: 50,

  badgeId: W9_BADGE_DATA.rewardId,
  cardId: W9_CARD_DATA.rewardId,

  published: false, // 草稿 — 之後到 /admin/content/9 改成 true
};
