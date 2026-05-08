import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  getOrCreateProgress,
  markQuizCompleted,
  submitOpenAnswer,
  submitTask,
  revealTask,
} from '@/api/weeklyProgress';

// ==================
// 週次資料
// ==================
const WEEK_DATA = {
  1: {
    title: 'Week 1',
    question: '如果世界沒有錢，真的會更公平嗎？',
    hasOpenQuestion: false,
    taskTitle: '本週任務',
    taskDescription: '🎯 拍下 3 個你覺得與「交換」的案例類似的。\n\n你可以拍：\n• 品牌聯名商品\n• 店家和創作者合作的畫面\n• 平台和老師的課程頁面\n• 生活中不是用錢完成的交換情境\n\n每拍 1 張，請你回答 2 件事：\n\n1️⃣ 這是誰跟誰？\n\n2️⃣ 他們可能交換了什麼？(你不一定要知道正確答案，請盡量說明你的思考點)',
    quizType: 'multiple',
    quizQuestions: [
      { id: 1, block: '基礎理解', question: '小明用自己的漫畫書換同學的餅乾，這種行為最接近哪一種？', options: ['使用金錢交易', '以物易物（Barter）', '借貸', '投資'], answer: '以物易物（Barter）', explanation: '用物品直接交換物品，就是以物易物。' },
      { id: 2, block: '基礎理解', question: '小華手上有羊毛，但他需要金屬，這代表什麼？', options: ['他什麼都沒有', '他已經可以完成所有交換', '他擁有資源（Resources）但不完整', '他不需要交換'], answer: '他擁有資源（Resources）但不完整', explanation: '他有資源，但不是自己現在需要的資源。' },
      { id: 3, block: '基礎理解', question: '小美用一袋米換到一塊布，這整個過程最接近什麼？', options: ['投資', '收入', '交換（Exchange）', '儲蓄'], answer: '交換（Exchange）', explanation: '雙方用自己有的東西互換，就是交換。' },
      { id: 4, block: '交換限制', question: '小明想用羊毛換金屬，但對方說只想要糧食，這種情況最接近什麼問題？', options: ['價格太高', '雙重巧合沒有成立', '東西不夠多', '沒有市場'], answer: '雙重巧合沒有成立', explanation: '交換要成功，雙方都要剛好想要對方的東西。' },
      { id: 5, block: '交換限制', question: '如果你要先用羊毛換糧食，再用糧食換金屬，這代表什麼？', options: ['交換很簡單', '交換變更公平', '交換效率變低', '交換不需要時間'], answer: '交換效率變低', explanation: '需要多步驟才能完成，代表效率變低。' },
      { id: 6, block: '交換限制', question: '小明帶著一袋水果去交換，但還沒換到就壞掉了，這反映什麼問題？', options: ['沒有人想要水果', '水果沒有價值', '交換很公平', '保存與時間影響交換效率'], answer: '保存與時間影響交換效率', explanation: '物品會壞掉，代表交換會被時間與保存影響。' },
      { id: 7, block: '深入思考', question: '大家手上都有東西，但還是換不到想要的，最可能的原因是什麼？', options: ['雙重巧合沒有對上', '東西太少', '沒有價格標籤', '東西太便宜'], answer: '雙重巧合沒有對上', explanation: '不是有東西就能交換成功，還要需求剛好對上。' },
      { id: 8, block: '深入思考', question: '牧民想用牛換金屬，但雙方一直談不攏要換多少，這最接近什麼問題？', options: ['沒有資源', '沒有人需要金屬', '沒有標準衡量與談判困難', '交換太快'], answer: '沒有標準衡量與談判困難', explanation: '沒有統一標準時，需要談判與估算。' },
      { id: 9, block: '深入思考', question: '古代人開始用符號來記錄交易，這是為了解決什麼問題？', options: ['讓東西變多', '提高價格', '讓交換更慢', '減少交易混亂與增加信任'], answer: '減少交易混亂與增加信任', explanation: '記錄讓交易更清楚、降低混亂。' },
      { id: 10, block: '深入思考', question: '一個人有很多東西，但就是換不到需要的工具，這代表什麼？', options: ['他很窮', '沒有錢比較公平', '交換制度效率不高，不一定公平', '他不夠努力'], answer: '交換制度效率不高，不一定公平', explanation: '能不能換到需要的東西，才是關鍵。' },
    ],
  },
  2: {
    title: 'Week 2',
    question: '金錢是怎麼出現的？',
    hasOpenQuestion: false,
    taskTitle: '本週任務',
    taskDescription: '🎯 我身邊的支付世界地圖\n\n這週，去找 3 個你生活中看到的支付方式。\n\n可以是：\n• 便利商店收銀台旁的 LOGO 貼紙\n• 家裡大人手機裡的 APP\n• 或是找找看還有哪裡有在收銀台旁邊貼各種電子支付的標示\n\n再來，回答這個問題：\n\n1️⃣ 你去哪裡買東西？買用品嗎？去餐廳吃飯嗎？\n\n2️⃣ 支付的時候用什麼支付方式呢？電子支付嗎？現金嗎？或是有其他的支付方式呢？(禮券？)',
    quizType: 'multiple',
    quizQuestions: [
      { id: 1, block: '基礎記憶', question: '「商品貨幣」是指什麼？', options: ['政府印製的紙鈔', '用實體物品當作交換媒介的錢，例如鹽或貝殼', '銀行帳戶裡的數字', '金屬製作的硬幣'], answer: '用實體物品當作交換媒介的錢，例如鹽或貝殼', explanation: '商品貨幣是指用大家都認同有價值的實體物品來當錢。' },
      { id: 2, block: '基礎記憶', question: '古羅馬士兵的薪水是什麼？', options: ['金幣', '鹽巴', '貝殼', '布'], answer: '鹽巴', explanation: '古羅馬士兵的薪水是鹽（拉丁文 SAL），英文的「薪水」salary 就是從這個字演變來的。' },
      { id: 3, block: '基礎記憶', question: '世界最早的紙幣是在哪裡出現的？', options: ['古羅馬', '非洲肯亞', '中國宋朝', '中世紀歐洲'], answer: '中國宋朝', explanation: '世界最早的紙幣出現在中國宋朝，叫做「交子」。' },
      { id: 4, block: '基礎理解', question: '為什麼鹽巴可以在古代被拿來當作金錢使用？', options: ['因為鹽巴很稀少，沒有人見過', '因為鹽巴只有有錢人才買得起', '因為大家都需要鹽巴，而且它可以保存食物和消毒', '因為鹽巴很輕，容易攜帶'], answer: '因為大家都需要鹽巴，而且它可以保存食物和消毒', explanation: '鹽巴功能多、大家都需要，所以能達成共識。' },
      { id: 5, block: '基礎理解', question: '從硬幣演變到紙鈔，最主要的原因是什麼？', options: ['硬幣容易生鏽', '硬幣太容易被偷走', '硬幣大量攜帶非常不方便，紙鈔更輕巧', '紙鈔比硬幣更有價值'], answer: '硬幣大量攜帶非常不方便，紙鈔更輕巧', explanation: '紙鈔輕便又好攜帶，就慢慢取代了硬幣。' },
      { id: 6, block: '基礎理解', question: '為什麼不是什麼東西都可以拿來當金錢？', options: ['只要政府說可以，任何東西都可以當錢', '金錢需要大家的共識與信任，還要耐用、可分割、方便攜帶', '金錢一定要是金屬做的才行', '金錢只要好看就夠了'], answer: '金錢需要大家的共識與信任，還要耐用、可分割、方便攜帶', explanation: '成為金錢的條件包含：大家都認同、耐用、可分割、容易攜帶。' },
      { id: 7, block: '基礎理解', question: '數位支付和紙鈔一樣，最根本的基礎都是什麼？', options: ['科技設備', '對政府和機構的信任', '網路速度', '手機的品牌'], answer: '對政府和機構的信任', explanation: '不管是紙鈔還是數位支付，背後最重要的都是「信任」。' },
      { id: 8, block: '實際應用', question: '小明說：「我在家裡畫了一張紙，上面寫100元，大家應該都要接受！」這個想法哪裡有問題？', options: ['畫得不夠漂亮', '沒有人信任他畫的紙，也沒有機構認證，無法達成共識', '紙太薄了，不夠耐用', '應該用硬幣，不能用紙'], answer: '沒有人信任他畫的紙，也沒有機構認證，無法達成共識', explanation: '金錢必須由可信任的機構發行，才能讓大家建立共識。' },
      { id: 9, block: '實際應用', question: '小華說他在超市看到可以用手機嗶一聲結帳，但奶奶說「感覺不安全」。你會怎麼解釋？', options: ['奶奶說得對，手機支付不是真的錢', '手機支付只是把銀行帳戶裡的數字轉移，背後還是真實的錢', '手機支付是免費的，不需要真正的錢', '手機支付的錢和紙鈔是完全不同的東西'], answer: '手機支付只是把銀行帳戶裡的數字轉移，背後還是真實的錢', explanation: '數位支付只是讓帳戶裡的數字增加或減少，基礎還是信任。' },
      { id: 10, block: '實際應用', question: '如果今天你有一袋米要換鞋子，用金錢交換和直接以物易物比起來，哪裡最方便？', options: ['金錢交換沒有比較方便', '你可以先把米換成錢，再拿錢去買任何你想要的鞋子', '你一定要先找到想要米的人，才能換到錢', '米直接換鞋子比較快'], answer: '你可以先把米換成錢，再拿錢去買任何你想要的鞋子', explanation: '金錢解決了「雙重巧合」的問題。' },
    ],
  },
  3: {
    title: 'Week 3',
    question: '為什麼有些東西貴但大家還是搶著買？',
    hasOpenQuestion: false,
    taskTitle: '本週任務',
    taskDescription: '🎯 當一個「情境偵探」\n\n這週，請你當一個情境偵探。\n找出 3 個 在你生活中看到的例子——\n同一樣東西，因為情境不一樣，價值就不一樣了。\n\n你可以從這些地方找：\n🔍 便利商店｜同一個東西，在雨天、熱天、半夜、考試前，你有沒有過「突然覺得它超值」的時刻？\n🔍 網路上｜有沒有哪個商品，有人瘋搶、有人完全無感？(演唱會、球鞋、卡牌、周邊)\n🔍 家裡｜爸媽有沒有買過一個東西，他覺得超值、你覺得莫名其妙？或反過來？\n🔍 特殊地點｜機場、電影院、遊樂園、高鐵、球賽場邊——這裡的價格，和外面差在哪？\n\n回傳方式：\n每個案例請拍一張照(自己拍)，配上這 2 句話回答：\n\n1️⃣ 這是什麼？(誰 × 什麼東西)\n\n2️⃣ 在這個情境裡，誰覺得它超值？為什麼？',
    quizType: 'multiple',
    quizQuestions: [
      { id: 1, block: '基礎記憶', question: '「價值」最接近哪個意思？', options: ['東西的標價數字', '對你在某個時候有幫助的東西或服務', '東西的重量或大小', '老闆決定要賣多少錢'], answer: '對你在某個時候有幫助的東西或服務', explanation: '價值是指某樣東西在某個時間點、某個情境下，對你有沒有幫助。' },
      { id: 2, block: '基礎記憶', question: '「供給」是指什麼？', options: ['想要買某樣東西的人有多少', '市場上這個東西現在有多少', '東西的製作成本', '老闆的利潤'], answer: '市場上這個東西現在有多少', explanation: '供給是指市場上現在提供了多少這個東西。' },
      { id: 3, block: '基礎記憶', question: '「價值主張」是指一個品牌在告訴你什麼？', options: ['這個東西的重量和尺寸', '買我，你不只得到產品，還得到其他體驗和價值', '這個東西現在打折', '這個東西是誰做的'], answer: '買我，你不只得到產品，還得到其他體驗和價值', explanation: '價值主張是品牌向你說明，你除了買到產品本身，還能得到什麼。' },
      { id: 4, block: '基礎理解', question: '同一瓶水，在便利商店賣20塊，但在沙漠裡可能讓你願意付更多錢。這說明了什麼？', options: ['沙漠的水品質比較好', '價值會因為情境和你有多需要它而改變', '水的價格是固定的', '便利商店賣太便宜了'], answer: '價值會因為情境和你有多需要它而改變', explanation: '水本身沒變，但在沙漠裡你非常需要它，所以它的價值變得更高了。' },
      { id: 5, block: '基礎理解', question: '小美去圖書館免費借書，但這本書她非常想看。以下哪個說法最正確？', options: ['免費的東西就沒有價值', '這本書的價格低，但對小美的價值很高', '這本書又貴又有價值', '價格高才代表價值高'], answer: '這本書的價格低，但對小美的價值很高', explanation: '價格和價值是不同的事。' },
      { id: 6, block: '基礎理解', question: '全台灣只剩100杯珍珠奶茶，但有100萬人想喝。這時候價格最可能怎麼變化？', options: ['價格下降，因為老闆想賣光', '價格不變，因為東西還是一樣的', '價格上升，因為供給少需求多', '價格變成免費'], answer: '價格上升，因為供給少需求多', explanation: '供給少、需求多的時候，價格就會上升。' },
      { id: 7, block: '基礎理解', question: '小明看到一雙限量球鞋，標價一萬元。小明不喜歡球鞋，覺得沒什麼用。這個情況說明了什麼？', options: ['這雙鞋一定很爛', '貴的東西對每個人來說價值都一樣', '價格高不代表對每個人都有相同的價值', '小明應該買下來投資'], answer: '價格高不代表對每個人都有相同的價值', explanation: '同一樣東西，對不同的人來說價值是不同的。' },
      { id: 8, block: '實際應用', question: '你媽媽說：「這個玩具不用買這麼貴的，功能都一樣。」你最好的回答是哪一個？', options: ['「那就買最貴的才是最好的！」', '「媽媽你不懂，貴的一定比較好。」', '「媽媽，你說得有道理。功能一樣的話，便宜的對我來說價值也夠高了。」', '「反正我就是想要那個，就買那個。」'], answer: '「媽媽，你說得有道理。功能一樣的話，便宜的對我來說價值也夠高了。」', explanation: '能說出「這樣東西帶給我的價值值不值這個價格」，才是真正理解價值和價格的差別。' },
      { id: 9, block: '實際應用', question: '小華的學校附近突然開了十家賣相同文具的店，但買的人沒有變多。小華推測文具的價格會怎樣？', options: ['價格會上升，因為店變多了', '價格會下降，因為供給多需求沒變', '價格完全不受影響', '價格先上升再下降'], answer: '價格會下降，因為供給多需求沒變', explanation: '供給變多但需求不變，競爭下價格通常會降低。' },
      { id: 10, block: '實際應用', question: '小李想買一杯300元的品牌珍珠奶茶，他的朋友說「你傻嗎，50元也喝得到」。小李最能說服朋友的理由是哪一個？', options: ['「貴的就是比較好！」', '「因為我有錢，我就是要買。」', '「因為我很在意那個品牌的空間體驗和設計，這個對我來說值這個價格。」', '「反正你也不懂，別管我。」'], answer: '「因為我很在意那個品牌的空間體驗和設計，這個對我來說值這個價格。」', explanation: '能說出你為什麼願意付這個價格、它帶給你什麼價值，才是真正懂得為自己的選擇負責。' },
    ],
  },
  4: {
    title: 'Week 4',
    question: '老闆賣東西真的賺那麼多嗎？',
    hasOpenQuestion: false,
    taskTitle: '本週任務',
    taskDescription: '🎯 三家店偵查計畫 🕵️‍♂️\n\n挑 3 家你常去或你好奇的店，每家店偵查三個問題：\n\n1️⃣ 主題課程教過的三種成本：原料、人力、場地水電\n\n2️⃣ 還有哪些別種成本？設計、授權、品牌、配送系統、廣告⋯⋯\n\n3️⃣ 為什麼我願意來這家店花錢？有買嗎？值得嗎？\n\n完成之後，選你覺得最有趣的一家店，用語音或文字告訴老師你最意外的發現是什麼！',
    quizType: 'multiple',
    quizQuestions: [
      { id: 1, block: '基礎記憶', question: '老闆賣東西的時候，「成本」是指什麼?', options: ['客人付給老闆的錢', '老闆為了做生意花出去的錢', '商品的標價', '店裡還沒賣出去的商品'], answer: '老闆為了做生意花出去的錢', explanation: '成本就是老闆為了做生意必須先花掉的錢。' },
      { id: 2, block: '基礎記憶', question: '「收入 - 成本 = ?」這個公式，算出來的是什麼?', options: ['價格', '利潤', '折扣', '損失'], answer: '利潤', explanation: '老闆收到的錢扣掉花掉的錢，剩下的才是真正賺到的，叫做利潤。' },
      { id: 3, block: '基礎記憶', question: '這週主課教的三種成本，不包含下面哪一個?', options: ['原料', '人力', '場地水電', '客人的心情'], answer: '客人的心情', explanation: '這週主課教的三種成本是原料、人力、場地水電。' },
      { id: 4, block: '基礎理解', question: '小華家的珍奶店一杯賣 50 元，成本是 35 元。她的爸爸說這杯奶茶「賺 50 元」，這個說法哪裡有問題?', options: ['價格應該更高才對', '50 元是收入，要扣掉成本才是真正賺到的', '奶茶應該免費送', '35 元太便宜了'], answer: '50 元是收入，要扣掉成本才是真正賺到的', explanation: '50 元只是收到的錢，要減掉 35 元成本，實際賺到的利潤只有 15 元。' },
      { id: 5, block: '基礎理解', question: '小明觀察到：7-11 的御飯糰比媽媽做的貴很多，可是 7-11 的老闆不是特別貪心。為什麼會這樣?', options: ['7-11 的米比較好', '7-11 還要付冷藏車配送、24 小時營業等成本', '媽媽不會做飯糰', '便利商店一定比較貴'], answer: '7-11 還要付冷藏車配送、24 小時營業等成本', explanation: '你付的價差，是在買「方便」——這些配送、保鮮、24 小時營業的系統本身就要花很多錢。' },
      { id: 6, block: '基礎理解', question: '小美去百貨公司買一杯 400 元的精品珍奶，她爸爸說：「這個老闆太貪心了！」這個判斷準不準確?', options: ['準確，因為價格太高一定是貪心', '不準確，要看這家店的成本結構才知道', '準確，精品都是騙人的', '不準確，價格越高越有價值'], answer: '不準確，要看這家店的成本結構才知道', explanation: '精品店的店租、人力、裝潢成本通常都比較高，價格高不一定代表賺比較多。' },
      { id: 7, block: '基礎理解', question: '小李發現一包寶可夢卡牌紙跟墨水加起來不到 10 元，可是一包要賣 150 元。剩下的 140 元可能花在哪裡?', options: ['老闆口袋', '設計、品牌授權、廣告等別種成本', '卡牌包裝', '運送費用'], answer: '設計、品牌授權、廣告等別種成本', explanation: '有些產品的成本不在「做出來」，而在讓你「想要它」。' },
      { id: 8, block: '基礎理解', question: '上禮拜學過：同一杯奶茶，50 元跟 400 元解決的是不同的需求。這個觀念和「成本」合起來看，告訴我們什麼?', options: ['貴的東西一定比較好', '價格高 = 賺得多', '價格是在「價值」和「成本」之間的平衡點', '便宜一定比較划算'], answer: '價格是在「價值」和「成本」之間的平衡點', explanation: '價格一邊要看客人願意付多少，另一邊要能蓋住老闆的成本。' },
      { id: 9, block: '實際應用', question: '你長大想開一家手搖飲店，爸媽問你怎麼定價。你應該怎麼做?', options: ['隨便訂一個自己喜歡的數字', '看隔壁店賣多少，我就跟著賣多少', '先算清楚每一杯的成本，再決定要賣多少才不會虧', '越貴越好，這樣賺比較多'], answer: '先算清楚每一杯的成本，再決定要賣多少才不會虧', explanation: '不先算成本就定價，很容易虧錢還不知道。' },
      { id: 10, block: '實際應用', question: '你和朋友去夜市，看到一個蔥抓餅老闆忙到流汗、站了整晚。你會怎麼想這個畫面?', options: ['他賺很多，不用心疼', '一份蔥抓餅的價格裡面，也藏著他站整晚的時間和辛苦', '他應該漲價', '他一定很開心'], answer: '一份蔥抓餅的價格裡面，也藏著他站整晚的時間和辛苦', explanation: '老闆的勞動時間也是一種成本。' },
    ],
  },
  5: {
    title: 'Week 5',
    question: '你買東西是「需要」還是「想要」？',
    hasOpenQuestion: true,
    openQuestion: '回想一次你最近的消費，它是「需要」還是「想要」？它滿足了馬斯洛的哪一層需求？你覺得值得嗎？',
    taskTitle: '本週任務',
    taskDescription: '🎯 在生活裡找到你自己的 3 個「想要」場景。\n\n針對每個「想要」，回答這 4 個問題：\n\n1️⃣ 這是什麼東西？（可以拍照、畫圖、或文字描述）\n\n2️⃣ 它是哪一層需求？（從 5 層裡挑：生理／安全／社交／自尊／自我實現）\n\n3️⃣ 是身體在說話？還是腦袋在說話？\n\n4️⃣ 拆解之後，你的判斷是？\n  □ 我還是想要，理由是 ＿＿＿\n  □ 我發現我其實不需要\n  □ 我要先放三天再說',
    quizType: 'multiple',
    quizQuestions: [
      { id: 1, block: '基礎記憶', question: '馬斯洛 (Maslow) 是一位什麼樣的人?', options: ['美國的數學家', '美國的心理學家，研究人類的需求層次', '台灣的老師', '英國的物理學家'], answer: '美國的心理學家，研究人類的需求層次', explanation: '馬斯洛是 1943 年的美國心理學家，他研究發現人有五個層次的需求。' },
      { id: 2, block: '基礎記憶', question: '馬斯洛需求金字塔最底層 (最基本) 是什麼?', options: ['自尊需求 (覺得自己很棒)', '社交需求 (有朋友)', '生理需求 (吃喝睡)', '自我實現 (追夢想)'], answer: '生理需求 (吃喝睡)', explanation: '最底層是生理需求，要先吃飽喝足睡夠，才能往上想其他需求。' },
      { id: 3, block: '基礎記憶', question: '當你的胃咕咕叫、頭暈暈的、覺得沒力氣，這是哪一種訊號在跟你說話?', options: ['腦袋的訊號', '身體的訊號', '朋友的訊號', '夢想的訊號'], answer: '身體的訊號', explanation: '胃咕咕叫、頭暈、沒力氣都是身體在告訴你它需要食物或休息。' },
      { id: 4, block: '基礎理解', question: '小明走進書店看到一本漂亮的新漫畫，心裡突然冒出「我好想要」，但他的胃並沒有咕咕叫。這個「想要」最可能是?', options: ['身體在說話 (生理需求)', '腦袋在說話 (不是生理需求)', '夢想在說話', '老師在說話'], answer: '腦袋在說話 (不是生理需求)', explanation: '看到漂亮東西冒出的「想要」，通常是腦袋的訊號，不是身體真的需要。' },
      { id: 5, block: '基礎理解', question: '【回顧 W4】小華開了一家手作飲料店，他發現除了珍珠和茶葉的錢，還要付房租、電費和員工薪水。這些「賺到的錢必須先扣掉的部分」叫做什麼?', options: ['收入', '成本', '想要', '需求'], answer: '成本', explanation: '成本是經營一件事必須先付出的錢。' },
      { id: 6, block: '基礎理解', question: '小美說：「不課金的話，我會被遊戲裡的朋友邊緣化。」她想滿足的是哪一層需求?', options: ['生理需求 (吃喝睡)', '安全需求 (有地方住)', '社交需求 (被朋友認同)', '自我實現 (追夢想)'], answer: '社交需求 (被朋友認同)', explanation: '怕被邊緣化、想要朋友認同，是第三層的社交需求。' },
      { id: 7, block: '基礎理解', question: '為什麼當一個人擔心今天沒飯吃的時候，他通常很難認真思考「我想成為什麼樣的人」?', options: ['因為這個問題太難了', '因為下面的需求 (吃飯) 沒被滿足，很難跳到上面的需求 (夢想)', '因為大人不准他想', '因為他不夠聰明'], answer: '因為下面的需求 (吃飯) 沒被滿足，很難跳到上面的需求 (夢想)', explanation: '馬斯洛發現，人通常要先滿足下面的需求，才會去想上面的需求。' },
      { id: 8, block: '實際應用', question: '你今天考試考得很好，媽媽稱讚你，你覺得超開心。如果想要更常感受到這種「自尊需求」被滿足，以下哪個方法最有效?', options: ['一直拜託別人稱讚自己', '在自己努力後完成的事情上，慢慢累積真實的成就感', '完全不在意別人怎麼說', '只追求物質的東西'], answer: '在自己努力後完成的事情上，慢慢累積真實的成就感', explanation: '自尊需求是來自「自己努力完成」的成就感，不是只有被稱讚。' },
      { id: 9, block: '實際應用', question: '你看到同學買了新球鞋，你也突然好想要。如果你想學會「拆解自己的想要」，第一步應該做什麼?', options: ['馬上拜託爸媽買', '先問自己：「這個想要是身體在喊？還是腦袋在喊？它在滿足哪一層需求？」', '直接認定自己一定需要', '直接放棄，什麼都不買'], answer: '先問自己：「這個想要是身體在喊？還是腦袋在喊？它在滿足哪一層需求？」', explanation: '先拆解再決定，這是這週老師說的重點。' },
    ],
  },
  6: {
    title: 'Week 6',
    question: '這個少，是真的少？還是被設計成少？',
    hasOpenQuestion: false,
    taskTitle: '本週任務',
    taskDescription: '🎯 稀缺辨識者 · 出任務\n\n這週，在生活中找到你看到的 3 個「稀缺」案例（可以是颱風菜、限量球鞋、抽卡盲盒，也可以是其他生活情境）。\n\n針對每個「稀缺」，回答這 3 個問題：\n\n1️⃣ 這個東西的「少」是真的少，還是被設計的？（可以拍照、畫圖、或文字描述）\n\n2️⃣ 如果它不限量了，我還會想要嗎？\n\n3️⃣ 我為什麼想要它？是因為東西本身，還是「再不買就沒了」的感覺？\n  □ 因為東西本身真的解決我的需求\n  □ 因為「再不買就沒了」的感覺\n  □ 兩者都有一點\n  □ 其實買完之後我也不太用',
    quizType: 'multiple',
    quizQuestions: [
      { id: 1, block: '基礎記憶', question: '稀缺性（Scarcity）的意思最接近哪一個？', options: ['東西很貴', '想要的人多、能拿到的人少', '東西很便宜', '東西很多人在賣'], answer: '想要的人多、能拿到的人少', explanation: '稀缺性的核心就是「想要的人多，但能拿到的人少」，這會讓價格上升。' },
      { id: 2, block: '基礎記憶', question: '「真實稀缺」是哪一種少？', options: ['品牌故意做少的', '大自然或物理上真的少', '老闆想多賣錢的', '只有今天少的'], answer: '大自然或物理上真的少', explanation: '真實稀缺是地球科學或時間累積造成的，不是人為決定。例如鑽石、翠玉白菜。' },
      { id: 3, block: '基礎記憶', question: 'FOMO 的中文意思是什麼？', options: ['限量倒數', '害怕錯過的恐懼', '免費試用', '快速消費'], answer: '害怕錯過的恐懼', explanation: 'FOMO 是 Fear Of Missing Out 的縮寫，中文是「害怕錯過的恐懼」，常被用來推動衝動消費。' },
      { id: 4, block: '基礎理解', question: '小明看到一款限量球鞋，全台只賣 200 雙，但他知道工廠一週可以做 1 萬雙。這比較像哪種稀缺？', options: ['真實稀缺', '行銷稀缺', '時間稀缺到無法生產', '沒有稀缺'], answer: '行銷稀缺', explanation: '工廠明明做得出來更多，但品牌「故意」只賣 200 雙——這是被設計出來的少，屬於行銷稀缺。' },
      { id: 5, block: '基礎理解', question: '颱風後高麗菜從 50 元漲到 200 元，這比較像哪種情況？', options: ['行銷稀缺，商家故意漲價', '真實稀缺，菜真的變少了', '雙重巧合，大家都想要', '沒有稀缺，只是恰好'], answer: '真實稀缺，菜真的變少了', explanation: '颱風摧毀菜園，供給真的減少，這不是任何商家設計的，而是大自然造成的真實稀缺。' },
      { id: 6, block: '基礎理解', question: '故宮的翠玉白菜為什麼是真實稀缺？', options: ['因為很多人想要', '因為它無法被複製或量產', '因為政府規定不能賣', '因為太貴沒人買'], answer: '因為它無法被複製或量產', explanation: '翠玉白菜全世界只有那一顆，沒有辦法再做出一模一樣的，這就是時間累積的真實稀缺。' },
      { id: 7, block: '基礎理解', question: '小華看到「限時 24 小時！最後 3 件！」就馬上買了。等貨到的時候，他覺得「好像沒有那麼想要」。這最接近哪種狀況？', options: ['真的需要，只是貨慢了', '被 FOMO 推動的衝動消費', '價格不夠便宜', '貨品本身有問題'], answer: '被 FOMO 推動的衝動消費', explanation: '當下被「再不買就沒了」的恐懼推動，並不是真的想要——這就是 FOMO 造成的衝動消費。' },
      { id: 8, block: '實際應用', question: '你看到一款偶像專輯，小卡是隨機附的，你想要的成員需要買 8 張才有可能抽到。Tiffany 老師會建議你問自己什麼問題？', options: ['這 8 張我都喜歡聽嗎，還是只是想抽到那張卡？', '這個品牌有名嗎？', '這張卡會不會升值？', '我朋友都有買嗎？'], answer: '這 8 張我都喜歡聽嗎，還是只是想抽到那張卡？', explanation: '老師教的問題是「我多付的錢，是物品本身的價值，還是稀缺感？」想清楚才不會被機率設計推著重複消費。' },
      { id: 9, block: '實際應用', question: '小美看到「雙11限定下殺」覺得很心動。她可以用哪個問題來判斷要不要買？', options: ['「這個商品在平常時間還買得到嗎？」', '「我朋友會買嗎？」', '「這牌子有名嗎？」', '「我可以借錢買嗎？」'], answer: '「這個商品在平常時間還買得到嗎？」', explanation: '雙11是「時間稀缺」的行銷設計。如果平常也買得到，只是價格不同，那「現在不買就沒了」就不是真的——這個問題能讓你冷靜下來。' },
      { id: 10, block: '實際應用', question: '小李很想買一個限量手錶，他想起了 W5 學到的「想要 vs 需要」和 W6 學到的「真實 vs 行銷稀缺」。他應該怎麼判斷？', options: ['只要是想要的就不該買', '先問自己「這是想要還是需要」，再問「這個少是真的還是被設計的」', '看價格決定就好', '看朋友有沒有'], answer: '先問自己「這是想要還是需要」，再問「這個少是真的還是被設計的」', explanation: 'W5 教你分辨想要 vs 需要，W6 教你分辨真實 vs 行銷稀缺——兩個工具一起用，才能做出最清楚的判斷。' },
    ],
  },
};

