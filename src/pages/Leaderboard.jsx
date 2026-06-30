import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/lib/AuthContext";
import { fetchWeeklyLeaderboard, fetchAllTimeLeaderboard, triviaIdentity } from "@/lib/triviaScore";

const MEDAL = ["🥇", "🥈", "🥉"];

export default function Leaderboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [tab, setTab] = useState(location.state?.tab === "allTime" ? "allTime" : "weekly"); // "weekly" | "allTime"
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const r = tab === "weekly"
          ? await fetchWeeklyLeaderboard(50)
          : await fetchAllTimeLeaderboard(50);
        if (!cancelled) setRows(r);
      } catch (e) {
        console.error("leaderboard load failed", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [tab]);

  const isWeekly = tab === "weekly";
  const pointsOf = (r) => (isWeekly ? r.weeklyPoints : r.allTimePoints) || 0;

  const myUid = user?.uid;
  const myIndex = rows.findIndex((r) => r.uid === myUid);
  const me = myIndex >= 0 ? rows[myIndex] : null;
  const myId = myUid ? triviaIdentity(myUid) : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6">
        <PageHeader backTo="/trivia" backLabel="金錢冷知識" />

        <div className="text-center mb-3">
          <div className="text-4xl">🏆</div>
          <h1 className="text-xl font-black text-foreground mt-1">{isWeekly ? "本週排行榜" : "總排行榜"}</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {isWeekly ? "每週一重新開始，大家都有機會 💪" : "累積所有分數，看誰是常勝軍 👑"}
          </p>
        </div>

        {/* 切換：本週 / 總排行 */}
        <div className="flex gap-1 p-1 mb-4 rounded-2xl bg-muted/50">
          {[["weekly", "本週"], ["allTime", "總排行"]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                tab === key ? "bg-white text-violet-700 shadow-sm" : "text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 你的名次 */}
        <div className="rounded-2xl p-3.5 flex items-center gap-3 mb-4 text-white" style={{ background: "#7C3AED" }}>
          <div className="w-10 h-10 rounded-full bg-white/25 flex items-center justify-center text-xl">{me?.avatar || myId?.avatar || "🦊"}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black truncate">你（{me?.nickname || myId?.nickname || "—"}）</p>
            <p className="text-xs opacity-90">
              {me
                ? `${isWeekly ? "本週" : "累積"} ${pointsOf(me)} 分`
                : isWeekly
                ? "本週還沒玩，玩一局就上榜！"
                : "還沒玩過，玩一局就上榜！"}
            </p>
          </div>
          <div className="text-2xl font-black shrink-0">{myIndex >= 0 ? `#${myIndex + 1}` : "—"}</div>
        </div>

        {loading ? (
          <p className="text-center text-sm text-muted-foreground py-10">載入中…</p>
        ) : rows.length === 0 ? (
          <div className="bg-muted/40 border border-border rounded-2xl p-6 text-center">
            <div className="text-3xl mb-2">✨</div>
            <p className="text-sm font-bold text-foreground">{isWeekly ? "本週還沒有人上榜" : "還沒有人上榜"}</p>
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
                <div className="text-sm font-black text-violet-700 shrink-0">{pointsOf(r)}</div>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-[11px] text-muted-foreground mt-4">用暱稱與頭像顯示，不會出現真名</p>
      </div>
    </div>
  );
}
