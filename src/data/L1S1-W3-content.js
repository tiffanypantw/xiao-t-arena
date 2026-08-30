/**
 * L1S1-W3 content — generated 2026-08-30 from Tiffany's「L1W3_QUESTIONS.js」上架包
 *
 * 課程:L1 主題課 10-12｜我的零用錢,我作主(第一季)
 * 主題:小店店長(收入從哪裡來)
 *   ⚠️ 上架包原本叫「價值搭橋人／搭橋人之印」,但徽章與卡片圖檔做出來是
 *      「小店店長 Little Shopkeeper」「第一個客人 The First Customer」,
 *      依慣例以圖檔為準,名稱已改。橋的比喻仍留在題目解釋裡。
 *
 * 上架設定(沿用 W1/W2 的 recipe):
 *  - 學習道路主題 l1-g1 的第 3 關,weekNumber = 103(道路週 = 100 + n)
 *  - 題型:選擇 7 題 + 是非 1 題 + 簡答 2 題
 *    上架包原本 10 題全是選擇/是非,依 Tiffany 決定把 Q6、Q8 改寫成簡答題,
 *    孩子作答後存進 weeklyProgress.quizTextAnswers,老師在後台審核時看得到、可以開對話串
 *  - 上架包的 answer 是選項「索引」(0),播放器用的是選項「全文」,已轉換
 *  - Q10 依 Tiffany 決定:內容照原樣,拿掉「【回顧】」標籤
 *  - rewardId 用 'B-L1S1-W03' / 'C-L1S1-W03'
 *    (上架包裡的 B-XX-YYYY / C-XX-YYYY 是兌換碼欄位的佔位,不是 rewardId)
 *  - published: false(草稿,要從 /admin/content/103 手動發佈)
 *  - 徽章/卡片圖檔:沿用 W2 的命名慣例(PNG 放進 public/images/ 即接上)
 */

