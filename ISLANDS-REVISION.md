# 小 T 群島介面 Beta

本次改版保留 Firebase 登入、Firestore/Storage、題庫、原有課程 ID、進度與獎勵寫入機制，以及既有 Vercel rewrite 設定。

## 本機使用

沿用 Terminal：

```sh
npm ci
npm run dev:tiffany
```

- 一般入口 `/`：依原本登入流程進入新版群島。
- `/classic`：登入後可回到原版首頁。
- `/islands-preview.html`：僅開發伺服器提供的獨立設計預覽，不匯入 Firebase，不讀寫學生資料。
- 不要將示範預覽當成真實登入/儲存驗證。正式 build 預設只輸出 index.html，不包含獨立預覽入口。

此工作目錄不複製 .env 或服務帳戶檔。本機若需自訂環境，請沿用你現有的安全設定；勿把憑證加入 Git。Vercel 部署沿用同一專案原本的環境變數。

## Vercel 預覽與正式切換

1. 將 `codex/islands-beta` 推送至既有 Git remote，確認 Vercel 對此分支建立 **Preview**。若既有 Production Branch 被設為此分支，先修正再推送。
2. 沿用原本的 Tiffany 環境變數、Firebase projectId/authDomain/storageBucket。Preview 若未配置同一組公開 Firebase 設定，不代表應改掉正式設定。
3. 不更換正式網域、不新增 Firebase 專案、不執行資料遷移、不部署 firestore.rules。
4. 以測試帳號驗收登入、開通權限、答題、老師回饋、收藏、任務圖片與記帳。預覽網域與正式網域的登入 session 分開；Google 登入可能需要事先核准該精確 Preview domain，不應為了方便擴大成任意網域。
5. 驗收過關後，才將已驗證的版本切到原本正式專案與原網域。保留前一個可用部署，必要時用 Vercel Instant Rollback 回復。

Vercel CLI 若已安裝並連到原專案，可用 `vercel` 建立 Preview；不要使用 `--prod` 進行初次驗收。尚未連結時，確認選取原專案，避免另建 production 指向。

## 正式切換前必驗

- 老帳號仍可登入，UID 與舊進度一致；重新整理、登出重登後仍讀得到。
- 未開通課程、未發布週次、前一關尚未獲徽章的狀態保持鎖定。
- 答題提交、開放題、老師核可與領取獎勵分開驗證，不能把「已提交」當「已核可」。
- 五罐子修改後等候原有儲存完成，再跨頁並重整確認；原實作有 800ms debounce，本輪未改動它。不可宣稱立即離頁一定能保存。
- 任務圖片上傳仍到原 Storage bucket，未新增公開權限。
- 同原網域發布有助保留 Firebase 的既有登入持久化；部署本身不能保證正在編輯、尚未儲存的表單狀態。

## 回復

- 學生介面立即退路：`/classic`。資料機制與舊版相同。
- 發布回復：將 Vercel 指回前一個驗證過的 deployment，不需要資料庫倒回。
- 此分支沒有執行資料寫入或 migration；保留現有備份與稽核流程。

## 已知界線

3D 立體感由原創幾何的 SVG 投影提供，含水平旋轉/縮放/日夜。不是自由建造遊戲，也沒有新增虛擬貨幣或獎勵。

NGFA 品牌保留原首頁、分齡與道路介面。共有資料功能沒有修改。

原專案 lint 設定引用 eslint-plugin-react，但 package.json 未列該套件；標準 lint 在乾淨安裝下會失敗。本次保留依賴設定，未把該既存問題混入介面改版。

## 此工作目錄的特殊說明

本次建立的是 `codex/islands-beta` 的獨立 Git worktree；原桌面目錄仍在 `main`。因原儲存庫大型素材的版本物件讀取失敗，此工作目錄採 sparse checkout，只展開程式與設定，`public/` 與其他素材仍保留在 Git 版本樹中，沒有刪除或加入刪除提交。推送分支後，Vercel 正常完整 checkout 仍會取得那些既有素材。

本機完整素材驗收需先能取得 `public/`；不要把這個精簡工作目錄直接當作完整素材 zip 上傳。可透過既有 Git repo 建立 Vercel Preview，或在本機使用既有 public 素材目錄。正式登入與資料寫入測試尚未執行。
