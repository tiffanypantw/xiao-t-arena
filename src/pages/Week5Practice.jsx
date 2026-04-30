import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';

const QUESTIONS = [
  {
    id: 1, block: '基礎記憶', type: 'multiple_choice',
    question: '馬斯洛 (Maslow) 是一位什麼樣的人?',
    options: [
      '美國的數學家',
      '美國的心理學家，研究人類的需求層次',
      '台灣的老師',
      '英國的物理學家',
    ],
    answer: '美國的心理學家，研究人類的需求層次',
    explanation: '馬斯洛是 1943 年的美國心理學家，他研究發現人有五個層次的需求。',
  },
  {
    id: 2, block: '基礎記憶', type: 'multiple_choice',
    question: '馬斯洛需求金字塔最底層 (最基本) 是什麼?',
    options: [
      '自尊需求 (覺得自己很棒)',
      '社交需求 (有朋友)',
      '生理需求 (吃喝睡)',
      '自我實現 (追夢想)',
    ],
    answer: '生理需求 (吃喝睡)',
    explanation: '最底層是生理需求，要先吃飽喝足睡夠，才能往上想其他需求。',
  },
  {
    id: 3, block: '基礎記憶', type: 'multiple_choice',
    question: '當你的胃咕咕叫、頭暈暈的、覺得沒力氣，這是哪一種訊號在跟你說話?',
    options: [
      '腦袋的訊號',
      '身體的訊號',
      '朋友的訊號',
      '夢想的訊號',
    ],
    answer: '身體的訊號',
    explanation: '胃咕咕叫、頭暈、沒力氣都是身體在告訴你它需要食物或休息。',
  },
  {
    id: 4, block: '基礎理解', type: 'multiple_choice',
    question: '小明走進書店看到一本漂亮的新漫畫，心裡突然冒出「我好想要」，但他的胃並沒有咕咕叫。這個「想要」最可能是?',
    options: [
      '身體在說話 (生理需求)',
      '腦袋在說話 (不是生理需求)',
      '夢想在說話',
      '老師在說話',
    ],
    answer: '腦袋在說話 (不是生理需求)',
    explanation: '看到漂亮東西冒出的「想要」，通常是腦袋的訊號，不是身體真的需要。',
  },
  {
    id: 5, block: '基礎理解', type: 'multiple_choice',
    question: '【回顧 W4】小華開了一家手作飲料店，他發現除了珍珠和茶葉的錢，還要付房租、電費和員工薪水。這些「賺到的錢必須先扣掉的部分」叫做什麼?',
    options: [
      '收入',
      '成本',
      '想要',
      '需求',
    ],
    answer: '成本',
    explanation: '成本是經營一件事必須先付出的錢，要從收入扣掉之後，剩下的才是真正賺的。',
  },
  {
    id: 6, block: '基礎理解', type: 'multiple_choice',
    question: '小美說：「不課金的話，我會被遊戲裡的朋友邊緣化。」她想滿足的是哪一層需求?',
    options: [
      '生理需求 (吃喝睡)',
      '安全需求 (有地方住)',
      '社交需求 (被朋友認同)',
      '自我實現 (追夢想)',
    ],
    answer: '社交需求 (被朋友認同)',
    explanation: '怕被邊緣化、想要朋友認同，是第三層的社交需求。',
  },
  {
    id: 7, block: '基礎理解', type: 'multiple_choice',
    question: '為什麼當一個人擔心今天沒飯吃的時候，他通常很難認真思考「我想成為什麼樣的人」?',
    options: [
      '因為這個問題太難了',
      '因為下面的需求 (吃飯) 沒被滿足，很難跳到上面的需求 (夢想)',
      '因為大人不准他想',
      '因為他不夠聰明',
    ],
    answer: '因為下面的需求 (吃飯) 沒被滿足，很難跳到上面的需求 (夢想)',
    explanation: '馬斯洛發現，人通常要先滿足下面的需求，才會去想上面的需求。',
  },
  {
    id: 8, block: '實際應用', type: 'multiple_choice',
    question: '你今天考試考得很好，媽媽稱讚你，你覺得超開心。如果想要更常感受到這種「自尊需求」被滿足，以下哪個方法最有效?',
    options: [
      '一直拜託別人稱讚自己',
      '在自己努力後完成的事情上，慢慢累積真實的成就感 (運動、學一個新技能、幫忙做事)',
      '完全不在意別人怎麼說',
      '只追求物質的東西',
    ],
    answer: '在自己努力後完成的事情上，慢慢累積真實的成就感 (運動、學一個新技能、幫忙做事)',
    explanation: '自尊需求是來自「自己努力完成」的成就感，不是只有被稱讚。',
  },
  {
    id: 9, block: '實際應用', type: 'multiple_choice',
    question: '你看到同學買了新球鞋，你也突然好想要。如果你想學會「拆解自己的想要」，第一步應該做什麼?',
    options: [
      '馬上拜託爸媽買',
      '先問自己：「這個想要是身體在喊？還是腦袋在喊？它在滿足哪一層需求？」',
      '直接認定自己一定需要',
      '直接放棄，什麼都不買',
    ],
    answer: '先問自己：「這個想要是身體在喊？還是腦袋在喊？它在滿足哪一層需求？」',
    explanation: '這週老師說「需要還是想要，是你要學會問自己的問題」。先拆解再決定。',
  },
  {
    id: 10, block: '實際應用', type: 'multiple_choice',
    question: '小華想在遊戲裡課金，他爸媽看到時皺眉頭。根據這週學的，爸媽和小華站在不同位置，可能在想什麼不一樣的事?',
    options: [
      '爸媽和小華想的事情一定一模一樣',
      '爸媽常先想生理 / 安全需求 (這筆錢能不能留著吃飯付電費)，小華想的可能是社交或自我實現',
      '爸媽只是不愛小華',
      '小華永遠是錯的，爸媽永遠是對的',
    ],
    answer: '爸媽常先想生理 / 安全需求 (這筆錢能不能留著吃飯付電費)，小華想的可能是社交或自我實現',
    explanation: '老師說每個人站的位置不同，看到的景色也不同。爸媽的角色讓他們更在意基本需求。',
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
            <span className="font-semibold text-foreground">需要 vs 想要，以及馬斯洛的五層需求</span>
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
          <li>• 需要和想要有什麼不同？</li>
          <li>• 馬斯洛說人最基本的需求是什麼？</li>
        </ul>
      </div>
      <Button onClick={onRetry} className="w-full text-base py-5">🔁 重新挑戰</Button>
    </motion.div>
  );
}

export default function Week5Practice() {
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
        await saveProgress('week5', newCorrect, totalQuestions);
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
            <p className="text-xs text-muted-foreground">Week 5 測驗</p>
            <p className="text-sm font-bold text-foreground">需要 vs 想要 × 馬斯洛 5 層需求</p>
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