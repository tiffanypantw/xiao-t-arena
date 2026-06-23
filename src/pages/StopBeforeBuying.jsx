import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, HelpCircle } from 'lucide-react';
import { JARS } from '@/api/bookkeeping';

// 買之前先停一下：想花錢時，問自己 4 個問題（不存資料，幫孩子停下來想）
export default function StopBeforeBuying() {
  const navigate = useNavigate();
  const [item, setItem] = useState('');
  const [price, setPrice] = useState('');
  const [q1, setQ1] = useState(null); // 需要 / 想要
  const [q2, setQ2] = useState(null); // 消耗品 / 資產
  const [q3, setQ3] = useState('');   // 哪個罐子
  const [q4, setQ4] = useState(null); // 會後悔 / 不會
  const [decision, setDecision] = useState(null);
  const [reason, setReason] = useState('');

  const QChoice = ({ current, set, options }) => (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => set(opt)}
          className={`flex-1 text-sm font-bold py-2.5 rounded-xl border-2 transition-all ${
            current === opt
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border text-muted-foreground'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  const Q = ({ n, title, hint, children }) => (
    <div className="mb-4 bg-card border border-border rounded-2xl p-4">
      <p className="text-sm font-black text-foreground">
        <span className="text-primary mr-1.5">{n}</span>{title}
      </p>
      {hint && <p className="text-xs text-muted-foreground mt-1 mb-3">{hint}</p>}
      {!hint && <div className="mb-3" />}
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center mb-5">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> 首頁
          </button>
        </div>

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-pink-500 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-foreground leading-tight">買之前先停一下</h1>
              <p className="text-xs text-muted-foreground">想花錢的時候，先問自己 4 個問題</p>
            </div>
          </div>
        </motion.div>

        {/* 想買什麼 */}
        <div className="mb-4 bg-card border border-border rounded-2xl p-4 space-y-2">
          <input
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="我想買的東西"
            className="w-full text-sm px-3 py-2 rounded-xl border border-border bg-card focus:outline-none focus:border-primary"
          />
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="價格"
              className="w-28 text-sm px-3 py-2 rounded-xl border border-border bg-card focus:outline-none focus:border-primary"
            />
            <span className="text-sm text-muted-foreground">元</span>
          </div>
        </div>

        <Q n="①" title="這是「需要」還是「想要」？" hint="需要 = 沒有它生活就不行；想要 = 有了更開心，沒有也活得下去。">
          <QChoice value={q1} current={q1} set={setQ1} options={['需要', '想要']} />
        </Q>

        <Q n="②" title="它是「消耗品」還是「資產」？" hint="消耗品會用完、會變舊；資產能保值，或幫你賺到錢、學到東西。">
          <QChoice value={q2} current={q2} set={setQ2} options={['消耗品', '資產']} />
        </Q>

        <Q n="③" title="這筆錢從哪個罐子出？" hint="看你正在買的是什麼用途。">
          <select
            value={q3}
            onChange={(e) => setQ3(e.target.value)}
            className="w-full text-sm px-3 py-2 rounded-xl border border-border bg-card focus:outline-none focus:border-primary"
          >
            <option value="">選一個罐子…</option>
            {JARS.map((j) => (
              <option key={j.key} value={j.key}>{j.label}・{j.job}</option>
            ))}
          </select>
        </Q>

        <Q n="④" title="如果不買，一個月後我會後悔嗎？" hint="想想看：1 個月、3 個月、1 年後，它還重要嗎？">
          <QChoice value={q4} current={q4} set={setQ4} options={['會後悔', '不會']} />
        </Q>

        {/* 決定 */}
        <div className="mb-4 bg-primary/5 border-2 border-primary/30 rounded-2xl p-4">
          <p className="text-sm font-black text-primary mb-3">我的決定</p>
          <div className="flex gap-2 mb-3">
            {['買', '不買', '再想想'].map((d) => (
              <button
                key={d}
                onClick={() => setDecision(d)}
                className={`flex-1 text-sm font-bold py-2.5 rounded-xl border-2 transition-all ${
                  decision === d ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="我的理由…"
            className="w-full text-sm px-3 py-2 rounded-xl border border-border bg-card focus:outline-none focus:border-primary"
          />
        </div>

        <p className="text-center text-xs text-muted-foreground mt-2">停下來想一想，你就是金錢的主人 ✨</p>
        <div className="h-6" />
      </div>
    </div>
  );
}
