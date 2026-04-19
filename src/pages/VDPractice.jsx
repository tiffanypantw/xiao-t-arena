import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

const QUESTIONS = [
  {
    id: 1, block: '基礎理解', type: 'multiple_choice',
    question: '同一杯手搖飲：夜市35元、百貨75元、機場120元。價格不一樣，最主要的原因是什麼？',
    options: [
      'A. 材料不同',
      'B. 杯子大小不同',
      'C. 地點和情境不同，願意付錢的人需求也不同',
      'D. 每家老闆想賺的錢不一樣',
    ],
    answer: 'C. 地點和情境不同，願意付錢的人需求也不同',
    explanation: '價格不只反映飲料本身，也反映「在那個地方買到它」的方便程度和情境需求。機場的人沒有其他選擇，願意付更多——這就是需求影響價格的樣子。',
  },
  {
    id: 2, block: '基礎記憶', type: 'multiple_choice',
    question: '「機會成本」是什麼意思？',
    options: [
      'A. 賺到錢需要付出的努力',
      'B. 做了一個選擇，同時放棄的那個東西',
      'C. 買東西要付的價格',
      'D. 把錢存起來等待更好的機會',
    ],
    answer: 'B. 做了一個選擇，同時放棄的那個東西',
    explanation: '每次做選擇，你同時也放棄了另一個選項。那個被放棄的東西，就叫機會成本。',
  },
  {
    id: 3, block: '基礎理解', type: 'multiple_choice',
    question: '小明選了搭客運去高雄，他的機會成本是什麼？',
    options: [
      'A. 客運的票價',
      'B. 他在車上花掉的時間',
      'C. 搭高鐵可以節省的那3小時',
      'D. 計程車從家門口出發的方便',
    ],
    answer: 'C. 搭高鐵可以節省的那3小時',
    explanation: '小明選了省錢，同時放棄的是高鐵的速度。那個「被放棄的3小時」就是他的機會成本。',
  },
  {
    id: 4, block: '實際應用', type: 'multiple_choice',
    question: '小明有200元，可以買限量貼紙，或存起來之後使用。他選了貼紙。他的機會成本是什麼？',
    options: [
      'A. 他的200元',
      'B. 他的時間',
      'C. 同一筆錢未來可以使用在其他地方',
      'D. 他和朋友的友誼',
    ],
    answer: 'C. 同一筆錢未來可以使用在其他地方',
    explanation: '他選了現在花掉，同時放棄的是這筆錢未來的其他可能性。機會成本不一定是一件具體的事，有時候是「還沒發生但本來可以發生」的選擇空間。',
  },
  {
    id: 5, block: '實際應用', type: 'multiple_choice',
    question: '同樣到高雄，不同的人選不同的交通工具。這說明了什麼？',
    options: [
      'A. 每家公司的建造成本不一樣',
      'B. 台灣的交通系統設計不好',
      'C. 不同的人重視不同的東西，所以市場上出現了不同的選擇',
      'D. 價格越高的交通工具一定越好',
    ],
    answer: 'C. 不同的人重視不同的東西，所以市場上出現了不同的選擇',
    explanation: '選高鐵的人在買速度，選客運的人在買省錢，選計程車的人在買方便。不同人重視不同的東西，市場才會出現這麼多種選擇和價格。',
  },
];

function FeedbackRow({ correct, correctLabel, explanation }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl px-4 py-3 mt-2 text-sm ${correct ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}
    >
      <div className="flex items-center gap-2 font-semibold">
        {correct ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
        {correct ? '答對了！' : `正確答案：${correctLabel}`}
      </div>
      {explanation && <p className="mt-1 text-xs opacity-80 leading-relaxed">{explanation}</p>}
    </motion.div>
  );
}

function CardShell({ q, children }) {
  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-semibold">{q.block}</span>
        <span className="text-xs text-muted-foreground">Q{q.id}</span>
      </div>
      <p className="text-base font-bold text-foreground leading-snug">{q.question}</p>
      {children}
    </motion.div>
  );
}

