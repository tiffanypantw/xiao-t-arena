import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Trophy, Sparkles, Loader2, Brain } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { getEncouragement, getLevelInfo, getTotalXP, XP_PER_CORRECT } from '@/components/xp/xpSystem';

export default function ChallengeComplete({ results, onBack, title, progressData = [] }) {
  const [aiTip, setAiTip] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiUsed, setAiUsed] = useState(false);

  const correct = results.filter(r => r.correct).length;
  const total = results.length;
  const percentage = Math.round((correct / total) * 100);
  const xpGained = correct * XP_PER_CORRECT;

  const totalXP = getTotalXP(progressData) + xpGained;
  const { current: levelInfo } = getLevelInfo(totalXP);

  // 主要概念組（取出現最多的）
  const groupCounts = {};
  results.forEach(r => { if (r.groupLabel) groupCounts[r.groupLabel] = (groupCounts[r.groupLabel] || 0) + 1; });
  const mainGroup = Object.entries(groupCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const encouragements = mainGroup ? getEncouragement(mainGroup, correct, total, 0) : [];

  const wrongConcepts = results
    .filter(r => !r.correct)
    .map(r => r.groupLabel || r.question?.question || '')
    .filter(Boolean);

  const handleGetAiTip = async () => {
    if (aiUsed) return;
    setLoadingAi(true);
    const wrongSummary = wrongConcepts.length > 0
      ? wrongConcepts.join('、')
      : '全部答對';

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `學生剛完成一個財商概念區辨挑戰，答對 ${correct}/${total} 題。答錯的題目涉及：${wrongSummary}。請用繁體中文、50字以內，給出一個簡短的學習提醒，適合10-15歲學生。語氣友善、鼓勵。`,
      response_json_schema: {
        type: "object",
        properties: {
          tip: { type: "string" }
        }
      }
    });
    setAiTip(res.tip);
    setLoadingAi(false);
    setAiUsed(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6 max-w-md mx-auto py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="text-7xl"
      >
        {percentage >= 80 ? '🏆' : percentage >= 50 ? '💪' : '📚'}
      </motion.div>

      <div>
        <h2 className="text-2xl font-bold text-foreground">
          {title || '挑戰完成！'}
        </h2>
        <p className="text-muted-foreground mt-1">
          {percentage >= 80 ? '太棒了！你的大腦正在學會分辨概念！' :
           percentage >= 50 ? '做得不錯！繼續練習會更好！' :
           '別灰心！多練習幾次就會進步！'}
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-center gap-8">
          <div>
            <div className="text-4xl font-black text-primary">{correct}</div>
            <div className="text-sm text-muted-foreground">答對</div>
          </div>
          <div className="w-px h-12 bg-border" />
          <div>
            <div className="text-4xl font-black text-muted-foreground">{total}</div>
            <div className="text-sm text-muted-foreground">總題數</div>
          </div>
          <div className="w-px h-12 bg-border" />
          <div>
            <div className="text-4xl font-black text-accent">{percentage}%</div>
            <div className="text-sm text-muted-foreground">正確率</div>
          </div>
        </div>
      </div>

      {/* XP 獲得 */}
      {xpGained > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{levelInfo.emoji}</span>
            <div className="text-left">
              <p className="text-sm font-bold text-foreground">{levelInfo.label}</p>
              <p className="text-xs text-muted-foreground">本次獲得 +{xpGained} XP</p>
            </div>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.5 }}
            className="text-2xl font-black text-primary"
          >
            +{xpGained}
          </motion.div>
        </motion.div>
      )}

      {/* 鼓勵訊息 */}
      {encouragements.length > 0 && (
        <div className="space-y-1">
          {encouragements.map((msg, i) => (
            <p key={i} className="text-sm text-muted-foreground text-center">💬 {msg}</p>
          ))}
        </div>
      )}

      {/* Optional AI tip */}
      {!aiTip && !aiUsed && (
        <Button
          variant="outline"
          onClick={handleGetAiTip}
          disabled={loadingAi}
          className="gap-2"
        >
          {loadingAi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
          AI 學習小提示
        </Button>
      )}

      {aiTip && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-left"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm text-primary">AI 學習提示</span>
          </div>
          <p className="text-sm text-foreground">{aiTip}</p>
        </motion.div>
      )}

      <Button onClick={onBack} size="lg" className="px-8">
        返回
      </Button>
    </motion.div>
  );
}