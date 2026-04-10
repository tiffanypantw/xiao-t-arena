import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Map, Swords } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import {
  SKILL_TREE,
  isLevelUnlocked,
  isLevelMastered,
  isNodeMastered,
  getNodeProgress,
  UNLOCK_MIN_ATTEMPTS,
  UNLOCK_MIN_ACCURACY
} from '@/components/SkillTree/skillTreeData';
import { BOSS_DATA } from '@/components/BossBattle/bossData';
import SkillNode from '@/components/SkillTree/SkillNode';

export default function SkillTree() {
  const navigate = useNavigate();

  const { data: progressData = [] } = useQuery({
    queryKey: ['learningProgress'],
    queryFn: () => base44.entities.LearningProgress.list()
  });

  const { data: bossProgressData = [] } = useQuery({
    queryKey: ['bossProgress'],
    queryFn: () => base44.entities.BossProgress.list()
  });

  const totalMastered = SKILL_TREE.flatMap(l => l.nodes).filter(k => isNodeMastered(progressData, k)).length;
  const totalNodes = SKILL_TREE.flatMap(l => l.nodes).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/Home')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-black text-foreground">財商概念競技地圖</h1>
            </div>
            <p className="text-xs text-muted-foreground">精通 {totalMastered} / {totalNodes} 個概念</p>
          </div>
          <div className="bg-primary/10 px-3 py-1.5 rounded-full">
            <span className="text-sm font-bold text-primary">{Math.round((totalMastered / totalNodes) * 100)}%</span>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="mb-8">
          <div className="w-full bg-muted rounded-full h-2.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(totalMastered / totalNodes) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-2.5 rounded-full bg-gradient-to-r from-primary to-secondary"
            />
          </div>
        </div>

        {/* Skill Tree Levels */}
        <div className="space-y-6">
          {SKILL_TREE.map((level, levelIndex) => {
            const unlocked = isLevelUnlocked(progressData, levelIndex);
            const mastered = isLevelMastered(progressData, levelIndex);
            const masteredCount = level.nodes.filter(k => isNodeMastered(progressData, k)).length;

            return (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: levelIndex * 0.1 }}
              >
                {/* Level header */}
                <div className={`rounded-2xl p-4 mb-3 ${unlocked ? level.bgColor : 'bg-muted/30'} border ${unlocked ? level.borderColor : 'border-border'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${unlocked ? `bg-gradient-to-br ${level.color}` : 'bg-muted'}`}>
                      {unlocked ? level.emoji : '🔒'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${unlocked ? level.textColor : 'text-muted-foreground'}`}>
                          {level.title}
                        </span>
                        <span className={`font-black text-sm ${unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {level.subtitle}
                        </span>
                        {mastered && <span className="text-xs bg-accent/10 text-accent font-bold px-2 py-0.5 rounded-full">✓ 完成</span>}
                      </div>
                      <p className={`text-xs mt-0.5 leading-snug ${unlocked ? 'text-foreground/70' : 'text-muted-foreground'}`}>
                        {level.mission}
                      </p>
                    </div>
                    {unlocked && (
                      <div className={`text-sm font-bold ${level.textColor}`}>
                        {masteredCount}/{level.nodes.length}
                      </div>
                    )}
                  </div>
                </div>

                {/* Nodes */}
                <div className="space-y-2 pl-4">
                  {level.nodes.map((nodeKey, nodeIndex) => {
                    const nodeMastered = isNodeMastered(progressData, nodeKey);
                    const boss = BOSS_DATA[nodeKey];
                    const bossRec = bossProgressData.find(b => b.concept_group === nodeKey);
                    const bossCompleted = bossRec?.completed;
                    return (
                      <div key={nodeKey}>
                        <SkillNode
                          nodeKey={nodeKey}
                          progress={getNodeProgress(progressData, nodeKey)}
                          unlocked={unlocked}
                          levelColor={level.color}
                          delay={levelIndex * 0.1 + nodeIndex * 0.05}
                          onClick={() => navigate(`/ConceptPractice?group=${nodeKey}`)}
                        />
                        {nodeMastered && boss && (
                          <motion.button
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: levelIndex * 0.1 + nodeIndex * 0.05 + 0.1 }}
                            onClick={() => navigate(`/BossBattle?group=${nodeKey}`)}
                            className={`ml-6 mt-1 w-[calc(100%-1.5rem)] flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold transition-all hover:shadow-md active:scale-[0.98] ${bossCompleted ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-destructive/10 border-destructive/30 text-destructive hover:bg-destructive/20'}`}
                          >
                            <Swords className="w-4 h-4 shrink-0" />
                            <span className="flex-1 text-left">
                              {bossCompleted ? `✓ ${boss.bossName} 已征服` : `⚔️ 挑戰 ${boss.bossName}`}
                            </span>
                            {!bossCompleted && <span className="text-xs opacity-70">+{50}XP</span>}
                            {bossCompleted && <span className="text-xs">{boss.badgeEmoji}</span>}
                          </motion.button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Connector to next level */}
                {levelIndex < SKILL_TREE.length - 1 && (
                  <div className="flex flex-col items-center mt-4 gap-1">
                    <div className={`w-0.5 h-4 ${mastered ? 'bg-accent' : 'bg-border'}`} />
                    <div className={`text-xs px-3 py-1 rounded-full border ${mastered ? 'bg-accent/10 border-accent/30 text-accent font-semibold' : 'bg-muted border-border text-muted-foreground'}`}>
                      {mastered ? '✓ 已解鎖下一關' : `需精通本關全部概念（${UNLOCK_MIN_ATTEMPTS} 題 · ${Math.round(UNLOCK_MIN_ACCURACY * 100)}% 正確率）`}
                    </div>
                    <div className={`w-0.5 h-4 ${mastered ? 'bg-accent' : 'bg-border'}`} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}