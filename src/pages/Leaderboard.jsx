import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { fetchWeeklyLeaderboard, triviaIdentity } from "@/lib/triviaScore";

const MEDAL = ["🥇", "🥈", "🥉"];

export default function Leaderboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetchWeeklyLeaderboard(50);
        if (!cancelled) setRows(r);
      } catch (e) {
        console.error("leaderboard load failed", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const myUid = user?.uid;
  const myIndex = rows.findIndex((r) => r.uid === myUid);
  const me = myIndex >= 0 ? rows[myIndex] : null;
  const myId = myUid ? triviaIdentity(myUid) : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6">
        <button onClick={() => navigate("/trivia")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-all mb-4">
          <ChevronLeft className="w-4 h-4" /> 金錢冷知識
        </button>

        <div className="text-center mb-3">
          <div className="text-4xl">🏆</div>
          <h1 className="text-xl font-black text-foreground mt-1">本週排行榜</h1>
          <p className="text-xs text-muted-foreground mt-1">每週一重新開始，大家都有機會 💪</p>
        </div>

        {/* 你的名次 */}
        <div className="rounded-2xl p-3.5 flex items-center gap-3 mb-4 text-white" style={{ background: "#7C3AED" }}>
          <div className="w-10 h-10 rounded-full bg-white/25 flex items-center justify-center text-xl">{me?.avatar || myId?.avatar || "🦊"}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black truncate">你（{me?.nickname || myId?.nickname || "—"}）</p>
            <p className="text-xs opacity-90">{me ? `本週 ${me.weeklyPoints} 分` : "本週還沒玩，玩一局就上榜！"}</p>
          </div>
          <div className="text-2xl font-black shrink-0">{myIndex >= 0 ? `#${myIndex + 1}` : "—"}</div>
        </div>

        {loading ? (
          <p className="text-center text-sm text-muted-foreground py-10">載入中…</p>
        ) : rows.length === 0 ? (
          <div className="bg-muted/40 border border-border rounded-2xl p-6 text-center">
            <div className="text-3xl mb-2">✨</div>
            <p className="text-sm font-bold text-foreground">本週還沒有人上榜</p>
            <p className="text-xs text-muted-foreground mt-1">去玩第一局，搶下第一名！</p>
          </div>
        ) : (
          <div className="space-y-2">
            {rows.map((r, i) => (
              <div
                key={r.uid}
                className={`flex items-center gap-3 rounded-2xl px-3.5 py-2.5 border ${
                  r.uid === myUid ? "border-2 border-violet-500 bg-violet-50" : "border-border bg-card"
                }`}
              >
                <div className="w-7 text-center font-black text-sm shrink-0">{i < 3 ? MEDAL[i] : i + 1}</div>
                <div className="w-9 h-9 rounded-full bg-violet-50 flex items-center justify-center text-lg shrink-0">{r.avatar}</div>
                <div className="flex-1 text-sm font-bold text-foreground truncate">
                  {r.nickname}
                  {r.uid === myUid && <span className="text-violet-600"> · 你</span>}
                </div>
                <div className="text-sm font-black text-violet-700 shrink-0">{r.weeklyPoints}</div>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-[11px] text-muted-foreground mt-4">用暱稱與頭像顯示，不會出現真名</p>
      </div>
    </div>
  );
}
