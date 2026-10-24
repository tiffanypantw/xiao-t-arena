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

## 互動地球升級（2026-10-24）

ExplorerMap 現在延遲載入 MapLibre GL JS 6.15.0（獨立程式與 Worker）；FlatExplorerMap 保留原 SVG 作為手動／載入失敗備援。互動版提供 globe / mercator、縮放 0.5–16、傾斜 0–70 度、台灣定位與立體山地模式；Mapterhorn DEM 高度視覺放大 1.5 倍，並以 hillshade 輔助觀察。數位地圖不是實際測量工具。

自訂樣式 explorer-style.json 取自 OpenFreeMap Liberty，保留原本的版權與來源標示、國界／爭議界線篩選，修改為柔和配色與中文優先地名。底圖資料由 OpenFreeMap/OpenMapTiles/OpenStreetMap 提供；爭議線條依上游資料，不能保證所有爭議皆已完整標示或等同官方立場。地名可能依來源顯示中文或其他語言。縮放後可見更多國家與城市，地圖上只有實際教材有故事地標。

- 地圖接法與樣式來源：https://openfreemap.org/quick_start/
- 地球投影：https://maplibre.org/maplibre-gl-js/docs/examples/display-a-globe-with-a-vector-map/
- 高程來源與授權：https://mapterhorn.com/attribution
- DEM TileJSON：https://tiles.mapterhorn.com/tilejson.json

地圖會向上述服務請求圖磚、字型與高程；未使用定位權限，未傳送學生帳號、收藏或學習紀錄。沒有新增收費金鑰或更動 Firebase。

操作：桌面可拖曳、以按鈕或 Ctrl/⌘＋滾輪縮放；手機使用兩指操作地圖，一指上下滑動頁面。使用 cooperative gestures，避免卡住頁面捲動；亦有按鈕與下方故事卡可供鍵盤操作。減少動畫偏好會取消鏡頭移動動畫。地圖樣式／圖磚未完成載入超過 25 秒或 WebGL 不可用時改用簡易版，仍可閱讀故事。

依賴外部地圖服務與裝置 WebGL，載入速度與細節可能不同；簡易版仍只有陸地輪廓，不能提供詳細國界。

## 每日世界新聞匯入（首版：2026-10-24）

新聞採用 `NEWS-YYYYMMDD-01.json`、`-02.json`、`-03.json`，與 EP001–EP030 的短影音教材分開編號。id 是獨立網址 slug，episode_id 可用 WORLD-20261024-01，edition_label 是畫面顯示名稱。

- editorial_order：當日 1–3 的顯示順序；每日區最多三則。
- report_date、verified_date：報導日期與編輯核對日期。
- period_label：統計期間，例如 2026 年 9 月。
- location_note：定位精度與範圍；城市定位不假裝是整項計畫所在地。
- news_facts：以 label/text 列出新聞小卡；計畫與預期不寫成已完成。
- reading_notes：需要保留的限制與背景提醒。
- visual：conservation / copper / winter-shop，使用原創程式插畫，不是新聞現場照片；無圖時可用一般圖樣。

與其他世界故事相同，resource_path=null 代表沒有兩份完整教材，不會出現假下載或牌卡入口。既有 EP001 不受影響。到下一個台北日期，當日新聞會離開每日三題區，仍保留於地圖與探索館。沒有自動匯入 ChatGPT 排程。

首頁新增國家捷徑；選擇其他地點時，互動地圖會移到該故事所在地。故事頁新增插畫、新聞小卡、日期與閱讀提醒。這次未製作完整遊戲、PDF 或正式概念牌卡。

## 更新為每週一題（2026-10-24）

依 Tiffany 最新指示，改為每週一個完整學習主題。首頁移除每日三題與空白待上架區，只展示最新主題及可逐步累積的「世界學習足跡」。肯亞、阿根廷、英國三篇改為 archived，地圖、清單與直接故事網址均不再開放；保留原始內容以便日後編輯，不是永久刪除。

EP001 颱風為唯一可見主題。learning_date=2026-10-24，顯示為「學習日期：2026 年 10 月 24 日」；使用固定內容日期，不每天改成當天，不代表個別學生的完成紀錄。卡片、故事頁與本集資源頁均可看到日期。將來新主題應另填學習日期，讓大家能回看何時認識了什麼。

先前每日三題與三套教材的製作規劃已由每週一題取代。這次只調整網站與內容狀態，沒有修改 ChatGPT 排程的實際執行設定。
