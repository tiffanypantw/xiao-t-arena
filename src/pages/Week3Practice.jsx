import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';

const QUESTIONS = [
  {
    id: 1, block: '基礎記憶', type: 'multiple_choice',
    question: '「價值」最接近哪個意思？',
    options: ['東西的標價數字', '對你在某個時候有幫助的東西或服務', '東西的重量或大小', '老闆決定要賣多少錢'],
    answer: '對你在某個時候有幫助的東西或服務',
    explanation: '價值是指某樣東西在某個時間點、某個情境下，對你有沒有幫助、能不能解決你的問題。',
  },
  {
    id: 2, block: '基礎記憶', type: 'multiple_choice',
    question: '「供給」是指什麼？',
    options: ['想要買某樣東西的人有多少', '市場上這個東西現在有多少', '東西的製作成本', '老闆的利潤'],
    answer: '市場上這個東西現在有多少',
    explanation: '供給是指市場上現在提供了多少這個東西，也就是有多少人在賣。',
  },
  {
    id: 3, block: '基礎記憶', type: 'multiple_choice',
    question: '「價值主張」是指一個品牌在告訴你什麼？',
    options: ['這個東西的重量和尺寸', '買我，你不只得到產品，還得到其他體驗和價值', '這個東西現在打折', '這個東西是誰做的'],
    answer: '買我，你不只得到產品，還得到其他體驗和價值',
    explanation: '價值主張是品牌向你說明，你除了買到產品本身，還能得到什麼額外的體驗或好處。',
  },
  {
    id: 4, block: '基礎理解', type: 'multiple_choice',
    question: '同一瓶水，在便利商店賣20塊，但在沙漠裡可能讓你願意付更多錢。這說明了什麼？',
    options: ['沙漠的水品質比較好', '價值會因為情境和你有多需要它而改變', '水的價格是固定的', '便利商店賣太便宜了'],
    answer: '價值會因為情境和你有多需要它而改變',
    explanation: '水本身沒變，但在沙漠裡你非常需要它又很難得到，所以它的價值變得更高了。',
  },
  {
    id: 5, block: '基礎理解', type: 'multiple_choice',
    question: '小美去圖書館免費借書，但這本書她非常想看。以下哪個說法最正確？',
    options: ['免費的東西就沒有價值', '這本書的價格低，但對小美的價值很高', '這本書又貴又有價值', '價格高才代表價值高'],
    answer: '這本書的價格低，但對小美的價值很高',
    explanation: '價格和價值是不同的事。書的借閱價格趨近於零，但它對小美來說帶來的知識和幫助是有價值的。',
  },
  {
    id: 6, block: '基礎理解', type: 'multiple_choice',
    question: '全台灣只剩100杯珍珠奶茶，但有100萬人想喝。這時候價格最可能怎麼變化？',
    options: ['價格下降，因為老闆想賣光', '價格不變，因為東西還是一樣的', '價格上升，因為供給少需求多', '價格變成免費，因為老闆很好心'],
    answer: '價格上升，因為供給少需求多',
    explanation: '供給少、需求多的時候，大家都願意出更多錢來搶那少數的東西，所以價格就會上升。',
  },
  {
    id: 7, block: '基礎理解', type: 'multiple_choice',
    question: '小明看到一雙限量球鞋，標價一萬元。小明不喜歡球鞋，覺得沒什麼用。這個情況說明了什麼？',
    options: ['這雙鞋一定很爛', '貴的東西對每個人來說價值都一樣', '價格高不代表對每個人都有相同的價值', '小明應該買下來投資'],
    answer: '價格高不代表對每個人都有相同的價值',
    explanation: '同一樣東西，對不同的人來說價值是不同的。小明不在意球鞋，所以即使它很貴，對他來說價值也不高。',
  },
  {
    id: 8, block: '實際應用', type: 'multiple_choice',
    question: '你媽媽說：「這個玩具不用買這麼貴的，功能都一樣。」你用這週學的概念，最好的回答是哪一個？',
    options: ['「那就買最貴的才是最好的！」', '「媽媽你不懂，貴的一定比較好。」', '「媽媽，你說得有道理。我覺得功能一樣的話，便宜的對我來說價值也夠高了。」', '「反正我就是想要那個，就買那個。」'],
    answer: '「媽媽，你說得有道理。我覺得功能一樣的話，便宜的對我來說價值也夠高了。」',
    explanation: '能說出「這樣東西帶給我的價值值不值這個價格」，才是真正理解價值和價格的差別。',
  },
  {
    id: 9, block: '實際應用', type: 'multiple_choice',
    question: '小華的學校附近突然開了十家賣相同文具的店，但買的人沒有變多。小華推測文具的價格會怎樣？',
    options: ['價格會上升，因為店變多了', '價格會下降，因為供給多需求沒變', '價格完全不受影響', '價格先上升再下降'],
    answer: '價格會下降，因為供給多需求沒變',
    explanation: '供給變多但需求不變，各家店都要努力賣出去，競爭下價格通常會降低。',
  },
  {
    id: 10, block: '實際應用', type: 'multiple_choice',
    question: '小李想買一杯300元的品牌珍珠奶茶，他的朋友說「你傻嗎，50元也喝得到」。小李最能說服朋友的理由是哪一個？',
    options: ['「貴的就是比較好！」', '「因為我有錢，我就是要買。」', '「因為我很在意那個品牌的空間體驗和設計，這個對我來說值這個價格。」', '「反正你也不懂，別管我。」'],
    answer: '「因為我很在意那個品牌的空間體驗和設計，這個對我來說值這個價格。」',
    explanation: '能說出你為什麼願意付這個價格、它帶給你什麼價值，才是真正懂得為自己的選擇負責。',
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

  const handleConfirm = () => {
    if (!selected) return;
    setRevealed(true);
    setTimeout(() => onAnswer(selected === q.answer), 900);
  };

  return (
    <CardShell q={q}>
      <div className="space-y-2 mt-4">
        {q.options.map((opt, i) => {
          const isSelected = selected === opt;
          const isCorrect = opt === q.answer;
          let style = 'border-border bg-card text-foreground';
          if (revealed) {
            if (isCorrect) style = 'border-green-500 bg-green-50 text-green-800';
            else if (isSelected && !isCorrect) style = 'border-red-400 bg-red-50 text-red-700';
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
      {!revealed && selected && <Button onClick={handleConfirm} className="w-full mt-3">確認答案</Button>}
      {revealed && <FeedbackRow correct={selected === q.answer} correctLabel={q.answer} explanation={q.explanation} />}
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
            <span className="font-semibold text-foreground">價格和價值是不同的事</span>
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
          <li>• 價格和價值一樣嗎？</li>
          <li>• 同一樣東西對不同人的價值一樣嗎？</li>
        </ul>
      </div>
      <Button onClick={onRetry} className="w-full text-base py-5">🔁 重新挑戰</Button>
    </motion.div>
  );
}

export default function Week3Practice() {
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
        await saveProgress('week3', newCorrect, totalQuestions);
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
            <p className="text-xs text-muted-foreground">Week 3 測驗</p>
            <p className="text-sm font-bold text-foreground">為什麼有些東西貴但大家還是搶著買？</p>
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