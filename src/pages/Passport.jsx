import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { REDEEM_CODES, REWARDS } from '@/lib/redeemCodes';
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { ArrowLeft, Key, Award, CreditCard } from 'lucide-react';

function RedeemModal({ onClose, onSuccess }) {
  const { user, userData, saveProgress } = useAuth();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  const handleRedeem = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setStatus('loading');

    const codeData = REDEEM_CODES[trimmed];
    if (!codeData) {
      setStatus('error');
      setMessage('找不到這個兌換碼，請確認後再試');
      return;
    }

    // 確認用戶沒有已經兌換過這個獎勵
    const rewardId = codeData.rewardId;
    const alreadyOwned = userData?.collection?.[rewardId];
    if (alreadyOwned) {
      setStatus('error');
      setMessage('你已經擁有這個獎勵了！');
      return;
    }

    // 確認這個碼還有剩餘次數
    const codeRef = doc(db, 'redeemCodes', trimmed);
    const codeSnap = await getDoc(codeRef);

    let currentUses = 0;
    if (codeSnap.exists()) {
      currentUses = codeSnap.data().uses || 0;
    }

    if (currentUses >= codeData.maxUses) {
      setStatus('error');
      setMessage('這個兌換碼已達使用上限');
      return;
    }

    // 兌換成功！更新 Firestore
    try {
      // 記錄碼的使用次數
      await updateDoc(codeRef, { uses: increment(1) }).catch(async () => {
        // 如果文件不存在，先建立
        const { setDoc } = await import('firebase/firestore');
        await setDoc(codeRef, { uses: 1, code: trimmed });
      });

      // 把獎勵加到用戶的收藏
      const userRef = doc(db, 'users', user.uid);
      const { setDoc: setDocFn } = await import('firebase/firestore');
      await setDocFn(
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

      setStatus('success');
      setMessage(`🎉 成功解鎖：${REWARDS[rewardId].name}！`);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
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
        {status === 'error' && (
          <p className="text-sm text-red-500">{message}</p>
        )}
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

export default function Passport() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [tab, setTab] = useState('badges');
  const [showRedeem, setShowRedeem] = useState(false);

  const collection = userData?.collection || {};

  const badges = Object.entries(REWARDS)
    .filter(([, r]) => r.type === 'badge')
    .map(([id, r]) => ({ id, ...r, owned: !!collection[id] }));

  const cards = Object.entries(REWARDS)
    .filter(([, r]) => r.type === 'card')
    .map(([id, r]) => ({ id, ...r, owned: !!collection[id] }));

  const ownedBadges = badges.filter((b) => b.owned).length;
  const ownedCards = cards.filter((c) => c.owned).length;

  const handleRedeemSuccess = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/Home')}
            className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors bg-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <p className="text-xs text-muted-foreground">學習護照</p>
            <p className="text-sm font-black text-foreground">我的收藏</p>
          </div>
        </div>

        {/* 問候 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
            ✨ 學習護照
          </div>
          <h1 className="text-2xl font-black text-foreground">
            嗨，{userData?.displayName?.split(' ')[0] || '同學'}陪孩子學財商！
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            輸入兌換碼，收集你的學習徽章和卡片吧！
          </p>
        </motion.div>

        {/* 統計卡 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-2xl p-5 text-center">
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Award className="w-5 h-5 text-violet-600" />
            </div>
            <p className="text-3xl font-black text-foreground">{ownedBadges}</p>
            <p className="text-sm text-muted-foreground">我的徽章</p>
          </div>
          <div className="bg-white rounded-2xl p-5 text-center">
            <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <CreditCard className="w-5 h-5 text-teal-600" />
            </div>
            <p className="text-3xl font-black text-foreground">{ownedCards}</p>
            <p className="text-sm text-muted-foreground">我的卡片</p>
          </div>
        </div>

        {/* 兌換碼按鈕 */}
        <button
          onClick={() => setShowRedeem(true)}
          className="w-full bg-violet-600 text-white font-black rounded-2xl py-4 flex items-center justify-center gap-2 mb-3 hover:opacity-90 transition-all"
        >
          <Key className="w-5 h-5" />
          輸入兌換碼
        </button>

        {/* Tab */}
        <div className="grid grid-cols-2 bg-white rounded-2xl p-1 mb-4">
          <button
            onClick={() => setTab('badges')}
            className={`rounded-xl py-2 text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
              tab === 'badges' ? 'bg-foreground text-background' : 'text-muted-foreground'
            }`}
          >
            <Award className="w-4 h-4" />
            徽章 ({ownedBadges})
          </button>
          <button
            onClick={() => setTab('cards')}
            className={`rounded-xl py-2 text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
              tab === 'cards' ? 'bg-foreground text-background' : 'text-muted-foreground'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            卡片 ({ownedCards})
          </button>
        </div>

        {/* 收藏內容 */}
        <div className="grid grid-cols-2 gap-3">
          {tab === 'badges' && badges.map((badge) => (
            <div key={badge.id} className={`bg-white rounded-2xl overflow-hidden ${!badge.owned ? 'opacity-40' : ''}`}>
              <div className="aspect-square bg-muted flex items-center justify-center">
                {badge.owned ? (
                  badge.image ? (
                    <img src={badge.image} alt={badge.name} className="w-full h-full object-cover" />
                  ) : (
                    <Award className="w-16 h-16 text-violet-400" />
                  )
                ) : (
                  <div className="text-4xl">🔒</div>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-center gap-1 mb-1">
                  <Award className="w-3 h-3 text-violet-500" />
                  <span className="text-xs text-violet-500 font-bold">徽章</span>
                </div>
                <p className="text-sm font-bold text-foreground">{badge.name}</p>
              </div>
            </div>
          ))}

          {tab === 'cards' && cards.map((card) => (
            <div key={card.id} className={`bg-white rounded-2xl overflow-hidden ${!card.owned ? 'opacity-40' : ''}`}>
              <div className="aspect-square bg-muted flex items-center justify-center">
                {card.owned ? (
                  card.image ? (
                    <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                  ) : (
                    <CreditCard className="w-16 h-16 text-teal-400" />
                  )
                ) : (
                  <div className="text-4xl">🔒</div>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-center gap-1 mb-1">
                  <CreditCard className="w-3 h-3 text-teal-500" />
                  <span className="text-xs text-teal-500 font-bold">卡片</span>
                </div>
                <p className="text-sm font-bold text-foreground">{card.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 兌換碼 Modal */}
      <AnimatePresence>
        {showRedeem && (
          <RedeemModal
            onClose={() => setShowRedeem(false)}
            onSuccess={handleRedeemSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}