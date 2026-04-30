import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, XCircle, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  getOrCreateProgress,
  markQuizCompleted,
  submitOpenAnswer,
  submitTask,
  revealTask,
} from '@/api/weeklyProgress';
import { WEEKS } from '@/lib/redeemCodes';

// ==================
// 週次題目資料（之後可以擴充）
// ==================
const WEEK_DATA = {
  1: {
    title: 'Week 1',
    question: '如果世界沒有錢，真的會更公平嗎？',
    openQuestion: '你在生活中有沒有遇過「想換但換不成」的經驗？說說看當時發生了什麼事，你怎麼想的？',
    taskTitle: '本週任務',
    taskDescription: '去觀察你家附近或學校附近，有沒有人在做「交換」這件事（不一定是以物易物，可以是買賣、幫忙、互惠）。拍照或描述你看到的場景，並說說看：他們在交換什麼？你覺得這個交換公平嗎？',
    quizQuestions: [
      { id: 1, question: '以物易物是指用金錢購買商品。', answer: false, explanation: '以物易物是用物品直接交換物品，不涉及金錢。' },
      { id: 2, question: '交換要成功，雙方都要剛好想要對方的東西。', answer: true, explanation: '這叫做「雙重巧合」，是以物易物最大的限制。' },
      { id: 3, question: '金錢的出現讓交換變得更不方便。', answer: false, explanation: '金錢解決了以物易物的困難，讓交換更方便。' },
      { id: 4, question: '物品容易壞掉是以物易物的缺點之一。', answer: true, explanation: '食物等物品會腐壞，影響交換的效率。' },
      { id: 5, question: '沒有錢的世界一定比有錢的世界更公平。', answer: false, explanation: '沒有錢不一定更公平，以物易物有很多限制和不公平。' },
      { id: 6, question: '需求不對稱是以物易物的主要問題。', answer: true, explanation: '你有的東西對方不想要，這就是需求不對稱。' },
      { id: 7, question: '交換的本質是雙方各得到自己需要的東西。', answer: true, explanation: '成功的交換是讓雙方都獲得比原本更有價值的東西。' },
      { id: 8, question: '金錢只有紙鈔這一種形式。', answer: false, explanation: '金錢有很多形式，包含貝殼、金屬、紙鈔、數位貨幣等。' },
      { id: 9, question: '以物易物在現代社會完全消失了。', answer: false, explanation: '現代社會仍有以物易物，例如物品交換、技能互換等。' },
    ],
  },
  2: {
    title: 'Week 2',
    question: '金錢是怎麼出現的？',
    openQuestion: '如果你要發明一種新的「貨幣」，你會選什麼當作交換的媒介？為什麼？',
    taskTitle: '本週任務',
    taskDescription: '去找一個你家裡用到的東西，想想看：這個東西從原料到你手上，中間經過了哪些人的手？試著畫出或描述這個「交換鏈」。',
    quizQuestions: [
      { id: 1, question: '世界上最早的紙幣出現在中國。', answer: true, explanation: '中國宋朝出現了最早的紙幣「交子」。' },
      { id: 2, question: '古羅馬士兵的薪水是用金幣發放的。', answer: false, explanation: '古羅馬士兵的薪水是鹽（sal），英文薪水 salary 就是由此而來。' },
      { id: 3, question: '貝殼曾經被當作貨幣使用。', answer: true, explanation: '在古代許多文明中，貝殼是常見的貨幣形式。' },
      { id: 4, question: '商品貨幣是指政府印製的紙鈔。', answer: false, explanation: '商品貨幣是指用有實際價值的物品當作貨幣，例如鹽、貝殼。' },
      { id: 5, question: '金錢需要大家共同信任才能運作。', answer: true, explanation: '貨幣的價值建立在共同信任上，沒有信任就沒有交換。' },
      { id: 6, question: '數位支付（如行動支付）是一種新形式的貨幣。', answer: true, explanation: '數位支付代表貨幣形式的持續演進。' },
      { id: 7, question: '貨幣的主要功能是讓交換更困難。', answer: false, explanation: '貨幣的功能是讓交換更容易、更有效率。' },
      { id: 8, question: '鹽巴在古代之所以能當貨幣，是因為它稀少且有實用價值。', answer: true, explanation: '鹽巴耐儲存、可分割、大家都需要，符合貨幣的條件。' },
      { id: 9, question: '現代的法定貨幣背後有黃金支撐。', answer: false, explanation: '現代大多數法定貨幣不再以黃金為後盾，而是靠政府信用支撐。' },
    ],
  },
  3: {
    title: 'Week 3',
    question: '為什麼有些東西貴但大家還是搶著買？',
    openQuestion: '你有沒有買過或想買一個「很貴但覺得值得」的東西？那個東西對你來說的「價值」是什麼？',
    taskTitle: '本週任務',
    taskDescription: '去超市或便利商店，找兩個功能類似但價格差很多的商品（例如：不同品牌的餅乾、飲料）。觀察它們的差異，並思考：為什麼一個貴一個便宜？貴的東西有沒有「值得」的地方？',
    quizQuestions: [
      { id: 1, question: '價格越高代表東西的品質一定越好。', answer: false, explanation: '價格和品質不一定成正比，也受品牌、稀缺性等因素影響。' },
      { id: 2, question: '供給減少而需求不變時，價格通常會上升。', answer: true, explanation: '供需原理：供給少、需求大，價格就會上升。' },
      { id: 3, question: '同一樣東西對不同人可能有不同的價值。', answer: true, explanation: '價值是主觀的，取決於個人需求和偏好。' },
      { id: 4, question: '限量商品價格高是因為製造成本高。', answer: false, explanation: '限量商品價格高主要是因為稀缺性創造了更高的需求和心理價值。' },
      { id: 5, question: '品牌溢價是指人們為了品牌形象而額外付出的金額。', answer: true, explanation: '品牌溢價反映了消費者對品牌的信任和認同。' },
      { id: 6, question: '需求增加而供給不變時，價格通常會下降。', answer: false, explanation: '需求增加供給不變時，競爭會使價格上升。' },
      { id: 7, question: '便宜的東西一定比貴的東西價值低。', answer: false, explanation: '價格不等於價值，有些便宜的東西對你的價值可能很高。' },
      { id: 8, question: '稀缺性是影響價格的重要因素之一。', answer: true, explanation: '越稀少的東西，在需求存在的情況下，價格越高。' },
      { id: 9, question: '消費者購買決策只受到價格影響。', answer: false, explanation: '消費者決策受到品質、品牌、稀缺性、情感等多種因素影響。' },
    ],
  },
  4: {
    title: 'Week 4',
    question: '老闆賣東西真的賺那麼多嗎？',
    openQuestion: '如果你要開一家小店，你會賣什麼？試著想想看，你需要哪些成本才能開始營業？',
    taskTitle: '本週任務',
    taskDescription: '訪問你身邊一位做生意的大人（爸媽、親戚、鄰居都可以），問他們：做生意最大的成本是什麼？有沒有什麼成本是顧客看不到的？把你聽到的記錄下來。',
    quizQuestions: [
      { id: 1, question: '老闆賣出商品的收入等於他賺到的利潤。', answer: false, explanation: '收入減去成本才是利潤，成本包含原料、人力、租金等。' },
      { id: 2, question: '員工薪水是一種人力成本。', answer: true, explanation: '人力成本包含薪水、保險等雇用員工的所有費用。' },
      { id: 3, question: '便利商店的商品比夜市貴，是因為老闆更貪心。', answer: false, explanation: '便利商店有較高的租金、人力和物流成本，這些都反映在價格上。' },
      { id: 4, question: '利潤 = 收入 - 成本。', answer: true, explanation: '這是計算利潤最基本的公式。' },
      { id: 5, question: '原料成本是開餐廳唯一需要考慮的成本。', answer: false, explanation: '還有租金、水電、人力、設備等各種成本。' },
      { id: 6, question: '品牌行銷費用也是一種成本。', answer: true, explanation: '廣告、行銷活動都需要花錢，是重要的運營成本。' },
      { id: 7, question: '成本越低，利潤一定越高。', answer: false, explanation: '利潤取決於收入和成本的差距，降低成本但也降低品質可能影響銷售。' },
      { id: 8, question: '設備折舊也算是一種成本。', answer: true, explanation: '機器設備會隨時間損耗，這個損耗費用也是成本的一部分。' },
      { id: 9, question: '老闆定價時不需要考慮成本。', answer: false, explanation: '定價必須至少能覆蓋所有成本，才不會虧損。' },
    ],
  },
  5: {
    title: 'Week 5',
    question: '你買東西是「需要」還是「想要」？',
    openQuestion: '回想一次你最近的消費，它是「需要」還是「想要」？它滿足了馬斯洛的哪一層需求？你覺得值得嗎？',
    taskTitle: '本週任務',
    taskDescription: '記錄你這週的三筆消費（或想要購買的東西），並用馬斯洛的需求層次來分析：這是哪一層的需求？是身體的訊號還是腦袋的訊號？你覺得這個「想要」值得嗎？',
    quizQuestions: [
      { id: 1, question: '馬斯洛需求金字塔最底層是自我實現需求。', answer: false, explanation: '最底層是生理需求（吃喝睡），自我實現在最頂層。' },
      { id: 2, question: '「需要」通常來自身體的訊號。', answer: true, explanation: '餓了、渴了、累了都是身體告訴你的需求。' },
      { id: 3, question: '社交需求包含被朋友認同和接受。', answer: true, explanation: '社交需求是馬斯洛第三層，包含歸屬感和被接受。' },
      { id: 4, question: '課金遊戲一定是在滿足生理需求。', answer: false, explanation: '課金通常是在滿足社交（不被邊緣化）或自尊（在遊戲中出色）需求。' },
      { id: 5, question: '自尊需求只能靠別人稱讚來滿足。', answer: false, explanation: '自尊需求也可以靠自己的成就感來滿足。' },
      { id: 6, question: '生理需求被滿足後，才容易去追求更高層的需求。', answer: true, explanation: '馬斯洛認為需求有層次，低層需求先被滿足才會追求高層需求。' },
      { id: 7, question: '「想要」和「需要」對每個人來說都一樣。', answer: false, explanation: '「想要」是主觀的，同樣的東西對不同人可能是需要也可能是想要。' },
      { id: 8, question: '安全需求包含住所和穩定的生活環境。', answer: true, explanation: '安全需求是馬斯洛第二層，包含人身安全和生活穩定。' },
      { id: 9, question: '消費決策和馬斯洛需求層次沒有關係。', answer: false, explanation: '很多消費決策都在滿足不同層次的需求，理解這點可以幫助更理性消費。' },
    ],
  },
};

