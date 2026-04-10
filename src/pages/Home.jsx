import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 pb-10">
      <div className="max-w-md w-full space-y-8 text-center">

        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-5xl mb-4">🧠</div>
          <h1 className="text-2xl font-black text-foreground tracking-tight leading-tight">
            小T的財商概念競技場 Week 1
          </h1>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            如果世界沒有錢，真的會更公平嗎？
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-muted/40 border border-border rounded-2xl p-5 text-left space-y-2"
        >
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">本週學習目標</p>
          <p className="text-sm text-foreground leading-relaxed">
            理解「交換」其實會遇到困難，沒有錢不一定比較公平或順利
          </p>
          <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground">
            <span>📝 9 題測驗</span>
            <span>·</span>
            <span>✅ 有正確答案</span>
            <span>·</span>
            <span>📸 完成截圖</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
        >
          <button
            onClick={() => navigate('/Week1Practice')}
            className="w-full bg-foreground text-background font-black text-lg rounded-2xl py-5 px-8 hover:opacity-90 transition-all active:scale-[0.98] shadow-lg"
          >
            開始本週練習 →
          </button>
          <p className="text-xs text-muted-foreground mt-3">
            完成後截圖寄 email，通過即獲解鎖碼
          </p>
        </motion.div>

      </div>
    </div>
  );
}