import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getRandomQuestions } from '@/components/qbank';
import QuestionRenderer from '@/components/questions/QuestionRenderer';
import PracticeComplete from '@/components/PracticeComplete';

export default function QuickChallenge() {
  const navigate = useNavigate();
  const questions = useMemo(() => getRandomQuestions(5), []);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [results, setResults] = useState([]);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (isCorrect) => {
    const q = questions[currentIdx];
    const newResults = [...results, {
      correct: isCorrect,
      groupLabel: q.groupLabel,
      groupKey: q.groupKey,
      question: q
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
          title="快速挑戰完成！"
        />
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
              <Zap className="w-4 h-4 text-primary" />
              <span className="font-bold text-sm">快速挑戰</span>
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
            {questions[currentIdx] && (
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                {questions[currentIdx].groupLabel && (
                  <div className="text-xs text-muted-foreground mb-3 text-center">
                    📌 {questions[currentIdx].groupLabel}
                  </div>
                )}
                <QuestionRenderer
                  question={questions[currentIdx]}
                  onAnswer={handleAnswer}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}