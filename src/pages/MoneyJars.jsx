import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Plus, Trash2, PiggyBank, Check, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import {
  JARS,
  jarOf,
  currentMonthKey,
  defaultMonth,
  getMonth,
  saveMonth,
} from "@/api/bookkeeping";

const yen = (n) => `${Math.round(n || 0).toLocaleString()} 元`;
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

export default function MoneyJars() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const monthKey = currentMonthKey();

  const [month, setMonth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedFlash, setSavedFlash] = useState(false);
  const skipSave = useRef(true);

  // 載入本月資料
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) return;
      setLoading(true);
      const data = await getMonth(user.uid, monthKey);
      if (cancelled) return;
      skipSave.current = true;
      setMonth(data);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, monthKey]);

  // 自動儲存（debounce 800ms），跳過載入後第一次 set
  useEffect(() => {
    if (!month || !user) return;
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    const t = setTimeout(async () => {
      await saveMonth(user.uid, monthKey, month);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1400);
    }, 800);
    return () => clearTimeout(t);
  }, [month, user, monthKey]);

  // ---- 衍生計算 ----
  const calc = useMemo(() => {
    const m = month || defaultMonth(monthKey);
    const pctSum = JARS.reduce((s, j) => s + (Number(m.percents[j.key]) || 0), 0);
    const planned = {};
    JARS.forEach((j) => {
      planned[j.key] = Math.round(((Number(m.allowance) || 0) * (Number(m.percents[j.key]) || 0)) / 100);
    });
    const actual = { hua: 0, cun: 0, xue: 0, tou: 0, gei: 0 };
    let income = 0;
    let expense = 0;
    (m.entries || []).forEach((e) => {
      const amt = Number(e.amount) || 0;
      if (e.dir === "in") income += amt;
      else {
        expense += amt;
        if (actual[e.jar] != null) actual[e.jar] += amt;
      }
    });
    return {
      pctSum,
      planned,
      actual,
      income,
      expense,
      balance: income - expense,
      saved: actual.cun,
      investSelf: actual.xue + actual.tou,
    };
  }, [month, monthKey]);

  if (loading || !month) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  // ---- 更新 helpers ----
  const setGoal = (k, v) => setMonth((m) => ({ ...m, goals: { ...m.goals, [k]: v } }));
  const setAllowance = (v) =>
    setMonth((m) => ({ ...m, allowance: v === "" ? 0 : Math.max(0, parseInt(v, 10) || 0) }));
  const setPercent = (key, v) =>
    setMonth((m) => ({
      ...m,
      percents: { ...m.percents, [key]: v === "" ? 0 : Math.max(0, Math.min(100, parseInt(v, 10) || 0)) },
    }));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> 首頁
          </button>
          <span
            className={`text-xs flex items-center gap-1 transition-opacity ${
              savedFlash ? "opacity-100 text-accent" : "opacity-0"
            }`}
          >
            <Check className="w-3.5 h-3.5" /> 已儲存
          </span>
        </div>

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-foreground leading-tight">我的 5 罐子記帳</h1>
              <p className="text-sm text-muted-foreground">{monthKey.replace("-", " 年 ")} 月</p>
            </div>
          </div>
        </motion.div>

        {/* 目標 */}
        <Section title="我的目標" desc="寫下你想存錢做什麼、想學什麼、想送誰。">
          {[
            ["save", "我想存錢做的一件事", "#9A7611"],
            ["learn", "我想學的一件事", "#1C7C4C"],
            ["invest", "我想投資的一件事", "#1B5FA0"],
            ["give", "我想送出的一件事", "#9C3F7E"],
          ].map(([k, label, color]) => (
            <div key={k} className="mb-3 last:mb-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                <span className="text-sm font-bold text-foreground">{label}</span>
              </div>
              <input
                value={month.goals[k] || ""}
                onChange={(e) => setGoal(k, e.target.value)}
                placeholder="寫下來…"
                className="w-full text-sm px-3 py-2 rounded-xl border border-border bg-card focus:outline-none focus:border-primary"
              />
            </div>
          ))}
        </Section>

        {/* 5 罐子設定 */}
        <Section title="5 罐子設定" desc="填這個月的零用錢，再決定每個罐子的比例。">
          <label className="block text-sm font-bold text-muted-foreground mb-1">這個月的零用錢</label>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="number"
              inputMode="numeric"
              value={month.allowance || ""}
              onChange={(e) => setAllowance(e.target.value)}
              placeholder="0"
              className="w-32 text-sm px-3 py-2 rounded-xl border border-border bg-card focus:outline-none focus:border-primary"
            />
            <span className="text-sm text-muted-foreground">元</span>
          </div>

          <div className="space-y-2">
            {JARS.map((j) => (
              <div key={j.key} className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black shrink-0"
                  style={{ background: j.bg, color: j.color }}
                >
                  {j.label}
                </div>
                <span className="text-sm text-muted-foreground w-16 shrink-0">{j.job}</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={month.percents[j.key] ?? ""}
                  onChange={(e) => setPercent(j.key, e.target.value)}
                  className="w-16 text-sm px-2 py-1.5 rounded-lg border border-border bg-card text-center focus:outline-none focus:border-primary"
                />
                <span className="text-sm text-muted-foreground">%</span>
                <span className="text-sm font-bold text-foreground ml-auto">
                  {yen(calc.planned[j.key])}
                </span>
              </div>
            ))}
          </div>

          <div
            className={`mt-3 flex items-center gap-2 text-sm font-bold ${
              calc.pctSum === 100 ? "text-accent" : "text-destructive"
            }`}
          >
            {calc.pctSum === 100 ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
            比例加起來 = {calc.pctSum}%{calc.pctSum === 100 ? "（剛好！）" : "（要調到 100%）"}
          </div>
        </Section>

        {/* 每日記帳 */}
        <DailyLedger month={month} setMonth={setMonth} />

        {/* 本月總覽 */}
        <Section title="本月總覽" desc="每個罐子計畫放多少、實際花多少。">
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="grid grid-cols-6 text-xs font-bold bg-muted/60 text-muted-foreground">
              <div className="p-2"></div>
              {JARS.map((j) => (
                <div key={j.key} className="p-2 text-center" style={{ color: j.color }}>
                  {j.label}
                </div>
              ))}
            </div>
            <Row label="計畫" values={JARS.map((j) => calc.planned[j.key])} />
            <Row label="實際" values={JARS.map((j) => calc.actual[j.key])} muted />
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            <Stat label="收入" value={yen(calc.income)} />
            <Stat label="支出" value={yen(calc.expense)} />
            <Stat label="結餘" value={yen(calc.balance)} highlight={calc.balance >= 0} />
          </div>

          <div className="mt-3 bg-muted/40 border border-border rounded-xl p-3 text-sm text-muted-foreground space-y-1.5">
            <div className="flex items-center justify-between">
              <span>我這個月有「先存」嗎？</span>
              <span className="font-bold text-foreground">{calc.saved > 0 ? `有，存了 ${yen(calc.saved)}` : "還沒"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>我「投資自己」（學 + 投）多少？</span>
              <span className="font-bold text-foreground">{yen(calc.investSelf)}</span>
            </div>
          </div>
        </Section>

        <div className="h-8" />
      </div>
    </div>
  );
}

