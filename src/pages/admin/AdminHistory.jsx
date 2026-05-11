import { useState, useEffect, useMemo } from 'react';
import { getAllReviewHistory } from '@/api/weeklyProgress';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { BookOpen, MessageCircle, Filter, X } from 'lucide-react';

export default function AdminHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  // 篩選
  const [filterChild, setFilterChild] = useState('all');
  const [filterWeek, setFilterWeek] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await getAllReviewHistory();
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
      setRecords(withNames);
    } catch (err) {
      console.error('載入失敗', err);
    }
    setLoading(false);
  };

  useEffect(() => { loadRecords(); }, []);

  // 篩選後的紀錄
  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (filterChild !== 'all' && r.userName !== filterChild) return false;
      if (filterWeek !== 'all' && r.weekNumber !== parseInt(filterWeek)) return false;
      if (filterStatus === 'has-conversation' && (r.conversation?.length || 0) < 2) return false;
      if (filterStatus === 'waiting-reply' && !r.hasUnreadChildReply) return false;
      return true;
    });
  }, [records, filterChild, filterWeek, filterStatus]);

  // 提取唯一孩子列表（用於篩選下拉）
  const uniqueChildren = useMemo(() => {
    return [...new Set(records.map((r) => r.userName))].sort();
  }, [records]);

  // 提取唯一週次列表
  const uniqueWeeks = useMemo(() => {
    return [...new Set(records.map((r) => r.weekNumber))].sort((a, b) => a - b);
  }, [records]);

  const formatDate = (ts) => {
    if (!ts) return '-';
    const date = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
    return date.toLocaleString('zh-TW', {
      month: 'numeric', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const clearFilters = () => {
    setFilterChild('all');
    setFilterWeek('all');
    setFilterStatus('all');
  };

  const hasActiveFilter = filterChild !== 'all' || filterWeek !== 'all' || filterStatus !== 'all';

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
            <BookOpen className="w-5 h-5" />
            審核歷史
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {filtered.length} 筆 / 共 {records.length} 筆審核紀錄
          </p>
        </div>
        <button
          onClick={loadRecords}
          className="text-sm border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all"
        >
          重新整理
        </button>
      </div>

      {/* 篩選列 */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Filter className="w-4 h-4" />
            篩選：
          </div>

          {/* 孩子 */}
          <select
            value={filterChild}
            onChange={(e) => setFilterChild(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-violet-400"
          >
            <option value="all">所有孩子</option>
            {uniqueChildren.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>

          {/* 週次 */}
          <select
            value={filterWeek}
            onChange={(e) => setFilterWeek(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-violet-400"
          >
            <option value="all">所有週次</option>
            {uniqueWeeks.map((w) => (
              <option key={w} value={w}>Week {w}</option>
            ))}
          </select>

          {/* 狀態 */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-violet-400"
          >
            <option value="all">所有狀態</option>
            <option value="has-conversation">有對話互動</option>
            <option value="waiting-reply">等待我回覆</option>
          </select>

          {hasActiveFilter && (
            <button
              onClick={clearFilters}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              清除篩選
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <div className="text-3xl mb-2">📭</div>
          <p className="text-slate-500 text-sm">
            {records.length === 0
              ? '還沒有審核紀錄。'
              : '沒有符合篩選條件的紀錄。'}
          </p>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((record) => {
            const isExpanded = expandedId === record.id;
            const conversation = record.conversation || [];
            const teacherCount = conversation.filter(m => m.role === 'teacher').length;
            const childCount = conversation.filter(m => m.role === 'child').length;

            return (
              <div
                key={record.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : record.id)}
                  className="w-full px-5 py-4 hover:bg-slate-50 transition-all flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-slate-900">{record.userName}</span>
                    <span className="bg-violet-100 text-violet-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      W{record.weekNumber}
                    </span>
                    {conversation.length > 0 && (
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {teacherCount + childCount} 則
                      </span>
                    )}
                    {record.hasUnreadChildReply && (
                      <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        ⏳ 等你回覆
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">
                    審核於 {formatDate(record.taskApprovedAt)}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-100 p-5 space-y-4 bg-slate-50/50">
                    {/* 任務內容 */}
                    {record.taskText && (
                      <div className="bg-white rounded-lg border border-slate-200 p-3 space-y-1">
                        <p className="text-xs font-semibold text-slate-600">📋 孩子的任務內容</p>
                        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                          {record.taskText}
                        </p>
                      </div>
                    )}

                    {/* 對話 thread */}
                    {conversation.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-600">💬 對話紀錄</p>
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
                    )}

                    {/* 開放題回應（W5+） */}
                    {record.openAnswerContent && (
                      <div className="bg-white rounded-lg border border-slate-200 p-3 space-y-1">
                        <p className="text-xs font-semibold text-slate-600">✍️ 開放題回答（W5）</p>
                        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                          {record.openAnswerContent}
                        </p>
                        {record.encouragementMessage && (
                          <p className="text-xs text-violet-600 italic mt-1">
                            你的鼓勵語：「{record.encouragementMessage}」
                          </p>
                        )}
                      </div>
                    )}
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