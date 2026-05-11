import { useState, useEffect } from 'react';
import { getPendingConversations, submitTeacherReply } from '@/api/weeklyProgress';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { MessageCircle, Send, ChevronDown, ChevronRight } from 'lucide-react';

export default function AdminConversations() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [processing, setProcessing] = useState(null);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await getPendingConversations();
      const withNames = await Promise.all(
        data.map(async (record) => {
          try {
            const userSnap = await getDocs(
              query(collection(db, 'users'), where('uid', '==', record.userId))
            );
            const userName = userSnap.empty
              ? record.userId.slice(0, 8)
              : userSnap.docs[0].data().displayName || record.userId.slice(0, 8);
            return { ...record, userName };
          } catch {
            return { ...record, userName: record.userId.slice(0, 8) };
          }
        })
      );
      // 按最新更新時間倒序
      withNames.sort((a, b) => {
        const aTime = a.updatedAt?.seconds || 0;
        const bTime = b.updatedAt?.seconds || 0;
        return bTime - aTime;
      });
      setRecords(withNames);
    } catch (err) {
      console.error('載入失敗', err);
    }
    setLoading(false);
  };

  useEffect(() => { loadRecords(); }, []);

  const handleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      setReplyText('');
    } else {
      setExpandedId(id);
      setReplyText('');
    }
  };

  const handleReply = async (record) => {
    if (replyText.trim().length < 30) {
      alert('回覆至少要 30 字');
      return;
    }
    setProcessing(record.id);
    try {
      await submitTeacherReply(record.id, replyText.trim());
      setReplyText('');
      setExpandedId(null);
      // 重新載入（這筆會從列表消失因為 hasUnreadChildReply 變 false）
      await loadRecords();
    } catch (err) {
      console.error('回覆失敗', err);
      alert(err.message || '送出失敗，請再試一次');
    }
    setProcessing(null);
  };

  const formatDate = (ts) => {
    if (!ts) return '-';
    const date = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
    return date.toLocaleString('zh-TW', {
      month: 'numeric', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

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
          <h1 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            對話進行中
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {records.length > 0
              ? `${records.length} 個孩子等你回覆`
              : '目前沒有等待回覆的對話'}
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
          <p className="text-slate-500 text-sm">沒有等待回覆的對話、可以休息一下。</p>
        </div>
      )}

      {records.length > 0 && (
        <div className="space-y-3">
          {records.map((record) => {
            const isExpanded = expandedId === record.id;
            const conversation = record.conversation || [];
            const lastChildMessage = [...conversation].reverse().find(m => m.role === 'child');

            return (
              <div
                key={record.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden"
              >
                {/* 標題列 */}
                <button
                  onClick={() => handleExpand(record.id)}
                  className="w-full px-5 py-4 hover:bg-slate-50 transition-all flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                    <span className="font-bold text-slate-900">{record.userName}</span>
                    <span className="bg-violet-100 text-violet-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      W{record.weekNumber}
                    </span>
                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      💬 等待回覆
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {formatDate(record.updatedAt)}
                  </div>
                </button>

                {/* 預覽最新孩子訊息（未展開時） */}
                {!isExpanded && lastChildMessage && (
                  <div className="px-5 pb-3 -mt-1">
                    <p className="text-sm text-slate-600 italic line-clamp-2">
                      💬「{lastChildMessage.content}」
                    </p>
                  </div>
                )}

                {/* 展開的完整對話 */}
                {isExpanded && (
                  <div className="border-t border-slate-100 p-5 space-y-4 bg-slate-50/50">
                    {/* 任務內容（小參考） */}
                    {record.taskText && (
                      <details className="bg-white rounded-lg border border-slate-200">
                        <summary className="px-3 py-2 text-xs font-semibold text-slate-600 cursor-pointer">
                          📋 查看孩子的原始任務內容
                        </summary>
                        <div className="px-3 pb-3 pt-1">
                          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                            {record.taskText}
                          </p>
                        </div>
                      </details>
                    )}

                    {/* 對話 thread */}
                    <div className="space-y-3">
                      {conversation.map((msg, idx) => {
                        const isTeacher = msg.role === 'teacher';
                        return (
                          <div
                            key={idx}
                            className={`rounded-lg p-3 ${
                              isTeacher
                                ? 'bg-violet-50 border border-violet-100'
                                : 'bg-amber-50 border border-amber-100 ml-6'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold">
                                {isTeacher ? '👩‍🏫 你' : `💬 ${record.userName}`}
                              </span>
                              <span className="text-xs text-slate-400">
                                {formatDate(msg.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                              {msg.content}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* 回覆框 */}
                    <div className="bg-white border-2 border-violet-200 rounded-xl p-3 space-y-2">
                      <p className="text-xs font-semibold text-violet-700">✍️ 你的回覆</p>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="繼續引導孩子的思考。可以再問一個問題、或回應他的想法..."
                        rows={4}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-400 resize-none leading-relaxed"
                      />
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${replyText.trim().length >= 30 ? 'text-green-600' : 'text-slate-400'}`}>
                          {replyText.trim().length} / 30 字
                        </span>
                        <button
                          onClick={() => handleReply(record)}
                          disabled={replyText.trim().length < 30 || processing === record.id}
                          className="bg-violet-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                        >
                          {processing === record.id ? '送出中...' : (<><Send className="w-3.5 h-3.5" />送出回覆</>)}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}