const quizQuestions = [
  // ---------- 記憶層(3 題) ----------
  {
    id: 1,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'multiple_choice',
    question: '這一週小T說:「收入其實就是______的回報。」空格裡是什麼?',
    options: ['幫忙', '運氣', '年紀', '努力讀書'],
    answer: '幫忙',
    explanation:
      '收入是幫忙的回報。有人因為你幫他解決了一件事,所以把錢交給你。錢會走過來,是因為中間有一座橋。',
  },
  {
    id: 2,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'multiple_choice',
    question: '錢要從一個人的口袋走到另一個人的口袋,中間那座「橋」是什麼?',
    options: ['幫忙解決別人的需求', '認識很多人', '把價格訂得很低', '運氣好被選中'],
    answer: '幫忙解決別人的需求',
    explanation:
      '橋的名字叫做「幫別人解決問題」。沒有這座橋,錢就走不過來。這是這一週最重要的一張圖。',
  },
  {
    id: 3,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'true_false',
    question: '是非題:資產只有錢和房子才算,技能和能力不算資產。',
    answer: false,
    explanation:
      '資產不是只有金融資產。你會摺紙、你很會整理、你講話讓人聽得懂,這些技能與能力也是資產,因為它們未來可以幫你賺到錢或省下時間。',
  },

  // ---------- 理解層(4 題,其中 1 題簡答) ----------
  {
    id: 4,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: '小T請你「把自己想成一間小店面」。那麼你的貨架上,擺的應該是什麼?',
    options: ['你會做的每一件事', '你想要買的東西', '你考試的分數', '你存了多少零用錢'],
    answer: '你會做的每一件事',
    explanation:
      '你會的每一件事,就是你這間小店面上架的資源。會摺紙、會畫畫、會教同學玩遊戲,全部都算。先看見貨架上有什麼,才知道可以拿什麼跟別人換。',
  },
  {
    id: 5,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question:
      '小華的爸爸每個月領一次薪水,這是他們家唯一的收入。關於「薪水」,下面哪一句最正確?',
    options: [
      '薪水也是幫忙換來的收入,只是其中一種形式',
      '薪水跟幫忙沒有關係,是公司規定要給的',
      '有薪水的人就不需要其他收入',
      '薪水是最好的收入,其他都比較差',
    ],
    answer: '薪水也是幫忙換來的收入,只是其中一種形式',
    explanation:
      '薪水一樣是走過那座橋來的。你每天到公司幫忙解決問題,公司固定把錢交給你。它是一種形式,除了它以外還有很多其他形式。',
  },
  {
    id: 6,
    block: '概念理解',
    bloom: 'understand',
    type: 'text',
    grading: 'teacher_light',
    minChars: 15,
    question:
      '大人版的「三圈交集」是三個圈圈疊在一起:①我會的 ②我擅長的 ③別人願意花錢解決的。請寫出你自己的一個交集:你會什麼、它幫誰解決了什麼?',
    placeholder: '例:我很會把難懂的遊戲規則講清楚,新同學不用一直被淘汰,可以直接跟我們一起玩。',
    explanation:
      '三個圈圈疊在一起的那一塊,就是最值得深耕的地方:你做起來有熱情、做起來相對容易,而且別人真的需要。你現在寫的這一句,就是你第一座橋的草圖。',
  },
  {
    id: 7,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: '下面哪一個能力,最接近小T說的「可轉移技能」(帶著走、換到哪裡都用得上)?',
    options: [
      '跟不同的人溝通',
      '背出這次段考的十個單字',
      '記得某個遊戲的破關密碼',
      '知道這學期的班級座位表',
    ],
    answer: '跟不同的人溝通',
    explanation:
      '溝通、協調、創造這些軟性能力是底層的,換一個科目、換一份工作、換一個國家都還在。知識很重要,而它需要透過軟性技能才發揮得出來。',
  },

  // ---------- 應用層(3 題,其中 1 題簡答) ----------
  {
    id: 8,
    block: '實際應用',
    bloom: 'apply',
    type: 'text',
    grading: 'teacher_light',
    minChars: 20,
    question:
      '小美很會把亂七八糟的書桌整理得很整齊。她說:「這又沒什麼,誰都會啊。」如果你是小T,你會回她哪一句話?請寫下來,並說明你為什麼這樣說。',
    placeholder:
      '例:我會問她「你覺得誰都會,可是有人為了這件事來拜託過你嗎?」因為有人來拜託,就表示這件事真的有人需要。',
    explanation:
      '有人來拜託你,就表示這件事有市場,只是你當時把它當成順手的幫忙。我們花太多時間看自己沒有的,卻很少坐下來盤點自己已經有的。這題老師會親自看你的回答。',
  },
  {
    id: 9,
    block: '實際應用',
    bloom: 'apply',
    type: 'multiple_choice',
    question: '小李很會做遊戲教學影片。他想知道這件事能不能變成收入,小T建議他先問自己哪三個問題?',
    options: [
      '我會什麼?這幫別人做了什麼?誰願意用錢跟我換?',
      '這要花多少錢?要多久?會不會累?',
      '別人做過了嗎?有多少人做?我做得贏嗎?',
      '爸媽會不會答應?老師會不會反對?同學會不會笑?',
    ],
    answer: '我會什麼?這幫別人做了什麼?誰願意用錢跟我換?',
    explanation:
      '這三個問題是這一週的拆解工具。先看見自己有什麼,再看見它幫別人解決什麼,最後才問誰願意交換。順序反過來就會卡住。',
  },
  {
    id: 10,
    block: '實際應用',
    bloom: 'apply',
    type: 'multiple_choice',
    question:
      '班上有 30 個人都會做一模一樣的手工卡片,而且都想賣。用「價值」來看,最可能發生什麼事?',
    options: [
      '因為大家都會,這項技能的價值會變低',
      '因為人很多,價格會變得更高',
      '價格完全不會受影響',
      '老師會決定每張卡片賣多少錢',
    ],
    answer: '因為大家都會,這項技能的價值會變低',
    explanation:
      '如果大家都會一樣的東西,這個技能就很難有價值。反過來說,你跟別人不一樣的地方,正是你能提供而別人提供不了的東西。沒有一個人跟你走過一樣的路,所以沒有一個人可以供給你所供給的。',
  },
];

