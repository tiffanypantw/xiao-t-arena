/**
 * L2S1-W3 content — generated 2026-08-30 from Tiffany's「L2W3_QUESTIONS.js」上架包
 *
 * 課程:L2 主題課 12-15｜商業與市場(第一季)
 * 主題:市場氣象員(供給與需求)
 *   ⚠️ 上架包原本叫「價格解碼員／解碼員之印」,但徽章與卡片圖檔做出來是
 *      「市場氣象員 Market Forecaster」「看不見的手 The Invisible Hand」,
 *      依慣例以圖檔為準,名稱已改。解碼、密碼的比喻仍留在題目解釋與任務裡。
 *
 * 上架設定(沿用 L2S1 W1/W2 的 recipe):
 *  - 學習道路主題「商業與市場」(themeId: l2-s1)的第 3 關,weekNumber = 203(道路週 = 200 + n)
 *  - 題型:10 題全選擇/是非 + 開放題 1 題(評鑑層,走老師後台審核 → 徽章)
 *    L2 這條路沿用 W1/W2 的做法:文字互動放在「開放題」,不放在練習題裡
 *  - 上架包的 answer 是選項「索引」(0),播放器用的是選項「全文」,已轉換
 *  - Q5 依 L1 W3 的同一個決定:內容照原樣,拿掉「【回顧】」標籤
 *  - rewardId 用 'B-L2Q1-W03' / 'C-L2Q1-W03'(照 L2 這條路的 L2Q1 前綴)
 *    上架包裡的 B-XX-YYYY / C-XX-YYYY 是兌換碼欄位的佔位,不是 rewardId
 *  - published: false(草稿,要從 /admin/content/203 手動發佈)
 */

