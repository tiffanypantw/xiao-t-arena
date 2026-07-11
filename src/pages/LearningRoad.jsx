import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/lib/AuthContext";
import { useWeeks } from "@/lib/hooks/useContent";
import { hasThemeAccess } from "@/api/arenaAccess";
import { getRoadTheme, bloomColor, bloomKey, bloomLabel, BLOOM_STAGES } from "@/data/roadThemes";

// 加購主題課的「學習道路」:蜿蜒路徑 × 每關我能 × 點進去玩練習題
//
// 每一關的狀態:
//   done     — 這一關的徽章已拿到(✓)
//   playable — 內容已發佈 + 上一關完成 → 可以開始
//   waiting  — 內容已發佈但上一關還沒完成(🔒 先完成上一關)
//   mystery  — 內容還沒公開(?)
export default function LearningRoad() {
  const navigate = useNavigate();
  const { themeId } = useParams();
  const { userData } = useAuth();
  const theme = getRoadTheme(themeId);
  const { data: allWeeks = [] } = useWeeks();
  const [openN, setOpenN] = useState(null);

  // 這個主題屬於哪個分齡 band(退回鍵 + 沒開通時的導回目標)
  const bandPath = theme?.bandId ? `/arena/band/${theme.bandId}` : "/arena";
  const bandLabel = theme?.band || "概念競技場";

  // 沒開通這個主題的帳號退回主題列表
  useEffect(() => {
    if (userData && !hasThemeAccess(userData, themeId)) navigate(bandPath);
  }, [userData, themeId, navigate, bandPath]);

  if (!theme) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-md mx-auto px-4 py-6">
          <PageHeader backTo="/arena" backLabel="概念競技場" />
          <p className="text-sm text-muted-foreground mt-8 text-center">找不到這個主題。</p>
        </div>
      </div>
    );
  }

  const collection = userData?.collection || {};
  const weekDocs = {};
  allWeeks.forEach((w) => { weekDocs[w.weekNumber] = w; });

  // 算每一關的狀態
  const statusOf = (w, i) => {
    if (w.mystery || !w.weekNumber) return "mystery";
    const doc = weekDocs[w.weekNumber];
    const published = !!doc && doc.published !== false;
    if (!published) return "mystery"; // 已寫進系統但還沒發佈 → 對學生就是還沒公開
    const done = w.badgeId ? !!collection[w.badgeId] : false;
    if (done) return "done";
    const prev = theme.weeks[i - 1];
    const prevDone = i === 0 ? true : prev?.badgeId ? !!collection[prev.badgeId] : false;
    return prevDone ? "playable" : "waiting";
  };

  let lastStage = null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6">
        <PageHeader backTo={bandPath} backLabel={bandLabel} />

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-3">
          <h1 className="text-xl font-black text-foreground">{theme.emoji} {theme.themeName}</h1>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {theme.season}　·　{theme.coreQ}
          </p>
        </motion.div>

        <div className="flex gap-1.5 flex-wrap mb-3">
          {BLOOM_STAGES.map((s) => (
            <span key={s.key} className="text-[10.5px] font-bold text-white rounded-lg px-2 py-0.5" style={{ background: s.color }}>{s.label}</span>
          ))}
        </div>

        {/* 道路 */}
        <div className="relative pt-4 pb-2">
          <div className="absolute left-1/2 -translate-x-1/2 top-2 bottom-10 w-7 rounded-full" style={{ background: "#E6DEF2" }} />
          {theme.weeks.map((w, i) => {
            const st = statusOf(w, i);
            const stage = bloomKey(w.bloom);
            const showStage = stage && stage !== lastStage;
            if (stage) lastStage = stage;
            const color = st === "mystery" || st === "waiting" ? "#B9B3C6" : bloomColor(w.bloom);
            const side = i % 2 === 0 ? -52 : 52;
            const open = openN === w.n;
            return (
              <div key={w.n}>
                {showStage && (
                  <div className="relative z-10 text-center my-2">
                    <span className="text-[11px] font-black text-white rounded-full px-3.5 py-1" style={{ background: bloomColor(w.bloom) }}>{bloomLabel(stage)}</span>
                  </div>
                )}
                <div className="relative flex justify-center my-3.5" style={{ transform: `translateX(${side}px)` }}>
                  <button
                    onClick={() => setOpenN(open ? null : w.n)}
                    className="relative z-10 w-[60px] h-[60px] rounded-full flex items-center justify-center text-white font-black text-lg border-4 border-white shadow-[0_5px_0_rgba(0,0,0,0.1)] active:translate-y-0.5 transition-all"
                    style={{ background: color }}
                  >
                    {st === "done" ? "✓" : st === "mystery" ? "?" : st === "waiting" ? <Lock className="w-5 h-5" /> : w.n}
                    {st === "playable" && (
                      <span className="absolute -top-2 -right-3 bg-amber-400 text-white text-[9px] font-black rounded-full px-1.5 py-0.5 shadow">GO</span>
                    )}
                  </button>
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 text-xs font-bold w-[116px] ${st === "mystery" ? "text-muted-foreground/60" : "text-foreground"}`}
                    style={side < 0 ? { left: "calc(50% + 44px)" } : { right: "calc(50% + 44px)", textAlign: "right" }}
                  >
                    W{w.n}・{w.topic || "？？？"}
                  </div>
                </div>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 max-w-[340px] mx-auto bg-card border border-border rounded-2xl p-3.5 shadow-sm"
                  >
                    {st === "mystery" ? (
                      <>
                        <p className="text-sm font-black text-foreground">W{w.n}　？？？</p>
                        <p className="text-xs text-muted-foreground mt-1.5">🚧 這一關還沒公開,老師正在準備中,敬請期待!</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-black text-foreground">
                          W{w.n}　{w.topic}
                          {w.sub && <span className="text-xs font-bold text-muted-foreground ml-1">({w.sub})</span>}
                        </p>
                        <div className="mt-2 bg-accent/10 border border-accent/20 rounded-xl px-3 py-2">
                          <p className="text-[10px] font-bold text-accent tracking-wide">⭐ {st === "done" ? "我現在會" : "完成後你會"}</p>
                          <p className="text-[12.5px] font-bold text-foreground mt-0.5 leading-relaxed">{w.iCan}</p>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-2">🎮 {w.act}</p>
                        {st === "playable" && (
                          <button
                            onClick={() => navigate(`/week/${w.weekNumber}`)}
                            className="w-full mt-3 bg-foreground text-background text-sm font-black rounded-xl py-2.5 hover:opacity-90 active:scale-[0.98] transition-all"
                          >
                            🎮 開始 W{w.n} 挑戰 →
                          </button>
                        )}
                        {st === "done" && (
                          <button
                            onClick={() => navigate(`/week/${w.weekNumber}`)}
                            className="w-full mt-3 border-2 border-violet-300 bg-violet-50 text-violet-700 text-sm font-black rounded-xl py-2.5 hover:opacity-90 active:scale-[0.98] transition-all"
                          >
                            ✓ 已完成 · 回去看看
                          </button>
                        )}
                        {st === "waiting" && (
                          <p className="text-[11px] text-amber-600 font-bold mt-3 text-center">🔒 先完成上一關,這一關就會亮起來</p>
                        )}
                      </>
                    )}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center text-[11px] text-muted-foreground mt-3">每完成一關,就點亮一條「我現在會」</p>
      </div>
    </div>
  );
}
