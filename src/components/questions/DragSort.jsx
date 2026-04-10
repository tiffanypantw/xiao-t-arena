import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, GripHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DragSort({ question, onAnswer }) {
  const [placements, setPlacements] = useState({});
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const unplacedItems = question.items.filter(item => !placements[item]);

  const handlePlaceItem = (item, category) => {
    if (answered) return;
    setPlacements(prev => ({ ...prev, [item]: category }));
  };

  const handleRemoveItem = (item) => {
    if (answered) return;
    setPlacements(prev => {
      const next = { ...prev };
      delete next[item];
      return next;
    });
  };

  const handleSubmit = () => {
    const allPlaced = question.items.every(item => placements[item]);
    if (!allPlaced) return;

    const correct = question.items.every(
      item => placements[item] === question.correctMapping[item]
    );
    setIsCorrect(correct);
    setAnswered(true);
    setTimeout(() => {
      onAnswer(correct);
    }, 2500);
  };

  const getItemsForCategory = (category) => {
    return question.items.filter(item => placements[item] === category);
  };

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-3">
          <GripHorizontal className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">拖曳分類</span>
        </div>
        <h3 className="text-xl font-bold text-foreground">{question.question}</h3>
      </motion.div>

      {/* Unplaced items */}
      {unplacedItems.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">點擊卡片放入類別：</p>
          <div className="flex flex-wrap gap-2">
            {unplacedItems.map((item, idx) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-card border-2 border-border rounded-lg px-3 py-2 text-sm font-medium shadow-sm cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {question.categories.map((category) => (
          <div
            key={category}
            className="border-2 border-dashed border-border rounded-xl p-3 min-h-[120px] bg-muted/30"
          >
            <h4 className="font-bold text-sm text-center mb-2 text-primary">{category}</h4>
            <div className="space-y-1.5">
              {getItemsForCategory(category).map(item => {
                let itemClass = 'bg-primary/10 border-primary/30';
                if (answered) {
                  if (question.correctMapping[item] === category) {
                    itemClass = 'bg-accent/10 border-accent/30';
                  } else {
                    itemClass = 'bg-destructive/10 border-destructive/30';
                  }
                }
                return (
                  <motion.div
                    key={item}
                    layout
                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium flex items-center justify-between ${itemClass}`}
                  >
                    <span>{item}</span>
                    {!answered && (
                      <button
                        onClick={() => handleRemoveItem(item)}
                        className="text-muted-foreground hover:text-destructive ml-2"
                      >
                        ✕
                      </button>
                    )}
                    {answered && question.correctMapping[item] === category && (
                      <CheckCircle className="w-4 h-4 text-accent ml-2 shrink-0" />
                    )}
                    {answered && question.correctMapping[item] !== category && (
                      <XCircle className="w-4 h-4 text-destructive ml-2 shrink-0" />
                    )}
                  </motion.div>
                );
              })}
              {/* Drop target buttons */}
              {!answered && unplacedItems.length > 0 && (
                <div className="space-y-1">
                  {unplacedItems.map(item => (
                    <button
                      key={item}
                      onClick={() => handlePlaceItem(item, category)}
                      className="w-full text-left px-3 py-1.5 rounded-lg border border-dashed border-muted-foreground/20 text-xs text-muted-foreground hover:bg-primary/5 hover:border-primary/30 transition-all"
                    >
                      + {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}
      {!answered && (
        <div className="text-center">
          <Button
            onClick={handleSubmit}
            disabled={unplacedItems.length > 0}
            className="px-8"
          >
            確認答案
          </Button>
        </div>
      )}

      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl ${isCorrect ? 'bg-accent/10 border border-accent/30' : 'bg-destructive/10 border border-destructive/30'}`}
          >
            <p className="font-semibold mb-1">
              {isCorrect ? '🎉 全部分對了！' : '💪 有些位置不對喔！'}
            </p>
            <p className="text-sm text-muted-foreground">{question.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}