const quizQuestions = [
  // ---------- 記憶層(3 題) ----------
  {
    id: 1,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'multiple_choice',
    question: '「供給」指的是什麼?',
    options: ['市場上可以拿出來賣的數量', '想要買的人有多少', '一件東西的成本', '政府規定的價格'],
    answer: '市場上可以拿出來賣的數量',
    explanation:
      '供給是「有多少貨可以賣」,需求是「有多少人想買」。這兩個字要一起看,價格才解釋得通。',
  },
  {
    id: 2,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'true_false',
    question: '是非題:當想要買的人變多,而東西的數量沒有增加,價格通常會上升。',
    answer: true,
    explanation:
      '需求壓過供給,價格就會被推上去。演唱會的座位是固定的,想去的人卻很多,票價才會在轉賣網站被喊高。',
  },
  {
    id: 3,
    block: '基礎記憶',
    bloom: 'remember',
    type: 'multiple_choice',
    question: '主課裡那張演唱會門票,票面價 3,800 元,隔天在轉賣網站上被喊到多少?',
    options: ['12,000 元', '4,500 元', '7,600 元', '38,000 元'],
    answer: '12,000 元',
    explanation:
      '3,800 到 12,000。重點不在這個數字本身,而在於:如果它真的賣掉了,就表示有人賺到了這筆錢,因為他先看見了那個需求。',
  },

  // ---------- 理解層(4 題) ----------
  {
    id: 4,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: '颱風過後,菜田受損,高麗菜一顆從 60 元變成 150 元。這是哪一邊出了事?',
    options: ['供給變少了', '需求變多了', '供給和需求都沒變', '菜農決定調漲價格'],
    answer: '供給變少了',
    explanation:
      '颱風前一天是「需求」衝高,人人多買兩把青菜;颱風過後是「供給」出事,菜田受損。同一顆高麗菜,一週之內兩種原因,價格都會動。',
  },
  {
    id: 5,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question:
      '同一張演唱會門票,小明願意付 12,000 元,小華覺得 3,800 都太貴。用「價值」來看,這說明了什麼?',
    options: [
      '同一樣東西,對不同的人價值不一樣',
      '小華比較聰明,小明被騙了',
      '票的價值是固定的,他們其中一個算錯了',
      '價值由賣票的公司決定,跟他們無關',
    ],
    answer: '同一樣東西,對不同的人價值不一樣',
    explanation:
      '價值是「這樣東西對某個人有多重要」,所以它因人而異。需求之所以存在,正是因為有人覺得它值。',
  },
  {
    id: 6,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: '小美說:「暑假的機票比平常貴一倍,航空公司太貪心了。」小T會建議她先問哪一句?',
    options: [
      '「你猜是座位變少了,還是想飛的人變多了?」',
      '「那就不要出國了。」',
      '「所有航空公司都一樣啦。」',
      '「等長大再說。」',
    ],
    answer: '「你猜是座位變少了,還是想飛的人變多了?」',
    explanation:
      '飛機的座位數是固定的,而想飛的人在同一個時間全部湧進來。把「太貴了」換成一個問句,腦袋才會繼續打開。',
  },
  {
    id: 7,
    block: '概念理解',
    bloom: 'understand',
    type: 'multiple_choice',
    question: '很多人願意花更高的錢跟黃牛買票。除了「限量」之外,他們還買到了什麼?',
    options: ['省下自己搶票的時間', '比較好的座位保證', '演唱會的紀念品', '退票的權利'],
    answer: '省下自己搶票的時間',
    explanation:
      '有人幫我搶,我就不用在上班或上課的時候緊張地守在電腦前。省時間本身就是一種被交換的價值。',
  },

  // ---------- 應用層(3 題) ----------
  {
    id: 8,
    block: '實際應用',
    bloom: 'apply',
    type: 'multiple_choice',
    question: '如果班上 30 個人都會做一模一樣的手工卡片,而且都想賣,價格最可能怎麼樣?',
    options: ['因為供給太多,價格會被壓低', '因為人多,價格會變高', '價格完全不受影響', '老師會決定價格'],
    answer: '因為供給太多,價格會被壓低',
    explanation:
      '供給過多,大家都會,價格就撐不住。反過來說,你跟別人不一樣的地方,才是別人替代不了的供給。',
  },
  {
    id: 9,
    block: '實際應用',
    bloom: 'apply',
    type: 'multiple_choice',
    question:
      '捷運站旁邊的房子,貼出來三天就被租走,房東每年都調漲租金。用供給需求來解釋,最合理的是哪一個?',
    options: [
      '好地段的房子數量固定,想住的人卻一直增加',
      '房東們私下約好一起漲價',
      '捷運公司規定房租要漲',
      '因為房子越蓋越舊,所以越貴',
    ],
    answer: '好地段的房子數量固定,想住的人卻一直增加',
    explanation:
      '地段是沒辦法複製的,供給被鎖死,而需求持續進來。這就是為什麼位置好的東西通常越來越貴。',
  },
  {
    id: 10,
    block: '實際應用',
    bloom: 'apply',
    type: 'multiple_choice',
    question: '小李看到一款球鞋在官網秒殺,二手價漲到三倍。小T希望他問自己的下一個問題是什麼?',
    options: [
      '「那個賺到差價的人,他先看見了什麼?」',
      '「為什麼世界這麼不公平?」',
      '「我要罵誰?」',
      '「反正買不到,不看了。」',
    ],
    answer: '「那個賺到差價的人,他先看見了什麼?」',
    explanation:
      '從消費者的位置看,你會覺得貴。換到創造價值的位置看,你會問:他看見了什麼需求,我能不能也看見?這一步的角色轉換,是這週真正的重點。',
  },
];

const openQuestion =
  '小安說:「颱風過後高麗菜漲一倍,那些漲價的菜販就是趁人之危。」你同意嗎?寫下你的判斷,加上至少兩個理由。提示:想想「供給真的變少了」和「趁機哄抬」是不是同一件事;可以用高麗菜、演唱會票、或你自己看到的例子來說理。';

