# 每集免費學習資源

## 入口

- `/resources`：每集資源列表。
- `/resources/ep001`：EP001 固定分享網址，可填入 ManyChat。
- `/resources/ep001/exploration-sheet`：獨立探索單閱讀、下載及列印入口。
- `/card-island/ep001/supply`：獨立「供給 Supply」翻牌入口。

以上都是原 React/Vite 網站的公開路由，不掛載學生登入、品牌或資料寫入 provider。Vercel 既有 rewrite 與部署方式保留。Preview 仍有 Vercel 平台保護；真正免登入的對外活動，需先驗收後發布至正式網域。本輪不切換正式站。

## EP001

主題：颱風來了，青菜為什麼變貴？
留言關鍵字：颱風

探索單：一頁蔬菜供需探索圖片，檔案為 null，pending。
牌卡：供給 Supply，正式圖片、定義、例子均待匯入。只提供明確標示的翻牌版型示意，並非已完成教材。

本集 status=preview，release_date=null；兩個正式教材入口都顯示準備中，不提供假下載連結、不宣稱已公開。先前機會成本只是 EP001 的功能測試內容；舊 `/card-island/ep001/opportunity-cost` 會導向本集資源頁，避免舊分享網址直接失效。課程、護照、遊戲及既有獎勵牌卡未更動。

## 每日新增

1. 新增 `src/data/learning-resources/EP002.json`，複製 EP001 格式並修改主題、留言關鍵字、探索單資料和牌卡 ID。
2. 新增 `src/data/financial-cards/EP002.json`，填正式牌卡文字、唯一 ID/slug，以及正背面路徑。無需新增任何 React 元件或路由。
3. 探索單放在 `public/learning-resources/ep002/sheet.png`（亦可 jpg/jpeg/webp/pdf）；卡圖放在原本的 `public/financial-cards/ep002/front.webp`、`back.webp`。
4. 探索單 `format` 為 image 或 pdf，與副檔名一致；素材未到位時維持 asset=null、format=null、status=pending。
5. 正式卡片需填完定義與例子、兩張真實圖片，將卡片 status 設為 published，填 release_date。含「待匯入／尚未提供」的占位文字會阻止發布。
6. 兩項資源備妥後，探索單與 concept_card 的 status 都改成 ready。最後才將「集數資源」status 改為 published 並填日期。不要只因網址可開啟就當成正式公開。
7. `npm run validate:cards` 會同時校驗兩個資料夾、卡片引用、格式、日期與素材檔是否存在。既有 build 已自動包含這一步。推送目前改版分支，確認 Preview 後再安排正式發布。

本工作目錄採 sparse checkout，匯入時可先執行：
`git sparse-checkout add '/public/financial-cards/' '/public/learning-resources/'`

## 公開條件

公開標記需同時滿足：本集 status=published、發布日已到（Asia/Taipei）、探索單 ready 且有有效檔案/格式、數位牌卡 ready 且已發布並含兩面圖片和正式內容。資源發布日不能早於所引用牌卡的發布日。

即使手動把本集改為 published，只要其中任一項仍 pending，建置就會失敗。未到發布日不會列入公開頁；draft/archived 不可由直接網址開啟。preview 是明確的準備中展示，不是保密資料儲存區。

## 開啟、儲存、列印

探索單與牌卡保持兩個獨立入口，不合併檔案。圖片探索單提供原圖、同源下載與獨立 A4 列印版面；PDF 提供內嵌預覽及原檔，列印交由瀏覽器 PDF 檢視器。手機若忽略 download 屬性，可開啟原圖/PDF 使用瀏覽器儲存或分享選單。尚未取得正式探索單，無法驗收它的內容、解析度或實際印刷品質。

## 統計

沿用 analytics.js 的停用 adapter，沒有新增 SDK、訪客 ID、cookie、事件收集端或真實數據。

- enter_resource_page：進入每集資源頁。
- open_exploration_sheet：真正進入有素材的探索單頁，直接連結亦計入；準備中按鈕不計。
- open_concept_card：進入牌卡頁，包含直接連結；版型預覽不代表正式教材已發布。
- flip_card：每次翻牌，附 face。

僅預留 episode_id、card_id、resource_type/face 白名單，不傳送 ManyChat 聯絡人、姓名、帳號、自由文字或答案。沒有收集端時所有事件均為 no-op。未來啟用需更新前台說明並區分測試與正式內容。

本功能沒有連接或修改 ManyChat flow，僅提供可填入它的固定網址與留言關鍵字資料。

## EP001 素材匯入更新（2026-10-24）

已匯入使用者提供的 1024×1536 探索單原圖，以及 1536×1024 牌卡合圖。EP001 現為兩項 ready / published，取代前述待匯入狀態；僅部署 Preview，正式站未發布。

合圖左面「供給衝擊 Supply Shock」，右面解釋「供給 Supply」。資料標題沿用正面，定義與例子照背面文字匯入；保留既有 /card-island/ep001/supply 連結。背面的開放思考題保留在原圖，不捏造標準答案。

image_layout=duo 時，前後面皆指向同一張原始合圖，以 CSS 視窗分別呈現左右面，原始 PNG 沒有改寫；翻牌及圖鑑以 3:4 原圖比例呈現。獨立正背面圖片仍用預設 single 模式。品牌與版權放在牌卡下方，不遮住原稿文字。正式實體印刷前仍需確認此稿尺寸、出血與版權標示。
