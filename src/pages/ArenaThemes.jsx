import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { hasArenaAccess } from "@/api/arenaAccess";
import { findBand } from "@/data/arenaStructure";

// 概念競技場第二層：某年齡段裡的主題課程（每個加購主題 = 12 週）
export default function ArenaThemes() {
  const navigate = useNavigate();
  const { bandId } = useParams();
  const { userData } = useAuth();
  const band = findBand(bandId);

  useEffect(() => {
    if (userData && !hasArenaAccess(userData)) navigate("/");
  }, [userData, navigate]);

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
          <div className="space-y-3">
            {band.themes.map((t, idx) => (
              <motion.button
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 + 0.05 }}
                onClick={() => t.live && navigate(t.route)}
                disabled={!t.live}
                className={`w-full text-left rounded-2xl border-2 p-4 flex items-center gap-3 transition-all ${
                  t.live ? "border-foreground bg-card hover:opacity-90 active:scale-[0.98]" : "border-border bg-muted/30 opacity-60"
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center text-lg shrink-0">
                  {t.live ? "📚" : <Lock className="w-4 h-4 text-muted-foreground" />}
                </div>
                <div className="flex-1">
                  <p className="text-base font-black text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t.weeks}{t.live ? " · 12 週主題" : " · 即將推出"}
                  </p>
                </div>
                {t.live && <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