// ---------- 子元件 ----------
function Section({ title, desc, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 bg-card border border-border rounded-2xl p-4"
    >
      <h2 className="text-lg font-black text-foreground">{title}</h2>
      {desc && <p className="text-sm text-muted-foreground mt-0.5 mb-3">{desc}</p>}
      {!desc && <div className="mb-3" />}
      {children}
    </motion.div>
  );
}

function Row({ label, values, muted }) {
  return (
    <div className="grid grid-cols-6 text-sm border-t border-border">
      <div className="p-2 text-xs font-bold text-muted-foreground bg-muted/30 flex items-center">{label}</div>
      {values.map((v, i) => (
        <div key={i} className={`p-2 text-center ${muted ? "text-muted-foreground" : "text-foreground font-bold"}`}>
          {Math.round(v || 0)}
        </div>
      ))}
    </div>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div className="bg-muted/50 rounded-xl p-2.5 text-center">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-base font-black mt-0.5 ${highlight ? "text-accent" : "text-foreground"}`}>{value}</div>
    </div>
  );
}

function DailyLedger({ month, setMonth }) {
  const [dir, setDir] = useState("out");
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [jar, setJar] = useState("hua");
  const [mood, setMood] = useState("");

  const add = () => {
    const amt = parseInt(amount, 10);
    if (!item.trim() || !amt || amt <= 0) return;
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      date: todayStr(),
      dir,
      item: item.trim(),
      amount: amt,
      jar: dir === "out" ? jar : null,
      mood: mood.trim(),
    };
    setMonth((m) => ({ ...m, entries: [entry, ...(m.entries || [])] }));
    setItem("");
    setAmount("");
    setMood("");
  };

  const remove = (id) =>
    setMonth((m) => ({ ...m, entries: (m.entries || []).filter((e) => e.id !== id) }));

  return (
    <Section title="每日記帳" desc="每一筆錢，進來或出去，記一筆。">
      {/* 進 / 出 切換 */}
      <div className="flex gap-2 mb-3">
        {[
          ["out", "支出"],
          ["in", "進帳"],
        ].map(([v, label]) => (
          <button
            key={v}
            onClick={() => setDir(v)}
            className={`flex-1 text-sm font-bold py-2 rounded-xl border-2 transition-all ${
              dir === v ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <input
          value={item}
          onChange={(e) => setItem(e.target.value)}
          placeholder="項目（例如：午餐、零用錢、存撲滿）"
          className="w-full text-sm px-3 py-2 rounded-xl border border-border bg-card focus:outline-none focus:border-primary"
        />
        <div className="flex gap-2">
          <input
            type="number"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="金額"
            className="w-24 text-sm px-3 py-2 rounded-xl border border-border bg-card focus:outline-none focus:border-primary"
          />
          {dir === "out" && (
            <select
              value={jar}
              onChange={(e) => setJar(e.target.value)}
              className="flex-1 text-sm px-3 py-2 rounded-xl border border-border bg-card focus:outline-none focus:border-primary"
            >
              {JARS.map((j) => (
                <option key={j.key} value={j.key}>
                  {j.label}・{j.job}
                </option>
              ))}
            </select>
          )}
        </div>
        <input
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="心情 / 備註（可不填）"
          className="w-full text-sm px-3 py-2 rounded-xl border border-border bg-card focus:outline-none focus:border-primary"
        />
        <button
          onClick={add}
          className="w-full flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-sm font-bold py-2.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" /> 記一筆
        </button>
      </div>

      {/* 列表 */}
      <div className="mt-4 space-y-2">
        {(month.entries || []).length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">還沒有紀錄，記下第一筆吧！</p>
        )}
        {(month.entries || []).map((e) => {
          const j = jarOf(e.jar);
          return (
            <div key={e.id} className="flex items-center gap-2 border border-border rounded-xl px-3 py-2">
              <div className="flex flex-col items-center w-12 shrink-0">
                <span className="text-[10px] text-muted-foreground">{e.date.slice(5)}</span>
                {e.dir === "out" && j ? (
                  <span
                    className="text-[11px] font-black mt-0.5 px-1.5 rounded"
                    style={{ background: j.bg, color: j.color }}
                  >
                    {j.label}
                  </span>
                ) : (
                  <span className="text-[11px] font-black mt-0.5 text-accent">進</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{e.item}</p>
                {e.mood && <p className="text-[11px] text-muted-foreground truncate">{e.mood}</p>}
              </div>
              <span
                className={`text-sm font-black shrink-0 ${e.dir === "in" ? "text-accent" : "text-foreground"}`}
              >
                {e.dir === "in" ? "+" : "−"}
                {Math.round(e.amount)}
              </span>
              <button
                onClick={() => remove(e.id)}
                className="text-muted-foreground hover:text-destructive transition-all shrink-0"
                aria-label="刪除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
