import React from 'react';
import { motion } from 'framer-motion';
import { XP_LEVELS, XP_MAX_PER_GROUP, getGroupXP, getTotalXP, getLevelInfo } from './xpSystem';

export default function XPSummary({ progressData, groupLabel, groupKey }) {
  const totalXP = getTotalXP(progressData);
  const { current, next } = getLevelInfo(totalXP);

  // 若有指定 groupKey，顯示單組；否則顯示總覽
  const record = groupKey ? progressData.find(p => p.concept_group === groupKey) : null;
  const groupXP = record ? getGroupXP(record) : null;

  const levelProgress = next
    ? Math.round(((totalXP - current.minXP) / (next.minXP - current.minXP)) * 100)
    : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-3"
    >
      {/* 總等級 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{current.emoji}</span>
          <div>
            <p className="font-bold text-sm text-foreground">{current.label}</p>
            <p className="text-xs text-muted-foreground">
              總 XP：{totalXP} {next ? `/ ${next.minXP}` : '（滿級）'}
            </p>
          </div>
        </div>
        {next && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">距離下一級</p>
            <p className="text-sm font-bold text-primary">{next.minXP - totalXP} XP</p>
          </div>
        )}
      </div>

      {/* 總等級進度條 */}
      <div className="w-full bg-muted rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${levelProgress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary"
        />
      </div>

      {/* 單組 XP（若有） */}
      {groupXP !== null && (
        <div className="pt-1">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{groupLabel} XP</span>
            <span>{groupXP} / {XP_MAX_PER_GROUP}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((groupXP / XP_MAX_PER_GROUP) * 100, 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-1.5 rounded-full bg-accent"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}