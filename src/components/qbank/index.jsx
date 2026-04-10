// 題庫總索引 - 300 題，15 個概念組，每組 20 題
import {
  need_vs_like,
  value_vs_price,
  exchange_vs_money,
  spending_vs_consumption,
  budget_vs_saving_vs_record
} from './qbank1';

import {
  asset_vs_consumption_good,
  loan_vs_interest_vs_credit,
  insurance_vs_saving_vs_investment,
  income_vs_value_exchange,
  active_vs_passive_income
} from './qbank2';

import {
  risk_vs_uncertainty,
  revenue_vs_profit,
  cost_vs_expense,
  supply_vs_demand,
  personal_vs_market_value
} from './qbank3';

// 完整題庫，含概念組元資料
const fullQuestionBank = {
  need_vs_like: {
    label: "需要 vs 喜歡",
    icon: "🧭",
    character: "需求探險家",
    characterB: "喜歡精靈",
    iconB: "🧚",
    color: "from-orange-500 to-amber-500",
    questions: need_vs_like
  },
  value_vs_price: {
    label: "價值 vs 價格",
    icon: "🧑‍🔬",
    character: "價值博士",
    characterB: "價格機器人",
    iconB: "🤖",
    color: "from-purple-500 to-indigo-500",
    questions: value_vs_price
  },
  exchange_vs_money: {
    label: "交換 vs 金錢",
    icon: "🔄",
    character: "交換大師",
    characterB: "金幣精靈",
    iconB: "🪙",
    color: "from-green-500 to-emerald-500",
    questions: exchange_vs_money
  },
  spending_vs_consumption: {
    label: "支出 vs 消費",
    icon: "💳",
    character: "支出管家",
    characterB: "消費小精靈",
    iconB: "🛍️",
    color: "from-pink-500 to-rose-500",
    questions: spending_vs_consumption
  },
  budget_vs_saving_vs_record: {
    label: "預算 vs 儲蓄 vs 記帳",
    icon: "📊",
    character: "預算規劃師",
    characterB: "存錢小豬",
    iconB: "🐷",
    color: "from-blue-500 to-cyan-500",
    questions: budget_vs_saving_vs_record
  },
  asset_vs_consumption_good: {
    label: "資產 vs 消耗品",
    icon: "🏠",
    character: "資產守護者",
    characterB: "消耗品小怪",
    iconB: "📦",
    color: "from-teal-500 to-green-500",
    questions: asset_vs_consumption_good
  },
  loan_vs_interest_vs_credit: {
    label: "借貸 vs 利息 vs 信用",
    icon: "🏦",
    character: "借貸銀行家",
    characterB: "信用天使",
    iconB: "👼",
    color: "from-violet-500 to-purple-500",
    questions: loan_vs_interest_vs_credit
  },
  insurance_vs_saving_vs_investment: {
    label: "保險 vs 儲蓄 vs 投資",
    icon: "🛡️",
    character: "保險騎士",
    characterB: "投資冒險家",
    iconB: "🚀",
    color: "from-amber-500 to-yellow-500",
    questions: insurance_vs_saving_vs_investment
  },
  income_vs_value_exchange: {
    label: "收入 vs 價值交換",
    icon: "💰",
    character: "收入達人",
    characterB: "交換智者",
    iconB: "🤝",
    color: "from-lime-500 to-green-500",
    questions: income_vs_value_exchange
  },
  active_vs_passive_income: {
    label: "主動收入 vs 被動收入",
    icon: "⚡",
    character: "主動戰士",
    characterB: "被動守財奴",
    iconB: "😴",
    color: "from-red-500 to-orange-500",
    questions: active_vs_passive_income
  },
  risk_vs_uncertainty: {
    label: "風險 vs 不確定性",
    icon: "🎲",
    character: "風險計算師",
    characterB: "不確定幽靈",
    iconB: "👻",
    color: "from-slate-500 to-gray-500",
    questions: risk_vs_uncertainty
  },
  revenue_vs_profit: {
    label: "營收 vs 利潤",
    icon: "📈",
    character: "營收大王",
    characterB: "利潤精靈",
    iconB: "💎",
    color: "from-emerald-500 to-teal-500",
    questions: revenue_vs_profit
  },
  cost_vs_expense: {
    label: "成本 vs 費用",
    icon: "🔧",
    character: "成本工程師",
    characterB: "費用守衛",
    iconB: "🔑",
    color: "from-indigo-500 to-blue-500",
    questions: cost_vs_expense
  },
  supply_vs_demand: {
    label: "供給 vs 需求",
    icon: "⚖️",
    character: "供給魔法師",
    characterB: "需求探索者",
    iconB: "🔍",
    color: "from-fuchsia-500 to-pink-500",
    questions: supply_vs_demand
  },
  personal_vs_market_value: {
    label: "個人價值 vs 市場價值",
    icon: "💫",
    character: "個人價值導師",
    characterB: "市場分析師",
    iconB: "📉",
    color: "from-cyan-500 to-blue-500",
    questions: personal_vs_market_value
  }
};

export default fullQuestionBank;

// 層級標籤系統
export { LEVELS, LEVEL_RATIO, LEVEL_LABELS, LEVEL_COLORS, filterByLevel, getLevelStats } from './levels';

export const conceptGroups = Object.keys(fullQuestionBank).map(key => ({
  key,
  ...fullQuestionBank[key],
  questionCount: fullQuestionBank[key].questions.length
}));

export const getQuestionsByGroup = (groupKey) => {
  return fullQuestionBank[groupKey]?.questions || [];
};

export const getRandomQuestions = (count = 5) => {
  const allQuestions = [];
  Object.entries(fullQuestionBank).forEach(([groupKey, group]) => {
    group.questions.forEach(q => {
      allQuestions.push({ ...q, groupKey, groupLabel: group.label });
    });
  });
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getDailyGroup = () => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const keys = Object.keys(fullQuestionBank);
  const index = dayOfYear % keys.length;
  const key = keys[index];
  return { key, ...fullQuestionBank[key] };
};