const taskDescription = `這一週,我們來替你自己的小店面盤點貨架。

你已經知道了:錢要走到你的口袋,中間一定要有一座橋,橋的名字叫做「幫別人解決問題」。那你要先知道,你的貨架上有什麼。

請你盤點 3 件「你會做的事」。越日常的越好——摺紙、綁鞋帶、教弟弟玩遊戲、把房間整理好、記得所有人的生日,全部都算。寫下來、拍下來,然後回答下面四個問題。你會發現,你已經擁有的東西,比你以為的多很多。

【每一件事都回答這四題】
① 我會做的一件事是什麼?
　越日常越好。你覺得「這又沒什麼」的那些事,常常就是答案。
　例:我很會把散亂的桌面在五分鐘內整理好。
② 這件事可以幫別人解決什麼問題?
　想一個具體的人,他遇到什麼麻煩,而你剛好可以讓那個麻煩消失。
　例:同學找不到自己的講義,我可以幫他把資料夾分類好。
③ 過去一年,有沒有人為了這件事來拜託過你?
　選一個:有,而且不只一次/有,一次/還沒有,但我覺得會有/我要去問問看家人跟同學。
　有人拜託你,就表示這件事有市場,只是你當時把它當成順手的幫忙。
④ 誰最可能願意用零用錢或用別的東西跟你換這件事?
　寫出一個具體的對象,不要寫「大家」。
　例:低年級的學弟妹,還有每次都找不到東西的表哥。

🔍 從哪裡找:
🏠 家裡:你固定被交代做的那件事,通常是你做得比別人好的事
🎒 學校:同學遇到什麼問題會來找你
🎮 遊戲裡:你會的走法、你教過別人的技巧
✂️ 你的手作:摺紙、畫畫、拼裝、做卡片
💬 你的嘴巴:你會講故事、會逗人開心、會把難懂的事講清楚
📱 你的手機:你比家裡誰都會用的那些功能
🐶 你的照顧:餵寵物、照顧弟妹、澆花這種持續在做的事

格式:文字、照片、截圖、畫圖都可以。至少盤點 3 件事,四題都要回答。老師會親自回覆你。`;

export const L1S1_W3_BADGE_DATA = {
  rewardId: 'B-L1S1-W03',
  type: 'badge',
  name: '小店店長',
  nameEn: 'Little Shopkeeper',
  description:
    '完成「我的零用錢,我作主」第一季 W3 的 10 題概念練習 + 老師審核通過 → 解鎖。你學會了:收入是幫忙的回報、錢要走過一座叫「幫別人解決問題」的橋、技能和能力也是資產、可轉移技能換到哪裡都用得上。',
  weekLabel: 'W3',
  chapter: 'L1 我的零用錢,我作主 · 第一季',
  earnedFromWeek: 103,
  earnedVia: 'quiz-approval',
  image: '/images/L1W3_Badge_小店店長_LittleShopkeeper_L1S1.png',
};

export const L1S1_W3_CARD_DATA = {
  rewardId: 'C-L1S1-W03',
  type: 'card',
  name: '第一個客人',
  nameEn: 'The First Customer',
  cardNumber: 'L1S1-W03-001',
  rarity: 'Rare ★★',
  description:
    '完成 W3 貨架盤點任務 + 老師親自回覆 → 解鎖。「錢,會走向幫別人做事的人。」',
  weekLabel: 'W3',
  chapter: 'L1 我的零用錢,我作主 · 第一季',
  earnedFromWeek: 103,
  earnedVia: 'task-approval',
  image: '/images/L1W3_Card_第一個客人_L1S1.png',
};

export const L1S1_W3_WEEK_DATA = {
  weekNumber: 103,
  title: '我的零用錢,我作主 · W3',
  quarter: 1,
  chapter: 'L1S1',
  question: '你覺得「這又沒什麼」的那些事,會不會正好是別人需要的?',

  // 學習道路主題週的標記:
  themeId: 'l1-g1', // 對應 arenaStructure / unlockedThemes 的主題 id
  roadWeek: 3, // 道路上的第幾關(學生看到的 W3)

  hasQuiz: true,
  hasOpenQuestion: false, // 簡答題已內建在練習題裡(quizTextAnswers)
  hasTask: true,

  videoUrl: null,
  videoCaption: null,

  quizQuestions,

  openQuestion: null,
  openQuestionMinChars: 30,

  taskTitle: '小店店長 · 出任務',
  taskDescription,
  taskMinChars: 50,

  badgeId: L1S1_W3_BADGE_DATA.rewardId,
  cardId: L1S1_W3_CARD_DATA.rewardId,

  published: false, // 草稿 — 之後到 /admin/content/103 改成 true
};
