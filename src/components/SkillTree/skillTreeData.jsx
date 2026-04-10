import fullQuestionBank from '@/components/qbank';

export const UNLOCK_MIN_ATTEMPTS = 10;
export const UNLOCK_MIN_ACCURACY = 0.7;

export const SKILL_TREE = [
  {
    level: 1,
    title: "Level 1",
    subtitle: "基礎判斷",
    mission: "先分清楚什麼是需要、喜歡、價值與價格",
    color: "from-orange-400 to-amber-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-600",
    emoji: "🌱",
    nodes: ["need_vs_like", "value_vs_price"]
  },
  {
    level: 2,
    title: "Level 2",
    subtitle: "交換與流動",
    mission: "開始理解交換、金錢與日常花費的差別",
    color: "from-green-400 to-emerald-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-600",
    emoji: "🔄",
    nodes: ["exchange_vs_money", "spending_vs_consumption", "budget_vs_saving_vs_record"]
  },
  {
    level: 3,
    title: "Level 3",
    subtitle: "收入與形式",
    mission: "開始理解收入怎麼來，收入形式有什麼不同",
    color: "from-blue-400 to-cyan-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-600",
    emoji: "💰",
    nodes: ["income_vs_value_exchange", "active_vs_passive_income"]
  },
  {
    level: 4,
    title: "Level 4",
    subtitle: "資產與責任",
    mission: "開始判斷哪些東西未來還會幫助你的，哪些會帶來責任",
    color: "from-purple-400 to-violet-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-600",
    emoji: "🏠",
    nodes: ["asset_vs_consumption_good", "loan_vs_interest_vs_credit", "insurance_vs_saving_vs_investment"]
  },
  {
    level: 5,
    title: "Level 5",
    subtitle: "進階經濟理解",
    mission: "開始看懂市場、風險、利潤與更大的經濟世界",
    color: "from-rose-400 to-pink-500",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    textColor: "text-rose-600",
    emoji: "🌍",
    nodes: ["risk_vs_uncertainty", "revenue_vs_profit", "cost_vs_expense", "supply_vs_demand", "personal_vs_market_value"]
  }
];

// Check if a single node meets unlock requirements
export function isNodeMastered(progressData, nodeKey) {
  const data = progressData.find(p => p.concept_group === nodeKey);
  if (!data) return false;
  const attempts = data.total_attempts || 0;
  const correct = data.correct_answers || 0;
  if (attempts < UNLOCK_MIN_ATTEMPTS) return false;
  return (correct / attempts) >= UNLOCK_MIN_ACCURACY;
}

// Check if a level is fully mastered (all nodes meet requirements)
export function isLevelMastered(progressData, levelIndex) {
  const levelNodes = SKILL_TREE[levelIndex].nodes;
  return levelNodes.every(key => isNodeMastered(progressData, key));
}

// Check if a given level is unlocked
export function isLevelUnlocked(progressData, levelIndex) {
  if (levelIndex === 0) return true;
  return isLevelMastered(progressData, levelIndex - 1);
}

// Get node progress info
export function getNodeProgress(progressData, nodeKey) {
  const data = progressData.find(p => p.concept_group === nodeKey);
  const meta = fullQuestionBank[nodeKey];
  const attempts = data?.total_attempts || 0;
  const correct = data?.correct_answers || 0;
  const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
  const mastered = isNodeMastered(progressData, nodeKey);
  return { attempts, correct, accuracy, mastered, label: meta?.label || nodeKey, icon: meta?.icon || '📚' };
}