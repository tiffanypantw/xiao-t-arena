/**
 * export-season1.mjs
 * 一次性匯出「第一季 W1–W12」的學員作品，給季末回饋用。
 * 用「服務帳戶金鑰」讀取（不需要密碼、和你用 Google 登入無關）。
 *
 * ── 你只要做 3 件事（詳細步驟看 Claude 給的指引）──
 *   1. 從 Firebase 後台下載一把「服務帳戶金鑰」JSON，丟進這個資料夾
 *   2. 在這個資料夾打開終端機，安裝一次工具：  npm install firebase-admin
 *   3. 執行：  node export-season1.mjs
 *
 * 跑完會產生 season1-export.json，把它交回給 Claude 就能生成每個孩子的回饋。
 * （這個腳本只「讀取」資料，不會改動任何東西。）
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const SEASON_WEEKS = Array.from({ length: 12 }, (_, i) => i + 1); // W1..W12

// ── 自動找出資料夾裡的服務帳戶金鑰（內容含 "type": "service_account" 的 .json）──
function findServiceAccount() {
  const jsons = readdirSync(".").filter((f) => f.endsWith(".json"));
  for (const f of jsons) {
    try {
      const data = JSON.parse(readFileSync(f, "utf8"));
      if (data.type === "service_account" && data.project_id) {
        return { file: f, data };
      }
    } catch {
      /* 不是 JSON 或讀不到，略過 */
    }
  }
  return null;
}

// ── Firestore Timestamp / 物件 → 好讀的 ISO 字串 ──
function clean(val) {
  if (val == null) return val;
  if (typeof val.toDate === "function") return val.toDate().toISOString();
  if (typeof val === "object" && typeof val.seconds === "number" && "nanoseconds" in val) {
    return new Date(val.seconds * 1000).toISOString();
  }
  if (Array.isArray(val)) return val.map(clean);
  if (typeof val === "object") {
    const out = {};
    for (const [k, v] of Object.entries(val)) out[k] = clean(v);
    return out;
  }
  return val;
}

async function main() {
  const sa = findServiceAccount();
  if (!sa) {
    console.error("\n❌ 在這個資料夾找不到服務帳戶金鑰 JSON。");
    console.error("   請先到 Firebase 後台下載金鑰，並把那個 .json 檔放進這個資料夾，再執行一次。\n");
    process.exit(1);
  }
  console.log(`🔑 使用金鑰：${sa.file}（專案 ${sa.data.project_id}）`);

  initializeApp({ credential: cert(sa.data) });
  const db = getFirestore();

  console.log("讀取資料中…");

  // users
  const usersSnap = await db.collection("users").get();
  const users = {};
  usersSnap.forEach((d) => { users[d.id] = clean({ uid: d.id, ...d.data() }); });

  // weeklyProgress（全部，再過濾 W1–W12）
  const progSnap = await db.collection("weeklyProgress").get();
  const progressByUser = {};
  progSnap.forEach((d) => {
    const p = clean({ id: d.id, ...d.data() });
    if (!SEASON_WEEKS.includes(Number(p.weekNumber))) return;
    (progressByUser[p.userId] ||= []).push(p);
  });

  // 合併成「每個孩子一筆」
  const children = Object.values(users)
    .map((u) => {
      const weeks = (progressByUser[u.uid] || []).sort((a, b) => a.weekNumber - b.weekNumber);
      return {
        uid: u.uid,
        displayName: u.displayName || "(未設定名字)",
        email: u.email || null,
        createdAt: u.createdAt || null,
        badgesAndCardsEarned: Object.keys(u.collection || {}),
        weeksWithActivity: weeks.map((w) => w.weekNumber),
        summary: {
          quizzesCompleted: weeks.filter((w) => w.quizCompleted).length,
          openAnswersSubmitted: weeks.filter((w) => w.openAnswerContent).length,
          tasksSubmitted: weeks.filter((w) => w.taskText).length,
          badgesEarned: weeks.filter((w) => w.badgeEarned).length,
          cardsEarned: weeks.filter((w) => w.cardEarned).length,
        },
        weeks: weeks.map((w) => ({
          weekNumber: w.weekNumber,
          quizCompleted: !!w.quizCompleted,
          openAnswerContent: w.openAnswerContent || null,
          taskText: w.taskText || null,
          taskImageCount: (w.taskImageUrls || []).length,
          badgeEarned: !!w.badgeEarned,
          cardEarned: !!w.cardEarned,
          conversation: (w.conversation || []).map((c) => ({ role: c.role, content: c.content })),
        })),
      };
    })
    .sort((a, b) => b.summary.tasksSubmitted - a.summary.tasksSubmitted);

  const out = {
    exportedAt: new Date().toISOString(),
    season: "Season 1 (W1–W12)",
    childCount: children.length,
    children,
  };

  writeFileSync("season1-export.json", JSON.stringify(out, null, 2), "utf8");
  console.log(`\n✅ 完成！共 ${children.length} 位孩子，已寫入 season1-export.json`);
  console.log("把這個檔交回給 Claude 就能生成每位孩子的回饋。\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌ 出錯了：", err?.message || err, "\n");
  process.exit(1);
});
