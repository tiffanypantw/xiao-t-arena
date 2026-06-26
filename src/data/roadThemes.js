// 加購主題課的「學習道路」資料（逐週 Bloom 堆疊 × 我能）
// 取自 bible《L1-L2 加購主題課 逐週 Bloom 堆疊》。練習題之後逐週長上去。

export const ROAD_THEMES = {
  "l1-g1": {
    band: "L1 體驗",
    emoji: "🟢",
    themeName: "G1 價值與交換",
    coreQ: "什麼叫有價值？為什麼有人願意付錢？",
    milestone: "第一張價值地圖",
    weeks: [
      { n: 1, bloom: "記憶", topic: "什麼是「價值」", iCan: "我能說出「價值」是「它幫我解決／滿足了什麼」。", act: "配對：價值/價格/交換/稀缺 ↔ 圖" },
      { n: 2, bloom: "記憶", topic: "價格 vs 價值", iCan: "我能分辨「價格＝付出去的錢」「價值＝它對我的意義」。", act: "選擇：這句在講價格還是價值？" },
      { n: 3, bloom: "記憶", topic: "稀缺與交換", iCan: "我能說出「稀缺＝要的人多、東西少」「交換＝用我有的換我要的」。", act: "找找看：生活中一樣稀缺的東西" },
      { n: 4, bloom: "理解", topic: "為什麼有人願意付錢", iCan: "我能解釋一樣東西「解決了什麼／滿足了什麼」才有人付錢。", act: "舉例：寫一樣有價值的東西+它解決什麼" },
      { n: 5, bloom: "理解", topic: "價值因人而異", iCan: "我能舉例說明「同一個東西對不同人價值不同」。", act: "解釋：一瓶水在超商 vs 在沙漠" },
      { n: 6, bloom: "理解", topic: "稀缺如何推高價值", iCan: "我能用例子解釋「越稀缺、越多人要，越貴」。", act: "預測：限量球鞋為什麼貴？" },
      { n: 7, bloom: "理解→應用", topic: "實際 vs 感覺價值", iCan: "我能分辨一個價格裡多少是「真解決問題」、多少是「感覺/品牌」。", act: "情境入門：拆一個價格的兩種價值" },
      { n: 8, bloom: "應用", topic: "用價值評估購買", iCan: "我能對一項購買說出「我願意付多少、為什麼」。", act: "情境：手搖飲 50 元你願付多少？" },
      { n: 9, bloom: "應用", topic: "比較兩個價格", iCan: "我能比較兩樣價格不同的東西，貴的多解決了什麼。", act: "比較：30 vs 80 元雨傘" },
      { n: 10, bloom: "應用", topic: "找出「值得」的證據", iCan: "我能為「值得／不值得」找出能說服人的理由。", act: "判斷+寫理由：你會買嗎？" },
      { n: 11, bloom: "應用→分析", topic: "我生活裡的價值盤點", iCan: "我能找出生活中最有價值的 5 樣東西並分析各解決什麼。", act: "上傳：拍 5 樣+分析" },
      { n: 12, bloom: "里程碑", topic: "第一張價值地圖", iCan: "我能把價值盤點畫成一張價值地圖並說明。", act: "里程碑作品：價值地圖（上傳批改）" },
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
  if (b.includes("里程碑")) return "mile";
  if (b.startsWith("應用")) return "app";
  if (b.startsWith("理解")) return "und";
  return "rem";
}
export const bloomColor = (b) => BLOOM[bloomKey(b)].color;
export const bloomLabel = (k) => BLOOM[k].label;
export const BLOOM_STAGES = ["rem", "und", "app", "mile"].map((k) => ({ key: k, ...BLOOM[k] }));
