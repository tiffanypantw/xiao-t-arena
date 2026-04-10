import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getDailyGroup, conceptGroups, getQuestionsByGroup } from '@/components/qbank';
import QuestionRenderer from '@/components/questions/QuestionRenderer';
import PracticeComplete from '@/components/PracticeComplete';

export default function DailyChallenge() {
  const navigate = useNavigate();
  const dailyGroupKey = useMemo(() => getDailyGroup(), []);
  const dailyGroup = conceptGroups.find(g => g.key === dailyGroupKey);
  const questions = useMemo(() => {
    const all = getQuestionsByGroup(dailyGroupKey);
    return all.sort(() => Math.random() - 0.5).slice(0, 5);
  }, [dailyGroupKey]);

  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [results, setResults] = useState([]);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (isCorrect) => {
    const newResults = [...results, {
      correct: isCorrect,
      groupLabel: dailyGroup?.label,
      groupKey: dailyGroupKey,
      question: questions[currentIdx]
    }];
    setResults(newResults);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="min-h-screen bg-background">
        <PracticeComplete
          results={results}
          onBack={() => navigate('/Home')}
          title="今日挑戰完成！"
        />
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-lg mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate('/Home')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">今日概念挑戰</h1>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-7xl"
            >
              👾
            </motion.div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">今日概念</p>
              <h2 className="text-2xl font-black text-foreground">{dailyGroup?.label}</h2>
            </div>

            <div className="flex items-center justify-center gap-4 text-4xl">
              <span>{dailyGroup?.icon}</span>
              <span className="text-xl font-bold text-muted-foreground">VS</span>
              <span>{dailyGroup?.iconB}</span>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">{dailyGroup?.character}</span>
                {' '}和{' '}
                <span className="font-bold text-foreground">{dailyGroup?.characterB}</span>
                {' '}在搗蛋！回答 5 題打敗概念混淆怪！
              </p>
            </div>

            <Button size="lg" onClick={() => setStarted(true)} className="px-10 text-lg">
              開始挑戰 ⚔️
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const progress = (currentIdx / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/Home')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-accent" />
              <span className="font-bold text-sm">{dailyGroup?.label}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {currentIdx + 1} / {questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <QuestionRenderer
                question={questions[currentIdx]}
                onAnswer={handleAnswer}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}