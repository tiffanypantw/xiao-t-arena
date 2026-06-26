import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Award } from "lucide-react";
import { ARENA_BANDS } from "@/data/arenaStructure";

// 概念競技場第一層：選年齡段（分齡）。可自由瀏覽，鎖在各主題課程上。
export default function ArenaBands() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => navigate("/")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-all">
            <ChevronLeft className="w-4 h-4" /> 首頁
          </button>
          <button onClick={() => navigate("/Passport")} className="flex items-center gap-1.5 bg-violet-100 text-violet-700 text-xs font-bold px-3 py-2 rounded-xl hover:opacity-90 transition-all">
            <Award className="w-3.5 h-3.5" /> 學習護照
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
          <div className="text-3xl mb-2">🏆</div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">概念競技場</h1>
          <p className="text-sm text-muted-foreground mt-1">選你的年齡段，開始你的學習階段</p>
        </motion.div>

        <div className="space-y-3">
          {ARENA_BANDS.map((b, idx) => {
            const hasContent = b.themes.some((t) => t.live);
            return (
              <motion.button
                key={b.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 + 0.05 }}
                onClick={() => navigate(`/arena/band/${b.id}`)}
                className="w-full text-left rounded-2xl border-2 border-border bg-card p-4 flex items-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all"
              >
                <div className={`w-12 h-12 rounded-2xl ${b.iconBg} flex items-center justify-center text-2xl shrink-0`}>{b.emoji}</div>
                <div className="flex-1">
                  <p className="text-base font-black text-foreground">{b.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {b.age}
                    {hasContent
                      ? <span className="ml-2 text-violet-600 font-bold">· 有內容</span>
                      : <span className="ml-2">· 即將推出</span>}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
