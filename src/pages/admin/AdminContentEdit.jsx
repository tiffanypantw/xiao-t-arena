/**
 * AdminContentEdit — 編輯 / 新增單一 week 的 metadata
 *
 * Quiz 題目編輯 (quizQuestions) **暫不在此表單裡**，是 M2.5 的範圍。
 * 這個表單只處理 week 的標題、問題、章節、開放題、任務、影片、徽章 / 卡片連結、發佈狀態。
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useWeek, useRewards } from "@/lib/hooks/useContent";
import { useUpsertWeek, checkWeekExists } from "@/lib/hooks/useAdminContent";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";

const EMPTY_WEEK = {
  title: "",
  quarter: 1,
  chapter: "",
  question: "",
  hasQuiz: true,
  hasOpenQuestion: false,
  hasTask: true,
  videoUrl: "",
  videoCaption: "",
  openQuestion: "",
  openQuestionMinChars: 30,
  taskTitle: "本週任務",
  taskDescription: "",
  taskMinChars: 50,
  badgeId: "",
  cardId: "",
  published: false,
  quizQuestions: [],
};

export default function AdminContentEdit() {
  const { weekNumber } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isNew = searchParams.get("new") === "1";

  const { data: existingWeek, isLoading: weekLoading } = useWeek(
    isNew ? null : Number(weekNumber)
  );
  const { data: rewards = {}, isLoading: rewardsLoading } = useRewards();
  const upsertMutation = useUpsertWeek();

  const [form, setForm] = useState(EMPTY_WEEK);
  const [validationError, setValidationError] = useState(null);
  const [saveMsg, setSaveMsg] = useState(null);

  // 載入既有資料到表單
  // 重要：Firestore 的 null/undefined 欄位要被替換成 EMPTY_WEEK 的預設值，
  // 否則 React controlled input 會丟「value should not be null」warning + .trim() 噴 TypeError
  useEffect(() => {
    if (existingWeek && !isNew) {
      const sanitized = {};
      for (const key of Object.keys(EMPTY_WEEK)) {
        const val = existingWeek[key];
        sanitized[key] = val === null || val === undefined ? EMPTY_WEEK[key] : val;
      }
      setForm(sanitized);
    } else if (isNew) {
      setForm({
        ...EMPTY_WEEK,
        title: `Week ${weekNumber}`,
      });
    }
  }, [existingWeek, isNew, weekNumber]);

  const set = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setValidationError(null);
    setSaveMsg(null);

    // 基本驗證
    if (!form.title.trim()) return setValidationError("標題不能空白");
    if (!form.question.trim()) return setValidationError("大問題不能空白");
    if (form.hasOpenQuestion && !form.openQuestion.trim()) {
      return setValidationError("已勾選「有開放題」，但開放題內容空白");
    }

    // 新增時檢查 weekNumber 不重複
    if (isNew) {
      const exists = await checkWeekExists(weekNumber);
      if (exists) {
        return setValidationError(
          `Week ${weekNumber} 已存在，請從列表頁編輯它，或選不同 weekNumber`
        );
      }
    }

    try {
      // helper：安全 trim（萬一是 null/undefined 不要噴）
      const safeTrim = (v) => (v == null ? "" : String(v).trim());

      // 把 string 數字轉成 number；空字串轉 null
      const payload = {
        ...form,
        quarter: Number(form.quarter) || 1,
        openQuestionMinChars: Number(form.openQuestionMinChars) || 30,
        taskMinChars: Number(form.taskMinChars) || 50,
        videoUrl: safeTrim(form.videoUrl) || null,
        videoCaption: safeTrim(form.videoCaption) || null,
        openQuestion: form.hasOpenQuestion
          ? safeTrim(form.openQuestion) || null
          : null,
        badgeId: safeTrim(form.badgeId) || null,
        cardId: safeTrim(form.cardId) || null,
        chapter: safeTrim(form.chapter),
      };

      await upsertMutation.mutateAsync({
        weekNumber: Number(weekNumber),
        data: payload,
        isNew,
      });

      setSaveMsg(`✓ 已儲存 Week ${weekNumber}`);
      // 新增完跳回列表
      if (isNew) {
        setTimeout(() => navigate("/admin/content"), 600);
      }
    } catch (err) {
      console.error(err);
      setValidationError(`儲存失敗：${err.message || err}`);
    }
  };

  if (!isNew && weekLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isNew && !weekLoading && !existingWeek) {
    return (
      <div className="text-center py-20 text-slate-500">
        找不到 Week {weekNumber}
      </div>
    );
  }

  // 把 rewards 拆成 badge 跟 card 給 dropdown 用
  const badgeOptions = Object.values(rewards).filter((r) => r.type === "badge");
  const cardOptions = Object.values(rewards).filter((r) => r.type === "card");

  return (
    <div className="space-y-4 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/content")}
          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-lg font-black text-slate-900">
            {isNew ? `新增 Week ${weekNumber}` : `編輯 Week ${weekNumber}`}
          </h1>
          <p className="text-xs text-slate-500">
            Quiz 題目編輯在另一個介面（M2.5 之後）
          </p>
        </div>
      </div>

      {/* Section: 基本資訊 */}
      <Section title="📌 基本資訊">
        <Row>
          <Field label="標題 (顯示在卡片上)" required>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className="form-input"
              placeholder="Week 1"
            />
          </Field>
          <Field label="Quarter">
            <input
              type="number"
              value={form.quarter}
              onChange={(e) => set("quarter", e.target.value)}
              className="form-input"
              min={1}
            />
          </Field>
          <Field label="Chapter 標籤">
            <input
              value={form.chapter}
              onChange={(e) => set("chapter", e.target.value)}
              className="form-input"
              placeholder="Ch.1"
            />
          </Field>
        </Row>
        <Field label="大問題（學員 Home 卡片上顯示的 hero）" required>
          <textarea
            value={form.question}
            onChange={(e) => set("question", e.target.value)}
            className="form-input"
            rows={2}
            placeholder="例：如果世界沒有錢，真的會更公平嗎？"
          />
        </Field>
      </Section>

      {/* Section: 影片 */}
      <Section title="🎥 影片（選填）">
        <Field label="YouTube / Vimeo URL">
          <input
            value={form.videoUrl}
            onChange={(e) => set("videoUrl", e.target.value)}
            className="form-input"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </Field>
        <Field label="影片下方說明（選填）">
          <input
            value={form.videoCaption}
            onChange={(e) => set("videoCaption", e.target.value)}
            className="form-input"
            placeholder="這支影片講..."
          />
        </Field>
        <p className="text-xs text-slate-500">
          學員看到影片需要：(1) brand 的 enableVideo feature 開啟 (2) 這個欄位有填 URL
        </p>
      </Section>

      {/* Section: 開放題 */}
      <Section title="✍️ 開放題（選填）">
        <Field label="是否有開放題">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.hasOpenQuestion}
              onChange={(e) => set("hasOpenQuestion", e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">勾選 = 學員需先寫開放題、老師審核後才拿徽章</span>
          </label>
        </Field>
        {form.hasOpenQuestion && (
          <>
            <Field label="開放題題目" required>
              <textarea
                value={form.openQuestion}
                onChange={(e) => set("openQuestion", e.target.value)}
                className="form-input"
                rows={3}
                placeholder="例：回想一次你最近的消費，它是「需要」還是「想要」？為什麼？"
              />
            </Field>
            <Field label="最少字數">
              <input
                type="number"
                value={form.openQuestionMinChars}
                onChange={(e) => set("openQuestionMinChars", e.target.value)}
                className="form-input w-24"
                min={1}
              />
            </Field>
          </>
        )}
      </Section>

      {/* Section: 任務 */}
      <Section title="🎯 任務">
        <Row>
          <Field label="任務標題">
            <input
              value={form.taskTitle}
              onChange={(e) => set("taskTitle", e.target.value)}
              className="form-input"
            />
          </Field>
          <Field label="任務回應最少字數">
            <input
              type="number"
              value={form.taskMinChars}
              onChange={(e) => set("taskMinChars", e.target.value)}
              className="form-input w-24"
              min={1}
            />
          </Field>
        </Row>
        <Field label="任務說明（會顯示給學員、支援換行）">
          <textarea
            value={form.taskDescription}
            onChange={(e) => set("taskDescription", e.target.value)}
            className="form-input"
            rows={6}
            placeholder="🎯 拍下 3 個你觀察到的..."
          />
        </Field>
      </Section>

      {/* Section: 獎勵連結 */}
      <Section title="🏅 獎勵連結">
        <Row>
          <Field label="徽章 (badgeId)">
            <select
              value={form.badgeId}
              onChange={(e) => set("badgeId", e.target.value)}
              className="form-input"
            >
              <option value="">— 不發徽章 —</option>
              {badgeOptions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.id})
                </option>
              ))}
            </select>
          </Field>
          <Field label="卡片 (cardId)">
            <select
              value={form.cardId}
              onChange={(e) => set("cardId", e.target.value)}
              className="form-input"
            >
              <option value="">— 不發卡片 —</option>
              {cardOptions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.id})
                </option>
              ))}
            </select>
          </Field>
        </Row>
        <p className="text-xs text-slate-500">
          學員拿到的順序：徽章 = 練習題 / 開放題審核完；卡片 = 任務審核完。
          {rewardsLoading && " (rewards 載入中...)"}
        </p>
      </Section>

      {/* Section: 發佈狀態 */}
      <Section title="🚀 發佈設定">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => set("published", e.target.checked)}
            className="w-5 h-5"
          />
          <span className="text-sm font-semibold flex items-center gap-2">
            {form.published ? (
              <>
                <Eye className="w-4 h-4 text-green-600" />
                已發佈（學員 Home 看得到，受 brand.latestAvailableWeek 限制）
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 text-slate-400" />
                草稿（學員看不到）
              </>
            )}
          </span>
        </label>
      </Section>

      {/* Error + save msg */}
      {validationError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          ❌ {validationError}
        </div>
      )}
      {saveMsg && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
          {saveMsg}
        </div>
      )}

      {/* Save button (sticky bottom) */}
      <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 -mx-6 flex items-center justify-end gap-3">
        <button
          onClick={() => navigate("/admin/content")}
          className="text-sm text-slate-600 hover:text-slate-900 px-4 py-2"
        >
          取消
        </button>
        <button
          onClick={handleSave}
          disabled={upsertMutation.isPending}
          className="bg-slate-900 text-white font-bold rounded-xl px-6 py-2.5 hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {upsertMutation.isPending ? "儲存中..." : "儲存"}
        </button>
      </div>

      <style>{`
        .form-input {
          width: 100%;
          border: 1px solid rgb(226 232 240);
          border-radius: 0.75rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          background: white;
        }
        .form-input:focus {
          outline: none;
          border-color: rgb(100 116 139);
        }
      `}</style>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
      <h2 className="font-bold text-slate-900 text-sm">{title}</h2>
      {children}
    </div>
  );
}

function Row({ children }) {
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-3">{children}</div>;
}

function Field({ label, required, children }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
