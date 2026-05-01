// 後台管理員白名單
export const ADMIN_EMAILS = [
  "tiffanypantw@gmail.com",
];

// 鼓勵語：練習題全對版（W1–W4 選擇題，鼓勵思辨/判斷/堅持）
export const ENCOURAGEMENT_MESSAGES_QUIZ = [
  "你都答對了，看得出有認真讀 📖",
  "這 10 題你穩穩走完了 🎯",
  "一題一題判斷，這就是思考的樣子 🌱",
  "你的判斷力越來越穩了 💪",
  "你願意慢慢想，不急著選 🕯️",
  "答對不是運氣，是你看懂了 ✨",
  "老師看到你沒放棄，全部做完了 🧡",
  "你的思考有自己的節奏，很好 🍃",
  "這週的觀念被你接住了 🤲",
  "下一週也會這樣穩穩走的 🌈",
];

// 鼓勵語：開放題版（W5+ 觀察寫作，鼓勵觀察/表達/感受）
export const ENCOURAGEMENT_MESSAGES_OPEN = [
  "你的觀察很細心 ✨",
  "這個想法很有趣 🌱",
  "老師看到你的努力了 💛",
  "你提的問題很有深度 🔍",
  "你開始看到不一樣的東西了 👀",
  "這個連結很厲害 🔗",
  "你願意停下來想，這就是力量 🌟",
  "老師也從你的觀察中學到東西 🎁",
  "這個視角讓我想了很久 💭",
  "期待你下週帶更多觀察回來 🌈",
];

// 根據週次自動回傳對應的鼓勵語清單
export const getEncouragementMessages = (weekNumber) => {
  return weekNumber <= 4
    ? ENCOURAGEMENT_MESSAGES_QUIZ
    : ENCOURAGEMENT_MESSAGES_OPEN;
};

// 向後相容：保留舊的 ENCOURAGEMENT_MESSAGES（指向開放題版）
export const ENCOURAGEMENT_MESSAGES = ENCOURAGEMENT_MESSAGES_OPEN;