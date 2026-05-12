/**
 * AdminContent — 內容管理列表頁
 *
 * 列出 Firestore 裡所有 weeks（含未發佈），讓老師可以選擇編輯或新增。
 */

import { Link, useNavigate } from "react-router-dom";
import { useWeeks } from "@/lib/hooks/useContent";
import { Plus, Eye, EyeOff, Award, CreditCard, Edit3 } from "lucide-react";

export default function AdminContent() {
  const navigate = useNavigate();
  const { data: weeks = [], isLoading } = useWeeks();

  const nextWeekNumber =
    weeks.length > 0 ? Math.max(...weeks.map((w) => w.weekNumber)) + 1 : 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-slate-900">📝 內容管理</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {weeks.length} 個 week 已建立 · 下一個 weekNumber：{nextWeekNumber}
          </p>
        </div>
        <button
          onClick={() => navigate(`/admin/content/${nextWeekNumber}?new=1`)}
          className="bg-slate-900 text-white text-sm font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          新增 Week {nextWeekNumber}
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && weeks.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <div className="text-3xl mb-2">📭</div>
          <p className="text-slate-500 text-sm">目前沒有任何 week，按右上「新增」開始</p>
        </div>
      )}

      {!isLoading && weeks.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 font-semibold text-slate-600 w-20">#</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 w-24">Quarter</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 w-20">Chapter</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">標題 / 大問題</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 w-32">三關設定</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 w-32">獎勵連結</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 w-24">狀態</th>
                <th className="px-4 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, idx) => (
                <tr
                  key={week.weekNumber}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                    idx % 2 === 0 ? "" : "bg-slate-50/50"
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-slate-900 font-semibold">
                    W{week.weekNumber}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    Q{week.quarter ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {week.chapter || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{week.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {week.question}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <span
                        title={`${week.quizQuestions?.length || 0} 題練習題`}
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          week.hasQuiz && week.quizQuestions?.length > 0
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        Quiz {week.quizQuestions?.length || 0}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          week.hasOpenQuestion
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        Open
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          week.hasTask
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        Task
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {week.badgeId ? (
                        <span
                          title={week.badgeId}
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 flex items-center gap-1"
                        >
                          <Award className="w-2.5 h-2.5" /> 徽章
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">無徽章</span>
                      )}
                      {week.cardId ? (
                        <span
                          title={week.cardId}
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-700 flex items-center gap-1"
                        >
                          <CreditCard className="w-2.5 h-2.5" /> 卡片
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">無卡片</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {week.published ? (
                      <span className="text-xs font-bold text-green-700 flex items-center gap-1">
                        <Eye className="w-3 h-3" /> 已發佈
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> 草稿
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/admin/content/${week.weekNumber}`}
                      className="text-xs font-bold text-slate-900 hover:underline flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      編輯
                    </Link>
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
