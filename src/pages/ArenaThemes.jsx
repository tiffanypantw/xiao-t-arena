import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Lock, KeyRound } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { hasThemeAccess, redeemThemeCode } from "@/api/arenaAccess";
import { findBand } from "@/data/arenaStructure";

// 概念競技場第二層：某年齡段裡的主題課程（每個加購主題 = 12 週）
export default function ArenaThemes() {
  const navigate = useNavigate();
  const { bandId } = useParams();
  const { user, userData, refreshUserData } = useAuth();
  const band = findBand(bandId);

  const [openTheme, setOpenTheme] = useState(null); // 正在輸入開通碼的主題
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submitCode = async () => {
    if (!openTheme) return;
    setErr(""); setBusy(true);
    const res = await redeemThemeCode(user?.uid, code, openTheme?.id);
    setBusy(false);
    if (res.success) {
      await refreshUserData();
      const target = openTheme.route;
      setOpenTheme(null); setCode("");
      navigate(target);
    } else {
      setErr(res.error || "開通失敗");
    }
  };

  if (!band) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-md mx-auto px-4 py-6">
          <button onClick={() => navigate("/arena")} className="flex items-center gap-1 text-sm text-muted-foreground">
            <ChevronLeft className="w-4 h-4" /> 概念競技場
          </button>
          <p className="text-sm text-muted-foreground mt-8 text-center">找不到這個年齡段。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="mb-5">
          <button onClick={() => navigate("/arena")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-all">
            <ChevronLeft className="w-4 h-4" /> 概念競技場
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
          <div className={`w-12 h-12 rounded-2xl ${band.iconBg} flex items-center justify-center text-2xl mb-2`}>{band.emoji}</div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">{band.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{band.age} · 學習階段</p>
        </motion.div>

        {band.themes.length === 0 ? (
          <div className="bg-muted/40 border border-border rounded-2xl p-6 text-center">
            <div className="text-3xl mb-2">🚧</div>
            <p className="text-sm font-bold text-foreground">這個年齡段的內容即將推出</p>
            <p className="text-xs text-muted-foreground mt-1">老師正在設計中，敬請期待！</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {band.themes.map((t, idx) => {
                const unlocked = !t.gated || hasThemeAccess(userData, t.id);
                return (
                  <motion.button
                    key={t.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 + 0.05 }}
                    onClick={() => {
                      if (!t.live) return;
                      if (unlocked) navigate(t.route);
                      else { setOpenTheme(t); setCode(""); setErr(""); }
                    }}
                    disabled={!t.live}
                    className={`relative w-full text-left rounded-2xl border-2 p-4 flex items-center gap-3 transition-all ${
                      !t.live
                        ? "border-border bg-muted/30 opacity-60"
                        : unlocked
                        ? "border-foreground bg-card hover:opacity-90 active:scale-[0.98]"
                        : "border-dashed border-violet-300 bg-violet-50/40 hover:opacity-90 active:scale-[0.98]"
                    }`}
                  >
                    {t.live && !unlocked && (
                      <span className="absolute top-3 right-3 flex items-center gap-1 bg-violet-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg">
                        <Lock className="w-2.5 h-2.5" /> 開通碼
                      </span>
                    )}
                    <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center text-lg shrink-0">
                      {!t.live ? <Lock className="w-4 h-4 text-muted-foreground" /> : unlocked ? "📚" : "🔑"}
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-black text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t.weeks}{!t.live ? " · 即將推出" : unlocked ? " · 12 週主題" : " · 加購會員開通"}
                      </p>
                    </div>
                    {t.live && unlocked && <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
                  </motion.button>
                );
              })}
            </div>

            {openTheme && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 border border-violet-200 bg-violet-50 rounded-2xl p-4"
              >
                <p className="text-sm font-black text-violet-700 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4" /> 開通「{openTheme.name}」
                </p>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  在 Skool 購買這個主題課程後，輸入老師給你的開通碼就能解鎖這 12 週的練習題。
                </p>
                <div className="flex gap-2">
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) submitCode(); }}
                    placeholder="輸入開通碼"
                    className="flex-1 text-sm px-3 py-2 rounded-xl border border-border bg-card tracking-wider focus:outline-none focus:border-primary"
                  />
                  <button
                    onClick={submitCode}
                    disabled={busy}
                    className="bg-violet-600 text-white text-sm font-bold px-4 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    {busy ? "…" : "解鎖"}
                  </button>
                </div>
                {err && <p className="text-xs text-destructive font-bold mt-2">{err}</p>}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
