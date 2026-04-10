/**
 * 概念區辨訓練器 — 題目層級標籤系統
 * ================================================
 * 每一題請加入 "level" 欄位，使用以下三種值：
 *
 *   "direct"  — 直接辨識題（建議佔 40%）
 *   "context" — 情境判斷題（建議佔 40%）
 *   "concept" — 概念理解題（建議佔 20%）
 *
 * ================================================
 * 各層級定義與範例
 * ================================================
 *
 * Level 1 — direct（直接辨識）
 *   定義：給出一個具體事物或描述，學生直接辨識屬於哪個概念。
 *   重點：題目不帶情境條件，考驗基礎認識。
 *   範例：
 *     {
 *       "level": "direct",
 *       "question": "「標價 300 元」比較接近價格還是價值？",
 *       "options": ["價格", "價值"],
 *       "answer": "價格",
 *       "explanation": "標示在商品上的數字金額就是「價格」。"
 *     }
 *
 * Level 2 — context（情境判斷）
 *   定義：給出一個生活情境，學生需根據情境條件做出判斷，
 *         同一樣東西在不同情境下答案可能不同。
 *   重點：題目帶有「已經有／還沒有／壞掉了」等情境條件。
 *   範例：
 *     {
 *       "level": "context",
 *       "question": "小明已經有三雙球鞋，還想再買一雙限量款，這比較接近？",
 *       "options": ["需要", "喜歡"],
 *       "answer": "喜歡",
 *       "explanation": "已經有足夠可以穿的鞋子，再買限量款比較接近個人喜好。"
 *     }
 *
 * Level 3 — concept（概念理解）
 *   定義：用一句話或一個說法來測試學生是否真正理解概念的本質，
 *         通常考驗概念之間的關係或邊界。
 *   重點：題目通常是「這句話在說什麼？」或「以下哪一個說法正確？」
 *   範例：
 *     {
 *       "level": "concept",
 *       "question": "「這東西雖然貴，但很值得」是在說什麼？",
 *       "options": ["價值高於價格", "價格高於價值"],
 *       "answer": "價值高於價格",
 *       "explanation": "「值得」表示得到的好處超過付出的金額，是在說價值高於價格。"
 *     }
 *
 * ================================================
 * 每組 20 題建議配比（可彈性調整）
 * ================================================
 *   direct:  8 題（40%）
 *   context: 8 題（40%）
 *   concept: 4 題（20%）
 *
 * ================================================
 * 新增題目規則
 * ================================================
 * 1. 每一題必須包含 "level" 欄位
 * 2. context 題必須帶有具體情境條件
 *    ✅ 「已經有三雙鞋，還想買...」
 *    ✅ 「雨傘昨天壞掉了，今天下雨...」
 *    ❌ 「買一雙新鞋，這是需要還是喜歡？」（沒有情境，應歸為 direct）
 * 3. concept 題應考驗概念邊界或關係
 *    ✅ 「以下哪一句最符合資產的定義？」
 *    ✅ 「為什麼同一件東西，有人覺得值得，有人覺得不值得？」
 * 4. explanation 字數控制在 30 字以內，適合 10–15 歲閱讀
 */

// 層級常數，可用於篩題
export const LEVELS = {
  DIRECT: "direct",
  CONTEXT: "context",
  CONCEPT: "concept"
};

// 各層級建議比例
export const LEVEL_RATIO = {
  direct: 0.4,
  context: 0.4,
  concept: 0.2
};

// 層級顯示名稱（中文）
export const LEVEL_LABELS = {
  direct: "直接辨識",
  context: "情境判斷",
  concept: "概念理解"
};

// 層級顏色（對應 Tailwind class）
export const LEVEL_COLORS = {
  direct: "bg-blue-100 text-blue-700",
  context: "bg-orange-100 text-orange-700",
  concept: "bg-purple-100 text-purple-700"
};

/**
 * 工具函式：依層級篩選題目
 * @param {Array} questions - 題目陣列
 * @param {string} level - "direct" | "context" | "concept"
 */
export const filterByLevel = (questions, level) =>
  questions.filter(q => q.level === level);

/**
 * 工具函式：統計一組題庫的層級分布
 * @param {Array} questions - 題目陣列
 * @returns {{ direct: number, context: number, concept: number, unlabeled: number }}
 */
export const getLevelStats = (questions) => {
  const stats = { direct: 0, context: 0, concept: 0, unlabeled: 0 };
  questions.forEach(q => {
    if (q.level in stats) stats[q.level]++;
    else stats.unlabeled++;
  });
  return stats;
};