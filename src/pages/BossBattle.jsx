import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Swords, Shield, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { BOSS_DATA, BOSS_XP, BOSS_RESULTS, getBossResult } from '@/components/BossBattle/bossData';
import MultipleChoice from '@/components/questions/MultipleChoice';

export default function BossBattle() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const groupKey = urlParams.get('group');
  const boss = BOSS_DATA[groupKey];

  const { data: progressData = [] } = useQuery({
    queryKey: ['learningProgress'],
    queryFn: () => base44.entities.LearningProgress.list()
  });

  const questions = useMemo(() => {
    if (!boss) return [];
    return [...boss.questions].sort(() => Math.random() - 0.5);
  }, [boss]);

  const [phase, setPhase] = useState('intro'); // intro | battle | result
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [bossHP, setBossHP] = useState(5);

  if (!boss) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">找不到這個 Boss</p>
          <Button onClick={() => navigate('/SkillTree')}>回學習地圖</Button>
        </div>
      </div>
    );
  }

  const handleAnswer = async (isCorrect) => {
    const newScore = isCorrect ? score + 1 : score;
    const newHP = isCorrect ? bossHP - 1 : bossHP;
    setScore(newScore);
    setBossHP(newHP);

    if (currentIdx < questions.length - 1) {
      setTimeout(() => setCurrentIdx(i => i + 1), 1500);
    } else {
      // Save result
      const passed = newScore >= 4;
      try {
        const existing = await base44.entities.BossProgress.filter({ concept_group: groupKey });
        if (existing.length > 0) {
          const rec = existing[0];
          await base44.entities.BossProgress.update(rec.id, {
            completed: rec.completed || passed,
            best_score: Math.max(rec.best_score || 0, newScore),
            attempts: (rec.attempts || 0) + 1
          });
        } else {
          await base44.entities.BossProgress.create({
            concept_group: groupKey,
            completed: passed,
            best_score: newScore,
            attempts: 1
          });
        }
        // Award XP if first time passing
        if (passed) {
          const progressRecord = progressData.find(p => p.concept_group === groupKey);
          if (progressRecord) {
            await base44.entities.LearningProgress.update(progressRecord.id, {
              correct_answers: (progressRecord.correct_answers || 0) + BOSS_XP
            });
          }
        }
      } catch (e) {}
      setTimeout(() => setPhase('result'), 1500);
    }
  };

  const result = getBossResult(score);
  const hpPercent = (bossHP / 5) * 100;

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <Button variant="ghost" size="sm" className="mb-2" onClick={() => navigate('/SkillTree')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> 返回
          </Button>

          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-8xl"
          >
            {boss.emoji}
          </motion.div>

          <div>
            <p className="text-sm font-bold text-destructive uppercase tracking-widest mb-1">⚔️ 概念 Boss 挑戰</p>
            <h1 className="text-2xl font-black text-foreground">{boss.bossName}</h1>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">當你完成一組概念訓練後，「概念混淆怪」就會出現。<br/>只有真正理解概念的人，才能成功打敗 Boss。</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">題數</span>
              <span className="font-bold">5 題</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">通關條件</span>
              <span className="font-bold text-accent">答對 4 題以上</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">通關獎勵</span>
              <span className="font-bold text-primary">+{BOSS_XP} XP ＋ 徽章 {boss.badgeEmoji}</span>
            </div>
          </div>

          <Button size="lg" className="w-full text-lg py-6 bg-destructive hover:bg-destructive/90"
            onClick={() => setPhase('battle')}>
            <Swords className="w-5 h-5 mr-2" /> 開始戰鬥！
          </Button>
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    const passed = score >= 4;
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="text-7xl"
          >
            {result.emoji}
          </motion.div>

          <div>
            <h2 className="text-2xl font-black text-foreground">{result.title}</h2>
            <p className="text-muted-foreground mt-1">{result.desc}</p>
          </div>

          <div className={`bg-gradient-to-br ${result.color} rounded-2xl p-5 text-white`}>
            <p className="text-5xl font-black">{score} / 5</p>
            <p className="text-sm opacity-80 mt-1">答對題數</p>
          </div>

          {passed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3"
            >
              <span className="text-3xl">{boss.badgeEmoji}</span>
              <div className="text-left">
                <p className="font-bold text-sm text-foreground">{boss.badge}</p>
                <p className="text-xs text-muted-foreground">+{BOSS_XP} XP 已獲得</p>
              </div>
              <Star className="w-5 h-5 text-primary ml-auto" />
            </motion.div>
          )}

          {!passed && (
            <div className="bg-muted/50 border border-border rounded-xl p-4 text-sm text-muted-foreground">
              💡 建議回去練習「{groupKey}」題庫，熟悉後再來挑戰！
            </div>
          )}

          <div className="flex gap-3">
            {!passed && (
              <Button variant="outline" className="flex-1"
                onClick={() => navigate(`/ConceptPractice?group=${groupKey}`)}>
                回去練習
              </Button>
            )}
            <Button className="flex-1" onClick={() => navigate('/SkillTree')}>
              回學習地圖
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Battle phase
  const currentQ = questions[currentIdx];
  // Normalize multi_concept_classify to multiple_choice format
  const normalizedQ = { ...currentQ, type: 'multiple_choice' };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-4">
        {/* Boss header */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{boss.emoji}</span>
            <div className="flex-1">
              <p className="font-black text-sm text-destructive">{boss.bossName}</p>
              <div className="flex items-center gap-2 mt-1">
                <Shield className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Boss HP</span>
                <span className="text-xs font-bold ml-auto">{bossHP}/5</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 mt-1">
                <motion.div
                  animate={{ width: `${hpPercent}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-3 rounded-full bg-gradient-to-r from-red-500 to-rose-400"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex gap-3">
              <span className="text-muted-foreground">第 {currentIdx + 1} / {questions.length} 題</span>
              <span className="text-accent font-bold">✓ 答對 {score}</span>
            </div>
            <div className="flex gap-1">
              {questions.map((_, i) => (
                <div key={i} className={`w-4 h-4 rounded-full text-xs flex items-center justify-center ${i < currentIdx ? 'bg-accent/20 text-accent' : i === currentIdx ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="bg-card border-2 border-destructive/20 rounded-2xl p-5 shadow-md"
          >
            <div className="inline-flex items-center gap-1.5 bg-destructive/10 px-3 py-1 rounded-full mb-3">
              <Swords className="w-3 h-3 text-destructive" />
              <span className="text-xs font-bold text-destructive">Boss 攻擊！</span>
            </div>
            <MultipleChoice question={normalizedQ} onAnswer={handleAnswer} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}