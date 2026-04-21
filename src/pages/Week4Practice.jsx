import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';

const QUESTIONS = [
  {
    id: 1, block: '基礎記憶', type: 'multiple_choice',
    question: '老闆賣東西的時候，「成本」是指什麼?',
    options: ['客人付給老闆的錢', '老闆為了做生意花出去的錢', '商品的標價', '店裡還沒賣出去的商品'],
    answer: '老闆為了做生意花出去的錢',
    explanation: '成本就是老闆為了做生意必須先花掉的錢，例如買材料、付店員薪水、付房租。',
  },
  {
    id: 2, block: '基礎記憶', type: 'multiple_choice',
    question: '「收入 - 成本 = ?」這個公式，算出來的是什麼?',
    options: ['價格', '利潤', '折扣', '損失'],
    answer: '利潤',
    explanation: '老闆收到的錢（收入）扣掉花掉的錢（成本），剩下的才是真正賺到的，叫做利潤。',
  },
  {
    id: 3, block: '基礎記憶', type: 'multiple_choice',
    question: '這週主課教的三種成本，不包含下面哪一個?',
    options: ['原料', '人力', '場地水電', '客人的心情'],
    answer: '客人的心情',
    explanation: '這週主課教的三種成本是原料、人力、場地水電。客人的心情不是成本。',
  },
  {
    id: 4, block: '基礎理解', type: 'multiple_choice',
    question: '小華家的珍奶店一杯賣 50 元，成本是 35 元。她的爸爸說這杯奶茶「賺 50 元」，這個說法哪裡有問題?',
    options: ['價格應該更高才對', '50 元是收入，要扣掉成本才是真正賺到的', '奶茶應該免費送', '35 元太便宜了'],
    answer: '50 元是收入，要扣掉成本才是真正賺到的',
    explanation: '50 元只是收到的錢，要減掉 35 元成本，實際賺到的利潤只有 15 元。',
  },
  {
    id: 5, block: '基礎理解', type: 'multiple_choice',
    question: '小明觀察到：7-11 的御飯糰比媽媽做的貴很多，可是 7-11 的老闆不是特別貪心。為什麼會這樣?',
    options: ['7-11 的米比較好', '7-11 還要付冷藏車配送、24 小時營業等成本', '媽媽不會做飯糰', '便利商店一定比較貴'],
    answer: '7-11 還要付冷藏車配送、24 小時營業等成本',
    explanation: '你付的價差，是在買「方便」——這些配送、保鮮、24 小時營業的系統，本身就要花很多錢。',
  },
  {
    id: 6, block: '基礎理解', type: 'multiple_choice',
    question: '小美去百貨公司買一杯 400 元的精品珍奶，她爸爸說：「這個老闆太貪心了！」這個判斷準不準確?',
    options: ['準確，因為價格太高一定是貪心', '不準確，要看這家店的成本結構才知道', '準確，精品都是騙人的', '不準確，價格越高越有價值'],
    answer: '不準確，要看這家店的成本結構才知道',
    explanation: '精品店的店租、人力、裝潢成本通常都比較高，價格高不一定代表賺比較多。',
  },
  {
    id: 7, block: '基礎理解', type: 'multiple_choice',
    question: '小李發現一包寶可夢卡牌紙跟墨水加起來不到 10 元，可是一包要賣 150 元。剩下的 140 元可能花在哪裡?',
    options: ['老闆口袋', '設計、品牌授權、廣告等別種成本', '卡牌包裝', '運送費用'],
    answer: '設計、品牌授權、廣告等別種成本',
    explanation: '有些產品的成本不在「做出來」，而在讓你「想要它」——包含設計師費用、授權金、廣告行銷。',
  },
  {
    id: 8, block: '基礎理解', type: 'multiple_choice',
    question: '上禮拜我們學過：同一杯奶茶，50 元跟 400 元解決的是不同的需求。這個觀念和這週的「成本」合起來看，告訴我們什麼?',
    options: ['貴的東西一定比較好', '價格高 = 賺得多', '價格是在「價值」和「成本」之間的平衡點', '便宜一定比較划算'],
    answer: '價格是在「價值」和「成本」之間的平衡點',
    explanation: '價格不是老闆隨便喊的。它一邊要看客人願意付多少（價值），另一邊要能蓋住老闆的成本，才會出現平衡點。',
  },
  {
    id: 9, block: '實際應用', type: 'multiple_choice',
    question: '你長大想開一家手搖飲店，剛開幕的時候，爸媽問你怎麼定價。根據這週學的，你應該怎麼做?',
    options: ['隨便訂一個自己喜歡的數字', '看隔壁店賣多少，我就跟著賣多少', '先算清楚每一杯的成本，再決定要賣多少才不會虧', '越貴越好，這樣賺比較多'],
    answer: '先算清楚每一杯的成本，再決定要賣多少才不會虧',
    explanation: '不先算成本就定價，很容易虧錢還不知道。這是做生意的基本功。',
  },
  {
    id: 10, block: '實際應用', type: 'multiple_choice',
    question: '你和朋友去夜市，看到一個蔥抓餅老闆忙到流汗、站了整晚。你會怎麼想這個畫面?',
    options: ['他賺很多，不用心疼', '一份蔥抓餅的價格裡面，也藏著他站整晚的時間和辛苦', '他應該漲價', '他一定很開心'],
    answer: '一份蔥抓餅的價格裡面，也藏著他站整晚的時間和辛苦',
    explanation: '老闆的勞動時間也是一種成本。看得到價格的人很多，看得懂背後付出的人不多。',
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
            <span className="font-semibold text-foreground">成本藏在每個價格背後</span>
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
            👉 你將獲得徽章＋卡片兌換碼 🎉
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
        <p className="text-sm text-muted-foreground">10題全對才能獲得兌換碼！</p>
      </div>
      <div className="bg-muted/50 border border-border rounded-2xl p-5 space-y-3">
        <p className="text-sm font-bold text-foreground">👉 想一想這些問題：</p>
        <ul className="text-sm text-muted-foreground space-y-2 leading-relaxed">
          <li>• 收入跟利潤有什麼不同？</li>
          <li>• 價格高的東西，老闆一定賺很多嗎？</li>
        </ul>
      </div>
      <Button onClick={onRetry} className="w-full text-base py-5">🔁 重新挑戰</Button>
    </motion.div>
  );
}

export default function Week4Practice() {
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
        await saveProgress('week4', newCorrect, totalQuestions);
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
            <p className="text-xs text-muted-foreground">Week 4 測驗</p>
            <p className="text-sm font-bold text-foreground">老闆賣東西真的賺那麼多嗎？</p>
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