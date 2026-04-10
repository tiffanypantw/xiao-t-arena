import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MultipleChoice({ question, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (option) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    const isCorrect = option === question.answer;
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <motion.h3
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-bold text-foreground text-center"
      >
        {question.question}
      </motion.h3>

      <div className="space-y-3">
        {question.options.map((option, idx) => {
          const isCorrect = option === question.answer;
          const isSelected = option === selected;
          let borderClass = 'border-border hover:border-primary/50 hover:bg-primary/5';
          if (answered && isSelected && isCorrect) {
            borderClass = 'border-accent bg-accent/10';
          } else if (answered && isSelected && !isCorrect) {
            borderClass = 'border-destructive bg-destructive/10';
          } else if (answered && isCorrect) {
            borderClass = 'border-accent bg-accent/10';
          }

          return (
            <motion.button
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleSelect(option)}
              disabled={answered}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 font-medium ${borderClass} ${!answered ? 'cursor-pointer active:scale-95' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {answered && isSelected && isCorrect && (
                  <CheckCircle className="w-5 h-5 text-accent" />
                )}
                {answered && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-destructive" />
                )}
                {answered && !isSelected && isCorrect && (
                  <CheckCircle className="w-5 h-5 text-accent" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl ${selected === question.answer ? 'bg-accent/10 border border-accent/30' : 'bg-destructive/10 border border-destructive/30'}`}
          >
            <p className="font-semibold mb-1">
              {selected === question.answer ? '✨ 答對了！' : '💡 再想想看！'}
            </p>
            <p className="text-sm text-muted-foreground">{question.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}