function QuestionCard({ q, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const isCorrect = selected === q.answer;

  const handleConfirm = () => {
    if (!selected) return;
    setRevealed(true);
  };

  const handleNext = () => {
    onAnswer(isCorrect);
  };

  return (
    <CardShell q={q}>
      <div className="space-y-2 mt-4">
        {q.options.map((opt) => {
          const isSelected = selected === opt;
          const isOptCorrect = opt === q.answer;
          let style = 'border-border bg-card text-foreground';
          if (revealed) {
            if (isOptCorrect) style = 'border-green-500 bg-green-50 text-green-800';
            else if (isSelected && !isOptCorrect) style = 'border-red-400 bg-red-50 text-red-700';
          } else if (isSelected) {
            style = 'border-violet-500 bg-violet-50 text-violet-800';
          }
          return (
            <button key={opt} onClick={() => !revealed && setSelected(opt)}
              className={`w-full text-left rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${style}`}>
              {opt}
            </button>
          );
        })}
      </div>
      {!revealed && selected && (
        <Button onClick={handleConfirm} className="w-full mt-3 bg-violet-600 hover:bg-violet-700">確認答案</Button>
      )}
      {revealed && (
        <>
          <FeedbackRow correct={isCorrect} correctLabel={q.answer} explanation={q.explanation} />
          <Button onClick={handleNext} className="w-full mt-3">下一題 →</Button>
        </>
      )}
    </CardShell>
  );
}

function ResultScreen({ correct, total, onRetry }) {
  const navigate = useNavigate();
  const isPerfect = correct === total;

  const unlockBadge = async () => {
    // 徽章已在主函數中解鎖，這裡只負責顯示
  };

  if (isPerfect) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5">
        <div className="text-center space-y-2">
          <div className="text-5xl">🔍</div>
          <div className="inline-block bg-violet-100 text-violet-700 text-xs font-bold px-3 py-1 rounded-full">
            直播限定 VD-0419
          </div>
          <h2 className="text-xl font-black text-foreground">全部答對！</h2>
          <p className="text-3xl font-black text-violet-600">{correct} / {total}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            你已經理解：<br />
            <span className="font-semibold text-foreground">機會成本與情境定價</span>
          </p>
        </div>
        <div className="bg-violet-50 border-2 border-violet-200 rounded-2xl p-5 text-center space-y-2">
          <div className="text-3xl">🏅</div>
          <p className="text-sm font-black text-violet-700">「價值偵探」徽章已自動解鎖！</p>
          <p className="text-xs text-violet-500">前往學習護照查看你的收藏</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/Home')} className="flex-1">返回首頁</Button>
          <Button onClick={() => navigate('/Passport')} className="flex-1 bg-violet-600 hover:bg-violet-700">查看護照</Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5">
      <div className="text-center space-y-2">
        <div className="text-5xl">💪</div>
        <h2 className="text-xl font-black text-foreground">還差一點點，再試一次！</h2>
        <p className="text-3xl font-black text-muted-foreground">{correct} / {total}</p>
        <p className="text-sm text-muted-foreground">5題全對才能解鎖「價值偵探」徽章！</p>
      </div>
      <div className="bg-muted/50 border border-border rounded-2xl p-5 space-y-3">
        <p className="text-sm font-bold text-foreground">👉 想一想：</p>
        <ul className="text-sm text-muted-foreground space-y-2 leading-relaxed">
          <li>• 什麼是機會成本？</li>
          <li>• 為什麼同樣的東西在不同地方價格不同？</li>
        </ul>
      </div>
      <Button onClick={onRetry} className="w-full text-base py-5">🔁 重新挑戰</Button>
    </motion.div>
  );
}

export default function VDPractice() {
  const navigate = useNavigate();
  const { user, userData, refreshUserData } = useAuth();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const totalQuestions = QUESTIONS.length;

  const unlockBadge = async () => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const alreadyOwned = userData?.collection?.["badge-value-detective"];
    if (alreadyOwned) return;
    await setDoc(
      userRef,
      {
        collection: {
          ...userData?.collection,
          "badge-value-detective": {
            unlockedAt: new Date().toISOString(),
            codeUsed: "auto-vd-0419",
          },
        },
      },
      { merge: true }
    );
    await refreshUserData();
  };

  const handleAnswer = async (isCorrect) => {
    const newCorrect = isCorrect ? correctCount + 1 : correctCount;
    if (isCorrect) setCorrectCount(c => c + 1);
    if (currentIdx + 1 >= totalQuestions) {
      setDone(true);
      if (newCorrect === totalQuestions) {
        await unlockBadge();
      }
    } else {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleRetry = () => { setCurrentIdx(0); setCorrectCount(0); setDone(false); };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/Home')} className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-violet-600">直播限定 VD-0419</p>
            </div>
            <p className="text-sm font-bold text-foreground">小T概念競技場</p>
          </div>
          {!done && (
            <span className="text-xs font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {currentIdx + 1} / {totalQuestions}
            </span>
          )}
        </div>
        {!done && (
          <div className="w-full h-1.5 bg-muted rounded-full mb-6 overflow-hidden">
            <motion.div className="h-full bg-violet-500 rounded-full"
              animate={{ width: `${(currentIdx / totalQuestions) * 100}%` }}
              transition={{ duration: 0.3 }} />
          </div>
        )}
        <AnimatePresence mode="wait">
          {done
            ? <ResultScreen key="result" correct={correctCount} total={totalQuestions} onRetry={handleRetry} />
            : <QuestionCard key={currentIdx} q={QUESTIONS[currentIdx]} onAnswer={handleAnswer} />
          }
        </AnimatePresence>
      </div>
    </div>
  );
}