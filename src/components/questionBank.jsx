// Complete local question bank - no AI needed
const questionBank = {
  value_vs_price: {
    label: "價值 vs 價格",
    icon: "🧑‍🔬",
    character: "價值博士",
    characterB: "價格機器人",
    iconB: "🤖",
    color: "from-purple-500 to-indigo-500",
    questions: [
      {
        type: "multiple_choice",
        question: "哪一個代表「價格」？",
        options: ["商店標價 200 元", "很多人需要它", "使用起來非常方便"],
        answer: "商店標價 200 元",
        explanation: "價格是市場上標示的數字金額。"
      },
      {
        type: "multiple_choice",
        question: "哪一個比較接近「價值」？",
        options: ["這本書改變了我的想法", "這本書售價 350 元", "這本書在書店有賣"],
        answer: "這本書改變了我的想法",
        explanation: "價值是某件事對某個人的重要程度或意義。"
      },
      {
        type: "find_different",
        question: "以下哪一個和其他選項不同？",
        options: ["商店標價 500 元", "市場售價 300 元", "對我很重要", "網路賣 450 元"],
        answer: "對我很重要",
        explanation: "前三個都是價格（數字金額），「對我很重要」是價值的描述。"
      },
      {
        type: "drag_sort",
        question: "把下面的卡片分到正確的類別！",
        items: ["商店標價 200 元", "很多人需要", "市場價格 300 元", "使用起來很方便"],
        categories: ["價格", "價值"],
        correctMapping: {
          "商店標價 200 元": "價格",
          "很多人需要": "價值",
          "市場價格 300 元": "價格",
          "使用起來很方便": "價值"
        },
        explanation: "價格是用數字表示的金額；價值是東西帶來的好處或重要性。"
      },
      {
        type: "multiple_choice",
        question: "一杯水在沙漠中價值很高，但價格可能很低。這說明什麼？",
        options: ["價值和價格不一定相同", "價值等於價格", "價格決定價值"],
        answer: "價值和價格不一定相同",
        explanation: "同一件東西在不同情況下，價值可能很不同，但價格可能相同。"
      },
      {
        type: "multiple_choice",
        question: "「這個玩具標價 99 元」描述的是？",
        options: ["價格", "價值", "收入"],
        answer: "價格",
        explanation: "標價是一種價格的表現方式。"
      },
      {
        type: "find_different",
        question: "哪一個跟其他選項不一樣？",
        options: ["讓我學到很多", "幫助我解決問題", "售價 199 元", "對我的成長有幫助"],
        answer: "售價 199 元",
        explanation: "只有「售價 199 元」是價格，其他都是在描述價值。"
      },
      {
        type: "multiple_choice",
        question: "爸爸說：「這個東西雖然貴，但很值得。」他在比較什麼？",
        options: ["價格和價值", "收入和支出", "需要和喜歡"],
        answer: "價格和價值",
        explanation: "「貴」是價格高，「值得」是價值高，所以他在比較價格和價值。"
      },
      {
        type: "drag_sort",
        question: "幫這些描述分類到「價格」或「價值」！",
        items: ["讓我更健康", "一包 50 元", "幫我省時間", "折扣後 79 元"],
        categories: ["價格", "價值"],
        correctMapping: {
          "讓我更健康": "價值",
          "一包 50 元": "價格",
          "幫我省時間": "價值",
          "折扣後 79 元": "價格"
        },
        explanation: "數字金額是價格，帶來的好處是價值。"
      },
      {
        type: "multiple_choice",
        question: "同樣一瓶水，超市賣 20 元，演唱會賣 80 元。改變的是什麼？",
        options: ["價格", "水的味道", "水的價值"],
        answer: "價格",
        explanation: "同樣的水，在不同場合標示的金額不同，改變的是價格。"
      }
    ]
  },
  need_vs_like: {
    label: "需要 vs 喜歡",
    icon: "🧭",
    character: "需求探險家",
    characterB: "喜歡精靈",
    iconB: "🧚",
    color: "from-orange-500 to-amber-500",
    questions: [
      {
        type: "multiple_choice",
        question: "哪一個比較接近「需要」？",
        options: ["口渴時的一杯水", "新款遊戲主機", "最新款球鞋"],
        answer: "口渴時的一杯水",
        explanation: "需要通常與生存或基本生活功能有關。"
      },
      {
        type: "multiple_choice",
        question: "以下哪個是「喜歡」而不是「需要」？",
        options: ["最新款手機殼", "冬天時的保暖外套", "生病時的藥物"],
        answer: "最新款手機殼",
        explanation: "手機殼是裝飾品，屬於喜歡；外套和藥物與生存需求有關。"
      },
      {
        type: "find_different",
        question: "哪一個跟其他選項不同？",
        options: ["食物", "水", "最新玩具", "衣服"],
        answer: "最新玩具",
        explanation: "食物、水、衣服是基本需要，最新玩具是喜歡。"
      },
      {
        type: "drag_sort",
        question: "把卡片分到「需要」或「喜歡」！",
        items: ["午餐便當", "限量版公仔", "冬天的外套", "電動滑板車"],
        categories: ["需要", "喜歡"],
        correctMapping: {
          "午餐便當": "需要",
          "限量版公仔": "喜歡",
          "冬天的外套": "需要",
          "電動滑板車": "喜歡"
        },
        explanation: "便當和外套是基本生活所需，公仔和滑板車是喜歡的東西。"
      },
      {
        type: "multiple_choice",
        question: "「如果沒有它，生活會有困難」這是在描述？",
        options: ["需要", "喜歡", "價格"],
        answer: "需要",
        explanation: "需要是生活中不可或缺的東西。"
      },
      {
        type: "multiple_choice",
        question: "「擁有它會讓我開心，但沒有也沒關係」這是？",
        options: ["喜歡", "需要", "收入"],
        answer: "喜歡",
        explanation: "不是必須的，只是讓人開心的東西，就是喜歡。"
      },
      {
        type: "find_different",
        question: "哪一個不屬於「需要」？",
        options: ["乾淨的飲用水", "看醫生", "買遊戲點數", "穿暖和的衣服"],
        answer: "買遊戲點數",
        explanation: "遊戲點數是娛樂，不是基本生存需要。"
      },
      {
        type: "drag_sort",
        question: "分類這些東西！",
        items: ["每天喝水", "買最新球鞋", "看醫生吃藥", "收集卡牌"],
        categories: ["需要", "喜歡"],
        correctMapping: {
          "每天喝水": "需要",
          "買最新球鞋": "喜歡",
          "看醫生吃藥": "需要",
          "收集卡牌": "喜歡"
        },
        explanation: "喝水和看醫生是基本需要，球鞋和卡牌是喜歡。"
      },
      {
        type: "multiple_choice",
        question: "媽媽說：「你需要吃飯，不是需要買玩具。」她在區分什麼？",
        options: ["需要和喜歡", "價值和價格", "收入和支出"],
        answer: "需要和喜歡",
        explanation: "吃飯是需要，買玩具是喜歡。"
      },
      {
        type: "multiple_choice",
        question: "學校的課本是「需要」還是「喜歡」？",
        options: ["需要", "喜歡", "都不是"],
        answer: "需要",
        explanation: "課本是學習必備的工具，屬於需要。"
      }
    ]
  },
  exchange_money_income: {
    label: "交換 vs 金錢 vs 收入",
    icon: "🔄",
    character: "交換大師",
    characterB: "金幣精靈",
    iconB: "🪙",
    color: "from-green-500 to-emerald-500",
    questions: [
      {
        type: "multiple_choice",
        question: "用一顆蘋果換一根香蕉，這是什麼？",
        options: ["交換", "收入", "金錢"],
        answer: "交換",
        explanation: "用物品直接換物品就是交換（以物易物）。"
      },
      {
        type: "multiple_choice",
        question: "爸爸每月領到的薪水是什麼？",
        options: ["收入", "交換", "支出"],
        answer: "收入",
        explanation: "薪水是工作後獲得的金錢，屬於收入。"
      },
      {
        type: "find_different",
        question: "哪一個跟其他選項不同？",
        options: ["硬幣", "紙鈔", "以物易物", "電子支付"],
        answer: "以物易物",
        explanation: "硬幣、紙鈔、電子支付都是金錢的形式，以物易物是直接交換。"
      },
      {
        type: "drag_sort",
        question: "分類以下概念！",
        items: ["用玩具換文具", "每月薪水", "100 元紙鈔", "打工賺的錢"],
        categories: ["交換", "收入/金錢"],
        correctMapping: {
          "用玩具換文具": "交換",
          "每月薪水": "收入/金錢",
          "100 元紙鈔": "收入/金錢",
          "打工賺的錢": "收入/金錢"
        },
        explanation: "用物品直接換物品是交換，其餘涉及金錢或收入。"
      },
      {
        type: "multiple_choice",
        question: "金錢的主要功能是什麼？",
        options: ["方便交換和計算價值", "讓人變有錢", "代替工作"],
        answer: "方便交換和計算價值",
        explanation: "金錢讓交換更方便，也是衡量價值的工具。"
      },
      {
        type: "multiple_choice",
        question: "古代人沒有金錢時，他們怎麼獲得需要的東西？",
        options: ["用物品交換", "去商店買", "使用信用卡"],
        answer: "用物品交換",
        explanation: "在金錢發明之前，人們用以物易物的方式交換。"
      },
      {
        type: "find_different",
        question: "哪一個不是「收入」的例子？",
        options: ["薪水", "獎金", "買東西花的錢", "零用錢"],
        answer: "買東西花的錢",
        explanation: "買東西花的錢是支出，不是收入。"
      },
      {
        type: "multiple_choice",
        question: "小明用他的彈珠換小華的貼紙，這叫什麼？",
        options: ["交換", "購買", "收入"],
        answer: "交換",
        explanation: "不用金錢，直接用物品換物品就是交換。"
      },
      {
        type: "drag_sort",
        question: "這些是交換還是使用金錢？",
        items: ["用舊書換新書", "用 50 元買飲料", "用貼紙換彈珠", "刷卡買衣服"],
        categories: ["交換", "使用金錢"],
        correctMapping: {
          "用舊書換新書": "交換",
          "用 50 元買飲料": "使用金錢",
          "用貼紙換彈珠": "交換",
          "刷卡買衣服": "使用金錢"
        },
        explanation: "物品換物品是交換，使用錢幣或卡片付費是使用金錢。"
      },
      {
        type: "multiple_choice",
        question: "「收入」和「金錢」有什麼不同？",
        options: ["收入是金錢的來源，金錢是工具", "它們完全一樣", "金錢比收入重要"],
        answer: "收入是金錢的來源，金錢是工具",
        explanation: "收入是我們獲得金錢的方式，金錢本身是交換的工具。"
      }
    ]
  },
  spending_vs_consumption: {
    label: "支出 vs 消費",
    icon: "💳",
    character: "支出管家",
    characterB: "消費小精靈",
    iconB: "🛍️",
    color: "from-pink-500 to-rose-500",
    questions: [
      {
        type: "multiple_choice",
        question: "「花了 100 元買午餐」這是？",
        options: ["支出和消費都是", "只是支出", "只是消費"],
        answer: "支出和消費都是",
        explanation: "花錢是支出，吃掉午餐是消費，這個例子兩者都包含。"
      },
      {
        type: "multiple_choice",
        question: "付房租屬於？",
        options: ["支出", "消費", "收入"],
        answer: "支出",
        explanation: "付房租是花錢的行為，屬於支出。"
      },
      {
        type: "find_different",
        question: "哪一個跟其他選項不同？",
        options: ["付水電費", "付學費", "吃掉一碗麵", "繳保險費"],
        answer: "吃掉一碗麵",
        explanation: "吃麵是消費（使用掉），其他三個是付費（支出）行為。"
      },
      {
        type: "drag_sort",
        question: "分類以下行為！",
        items: ["付電話費", "喝掉一杯奶茶", "繳學費", "用掉一支筆"],
        categories: ["支出", "消費"],
        correctMapping: {
          "付電話費": "支出",
          "喝掉一杯奶茶": "消費",
          "繳學費": "支出",
          "用掉一支筆": "消費"
        },
        explanation: "花錢付費是支出，實際使用或用掉東西是消費。"
      },
      {
        type: "multiple_choice",
        question: "「消費」強調的是什麼？",
        options: ["使用或享用商品和服務", "花了多少錢", "賺了多少錢"],
        answer: "使用或享用商品和服務",
        explanation: "消費是指實際使用或享用的過程。"
      },
      {
        type: "multiple_choice",
        question: "「支出」強調的是什麼？",
        options: ["花掉的金錢", "使用的商品", "獲得的收入"],
        answer: "花掉的金錢",
        explanation: "支出關注的是金錢的流出。"
      },
      {
        type: "find_different",
        question: "哪一個是「消費」而不是「支出」？",
        options: ["使用免費 WiFi", "付停車費", "買電影票", "繳水費"],
        answer: "使用免費 WiFi",
        explanation: "使用免費WiFi是消費（享用服務）但不需要花錢（沒有支出）。"
      },
      {
        type: "multiple_choice",
        question: "去圖書館借書來看，這是？",
        options: ["消費但不是支出", "支出但不是消費", "既是支出也是消費"],
        answer: "消費但不是支出",
        explanation: "看書是消費（使用服務），但借書不用花錢，所以沒有支出。"
      },
      {
        type: "drag_sort",
        question: "這些行為屬於哪一類？",
        items: ["看免費影片", "花 200 元買書", "去公園玩", "付 500 元修車"],
        categories: ["消費（不花錢）", "支出（花錢）"],
        correctMapping: {
          "看免費影片": "消費（不花錢）",
          "花 200 元買書": "支出（花錢）",
          "去公園玩": "消費（不花錢）",
          "付 500 元修車": "支出（花錢）"
        },
        explanation: "有些消費不需要花錢，但支出一定涉及金錢。"
      },
      {
        type: "multiple_choice",
        question: "小明花 50 元買了冰淇淋並吃掉了。以下說法正確的是？",
        options: ["花 50 元是支出，吃冰淇淋是消費", "兩者都是支出", "兩者都是消費"],
        answer: "花 50 元是支出，吃冰淇淋是消費",
        explanation: "支出是花錢的動作，消費是使用/享用的動作。"
      }
    ]
  },
  budget_saving_bookkeeping: {
    label: "預算 vs 儲蓄 vs 記帳",
    icon: "📊",
    character: "預算規劃師",
    characterB: "存錢小豬",
    iconB: "🐷",
    color: "from-blue-500 to-cyan-500",
    questions: [
      {
        type: "multiple_choice",
        question: "「這個月最多花 500 元」這是在做什麼？",
        options: ["預算", "儲蓄", "記帳"],
        answer: "預算",
        explanation: "預算是事先規劃花錢的上限。"
      },
      {
        type: "multiple_choice",
        question: "「每月存下 200 元」這是？",
        options: ["儲蓄", "預算", "記帳"],
        answer: "儲蓄",
        explanation: "把錢存起來不花掉，就是儲蓄。"
      },
      {
        type: "multiple_choice",
        question: "「寫下今天花了 30 元買早餐」這是？",
        options: ["記帳", "預算", "儲蓄"],
        answer: "記帳",
        explanation: "記錄花費的金額和用途就是記帳。"
      },
      {
        type: "find_different",
        question: "哪一個跟其他選項不同？",
        options: ["規劃下月花費", "設定消費上限", "寫下今天的花費", "決定旅遊預算"],
        answer: "寫下今天的花費",
        explanation: "寫下花費是記帳，其他都是預算規劃。"
      },
      {
        type: "drag_sort",
        question: "把這些行為分類！",
        items: ["計畫下週花 300 元", "把零用錢存到撲滿", "記下買了什麼東西", "規劃暑假旅費"],
        categories: ["預算", "儲蓄", "記帳"],
        correctMapping: {
          "計畫下週花 300 元": "預算",
          "把零用錢存到撲滿": "儲蓄",
          "記下買了什麼東西": "記帳",
          "規劃暑假旅費": "預算"
        },
        explanation: "預算是計畫，儲蓄是存錢，記帳是記錄花費。"
      },
      {
        type: "multiple_choice",
        question: "哪個順序最合理？",
        options: ["先預算、再記帳、再儲蓄", "先儲蓄、再預算、再記帳", "先記帳、再儲蓄、再預算"],
        answer: "先預算、再記帳、再儲蓄",
        explanation: "先計畫（預算），然後記錄（記帳），最後存下剩餘（儲蓄）。"
      },
      {
        type: "find_different",
        question: "哪一個不是「儲蓄」？",
        options: ["把錢放到銀行", "存零用錢到撲滿", "記錄這個月花了多少", "每月固定存 100 元"],
        answer: "記錄這個月花了多少",
        explanation: "記錄花費是記帳，不是儲蓄。"
      },
      {
        type: "multiple_choice",
        question: "小美每天在筆記本上寫：「早餐 35 元、文具 20 元」。她在做什麼？",
        options: ["記帳", "預算", "儲蓄"],
        answer: "記帳",
        explanation: "記錄每天的實際花費就是記帳。"
      },
      {
        type: "drag_sort",
        question: "把這些分到正確的類別！",
        items: ["用 App 記錄花費", "設定每月存 500 元", "決定午餐預算 80 元", "把紅包錢存起來"],
        categories: ["記帳", "儲蓄", "預算"],
        correctMapping: {
          "用 App 記錄花費": "記帳",
          "設定每月存 500 元": "儲蓄",
          "決定午餐預算 80 元": "預算",
          "把紅包錢存起來": "儲蓄"
        },
        explanation: "記錄是記帳，存錢是儲蓄，計畫花費是預算。"
      },
      {
        type: "multiple_choice",
        question: "預算、儲蓄、記帳三者的關係是？",
        options: ["它們互相配合，幫助管理金錢", "它們完全無關", "只需要做其中一個就好"],
        answer: "它們互相配合，幫助管理金錢",
        explanation: "預算幫你計畫、記帳幫你追蹤、儲蓄幫你累積。三者配合最好。"
      }
    ]
  },
  asset_vs_consumable: {
    label: "資產 vs 消耗品",
    icon: "🏠",
    character: "資產守護者",
    characterB: "消耗品小怪",
    iconB: "📦",
    color: "from-teal-500 to-green-500",
    questions: [
      {
        type: "multiple_choice",
        question: "以下哪個是「資產」？",
        options: ["一棟房子", "一包衛生紙", "一碗泡麵"],
        answer: "一棟房子",
        explanation: "資產是有長期價值、可以保值或增值的東西。"
      },
      {
        type: "multiple_choice",
        question: "以下哪個是「消耗品」？",
        options: ["一盒鉛筆", "一台電腦", "銀行存款"],
        answer: "一盒鉛筆",
        explanation: "鉛筆用完就沒有了，是消耗品。"
      },
      {
        type: "find_different",
        question: "哪一個跟其他選項不同？",
        options: ["房子", "股票", "洗髮精", "黃金"],
        answer: "洗髮精",
        explanation: "洗髮精是消耗品，其他都是可保值的資產。"
      },
      {
        type: "drag_sort",
        question: "分類這些東西！",
        items: ["一棟公寓", "一瓶牛奶", "一塊土地", "一袋零食"],
        categories: ["資產", "消耗品"],
        correctMapping: {
          "一棟公寓": "資產",
          "一瓶牛奶": "消耗品",
          "一塊土地": "資產",
          "一袋零食": "消耗品"
        },
        explanation: "公寓和土地是長期有價值的資產，牛奶和零食是消耗品。"
      },
      {
        type: "multiple_choice",
        question: "「資產」的特點是什麼？",
        options: ["可以保值或增值", "用完就沒了", "價格很便宜"],
        answer: "可以保值或增值",
        explanation: "資產通常能保持或增加價值。"
      },
      {
        type: "multiple_choice",
        question: "「消耗品」的特點是什麼？",
        options: ["使用後會減少或消失", "價值會增加", "永遠不會壞"],
        answer: "使用後會減少或消失",
        explanation: "消耗品用完就沒有了，不能持續保值。"
      },
      {
        type: "find_different",
        question: "哪一個是「資產」而非「消耗品」？",
        options: ["橡皮擦", "衛生紙", "銀行存款", "早餐三明治"],
        answer: "銀行存款",
        explanation: "銀行存款是資產，其他都是用完就沒了的消耗品。"
      },
      {
        type: "multiple_choice",
        question: "一台好的腳踏車算什麼？",
        options: ["資產", "消耗品", "支出"],
        answer: "資產",
        explanation: "腳踏車可以使用很久且有轉賣價值，屬於資產。"
      },
      {
        type: "drag_sort",
        question: "這些東西是資產還是消耗品？",
        items: ["名牌手錶", "一包口香糖", "珠寶首飾", "原子筆"],
        categories: ["資產", "消耗品"],
        correctMapping: {
          "名牌手錶": "資產",
          "一包口香糖": "消耗品",
          "珠寶首飾": "資產",
          "原子筆": "消耗品"
        },
        explanation: "名牌手錶和珠寶可以保值，口香糖和原子筆用完就沒了。"
      },
      {
        type: "multiple_choice",
        question: "為什麼區分「資產」和「消耗品」很重要？",
        options: ["幫助我們更聰明地使用金錢", "沒有什麼用", "只有大人需要知道"],
        answer: "幫助我們更聰明地使用金錢",
        explanation: "了解哪些是資產、哪些是消耗品，能幫助我們做更好的消費決定。"
      }
    ]
  },
  loan_interest_credit: {
    label: "借貸 vs 利息 vs 信用",
    icon: "🏦",
    character: "借貸銀行家",
    characterB: "信用天使",
    iconB: "👼",
    color: "from-violet-500 to-purple-500",
    questions: [
      {
        type: "multiple_choice",
        question: "「跟銀行借 1000 元」這是什麼行為？",
        options: ["借貸", "利息", "信用"],
        answer: "借貸",
        explanation: "向別人借錢就是借貸。"
      },
      {
        type: "multiple_choice",
        question: "「借了 1000 元要還 1050 元」，多出來的 50 元是？",
        options: ["利息", "信用", "借貸"],
        answer: "利息",
        explanation: "利息是借錢後需要額外支付的費用。"
      },
      {
        type: "multiple_choice",
        question: "「這個人很守信用，大家都願意借他錢」——「信用」是什麼意思？",
        options: ["別人對你守約能力的信任", "你借了多少錢", "你賺了多少錢"],
        answer: "別人對你守約能力的信任",
        explanation: "信用是別人對你是否能按時還錢的信任程度。"
      },
      {
        type: "find_different",
        question: "哪一個跟其他不同？",
        options: ["向朋友借 100 元", "跟銀行貸款", "每次都準時還錢", "跟爸媽借零用錢"],
        answer: "每次都準時還錢",
        explanation: "準時還錢是建立「信用」，其他都是「借貸」行為。"
      },
      {
        type: "drag_sort",
        question: "把這些概念分類！",
        items: ["跟同學借橡皮擦", "多還的 20 元", "大家覺得你很可靠", "向銀行借錢買房"],
        categories: ["借貸", "利息", "信用"],
        correctMapping: {
          "跟同學借橡皮擦": "借貸",
          "多還的 20 元": "利息",
          "大家覺得你很可靠": "信用",
          "向銀行借錢買房": "借貸"
        },
        explanation: "借東西是借貸，多還的錢是利息，被信任是信用。"
      },
      {
        type: "multiple_choice",
        question: "為什麼銀行要收利息？",
        options: ["因為借出去的錢有風險，利息是補償", "銀行想賺更多錢而已", "這是法律規定的"],
        answer: "因為借出去的錢有風險，利息是補償",
        explanation: "銀行把錢借給別人有可能收不回來，利息是對這個風險的補償。"
      },
      {
        type: "find_different",
        question: "哪一個不是「建立信用」的方法？",
        options: ["準時還錢", "遵守約定", "欠錢不還", "誠實面對"],
        answer: "欠錢不還",
        explanation: "欠錢不還會破壞信用，不是建立信用。"
      },
      {
        type: "multiple_choice",
        question: "小華借了 500 元，一年後要還 525 元。利率是多少？",
        options: ["5%", "25%", "50%"],
        answer: "5%",
        explanation: "多還 25 元，25÷500=5%，所以利率是 5%。"
      },
      {
        type: "drag_sort",
        question: "分類這些敘述！",
        items: ["銀行借你 10 萬元", "一年後多還 3000 元", "你總是按時繳費", "向朋友借課本"],
        categories: ["借貸", "利息", "信用"],
        correctMapping: {
          "銀行借你 10 萬元": "借貸",
          "一年後多還 3000 元": "利息",
          "你總是按時繳費": "信用",
          "向朋友借課本": "借貸"
        },
        explanation: "借東西/錢是借貸，多付的錢是利息，被信任是信用。"
      },
      {
        type: "multiple_choice",
        question: "信用好的人借錢，利息通常會？",
        options: ["比較低", "比較高", "完全不用付"],
        answer: "比較低",
        explanation: "信用好代表風險低，銀行會收較低的利息。"
      }
    ]
  },
  insurance_saving_investment: {
    label: "保險 vs 儲蓄 vs 投資",
    icon: "🛡️",
    character: "保險騎士",
    characterB: "投資冒險家",
    iconB: "🚀",
    color: "from-amber-500 to-yellow-500",
    questions: [
      {
        type: "multiple_choice",
        question: "「每月繳錢，生病時可以用」這是什麼？",
        options: ["保險", "儲蓄", "投資"],
        answer: "保險",
        explanation: "定期繳費、出事時獲得保障就是保險。"
      },
      {
        type: "multiple_choice",
        question: "「把零用錢存在撲滿裡」這是？",
        options: ["儲蓄", "保險", "投資"],
        answer: "儲蓄",
        explanation: "把錢存起來不使用就是儲蓄。"
      },
      {
        type: "multiple_choice",
        question: "「買了一家公司的股票」這是？",
        options: ["投資", "保險", "儲蓄"],
        answer: "投資",
        explanation: "買股票是希望獲得回報的行為，屬於投資。"
      },
      {
        type: "find_different",
        question: "哪一個跟其他不同？",
        options: ["健保", "車險", "買股票", "意外險"],
        answer: "買股票",
        explanation: "健保、車險、意外險都是保險，買股票是投資。"
      },
      {
        type: "drag_sort",
        question: "把這些行為分類！",
        items: ["每月繳健保費", "存錢到銀行", "買基金", "保了意外險"],
        categories: ["保險", "儲蓄", "投資"],
        correctMapping: {
          "每月繳健保費": "保險",
          "存錢到銀行": "儲蓄",
          "買基金": "投資",
          "保了意外險": "保險"
        },
        explanation: "繳保費是保險，存錢是儲蓄，買基金是投資。"
      },
      {
        type: "multiple_choice",
        question: "投資和儲蓄最大的不同是？",
        options: ["投資有風險，儲蓄比較安全", "它們完全一樣", "儲蓄比投資賺更多"],
        answer: "投資有風險，儲蓄比較安全",
        explanation: "投資可能賺錢也可能賠錢，儲蓄雖然回報少但比較安全。"
      },
      {
        type: "find_different",
        question: "哪一個不是「儲蓄」？",
        options: ["存到銀行帳戶", "放在撲滿", "買公司股票", "存在活期存款"],
        answer: "買公司股票",
        explanation: "買股票是投資，其他都是儲蓄。"
      },
      {
        type: "multiple_choice",
        question: "保險的主要目的是什麼？",
        options: ["保護自己不受意外財務損失", "賺更多的錢", "把錢存起來"],
        answer: "保護自己不受意外財務損失",
        explanation: "保險的核心是提供保障，減少意外帶來的財務負擔。"
      },
      {
        type: "drag_sort",
        question: "這些屬於哪一類？",
        items: ["定期存款", "買房出租", "火災保險", "每月存 100 元"],
        categories: ["儲蓄", "投資", "保險"],
        correctMapping: {
          "定期存款": "儲蓄",
          "買房出租": "投資",
          "火災保險": "保險",
          "每月存 100 元": "儲蓄"
        },
        explanation: "存錢是儲蓄，買房出租希望獲利是投資，火災保險是保險。"
      },
      {
        type: "multiple_choice",
        question: "一個好的理財計畫應該包含？",
        options: ["保險、儲蓄和投資都有", "只要投資就好", "只需要儲蓄"],
        answer: "保險、儲蓄和投資都有",
        explanation: "三者各有功能：保險保護、儲蓄安全存錢、投資讓錢成長。"
      }
    ]
  }
};

export const conceptGroups = Object.keys(questionBank).map(key => ({
  key,
  ...questionBank[key],
  questionCount: questionBank[key].questions.length
}));

export const getQuestionsByGroup = (groupKey) => {
  return questionBank[groupKey]?.questions || [];
};

export const getRandomQuestions = (count = 5) => {
  const allQuestions = [];
  Object.entries(questionBank).forEach(([groupKey, group]) => {
    group.questions.forEach(q => {
      allQuestions.push({ ...q, groupKey, groupLabel: group.label });
    });
  });
  const shuffled = allQuestions.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getDailyGroup = () => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const keys = Object.keys(questionBank);
  const index = dayOfYear % keys.length;
  const key = keys[index];
  return { key, ...questionBank[key] };
};

export default questionBank;