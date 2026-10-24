# 財商牌卡島｜整合與內容匯入

## 路由與邊界

- `/islands`：免登入的主群島入口，沿用 WorldMap。其他學習入口仍受原權限保護。
- `/card-island`：正式公開牌卡圖鑑，以及明確分開的測試展區。
- `/card-island/:episodeId/:slug`：共用牌卡頁。例如 `/card-island/ep001/opportunity-cost`。
- 原有 `/`、課程、後台、學習護照與獎勵機制均保留。已登入首頁的地圖與清單新增第八座「財商牌卡島」。

App.jsx 只管理路由，公開頁不掛載 AuthProvider 或 BrandProvider；原應用移至 ArenaApplication.jsx，透過 lazy import 載入，因此牌卡訪客不需登入、也不會觸發使用者文件建立或遷移。Vercel 既有 SPA rewrites 保留，可直接開啟/重整深層網址。這仍是同一個 React/Vite 網站，沒有新獨立 HTML 應用。

## 元件

- CardIslandLayout：頁首、主群島返回與透明的統計/收藏說明。
- CardFlip：共用正反面與 CSS 3D 翻牌；原生 button 支援觸控、Enter/空白鍵，隱藏面 aria-hidden/inert；減少動畫偏好時直接切面。
- CardChallenge：單選決策挑戰與解析；不收集名字或文字答案。
- useCardCollection：本機收藏與完成 ID。key=`mtt-financial-card-island:v1`，與 Firebase、課程獎勵及 Passport 完全分開，不跨裝置同步。瀏覽器不允許儲存時提示僅保留本頁狀態。
- 卡面缺圖或載入失敗均顯示 placeholder；另有 HTML 大字閱讀版，圖片文字不必成為閱讀唯一途徑。

## EP001 的狀態

未收到正式 EP001 主題或圖片，本次以「機會成本 / Opportunity Cost」作功能測試範例。status=demo，release_date=null，front_image/back_image=null；正式公開數為 0。它不是宣稱已上架的短影音或正式卡面。正式內容到位後替換同一份 JSON，即可沿用網址與互動。

本次以 70 × 120 mm（7:12）作實體塔羅比例工作假設。保留中文/英文、獨立正背面、編號、品牌與完整版權字樣。這不是已核准的印刷尺寸或完稿，正式印製仍需確認出血、安全框、字級與印刷規格。正背面圖片應使用相同比例，圖檔內須包含正式品牌、編號、版權與背面文字。建議 1400×2400 px WebP/PNG 數位圖；保留另行製作的高解析印刷原檔。

## 匯入 EP002–EP030

1. 在 `src/data/financial-cards/` 新增 `EP002.json`（以 EP001 欄位為模板）。系統用 Vite glob 自動載入，無須新增 React 元件或路由。
2. 設定唯一 episode_id、card_id、slug。更改已分享的 slug 會使舊連結失效，發布後應固定識別碼與網址。
3. 將兩張圖片放入 `public/financial-cards/ep002/front.webp` 與 `back.webp`；JSON 用 `/financial-cards/ep002/front.webp` 等網站絕對路徑，不使用本機檔案路徑。
4. 新稿先 `status: "draft"`，日期可為 null；需公開測試才用 `demo`。demo 永遠不計入正式公開數，也不冒充影片已發布。
5. 圖片與內容確認後，填 `release_date: "YYYY-MM-DD"` 與 `status: "published"`。日期以 Asia/Taipei 判斷，未到日期不顯示。`scheduled` 是編輯待發布狀態，不會自行變 published；正式啟用需更新 status 並部署。沒有建立排程服務。
6. 執行 `node scripts/validate-financial-cards.mjs`、`node --test tests/financial-cards.test.mjs` 與原本 `npm run build:tiffany`，推送現有改版分支，先看 Vercel Preview。
7. 每集 IG/Facebook 留言回覆連結使用同一個網站的 `/card-island/ep002/your-slug`。分享按鈕複製目前網站 origin + canonical path，不帶追蹤 query。

目前此 Git worktree 採 sparse checkout；新增圖檔前可用 `git sparse-checkout add '/public/financial-cards/'` 展開新素材目錄。不要覆寫既有 public/images/ 獎勵卡圖。

資料格式亦提供 `src/data/financial-cards/card.schema.json`；既有 build 指令新增牌卡校驗前置步驟，不新增套件或改變 Vite/Vercel 部署方式。

必要欄位：episode_id、card_id、slug、category、card_type、title_zh、title_en、definition_zh、example_zh、challenge、front_image、back_image、release_date、status。challenge 可為 null；有挑戰時含 prompt、options（id/text）、correct_option_id、explanation。正式與排程稿的校驗要求兩張圖片實際存在；demo 可明確使用 null placeholder。

## 狀態不是存取控制

前端只顯示已到期的 published 與明確的 demo。draft/scheduled/archived 與未到期內容不能由 UI 或直接卡牌路由開啟。但目前是靜態打包，JSON 內容可能存在 JS 產物中：請勿將保密內容放進此資料夾。真正的未公開內容隔離應由未來 CMS/伺服器只輸出公開資料完成。

## 30 天測試與隱私

預留 `enter_card`、`flip_card`、`start_challenge`、`complete_challenge`、`explore_cards`。analytics.js 預設 disabled/no-op，沒有任何收集端、SDK、訪客 ID、cookie、背景請求或真實統計儀表板。完成挑戰只記本機 card_id，不上傳答案。

未來明確接上 setCardAnalyticsAdapter 後，事件白名單只放 event/episode_id/card_id/face，主動丟棄其他欄位。接入時仍須定義伺服器日誌最小化、保存期與前台說明；無匿名訪客 ID 的事件只能計次，不能宣稱獨立人數或個人留存率。平台本身的 Vercel 存取日誌依原設定運作，本輪未修改。

上傳卡圖底端應預留約 8% 給共用編號、品牌與版權覆蓋層；即使提供圖片，數位卡面仍保留這些識別。正式實體完稿應自行包含同樣標示。

目前分享網址為 SPA 深連結，未製作每張卡的伺服器端 Open Graph 預覽圖；IG/Facebook 抓取器可能顯示通用網站預覽。Vercel Preview 的平台存取保護仍保留，免登入指不需學生帳號；正式對外導流需經驗收發布到正式網域，不能把受保護 Preview 當作公開活動網址。
