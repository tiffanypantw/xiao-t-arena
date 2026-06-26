import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Flame, Shield, Lightbulb, Trophy } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { pickRound } from "@/data/trivia";

const ROUND_SIZE = 5;

export default function Trivia() {
  const navigate = useNavigate();
  const { user, userData, refreshUserData } = useAuth();

  const [round, setRound] = useState(() => pickRound(ROUND_SIZE));
  const [screen, setScreen] = useState("intro"); // intro | q | end
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

  const start = () => {
    setRound(pickRound(ROUND_SIZE));
    setScreen("q");
    setIdx(0); setPicked(null); setPts(0); setStreak(0);
    setMaxStreak(0); setCorrect(0); setHadWrong(false); setComeback(false);
  };

  const choose = (opt) => {
    if (picked) return;
    setPicked(opt);
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
      await refreshUserData();
    } catch (e) {
      console.error("save trivia failed", e);
    } finally {
      setSaving(false);
    }
  };

  // ---- 畫面 ----
  if (screen === "intro") {
    return (
      <Shell onBack={() => navigate("/")}>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
          <div className="text-5xl mb-3">💡</div>
          <h1 className="text-2xl font-black text-foreground">金錢冷知識挑戰</h1>
          <p className="text-sm text-muted-foreground mt-2 mb-2 leading-relaxed">
            {ROUND_SIZE} 題關於錢、經濟、商業的世界冷知識。<br />不是考試——看你知道多少，答對連勝拿高分！
          </p>
          {userData?.triviaPoints ? (
            <p className="text-xs text-violet-700 font-bold mb-5">你累積了 {userData.triviaPoints} 分 · 最高一局 {userData.triviaBest || 0} 分</p>
          ) : <div className="mb-5" />}
          <button onClick={start} className="bg-primary text-primary-foreground text-base font-black px-6 py-3 rounded-2xl shadow-[0_4px_0_#5b32b6] active:translate-y-0.5 active:shadow-[0_2px_0_#5b32b6] transition-all">
            開始挑戰 →
          </button>
        </div>
      </Shell>
    );
  }

  if (screen === "end") {
    return (
      <Shell onBack={() => navigate("/")}>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
          <div className="text-5xl mb-1">{correct === round.length ? "🏆" : "🎉"}</div>
          <h2 className="text-xl font-black text-foreground">{correct === round.length ? "全對！太強了" : "挑戰完成！"}</h2>
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
          <div className="flex gap-2">
            <button onClick={start} className="bg-primary text-primary-foreground text-sm font-black px-5 py-2.5 rounded-2xl shadow-[0_4px_0_#5b32b6] active:translate-y-0.5 transition-all">再玩一次 ↺</button>
            <button onClick={() => navigate("/")} className="border border-border text-sm font-bold px-5 py-2.5 rounded-2xl text-muted-foreground">回首頁</button>
          </div>
        </div>
      </Shell>
    );
  }

  // 題目畫面
  return (
    <Shell onBack={() => navigate("/")}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm font-black text-amber-500 whitespace-nowrap flex items-center gap-1"><Flame className="w-4 h-4" />{streak}</span>
        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${(idx / round.length) * 100}%` }} />
        </div>
        <span className="text-sm font-black text-violet-700 whitespace-nowrap">{pts} 分</span>
      </div>

      <div className="flex-1 flex flex-col">
        <span className="self-start text-xs font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full mb-3">{item.tag}</span>
        <p className="text-lg font-black text-foreground leading-snug mb-2.5">{item.q}</p>
        <div className="text-xs text-violet-700 bg-violet-50 rounded-xl px-3 py-2 font-bold mb-4 flex items-start gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 mt-0.5 shrink-0" /> 先用自己的腦袋想想看，別急著查——猜錯也沒關係！
        </div>

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
            className={`mt-4 rounded-2xl px-4 py-3 ${picked === item.a ? "bg-accent/10" : "bg-destructive/10"}`}>
            <p className={`text-sm font-black ${picked === item.a ? "text-accent" : "text-destructive"}`}>
              {picked === item.a
                ? (streak >= 2 ? `答對！🔥 ${streak} 連勝` : "答對！+10")
                : `沒關係，你有先自己想過～正確答案是：${item.a}`}
            </p>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{item.e}</p>
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