const taskDescription = `這一週,你要當一個看得懂價格的人。價格會說話,只是它講的是密碼。

請你找出 3 個「價格變了」的案例。可以是變貴,也可以是變便宜——你家附近的菜、你想買的鞋、爸媽在看的機票、遊戲裡的虛擬商品,都算。

每一個案例,你要做的事只有一件:判斷這是「供給」那一邊出事,還是「需求」那一邊出事。然後再多想一步:那個因為這個價格而賺到錢的人,他先看見了什麼?

【每個案例都回答這四題】
① 你發現什麼東西的價格變了?變成多少?
　拍下來最好。標價、菜單、螢幕截圖都可以。
　例:巷口的高麗菜,上週 60 元,這週 150 元。
② 你猜是貨變少了,還是想要的人變多了?為什麼?
　沒有標準答案,說出你的推理過程就算完成。
　例:我猜是貨變少了,因為上週有颱風,新聞說菜田淹水。
③ 這個價格底下,誰賺到了錢?他先看見了什麼?
　試著站到賣東西的那一邊去想,而不是只站在買的那一邊。
　例:有存貨的菜販賺到了,他先看見大家颱風後一定要買菜。
④ 如果你是賣這個東西的人,你會怎麼做?
　選一個最接近你想法的,沒有對錯:跟著漲價,因為大家都願意買/維持原價,讓客人以後還想再來/先漲一點,但限制每個人買的數量/我還想不到,想再多看幾個案例。

🔍 從哪裡找:
🛒 超市或菜市場:同一樣東西這週跟上週的標價
📱 網路商城:雙 11、限時特賣、秒殺頁面
👟 二手轉賣平台:球鞋、公仔、演唱會票
✈️ 訂票網站:同一個航班,平日跟連假的價差
🎴 卡牌或遊戲:限定卡、絕版商品、遊戲內道具
🍵 你家巷口:飲料店、早餐店最近有沒有調價
💬 大人的對話:爸媽最近抱怨什麼變貴了

格式:文字、照片、截圖、畫圖都可以。至少 3 個案例,四題都要回答。老師會親自回覆你。`;

export const L2S1_W3_BADGE_DATA = {
  rewardId: 'B-L2Q1-W03',
  type: 'badge',
  name: '市場氣象員',
  nameEn: 'Market Forecaster',
  description:
    '完成「商業與市場」第一季 W3 的 10 題概念練習 + 開放題通過老師審核 → 解鎖。你學會了把「太貴了」換成一個問句:是貨變少了,還是想要的人變多了?',
  weekLabel: 'W3',
  chapter: 'L2 商業與市場 · 第一季',
  earnedFromWeek: 203,
  earnedVia: 'quiz-approval',
  image: '/images/L2W3_Badge_市場氣象員_MarketForecaster_L2S1.png',
};

export const L2S1_W3_CARD_DATA = {
  rewardId: 'C-L2Q1-W03',
  type: 'card',
  name: '看不見的手',
  nameEn: 'The Invisible Hand',
  cardNumber: 'L2Q1-W03-001',
  rarity: 'Rare ★★',
  description:
    '完成 W3 價格解碼任務 + 老師親自回覆 → 解鎖。「沒有人下命令,價格自己會找到位置。」',
  weekLabel: 'W3',
  chapter: 'L2 商業與市場 · 第一季',
  earnedFromWeek: 203,
  earnedVia: 'task-approval',
  image: '/images/L2W3_Card_看不見的手_InvisibleHand_L2S1.png',
};

export const L2S1_W3_WEEK_DATA = {
  weekNumber: 203,
  title: '商業與市場 · W3',
  quarter: 1,
  chapter: 'L2S1',
  question: '東西變貴的時候,是貨變少了,還是想要的人變多了?',

  // 學習道路主題週的標記:
  themeId: 'l2-s1', // 對應 arenaStructure / unlockedThemes 的主題 id
  roadWeek: 3, // 道路上的第幾關(學生看到的 W3)

  hasQuiz: true,
  hasOpenQuestion: true, // 評鑑層開放題,老師後台審核通過 → 徽章
  hasTask: true,

  videoUrl: null,
  videoCaption: null,

  quizQuestions,

  openQuestion,
  openQuestionMinChars: 50,

  taskTitle: '市場氣象員 · 價格解碼表',
  taskDescription,
  taskMinChars: 50,

  badgeId: L2S1_W3_BADGE_DATA.rewardId,
  cardId: L2S1_W3_CARD_DATA.rewardId,

  published: false, // 草稿 — 之後到 /admin/content/203 改成 true
};
