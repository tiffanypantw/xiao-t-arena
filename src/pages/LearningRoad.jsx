import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/lib/AuthContext";
import { hasThemeAccess } from "@/api/arenaAccess";
import { getRoadTheme, bloomColor, bloomKey, bloomLabel, BLOOM_STAGES } from "@/data/roadThemes";

// 加購主題課的「學習道路」：蜿蜒路徑 × Bloom 分段 × 每關我能
export default function LearningRoad() {
  const navigate = useNavigate();
  const { themeId } = useParams();
  const { userData } = useAuth();
  const theme = getRoadTheme(themeId);
  const [openN, setOpenN] = useState(null);

  // 沒開通這個主題的帳號退回主題列表
  useEffect(() => {
    if (userData && !hasThemeAccess(userData, themeId)) navigate("/arena/band/l1");
  }, [userData, themeId, navigate]);

  if (!theme) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-md mx-auto px-4 py-6">
          <PageHeader backTo="/arena/band/l1" backLabel="L1 體驗" />
          <p className="text-sm text-muted-foreground mt-8 text-center">找不到這個主題。</p>
        </div>
      </div>
    );
  }

  let lastStage = null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6">
        <PageHeader backTo="/arena/band/l1" backLabel="L1 體驗" />

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-3">
          <h1 className="text-xl font-black text-foreground">{theme.emoji} {theme.themeName}</h1>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{theme.coreQ}　·　里程碑：{theme.milestone}</p>
        </motion.div>

        <div className="flex gap-1.5 flex-wrap mb-3">
          {BLOOM_STAGES.map((s) => (
            <span key={s.key} className="text-[10.5px] font-bold text-white rounded-lg px-2 py-0.5" style={{ background: s.color }}>{s.label}</span>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-700 font-bold mb-2">
          🚧 練習題陸續上線中——先看這一季每一關會學到的「我能」。
        </div>

        {/* 道路 */}
        <div className="relative pt-4 pb-2">
          <div className="absolute left-1/2 -translate-x-1/2 top-2 bottom-10 w-7 rounded-full" style={{ background: "#E6DEF2" }} />
          {theme.weeks.map((w, i) => {
            const stage = bloomKey(w.bloom);
            const showStage = stage !== lastStage;
            lastStage = stage;
            const color = bloomColor(w.bloom);
            const side = i % 2 === 0 ? -52 : 52;
            const open = openN === w.n;
            return (
              <div key={w.n}>
                {showStage && (
                  <div className="relative z-10 text-center my-2">
                    <span className="text-[11px] font-black text-white rounded-full px-3.5 py-1" style={{ background: color }}>{bloomLabel(stage)}</span>
                  </div>
                )}
                <div className="relative flex justify-center my-3.5" style={{ transform: `translateX(${side}px)` }}>
                  <button
                    onClick={() => setOpenN(open ? null : w.n)}
                    className="relative z-10 w-[60px] h-[60px] rounded-full flex items-center justify-center text-white font-black text-lg border-4 border-white shadow-[0_5px_0_rgba(0,0,0,0.1)] active:translate-y-0.5 transition-all"
                    style={{ background: color }}
                  >
                    {w.n}
                  </button>
                  <div
                    className="absolute top-1/2 -translate-y-1/2 text-xs font-bold text-foreground w-[116px]"
                    style={side < 0 ? { left: "calc(50% + 44px)" } : { right: "calc(50% + 44px)", textAlign: "right" }}
                  >
                    W{w.n}・{w.topic}
                  </div>
                </div>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 max-w-[340px] mx-auto bg-card border border-border rounded-2xl p-3.5 shadow-sm"
                  >
                    <p className="text-sm font-black text-foreground">W{w.n}　{w.topic}</p>
                    <div className="mt-2 bg-accent/10 border border-accent/20 rounded-xl px-3 py-2">
                      <p className="text-[10px] font-bold text-accent tracking-wide">⭐ 我現在會</p>
                      <p className="text-[12.5px] font-bold text-foreground mt-0.5 leading-relaxed">{w.iCan}</p>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-2">🎮 {w.act}</p>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center text-[11px] text-muted-foreground mt-3">每完成一關，就點亮一條「我現在會」</p>
      </div>
    </div>
  );
}