// ==================
// 判斷題元件
// ==================
function TrueFalseQuestion({ q, onAnswer, revealed }) {
  const [selected, setSelected] = useState(null);
  const [localRevealed, setLocalRevealed] = useState(false);

  const handleSelect = (answer) => {
    if (localRevealed) return;
    setSelected(answer);
    setLocalRevealed(true);
    const correct = answer === q.answer;
    setTimeout(() => onAnswer(q.id, correct), 800);
  };

  return (
    <div className={`rounded-xl border-2 p-4 transition-all ${
      localRevealed
        ? selected === q.answer
          ? 'border-green-300 bg-green-50'
          : 'border-red-300 bg-red-50'
        : 'border-border bg-card'
    }`}>
      <p className="text-sm font-medium text-foreground mb-3 leading-snug">
        Q{q.id}. {q.question}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => handleSelect(true)}
          disabled={localRevealed}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
            localRevealed && q.answer === true
              ? 'bg-green-500 text-white'
              : localRevealed && selected === true && q.answer !== true
              ? 'bg-red-400 text-white'
              : 'border-2 border-border hover:border-green-400 hover:bg-green-50'
          }`}
        >
          ✓ 對
        </button>
        <button
          onClick={() => handleSelect(false)}
          disabled={localRevealed}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
            localRevealed && q.answer === false
              ? 'bg-green-500 text-white'
              : localRevealed && selected === false && q.answer !== false
              ? 'bg-red-400 text-white'
              : 'border-2 border-border hover:border-red-400 hover:bg-red-50'
          }`}
        >
          ✗ 錯
        </button>
      </div>
      {localRevealed && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs text-slate-600 leading-relaxed"
        >
          {selected === q.answer ? '✓ ' : '✗ '}{q.explanation}
        </motion.p>
      )}
    </div>
  );
}

