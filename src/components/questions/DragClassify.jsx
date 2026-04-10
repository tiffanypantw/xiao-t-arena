import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

export default function DragClassify({ question, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelect = (category) => {
    if (answered) return;
    const correct = category === question.answer;
    setSelected(category);
    setIsCorrect(correct);
    setAnswered(true);
    setTimeout(() => onAnswer(correct), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Badge */}
      <div className="flex justify-center">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
          概念對戰
        </span>
      </div>

      {/* 題目卡片 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20 rounded-2xl p-6 text-center shadow-md"
      >
        <p className="text-xl font-bold text-foreground leading-snug">{question.question}</p>
        {!answered && (
          <p className="text-xs text-muted-foreground mt-3">👇 點擊下方正確的概念框</p>
        )}
      </motion.div>

      {/* 概念框 */}
      <div className={`grid gap-3 ${question.categories.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {question.categories.map((cat, idx) => {
          const isChosen = selected === cat;
          const isRight = answered && cat === question.answer;
          const isWrong = answered && isChosen && !isCorrect;

          let boxClass = 'border-2 border-dashed border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/5 cursor-pointer';
          if (isRight) boxClass = 'border-2 border-accent bg-accent/10';
          else if (isWrong) boxClass = 'border-2 border-destructive bg-destructive/10';
          else if (answered) boxClass = 'border-2 border-dashed border-border bg-muted/20 opacity-50';

          return (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              onClick={() => handleSelect(cat)}
              disabled={answered}
              className={`rounded-2xl p-5 text-center transition-all active:scale-95 ${boxClass}`}
            >
              <div className="flex flex-col items-center gap-2">
                {answered && isRight && <CheckCircle className="w-5 h-5 text-accent" />}
                {answered && isWrong && <XCircle className="w-5 h-5 text-destructive" />}
                <span className="font-bold text-base text-foreground">{cat}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* 回饋說明 */}
      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl ${isCorrect ? 'bg-accent/10 border border-accent/30' : 'bg-destructive/10 border border-destructive/30'}`}
          >
            <p className="font-semibold text-sm mb-1">
              {isCorrect ? '🎉 答對了！' : `💡 再想想！正確答案是「${question.answer}」`}
            </p>
            <p className="text-sm text-muted-foreground">{question.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}