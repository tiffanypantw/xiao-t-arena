// 加購主題課的「學習道路」資料
// 2026-07-10:原本的 G1「價值與交換」換成新課程「我的零用錢,我作主(第一季)」。
// themeId 沿用 "l1-g1"(路由、已開通的帳號都不用動),但名稱、內容、開通碼 prefix 都是新的。
//
// 每一關的欄位:
//   n          — 道路上的第幾關(學生看到的 W{n})
//   weekNumber — 對應 weeks collection 的系統編號(道路週 = 100 + n),有內容才填
//   badgeId    — 這一關的徽章 rewardId(用來判斷「已完成」+ 解鎖下一關)
//   bloom      — Bloom 階段(記憶/理解/應用/里程碑),還沒公開的關卡不填
//   mystery    — true = 內容還沒公開,道路上顯示「?」
//
// 之後每上架一關,就把那一關的 mystery 拿掉、補上 topic/iCan/weekNumber/badgeId。

export const ROAD_THEMES = {
  "l1-g1": {
    band: "L1 體驗",
    bandId: "l1",
    emoji: "💰",
    themeName: "我的零用錢,我作主",
    season: "第一季",
    coreQ: "零用錢在我手上 — 每一筆,我都能自己想清楚、自己作主嗎?",
    milestone: "12 關陸續公開",
    weeks: [
      {
        n: 1,
        weekNumber: 101,
        badgeId: "B-L1S1-W01",
        bloom: "記憶",
        topic: "新鮮感觀察員",
        sub: "新鮮感的保存期限",
        iCan: "我能幫「超想要」量體溫,說出新鮮感會退燒、每樣東西的保存期限不一樣。",
        act: "10 題概念練習 + 新鮮感追蹤卡任務",
      },
      {
        n: 2,
        weekNumber: 102,
        badgeId: "B-L1S1-W02",
        bloom: "記憶",
        topic: "購物車守門員",
        sub: "購物車裡的偷渡客",
        iCan: "我能分清楚需要和想要,把想買的東西分上需求金字塔,用守門員三問抓出購物車裡的偷渡客。",
        act: "10 題概念練習 + 購物車守門卡任務",
      },
      { n: 3, mystery: true },
      { n: 4, mystery: true },
      { n: 5, mystery: true },
      { n: 6, mystery: true },
      { n: 7, mystery: true },
      { n: 8, mystery: true },
      { n: 9, mystery: true },
      { n: 10, mystery: true },
      { n: 11, mystery: true },
      { n: 12, mystery: true },
    ],
  },
  // 2026-07-11:L2 第一季「商業與市場」。道路週編號 = 200 + n(週 doc 201–212)。
  "l2-s1": {
    band: "L2 創造",
    bandId: "l2",
    emoji: "🏷️",
    themeName: "商業與市場",
    season: "第一季",
    coreQ: "每個價格背後都有一個市場 — 誰在買?誰在賣?規則是誰定的?",
    milestone: "12 關陸續公開",
    weeks: [
      {
        n: 1,
        weekNumber: 201,
        badgeId: "B-L2Q1-W01",
        bloom: "記憶",
        topic: "價格偵探",
        sub: "市場怎麼定價",
        iCan: "我能辨認價格是買方與賣方共同決定的,看到任何標價會先問:這個價格怎麼來的?",
        act: "10 題概念練習 + 開放題 + 三價偵探表任務",
      },
      {
        n: 2,
        weekNumber: 202,
        badgeId: "B-L2Q1-W02",
        bloom: "記憶",
        topic: "套路獵人",
        sub: "想要是被設計的",
        iCan: "我能看出廣告怎麼把「想要」包裝成「需要」,心動的瞬間先問:它按了我哪顆按鈕?",
        act: "10 題概念練習 + 開放題 + 心動拆解表任務",
      },
      { n: 3, mystery: true },
      { n: 4, mystery: true },
      { n: 5, mystery: true },
      { n: 6, mystery: true },
      { n: 7, mystery: true },
      { n: 8, mystery: true },
      { n: 9, mystery: true },
      { n: 10, mystery: true },
      { n: 11, mystery: true },
      { n: 12, mystery: true },
    ],
  },
  // 2026-07-11:L3 第一季「投資與理財規劃」。道路週編號 = 300 + n(週 doc 301–312)。
  "l3-s1": {
    band: "L3 資本",
    bandId: "l3",
    emoji: "⚖️",
    themeName: "投資與理財規劃",
    season: "第一季",
    coreQ: "花錢看現在,投資看未來 — 同一筆錢,我能不能替它排出最好的一條路?",
    milestone: "12 關陸續公開",
    weeks: [
      {
        n: 1,
        weekNumber: 301,
        badgeId: "B-L3S1-W01",
        bloom: "記憶",
        topic: "投資價值鑑定者",
        sub: "價值與投資價值",
        iCan: "我能用價值、價格、機會成本分析任何一個花費或選擇是否划算。",
        act: "10 題概念練習 + 論證題 + 真實預算任務",
      },
      {
        n: 2,
        weekNumber: 302,
        badgeId: "B-L3S1-W02",
        bloom: "記憶",
        topic: "財務邊界設計師",
        sub: "慾望、價值觀與財務邊界",
        iCan: "我能覺察我的慾望從哪來,在冷靜時替心動的自己訂下金錢界線並守住它。",
        act: "10 題概念練習 + 論證題 + 3 條金錢界線任務",
      },
      { n: 3, mystery: true },
      { n: 4, mystery: true },
      { n: 5, mystery: true },
      { n: 6, mystery: true },
      { n: 7, mystery: true },
      { n: 8, mystery: true },
      { n: 9, mystery: true },
      { n: 10, mystery: true },
      { n: 11, mystery: true },
      { n: 12, mystery: true },
    ],
  },
};

export const getRoadTheme = (id) => ROAD_THEMES[id];

const BLOOM = {
  rem: { label: "記憶", color: "#E0892F" },
  und: { label: "理解", color: "#2F9E7E" },
  app: { label: "應用", color: "#3E7BD0" },
  mile: { label: "里程碑", color: "#B8862B" },
};

export function bloomKey(b) {
  if (!b) return null;
  if (b.includes("里程碑")) return "mile";
  if (b.startsWith("應用")) return "app";
  if (b.startsWith("理解")) return "und";
  return "rem";
}
export const bloomColor = (b) => (bloomKey(b) ? BLOOM[bloomKey(b)].color : "#B9B3C6");
export const bloomLabel = (k) => BLOOM[k].label;
export const BLOOM_STAGES = ["rem", "und", "app", "mile"].map((k) => ({ key: k, ...BLOOM[k] }));
