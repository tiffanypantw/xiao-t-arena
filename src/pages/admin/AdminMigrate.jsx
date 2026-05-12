/**
 * AdminMigrate — 內容遷移控制台
 *
 * 根據當前 BRAND（env 變數）顯示對應的 seed 按鈕：
 *   - VITE_BRAND=tiffany → "Seed Tiffany 完整內容"（W1-W6 + 所有 reward + code）
 *   - VITE_BRAND=ngfa    → "Seed NGFA placeholder"（minimum preview seed）
 *
 * Seed 是 merge:true，重跑安全。學員資料 (users / weeklyProgress) 不會被動到。
 */

import { useState } from "react";
import { BRAND } from "@/lib/firebase";
import { seedTiffany, seedNgfa, seedMigrationData } from "@/lib/migrations/seed";

export default function AdminMigrate() {
  const [running, setRunning] = useState(null); // 'content' | 'pii' | null
  const [log, setLog] = useState([]);
  const [doneType, setDoneType] = useState(null); // 'content' | 'pii' | null
  const [error, setError] = useState(null);

  const isTiffany = BRAND === "tiffany";
  const isNgfa = BRAND === "ngfa";

  const appendLog = (msg) =>
    setLog((prev) => [...prev, { time: new Date(), msg }]);

  const runJob = async (jobType, fn) => {
    setRunning(jobType);
    setLog([]);
    setDoneType(null);
    setError(null);
    try {
      const stats = await fn(appendLog);
      appendLog(`Final stats: ${JSON.stringify(stats)}`);
      setDoneType(jobType);
    } catch (e) {
      console.error("Migration failed:", e);
      setError(e.message || String(e));
      appendLog(`❌ Error: ${e.message || e}`);
    } finally {
      setRunning(null);
    }
  };

  const handleContentSeed = () =>
    runJob("content", isTiffany ? seedTiffany : seedNgfa);
  const handlePiiSeed = () => runJob("pii", seedMigrationData);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-black text-slate-900">
          🚀 內容遷移（M1.6 一次性工具）
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          把 hardcoded 內容寫進 Firestore，符合 SCHEMA.md 設計。merge:true、重跑安全。
        </p>
      </div>

      {/* Brand 識別卡 */}
      <div
        className={`rounded-xl border-2 p-4 ${
          isTiffany
            ? "border-violet-300 bg-violet-50"
            : isNgfa
            ? "border-blue-300 bg-blue-50"
            : "border-red-300 bg-red-50"
        }`}
      >
        <div className="text-xs font-semibold text-slate-600 mb-1">
          當前 BRAND
        </div>
        <div className="text-xl font-black text-slate-900">
          {isTiffany && "🇹🇼 Tiffany 兒財（中文）"}
          {isNgfa && "🌎 NGFA（英文）"}
          {!isTiffany && !isNgfa && `❓ Unknown: ${BRAND}`}
        </div>
        <div className="text-xs text-slate-500 mt-2">
          {isTiffany &&
            "點下面按鈕會把 W1-W6 + 所有 REWARDS + REDEEM_CODES + ENCOURAGEMENT_MESSAGES 寫進 Firestore。"}
          {isNgfa &&
            "點下面按鈕會把 NGFA placeholder（brandSettings + 1 個 Week 1 + 2 個 reward）寫進 Firestore。實際內容請之後從 admin UI 編輯。"}
        </div>
      </div>

      {/* 內容 seed 按鈕 */}
      <button
        onClick={handleContentSeed}
        disabled={running !== null || doneType === "content"}
        className={`w-full font-black text-base rounded-xl py-4 transition-all ${
          doneType === "content"
            ? "bg-green-100 text-green-700 cursor-not-allowed"
            : running === "content"
            ? "bg-slate-200 text-slate-500 cursor-wait"
            : "bg-slate-900 text-white hover:opacity-90"
        }`}
      >
        {doneType === "content"
          ? "✅ 內容已 seed — 去 Firestore Console 檢查"
          : running === "content"
          ? "⏳ 寫入中... 請勿關閉視窗"
          : isTiffany
          ? "🇹🇼 Seed Tiffany 完整內容"
          : isNgfa
          ? "🌎 Seed NGFA Placeholder"
          : "❓ Brand 不對，請檢查 .env"}
      </button>

      {/* PII 搬家按鈕（只在 Tiffany brand 顯示——NGFA 沒有 base44 歷史） */}
      {isTiffany && (
        <div className="space-y-2">
          <div className="border-t border-slate-200 pt-4">
            <p className="text-xs font-semibold text-slate-600 mb-2">
              🔒 PII 搬家：MIGRATION_DATA (30+ 個學員 email) → Firestore
            </p>
          </div>
          <button
            onClick={handlePiiSeed}
            disabled={running !== null || doneType === "pii"}
            className={`w-full font-black text-base rounded-xl py-4 transition-all ${
              doneType === "pii"
                ? "bg-green-100 text-green-700 cursor-not-allowed"
                : running === "pii"
                ? "bg-slate-200 text-slate-500 cursor-wait"
                : "bg-amber-600 text-white hover:opacity-90"
            }`}
          >
            {doneType === "pii"
              ? "✅ PII 已搬到 Firestore"
              : running === "pii"
              ? "⏳ 寫入中..."
              : "🔒 搬 MIGRATION_DATA 進 Firestore"}
          </button>
        </div>
      )}

      {/* Log 區 */}
      {log.length > 0 && (
        <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs space-y-1 max-h-96 overflow-y-auto">
          {log.map((entry, idx) => (
            <div key={idx} className="leading-relaxed">
              <span className="text-slate-500">
                [{entry.time.toLocaleTimeString()}]
              </span>{" "}
              <span>{entry.msg}</span>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          ❌ {error}
        </div>
      )}

      {/* 提示 */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-2">
        <p className="font-semibold">📌 重要提示</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            這個工具是<strong>一次性</strong>用的（M1 完成後，這個 page + seed
            code 會被刪除）
          </li>
          <li>
            使用 <code className="bg-slate-200 px-1 rounded">merge: true</code>
            ，所以可以重跑，不會破壞既有資料
          </li>
          <li>
            學員資料 (
            <code className="bg-slate-200 px-1 rounded">users</code> /{" "}
            <code className="bg-slate-200 px-1 rounded">weeklyProgress</code>)
            <strong>完全不會動到</strong>
          </li>
          <li>
            <code className="bg-slate-200 px-1 rounded">redeemCodes</code>
            重跑時保留現有 <code className="bg-slate-200 px-1 rounded">uses</code>
            計數
          </li>
        </ul>
      </div>
    </div>
  );
}
