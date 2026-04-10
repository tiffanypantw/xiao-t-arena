import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Search } from 'lucide-react';

export default function FindDifferent({ question, onAnswer }) {
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
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 bg-secondary/20 px-4 py-2 rounded-full mb-3">
          <Search className="w-4 h-4 text-secondary" />
          <span className="text-sm font-medium text-secondary">找出不同</span>
        </div>
        <h3 className="text-xl font-bold text-foreground">{question.question}</h3>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {question.options.map((option, idx) => {
          const isCorrect = option === question.answer;
          const isSelected = option === selected;
          let classes = 'border-border hover:border-primary/50 hover:bg-primary/5';
          if (answered && isSelected && isCorrect) {
            classes = 'border-accent bg-accent/10 ring-2 ring-accent/30';
          } else if (answered && isSelected && !isCorrect) {
            classes = 'border-destructive bg-destructive/10';
          } else if (answered && isCorrect) {
            classes = 'border-accent bg-accent/10 ring-2 ring-accent/30';
          }

          return (
            <motion.button
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleSelect(option)}
              disabled={answered}
              className={`p-4 rounded-xl border-2 text-center font-medium transition-all duration-300 ${classes} ${!answered ? 'cursor-pointer active:scale-95' : ''}`}
            >
              <div className="flex flex-col items-center gap-2">
                <span>{option}</span>
                {answered && isSelected && isCorrect && <CheckCircle className="w-5 h-5 text-accent" />}
                {answered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-destructive" />}
                {answered && !isSelected && isCorrect && <CheckCircle className="w-5 h-5 text-accent" />}
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
              {selected === question.answer ? '🎯 找到了！' : '🤔 不是這個喔！'}
            </p>
            <p className="text-sm text-muted-foreground">{question.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}