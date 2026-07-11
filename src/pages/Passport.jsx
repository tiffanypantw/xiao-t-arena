import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { useBrand } from '@/lib/BrandContext';
import { useRewards, useWeeks } from '@/lib/hooks/useContent';
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment, getDoc, setDoc } from 'firebase/firestore';
import {
  ArrowLeft,
  Key,
  Award,
  CreditCard,
  Settings,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { ARENA_BANDS } from '@/data/arenaStructure';
import { ROAD_THEMES, bloomColor } from '@/data/roadThemes';
import {
  DOMAINS,
  SEASON1_MAP,
  ROAD_WEEK_DOMAINS,
  SEASON1_DISPLAY,
} from '@/data/passportMap';
import { hasThemeAccess } from '@/api/arenaAccess';

// ============================================================================
// 兌換碼 Modal（沿用原本的流程，未改動）
// ============================================================================
function RedeemModal({ onClose, onSuccess }) {
  const { user, userData } = useAuth();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');

  const handleRedeem = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setStatus('loading');

    try {
      const codeRef = doc(db, 'redeemCodes', trimmed);
      const codeSnap = await getDoc(codeRef);

      if (!codeSnap.exists()) {
        setStatus('error');
        setMessage('找不到這個兌換碼，請確認後再試');
        return;
      }

      const codeData = codeSnap.data();
      const rewardId = codeData.rewardId;

      const alreadyOwned = userData?.collection?.[rewardId];
      if (alreadyOwned) {
        setStatus('error');
        setMessage('你已經擁有這個獎勵了！');
        return;
      }

      const currentUses = codeData.uses || 0;
      if (currentUses >= codeData.maxUses) {
        setStatus('error');
        setMessage('這個兌換碼已達使用上限');
        return;
      }

      await updateDoc(codeRef, { uses: increment(1) });

      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          collection: {
            [rewardId]: {
              unlockedAt: new Date().toISOString(),
              codeUsed: trimmed,
            },
          },
        },
        { merge: true }
      );

      const rewardSnap = await getDoc(doc(db, 'rewards', rewardId));
      const rewardName = rewardSnap.exists() ? rewardSnap.data().name : '獎勵';

      setStatus('success');
      setMessage(`🎉 成功解鎖：${rewardName}！`);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Redeem error:', err);
      setStatus('error');
      setMessage('發生錯誤，請再試一次');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 px-4 pb-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="bg-background rounded-2xl p-6 w-full max-w-md space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-black text-foreground">輸入兌換碼</h2>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="例如：B-EQ-K1U8"
          className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm font-mono tracking-wider focus:outline-none focus:border-foreground"
        />
        {status === 'error' && <p className="text-sm text-red-500">{message}</p>}
        {status === 'success' && (
          <p className="text-sm text-green-600 font-bold">{message}</p>
        )}
        <button
          onClick={handleRedeem}
          disabled={status === 'loading' || status === 'success'}
          className="w-full bg-violet-600 text-white font-black rounded-xl py-4 hover:opacity-90 transition-all disabled:opacity-50"
        >
          {status === 'loading' ? '驗證中...' : '確認兌換'}
        </button>
        <button onClick={onClose} className="w-full text-sm text-muted-foreground py-2">
          取消
        </button>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// 徽章／卡片放大 Modal（點路上完成的關卡出現）
// ============================================================================
function RewardPeek({ peek, onClose }) {
  if (!peek) return null;
  const { topic, iCan, badge, card, cardOwned } = peek;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl p-5 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-center text-sm font-black text-foreground mb-1">{topic}</p>
        {iCan && (
          <p className="text-center text-xs text-muted-foreground leading-relaxed mb-4">
            {iCan}
          </p>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="aspect-square bg-violet-50 rounded-2xl overflow-hidden flex items-center justify-center mb-2">
              {badge?.image ? (
                <img src={badge.image} alt={badge.name} className="w-full h-full object-cover" />
              ) : (
                <Award className="w-12 h-12 text-violet-300" />
              )}
            </div>
            <p className="text-[11px] font-bold text-violet-700">🎖 {badge?.name || '徽章'}</p>
          </div>
          <div className="text-center">
            <div className="aspect-square bg-teal-50 rounded-2xl overflow-hidden flex items-center justify-center mb-2">
              {cardOwned && card?.image ? (
                <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-3xl">{cardOwned ? '🃏' : '🔒'}</div>
              )}
            </div>
            <p className="text-[11px] font-bold text-teal-700">
              🃏 {cardOwned ? card?.name || '卡片' : '完成任務解鎖卡片'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full mt-4 text-sm text-muted-foreground py-2"
        >
          關閉
        </button>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// 路上的一關（row）
// ============================================================================
function WeekRow({ row, isLast, onPeek, onGo }) {
  const { state } = row;
  const ring = row.bloom ? bloomColor(row.bloom) : '#7c3aed';

  const dot = (() => {
    if (state === 'done') {
      return (
        <div
          className="w-10 h-10 rounded-full flex-none flex items-center justify-center bg-white relative z-10 overflow-hidden"
          style={{ boxShadow: `inset 0 0 0 3px ${ring}` }}
        >
          {row.badgeImage ? (
            <img src={row.badgeImage} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-base">✓</span>
          )}
        </div>
      );
    }
    if (state === 'next') {
      return (
        <div className="w-10 h-10 rounded-full flex-none flex items-center justify-center bg-white relative z-10 border-2 border-dashed border-violet-600 text-violet-600 text-[10px] font-black">
          GO
        </div>
      );
    }
    if (state === 'mystery') {
      return (
        <div className="w-10 h-10 rounded-full flex-none flex items-center justify-center bg-[#f3efe8] text-[#c4bcae] relative z-10 text-base font-black">
          ?
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-full flex-none flex items-center justify-center bg-[#f3efe8] text-[#c4bcae] relative z-10">
        <Lock className="w-4 h-4" />
      </div>
    );
  })();

  const clickable = state === 'done' || state === 'next';
  const handleClick = () => {
    if (state === 'done') onPeek(row);
    else if (state === 'next') onGo(row);
  };

  return (
    <div
      className={`flex gap-3 relative py-2 ${clickable ? 'cursor-pointer' : ''}`}
      onClick={clickable ? handleClick : undefined}
    >
      {!isLast && (
        <div className="absolute left-5 top-12 bottom-[-8px] w-[2px] bg-[#eee7db] rounded" />
      )}
      {dot}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-extrabold text-muted-foreground tracking-wide">
          W{row.n}
          {row.bloom && (
            <span
              className="inline-block ml-1.5 px-2 py-[1px] rounded-full text-white text-[9px] align-[1px]"
              style={{ backgroundColor: ring }}
            >
              {row.bloom}
            </span>
          )}
        </p>
        <p
          className={`text-sm font-extrabold mt-[1px] ${
            state === 'next'
              ? 'text-violet-600'
              : state === 'locked' || state === 'mystery'
              ? 'text-[#a89f8f]'
              : 'text-foreground'
          }`}
        >
          {state === 'mystery'
            ? '即將公開'
            : state === 'next'
            ? `${row.topic || '下一關'} · 等你來挑戰 →`
            : row.topic || `第 ${row.n} 關`}
        </p>
        {row.iCan && (
          <p
            className={`text-xs leading-relaxed mt-1 ${
              state === 'done' ? 'text-[#3d382f]' : 'text-[#b6ad9d]'
            }`}
          >
            {row.domain && (
              <span className="inline-block text-[9px] font-extrabold px-2 py-[1.5px] rounded-full bg-[#f0ebe3] text-[#7a7261] mr-1.5 align-[1.5px]">
                {row.domain}
              </span>
            )}
            {row.iCan}
          </p>
        )}
        {state === 'done' && (
          <div className="flex gap-1.5 mt-1.5 flex-wrap">
            <span className="text-[10px] font-bold px-2 py-[3px] rounded-full bg-violet-100 text-violet-700">
              🎖 {row.badgeName || '徽章'}
            </span>
            <span className="text-[10px] font-bold px-2 py-[3px] rounded-full bg-teal-50 text-teal-700">
              🃏 {row.cardOwned ? row.cardName || '卡片' : '完成任務解鎖'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 學習護照
// ============================================================================
export default function Passport() {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const brand = useBrand();
  const { data: rewards = {}, isLoading: rewardsLoading } = useRewards();
  const { data: weeks = [], isLoading: weeksLoading } = useWeeks();

  const [showRedeem, setShowRedeem] = useState(false);
  const [freshCollection, setFreshCollection] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [peek, setPeek] = useState(null);
  const [expandedBands, setExpandedBands] = useState(null); // null = 還沒初始化
  const [mapBandId, setMapBandId] = useState(null); // 能力地圖看哪個年齡段（null = 最高段）

  useEffect(() => {
    if (!user?.uid) return;
    const loadCollection = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setFreshCollection(snap.data().collection || {});
        }
      } catch (err) {
        console.error('讀取收藏失敗', err);
      }
    };
    loadCollection();
  }, [user?.uid]);

  const collection = freshCollection || userData?.collection || {};
  const latestAvailableWeek = brand?.latestAvailableWeek ?? 0;

  // ── 組出「章（年齡段）→ 路（主題）→ 關（週）」的完整模型 ──
  const model = useMemo(() => {
    const weekByNum = {};
    weeks.forEach((w) => {
      weekByNum[w.weekNumber] = w;
    });

    const decorate = (row) => {
      const badge = row.badgeId ? rewards[row.badgeId] : null;
      const card = row.cardId ? rewards[row.cardId] : null;
      return {
        ...row,
        badgeName: badge?.name,
        badgeImage: badge?.image,
        cardName: card?.name,
        cardOwned: row.cardId ? !!collection[row.cardId] : false,
      };
    };

    // 舊第一季：weeks doc 1–12，逐關解鎖（同 ArenaPractice 規則）
    const buildSeason1Rows = () => {
      const rows = [];
      let prevDone = true;
      for (let n = 1; n <= SEASON1_DISPLAY.totalWeeks; n++) {
        const d = weekByNum[n];
        const available = d && d.published && n <= latestAvailableWeek;
        const map = SEASON1_MAP[n];
        if (!available) {
          rows.push({
            n,
            weekNumber: n,
            topic: map?.topic || null,
            iCan: map?.iCan || null,
            domain: map?.domain || null,
            state: map ? 'locked' : 'mystery',
          });
          prevDone = false;
          continue;
        }
        const badgeId = d.badgeId || null;
        const owned = badgeId ? !!collection[badgeId] : false;
        rows.push(
          decorate({
            n,
            weekNumber: n,
            topic: d.title || map?.topic,
            iCan: d.iCan || map?.iCan || null,
            domain: d.domain || map?.domain || null,
            badgeId,
            cardId: d.cardId || null,
            state: owned ? 'done' : prevDone ? 'next' : 'locked',
          })
        );
        prevDone = owned;
      }
      return rows;
    };

    // 道路主題（roadThemes）：mystery / 逐關解鎖
    const buildRoadRows = (themeId) => {
      const rt = ROAD_THEMES[themeId];
      if (!rt) return [];
      const rows = [];
      let prevDone = true;
      for (const w of rt.weeks) {
        if (w.mystery) {
          rows.push({ n: w.n, state: 'mystery' });
          prevDone = false;
          continue;
        }
        const d = weekByNum[w.weekNumber];
        const published = !!d?.published;
        const owned = w.badgeId ? !!collection[w.badgeId] : false;
        rows.push(
          decorate({
            n: w.n,
            weekNumber: w.weekNumber,
            topic: w.topic,
            iCan: d?.iCan || w.iCan || null,
            domain: d?.domain || ROAD_WEEK_DOMAINS[w.weekNumber] || null,
            badgeId: w.badgeId || null,
            cardId: d?.cardId || null,
            bloom: w.bloom || null,
            state: owned ? 'done' : published && prevDone ? 'next' : 'locked',
          })
        );
        prevDone = owned;
      }
      return rows;
    };

    const bandModels = ARENA_BANDS.map((band) => {
      const themes = band.themes.map((t) => {
        const unlocked = hasThemeAccess(userData, t.id);
        if (t.id === SEASON1_DISPLAY.id) {
          return {
            ...SEASON1_DISPLAY,
            route: t.route,
            weeksLabel: t.weeks,
            unlocked,
            rows: buildSeason1Rows(),
          };
        }
        const rt = ROAD_THEMES[t.id];
        return {
          id: t.id,
          emoji: rt?.emoji || '📚',
          themeName: rt?.themeName || t.name,
          shortName: rt?.themeName || t.name,
          totalWeeks: rt?.weeks?.length || 12,
          route: t.route,
          weeksLabel: t.weeks,
          unlocked,
          rows: buildRoadRows(t.id),
        };
      });
      return { band, themes, unlockedAny: themes.some((t) => t.unlocked) };
    });

    let currentBandIdx = -1;
    bandModels.forEach((b, i) => {
      if (b.unlockedAny) currentBandIdx = i;
    });
    if (currentBandIdx === -1) {
      currentBandIdx = bandModels.findIndex((b) => b.band.id === 'l1');
    }

    return { bandModels, currentBandIdx };
  }, [weeks, rewards, collection, userData, latestAvailableWeek]);

  const { bandModels, currentBandIdx } = model;
  const currentBand = bandModels[currentBandIdx];

  // 能力地圖可以切換的年齡段（有解鎖課程的段；一段都沒有就只剩目前的段）
  const selectableBands = bandModels.filter((b) => b.unlockedAny);
  const mapBand =
    bandModels.find((b) => b.band.id === mapBandId && b.unlockedAny) || currentBand;
  const mapBandIdx = bandModels.indexOf(mapBand);

  // 章的展開狀態：預設只展開目前的章
  const isBandExpanded = (bandId) => {
    if (expandedBands === null) return bandId === currentBand?.band?.id;
    return !!expandedBands[bandId];
  };
  const toggleBand = (bandId) => {
    setExpandedBands((prev) => {
      const base =
        prev === null ? { [currentBand?.band?.id]: true } : { ...prev };
      base[bandId] = !isBandExpanded(bandId);
      return base;
    });
  };

  // ── 能力地圖統計（以地圖目前選的年齡段為準）──
  const domainStats = useMemo(() => {
    const stats = {};
    DOMAINS.forEach((d) => {
      stats[d.name] = { total: 0, done: 0 };
    });
    if (!mapBand) return stats;
    mapBand.themes.forEach((t) => {
      t.rows.forEach((r) => {
        if (!r.iCan || !r.domain || !stats[r.domain]) return;
        stats[r.domain].total += 1;
        if (r.state === 'done') stats[r.domain].done += 1;
      });
    });
    return stats;
  }, [mapBand]);

  // ── 全部統計 ──
  const totals = useMemo(() => {
    let iCanLit = 0;
    bandModels.forEach((b) =>
      b.themes.forEach((t) =>
        t.rows.forEach((r) => {
          if (r.state === 'done' && r.iCan) iCanLit += 1;
        })
      )
    );
    let badges = 0;
    let cards = 0;
    Object.keys(collection).forEach((id) => {
      const r = rewards[id];
      if (!r) return;
      if (r.type === 'badge') badges += 1;
      if (r.type === 'card') cards += 1;
    });
    return { iCanLit, badges, cards };
  }, [bandModels, collection, rewards]);

  // ── 特別收藏（直播限定等）──
  const specialOwned = useMemo(
    () =>
      Object.entries(rewards)
        .filter(([id, r]) => r.chapter === 'Special' && collection[id])
        .map(([id, r]) => ({ id, ...r })),
    [rewards, collection]
  );

  const handleRedeemSuccess = () => {
    window.location.reload();
  };

  const goWeek = (row) => {
    if (row.weekNumber) navigate(`/week/${row.weekNumber}`);
  };

  const openPeek = (row) => {
    setPeek({
      topic: `W${row.n} ${row.topic || ''}`,
      iCan: row.iCan,
      badge: row.badgeId ? rewards[row.badgeId] : null,
      card: row.cardId ? rewards[row.cardId] : null,
      cardOwned: row.cardOwned,
    });
  };

  const showRedeemButton = brand?.features?.showRedeemCodes ?? true;
  const passportBg = brand?.backgroundColor || '#f5f0eb';
  const teacherFirstName = userData?.displayName?.split(' ')[0] || '同學';

  if (rewardsLoading || weeksLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // 領域細節頁
  // ══════════════════════════════════════════════════════════════
  if (selectedDomain) {
    const domainDef = DOMAINS.find((d) => d.name === selectedDomain);
    const stat = domainStats[selectedDomain] || { total: 0, done: 0 };
    const currentDomainComplete = stat.total > 0 && stat.done >= stat.total;
    const pct = stat.total > 0 ? Math.round((stat.done / stat.total) * 100) : 0;

    const bandSections = bandModels
      .map((b, i) => {
        const lines = [];
        b.themes.forEach((t) => {
          t.rows.forEach((r) => {
            if (!r.iCan || r.domain !== selectedDomain) return;
            lines.push({
              key: `${t.id}-${r.n}`,
              done: r.state === 'done',
              iCan: r.iCan,
              source:
                r.state === 'done'
                  ? `${t.emoji} ${t.shortName} W${r.n} · ${r.topic || ''}`
                  : `${t.emoji} ${t.shortName} W${r.n} · 等你來挑戰`,
            });
          });
        });
        return { bandModel: b, idx: i, lines };
      })
      .filter((s) => s.lines.length > 0);

    return (
      <div className="min-h-screen" style={{ backgroundColor: passportBg }}>
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedDomain(null)}
                className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors bg-white"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <p className="text-xs text-muted-foreground">能力地圖</p>
                <p className="text-sm font-black text-foreground">{selectedDomain}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 text-center mb-4">
            <div className="text-4xl">{domainDef?.emoji}</div>
            <h1 className="text-lg font-black text-foreground mt-2">{selectedDomain}</h1>
            {domainDef?.desc && (
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {domainDef.desc}
              </p>
            )}
            <div className="h-2.5 bg-[#f0ebe3] rounded-full overflow-hidden mt-4">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs font-extrabold text-violet-700 mt-2">
              {mapBand?.band?.name} 已點亮 {stat.done} / {stat.total}
            </p>
          </div>

          {bandSections.map(({ bandModel, idx, lines }) => {
            const isFuture = idx > mapBandIdx && !bandModel.unlockedAny;
            const isCurrent = idx === mapBandIdx;
            return (
              <div key={bandModel.band.id} className="bg-white rounded-3xl p-4 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">{bandModel.band.emoji}</span>
                  <p className="text-sm font-black text-foreground">
                    {bandModel.band.name}（{bandModel.band.age}）
                  </p>
                  <span
                    className={`ml-auto text-[10px] font-extrabold px-2.5 py-[3px] rounded-full ${
                      isCurrent
                        ? 'bg-violet-100 text-violet-700'
                        : isFuture
                        ? currentDomainComplete
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-[#f0ebe3] text-muted-foreground'
                        : 'bg-green-50 text-green-700'
                    }`}
                  >
                    {isCurrent
                      ? '進行中'
                      : isFuture
                      ? currentDomainComplete
                        ? '✨ 預告點亮'
                        : `🔒 走滿${mapBand?.band?.name}後點亮`
                      : '✓'}
                  </span>
                </div>
                {lines.map((l) => (
                  <div
                    key={l.key}
                    className={`flex gap-2.5 py-2 text-xs leading-relaxed ${
                      l.done && !isFuture ? 'text-[#3d382f]' : 'text-[#a89f8f]'
                    }`}
                  >
                    <span
                      className={`flex-none w-5 h-5 rounded-full flex items-center justify-center text-[10px] mt-[1px] ${
                        l.done && !isFuture
                          ? 'bg-green-50 text-green-700'
                          : 'bg-[#f3efe8] text-[#c4bcae]'
                      }`}
                    >
                      {l.done && !isFuture ? '✓' : '🔒'}
                    </span>
                    <span>
                      {l.iCan}
                      <span className="block text-[10px] text-[#b6ad9d] mt-[2px]">
                        {l.source}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            );
          })}

          <p className="text-[11px] text-muted-foreground leading-relaxed px-2 mt-4">
            💡 這裡列的是目前課程教到的「我能」。學習目標地圖裡還有更多，會跟著未來的新課程陸續加進來。
          </p>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // 護照首頁
  // ══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen" style={{ backgroundColor: passportBg }}>
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/Home')}
              className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors bg-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <p className="text-xs text-muted-foreground">學習護照</p>
              <p className="text-sm font-black text-foreground">我的成長路</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/Profile')}
            className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors bg-white"
            title="個人資料設定"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* 問候 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-5"
        >
          <div className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
            ✨ 學習護照
          </div>
          <h1 className="text-2xl font-black text-foreground">
            嗨，{teacherFirstName}！
          </h1>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            每完成一關，就點亮一個「我能」。
            <br />
            這一頁，是你的財商成長路。
          </p>
        </motion.div>

        {/* 統計卡 */}
        <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-2.5 mb-4">
          <div className="rounded-2xl p-4 text-center text-white bg-gradient-to-br from-violet-600 to-violet-500">
            <p className="text-3xl font-black">{totals.iCanLit}</p>
            <p className="text-[11px] text-violet-100 mt-[2px]">💪 點亮的「我能」</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center">
            <p className="text-3xl font-black text-foreground">{totals.badges}</p>
            <p className="text-[11px] text-muted-foreground mt-[2px]">🎖 徽章</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center">
            <p className="text-3xl font-black text-foreground">{totals.cards}</p>
            <p className="text-[11px] text-muted-foreground mt-[2px]">🃏 卡片</p>
          </div>
        </div>

        {/* 兌換碼按鈕 */}
        {showRedeemButton && (
          <button
            onClick={() => setShowRedeem(true)}
            className="w-full bg-white border border-border text-foreground font-extrabold text-sm rounded-2xl py-3.5 flex items-center justify-center gap-2 mb-5 hover:bg-muted transition-all"
          >
            <Key className="w-4 h-4" />
            輸入兌換碼
          </button>
        )}

        {/* ── 能力地圖 ── */}
        <div className="bg-white rounded-3xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-sm font-black text-foreground">🧭 我的能力地圖</p>
            {selectableBands.length > 1 ? (
              <div className="ml-auto flex gap-1">
                {selectableBands.map((b) => (
                  <button
                    key={b.band.id}
                    onClick={() => setMapBandId(b.band.id)}
                    className={`text-[10px] font-extrabold px-2.5 py-[3px] rounded-full transition-colors ${
                      mapBand?.band?.id === b.band.id
                        ? 'bg-violet-600 text-white'
                        : 'bg-[#f0ebe3] text-muted-foreground hover:bg-violet-100'
                    }`}
                  >
                    {b.band.name}
                  </button>
                ))}
              </div>
            ) : (
              mapBand && (
                <span className="ml-auto text-[10px] font-extrabold bg-violet-100 text-violet-700 px-2.5 py-[3px] rounded-full">
                  {mapBand.band.name} {mapBand.band.age}
                </span>
              )
            )}
          </div>
          {DOMAINS.map((d) => {
            const stat = domainStats[d.name] || { total: 0, done: 0 };
            if (d.extra && stat.total === 0) return null;
            const hasContent = stat.total > 0;
            const pct = hasContent ? (stat.done / stat.total) * 100 : 0;
            return (
              <div
                key={d.name}
                className={`flex items-center gap-2.5 py-[7px] px-1 rounded-xl ${
                  hasContent ? 'cursor-pointer hover:bg-[#faf7f2]' : ''
                }`}
                onClick={hasContent ? () => setSelectedDomain(d.name) : undefined}
              >
                <span className={`w-6 text-center text-[15px] flex-none ${hasContent ? '' : 'opacity-40'}`}>
                  {d.emoji}
                </span>
                <span
                  className={`text-xs font-extrabold w-[104px] flex-none ${
                    hasContent ? 'text-foreground' : 'text-[#b6ad9d]'
                  }`}
                >
                  {d.name}
                </span>
                {hasContent ? (
                  <>
                    <div className="flex-1 h-2 bg-[#f0ebe3] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-400"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-extrabold text-muted-foreground w-10 text-right flex-none">
                      {stat.done} / {stat.total}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#d5cdc0] flex-none" />
                  </>
                ) : (
                  <span className="flex-1 text-right text-[10px] font-bold text-[#b6ad9d]">
                    {d.lockedNote || '未來課程加入'}
                  </span>
                )}
              </div>
            );
          })}
          <p className="text-[10.5px] text-muted-foreground leading-relaxed mt-2.5 pt-2.5 border-t border-dashed border-[#eee7db]">
            分母是目前課程教到的「我能」。點任何一條，看細節和下一個年齡段的預告 ✨
          </p>
        </div>

        {/* ── 成長章節 ── */}
        <p className="text-xs font-black text-muted-foreground tracking-widest px-1 mb-2.5">
          我的成長章節
        </p>

        {bandModels.map((b, i) => {
          const { band, themes, unlockedAny } = b;
          const isCurrent = i === currentBandIdx;

          // 沒有主題的年齡段：目前章之後的顯示預告，其餘略過
          if (themes.length === 0) {
            if (i > currentBandIdx) {
              return (
                <div
                  key={band.id}
                  className="bg-[#efe9e0] rounded-2xl px-4 py-3.5 mb-2.5 flex items-center gap-2.5 text-xs font-bold text-[#7a7261]"
                >
                  <span className="text-base">{band.emoji}</span>
                  {band.name}（{band.age}）· 未來的路
                  <Lock className="w-3.5 h-3.5 ml-auto text-[#b6ad9d]" />
                </div>
              );
            }
            return null;
          }

          // 有主題但一個都沒解鎖、又不是目前章 → 一行預告
          if (!unlockedAny && !isCurrent) {
            return (
              <div
                key={band.id}
                onClick={() => navigate(`/arena/band/${band.id}`)}
                className="bg-[#efe9e0] rounded-2xl px-4 py-3.5 mb-2.5 flex items-center gap-2.5 text-xs font-bold text-[#7a7261] cursor-pointer hover:bg-[#e9e1d5]"
              >
                <span className="text-base">{band.emoji}</span>
                {band.name}（{band.age}）· {themes.length} 條路等你解鎖
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#b6ad9d]" />
              </div>
            );
          }

          const expanded = isBandExpanded(band.id);
          const bandDone = themes.reduce(
            (acc, t) => acc + t.rows.filter((r) => r.state === 'done').length,
            0
          );

          return (
            <div key={band.id} className="bg-white rounded-3xl mb-3 overflow-hidden">
              {/* 章 header */}
              <button
                onClick={() => toggleBand(band.id)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-none ${band.iconBg}`}
                >
                  {band.emoji}
                </div>
                <div>
                  <p className="text-[15px] font-black text-foreground">{band.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-[1px]">{band.age}</p>
                </div>
                <div className="ml-auto text-right flex-none">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-[3px] rounded-full ${
                      isCurrent
                        ? 'bg-violet-100 text-violet-700'
                        : 'bg-green-50 text-green-700'
                    }`}
                  >
                    {isCurrent ? '進行中' : `✓ ${bandDone} 關`}
                  </span>
                  <span className="block text-[10px] text-[#b6ad9d] mt-1">
                    {expanded ? '收起來 ▴' : '點開 ▾'}
                  </span>
                </div>
              </button>

              {/* 章 body */}
              {expanded && (
                <div className="px-3.5 pb-4">
                  {themes.map((t) => {
                    if (!t.unlocked) {
                      return (
                        <div
                          key={t.id}
                          onClick={() => navigate(`/arena/band/${band.id}`)}
                          className="border border-dashed border-[#e0d8ca] rounded-2xl px-4 py-3.5 mt-3 flex items-center gap-2.5 text-xs font-bold text-[#7a7261] cursor-pointer hover:bg-[#faf7f2]"
                        >
                          <Lock className="w-3.5 h-3.5 flex-none" />
                          {t.themeName} · {t.totalWeeks} 個「我能」等你解鎖
                          <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#b6ad9d]" />
                        </div>
                      );
                    }

                    const done = t.rows.filter((r) => r.state === 'done').length;
                    const total = t.totalWeeks;
                    return (
                      <div
                        key={t.id}
                        className="border border-[#eee7db] rounded-2xl p-3.5 mt-3"
                      >
                        <div
                          className="flex items-start gap-2.5 cursor-pointer"
                          onClick={() => navigate(t.route)}
                        >
                          <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center text-lg flex-none">
                            {t.emoji}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-foreground leading-tight">
                              {t.themeName}
                            </p>
                            <p className="text-[10.5px] text-muted-foreground mt-[2px]">
                              {t.weeksLabel}
                            </p>
                          </div>
                          <div className="ml-auto text-right flex-none">
                            <p className="text-sm font-black text-violet-600">{done}</p>
                            <p className="text-[10px] text-muted-foreground">/ {total} 關</p>
                          </div>
                        </div>
                        <div className="h-1.5 bg-[#f0ebe3] rounded-full overflow-hidden mt-2.5 mb-1">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-400"
                            style={{ width: `${(done / total) * 100}%` }}
                          />
                        </div>
                        <div className="mt-1">
                          {t.rows.map((r, idx) => (
                            <WeekRow
                              key={r.n}
                              row={r}
                              isLast={idx === t.rows.length - 1}
                              onPeek={openPeek}
                              onGo={goWeek}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* ── 特別收藏 ── */}
        {specialOwned.length > 0 && (
          <>
            <p className="text-xs font-black text-muted-foreground tracking-widest px-1 mt-6 mb-2.5">
              特別收藏
            </p>
            <div className="bg-white rounded-3xl p-4">
              <p className="text-[11px] text-muted-foreground mb-3">
                🌟 直播、活動限定——收到就是你的，跨章節一直都在。
              </p>
              <div className="grid grid-cols-2 gap-3">
                {specialOwned.map((r) => (
                  <div
                    key={r.id}
                    className="border border-[#eee7db] rounded-2xl overflow-hidden text-center"
                  >
                    <div className="aspect-square bg-gradient-to-br from-amber-50 to-pink-50 flex items-center justify-center">
                      {r.image ? (
                        <img
                          src={r.image}
                          alt={r.name}
                          className="w-full h-full object-cover"
                        />
                      ) : r.type === 'badge' ? (
                        <Award className="w-10 h-10 text-amber-400" />
                      ) : (
                        <CreditCard className="w-10 h-10 text-pink-400" />
                      )}
                    </div>
                    <p className="text-[11px] font-extrabold text-foreground px-2 py-2">
                      {r.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showRedeem && (
          <RedeemModal
            onClose={() => setShowRedeem(false)}
            onSuccess={handleRedeemSuccess}
          />
        )}
        {peek && <RewardPeek peek={peek} onClose={() => setPeek(null)} />}
      </AnimatePresence>
    </div>
  );
}
