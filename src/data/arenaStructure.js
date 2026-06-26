// 概念競技場的分齡 × 主題課程結構（取自分齡 bible）
// 每個加購主題課程 = 12 週內容。目前只有 L1「第一季」(W1–W12) 有實際內容，
// 其餘年齡段／主題先顯示「即將推出」。之後新主題上架就往這裡加。

export const ARENA_BANDS = [
  {
    id: "meng",
    name: "萌芽",
    age: "5–6 歲",
    emoji: "🌱",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    themes: [],
  },
  {
    id: "qi",
    name: "啟蒙",
    age: "6–9 歲",
    emoji: "🌟",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    themes: [],
  },
  {
    id: "l1",
    name: "L1 體驗",
    age: "10–12 歲",
    emoji: "🛠",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    themes: [
      { id: "l1-season1", name: "第一季", weeks: "W1–W12", live: true, gated: true, codePrefix: "S1", route: "/arena/weeks" },
    ],
  },
  {
    id: "l2",
    name: "L2 創造",
    age: "12–15 歲",
    emoji: "🚀",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    themes: [],
  },
  {
    id: "l3",
    name: "L3 資本",
    age: "15–18 歲",
    emoji: "🏛",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    themes: [],
  },
];

export const findBand = (id) => ARENA_BANDS.find((b) => b.id === id);
