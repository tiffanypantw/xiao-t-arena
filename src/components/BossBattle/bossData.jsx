export const BOSS_XP = 50;

export const BOSS_DATA = {
  need_vs_like: {
    bossName: '混淆怪「我都想要」', emoji: '👹', badge: 'Need vs Like 征服者', badgeEmoji: '🧭',
    questions: [
      { type:'multiple_choice', question:'小明的鞋子還能穿，但他看到限量款很想買。限量款對他來說是？', options:['需要','喜歡'], answer:'喜歡', explanation:'現有鞋子還能使用，購買限量款是個人喜好，而非生活必需。' },
      { type:'multi_concept_classify', question:'以下哪個情境描述的是「需要」？', options:['小美看到新款耳機很想買','小明的舊課本壞掉，明天要上課用','小華想要最新款手機殼','爸爸想換一台新電視'], answer:'小明的舊課本壞掉，明天要上課用', explanation:'因功能喪失而必須購買的才是「需要」。' },
      { type:'multiple_choice', question:'你只剩 50 元，哪件事最接近「需要」優先？', options:['買一包零食','補充用完的鉛筆（明天要考試）'], answer:'補充用完的鉛筆（明天要考試）', explanation:'考試前用完的文具是急需，零食是可延後的喜歡。' },
      { type:'multi_concept_classify', question:'「需要」和「喜歡」最根本的差別是什麼？', options:['需要比喜歡貴','需要是生活必須，喜歡是個人偏好','需要是大人才有的','需要一定要馬上買'], answer:'需要是生活必須，喜歡是個人偏好', explanation:'需要是維持生活基本運作所必須的；喜歡是個人希望擁有但不影響生活的。' },
      { type:'multiple_choice', question:'小玲說：「我不買這個，生活不會有影響。」這個東西對她是？', options:['需要','喜歡'], answer:'喜歡', explanation:'不買也不影響生活，表示它不是「需要」，而是「喜歡」。' }
    ]
  },
  value_vs_price: {
    bossName: '混淆怪「價格迷霧」', emoji: '🌫️', badge: 'Value vs Price 征服者', badgeEmoji: '🧑‍🔬',
    questions: [
      { type:'multi_concept_classify', question:'以下哪一句最接近「價值」的描述？', options:['這個商品標價 500 元','這個商品雖然貴，但很耐用實用','這個商品正在打折中','這個商品的售價比其他店貴'], answer:'這個商品雖然貴，但很耐用實用', explanation:'價值是商品帶來的好處和功能，與標價無關。' },
      { type:'multiple_choice', question:'同一商品在不同商店賣不同價格。改變的是什麼？', options:['價值','價格'], answer:'價格', explanation:'商品功能沒有改變，只有標示的金額（價格）不同。' },
      { type:'multi_concept_classify', question:'奶奶的舊戒指市場只賣 100 元，但對小明無價。這說明什麼？', options:['市場定價不準確','個人價值可以與市場價格完全不同','舊東西都比新東西有價值','小明不懂行情'], answer:'個人價值可以與市場價格完全不同', explanation:'市場定的是「價格」，個人感受和意義是「價值」，兩者可差異很大。' },
      { type:'multiple_choice', question:'爸爸說：「這課程雖然貴，但學到的東西讓我升職了。」他認為課程的什麼很高？', options:['價格','價值'], answer:'價值', explanation:'讓人升職是課程帶來的好處，這是「價值」的體現。' },
      { type:'multi_concept_classify', question:'打折後，衣服從 800 元降到 400 元。以下哪句是正確的？', options:['衣服價值變成一半','衣服的價格變成一半，但價值沒有改變','打折讓衣服更有價值','價格和價值都變一半'], answer:'衣服的價格變成一半，但價值沒有改變', explanation:'打折只改變了標示金額（價格），衣服的功能和品質（價值）沒有改變。' }
    ]
  },
  exchange_vs_money: {
    bossName: '混淆怪「以物換物」', emoji: '🔀', badge: 'Exchange Master 征服者', badgeEmoji: '🔄',
    questions: [
      { type:'multiple_choice', question:'古代人以物易物，最大的問題是什麼？', options:['物品太重搬不動','雙方剛好都需要對方的東西才能成立'], answer:'雙方剛好都需要對方的東西才能成立', explanation:'以物易物需要「雙重巧合」，這是它最大的缺點。' },
      { type:'multi_concept_classify', question:'以下哪個行為不屬於「使用金錢」？', options:['用信用卡買東西','掃 QR code 付款','用兩張貼紙換朋友的橡皮擦','用 Line Pay 付帳'], answer:'用兩張貼紙換朋友的橡皮擦', explanation:'貼紙換橡皮擦是直接以物換物，沒有金錢介入。' },
      { type:'multiple_choice', question:'金錢最主要的功能是什麼？', options:['讓有錢的人更有影響力','作為統一的交換媒介，讓交易更方便'], answer:'作為統一的交換媒介，讓交易更方便', explanation:'金錢解決了以物易物的雙重巧合問題，讓各種價值都能被量化和交換。' },
      { type:'multi_concept_classify', question:'小明幫鄰居澆花，鄰居給他幾顆蘋果，這是什麼行為？', options:['使用金錢購買','交換（服務換物品）','贈與（免費給予）','借貸'], answer:'交換（服務換物品）', explanation:'用勞動服務換取物品，這是廣義的「交換」，沒有使用金錢。' },
      { type:'multiple_choice', question:'銀行存款和手上現金，本質上都是什麼？', options:['交換的物品','金錢的不同形式'], answer:'金錢的不同形式', explanation:'無論是存款或現金，都是「金錢」的不同存在方式，功能相同。' }
    ]
  },
  spending_vs_consumption: {
    bossName: '混淆怪「花了沒？」', emoji: '💸', badge: 'Spending Master 征服者', badgeEmoji: '💳',
    questions: [
      { type:'multi_concept_classify', question:'花了 100 元買一本書，但還沒看。目前發生了什麼？', options:['只有消費，沒有支出','只有支出，沒有消費','支出和消費都已發生','什麼都還沒發生'], answer:'只有支出，沒有消費', explanation:'付了錢（支出）但還沒有閱讀（消費），所以只有支出發生。' },
      { type:'multiple_choice', question:'去圖書館借書並看完。這個行為是？', options:['既有支出也有消費','有消費但無支出'], answer:'有消費但無支出', explanation:'看書是消費（使用服務），但借書是免費的，所以沒有支出。' },
      { type:'multi_concept_classify', question:'以下哪個是「有支出但沒有真正消費」？', options:['花 200 元買課程，認真學完','花 200 元買遊戲，但遊戲壞了沒辦法玩','免費使用公園設施','吃了一個免費試吃的蛋糕'], answer:'花 200 元買遊戲，但遊戲壞了沒辦法玩', explanation:'付了錢（支出）但無法享用商品（消費），是有支出但沒有消費的例子。' },
      { type:'multiple_choice', question:'「消費」的核心是什麼？', options:['一定要花錢','實際使用或享用商品與服務'], answer:'實際使用或享用商品與服務', explanation:'消費強調的是「使用」行為，不一定需要付錢，例如免費服務也算消費。' },
      { type:'multi_concept_classify', question:'每天上學坐公車，這個行為中「消費」指的是？', options:['買公車票付的錢','實際乘坐公車的過程','決定坐公車的決定','等公車的時間'], answer:'實際乘坐公車的過程', explanation:'「消費」是使用交通服務的過程，付票價的動作才是「支出」。' }
    ]
  },
  budget_vs_saving_vs_record: {
    bossName: '混淆怪「錢去哪了」', emoji: '📒', badge: 'Budget Master 征服者', badgeEmoji: '📊',
    questions: [
      { type:'multi_concept_classify', question:'小明月初說：「這個月零用錢，吃飯最多 400 元、娛樂最多 100 元。」他在做什麼？', options:['記帳','預算','儲蓄','以上皆是'], answer:'預算', explanation:'事先設定各類花費上限就是「預算」。' },
      { type:'multiple_choice', question:'預算、儲蓄、記帳三者中，哪個是「事後」行為？', options:['預算','記帳'], answer:'記帳', explanation:'記帳是消費後記錄花費，屬於事後追蹤；預算是事前計畫。' },
      { type:'multi_concept_classify', question:'小美用 App 統計這個月花了多少錢在食物上，這是？', options:['預算','儲蓄','記帳','投資'], answer:'記帳', explanation:'統計實際花費就是「記帳」的功能。' },
      { type:'multiple_choice', question:'以下哪個行為「組合」最完整地管理金錢？', options:['只記帳就夠了','先預算，消費後記帳，並持續儲蓄'], answer:'先預算，消費後記帳，並持續儲蓄', explanation:'預算規劃、記帳追蹤、儲蓄累積三者配合，才是完整的金錢管理。' },
      { type:'multi_concept_classify', question:'「儲蓄」和「預算」最主要的差別是？', options:['儲蓄是把錢存起來，預算是計畫如何花錢','儲蓄比預算重要','預算就是儲蓄的計畫','兩者沒有差別'], answer:'儲蓄是把錢存起來，預算是計畫如何花錢', explanation:'儲蓄強調保存金錢，預算強調規劃花費，兩者目的不同。' }
    ]
  },
  income_vs_value_exchange: {
    bossName: '混淆怪「錢從哪來」', emoji: '🤔', badge: 'Income Master 征服者', badgeEmoji: '💰',
    questions: [
      { type:'multi_concept_classify', question:'醫生看診，病人付掛號費。對醫生來說，掛號費是什麼？', options:['支出','收入（透過價值交換獲得）','借貸','儲蓄'], answer:'收入（透過價值交換獲得）', explanation:'醫生提供看診服務（價值），換取掛號費（收入），這是透過價值交換得到的收入。' },
      { type:'multiple_choice', question:'小明花 3 小時幫同學補習，他給了小明 200 元。200 元對小明來說是？', options:['支出','收入'], answer:'收入', explanation:'提供服務換來的金錢，對提供服務的人來說是「收入」。' },
      { type:'multi_concept_classify', question:'以下哪一個不是「收入」？', options:['打工賺到的薪水','賣掉舊玩具得到的錢','花掉存款買了電腦','得到的獎學金'], answer:'花掉存款買了電腦', explanation:'花掉存款是支出，不是收入。收入是金錢的流入。' },
      { type:'multiple_choice', question:'所有工作的本質，都是用自己的什麼來換取收入？', options:['快樂和滿足','時間和技能（價值）'], answer:'時間和技能（價值）', explanation:'工作是把自己的時間、技能等「價值」換成金錢，這就是價值交換。' },
      { type:'multi_concept_classify', question:'一個公平的價值交換，最重要的條件是什麼？', options:['雙方交換的東西金額相同','雙方都認為自己獲得的東西是值得的','交換必須用金錢進行','交換的東西必須有形'], answer:'雙方都認為自己獲得的東西是值得的', explanation:'公平交換的核心是雙方都感到滿意，而不一定是金額完全相同。' }
    ]
  },
  active_vs_passive_income: {
    bossName: '混淆怪「躺著賺」', emoji: '😴', badge: 'Income Type Master 征服者', badgeEmoji: '⚡',
    questions: [
      { type:'multi_concept_classify', question:'小玲寫了一本書，去旅行一個月，版稅還是持續進來。這是？', options:['主動收入','被動收入','一次性收入','沒有收入'], answer:'被動收入', explanation:'不需要持續工作就能自動獲得的收入，是「被動收入」。' },
      { type:'multiple_choice', question:'如果你停止工作，哪種收入會停止？', options:['被動收入','主動收入'], answer:'主動收入', explanation:'主動收入依賴持續工作，停止工作就停止收入。' },
      { type:'multi_concept_classify', question:'建立被動收入，通常需要在前期投入什麼？', options:['什麼都不需要，自然就有','時間、金錢或努力的初始投入','只需要運氣','只需要人脈關係'], answer:'時間、金錢或努力的初始投入', explanation:'大多數被動收入都需要前期的投資或努力，才能後來持續帶來報酬。' },
      { type:'multiple_choice', question:'爸爸上班的薪水是主動收入。如果他買了一間出租的房子，租金是？', options:['也是主動收入','被動收入'], answer:'被動收入', explanation:'房租不需要爸爸每天工作就能收到，是「被動收入」。' },
      { type:'multi_concept_classify', question:'為什麼財商教育強調要同時有主動和被動收入？', options:['兩種收入合起來才算真正的收入','主動收入提供生活費，被動收入提供財務保障和自由','被動收入比主動收入更容易獲得','主動收入可以完全取代被動收入'], answer:'主動收入提供生活費，被動收入提供財務保障和自由', explanation:'主動收入維持日常，被動收入讓你在不工作時也有保障，兩者配合才能達到財務自由。' }
    ]
  },
  asset_vs_consumption_good: {
    bossName: '混淆怪「看起來都很值」', emoji: '🏚️', badge: 'Asset Master 征服者', badgeEmoji: '🏠',
    questions: [
      { type:'multi_concept_classify', question:'以下哪一個最接近「資產」的定義？', options:['買了很開心的東西','未來可能繼續帶來價值或收入的東西','價格很貴的東西','用完就沒有的東西'], answer:'未來可能繼續帶來價值或收入的東西', explanation:'資產的重點是它在未來還能繼續幫助你，或帶來收益。' },
      { type:'multiple_choice', question:'一台每天使用會耗損的筆記型電腦，最接近哪個概念？', options:['純粹的資產','消耗品（使用後會損耗）'], answer:'消耗品（使用後會損耗）', explanation:'電腦使用後會耗損，最終報廢，消耗品的特性更明顯。' },
      { type:'multi_concept_classify', question:'小明用零用錢買了一塊黃金存著。這比較接近？', options:['消耗品，因為是用錢買的','資產，因為未來仍有保值或增值的可能','支出，因為花了錢','以上皆非'], answer:'資產，因為未來仍有保值或增值的可能', explanation:'黃金有保值特性，未來仍可賣出，比較接近「資產」的概念。' },
      { type:'multiple_choice', question:'了解「資產 vs 消耗品」最重要的實際用途是什麼？', options:['讓我們知道什麼東西最貴','幫助我們判斷如何花錢更有長期價值'], answer:'幫助我們判斷如何花錢更有長期價值', explanation:'知道什麼是資產、什麼是消耗品，能讓我們在消費時做更有智慧的決定。' },
      { type:'multi_concept_classify', question:'一間可以出租的房子和一包每天吃的零食，最主要的差別是？', options:['房子比零食貴很多','房子未來仍有價值且能帶來收入，零食使用後就消失','零食比房子更實用','兩者本質上是一樣的'], answer:'房子未來仍有價值且能帶來收入，零食使用後就消失', explanation:'這是資產（持續有價值）和消耗品（使用後消失）的核心差別。' }
    ]
  },
  loan_vs_interest_vs_credit: {
    bossName: '混淆怪「借了再說」', emoji: '🏦', badge: 'Credit Master 征服者', badgeEmoji: '🏦',
    questions: [
      { type:'multi_concept_classify', question:'小明向銀行借了 10000 元，一年後還了 10300 元。多出的 300 元是什麼？', options:['本金','利息','手續費','罰款'], answer:'利息', explanation:'借錢後額外支付的費用就是「利息」，利率越高，利息越多。' },
      { type:'multiple_choice', question:'信用良好的人向銀行借錢，通常利率會？', options:['更高','更低'], answer:'更低', explanation:'信用好代表風險低，銀行願意給予更優惠（低）的利率。' },
      { type:'multi_concept_classify', question:'「欠錢不還」最主要會損害什麼？', options:['利息','信用','本金','儲蓄'], answer:'信用', explanation:'不履行還款承諾會讓別人失去對你的信任，嚴重損害個人「信用」。' },
      { type:'multiple_choice', question:'分期付款的本質是什麼？', options:['一種儲蓄方式','一種借貸行為（先享用，後付款）'], answer:'一種借貸行為（先享用，後付款）', explanation:'分期付款讓你先獲得商品，之後分批償還，本質上是借貸。' },
      { type:'multi_concept_classify', question:'建立良好信用最重要的方法是什麼？', options:['盡量多借錢','每次借錢後都準時還清','只向朋友借錢','盡量不借錢'], answer:'每次借錢後都準時還清', explanation:'信用來自可靠性，每次準時還款是建立良好信用最有效的方法。' }
    ]
  },
  insurance_vs_saving_vs_investment: {
    bossName: '混淆怪「三不分」', emoji: '🛡️', badge: 'Finance Tool Master 征服者', badgeEmoji: '🛡️',
    questions: [
      { type:'multi_concept_classify', question:'每月繳保費，生病時獲得理賠。這是什麼？', options:['儲蓄','投資','保險','借貸'], answer:'保險', explanation:'定期繳費換取發生意外時的保障，這是「保險」的核心功能。' },
      { type:'multiple_choice', question:'和銀行儲蓄相比，股票投資的風險和報酬潛力通常是？', options:['風險更低，報酬更高','風險更高，但報酬潛力也可能更高'], answer:'風險更高，但報酬潛力也可能更高', explanation:'這是投資的基本原則：高風險伴隨高報酬潛力，低風險通常報酬也較低。' },
      { type:'multi_concept_classify', question:'一個好的理財計畫，為什麼需要保險、儲蓄和投資三者都有？', options:['因為法律規定要有','保險保障、儲蓄應急、投資增值，三者功能不同','因為這樣才能賺更多錢','三者做一種就夠了'], answer:'保險保障、儲蓄應急、投資增值，三者功能不同', explanation:'三者各有不同功能，缺一不可，才能應對生活中的各種財務需求。' },
      { type:'multiple_choice', question:'保險費是「花掉的錢」，但它換來的是什麼？', options:['直接的金錢報酬','發生意外時的財務保障'], answer:'發生意外時的財務保障', explanation:'保險的價值不在於賺錢，而在於意外發生時能提供保護。' },
      { type:'multi_concept_classify', question:'小明把錢放在定期存款。這是哪種行為？', options:['高風險投資','保險','儲蓄','借貸'], answer:'儲蓄', explanation:'定期存款是保存金錢的方式，風險極低，屬於「儲蓄」。' }
    ]
  },
  risk_vs_uncertainty: {
    bossName: '混淆怪「猜不透」', emoji: '👻', badge: 'Risk Master 征服者', badgeEmoji: '🎲',
    questions: [
      { type:'multi_concept_classify', question:'保險公司能計算出「每 1000 人中大約有幾人會生病」。這是在處理？', options:['不確定性','可計算的風險','完全未知的事件','個人選擇'], answer:'可計算的風險', explanation:'能用統計數據估算機率的，屬於「可計算的風險」，這就是保險業的基礎。' },
      { type:'multiple_choice', question:'「明天會不會下雨」和「明年股市會漲還是跌」，哪個更接近「不確定性」？', options:['明天下雨（有氣象預報）','明年股市（難以精確預測）'], answer:'明年股市（難以精確預測）', explanation:'股市受太多因素影響，難以精確預測，比短期天氣更接近「不確定性」。' },
      { type:'multi_concept_classify', question:'風險管理的目的是什麼？', options:['完全消除所有風險','識別和降低已知風險，為不確定性做準備','讓風險更高以求更高報酬','假裝風險不存在'], answer:'識別和降低已知風險，為不確定性做準備', explanation:'風險管理不是消除所有風險（不可能），而是識別、評估並降低風險的影響。' },
      { type:'multiple_choice', question:'以下哪個最接近「風險」（可計算）而非「不確定性」？', options:['骰子擲出 6 點的機率','下一個偉大發明是什麼'], answer:'骰子擲出 6 點的機率', explanation:'骰子有已知機率（1/6），是可計算的「風險」；偉大發明無法預測，是「不確定性」。' },
      { type:'multi_concept_classify', question:'小明知道「10 家新創公司中，平均 7 家在 3 年內倒閉」，這是在說創業的？', options:['不確定性（完全無法預測）','風險（有統計數據支持的機率）','保證會失敗','不值得做'], answer:'風險（有統計數據支持的機率）', explanation:'有統計數據支持的機率，屬於「風險」範疇，雖然個別結果仍不確定。' }
    ]
  },
  revenue_vs_profit: {
    bossName: '混淆怪「賺很多？」', emoji: '📈', badge: 'Business Math Master 征服者', badgeEmoji: '📈',
    questions: [
      { type:'multi_concept_classify', question:'小明的手工藝店這個月賣出 10000 元的商品，但材料、租金等花了 7000 元，利潤是？', options:['10000 元','7000 元','3000 元','17000 元'], answer:'3000 元', explanation:'利潤 = 營收 - 成本 = 10000 - 7000 = 3000 元。' },
      { type:'multiple_choice', question:'一家店的「營收」很高，代表這家店一定賺錢嗎？', options:['是，營收高就是賺很多','不一定，要看成本是否更高'], answer:'不一定，要看成本是否更高', explanation:'如果成本高於營收，即使營收很高也可能虧損。利潤才是真正賺到的錢。' },
      { type:'multi_concept_classify', question:'飲料一杯賣 60 元，原料成本 20 元，一天賣 100 杯。哪個數字是「利潤」（只計原料）？', options:['6000 元（總營收）','4000 元（利潤）','2000 元（成本）','100 元（杯數）'], answer:'4000 元（利潤）', explanation:'利潤 = (60 - 20) × 100 = 4000 元。6000 是營收，2000 是成本。' },
      { type:'multiple_choice', question:'老闆說：「我們這個月的銷售額創新高！」銷售額是指？', options:['利潤','營收（尚未扣除成本）'], answer:'營收（尚未扣除成本）', explanation:'銷售額 = 營收，是還沒有扣除各種成本的金額。' },
      { type:'multi_concept_classify', question:'一本書定價 300 元（營收），印刷和配送成本 100 元。作者能拿到的最多是？', options:['300 元','100 元','最多 200 元（扣除成本後）','400 元'], answer:'最多 200 元（扣除成本後）', explanation:'扣除 100 元成本後，最多剩 200 元，這才是可能的利潤上限。' }
    ]
  },
  cost_vs_expense: {
    bossName: '混淆怪「都是錢」', emoji: '🔧', badge: 'Cost Analysis Master 征服者', badgeEmoji: '🔧',
    questions: [
      { type:'multi_concept_classify', question:'麵包店製作麵包用的麵粉和奶油，屬於什麼？', options:['費用','成本（生產直接用到的）','利潤','收入'], answer:'成本（生產直接用到的）', explanation:'直接用於生產商品的原料，屬於「成本」。' },
      { type:'multiple_choice', question:'麵包店老闆每月付的店面租金，屬於？', options:['成本（直接生產成本）','費用（營運費用）'], answer:'費用（營運費用）', explanation:'租金是維持店面運作的支出，屬於「費用」，而非直接生產成本。' },
      { type:'multi_concept_classify', question:'以下哪個屬於「固定費用」？', options:['賣越多商品，用的原料越多','每個月固定付的保全費用','加班費（做越多越多）','隨季節變動的電費'], answer:'每個月固定付的保全費用', explanation:'固定費用是不隨生產量變化的支出，每月固定的保全費就是典型例子。' },
      { type:'multiple_choice', question:'想要「降低生產成本」，最直接的方式是？', options:['減少廣告費','找更便宜的原料或提高生產效率'], answer:'找更便宜的原料或提高生產效率', explanation:'生產成本與生產直接相關，降低原料費用或提高效率是最直接的方式。' },
      { type:'multi_concept_classify', question:'成本和費用的主要差別是？', options:['成本比費用貴','成本直接用於生產商品，費用是維持公司運作的支出','費用只有大公司才有','兩者沒有差別，都是花錢'], answer:'成本直接用於生產商品，費用是維持公司運作的支出', explanation:'成本與生產直接掛勾，費用是維持整體營運的支出，兩者用途不同。' }
    ]
  },
  supply_vs_demand: {
    bossName: '混淆怪「要多少有多少」', emoji: '⚖️', badge: 'Market Master 征服者', badgeEmoji: '⚖️',
    questions: [
      { type:'multi_concept_classify', question:'夏天到了，冰淇淋需求大增，但工廠產能有限。根據供需，冰淇淋價格可能？', options:['下降，因為大家都想買','上漲，因為供不應求','維持不變','完全取決於政府'], answer:'上漲，因為供不應求', explanation:'需求增加但供給不足（供不應求）時，價格通常會上漲。' },
      { type:'multiple_choice', question:'「供給」指的是什麼？', options:['消費者想要買多少','生產者願意且能夠提供多少'], answer:'生產者願意且能夠提供多少', explanation:'供給是從生產者角度，指他們願意並能夠在某個價格下提供的數量。' },
      { type:'multi_concept_classify', question:'當蘋果大豐收，市場上供給遠超過需求，蘋果價格可能？', options:['大幅上漲','下降，因為供過於求','維持不變','完全消失'], answer:'下降，因為供過於求', explanation:'供給遠超需求（供過於求）時，賣方會降價以吸引買家。' },
      { type:'multiple_choice', question:'市場的「均衡價格」是什麼？', options:['政府設定的固定價格','供給量和需求量相等時的價格'], answer:'供給量和需求量相等時的價格', explanation:'當買方願意買的量等於賣方願意賣的量，就達到「均衡」，此時的價格叫做均衡價格。' },
      { type:'multi_concept_classify', question:'為什麼限量版球鞋通常賣得很貴？', options:['因為球鞋品質特別好','因為供給量少（限量），但需求量多，供不應求','因為廣告費用很高','因為政府規定限量商品要賣貴'], answer:'因為供給量少（限量），但需求量多，供不應求', explanation:'限量造成供給稀少，加上高需求，根據供需原理，價格自然偏高。' }
    ]
  },
  personal_vs_market_value: {
    bossName: '混淆怪「誰說了算」', emoji: '💫', badge: 'Value Thinker 征服者', badgeEmoji: '💫',
    questions: [
      { type:'multi_concept_classify', question:'媽媽親手做的毛衣，市場可能賣 200 元，但對你來說「無價」。這說明什麼？', options:['市場定價不準確','個人價值（情感意義）可以遠超市場價格','手工品都是無價的','你需要付更多錢才能買到類似的'], answer:'個人價值（情感意義）可以遠超市場價格', explanation:'個人對某物的情感和意義（個人價值），可以遠超出市場定的價格。' },
      { type:'multiple_choice', question:'「市場價值」主要由什麼決定？', options:['個人的感情','市場上的供給與需求'], answer:'市場上的供給與需求', explanation:'市場價值由買賣雙方的供需關係決定，是相對客觀的。' },
      { type:'multi_concept_classify', question:'同一幅畫，一個人認為值 100 萬，另一個人認為不值 100 元。這說明？', options:['畫的品質很差','個人價值判斷因人而異，與市場定價可以完全不同','藝術品沒有市場價值','兩人的審美都不對'], answer:'個人價值判斷因人而異，與市場定價可以完全不同', explanation:'每個人對同一件東西的個人價值判斷都不同，這就是個人價值主觀性的體現。' },
      { type:'multiple_choice', question:'做消費決策時，比較好的方式是考慮？', options:['只看市場價格','同時考慮市場價格和個人價值'], answer:'同時考慮市場價格和個人價值', explanation:'好的消費決策需要同時考慮「這個值多少錢（市場）」和「這對我值多少（個人）」。' },
      { type:'multi_concept_classify', question:'一雙限量球鞋在市場上賣 5000 元。對一個不喜歡運動的人，它的個人價值可能？', options:['一定也是 5000 元','可能遠低於 5000 元，因為對他的生活沒有特殊意義','一定更高，因為是限量版','個人價值和市場價格一定相同'], answer:'可能遠低於 5000 元，因為對他的生活沒有特殊意義', explanation:'個人價值取決於這個東西對你的意義和用途，不一定等於市場定的價格。' }
    ]
  }
};

export const BOSS_RESULTS = [
  { minScore: 5, title: '概念大師！', desc: '完全征服混淆怪，概念清晰如水晶！', emoji: '👑', color: 'from-yellow-400 to-orange-400' },
  { minScore: 4, title: '概念觀察者', desc: '幾乎完美！再一點點就成為大師了！', emoji: '🌟', color: 'from-blue-400 to-cyan-400' },
  { minScore: 3, title: '還不錯，繼續練習！', desc: '混淆怪被你擊傷了！再加把勁！', emoji: '💪', color: 'from-green-400 to-emerald-400' },
  { minScore: 0, title: '概念混淆，需要再挑戰！', desc: '混淆怪太狡猾了，去複習後再戰！', emoji: '📚', color: 'from-slate-400 to-gray-400' }
];

export function getBossResult(score) {
  return BOSS_RESULTS.find(r => score >= r.minScore);
}