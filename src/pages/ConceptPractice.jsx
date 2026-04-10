import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { conceptGroups, getQuestionsByGroup } from '@/components/qbank';
import QuestionRenderer from '@/components/questions/QuestionRenderer';
import PracticeComplete from '@/components/PracticeComplete';

export default function ConceptPractice() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const groupParam = urlParams.get('group');

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [results, setResults] = useState([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (groupParam) {
      const group = conceptGroups.find(g => g.key === groupParam);
      if (group) handleSelectGroup(group);
    }
  }, []);

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setQuestions(getQuestionsByGroup(group.key));
    setCurrentIdx(0);
    setResults([]);
    setFinished(false);
  };

  const handleAnswer = (isCorrect) => {
    const newResults = [...results, {
      correct: isCorrect,
      groupLabel: selectedGroup.label,
      groupKey: selectedGroup.key,
      question: questions[currentIdx]
    }];
    setResults(newResults);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setFinished(true);
    }
  };

  if (finished && selectedGroup) {
    return (
      <div className="min-h-screen bg-background">
        <PracticeComplete
          results={results}
          onBack={() => {
            if (groupParam) navigate('/Home');
            else { setSelectedGroup(null); setFinished(false); }
          }}
          title={`${selectedGroup.label} 練習完成！`}
        />
      </div>
    );
  }

  if (selectedGroup) {
    const progress = (currentIdx / questions.length) * 100;
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-lg mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={() => {
              if (groupParam) navigate('/Home'); else setSelectedGroup(null);
            }}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{selectedGroup.icon}</span>
                <span className="font-bold text-sm">{selectedGroup.label}</span>
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

  // Group selection
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/Home')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">概念練習</h1>
            <p className="text-sm text-muted-foreground">選擇一組概念開始練習</p>
          </div>
        </div>

        <div className="space-y-3">
          {conceptGroups.map((group, idx) => (
            <motion.button
              key={group.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => handleSelectGroup(group)}
              className="w-full text-left"
            >
              <div className="bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-all hover:-translate-y-0.5 active:scale-[0.98]">
                <div className="flex items-center gap-4">
                  <div className="flex items-center -space-x-2">
                    <span className="text-3xl">{group.icon}</span>
                    <span className="text-2xl">{group.iconB}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{group.label}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        {group.character} vs {group.characterB}
                      </span>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                        {group.questionCount} 題
                      </span>
                    </div>
                  </div>
                  <span className="text-muted-foreground">→</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}