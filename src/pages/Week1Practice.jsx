import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';

const QUESTIONS = [
  {
    id: 1, block: '基礎理解', type: 'multiple_choice',
    question: '小明用自己的漫畫書換同學的餅乾，這種行為最接近哪一種？',
    options: ['使用金錢交易', '以物易物（Barter）', '借貸', '投資'],
    answer: '以物易物（Barter）',
    explanation: '用物品直接交換物品，就是以物易物。',
  },
  {
    id: 2, block: '基礎理解', type: 'multiple_choice',
    question: '小華手上有羊毛，但他需要金屬，這代表什麼？',
    options: ['他什麼都沒有', '他已經可以完成所有交換', '他擁有資源（Resources）但不完整', '他不需要交換'],
    answer: '他擁有資源（Resources）但不完整',
    explanation: '他有資源，但不是自己現在需要的資源。',
  },
  {
    id: 3, block: '基礎理解', type: 'multiple_choice',
    question: '小美用一袋米換到一塊布，這整個過程最接近什麼？',
    options: ['投資', '收入', '交換（Exchange）', '儲蓄'],
    answer: '交換（Exchange）',
    explanation: '雙方用自己有的東西互換，就是交換。',
  },
  {
    id: 4, block: '交換限制', type: 'multiple_choice',
    question: '小明想用羊毛換金屬，但對方說只想要糧食，這種情況最接近什麼問題？',
    options: ['價格太高', '雙重巧合沒有成立', '東西不夠多', '沒有市場'],
    answer: '雙重巧合沒有成立',
    explanation: '交換要成功，雙方都要剛好想要對方的東西。',
  },
  {
    id: 5, block: '交換限制', type: 'multiple_choice',
    question: '如果你要先用羊毛換糧食，再用糧食換金屬，這代表什麼？',
    options: ['交換很簡單', '交換變更公平', '交換效率變低', '交換不需要時間'],
    answer: '交換效率變低',
    explanation: '需要多步驟才能完成，代表效率變低。',
  },
  {
    id: 6, block: '交換限制', type: 'multiple_choice',
    question: '小明帶著一袋水果去交換，但還沒換到就壞掉了，這反映什麼問題？',
    options: ['沒有人想要水果', '水果沒有價值', '交換很公平', '保存與時間影響交換效率'],
    answer: '保存與時間影響交換效率',
    explanation: '物品會壞掉，代表交換會被時間與保存影響。',
  },
  {
    id: 7, block: '深入思考', type: 'multiple_choice',
    question: '大家手上都有東西，但還是換不到想要的，最可能的原因是什麼？',
    options: ['雙重巧合沒有對上', '東西太少', '沒有價格標籤', '東西太便宜'],
    answer: '雙重巧合沒有對上',
    explanation: '不是有東西就能交換成功，還要需求剛好對上。',
  },
  {
    id: 8, block: '深入思考', type: 'multiple_choice',
    question: '牧民想用牛換金屬，但雙方一直談不攏要換多少，這最接近什麼問題？',
    options: ['沒有資源', '沒有人需要金屬', '沒有標準衡量與談判困難', '交換太快'],
    answer: '沒有標準衡量與談判困難',
    explanation: '沒有統一標準時，需要談判與估算。',
  },
  {
    id: 9, block: '深入思考', type: 'multiple_choice',
    question: '古代人開始用符號來記錄交易，這是為了解決什麼問題？',
    options: ['讓東西變多', '提高價格', '讓交換更慢', '減少交易混亂與增加信任'],
    answer: '減少交易混亂與增加信任',
    explanation: '記錄讓交易更清楚、降低混亂。',
  },
  {
    id: 10, block: '深入思考', type: 'multiple_choice',
    question: '一個人有很多東西，但就是換不到需要的工具，這代表什麼？',
    options: ['他很窮', '沒有錢比較公平', '交換制度效率不高，不一定公平', '他不夠努力'],
    answer: '交換制度效率不高，不一定公平',
    explanation: '能不能換到需要的東西，才是關鍵。',
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
        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-semibold">{q.block}</span>
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
        {q.options.map((opt, i) => {
          const isSelected = selected === opt;
          const isOptCorrect = opt === q.answer;
          let style = 'border-border bg-card text-foreground';
          if (revealed) {
            if (isOptCorrect) style = 'border-green-500 bg-green-50 text-green-800';
            else if (isSelected && !isOptCorrect) style = 'border-red-400 bg-red-50 text-red-700';
          } else if (isSelected) {
            style = 'border-foreground bg-foreground text-background';
          }
          return (
            <button key={opt} onClick={() => !revealed && setSelected(opt)}
              className={`w-full text-left rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${style}`}>
              <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
            </button>
          );
        })}
      </div>
      {!revealed && selected && (
        <Button onClick={handleConfirm} className="w-full mt-3">確認答案</Button>
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

  if (isPerfect) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5">
        <div className="text-center space-y-2">
          <div className="text-5xl">🎉</div>
          <h2 className="text-xl font-black text-foreground">太棒了！你全部答對了！</h2>
          <p className="text-3xl font-black text-primary">{correct} / {total}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            代表你已經理解：<br />
            <span className="font-semibold text-foreground">交換其實會卡住，不一定比較公平</span>
          </p>
        </div>
        <div className="bg-card border-2 border-foreground/10 rounded-2xl p-5 space-y-3">
          <p className="text-sm font-black text-foreground">📸 請完成以下步驟</p>
          <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal list-inside leading-relaxed">
            <li>截圖這個完成畫面</li>
            <li>在畫面上簽名</li>
            <li>寄到指定 email</li>
          </ol>
          <div className="pt-2 border-t border-border text-sm font-semibold text-foreground">
            👉 你將獲得下一步解鎖碼 🎉
          </div>
        </div>
        <Button variant="outline" onClick={() => navigate('/Home')} className="w-full">返回首頁</Button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5">
      <div className="text-center space-y-2">
        <div className="text-5xl">💪</div>
        <h2 className="text-xl font-black text-foreground">還差一點點，再試一次！</h2>
        <p className="text-3xl font-black text-muted-foreground">{correct} / {total}</p>
      </div>
      <div className="bg-muted/50 border border-border rounded-2xl p-5 space-y-3">
        <p className="text-sm font-bold text-foreground">👉 想一想這些問題：</p>
        <ul className="text-sm text-muted-foreground space-y-2 leading-relaxed">
          <li>• 如果對方不想要你的東西，會怎樣？</li>
          <li>• 交換是不是一定能成功？</li>
        </ul>
      </div>
      <Button onClick={onRetry} className="w-full text-base py-5">🔁 重新挑戰</Button>
    </motion.div>
  );
}

export default function Week1Practice() {
  const navigate = useNavigate();
  const { saveProgress } = useAuth();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const totalQuestions = QUESTIONS.length;

  const handleAnswer = async (isCorrect) => {
    const newCorrect = isCorrect ? correctCount + 1 : correctCount;
    if (isCorrect) setCorrectCount(c => c + 1);
    if (currentIdx + 1 >= totalQuestions) {
      setDone(true);
      if (newCorrect === totalQuestions) {
        await saveProgress('week1', newCorrect, totalQuestions);
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
            <p className="text-xs text-muted-foreground">Week 1 測驗</p>
            <p className="text-sm font-bold text-foreground">如果世界沒有錢？</p>
          </div>
          {!done && (
            <span className="text-xs font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {currentIdx + 1} / {totalQuestions}
            </span>
          )}
        </div>
        {!done && (
          <div className="w-full h-1.5 bg-muted rounded-full mb-6 overflow-hidden">
            <motion.div className="h-full bg-foreground rounded-full"
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