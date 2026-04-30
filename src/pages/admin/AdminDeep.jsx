import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingTasks } from '@/api/weeklyProgress';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function AdminDeep() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeWeek, setActiveWeek] = useState('all');

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await getPendingTasks();
      // 撈用戶名字
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
      // 按提交時間排序
      withNames.sort((a, b) => {
        const aTime = a.taskSubmittedAt?.seconds || 0;
        const bTime = b.taskSubmittedAt?.seconds || 0;
        return aTime - bTime;
      });
      setRecords(withNames);
    } catch (err) {
      console.error('載入失敗', err);
    }
    setLoading(false);
  };

  useEffect(() => { loadRecords(); }, []);

  // 格式化時間
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

  // 取得所有週次
  const weeks = ['all', ...new Set(records.map((r) => r.weekNumber))].sort();

  // 過濾顯示的資料
  const filtered = activeWeek === 'all'
    ? records
    : records.filter((r) => r.weekNumber === activeWeek);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 標題列 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-slate-900">📋 任務深度審核</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {records.length > 0
              ? `${records.length} 筆待審核`
              : '目前沒有待審核的任務'}
          </p>
        </div>
        <button
          onClick={loadRecords}
          className="text-sm border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all"
        >
          重新整理
        </button>
      </div>

      {/* 週次篩選頁籤 */}
      {records.length > 0 && (
        <div className="flex items-center gap-2">
          {weeks.map((week) => (
            <button
              key={week}
              onClick={() => setActiveWeek(week)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeWeek === week
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {week === 'all' ? '全部' : `Week ${week}`}
            </button>
          ))}
        </div>
      )}

      {/* 空狀態 */}
      {filtered.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <div className="text-3xl mb-2">✨</div>
          <p className="text-slate-500 text-sm">
            {records.length === 0 ? '全部都審核完了！' : '這週沒有待審核的任務'}
          </p>
        </div>
      )}

      {/* 表格 */}
      {filtered.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 font-semibold text-slate-600 w-28">孩子</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 w-16">週次</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">任務內容</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 w-16">圖片</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 w-28">提交時間</th>
                <th className="px-4 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record, idx) => (
                <tr
                  key={record.id}
                  className={`border-b border-slate-100 hover:bg-blue-50 transition-colors cursor-pointer ${
                    idx % 2 === 0 ? '' : 'bg-slate-50/50'
                  }`}
                  onClick={() => navigate(`/admin/deep/${record.id}`)}
                >
                  {/* 孩子名字 */}
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {record.userName}
                  </td>

                  {/* 週次 */}
                  <td className="px-4 py-3">
                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      W{record.weekNumber}
                    </span>
                  </td>

                  {/* 任務內容前 50 字 */}
                  <td className="px-4 py-3 text-slate-700">
                    <div className="max-w-md">
                      {record.taskText?.slice(0, 50)}
                      {record.taskText?.length > 50 && (
                        <span className="text-slate-400">...</span>
                      )}
                    </div>
                  </td>

                  {/* 圖片數量 */}
                  <td className="px-4 py-3 text-slate-500">
                    {record.taskImageUrls?.length > 0
                      ? `🖼 ${record.taskImageUrls.length}`
                      : '-'}
                  </td>

                  {/* 提交時間 */}
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {formatTime(record.taskSubmittedAt)}
                  </td>

                  {/* 查看按鈕 */}
                  <td className="px-4 py-3">
                    <span className="text-xs text-blue-600 font-medium">
                      查看詳細 →
                    </span>
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