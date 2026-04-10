import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart3, Trophy, Target, Calendar, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { base44 } from '@/api/base44Client';
import { conceptGroups } from '@/components/qbank';
import { getTotalXP, getGroupXP, getLevelInfo, XP_LEVELS, XP_MAX_PER_GROUP } from '@/components/xp/xpSystem';

export default function Progress() {
  const navigate = useNavigate();

  const { data: progressData, isLoading } = useQuery({
    queryKey: ['learning-progress'],
    queryFn: () => base44.entities.LearningProgress.list(),
    initialData: []
  });

  const progressMap = {};
  progressData.forEach(p => {
    progressMap[p.concept_group] = p;
  });

  const totalAttempts = progressData.reduce((sum, p) => sum + (p.total_attempts || 0), 0);
  const totalCorrect = progressData.reduce((sum, p) => sum + (p.correct_answers || 0), 0);
  const overallRate = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const totalXP = getTotalXP(progressData);
  const { current: levelInfo, next: nextLevel } = getLevelInfo(totalXP);
  const levelProgress = nextLevel
    ? Math.round(((totalXP - levelInfo.minXP) / (nextLevel.minXP - levelInfo.minXP)) * 100)
    : 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/Home')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">學習進度</h1>
            <p className="text-sm text-muted-foreground">查看你的概念理解度</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* XP 等級卡 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{levelInfo.emoji}</span>
                <div className="flex-1">
                  <p className="font-black text-lg text-foreground">{levelInfo.label}</p>
                  <p className="text-sm text-muted-foreground">
                    總 XP：<span className="font-bold text-primary">{totalXP}</span>
                    {nextLevel && ` / ${nextLevel.minXP}`}
                  </p>
                </div>
                {nextLevel && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">距下一級</p>
                    <p className="font-bold text-sm text-primary">{nextLevel.minXP - totalXP} XP</p>
                  </div>
                )}
              </div>
              <div className="w-full bg-background/60 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-3 rounded-full bg-gradient-to-r from-primary to-secondary"
                />
              </div>
              <div className="flex justify-between mt-2">
                {XP_LEVELS.map(lvl => (
                  <div key={lvl.level} className={`text-center ${lvl.level === levelInfo.level ? 'opacity-100' : 'opacity-30'}`}>
                    <div className="text-sm">{lvl.emoji}</div>
                    <div className="text-xs text-muted-foreground">{lvl.minXP}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Overall Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm"
            >
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <Target className="w-3.5 h-3.5" />
                    <span className="text-xs">總題數</span>
                  </div>
                  <div className="text-2xl font-black text-foreground">{totalAttempts}</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <Trophy className="w-3.5 h-3.5" />
                    <span className="text-xs">答對</span>
                  </div>
                  <div className="text-2xl font-black text-accent">{totalCorrect}</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span className="text-xs">正確率</span>
                  </div>
                  <div className="text-2xl font-black text-primary">{overallRate}%</div>
                </div>
              </div>
            </motion.div>

            {/* Per-Concept Progress */}
            <div>
              <h3 className="font-bold text-foreground mb-3">概念理解度</h3>
              <div className="space-y-3">
                {conceptGroups.map((group, idx) => {
                  const data = progressMap[group.key];
                  const attempts = data?.total_attempts || 0;
                  const correct = data?.correct_answers || 0;
                  const rate = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;

                  return (
                    <motion.div
                      key={group.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-card border border-border rounded-xl p-4"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl">{group.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm">{group.label}</span>
                            <span className="text-sm font-bold text-primary">
                              {attempts > 0 ? `${rate}%` : '尚未練習'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ProgressBar value={rate} className="h-2 mb-1.5" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>答題 {attempts} 次</span>
                        {data && (
                          <span className="font-semibold text-primary">
                            XP {getGroupXP(data)} / {XP_MAX_PER_GROUP}
                          </span>
                        )}
                      </div>
                      {data?.last_practiced && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>上次練習 {data.last_practiced}</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {totalAttempts === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-6"
              >
                <p className="text-muted-foreground">還沒有練習紀錄</p>
                <Button
                  className="mt-3"
                  onClick={() => navigate('/QuickChallenge')}
                >
                  開始第一次挑戰 ⚡
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}