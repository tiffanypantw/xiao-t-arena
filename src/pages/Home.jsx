import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { useBrand } from '@/lib/BrandContext';
import { Award, Settings, ChevronRight, Trophy, PiggyBank, HelpCircle, ExternalLink, Lightbulb, Facebook, Instagram, Youtube, Mic, Mail } from 'lucide-react';

const SKOOL_URL = 'https://www.skool.com/next-gen-finance-7415/about';

const JAR_DOTS = [
  { label: '花', color: '#B25E1B' },
  { label: '存', color: '#9A7611' },
  { label: '學', color: '#1C7C4C' },
  { label: '投', color: '#1B5FA0' },
  { label: '給', color: '#9C3F7E' },
];

const SOCIALS = [
  { label: '臉書', url: 'https://www.facebook.com/ms.tiffany.finlit/', icon: Facebook, color: '#1877F2' },
  { label: 'IG', url: 'https://www.instagram.com/ms.tiffany.finlit/', icon: Instagram, color: '#E1306C' },
  { label: 'YouTube', url: 'https://www.youtube.com/@Ms.Tiffany.FinLit', icon: Youtube, color: '#FF0000' },
  { label: 'Podcast', url: 'https://reurl.cc/A3DL5Y', icon: Mic, color: '#7C3AED' },
  { label: '電子報', url: 'https://mstiffanyfinlit.kit.com/wednesday_ai_finlit_live', icon: Mail, color: '#1FAE78' },
];

export default function Home() {
  const navigate = useNavigate();
  const { userData, logout } = useAuth();
  const brand = useBrand();

  const tiles = [
    {
      key: 'trivia',
      title: '金錢冷知識',
      sub: '好玩的世界知識・拿積分',
      icon: Lightbulb,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      onClick: () => navigate('/trivia'),
    },
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
              <p className="text-base font-black text-foreground">我的 5 罐子記帳</p>
              <p className="text-sm text-muted-foreground mt-0.5">把零用錢分配好，照顧現在也照顧未來</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          </div>
          <div className="flex gap-2 mt-3">
            {JAR_DOTS.map((j) => (
              <div key={j.label} className="flex-1 bg-card border border-border rounded-xl py-2 text-center">
                <div className="w-3.5 h-3.5 rounded-full mx-auto mb-1" style={{ background: j.color }} />
                <div className="text-sm font-bold text-foreground">{j.label}</div>
              </div>
            ))}
          </div>
        </motion.button>

        {/* 區塊 grid */}
        <div className="grid grid-cols-2 gap-3">

          {/* 概念競技場 */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => navigate('/arena')}
            className="relative text-left rounded-2xl border border-border bg-card p-4 min-h-[130px] flex flex-col justify-between transition-all hover:opacity-90 active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <p className="text-base font-black text-foreground leading-tight">概念競技場</p>
              <p className="text-sm text-muted-foreground mt-0.5">選年齡段・每週練習題</p>
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
                className="relative text-left rounded-2xl border border-border bg-card p-4 min-h-[130px] flex flex-col justify-between hover:opacity-90 active:scale-[0.98] transition-all"
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
                  <p className="text-base font-black text-foreground leading-tight">{t.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{t.sub}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* 找到 Tiffany 老師 */}
        <div className="mt-7">
          <p className="text-center text-xs font-bold text-muted-foreground mb-2.5">找到 Tiffany 老師</p>
          <div className="flex justify-center flex-wrap gap-2">
            {SOCIALS.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.label}
                  onClick={() => window.open(s.url, '_blank', 'noopener')}
                  className="flex items-center gap-1.5 border border-border bg-card rounded-full px-3 py-1.5 text-xs font-bold text-muted-foreground hover:opacity-90 active:scale-95 transition-all"
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: s.color }} /> {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 品牌掛名 */}
        <div className="text-center text-sm font-bold text-violet-700 mt-6">
          goodwhale × tiffany陪孩子學財商
        </div>

      </div>
    </div>
  );
}
