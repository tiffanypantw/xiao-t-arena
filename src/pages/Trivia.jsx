import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Flame, Shield, Lightbulb, BookOpen } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { pickRound, DIFFICULTY_META, difficultyCount } from "@/data/trivia";
import { writeTriviaScore } from "@/lib/triviaScore";

const ROUND_SIZE = 5;

// 各難度玩過的題數存在 localStorage，純粹給「看到自己玩了多少」用
const playedKey = (d) => `trivia_played_${d}`;
function readPlayed() {
  const out = {};
  for (const m of DIFFICULTY_META) {
    let v = 0;
    try { v = Number(localStorage.getItem(playedKey(m.id)) || 0); } catch (e) { v = 0; }
    out[m.id] = isNaN(v) ? 0 : v;
  }
  return out;
}

export default function Trivia() {
  const navigate = useNavigate();
  const { user, userData, refreshUserData } = useAuth();

  const [screen, setScreen] = useState("select"); // select | q | end
  const [difficulty, setDifficulty] = useState(null);
  const [played, setPlayed] = useState(() => readPlayed());
  const [round, setRound] = useState([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [pts, setPts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [hadWrong, setHadWrong] = useState(false);
  const [comeback, setComeback] = useState(false);
  const [saving, setSaving] = useState(false);

  const item = round[idx];
  const meta = DIFFICULTY_META.find((m) => m.id === difficulty);

  const start = (diff) => {
    setDifficulty(diff);
    setRound(pickRound(ROUND_SIZE, diff));
    setScreen("q");
    setIdx(0); setPicked(null); setPts(0); setStreak(0);
    setMaxStreak(0); setCorrect(0); setHadWrong(false); setComeback(false);
  };

  const backToSelect = () => {
    setPlayed(readPlayed());
    setScreen("select");
  };

  const choose = (opt) => {
    if (picked) return;
    setPicked(opt);
    // 記錄「玩過一題」
    try {
      const k = playedKey(difficulty);
      localStorage.setItem(k, String(Number(localStorage.getItem(k) || 0) + 1));
    } catch (e) { /* localStorage 不可用就算了 */ }
    const ok = opt === item.a;
    if (ok) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak((m) => Math.max(m, newStreak));
      setCorrect((c) => c + 1);
      setPts((p) => p + 10 + (newStreak >= 2 ? (newStreak - 1) * 5 : 0));
      if (hadWrong) setComeback(true);
    } else {
      setStreak(0);
      setHadWrong(true);
    }
  };

  const next = async () => {
    if (idx + 1 >= round.length) {
      await saveResult();
      setPlayed(readPlayed());
      setScreen("end");
    } else {
      setIdx((i) => i + 1);
      setPicked(null);
    }
  };

  const saveResult = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          triviaPoints: (userData?.triviaPoints || 0) + pts,
          triviaBest: Math.max(userData?.triviaBest || 0, pts),
          triviaPlays: (userData?.triviaPlays || 0) + 1,
          triviaUpdatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      await writeTriviaScore(user.uid, pts); // 寫入排行榜（本週累積）
      await refreshUserData();
    } catch (e) {
      console.error("save trivia failed", e);
    } finally {
      setSaving(false);
    }
  };

  // ---- 選難度入口 ----
  if (screen === "select") {
    return (
      <Shell onBack={() => navigate("/")}>
        <div className="mb-4">
          <h1 className="text-2xl font-black text-foreground flex items-center gap-1.5">
            冷知識競技場 <span className="text-violet-600">⚡</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            選一個難度，挑戰你的腦袋。猜錯也沒關係，每一題都帶走一個冷知識！
          </p>
          {userData?.triviaPoints ? (
            <p className="text-xs text-violet-700 font-bold mt-2">
              你累積了 {userData.triviaPoints} 分 · 最高一局 {userData.triviaBest || 0} 分
            </p>
          ) : null}
        </div>

        <div className="space-y-3">
          {DIFFICULTY_META.map((m) => {
            const total = difficultyCount(m.id);
            const done = Math.min(played[m.id] || 0, total);
            const dots = 8;
            const lit = total ? Math.round((done / total) * dots) : 0;
            return (
              <button
                key={m.id}
                onClick={() => start(m.id)}
                className={`w-full flex items-center gap-4 bg-card border ${m.ring} rounded-2xl px-4 py-4 text-left active:scale-[0.99] transition-all`}
              >
                <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-2xl ${m.chipBg}`}>
                  {m.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-foreground">{m.name}</span>
                    <span className={`text-[10px] font-black tracking-wide ${m.chipText}`}>{m.en}</span>
                  </div>
                  <div className="text-xs text-muted-foreground leading-snug mt-0.5">{m.desc}</div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="flex gap-1">
                      {Array.from({ length: dots }).map((_, i) => (
                        <span key={i} className={`w-1.5 h-1.5 rounded-full ${i < lit ? m.dot : "bg-muted"}`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground ml-1">已玩 {done} 題</span>
                  </div>
                </div>
                <span className="text-muted-foreground/50 text-xl">›</span>
              </button>
            );
          })}
        </div>

        <button onClick={() => navigate("/leaderboard")} className="mt-4 text-sm font-bold text-violet-700 mx-auto">
          🏆 看本週排行榜
        </button>
      </Shell>
    );
  }

  // ---- 結算 ----
  if (screen === "end") {
    return (
      <Shell onBack={() => navigate("/")}>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
          <div className="text-5xl mb-1">{correct === round.length ? "🏆" : "🎉"}</div>
          <h2 className="text-xl font-black text-foreground">{correct === round.length ? "全對！太強了" : "挑戰完成！"}</h2>
          {meta && <p className="text-xs font-bold text-muted-foreground mt-1">{meta.emoji} {meta.name} 難度</p>}
          <div className="flex gap-2.5 my-4">
            <Stat label="答對" value={`${correct}/${round.length}`} />
            <Stat label="本局得分" value={pts} />
            <Stat label="最高連勝" value={maxStreak} />
          </div>
          {comeback && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-3 max-w-[320px]">
              <p className="text-[11px] font-black text-amber-700 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> 你贏得了徽章</p>
              <p className="text-sm font-bold text-foreground mt-0.5">越挫越勇 — 答錯了沒放棄，後面又答對了！</p>
            </div>
          )}
          <p className="text-xs text-muted-foreground mb-5 max-w-[300px]">
            這些冷知識背後都有道理——想真的學會用錢嗎？你的學習在等你 →
          </p>
          <button onClick={() => navigate("/leaderboard")} className="mb-3 text-sm font-bold text-violet-700">🏆 看本週排行榜</button>
          <div className="flex gap-2">
            <button onClick={() => start(difficulty)} className="bg-primary text-primary-foreground text-sm font-black px-5 py-2.5 rounded-2xl shadow-[0_4px_0_#5b32b6] active:translate-y-0.5 transition-all">再玩一次 ↺</button>
            <button onClick={backToSelect} className="border border-border text-sm font-bold px-5 py-2.5 rounded-2xl text-muted-foreground">換難度</button>
          </div>
        </div>
      </Shell>
    );
  }

  // ---- 題目 + 揭曉卡片 ----
  return (
    <Shell onBack={backToSelect}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm font-black text-amber-500 whitespace-nowrap flex items-center gap-1"><Flame className="w-4 h-4" />{streak}</span>
        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${(idx / round.length) * 100}%` }} />
        </div>
        <span className="text-sm font-black text-violet-700 whitespace-nowrap">{pts} 分</span>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full">{item.tag}</span>
          {meta && <span className={`text-[10px] font-black ${meta.chipText}`}>{meta.emoji} {meta.name}</span>}
        </div>
        <p className="text-lg font-black text-foreground leading-snug mb-2.5">{item.q}</p>
        {!picked && (
          <div className="text-xs text-violet-700 bg-violet-50 rounded-xl px-3 py-2 font-bold mb-4 flex items-start gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 mt-0.5 shrink-0" /> 先用自己的腦袋想想看，別急著查——猜錯也沒關係！
          </div>
        )}

        <div className="space-y-2.5">
          {item.opts.map((o) => {
            let cls = "border-border bg-card";
            if (picked) {
              if (o === item.a) cls = "border-accent bg-accent/10 text-accent";
              else if (o === picked) cls = "border-destructive bg-destructive/10 text-destructive";
              else cls = "border-border opacity-50";
            }
            return (
              <button key={o} onClick={() => choose(o)} disabled={!!picked}
                className={`w-full text-left text-sm font-bold border-2 rounded-2xl px-4 py-3 transition-all active:scale-[0.99] ${cls}`}>
                {o}
              </button>
            );
          })}
        </div>

        {picked && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`mt-4 rounded-2xl px-4 py-4 ${picked === item.a ? "bg-accent/10 border border-accent/30" : "bg-destructive/10 border border-destructive/30"}`}>
            <p className={`text-base font-black ${picked === item.a ? "text-accent" : "text-destructive"}`}>
              {picked === item.a
                ? (streak >= 2 ? `答對！🔥 ${streak} 連勝` : "答對！+10")
                : `沒關係，你有先自己想過～正確答案是：${item.a}`}
            </p>
            <p className="text-sm text-foreground/80 mt-2 leading-relaxed">{item.e}</p>

            {item.bonus && (
              <div className="mt-3 bg-violet-50 rounded-xl px-3 py-2.5">
                <p className="text-xs font-black text-violet-700 mb-1">💡 冷知識</p>
                <p className="text-sm text-foreground/80 leading-relaxed">{item.bonus}</p>
              </div>
            )}

            {item.story && (
              <a href={item.story} target="_blank" rel="noreferrer"
                className="mt-3 flex items-center justify-center gap-1.5 w-full bg-primary text-primary-foreground text-sm font-black py-2.5 rounded-xl active:translate-y-0.5 transition-all">
                <BookOpen className="w-4 h-4" /> 回故事冊看更多
              </a>
            )}
          </motion.div>
        )}

        {picked && (
          <button onClick={next} disabled={saving}
            className="mt-4 bg-primary text-primary-foreground text-sm font-black py-3 rounded-2xl shadow-[0_4px_0_#5b32b6] active:translate-y-0.5 disabled:opacity-50 transition-all">
            {idx + 1 >= round.length ? (saving ? "結算中…" : "看結果 →") : "繼續 →"}
          </button>
        )}
      </div>
    </Shell>
  );
}

function Shell({ children, onBack }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6 min-h-screen flex flex-col">
        <div className="mb-2">
          <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-all">
            <ChevronLeft className="w-4 h-4" /> 首頁
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-card border border-border rounded-2xl px-4 py-2.5 min-w-[78px]">
      <div className="text-xl font-black text-violet-700">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}
