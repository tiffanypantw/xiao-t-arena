import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { useBrand } from '@/lib/BrandContext';
import { Award, Settings, ChevronRight, Trophy, PiggyBank, HelpCircle, ExternalLink, Lock, KeyRound } from 'lucide-react';
import { hasArenaAccess, redeemArenaCode } from '@/api/arenaAccess';

const SKOOL_URL = 'https://www.skool.com/next-gen-finance-7415/about';

const JAR_DOTS = [
  { label: '花', color: '#B25E1B' },
  { label: '存', color: '#9A7611' },
  { label: '學', color: '#1C7C4C' },
  { label: '投', color: '#1B5FA0' },
  { label: '給', color: '#9C3F7E' },
];

export default function Home() {
  const navigate = useNavigate();
  const { user, userData, logout, refreshUserData } = useAuth();
  const brand = useBrand();

  const arenaUnlocked = hasArenaAccess(userData);
  const [gateOpen, setGateOpen] = useState(false);
  const [code, setCode] = useState('');
  const [gateError, setGateError] = useState('');
  const [gateBusy, setGateBusy] = useState(false);

  const submitCode = async () => {
    setGateError('');
    setGateBusy(true);
    const res = await redeemArenaCode(user?.uid, code);
    setGateBusy(false);
    if (res.success) {
      await refreshUserData();
      setGateOpen(false);
      setCode('');
      navigate('/arena');
    } else {
      setGateError(res.error || '開通失敗');
    }
  };

  const arenaTileClick = () => {
    if (arenaUnlocked) navigate('/arena');
    else setGateOpen((v) => !v);
  };

  const tiles = [
    {
      key: 'passport',
      title: '學習護照',
      sub: '徽章與卡片收藏',
      icon: Award,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-500',
      onClick: () => navigate('/Passport'),
    },
    {
      key: 'club',
      title: '財富思維啟航俱樂部',
      sub: '每週主課・前往 Skool',
      icon: ExternalLink,
      iconBg: 'bg-sky-50',
      iconColor: 'text-sky-600',
      external: true,
      onClick: () => window.open(SKOOL_URL, '_blank', 'noopener'),
    },
    {
      key: 'stop',
      title: '買之前先停一下',
      sub: '想花錢時，問 4 個問題',
      icon: HelpCircle,
      iconBg: 'bg-pink-50',
      iconColor: 'text-pink-600',
      onClick: () => navigate('/stop'),
    },
  ];

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
              onClick={() => navigate('/Profile')}
              className="w-8 h-8 border border-border rounded-xl flex items-center justify-center hover:bg-muted transition-all"
              title="個人資料"
            >
              <Settings className="w-3.5 h-3.5 text-muted-foreground" />
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
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="text-4xl mb-3">🧠</div>
          <h1 className="text-2xl font-black text-foreground tracking-tight leading-tight">
            {brand?.brandFullName || brand?.brandName || '小T財商競技場'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {brand?.brandTagline || '在這裡，我們是使用金錢的人'}
          </p>
        </motion.div>

        {/* 記帳工具：主角 */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate('/money')}
          className="w-full text-left rounded-2xl border-2 border-accent bg-accent/10 p-4 mb-4 hover:opacity-90 active:scale-[0.99] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
              <PiggyBank className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-foreground">我的 5 罐子記帳</p>
              <p className="text-xs text-muted-foreground mt-0.5">把零用錢分配好，照顧現在也照顧未來</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          </div>
          <div className="flex gap-2 mt-3">
            {JAR_DOTS.map((j) => (
              <div key={j.label} className="flex-1 bg-card border border-border rounded-xl py-2 text-center">
                <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ background: j.color }} />
                <div className="text-[11px] font-bold text-foreground">{j.label}</div>
              </div>
            ))}
          </div>
        </motion.button>

        {/* 區塊 grid */}
        <div className="grid grid-cols-2 gap-3">

          {/* 概念競技場（可能上鎖） */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={arenaTileClick}
            className={`relative text-left rounded-2xl border p-4 min-h-[118px] flex flex-col justify-between transition-all hover:opacity-90 active:scale-[0.98] ${
              arenaUnlocked ? 'border-border bg-card' : 'border-dashed border-violet-300 bg-violet-50/50'
            }`}
          >
            {!arenaUnlocked && (
              <span className="absolute top-3 right-3 flex items-center gap-1 bg-violet-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg">
                <Lock className="w-2.5 h-2.5" /> 開通碼
              </span>
            )}
            <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-black text-foreground leading-tight">概念競技場</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {arenaUnlocked ? '每週練習題・拿徽章' : '俱樂部加購會員專屬'}
              </p>
            </div>
          </motion.button>

          {tiles.map((t, idx) => {
            const Icon = t.icon;
            return (
              <motion.button
                key={t.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 + 0.16 }}
                onClick={t.onClick}
                className="relative text-left rounded-2xl border border-border bg-card p-4 min-h-[118px] flex flex-col justify-between hover:opacity-90 active:scale-[0.98] transition-all"
              >
                {t.external && (
                  <span className="absolute top-3 right-3 flex items-center gap-1 bg-sky-50 text-sky-700 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                    Skool <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                )}
                <div className={`w-9 h-9 rounded-xl ${t.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${t.iconColor}`} />
                </div>
                <div>
                  <p className="text-sm font-black text-foreground leading-tight">{t.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.sub}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* 開通碼輸入面板 */}
        {gateOpen && !arenaUnlocked && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 border border-violet-200 bg-violet-50 rounded-2xl p-4"
          >
            <p className="text-sm font-black text-violet-700 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4" /> 輸入概念競技場開通碼
            </p>
            <p className="text-xs text-muted-foreground mt-1 mb-3">
              概念競技場是俱樂部加購會員的資格。輸入你拿到的開通碼就能解鎖每週練習題。
            </p>
            <div className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) submitCode(); }}
                placeholder="輸入開通碼"
                className="flex-1 text-sm px-3 py-2 rounded-xl border border-border bg-card tracking-wider focus:outline-none focus:border-primary"
              />
              <button
                onClick={submitCode}
                disabled={gateBusy}
                className="bg-violet-600 text-white text-sm font-bold px-4 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {gateBusy ? '…' : '解鎖'}
              </button>
            </div>
            {gateError && <p className="text-xs text-destructive font-bold mt-2">{gateError}</p>}
          </motion.div>
        )}

        {/* 品牌掛名 */}
        <div className="text-center text-xs font-bold text-violet-700 mt-6">
          goodwhale × tiffany陪孩子學財商
        </div>

      </div>
    </div>
  );
}
