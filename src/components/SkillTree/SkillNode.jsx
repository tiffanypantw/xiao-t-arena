import React from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle2, ChevronRight } from 'lucide-react';
import { UNLOCK_MIN_ATTEMPTS } from './skillTreeData';

export default function SkillNode({ nodeKey, progress, unlocked, levelColor, onClick, delay = 0 }) {
  const { attempts, accuracy, mastered, label, icon } = progress;
  const started = attempts > 0;
  const progressPct = Math.min(100, Math.round((attempts / UNLOCK_MIN_ATTEMPTS) * 100));

  let statusIcon = null;
  let cardClass = '';
  let ringClass = '';

  if (!unlocked) {
    cardClass = 'bg-muted/40 border-border opacity-60';
    ringClass = 'bg-muted';
  } else if (mastered) {
    cardClass = 'bg-card border-accent/40 shadow-md';
    ringClass = `bg-gradient-to-br ${levelColor}`;
  } else if (started) {
    cardClass = 'bg-card border-border shadow-sm';
    ringClass = `bg-gradient-to-br ${levelColor} opacity-60`;
  } else {
    cardClass = 'bg-card border-border shadow-sm';
    ringClass = 'bg-muted';
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      onClick={unlocked ? onClick : undefined}
      disabled={!unlocked}
      className={`relative w-full border-2 rounded-2xl p-4 text-left transition-all duration-200 ${cardClass} ${unlocked ? 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer active:scale-[0.98]' : 'cursor-not-allowed'}`}
    >
      <div className="flex items-center gap-3">
        {/* Icon circle */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${ringClass}`}>
          {!unlocked ? <Lock className="w-5 h-5 text-muted-foreground" /> : icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={`font-bold text-sm leading-tight ${unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
              {label}
            </p>
            {mastered && <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />}
          </div>

          {unlocked && (
            <div className="mt-1.5">
              {started ? (
                <>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>{attempts} 題 · {accuracy}% 正確</span>
                    {mastered && <span className="text-accent font-semibold">✓ 已精通</span>}
                    {!mastered && <span>{attempts}/{UNLOCK_MIN_ATTEMPTS} 題</span>}
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 0.8, delay: delay + 0.2 }}
                      className={`h-1.5 rounded-full bg-gradient-to-r ${levelColor}`}
                    />
                  </div>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">尚未開始練習</p>
              )}
            </div>
          )}

          {!unlocked && (
            <p className="text-xs text-muted-foreground mt-0.5">完成上一關卡後解鎖</p>
          )}
        </div>

        {unlocked && (
          <ChevronRight className={`w-4 h-4 shrink-0 ${mastered ? 'text-accent' : 'text-muted-foreground'}`} />
        )}
      </div>
    </motion.button>
  );
}