// ==================
// 選擇題元件
// ==================
function MultipleChoiceQuestion({ q, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const isCorrect = selected === q.answer;

  const handleConfirm = () => {
    if (!selected) return;
    setRevealed(true);
    setTimeout(() => onAnswer(q.id, isCorrect), 900);
  };

  return (
    <div className={`rounded-xl border-2 p-4 transition-all ${
      revealed
        ? isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
        : 'border-border bg-card'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-semibold">{q.block}</span>
        <span className="text-xs text-muted-foreground">Q{q.id}</span>
      </div>
      <p className="text-sm font-bold text-foreground leading-snug mb-3">{q.question}</p>
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          const isSelected = selected === opt;
          const isOptCorrect = opt === q.answer;
          let style = 'border-border bg-card text-foreground';
          if (revealed) {
            if (isOptCorrect) style = 'border-green-500 bg-green-50 text-green-800';
            else if (isSelected && !isOptCorrect) style = 'border-red-400 bg-red-50 text-red-700';
          } else if (isSelected) {
            style = 'border-foreground bg-foreground text-background';
          }
          return (
            <button
              key={opt}
              onClick={() => !revealed && setSelected(opt)}
              className={`w-full text-left rounded-xl border-2 px-3 py-2 text-sm font-medium transition-all ${style}`}
            >
              <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
            </button>
          );
        })}
      </div>
      {!revealed && selected && (
        <Button onClick={handleConfirm} className="w-full mt-3" size="sm">確認答案</Button>
      )}
      {revealed && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs text-slate-600 leading-relaxed"
        >
          {isCorrect ? '✓ ' : '✗ '}{q.explanation}
        </motion.p>
      )}
    </div>
  );
}

// ==================
// 主頁面
// ==================
export default function WeekLearning() {
  const { weekNumber } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const weekNum = parseInt(weekNumber);
  const weekData = WEEK_DATA[weekNum];

  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  // 練習題狀態
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizAllCorrect, setQuizAllCorrect] = useState(false);

  // 開放題狀態（Week 5+）
  const [openAnswer, setOpenAnswer] = useState('');
  const [submittingOpen, setSubmittingOpen] = useState(false);

  // 任務狀態
  const [taskText, setTaskText] = useState('');
  const [taskImages, setTaskImages] = useState([]);
  const [uploadingTask, setUploadingTask] = useState(false);

  // 禮物揭曉
  const [revealing, setRevealing] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const openAnswerRef = useRef(null);
  const taskRef = useRef(null);

  // 載入進度
  useEffect(() => {
    if (!user || !weekNum) return;
    const load = async () => {
      setLoading(true);
      const p = await getOrCreateProgress(user.uid, weekNum);
      setProgress(p);
      setLoading(false);
    };
    load();
  }, [user, weekNum]);

  if (!weekData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-4xl">🔒</div>
          <p className="font-black text-foreground">這週的內容還沒開放</p>
          <button onClick={() => navigate('/Home')} className="text-sm text-muted-foreground underline">回到首頁</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  // 答題處理
  const handleQuizAnswer = async (questionId, correct) => {
    const newAnswers = { ...quizAnswers, [questionId]: correct };
    setQuizAnswers(newAnswers);

    const quizCount = weekData.quizQuestions.length;
    const answeredAll = Object.keys(newAnswers).length === quizCount;
    const allCorrect = Object.values(newAnswers).every(Boolean);

    if (answeredAll && allCorrect) {
      setQuizAllCorrect(true);
      if (!progress?.quizCompleted) {
        await markQuizCompleted(user.uid, weekNum);
        setProgress((prev) => ({ ...prev, quizCompleted: true }));
      }
      // W1-W4：答對之後不再自動滾動 — 孩子先看到「等老師審核」的訊息
      // W5+：滾動到開放題
      if (weekData.hasOpenQuestion) {
        setTimeout(() => {
          openAnswerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
      }
    }
  };

  const handleRetryQuiz = () => {
    setQuizAnswers({});
    setQuizAllCorrect(false);
  };

  // 提交開放題（Week 5+）
  const handleSubmitOpen = async () => {
    if (openAnswer.trim().length < 30) return;
    setSubmittingOpen(true);
    await submitOpenAnswer(user.uid, weekNum, openAnswer.trim());
    setProgress((prev) => ({
      ...prev,
      openAnswerContent: openAnswer.trim(),
      openAnswerSubmittedAt: new Date(),
    }));
    setSubmittingOpen(false);
  };

  // 圖片上傳
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (taskImages.length + files.length > 3) { alert('最多上傳 3 張圖片'); return; }
    const validFiles = files.filter((f) => {
      if (f.size > 5 * 1024 * 1024) { alert(`${f.name} 超過 5MB 限制`); return false; }
      return true;
    });
    setTaskImages((prev) => [...prev, ...validFiles]);
  };

  // 提交任務
  const handleSubmitTask = async () => {
    if (taskText.trim().length < 50) return;
    setUploadingTask(true);
    try {
      const imageUrls = await Promise.all(
        taskImages.map(async (file) => {
          const timestamp = Date.now();
          const storageRef = ref(storage, `submissions/${user.uid}/week-${weekNum}/${timestamp}_${file.name}`);
          await uploadBytes(storageRef, file);
          return getDownloadURL(storageRef);
        })
      );
      await submitTask(user.uid, weekNum, taskText.trim(), imageUrls);
      setProgress((prev) => ({
        ...prev,
        taskText: taskText.trim(),
        taskImageUrls: imageUrls,
        taskSubmittedAt: new Date(),
      }));
    } catch (err) {
      console.error('提交失敗', err);
      alert('上傳失敗，請再試一次');
    }
    setUploadingTask(false);
  };

  // 揭曉禮物
  const handleReveal = async () => {
    setRevealing(true);
    await revealTask(user.uid, weekNum);
    setTimeout(() => {
      setRevealing(false);
      setRevealed(true);
      setProgress((prev) => ({ ...prev, taskRevealed: true }));
    }, 2000);
  };

  // 判斷各區段狀態
  const quizDone = progress?.quizCompleted || quizAllCorrect;

  // W1-W4：練習題審核過（badgeEarned）後才能提交任務
  // W5+：開放題審核過（openAnswerSeenAt）後才能提交任務
  const canSubmitTask = weekData.hasOpenQuestion
    ? !!progress?.openAnswerSeenAt
    : !!progress?.badgeEarned;

  const openState = !weekData.hasOpenQuestion
    ? 'no-open'
    : progress?.openAnswerSeenAt
    ? 'badge-earned'
    : progress?.openAnswerSubmittedAt
    ? 'open-submitted'
    : quizDone
    ? 'open-pending'
    : 'locked';

  const taskState = progress?.taskApprovedAt
    ? (progress?.taskRevealed || revealed ? 'card-revealed' : 'approved')
    : progress?.taskSubmittedAt
    ? 'task-submitted'
    : canSubmitTask
    ? 'task-pending'
    : 'locked';

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/Home')} className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <p className="text-xs text-muted-foreground">{weekData.title}</p>
            <p className="text-sm font-black text-foreground leading-snug">{weekData.question}</p>
          </div>
        </div>

        {/* ==================
            練習題區
        ================== */}
        <div className="bg-card border-2 border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-foreground">🟦 練習題</h2>
            {quizDone && (
              <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-1 rounded-full">
                ✓ 完成
              </span>
            )}
          </div>

          {/* 還沒完成 */}
          {!quizDone && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                {weekData.quizQuestions.length} 題選擇題，全對才能繼續 ✓
              </p>
              {weekData.quizQuestions.map((q) => (
                <MultipleChoiceQuestion
                  key={q.id}
                  q={q}
                  onAnswer={handleQuizAnswer}
                />
              ))}
              {Object.keys(quizAnswers).length === weekData.quizQuestions.length && !quizAllCorrect && (
                <div className="text-center pt-2 space-y-3">
                  <p className="text-sm text-red-500">有幾題答錯了，再想想看！</p>
                  <Button onClick={handleRetryQuiz} variant="outline" className="w-full">🔁 重新挑戰</Button>
                </div>
              )}
            </div>
          )}

          {/* 完成狀態 */}
          {quizDone && (
            <>
              {/* W1-W4：答對後等審核 */}
              {!weekData.hasOpenQuestion && !progress?.badgeEarned && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center space-y-2">
                  <div className="text-2xl">⏳</div>
                  <p className="text-sm font-bold text-amber-700">練習題全部答對！</p>
                  <p className="text-xs text-amber-600">等待老師看見...</p>
                  <p className="text-xs text-amber-600">老師審核後徽章會亮起，你就可以開始本週任務</p>
                </div>
              )}

              {/* W1-W4：徽章已獲得 */}
              {!weekData.hasOpenQuestion && progress?.badgeEarned && (
                <div className="bg-violet-50 border-2 border-violet-200 rounded-xl p-4 text-center space-y-2">
                  <div className="text-3xl">🏅</div>
                  <p className="text-sm font-black text-violet-700">老師看見你了！徽章已亮起</p>
                  {progress?.encouragementMessage && (
                    <p className="text-sm text-violet-600 italic">「{progress.encouragementMessage}」</p>
                  )}
                  <p className="text-xs text-violet-600 mt-2">繼續完成下方的任務吧！</p>
                </div>
              )}

              {/* W5：保留原本訊息（會跳到開放題） */}
              {weekData.hasOpenQuestion && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                  <p className="text-sm font-bold text-green-700">🎉 練習題全部答對！</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* ==================
            開放題區（Week 5+ 才有）
        ================== */}
        {weekData.hasOpenQuestion && openState !== 'locked' && (
          <div ref={openAnswerRef} className="bg-card border-2 border-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-foreground">🟩 開放題</h2>
              {openState === 'badge-earned' && (
                <span className="text-xs bg-violet-100 text-violet-700 font-bold px-2 py-1 rounded-full">🏅 徽章已獲得</span>
              )}
            </div>

            <p className="text-sm font-bold text-foreground leading-relaxed">
              {weekData.openQuestion}
            </p>

            {/* 等待輸入 */}
            {openState === 'open-pending' && (
              <div className="space-y-3">
                <textarea
                  value={openAnswer}
                  onChange={(e) => setOpenAnswer(e.target.value)}
                  placeholder="請寫下你的想法（至少 30 字）..."
                  rows={5}
                  className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-foreground resize-none leading-relaxed"
                />
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${openAnswer.trim().length >= 30 ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {openAnswer.trim().length} / 30 字
                  </span>
                  <Button onClick={handleSubmitOpen} disabled={openAnswer.trim().length < 30 || submittingOpen} className="px-6">
                    {submittingOpen ? '提交中...' : '提交 →'}
                  </Button>
                </div>
              </div>
            )}

            {/* 等老師看 */}
            {openState === 'open-submitted' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center space-y-2">
                <div className="text-2xl">⏳</div>
                <p className="text-sm font-bold text-amber-700">等待老師看見...</p>
                <p className="text-xs text-amber-600">老師會在 1–3 天內回應</p>
              </div>
            )}

            {/* 老師已看見 */}
            {openState === 'badge-earned' && (
              <div className="space-y-3">
                <div className="bg-violet-50 border-2 border-violet-200 rounded-xl p-4 text-center space-y-2">
                  <div className="text-3xl">🏅</div>
                  <p className="text-sm font-black text-violet-700">老師看見你了！</p>
                  {progress?.encouragementMessage && (
                    <p className="text-sm text-violet-600 italic">「{progress.encouragementMessage}」</p>
                  )}
                </div>
                <div className="bg-muted/50 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground font-semibold mb-1">你的回答</p>
                  <p className="text-sm text-foreground leading-relaxed">{progress?.openAnswerContent}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================
            任務區
        ================== */}
        <div ref={taskRef} className="bg-card border-2 border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-foreground">🟨 {weekData.taskTitle}</h2>
            {taskState === 'card-revealed' && (
              <span className="text-xs bg-teal-100 text-teal-700 font-bold px-2 py-1 rounded-full">🎴 卡片已獲得</span>
            )}
          </div>

          <div className="bg-muted/40 rounded-xl p-4">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{weekData.taskDescription}</p>
          </div>

          {/* 鎖住 */}
          {taskState === 'locked' && (
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">
                {weekData.hasOpenQuestion 
                  ? '完成開放題並等老師回應後，才能提交任務' 
                  : '練習題審核通過、徽章亮起後，才能開始本週任務'}
              </p>
            </div>
          )}

          {/* 等待提交 */}
          {taskState === 'task-pending' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">你的任務記錄</label>
                <textarea
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  placeholder="描述你觀察或完成的內容（至少 50 字）..."
                  rows={5}
                  className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-foreground resize-none leading-relaxed"
                />
                <span className={`text-xs ${taskText.trim().length >= 50 ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {taskText.trim().length} / 50 字
                </span>
              </div>

              {/* 圖片上傳 */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">附上照片（最多 3 張，選填）</label>
                <div className="flex flex-wrap gap-2">
                  {taskImages.map((file, idx) => (
                    <div key={idx} className="relative">
                      <img src={URL.createObjectURL(file)} alt={`預覽 ${idx + 1}`} className="w-20 h-20 object-cover rounded-xl border border-border" />
                      <button onClick={() => setTaskImages((prev) => prev.filter((_, i) => i !== idx))} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {taskImages.length < 3 && (
                    <label className="w-20 h-20 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-foreground transition-colors">
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-1">上傳</span>
                      <input type="file" accept="image/jpeg,image/png" multiple className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
              </div>

              <Button onClick={handleSubmitTask} disabled={taskText.trim().length < 50 || uploadingTask} className="w-full">
                {uploadingTask ? '上傳中...' : '提交任務 →'}
              </Button>
            </div>
          )}

          {/* 等待審核 */}
          {taskState === 'task-submitted' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center space-y-2">
              <div className="text-2xl">⏳</div>
              <p className="text-sm font-bold text-amber-700">等待老師回饋...</p>
              <p className="text-xs text-amber-600">老師審核後會有禮物給你</p>
            </div>
          )}

          {/* 可以拆禮物 */}
          {taskState === 'approved' && (
            <div className="text-center space-y-4">
              <motion.button
                onClick={handleReveal}
                disabled={revealing}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-gradient-to-r from-amber-400 to-orange-400 text-white font-black text-lg rounded-2xl py-5 shadow-lg"
              >
                {revealing ? '✨ 打開中...' : '老師有禮物給你 🎁'}
              </motion.button>
              {revealing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl">
                  ✨ 🎁 ✨
                </motion.div>
              )}
            </div>
          )}

          {/* 已揭曉 */}
          {taskState === 'card-revealed' && (
            <div className="space-y-3">
              <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-4 text-center space-y-2">
                <div className="text-3xl">🎴</div>
                <p className="text-sm font-black text-teal-700">任務完成！卡片已解鎖！</p>
              </div>
              {progress?.taskFeedback && (
                <div className="bg-muted/50 rounded-xl p-4 space-y-1">
                  <p className="text-xs text-muted-foreground font-semibold">老師的回饋</p>
                  <p className="text-sm text-foreground leading-relaxed">{progress.taskFeedback}</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}