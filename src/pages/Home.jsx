import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { WEEKS, REWARDS } from '@/lib/redeemCodes';
import { Lock, ChevronRight, Award, BookOpen, Zap } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { userData, logout } = useAuth();

  const collection = userData?.collection || {};

  const isWeekUnlocked = (week) => {
    if (week.id === 'week1') return true;
    const prevWeek = WEEKS[WEEKS.findIndex((w) => w.id === week.id) - 1];
    if (!prevWeek || !prevWeek.badgeId) return false;
    return !!collection[prevWeek.badgeId];
  };

  const isWeekCompleted = (week) => {
    if (!week.badgeId) return false;
    return !!collection[week.badgeId];
  };

  const hasVDBadge = !!collection["badge-value-detective"];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-muted-foreground">歡迎回來</p>
            <p className="text-base font-black text-foreground">
              {userData?.displayName?.split(' ')[0] || '同學'} 👋
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/Passport')}
              className="flex items-center gap-1.5 bg-violet-100 text-violet-700 text-xs font-bold px-3 py-2 rounded-xl hover:opacity-90 transition-all"
            >
              <Award className="w-3.5 h-3.5" />
              學習護照
            </button>
            <button
              onClick={logout}
              className="text-xs text-muted-foreground border border-border px-3 py-2 rounded-xl hover:bg-muted transition-all"
            >
              登出
            </button>
          </div>
        </div>

        {/* 標題 */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="text-4xl mb-3">🧠</div>
          <h1 className="text-2xl font-black text-foreground tracking-tight leading-tight">
            小T的財商概念競技場
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            每週一個大問題，讓孩子學會思考金錢與價值
          </p>
        </motion.div>

        {/* 直播限定特別區塊 */}
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

        {/* 週次列表 */}
        <div className="space-y-3">
          {WEEKS.map((week, idx) => {
            const unlocked = isWeekUnlocked(week);
            const completed = isWeekCompleted(week);

            return (
              <motion.div
                key={week.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 + 0.15 }}
              >
                <button
                  onClick={() => unlocked && navigate(`/week/${idx + 1}`)}
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
                        {completed ? '✓' : unlocked ? idx + 1 : <Lock className="w-4 h-4" />}
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

        {/* 底部提示 */}
        <div className="mt-6 bg-muted/40 border border-border rounded-2xl p-4 flex items-start gap-3">
          <BookOpen className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            完成測驗後截圖，寄給老師即可獲得兌換碼。輸入兌換碼解鎖徽章，才能進入下一週！
          </p>
        </div>

      </div>
    </div>
  );
}