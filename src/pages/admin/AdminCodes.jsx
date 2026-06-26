import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp, collection, getDocs } from "firebase/firestore";
import { ARENA_BANDS } from "@/data/arenaStructure";

// 不含容易看錯的字（去掉 I O L 0 1）
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const rand = (n) => Array.from({ length: n }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join("");

// themeId → 顯示名稱
const THEME_NAMES = {};
ARENA_BANDS.forEach((b) => b.themes.forEach((t) => { THEME_NAMES[t.id] = `${b.name} · ${t.name}`; }));
const fmtDate = (ts) => (ts && ts.seconds ? new Date(ts.seconds * 1000).toLocaleDateString("zh-TW") : "—");

export default function AdminCodes() {
  // 把所有「需要開通碼」的主題攤平成下拉選單
  const themes = useMemo(() => {
    const out = [];
    ARENA_BANDS.forEach((b) =>
      b.themes.forEach((t) => {
        if (t.gated) out.push({ id: t.id, prefix: t.codePrefix || "TH", label: `${b.name} · ${t.name}` });
      })
    );
    return out;
  }, []);

  const [themeId, setThemeId] = useState(themes[0]?.id || "");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [generated, setGenerated] = useState([]);
  const [msg, setMsg] = useState("");

  const [history, setHistory] = useState([]);
  const [loadingHist, setLoadingHist] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const loadHistory = async () => {
    setLoadingHist(true);
    try {
      const snap = await getDocs(collection(db, "redeemCodes"));
      const rows = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setHistory(rows);
    } catch (e) {
      console.error("load code history failed", e);
    } finally {
      setLoadingHist(false);
    }
  };
  useEffect(() => { loadHistory(); }, []);

  const theme = themes.find((t) => t.id === themeId);

  const generate = async (count) => {
    if (!theme) return;
    setBusy(true);
    setMsg("");
    const made = [];
    try {
      for (let i = 0; i < count; i++) {
        const code = `${theme.prefix}-${rand(5)}`;
        await setDoc(doc(db, "redeemCodes", code), {
          code,
          type: "theme-access",
          themeId: theme.id,
          maxUses: 1,
          uses: 0,
          generatedFor: note.trim(),
          createdAt: serverTimestamp(),
        });
        made.push({ code, themeLabel: theme.label, note: note.trim() });
      }
      setGenerated((g) => [...made, ...g]);
      setNote("");
      loadHistory();
    } catch (e) {
      setMsg("產生失敗：" + (e.message || e));
    } finally {
      setBusy(false);
    }
  };

  const copy = (code) => {
    if (navigator.clipboard) navigator.clipboard.writeText(code);
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-black text-slate-900 mb-1">🔑 開通碼產生器</h1>
      <p className="text-sm text-slate-500 mb-5">
        新學員在 Skool 買了某個主題課程，在這裡產生一組碼貼給他。每組碼用一次就失效。
      </p>

      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">主題課程</label>
          <select
            value={themeId}
            onChange={(e) => setThemeId(e.target.value)}
            className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white"
          >
            {themes.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">學員備註（選填，方便記得發給誰）</label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="例如：王小明 2026.06"
            className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => generate(1)}
            disabled={busy || !theme}
            className="bg-slate-900 text-white text-sm font-bold px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {busy ? "產生中…" : "產生 1 組"}
          </button>
          <button
            onClick={() => generate(5)}
            disabled={busy || !theme}
            className="border border-slate-300 text-slate-700 text-sm font-bold px-4 py-2 rounded-lg disabled:opacity-50"
          >
            產生 5 組
          </button>
        </div>
        {msg && <p className="text-sm text-red-600">{msg}</p>}
      </div>

      {generated.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-bold text-slate-600 mb-2">剛產生的碼（點一下複製）</p>
          <div className="space-y-2">
            {generated.map((g, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 flex items-center justify-between">
                <div className="min-w-0">
                  <button onClick={() => copy(g.code)} className="font-mono font-bold text-slate-900 tracking-wider hover:underline">
                    {g.code}
                  </button>
                  <span className="text-xs text-slate-400 ml-3">{g.themeLabel}{g.note ? ` · ${g.note}` : ""}</span>
                </div>
                <button onClick={() => copy(g.code)} className="text-xs text-slate-500 border border-slate-200 px-2 py-1 rounded shrink-0">複製</button>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3">這些碼已經寫進系統，隨時可以發。重新整理後清單會清空，但碼仍然有效。</p>
        </div>
      )}

      {/* 歷史紀錄 */}
      <div className="mt-9">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-black text-slate-900">📜 開通碼紀錄</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowAll((v) => !v)} className="text-xs text-slate-500 border border-slate-200 px-2 py-1 rounded hover:bg-slate-50">
              {showAll ? "只看主題碼" : "看全部"}
            </button>
            <button onClick={loadHistory} className="text-xs text-slate-500 border border-slate-200 px-2 py-1 rounded hover:bg-slate-50">↻ 重新整理</button>
          </div>
        </div>

        {loadingHist ? (
          <p className="text-sm text-slate-400 py-4">載入中…</p>
        ) : (() => {
          const shown = history.filter((r) => showAll || r.type === "theme-access");
          if (shown.length === 0) return <p className="text-sm text-slate-400 py-4">還沒有紀錄。</p>;
          return (
            <>
              <div className="space-y-1.5">
                {shown.map((r) => {
                  const used = (r.uses || 0) >= (r.maxUses || 1);
                  const what = r.type === "theme-access" ? (THEME_NAMES[r.themeId] || r.themeId || "主題") : (r.type || "—");
                  return (
                    <div key={r.id} className="bg-white border border-slate-200 rounded-lg px-3.5 py-2 flex items-center gap-3 text-sm">
                      <span className="font-mono font-bold text-slate-900 w-28 shrink-0 truncate">{r.code || r.id}</span>
                      <span className="text-xs text-slate-500 flex-1 truncate">
                        {what}{r.generatedFor ? ` · ${r.generatedFor}` : ""}
                      </span>
                      <span className="text-xs text-slate-400 shrink-0 hidden sm:inline">{fmtDate(r.createdAt)}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded shrink-0 ${used ? "bg-slate-100 text-slate-400" : "bg-emerald-50 text-emerald-600"}`}>
                        {used ? "已用" : "未用"}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-slate-400 mt-2">共 {shown.length} 筆{showAll ? "（全部）" : "（主題開通碼）"}</p>
            </>
          );
        })()}
      </div>
    </div>
  );
}
