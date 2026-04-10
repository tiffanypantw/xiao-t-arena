import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Camera, Mail, CheckCircle2 } from 'lucide-react';

export default function PracticeComplete({ results, onBack, title }) {
  const correct = results.filter(r => r.correct).length;
  const total = results.length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const qualifies = total >= 3;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto py-8 px-4 space-y-5"
    >
      {/* 結果 */}
      <div className="text-center">
        <div className="text-6xl mb-3">{percentage >= 70 ? '🎉' : percentage >= 50 ? '💪' : '📚'}</div>
        <h2 className="text-2xl font-black text-foreground">{title || '練習完成！'}</h2>
        <p className="text-muted-foreground text-sm mt-1">
          {percentage >= 70 ? '很棒的思考！' : '繼續練習，概念會越來越清晰！'}
        </p>
      </div>

      {/* 分數 */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <div className="text-4xl font-black text-primary">{correct}</div>
            <div className="text-xs text-muted-foreground mt-1">答對</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <div className="text-4xl font-black text-muted-foreground">{total}</div>
            <div className="text-xs text-muted-foreground mt-1">總題數</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <div className="text-4xl font-black text-accent">{percentage}%</div>
            <div className="text-xs text-muted-foreground mt-1">正確率</div>
          </div>
        </div>
      </div>

      {/* 完成條件與解鎖碼申請提示 */}
      {qualifies ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-accent/5 border-2 border-accent/30 rounded-2xl p-5 space-y-4"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
            <p className="font-black text-foreground">恭喜！你符合申請解鎖碼的條件</p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">完成條件確認</p>
            <div className="space-y-1.5">
              {[
                { label: `完成至少 3 題`, done: total >= 3 },
                { label: `有完整回答（共 ${total} 題）`, done: total >= 3 },
                { label: '有思考過程（選擇並確認答案）', done: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className={item.done ? 'text-accent' : 'text-muted-foreground'}>
                    {item.done ? '✓' : '○'}
                  </span>
                  <span className={item.done ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-accent/20 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Camera className="w-4 h-4 text-primary" />
              <p className="text-sm font-bold text-foreground">申請步驟</p>
            </div>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside leading-relaxed">
              <li>截圖這個完成畫面</li>
              <li>在截圖上寫上你的姓名（簽名）</li>
              <li>寄送 email 給老師</li>
              <li>通過審核後將獲得解鎖碼 🎉</li>
            </ol>
            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-border">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">截圖簽名後寄送 email，通過後將獲得解鎖碼</p>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="bg-muted/50 border border-border rounded-2xl p-4">
          <p className="text-sm font-semibold text-muted-foreground mb-1">⚠️ 尚未達到申請條件</p>
          <p className="text-xs text-muted-foreground">需要完成至少 3 題才能申請解鎖碼。目前完成 {total} 題，還需 {3 - total} 題。</p>
        </div>
      )}

      <Button onClick={onBack} size="lg" className="w-full">
        返回
      </Button>
    </motion.div>
  );
}