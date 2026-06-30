import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { useBrand } from '@/lib/BrandContext';
import { useWeeks } from '@/lib/hooks/useContent';
import { Lock, ChevronRight, Award, Zap } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { hasThemeAccess } from '@/api/arenaAccess';

// 概念競技場：每週練習題清單（原本的首頁內容搬到這裡）
export default function ArenaPractice() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const brand = useBrand();
  const { data: allWeeks = [], isLoading: weeksLoading } = useWeeks();

  // 沒開通「第一季」的帳號不能用網址直接進來 → 退回主題列表（那裡有開通碼入口）
  useEffect(() => {
    if (userData && !hasThemeAccess(userData, 'l1-season1')) navigate('/arena/band/l1');
  }, [userData, navigate]);

  const collection = userData?.collection || {};
  const latestAvailableWeek = brand?.latestAvailableWeek ?? 0;
  const weeks = allWeeks.filter(
    (w) => w.published && w.weekNumber <= latestAvailableWeek
  );

  const isWeekUnlocked = (week) => {
    if (week.weekNumber === 1) return true;
    const prevWeek = allWeeks.find((w) => w.weekNumber === week.weekNumber - 1);
    if (!prevWeek || !prevWeek.badgeId) return false;
    return !!collection[prevWeek.badgeId];
  };

  const isWeekCompleted = (week) => {
    if (!week.badgeId) return false;
    return !!collection[week.badgeId];
  };

  const showVDBlock = brand?.features?.showVDPractice;
  const hasVDBadge = !!collection['badge-value-detective'];

  if (weeksLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6">

        {/* Header */}
        <PageHeader
          backTo="/arena/band/l1"
          backLabel="L1 體驗"
          right={
            <button
              onClick={() => navigate('/Passport')}
              className="flex items-center gap-1.5 bg-violet-100 text-violet-700 text-xs font-bold px-3 py-2 rounded-xl hover:opacity-90 transition-all"
            >
              <Award className="w-3.5 h-3.5" />
              學習護照
            </button>
          }
        />

        {/* 標題 */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
          <div className="text-3xl mb-2">📚</div>
          <h1 className="text-2xl font-black text-foreground tracking-tight leading-tight">第一季</h1>
          <p className="text-sm text-muted-foreground mt-1">L1 體驗 · W1–W12 · 完成練習題拿徽章</p>
        </motion.div>

        {/* 直播限定特別區塊 */}
        {showVDBlock && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4"
          >
            <button
              onClick={() => navigate('/VDPractice')}
              className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
                hasVDBadge
                  ? 'border-violet-300 bg-violet-50'
                  : 'border-violet-500 bg-violet-50 hover:opacity-90 active:scale-[0.98]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-violet-500 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-violet-600">直播限定</p>
                      <span className="text-xs bg-violet-200 text-violet-700 px-1.5 py-0.5 rounded-full font-bold">VD-0419</span>
                    </div>
                    <p className="text-sm font-bold text-foreground">小T概念競技場 5題挑戰</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
              {hasVDBadge ? (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-violet-200 text-xs text-violet-600">
                  <Award className="w-3.5 h-3.5" />
                  <span>已獲得「價值偵探」徽章</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-violet-200 text-xs text-violet-500">
                  <span>⚡ 5題全對</span>
                  <span>·</span>
                  <span>🏅 自動解鎖徽章</span>
                  <span>·</span>
                  <span>🎯 機會成本</span>
                </div>
              )}
            </button>
          </motion.div>
        )}

        {/* 週次列表 */}
        <div className="space-y-3">
          {weeks.map((week, idx) => {
            const unlocked = isWeekUnlocked(week);
            const completed = isWeekCompleted(week);

            return (
              <motion.div
                key={week.weekNumber}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 + 0.15 }}
              >
                <button
                  onClick={() => unlocked && navigate(`/week/${week.weekNumber}`)}
                  disabled={!unlocked}
                  className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
                    completed
                      ? 'border-violet-300 bg-violet-50'
                      : unlocked
                      ? 'border-foreground bg-card hover:opacity-90 active:scale-[0.98]'
                      : 'border-border bg-muted/30 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black ${
                        completed
                          ? 'bg-violet-200 text-violet-700'
                          : unlocked
                          ? 'bg-foreground text-background'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {completed ? '✓' : unlocked ? week.weekNumber : <Lock className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground">
                          {week.title}
                          {completed && <span className="ml-2 text-violet-500">· 已完成</span>}
                          {!unlocked && <span className="ml-2">· 🔒 需先完成上一週</span>}
                        </p>
                        <p className={`text-sm font-bold mt-0.5 leading-snug ${
                          unlocked ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {week.question}
                        </p>
                      </div>
                    </div>
                    {unlocked && (
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                  </div>

                  {unlocked && !completed && (
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                      <span>📝 10 題測驗</span>
                      <span>·</span>
                      <span>✅ 有正確答案</span>
                      <span>·</span>
                      <span>📸 完成截圖</span>
                    </div>
                  )}

                  {completed && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-violet-200 text-xs text-violet-600">
                      <Award className="w-3.5 h-3.5" />
                      <span>已獲得徽章</span>
                    </div>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
