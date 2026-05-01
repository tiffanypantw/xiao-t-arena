import { useState, useEffect } from 'react';
import { getPendingBadges, approveOpenAnswer } from '@/api/weeklyProgress';
import { ENCOURAGEMENT_MESSAGES } from '@/lib/admin-config';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function AdminQuick() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState({});

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await getPendingBadges();
      const withNames = await Promise.all(
        data.map(async (record) => {
          try {
            const userSnap = await getDocs(
              query(collection(db, 'users'), where('uid', '==', record.userId))
            );
            const userData = userSnap.empty ? null : userSnap.docs[0].data();
            const userName = userData?.displayName || record.userId.slice(0, 8);
            const userEmail = userData?.email || '';
            return { ...record, userName, userEmail };
          } catch {
            return { ...record, userName: record.userId.slice(0, 8) };
          }
        })
      );
      // 按提交時間排序
      withNames.sort((a, b) => {
        const aTime = (a.openAnswerSubmittedAt?.seconds || a.quizCompletedAt?.seconds || 0);
        const bTime = (b.openAnswerSubmittedAt?.seconds || b.quizCompletedAt?.seconds || 0);
        return aTime - bTime;
      });
      setRecords(withNames);
    } catch (err) {
      console.error('載入失敗', err);
    }
    setLoading(false);
  };

  useEffect(() => { loadRecords(); }, []);

  useEffect(() => {
    const defaults = {};
    records.forEach((r) => {
      if (!selectedMessages[r.id]) {
        defaults[r.id] = ENCOURAGEMENT_MESSAGES[0];
      }
    });
    setSelectedMessages((prev) => ({ ...defaults, ...prev }));
  }, [records]);

  const handleApprove = async (record) => {
    const message = selectedMessages[record.id] || ENCOURAGEMENT_MESSAGES[0];
    setProcessing(record.id);
    try {
      await approveOpenAnswer(record.id, message);
      setRecords((prev) => prev.filter((r) => r.id !== record.id));
    } catch (err) {
      console.error('審核失敗', err);
      alert('操作失敗，請再試一次');
    }
    setProcessing(null);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '-';
    const date = timestamp.seconds
      ? new Date(timestamp.seconds * 1000)
      : new Date(timestamp);
    return date.toLocaleString('zh-TW', {
      month: 'numeric', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  // 判斷是 Week 1-4 還是 Week 5+
  const isEarlyWeek = (record) => record.weekNumber <= 4;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-slate-900">⚡ 練習題審核 / 開放題審核</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {records.length > 0
              ? `${records.length} 筆待發放徽章`
              : '目前沒有待審核的記錄'}
          </p>
        </div>
        <button
          onClick={loadRecords}
          className="text-sm border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all"
        >
          重新整理
        </button>
      </div>

      {records.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <div className="text-3xl mb-2">✨</div>
          <p className="text-slate-500 text-sm">全部都審核完了！</p>
        </div>
      )}

      {records.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 font-semibold text-slate-600 w-28">孩子</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 w-16">週次</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 w-24">類型</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">內容</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 w-28">時間</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 w-48">鼓勵語</th>
                <th className="px-4 py-3 w-36"></th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, idx) => (
                <tr
                  key={record.id}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                    idx % 2 === 0 ? '' : 'bg-slate-50/50'
                  }`}
                >
                  {/* 孩子名字 + email */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{record.userName}</div>
                    {record.userEmail && (
                      <div className="text-xs text-slate-400 mt-0.5">{record.userEmail}</div>
                    )}
                  </td>

                  {/* 週次 */}
                  <td className="px-4 py-3">
                    <span className="bg-violet-100 text-violet-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      W{record.weekNumber}
                    </span>
                  </td>

                  {/* 類型 */}
                  <td className="px-4 py-3">
                    {isEarlyWeek(record) ? (
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        練習題全對
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        開放題提交
                      </span>
                    )}
                  </td>

                  {/* 內容 */}
                  <td className="px-4 py-3 text-slate-700 leading-relaxed">
                    <div className="max-w-md">
                      {isEarlyWeek(record)
                        ? `練習題於 ${formatTime(record.quizCompletedAt)} 全部答對 ✓`
                        : (
                          <>
                            {record.openAnswerContent?.slice(0, 100)}
                            {record.openAnswerContent?.length > 100 && (
                              <span className="text-slate-400">...</span>
                            )}
                          </>
                        )
                      }
                    </div>
                  </td>

                  {/* 時間 */}
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {isEarlyWeek(record)
                      ? formatTime(record.quizCompletedAt)
                      : formatTime(record.openAnswerSubmittedAt)
                    }
                  </td>

                  {/* 鼓勵語選單 */}
                  <td className="px-4 py-3">
                    <select
                      value={selectedMessages[record.id] || ENCOURAGEMENT_MESSAGES[0]}
                      onChange={(e) =>
                        setSelectedMessages((prev) => ({
                          ...prev,
                          [record.id]: e.target.value,
                        }))
                      }
                      className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-violet-400"
                    >
                      {ENCOURAGEMENT_MESSAGES.map((msg) => (
                        <option key={msg} value={msg}>{msg}</option>
                      ))}
                    </select>
                  </td>

                  {/* 審核按鈕 */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleApprove(record)}
                      disabled={processing === record.id}
                      className="w-full bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      {processing === record.id ? '處理中...' : '我看見你了 ✨'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}