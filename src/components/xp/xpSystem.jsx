// Concept XP 系統 — 全部本地邏輯，不使用 AI

export const XP_PER_CORRECT = 10;
export const XP_MAX_PER_GROUP = 300;

export const XP_LEVELS = [
  { level: 1, label: "思考新手", emoji: "🌱", minXP: 0 },
  { level: 2, label: "概念觀察者", emoji: "👀", minXP: 50 },
  { level: 3, label: "概念分析者", emoji: "🔍", minXP: 100 },
  { level: 4, label: "思考能量高手", emoji: "⚡", minXP: 180 },
  { level: 5, label: "財商思考大師", emoji: "🏆", minXP: 260 },
];

export const getTotalXP = (progressData) =>
  progressData.reduce((sum, p) => sum + (p.correct_answers || 0) * XP_PER_CORRECT, 0);

export const getGroupXP = (progressRecord) =>
  (progressRecord?.correct_answers || 0) * XP_PER_CORRECT;

export const getLevelInfo = (totalXP) => {
  let current = XP_LEVELS[0];
  for (const lvl of XP_LEVELS) {
    if (totalXP >= lvl.minXP) current = lvl;
  }
  const nextIdx = XP_LEVELS.indexOf(current) + 1;
  const next = XP_LEVELS[nextIdx] || null;
  return { current, next };
};

export const getEncouragement = (groupLabel, correct, total, prevCorrect) => {
  const rate = total > 0 ? Math.round((correct / total) * 100) : 0;
  const gained = (correct - (prevCorrect || 0)) * XP_PER_CORRECT;
  const messages = [];

  if (gained > 0) messages.push(`你在「${groupLabel}」的概念區辨力正在進步！`);
  if (rate >= 80) messages.push("答題正確率超過 80%，你快變成概念小老師了！");
  else if (rate >= 60) messages.push("不錯！繼續練習，概念會越來越清晰！");
  else messages.push("多練幾次，這組概念很快就會變成你的強項！");

  return messages;
};