// ==================
// 主頁面
// ==================
export default function WeekLearning() {
  const { weekNumber } = useParams();
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const weekNum = parseInt(weekNumber);
  const weekData = WEEK_DATA[weekNum];

  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  // 練習題狀態
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizAllCorrect, setQuizAllCorrect] = useState(false);

  // 開放題狀態
  const [openAnswer, setOpenAnswer] = useState('');
  const [submittingOpen, setSubmittingOpen] = useState(false);

  // 任務狀態
  const [taskText, setTaskText] = useState('');
  const [taskImages, setTaskImages] = useState([]);
  const [uploadingTask, setUploadingTask] = useState(false);

  // 禮物揭曉狀態
  const [revealing, setRevealing] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const openAnswerRef = useRef(null);

  // 載入進度
  useEffect(() => {
    if (!user || !weekNum) return;
    const load = async () => {
      setLoading(true);
      const p = await getOrCreateProgress(user.uid, weekNum);
      setProgress(p);
      setLoading(false);
    };
    load();
  }, [user, weekNum]);

  // 沒有這週的資料
  if (!weekData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-4xl">🔒</div>
          <p className="font-black text-foreground">這週的內容還沒開放</p>
          <button onClick={() => navigate('/Home')} className="text-sm text-muted-foreground underline">
            回到首頁
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  // 判斷題答題
  const handleQuizAnswer = async (questionId, correct) => {
    const newAnswers = { ...quizAnswers, [questionId]: correct };
    setQuizAnswers(newAnswers);

    const total = weekData.quizQuestions.length;
    const answeredAll = Object.keys(newAnswers).length === total;
    const allCorrect = Object.values(newAnswers).every(Boolean);

    if (answeredAll && allCorrect) {
      setQuizAllCorrect(true);
      if (!progress?.quizCompleted) {
        await markQuizCompleted(user.uid, weekNum);
        setProgress((prev) => ({ ...prev, quizCompleted: true }));
      }
      // 滾動到開放題
      setTimeout(() => {
        openAnswerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    }
  };

  // 重做練習題
  const handleRetryQuiz = () => {
    setQuizAnswers({});
    setQuizAllCorrect(false);
  };

  // 提交開放題
  const handleSubmitOpen = async () => {
    if (openAnswer.trim().length < 30) return;
    setSubmittingOpen(true);
    await submitOpenAnswer(user.uid, weekNum, openAnswer.trim());
    setProgress((prev) => ({
      ...prev,
      openAnswerContent: openAnswer.trim(),
      openAnswerSubmittedAt: new Date(),
    }));
    setSubmittingOpen(false);
  };

  // 上傳圖片
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (taskImages.length + files.length > 3) {
      alert('最多上傳 3 張圖片');
      return;
    }
    const validFiles = files.filter((f) => {
      if (f.size > 5 * 1024 * 1024) {
        alert(`${f.name} 超過 5MB 限制`);
        return false;
      }
      return true;
    });
    setTaskImages((prev) => [...prev, ...validFiles]);
  };

  // 提交任務
  const handleSubmitTask = async () => {
    if (taskText.trim().length < 50) return;
    setUploadingTask(true);
    try {
      // 上傳圖片到 Storage
      const imageUrls = await Promise.all(
        taskImages.map(async (file) => {
          const timestamp = Date.now();
          const storageRef = ref(
            storage,
            `submissions/${user.uid}/week-${weekNum}/${timestamp}_${file.name}`
          );
          await uploadBytes(storageRef, file);
          return getDownloadURL(storageRef);
        })
      );
      await submitTask(user.uid, weekNum, taskText.trim(), imageUrls);
      setProgress((prev) => ({
        ...prev,
        taskText: taskText.trim(),
        taskImageUrls: imageUrls,
        taskSubmittedAt: new Date(),
      }));
    } catch (err) {
      console.error('提交失敗', err);
      alert('上傳失敗，請再試一次');
    }
    setUploadingTask(false);
  };

  // 揭曉禮物
  const handleReveal = async () => {
    setRevealing(true);
    await revealTask(user.uid, weekNum);
    setTimeout(() => {
      setRevealing(false);
      setRevealed(true);
      setProgress((prev) => ({ ...prev, taskRevealed: true }));
    }, 2000);
  };

  // 判斷各區段狀態
  const quizState = progress?.quizCompleted
    ? progress?.openAnswerSeenAt
      ? 'badge-earned'
      : progress?.openAnswerSubmittedAt
      ? 'open-submitted'
      : 'open-pending'
    : 'quiz-pending';

  const taskState = progress?.taskApprovedAt
    ? progress?.taskRevealed || revealed
      ? 'card-revealed'
      : 'approved'
    : progress?.taskSubmittedAt
    ? 'task-submitted'
    : 'task-pending';

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/Home')}
            className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <p className="text-xs text-muted-foreground">{weekData.title}</p>
            <p className="text-sm font-black text-foreground leading-snug">{weekData.question}</p>
          </div>
        </div>

        {/* ==================
            練習題區
        ================== */}
        <div className="bg-card border-2 border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-foreground">🟦 練習題</h2>
            {quizState === 'badge-earned' && (
              <span className="text-xs bg-violet-100 text-violet-700 font-bold px-2 py-1 rounded-full">
                🏅 徽章已獲得
              </span>
            )}
          </div>

          {/* 狀態 1：還沒完成判斷題 */}
          {(quizState === 'quiz-pending') && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                9 題判斷題，全對才能繼續 ✓
              </p>
              {weekData.quizQuestions.map((q) => (
                <TrueFalseQuestion
                  key={q.id}
                  q={q}
                  onAnswer={handleQuizAnswer}
                  revealed={quizAnswers[q.id] !== undefined}
                />
              ))}
              {/* 有答錯的話顯示重做 */}
              {Object.keys(quizAnswers).length === weekData.quizQuestions.length &&
                !quizAllCorrect && (
                  <div className="text-center pt-2 space-y-3">
                    <p className="text-sm text-red-500">有幾題答錯了，再想想看！</p>
                    <Button onClick={handleRetryQuiz} variant="outline" className="w-full">
                      🔁 重新挑戰
                    </Button>
                  </div>
                )}
            </div>
          )}

          {/* 狀態 2：判斷題全對，等待提交開放題 */}
          {(quizState === 'open-pending' || quizAllCorrect) && !progress?.openAnswerSubmittedAt && (
            <div ref={openAnswerRef} className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
                🎉 判斷題全對！現在來回答這個問題：
              </div>
              <p className="text-sm font-bold text-foreground leading-relaxed">
                {weekData.openQuestion}
              </p>
              <textarea
                value={openAnswer}
                onChange={(e) => setOpenAnswer(e.target.value)}
                placeholder="請寫下你的想法（至少 30 字）..."
                rows={5}
                className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-foreground resize-none leading-relaxed"
              />
              <div className="flex items-center justify-between">
                <span className={`text-xs ${openAnswer.trim().length >= 30 ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {openAnswer.trim().length} / 30 字
                </span>
                <Button
                  onClick={handleSubmitOpen}
                  disabled={openAnswer.trim().length < 30 || submittingOpen}
                  className="px-6"
                >
                  {submittingOpen ? '提交中...' : '提交 →'}
                </Button>
              </div>
            </div>
          )}

          {/* 狀態 3：開放題已提交，等老師看 */}
          {quizState === 'open-submitted' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center space-y-2">
              <div className="text-2xl">⏳</div>
              <p className="text-sm font-bold text-amber-700">等待老師看見...</p>
              <p className="text-xs text-amber-600">老師會在 1–3 天內回應</p>
            </div>
          )}

          {/* 狀態 4：老師已看見，獲得徽章 */}
          {quizState === 'badge-earned' && (
            <div className="space-y-3">
              <div className="bg-violet-50 border-2 border-violet-200 rounded-xl p-4 text-center space-y-2">
                <div className="text-3xl">🏅</div>
                <p className="text-sm font-black text-violet-700">老師看見你了！</p>
                {progress?.encouragementMessage && (
                  <p className="text-sm text-violet-600 italic">
                    「{progress.encouragementMessage}」
                  </p>
                )}
              </div>
              <div className="bg-muted/50 rounded-xl p-3">
                <p className="text-xs text-muted-foreground font-semibold mb-1">你的回答</p>
                <p className="text-sm text-foreground leading-relaxed">
                  {progress?.openAnswerContent}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ==================
            任務區
        ================== */}
        <div className="bg-card border-2 border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-foreground">🟨 {weekData.taskTitle}</h2>
            {taskState === 'card-revealed' && (
              <span className="text-xs bg-teal-100 text-teal-700 font-bold px-2 py-1 rounded-full">
                🎴 卡片已獲得
              </span>
            )}
          </div>

          {/* 任務說明 */}
          <div className="bg-muted/40 rounded-xl p-4">
            <p className="text-sm text-foreground leading-relaxed">
              {weekData.taskDescription}
            </p>
          </div>

          {/* 狀態 1：還沒提交任務 */}
          {taskState === 'task-pending' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">你的任務記錄</label>
                <textarea
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  placeholder="描述你觀察或完成的內容（至少 50 字）..."
                  rows={5}
                  className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-foreground resize-none leading-relaxed"
                />
                <span className={`text-xs ${taskText.trim().length >= 50 ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {taskText.trim().length} / 50 字
                </span>
              </div>

              {/* 圖片上傳 */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">
                  附上照片（最多 3 張，選填）
                </label>
                <div className="flex flex-wrap gap-2">
                  {taskImages.map((file, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`預覽 ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded-xl border border-border"
                      />
                      <button
                        onClick={() => setTaskImages((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {taskImages.length < 3 && (
                    <label className="w-20 h-20 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-foreground transition-colors">
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-1">上傳</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </div>

              <Button
                onClick={handleSubmitTask}
                disabled={taskText.trim().length < 50 || uploadingTask}
                className="w-full"
              >
                {uploadingTask ? '上傳中...' : '提交任務 →'}
              </Button>
            </div>
          )}

          {/* 狀態 2：任務已提交，等老師審核 */}
          {taskState === 'task-submitted' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center space-y-2">
              <div className="text-2xl">⏳</div>
              <p className="text-sm font-bold text-amber-700">等待老師回饋...</p>
              <p className="text-xs text-amber-600">老師審核後會有禮物給你</p>
              <div className="bg-white rounded-lg p-3 mt-2 text-left">
                <p className="text-xs text-muted-foreground">你提交的內容：</p>
                <p className="text-sm text-foreground mt-1 leading-relaxed">
                  {progress?.taskText?.slice(0, 100)}...
                </p>
              </div>
            </div>
          )}

          {/* 狀態 3：已通過，可以拆禮物 */}
          {taskState === 'approved' && (
            <div className="text-center space-y-4">
              <motion.button
                onClick={handleReveal}
                disabled={revealing}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-gradient-to-r from-amber-400 to-orange-400 text-white font-black text-lg rounded-2xl py-5 shadow-lg"
              >
                {revealing ? '✨ 打開中...' : '老師有禮物給你 🎁'}
              </motion.button>
              {revealing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl"
                >
                  ✨ 🎁 ✨
                </motion.div>
              )}
            </div>
          )}

          {/* 狀態 4：已揭曉，顯示回饋和卡片 */}
          {taskState === 'card-revealed' && (
            <div className="space-y-3">
              <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-4 text-center space-y-2">
                <div className="text-3xl">🎴</div>
                <p className="text-sm font-black text-teal-700">任務完成！卡片已解鎖！</p>
              </div>
              {progress?.taskFeedback && (
                <div className="bg-muted/50 rounded-xl p-4 space-y-1">
                  <p className="text-xs text-muted-foreground font-semibold">老師的回饋</p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {progress.taskFeedback}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}