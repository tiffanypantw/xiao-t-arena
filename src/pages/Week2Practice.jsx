import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';

const QUESTIONS = [
  {
    id: 1, block: '基礎記憶', type: 'multiple_choice',
    question: '「商品貨幣」是指什麼？',
    options: ['政府印製的紙鈔', '用實體物品當作交換媒介的錢，例如鹽或貝殼', '銀行帳戶裡的數字', '金屬製作的硬幣'],
    answer: '用實體物品當作交換媒介的錢，例如鹽或貝殼',
    explanation: '商品貨幣是指用大家都認同有價值的實體物品來當錢，不是硬幣也不是紙鈔。',
  },
  {
    id: 2, block: '基礎記憶', type: 'multiple_choice',
    question: '古羅馬士兵的薪水是什麼？',
    options: ['金幣', '鹽巴', '貝殼', '布'],
    answer: '鹽巴',
    explanation: '古羅馬士兵的薪水是鹽（拉丁文 SAL），英文的「薪水」salary 就是從這個字演變來的。',
  },
  {
    id: 3, block: '基礎記憶', type: 'multiple_choice',
    question: '世界最早的紙幣是在哪裡出現的？',
    options: ['古羅馬', '非洲肯亞', '中國宋朝', '中世紀歐洲'],
    answer: '中國宋朝',
    explanation: '世界最早的紙幣出現在中國宋朝，叫做「交子」，讓人們不用攜帶大量硬幣也能交易。',
  },
  {
    id: 4, block: '基礎理解', type: 'multiple_choice',
    question: '為什麼鹽巴可以在古代被拿來當作金錢使用？',
    options: ['因為鹽巴很稀少，沒有人見過', '因為鹽巴只有有錢人才買得起', '因為大家都需要鹽巴，而且它可以保存食物和消毒', '因為鹽巴很輕，容易攜帶'],
    answer: '因為大家都需要鹽巴，而且它可以保存食物和消毒',
    explanation: '鹽巴功能多、大家都需要，所以能達成共識，被接受當作交換媒介。',
  },
  {
    id: 5, block: '基礎理解', type: 'multiple_choice',
    question: '從硬幣演變到紙鈔，最主要的原因是什麼？',
    options: ['硬幣容易生鏽', '硬幣太容易被偷走', '硬幣大量攜帶非常不方便，紙鈔更輕巧', '紙鈔比硬幣更有價值'],
    answer: '硬幣大量攜帶非常不方便，紙鈔更輕巧',
    explanation: '當交易金額變大，要搬動大量硬幣非常困難，紙鈔輕便又好攜帶，就慢慢取代了硬幣。',
  },
  {
    id: 6, block: '基礎理解', type: 'multiple_choice',
    question: '為什麼不是什麼東西都可以拿來當金錢？以下哪個說法最正確？',
    options: ['只要政府說可以，任何東西都可以當錢', '金錢需要大家的共識與信任，還要耐用、可分割、方便攜帶', '金錢一定要是金屬做的才行', '金錢只要好看就夠了'],
    answer: '金錢需要大家的共識與信任，還要耐用、可分割、方便攜帶',
    explanation: '成為金錢的條件包含：大家都認同它的價值、它耐用不容易壞、可以被拆分成不同金額、容易攜帶。',
  },
  {
    id: 7, block: '基礎理解', type: 'multiple_choice',
    question: '數位支付（例如手機支付）和紙鈔一樣，最根本的基礎都是什麼？',
    options: ['科技設備', '對政府和機構的信任', '網路速度', '手機的品牌'],
    answer: '對政府和機構的信任',
    explanation: '不管是紙鈔還是數位支付，背後最重要的都是「信任」——信任發行機構、信任這個制度。',
  },
  {
    id: 8, block: '實際應用', type: 'multiple_choice',
    question: '小明說：「我在家裡畫了一張紙，上面寫100元，大家應該都要接受！」這個想法哪裡有問題？',
    options: ['畫得不夠漂亮', '沒有人信任他畫的紙，也沒有機構認證，無法達成共識', '紙太薄了，不夠耐用', '應該用硬幣，不能用紙'],
    answer: '沒有人信任他畫的紙，也沒有機構認證，無法達成共識',
    explanation: '金錢必須由可信任的機構（通常是政府）發行，才能讓大家建立共識和信任，自己畫的不算數。',
  },
  {
    id: 9, block: '實際應用', type: 'multiple_choice',
    question: '小華說他在超市看到可以用手機嗶一聲結帳，但奶奶說「這樣沒有拿到真正的錢，感覺不安全」。你會怎麼解釋？',
    options: ['奶奶說得對，手機支付不是真的錢', '手機支付只是把銀行帳戶裡的數字轉移，背後還是真實的錢，只是用數位方式移動', '手機支付是免費的，不需要真正的錢', '手機支付的錢和紙鈔是完全不同的東西'],
    answer: '手機支付只是把銀行帳戶裡的數字轉移，背後還是真實的錢，只是用數位方式移動',
    explanation: '數位支付只是讓帳戶裡的數字增加或減少，背後對應的仍然是真實的貨幣，基礎還是信任。',
  },
  {
    id: 10, block: '實際應用', type: 'multiple_choice',
    question: '上週我們學到交換（以物易物）很麻煩，這週學到金錢是解決方法。如果今天你有一袋米要換鞋子，用金錢交換和直接以物易物比起來，哪裡最方便？',
    options: ['金錢交換沒有比較方便', '你可以先把米換成錢，再拿錢去買任何你想要的鞋子，不用找剛好想要米的鞋子賣家', '你一定要先找到想要米的人，才能換到錢', '米直接換鞋子比較快，不需要金錢'],
    answer: '你可以先把米換成錢，再拿錢去買任何你想要的鞋子，不用找剛好想要米的鞋子賣家',
    explanation: '金錢解決了「雙重巧合」的問題——你不需要找剛好想要你東西的人，只要換成錢就可以和任何人交易。',
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
            <span className="font-semibold text-foreground">金錢的起源與信任的力量</span>
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
          <li>• 為什麼古人要用鹽巴當錢？</li>
          <li>• 金錢最重要的基礎是什麼？</li>
        </ul>
      </div>
      <Button onClick={onRetry} className="w-full text-base py-5">🔁 重新挑戰</Button>
    </motion.div>
  );
}

export default function Week2Practice() {
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
        await saveProgress('week2', newCorrect, totalQuestions);
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
            <p className="text-xs text-muted-foreground">Week 2 測驗</p>
            <p className="text-sm font-bold text-foreground">金錢的起源與信任</p>
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