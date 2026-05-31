# TIMECOIN 兌換碼上架步驟

第二場直播限量卡片：**2026-05 月度直播 BTC NFT 體驗卡**
兌換碼：**TIMECOIN**（上限 15 人）

---

## Step 1：把圖檔 push 上 Vercel（30 秒）

已經幫你 commit 了，現在只差 push。打開終端機（Terminal），複製貼上：

```
cd ~/Desktop/xiao-t-arena && git push origin main
```

Vercel 會自動偵測到，大約 1-2 分鐘後 deploy 完成。

**驗證圖檔到了 prod：** 打開這個網址，應該看到卡片圖：
```
https://xiao-t-arena.vercel.app/images/2026-05_月度直播_BTC_NFT體驗卡.png
```

---

## Step 2：到 Firebase Console 加「卡片」這筆資料

打開 → [Firebase Console - xiao-t-arena - Firestore](https://console.firebase.google.com/project/xiao-t-arena/firestore/data)

1. 點左邊 collection 列表的 **`rewards`**（如果展開了應該看到很多 `badge-...` `card-...`）
2. 上方點 **「+ 新增文件」**（Add document）
3. **文件 ID** 貼：`card-btc-nft-experience`
4. 把下面這 9 個欄位**一個一個**加進去（每加一個按右下角「+ 新增欄位」）：

| 欄位 (Field) | 類型 (Type) | 值 (Value) |
|---|---|---|
| `rewardId` | string | `card-btc-nft-experience` |
| `type` | string | `card` |
| `name` | string | `BTC NFT 體驗卡` |
| `description` | string | `2026 年 5 月直播限定。和小T一起親手體驗 BTC 與 NFT！` |
| `weekLabel` | string | `直播限定` |
| `chapter` | string | `Special` |
| `earnedFromWeek` | null | （選 null） |
| `earnedVia` | string | `redeem-code-only` |
| `image` | string | `/images/2026-05_月度直播_BTC_NFT體驗卡.png` |

5. 按右下角 **「儲存」**（Save）

> **想改卡片名字或描述？** 直接改上面 `name` / `description` 那兩格的值就好，其他不用動。

---

## Step 3：到 Firebase Console 加「兌換碼」這筆資料

還在 Firestore 頁面：

1. 回到 collection 列表，點 **`redeemCodes`**
2. 上方點 **「+ 新增文件」**
3. **文件 ID** 貼：`TIMECOIN` ← **一定要全部大寫**
4. 加這 6 個欄位：

| 欄位 (Field) | 類型 (Type) | 值 (Value) |
|---|---|---|
| `code` | string | `TIMECOIN` |
| `rewardId` | string | `card-btc-nft-experience` |
| `type` | string | `card` |
| `maxUses` | **int64** | `15` |
| `uses` | **int64** | `0` |
| `generatedFor` | string | `2026 年 5 月月度直播` |

5. 按 **「儲存」**

---

## Step 4：驗證

1. 打開 [xiao-t-arena.vercel.app](https://xiao-t-arena.vercel.app/)
2. 用任何一個學員帳號登入（或開另一個 Chrome window 用測試帳號）
3. 點底部「集藏冊」（Passport）
4. 找到「輸入兌換碼」按鈕，點下去
5. 輸入 `TIMECOIN` → 確認兌換
6. 應該看到 🎉 成功訊息，集藏冊裡會多一張 BTC NFT 體驗卡

驗證完成後，這個碼就可以發給直播 15 位學員了。

---

## 之後想看誰用過這個碼？

回到 Firebase Console → `redeemCodes` → 點 `TIMECOIN` 這筆 → 看 **`uses`** 欄位的數字，每被兌換一次會 +1，達到 15 之後再有人輸入會跳「已達使用上限」。

想知道**是哪些學員用的**，到 `users` collection 用瀏覽器 Ctrl+F 找 `"codeUsed": "TIMECOIN"`，或在 console 直接 query：

```
collection: users
where: collection.card-btc-nft-experience.codeUsed == "TIMECOIN"
```
