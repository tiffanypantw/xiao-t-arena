import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, X, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { useBrand } from '@/lib/BrandContext';
import { useWeek } from '@/lib/hooks/useContent';
import { hasThemeAccess } from '@/api/arenaAccess';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  getOrCreateProgress,
  markQuizCompleted,
  submitOpenAnswer,
  submitTask,
  revealTask,
  submitChildReply,
} from '@/api/weeklyProgress';

// 把 YouTube watch URL 轉成 embed URL（支援 youtu.be 短網址）
function getEmbedUrl(url) {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?#]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  return url; // 已經是 embed URL 或 Vimeo 等
}


// ==================
// 選擇題元件
// ==================
function MultipleChoiceQuestion({ q, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const isCorrect = selected === q.answer;

  const handleConfirm = () => {
    if (!selected) return;
    setRevealed(true);
    setTimeout(() => onAnswer(q.id, isCorrect), 900);
  };

  return (
    <div className={`rounded-xl border-2 p-4 transition-all ${
      revealed
        ? isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
        : 'border-border bg-card'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-semibold">{q.block}</span>
        <span className="text-xs text-muted-foreground">Q{q.id}</span>
      </div>
      <p className="text-sm font-bold text-foreground leading-snug mb-3">{q.question}</p>
      <div className="space-y-2">
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
            <button
              key={opt}
              onClick={() => !revealed && setSelected(opt)}
              className={`w-full text-left rounded-xl border-2 px-3 py-2 text-sm font-medium transition-all ${style}`}
            >
              <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
            </button>
          );
        })}
      </div>
      {!revealed && selected && (
        <Button onClick={handleConfirm} className="w-full mt-3" size="sm">確認答案</Button>
      )}
      {revealed && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs text-slate-600 leading-relaxed"
        >
          {isCorrect ? '✓ ' : '✗ '}{q.explanation}
        </motion.p>
      )}
    </div>
  );
}
// ==================
// 是非題元件
// ==================
function TrueFalseQuestion({ q, onAnswer }) {
  const [selected, setSelected] = useState(null); // true / false
  const [revealed, setRevealed] = useState(false);
  const isCorrect = selected === q.answer;

  const handleConfirm = () => {
    if (selected === null) return;
    setRevealed(true);
    setTimeout(() => onAnswer(q.id, selected === q.answer), 900);
  };

  const opts = [
    { val: true, label: '⭕️ 對' },
    { val: false, label: '❌ 錯' },
  ];

  return (
    <div className={`rounded-xl border-2 p-4 transition-all ${
      revealed
        ? isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
        : 'border-border bg-card'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-semibold">{q.block}</span>
        <span className="text-xs text-muted-foreground">Q{q.id} · 是非題</span>
      </div>
      <p className="text-sm font-bold text-foreground leading-snug mb-3">{q.question}</p>
      <div className="grid grid-cols-2 gap-2">
        {opts.map((opt) => {
          const isSelected = selected === opt.val;
          const isOptCorrect = opt.val === q.answer;
          let style = 'border-border bg-card text-foreground';
          if (revealed) {
            if (isOptCorrect) style = 'border-green-500 bg-green-50 text-green-800';
            else if (isSelected && !isOptCorrect) style = 'border-red-400 bg-red-50 text-red-700';
          } else if (isSelected) {
            style = 'border-foreground bg-foreground text-background';
          }
          return (
            <button
              key={String(opt.val)}
              onClick={() => !revealed && setSelected(opt.val)}
              className={`rounded-xl border-2 px-3 py-3 text-sm font-bold text-center transition-all ${style}`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {!revealed && selected !== null && (
        <Button onClick={handleConfirm} className="w-full mt-3" size="sm">確認答案</Button>
      )}
      {revealed && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs text-slate-600 leading-relaxed"
        >
          {isCorrect ? '✓ ' : '✗ '}{q.explanation}
        </motion.p>
      )}
    </div>
  );
}

// ==================
// 配對題元件（點左邊的詞 → 點右邊的描述）
// ==================
function MatchingQuestion({ q, onAnswer }) {
  // 右邊描述洗牌一次
  const [rights] = useState(() => {
    const arr = q.pairs.map((p) => p.right);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });
  const [activeLeft, setActiveLeft] = useState(null); // 左邊被選中的 index
  const [links, setLinks] = useState({}); // leftIndex -> right 字串
  const [revealed, setRevealed] = useState(false);

  const allLinked = Object.keys(links).length === q.pairs.length;
  const isCorrect = q.pairs.every((p, i) => links[i] === p.right);

  const linkedLeftOf = (right) => {
    const found = Object.entries(links).find(([, r]) => r === right);
    return found ? Number(found[0]) : null;
  };

  const tapLeft = (i) => {
    if (revealed) return;
    setActiveLeft(activeLeft === i ? null : i);
  };

  const tapRight = (right) => {
    if (revealed) return;
    const already = linkedLeftOf(right);
    const next = { ...links };
    if (activeLeft === null) {
      // 沒選左邊：點已連好的描述 = 取消那條連線
      if (already !== null) {
        delete next[already];
        setLinks(next);
      }
      return;
    }
    if (already !== null) delete next[already];
    next[activeLeft] = right;
    setLinks(next);
    setActiveLeft(null);
  };

  const handleConfirm = () => {
    if (!allLinked) return;
    setRevealed(true);
    setTimeout(() => onAnswer(q.id, isCorrect), 900);
  };

  return (
    <div className={`rounded-xl border-2 p-4 transition-all ${
      revealed
        ? isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
        : 'border-border bg-card'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-semibold">{q.block}</span>
        <span className="text-xs text-muted-foreground">Q{q.id} · 配對題</span>
      </div>
      <p className="text-sm font-bold text-foreground leading-snug mb-1">{q.question}</p>
      <p className="text-xs text-muted-foreground mb-3">先點一個詞，再點它的描述，把它們連起來。</p>

      {/* 左邊：詞 */}
      <div className="flex flex-wrap gap-2 mb-3">
        {q.pairs.map((p, i) => {
          const linked = links[i] != null;
          const active = activeLeft === i;
          return (
            <button
              key={p.left}
              onClick={() => tapLeft(i)}
              className={`rounded-xl border-2 px-3 py-1.5 text-sm font-bold transition-all ${
                active
                  ? 'border-foreground bg-foreground text-background'
                  : linked
                  ? 'border-violet-300 bg-violet-50 text-violet-700'
                  : 'border-border bg-card text-foreground'
              }`}
            >
              {p.left}{linked ? ' ✓' : ''}
            </button>
          );
        })}
      </div>

      {/* 右邊：描述 */}
      <div className="space-y-2">
        {rights.map((right) => {
          const leftIdx = linkedLeftOf(right);
          const truePair = q.pairs.find((p) => p.right === right);
          const rightIsCorrect = leftIdx !== null && q.pairs[leftIdx]?.right === truePair?.right && q.pairs[leftIdx]?.left === truePair?.left;
          let style = 'border-border bg-card text-foreground';
          if (revealed) {
            style = rightIsCorrect
              ? 'border-green-500 bg-green-50 text-green-800'
              : 'border-red-400 bg-red-50 text-red-700';
          } else if (leftIdx !== null) {
            style = 'border-violet-300 bg-violet-50 text-foreground';
          }
          return (
            <button
              key={right}
              onClick={() => tapRight(right)}
              className={`w-full text-left rounded-xl border-2 px-3 py-2 text-sm font-medium transition-all flex items-center gap-2 ${style}`}
            >
              <span className={`shrink-0 text-xs font-black rounded-lg px-2 py-0.5 ${
                leftIdx !== null ? 'bg-violet-600 text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {leftIdx !== null ? q.pairs[leftIdx].left : '？'}
              </span>
              <span>{right}</span>
              {revealed && !rightIsCorrect && truePair && (
                <span className="ml-auto text-xs text-green-700 shrink-0">→ {truePair.left}</span>
              )}
            </button>
          );
        })}
      </div>

      {!revealed && allLinked && (
        <Button onClick={handleConfirm} className="w-full mt-3" size="sm">確認答案</Button>
      )}
      {revealed && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs text-slate-600 leading-relaxed"
        >
          {isCorrect ? '✓ ' : '✗ '}{q.explanation}
        </motion.p>
      )}
    </div>
  );
}

// ==================
// 簡答題元件（送出後進老師批改）
// ==================
function TextQuestion({ q, onAnswer, initialPayload }) {
  const [text, setText] = useState(initialPayload?.answer || '');
  const [submitted, setSubmitted] = useState(!!initialPayload);
  const min = q.minChars || 10;

  const handleSubmit = () => {
    if (text.trim().length < min) return;
    setSubmitted(true);
    onAnswer(q.id, true, { question: q.question, answer: text.trim() });
  };

  return (
    <div className={`rounded-xl border-2 p-4 transition-all ${
      submitted ? 'border-green-300 bg-green-50' : 'border-border bg-card'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-semibold">{q.block}</span>
        <span className="text-xs text-muted-foreground">Q{q.id} · 簡答題</span>
        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">✍️ 老師會親自看</span>
      </div>
      <p className="text-sm font-bold text-foreground leading-snug mb-3">{q.question}</p>

      {!submitted && (
        <div className="space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={q.placeholder || '寫下你的想法...'}
            rows={3}
            className="w-full border-2 border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-foreground resize-none leading-relaxed bg-white"
          />
          <div className="flex items-center justify-between">
            <span className={`text-xs ${text.trim().length >= min ? 'text-green-600' : 'text-muted-foreground'}`}>
              {text.trim().length} / {min} 字
            </span>
            <Button onClick={handleSubmit} disabled={text.trim().length < min} size="sm" className="px-5">送出</Button>
          </div>
        </div>
      )}

      {submitted && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <div className="bg-white/70 rounded-xl p-3">
            <p className="text-xs text-muted-foreground font-semibold mb-1">你的回答</p>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{text}</p>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">✓ 已送出，這題沒有標準答案，老師會看到你的想法。{q.explanation}</p>
        </motion.div>
      )}
    </div>
  );
}

// ==================
// 圖文題元件（文字 + 可附照片，送出後進老師批改）
// ==================
function TextOrImageQuestion({ q, onAnswer, uploader, initialPayload }) {
  const [text, setText] = useState(initialPayload?.answer || '');
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(!!initialPayload);
  const [busy, setBusy] = useState(false);
  const [savedUrls, setSavedUrls] = useState(initialPayload?.imageUrls || []);
  const min = q.minChars || 20;

  const pickFiles = (e) => {
    const picked = Array.from(e.target.files);
    if (files.length + picked.length > 2) { alert('這題最多附 2 張圖'); return; }
    const valid = picked.filter((f) => {
      if (f.size > 5 * 1024 * 1024) { alert(`${f.name} 超過 5MB 限制`); return false; }
      return true;
    });
    setFiles((prev) => [...prev, ...valid]);
  };

  const handleSubmit = async () => {
    if (text.trim().length < min || busy) return;
    setBusy(true);
    try {
      const urls = files.length > 0 ? await uploader(q.id, files) : [];
      setSavedUrls(urls);
      setSubmitted(true);
      onAnswer(q.id, true, { question: q.question, answer: text.trim(), imageUrls: urls });
    } catch (err) {
      console.error('圖片上傳失敗', err);
      alert('上傳失敗，請再試一次');
    }
    setBusy(false);
  };

  return (
    <div className={`rounded-xl border-2 p-4 transition-all ${
      submitted ? 'border-green-300 bg-green-50' : 'border-border bg-card'
    }`}>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-semibold">{q.block}</span>
        <span className="text-xs text-muted-foreground">Q{q.id} · 圖文題</span>
        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">✍️ 老師會親自回覆</span>
      </div>
      <p className="text-sm font-bold text-foreground leading-snug mb-3">{q.question}</p>

      {!submitted && (
        <div className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={q.placeholder || '寫下你的觀察...'}
            rows={4}
            className="w-full border-2 border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-foreground resize-none leading-relaxed bg-white"
          />
          <div className="flex flex-wrap gap-2">
            {files.map((file, idx) => (
              <div key={idx} className="relative">
                <img src={URL.createObjectURL(file)} alt={`附圖 ${idx + 1}`} className="w-16 h-16 object-cover rounded-xl border border-border" />
                <button onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {files.length < 2 && (
              <label className="w-16 h-16 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-foreground transition-colors">
                <Upload className="w-4 h-4 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground mt-0.5">拍照/畫圖</span>
                <input type="file" accept="image/jpeg,image/png" multiple className="hidden" onChange={pickFiles} />
              </label>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-xs ${text.trim().length >= min ? 'text-green-600' : 'text-muted-foreground'}`}>
              {text.trim().length} / {min} 字
            </span>
            <Button onClick={handleSubmit} disabled={text.trim().length < min || busy} size="sm" className="px-5">
              {busy ? '上傳中...' : '送出'}
            </Button>
          </div>
        </div>
      )}

      {submitted && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <div className="bg-white/70 rounded-xl p-3">
            <p className="text-xs text-muted-foreground font-semibold mb-1">你的回答</p>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{text}</p>
            {savedUrls.length > 0 && (
              <div className="flex gap-2 mt-2">
                {savedUrls.map((u, i) => (
                  <img key={u} src={u} alt={`附圖 ${i + 1}`} className="w-16 h-16 object-cover rounded-xl border border-border" />
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">✓ 已送出，老師會親自回覆這題。{q.explanation}</p>
        </motion.div>
      )}
    </div>
  );
}

// ==================
// 題型分派器
// ==================
function QuizQuestion({ q, onAnswer, uploader, initialPayload }) {
  switch (q.type) {
    case 'true_false':
      return <TrueFalseQuestion q={q} onAnswer={onAnswer} />;
    case 'matching':
      return <MatchingQuestion q={q} onAnswer={onAnswer} />;
    case 'text':
      return <TextQuestion q={q} onAnswer={onAnswer} initialPayload={initialPayload} />;
    case 'text_or_image':
      return <TextOrImageQuestion q={q} onAnswer={onAnswer} uploader={uploader} initialPayload={initialPayload} />;
    default:
      return <MultipleChoiceQuestion q={q} onAnswer={onAnswer} />;
  }
}

// ==================
// 對話元件（雙向對話 thread + 回覆框）
// ==================
function ConversationThread({ conversation, onReply }) {
  const brand = useBrand();
  const teacherName = brand?.teacherName || 'Tiffany 老師';
  const teacherEmoji = brand?.teacherEmoji || '👩‍🏫';
  const locale = brand?.locale || 'zh-TW';

  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);

  // 判斷是否可以回覆（最後一則必須是老師的訊息）
  const lastMessage = conversation[conversation.length - 1];
  const canReply = lastMessage?.role === 'teacher';

  const handleReplySubmit = async () => {
    if (replyText.trim().length < 10) return;
    setSubmitting(true);
    try {
      await onReply(replyText.trim());
      setReplyText('');
      setShowReplyBox(false);
    } catch (err) {
      alert(err.message || '送出失敗，請再試一次');
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-3">
      {/* 對話列表 */}
      <div className="space-y-3">
        {conversation.map((msg, idx) => {
          const isTeacher = msg.role === 'teacher';
          return (
            <div
              key={idx}
              className={`rounded-xl p-4 ${
                isTeacher
                  ? 'bg-violet-50 border border-violet-100'
                  : 'bg-amber-50 border border-amber-100 ml-6'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold">
                  {isTeacher ? `${teacherEmoji} ${teacherName}` : '💬 你'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(msg.timestamp).toLocaleDateString(locale, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                {msg.content}
              </p>
            </div>
          );
        })}
      </div>

      {/* 回覆區 */}
      {canReply && !showReplyBox && (
        <button
          onClick={() => setShowReplyBox(true)}
          className="w-full border-2 border-dashed border-violet-200 text-violet-600 font-bold py-3 rounded-xl hover:bg-violet-50 transition-all flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          回覆 {teacherName}
        </button>
      )}

      {canReply && showReplyBox && (
        <div className="bg-violet-50 border-2 border-violet-200 rounded-xl p-4 space-y-3">
          <p className="text-xs text-violet-700 font-semibold">
            💬 你的回應（讓 {teacherName} 看到你的想法）
          </p>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`把你的想法寫給 ${teacherName}...`}
            rows={4}
            className="w-full border border-violet-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-400 resize-none leading-relaxed bg-white"
          />
          <div className="flex items-center justify-between">
            <span className={`text-xs ${replyText.trim().length >= 10 ? 'text-green-600' : 'text-muted-foreground'}`}>
              {replyText.trim().length} / 10 字
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowReplyBox(false);
                  setReplyText('');
                }}
                className="text-sm text-muted-foreground px-3 py-1.5 hover:text-foreground"
              >
                取消
              </button>
              <button
                onClick={handleReplySubmit}
                disabled={replyText.trim().length < 10 || submitting}
                className="bg-violet-600 text-white text-sm font-bold px-4 py-1.5 rounded-lg hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {submitting ? '送出中...' : (<><Send className="w-3.5 h-3.5" />送出</>)}
              </button>
            </div>
          </div>
        </div>
      )}

      {!canReply && conversation.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
          <p className="text-xs text-amber-700">⏳ 已送出、等待 {teacherName} 回覆...</p>
        </div>
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
  const brand = useBrand();
  const weekNum = parseInt(weekNumber);

  // 從 Firestore 讀取這週的內容
  const { data: weekData, isLoading: weekLoading } = useWeek(weekNum);

  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  // 練習題狀態
  const [quizAnswers, setQuizAnswers] = useState({});
  const [textAnswers, setTextAnswers] = useState({}); // 簡答/圖文題的內容（進老師批改）
  const [quizRound, setQuizRound] = useState(0); // 重新挑戰時 +1，強制題目重置
  const [quizAllCorrect, setQuizAllCorrect] = useState(false);

  // 開放題狀態（Week 5+）
  const [openAnswer, setOpenAnswer] = useState('');
  const [submittingOpen, setSubmittingOpen] = useState(false);

  // 任務狀態
  const [taskText, setTaskText] = useState('');
  const [taskImages, setTaskImages] = useState([]);
  const [uploadingTask, setUploadingTask] = useState(false);

  // 禮物揭曉
  const [revealing, setRevealing] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const openAnswerRef = useRef(null);
  const taskRef = useRef(null);

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

  // 主題週（例如學習道路的週次）要先開通該主題才能進來（防網址直接輸入）
  useEffect(() => {
    if (weekData?.themeId && userData && !hasThemeAccess(userData, weekData.themeId)) {
      navigate('/arena');
    }
  }, [weekData, userData, navigate]);

  // 內容還在抓 / 學員進度還在抓 → 全頁 loading
  if (weekLoading || loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  // 找不到這週 → 鎖住畫面
  if (!weekData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-4xl">🔒</div>
          <p className="font-black text-foreground">這週的內容還沒開放</p>
          <button onClick={() => navigate('/Home')} className="text-sm text-muted-foreground underline">回到首頁</button>
        </div>
      </div>
    );
  }

  // 答題處理（payload = 簡答/圖文題的回答內容，會存進進度給老師看）
  const handleQuizAnswer = async (questionId, correct, payload) => {
    const newAnswers = { ...quizAnswers, [questionId]: correct };
    const newTextAnswers = payload
      ? { ...textAnswers, [questionId]: payload }
      : textAnswers;
    setQuizAnswers(newAnswers);
    if (payload) setTextAnswers(newTextAnswers);

    const quizCount = weekData.quizQuestions.length;
    const answeredAll = Object.keys(newAnswers).length === quizCount;
    const allCorrect = Object.values(newAnswers).every(Boolean);

    if (answeredAll && allCorrect) {
      setQuizAllCorrect(true);
      if (!progress?.quizCompleted) {
        await markQuizCompleted(
          user.uid,
          weekNum,
          Object.keys(newTextAnswers).length > 0 ? newTextAnswers : null
        );
        setProgress((prev) => ({ ...prev, quizCompleted: true }));
      }
      // W1-W4：答對之後不再自動滾動 — 孩子先看到「等老師審核」的訊息
      // W5+：滾動到開放題
      if (weekData.hasOpenQuestion) {
        setTimeout(() => {
          openAnswerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
      }
    }
  };

  const handleRetryQuiz = () => {
    // 簡答/圖文題已送出的答案保留，不用重寫；其他題重來
    const kept = {};
    (weekData?.quizQuestions || []).forEach((q) => {
      if ((q.type === 'text' || q.type === 'text_or_image') && textAnswers[q.id]) {
        kept[q.id] = true;
      }
    });
    setQuizAnswers(kept);
    setQuizAllCorrect(false);
    setQuizRound((r) => r + 1);
  };

  // 圖文題的附圖上傳（與任務區同一個 storage 路徑規則）
  const uploadQuizImages = async (qid, files) => {
    const urls = await Promise.all(
      files.map(async (file) => {
        const timestamp = Date.now();
        const storageRef = ref(storage, `submissions/${user.uid}/week-${weekNum}/quiz-q${qid}-${timestamp}_${file.name}`);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
      })
    );
    return urls;
  };

  // 提交開放題（Week 5+）
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

  // 圖片上傳
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (taskImages.length + files.length > 3) { alert('最多上傳 3 張圖片'); return; }
    const validFiles = files.filter((f) => {
      if (f.size > 5 * 1024 * 1024) { alert(`${f.name} 超過 5MB 限制`); return false; }
      return true;
    });
    setTaskImages((prev) => [...prev, ...validFiles]);
  };

  // 提交任務
  const handleSubmitTask = async () => {
    if (taskText.trim().length < 50) return;
    setUploadingTask(true);
    try {
      const imageUrls = await Promise.all(
        taskImages.map(async (file) => {
          const timestamp = Date.now();
          const storageRef = ref(storage, `submissions/${user.uid}/week-${weekNum}/${timestamp}_${file.name}`);
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
  const quizDone = progress?.quizCompleted || quizAllCorrect;

  // W1-W4：練習題審核過（badgeEarned）後才能提交任務
  // W5+：開放題審核過（openAnswerSeenAt）後才能提交任務
  const canSubmitTask = weekData.hasOpenQuestion
    ? !!progress?.openAnswerSeenAt
    : !!progress?.badgeEarned;

  const openState = !weekData.hasOpenQuestion
    ? 'no-open'
    : progress?.openAnswerSeenAt
    ? 'badge-earned'
    : progress?.openAnswerSubmittedAt
    ? 'open-submitted'
    : quizDone
    ? 'open-pending'
    : 'locked';

  const taskState = progress?.taskApprovedAt
    ? (progress?.taskRevealed || revealed ? 'card-revealed' : 'approved')
    : progress?.taskSubmittedAt
    ? 'task-submitted'
    : canSubmitTask
    ? 'task-pending'
    : 'locked';

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(weekData?.themeId ? `/arena/road/${weekData.themeId}` : '/Home')} className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <p className="text-xs text-muted-foreground">{weekData.title}</p>
            <p className="text-sm font-black text-foreground leading-snug">{weekData.question}</p>
          </div>
        </div>

        {/* 影片 embed（brand toggle 開 + 該週有 videoUrl 才顯示） */}
        {brand?.features?.enableVideo && weekData.videoUrl && (
          <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
            <div className="aspect-video w-full bg-black">
              <iframe
                src={getEmbedUrl(weekData.videoUrl)}
                title={`${weekData.title} video`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {weekData.videoCaption && (
              <p className="px-4 py-3 text-xs text-muted-foreground leading-relaxed">
                {weekData.videoCaption}
              </p>
            )}
          </div>
        )}

        {/* ==================
            練習題區
        ================== */}
        <div className="bg-card border-2 border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-foreground">🟦 練習題</h2>
            {quizDone && (
              <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-1 rounded-full">
                ✓ 完成
              </span>
            )}
          </div>

          {/* 還沒完成 */}
          {!quizDone && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                {weekData.quizQuestions.length} 題全部完成才能繼續 ✓（簡答題沒有標準答案，寫下想法就算完成）
              </p>
              {weekData.quizQuestions.map((q) => (
                <QuizQuestion
                  key={`${quizRound}-${q.id}`}
                  q={q}
                  onAnswer={handleQuizAnswer}
                  uploader={uploadQuizImages}
                  initialPayload={textAnswers[q.id]}
                />
              ))}
              {Object.keys(quizAnswers).length === weekData.quizQuestions.length && !quizAllCorrect && (
                <div className="text-center pt-2 space-y-3">
                  <p className="text-sm text-red-500">有幾題答錯了，再想想看！</p>
                  <Button onClick={handleRetryQuiz} variant="outline" className="w-full">🔁 重新挑戰</Button>
                </div>
              )}
            </div>
          )}

          {/* 完成狀態 */}
          {quizDone && (
            <>
              {/* W1-W4：答對後等審核 */}
              {!weekData.hasOpenQuestion && !progress?.badgeEarned && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center space-y-2">
                  <div className="text-2xl">⏳</div>
                  <p className="text-sm font-bold text-amber-700">練習題全部答對！</p>
                  <p className="text-xs text-amber-600">等待老師看見...</p>
                  <p className="text-xs text-amber-600">老師審核後徽章會亮起，你就可以開始本週任務</p>
                </div>
              )}

              {/* W1-W4：徽章已獲得 */}
              {!weekData.hasOpenQuestion && progress?.badgeEarned && (
                <div className="bg-violet-50 border-2 border-violet-200 rounded-xl p-4 text-center space-y-2">
                  <div className="text-3xl">🏅</div>
                  <p className="text-sm font-black text-violet-700">老師看見你了！徽章已亮起</p>
                  {progress?.encouragementMessage && (
                    <p className="text-sm text-violet-600 italic">「{progress.encouragementMessage}」</p>
                  )}
                  <p className="text-xs text-violet-600 mt-2">繼續完成下方的任務吧！</p>
                </div>
              )}

              {/* W5：保留原本訊息（會跳到開放題） */}
              {weekData.hasOpenQuestion && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                  <p className="text-sm font-bold text-green-700">🎉 練習題全部答對！</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* ==================
            開放題區（Week 5+ 才有）
        ================== */}
        {weekData.hasOpenQuestion && openState !== 'locked' && (
          <div ref={openAnswerRef} className="bg-card border-2 border-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-foreground">🟩 開放題</h2>
              {openState === 'badge-earned' && (
                <span className="text-xs bg-violet-100 text-violet-700 font-bold px-2 py-1 rounded-full">🏅 徽章已獲得</span>
              )}
            </div>

            <p className="text-sm font-bold text-foreground leading-relaxed">
              {weekData.openQuestion}
            </p>

            {/* 等待輸入 */}
            {openState === 'open-pending' && (
              <div className="space-y-3">
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
                  <Button onClick={handleSubmitOpen} disabled={openAnswer.trim().length < 30 || submittingOpen} className="px-6">
                    {submittingOpen ? '提交中...' : '提交 →'}
                  </Button>
                </div>
              </div>
            )}

            {/* 等老師看 */}
            {openState === 'open-submitted' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center space-y-2">
                <div className="text-2xl">⏳</div>
                <p className="text-sm font-bold text-amber-700">等待老師看見...</p>
                <p className="text-xs text-amber-600">老師會在 1–3 天內回應</p>
              </div>
            )}

            {/* 老師已看見 */}
            {openState === 'badge-earned' && (
              <div className="space-y-3">
                <div className="bg-violet-50 border-2 border-violet-200 rounded-xl p-4 text-center space-y-2">
                  <div className="text-3xl">🏅</div>
                  <p className="text-sm font-black text-violet-700">老師看見你了！</p>
                  {progress?.encouragementMessage && (
                    <p className="text-sm text-violet-600 italic">「{progress.encouragementMessage}」</p>
                  )}
                </div>
                <div className="bg-muted/50 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground font-semibold mb-1">你的回答</p>
                  <p className="text-sm text-foreground leading-relaxed">{progress?.openAnswerContent}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================
            任務區
        ================== */}
        <div ref={taskRef} className="bg-card border-2 border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-foreground">🟨 {weekData.taskTitle}</h2>
            {taskState === 'card-revealed' && (
              <span className="text-xs bg-teal-100 text-teal-700 font-bold px-2 py-1 rounded-full">🎴 卡片已獲得</span>
            )}
          </div>

          <div className="bg-muted/40 rounded-xl p-4">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{weekData.taskDescription}</p>
          </div>

          {/* 鎖住 */}
          {taskState === 'locked' && (
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">
                {weekData.hasOpenQuestion 
                  ? '完成開放題並等老師回應後，才能提交任務' 
                  : '練習題審核通過、徽章亮起後，才能開始本週任務'}
              </p>
            </div>
          )}

          {/* 等待提交 */}
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
                <label className="text-sm font-bold text-foreground">附上照片（最多 3 張，選填）</label>
                <div className="flex flex-wrap gap-2">
                  {taskImages.map((file, idx) => (
                    <div key={idx} className="relative">
                      <img src={URL.createObjectURL(file)} alt={`預覽 ${idx + 1}`} className="w-20 h-20 object-cover rounded-xl border border-border" />
                      <button onClick={() => setTaskImages((prev) => prev.filter((_, i) => i !== idx))} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {taskImages.length < 3 && (
                    <label className="w-20 h-20 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-foreground transition-colors">
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-1">上傳</span>
                      <input type="file" accept="image/jpeg,image/png" multiple className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
              </div>

              <Button onClick={handleSubmitTask} disabled={taskText.trim().length < 50 || uploadingTask} className="w-full">
                {uploadingTask ? '上傳中...' : '提交任務 →'}
              </Button>
            </div>
          )}

          {/* 等待審核 */}
          {taskState === 'task-submitted' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center space-y-2">
              <div className="text-2xl">⏳</div>
              <p className="text-sm font-bold text-amber-700">等待老師回饋...</p>
              <p className="text-xs text-amber-600">老師審核後會有禮物給你</p>
            </div>
          )}

          {/* 可以拆禮物 */}
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
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl">
                  ✨ 🎁 ✨
                </motion.div>
              )}
            </div>
          )}

          {/* 已揭曉 — 顯示卡片 + 對話 thread */}
          {taskState === 'card-revealed' && (
            <div className="space-y-4">
              <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-4 text-center space-y-2">
                <div className="text-3xl">🎴</div>
                <p className="text-sm font-black text-teal-700">任務完成！卡片已解鎖！</p>
              </div>

              {/* 你提交的內容（小提醒、可以對照） */}
              {progress?.taskText && (
                <div className="bg-muted/30 rounded-xl p-3 space-y-1">
                  <p className="text-xs text-muted-foreground font-semibold">你提交的內容</p>
                  <p className="text-xs text-foreground leading-relaxed line-clamp-3">{progress.taskText}</p>
                </div>
              )}

              {/* 對話 thread */}
              {progress?.conversation && progress.conversation.length > 0 ? (
                <ConversationThread
                  conversation={progress.conversation}
                  onReply={async (content) => {
                    await submitChildReply(progress.id, content);
                    // 重新讀取進度
                    const updated = await getOrCreateProgress(user.uid, weekNum);
                    setProgress(updated);
                  }}
                />
              ) : progress?.taskFeedback && (
                // 舊資料相容：如果是舊版只有 taskFeedback、沒有 conversation
                <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 space-y-1">
                  <p className="text-xs text-violet-700 font-semibold">👩‍🏫 Tiffany 老師的回饋</p>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">{progress.taskFeedback}</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}