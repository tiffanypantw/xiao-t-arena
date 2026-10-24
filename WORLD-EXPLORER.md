# 小 T 世界探索首頁

## 入口與既有內容

- `/`、`/world`：公開世界地圖、每日三題、故事搜尋、學習基地與免費資源入口。
- `/world/ep001`：台灣 EP001 故事，背景、供給概念、學科與不同角色的處境。
- `/Home`：原本的個人學習首頁，沿用登入、權限與進度查詢。
- `/islands`：原本八座島的公開導航，仍可使用。
- `/resources/ep001`、`/card-island/ep001/supply` 及舊分享連結保留。

新的公開首頁不掛載 AuthProvider、BrandProvider 或學生資料 provider；個人路由繼續交給原 ArenaApplication。沒有修改 Firebase 設定、規則或資料結構，也沒有新增學習紀錄寫入。

## 新增故事

在 `src/data/world/` 加入 EP002.json 等檔案，即可自動載入；共用頁面不需另做。可參考 EP001：

- id：唯一的小寫網址 slug。
- episode_id：教材編號。
- status：draft / published / archived。
- content_type：evergreen（一般主題教材）或 news（真實新聞）。
- published_date：上架日期；以台北日期判定可見性。
- event_date：新聞事件發生日；evergreen 可為 null。
- country、region、latitude、longitude：地點與地圖定位。
- title、summary、background：故事內容。
- concepts：中英文詞彙、定義、在事件中的應用。
- subjects、perspectives、curiosity：學科、不同角色與好奇心入口。
- sources：來源名稱、URL 與類型；新聞必須有事件日期與 HTTPS 外部來源。建置可驗證格式，但編輯者仍須查證來源真實性及內容。
- image：本地探索圖片路徑，無圖可填 null，會使用一般視覺底圖；不要抓取未授權新聞照片。
- resource_path：已有對應資源頁時填 /resources/ep002，沒有則填 null。新聞故事不必等三套完整教材做完才能上架；兩份資源備妥後才顯示資源入口。

每日區僅顯示當日上架的 news，最多三題；過往內容保留於地圖及故事探索館。EP001 是 evergreen，並非當日新聞，不能充當今日三題。

`npm run validate:world` 校驗格式、來源欄位、座標、本地圖片與教材引用；build 同時執行牌卡與故事校驗。發布前另行確認事實、日期、權利與適齡性。draft 是編輯狀態，不應放機密資料；前端程式碼不是保密儲存區。

## 地圖與操作

底圖取自 Natural Earth 公有領域 1:110m 陸地資料：
https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson
授權：https://www.naturalearthdata.com/about/terms-of-use/

以等距經緯度投影生成 land.json，SVG 呈現地形厚度；不是完整 WebGL 3D 或可旋轉地球。沒有國界，地標為教學位置。支援地標按鈕、鍵盤、縮放與放大後水平捲動；手機另提供故事卡，不必靠地圖完成導航。減少動畫偏好會停止雲朵移動。

## 尚未串接

ChatGPT「圈粉選題雷達」不會自動將內容送到網站。現階段需編輯、查證與匯入 JSON，再部署；沒有新增排程、Discord 或匿名統計收集端。網站不要求孩子提交立場、輸入個資或完成評分。
