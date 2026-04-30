import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProgressById, approveTask, rejectTask } from '@/api/weeklyProgress';
import { REWARDS } from '@/lib/redeemCodes';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function AdminDeepDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [selectedCard, setSelectedCard] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showReject, setShowReject] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);

  // 取得卡片列表
  const cards = Object.entries(REWARDS)
    .filter(([, r]) => r.type === 'card')
    .map(([id, r]) => ({ id, name: r.name }));

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getProgressById(id);
        setRecord(data);
        // 撈用戶名字
        if (data?.userId) {
          const userSnap = await getDocs(
            query(collection(db, 'users'), where('uid', '==', data.userId))
          );
          if (!userSnap.empty) {
            setUserName(userSnap.docs[0].data().displayName || data.userId.slice(0, 8));
          }
        }
        // 預設選第一張卡片
        if (cards.length > 0) setSelectedCard(cards[0].id);
      } catch (err) {
        console.error('載入失敗', err);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const formatTime = (timestamp) => {
    if (!timestamp) return '-';
    const date = timestamp.seconds
      ? new Date(timestamp.seconds * 1000)
      : new Date(timestamp);
    return date.toLocaleString('zh-TW', {
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  // 通過任務
  const handleApprove = async () => {
    if (feedback.length < 100) {
      alert('回饋至少需要 100 字！');
      return;
    }
    if (!selectedCard) {
      alert('請選擇要給的卡片！');
      return;
    }
    setProcessing(true);
    try {
      await approveTask(id, feedback, selectedCard);
      navigate('/admin/deep');
    } catch (err) {
      console.error('審核失敗', err);
      alert('操作失敗，請再試一次');
    }
    setProcessing(false);
  };

  // 退回任務
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('請填寫退回原因！');
      return;
    }
    setProcessing(true);
    try {
      await rejectTask(id, rejectReason);
      navigate('/admin/deep');
    } catch (err) {
      console.error('退回失敗', err);
      alert('操作失敗，請再試一次');
    }
    setProcessing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="text-center py-20 text-slate-500">找不到這筆資料</div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 返回按鈕 */}
      <button
        onClick={() => navigate('/admin/deep')}
        className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1"
      >
        ← 返回列表
      </button>

      <div className="grid grid-cols-2 gap-6">
        {/* 左半邊：孩子提交的內容 */}
        <div className="space-y-4">
          {/* 基本資訊 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <h2 className="font-black text-slate-900">📋 提交內容</h2>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-slate-400 text-xs">孩子</p>
                <p className="font-semibold text-slate-800">{userName}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">週次</p>
                <p className="font-semibold text-slate-800">Week {record.weekNumber}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">提交時間</p>
                <p className="font-semibold text-slate-800 text-xs">
                  {formatTime(record.taskSubmittedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* 任務文字 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <h3 className="font-bold text-slate-700 text-sm">任務文字</h3>
            <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">
              {record.taskText}
            </p>
          </div>

          {/* 圖片畫廊 */}
          {record.taskImageUrls?.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <h3 className="font-bold text-slate-700 text-sm">
                上傳圖片（{record.taskImageUrls.length} 張）
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {record.taskImageUrls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`圖片 ${idx + 1}`}
                    className="rounded-lg object-cover aspect-square cursor-pointer hover:opacity-90 transition-all border border-slate-200"
                    onClick={() => setLightboxImg(url)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 右半邊：老師審核區 */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <h2 className="font-black text-slate-900">✍️ 老師回饋</h2>

            {/* 回饋 textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">
                  你的回饋
                </label>
                <span className={`text-xs ${feedback.length >= 100 ? 'text-green-600' : 'text-slate-400'}`}>
                  {feedback.length} / 100 字（最少）
                </span>
              </div>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="給孩子的具體回饋，至少 100 字..."
                rows={8}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-slate-400 resize-none leading-relaxed"
              />
            </div>

            {/* 卡片選擇 */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">
                給孩子的卡片
              </label>
              <select
                value={selectedCard}
                onChange={(e) => setSelectedCard(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-slate-400 bg-white"
              >
                {cards.map((card) => (
                  <option key={card.id} value={card.id}>
                    {card.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 通過按鈕 */}
            <button
              onClick={handleApprove}
              disabled={processing || feedback.length < 100}
              className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {processing ? '處理中...' : '✅ 通過並發送'}
            </button>

            {/* 退回區 */}
            {!showReject ? (
              <button
                onClick={() => setShowReject(true)}
                className="w-full border border-red-200 text-red-500 font-medium py-2.5 rounded-xl hover:bg-red-50 transition-all text-sm"
              >
                ❌ 退回重做
              </button>
            ) : (
              <div className="space-y-2 border border-red-200 rounded-xl p-4">
                <label className="text-sm font-semibold text-red-600">
                  退回原因（會顯示給孩子）
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="請說明需要修改的地方..."
                  rows={3}
                  className="w-full border border-red-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleReject}
                    disabled={processing}
                    className="flex-1 bg-red-500 text-white font-bold py-2 rounded-lg hover:bg-red-600 transition-all disabled:opacity-50 text-sm"
                  >
                    確認退回
                  </button>
                  <button
                    onClick={() => setShowReject(false)}
                    className="flex-1 border border-slate-200 text-slate-600 py-2 rounded-lg hover:bg-slate-50 text-sm"
                  >
                    取消
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 圖片放大 Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8"
          onClick={() => setLightboxImg(null)}
        >
          <img
            src={lightboxImg}
            alt="放大圖片"
            className="max-w-full max-h-full rounded-xl object-contain"
          />
          <button
            className="absolute top-4 right-4 text-white text-2xl font-bold"
            onClick={() => setLightboxImg(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}