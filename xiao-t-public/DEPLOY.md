# 小T思考夥伴 — 部署到 public

這個資料夾就是一個可以直接 `firebase deploy` 的完整專案。
網頁放 Firebase Hosting，一個小 Cloud Function 收著你的 API key 去呼叫模型，
**key 永遠不會出現在前端**，使用者也吃不到你的 Claude/Cowork 額度。

```
xiao-t-public/
├─ public/index.html     ← 給使用者的網頁
├─ functions/index.js    ← 後端，藏 key + 你的 prompt
├─ functions/package.json
├─ firebase.json         ← Hosting + /api/ask 導到 function
├─ .firebaserc           ← 填你的 project id
└─ DEPLOY.md
```

---

## 一次性準備

1. 裝工具（已裝過可跳過）
   ```
   npm install -g firebase-tools
   firebase login
   ```

2. 用哪個 Firebase 專案？建議**開一個新專案**給這個工具，不要跟 xiao-t-arena 正式環境混在一起。
   到 https://console.firebase.google.com 建一個，拿到 project id 後填進 `.firebaserc`
   （把 `你的-firebase-project-id` 換掉）。

3. Cloud Functions 需要 Blaze（用多少付多少）方案。到 Firebase Console → 左下角升級成 Blaze。
   （平常沒人用就幾乎是 0 元；真正的花費是下面的模型 API。）

4. 拿一把模型 API key
   - Claude（預設）：https://console.anthropic.com → API Keys
   - 或 OpenAI：https://platform.openai.com → API keys（要改 `functions/index.js`，見最下面）

---

## 設定 key（存成 secret，不寫進程式）

在 `xiao-t-public/` 資料夾裡執行：

```
firebase functions:secrets:set ANTHROPIC_API_KEY
```

它會問你 key 的值，貼上去 enter。這把 key 只有後端讀得到。

---

## 裝後端套件

```
cd functions
npm install
cd ..
```

---

## 部署

```
firebase deploy
```

跑完它會給你一個網址，長得像：
```
https://你的-project-id.web.app
```
那就是公開連結，手機打開就能用。

之後只要改了 `public/` 或 `functions/`，再跑一次 `firebase deploy` 就更新。
（只改網頁可以用 `firebase deploy --only hosting` 比較快。）

---

## ⚠️ 花錢前先看這段（重要）

這是公開連結，任何人都打得開，每一句小T的回話都會花你的模型 API 錢。
已經內建的基本防護：單次對話有字數與輪數上限、`maxInstances: 5` 限制同時運行量。

**正式對外分享前，強烈建議再加一層：**
- 在 Anthropic / OpenAI 後台設**每月用量上限（spending limit）**，這是最穩的剎車。
- 量大或要放很久，再考慮加 Firebase App Check（擋掉機器人盜刷），這個要另外設定 reCAPTCHA，需要時我再給你步驟。

先小範圍（自己、幾個家長）測試、看一天花多少，再決定要不要加 App Check。

---

## 想換成 OpenAI

打開 `functions/index.js`，照裡面標了「★ 換 OpenAI」的三個地方改：
1. `defineSecret` 換成 `OPENAI_API_KEY`
2. `secrets: [...]` 換成 `[OPENAI_API_KEY]`
3. 把 Anthropic 那段 fetch 換成下面註解起來的 OpenAI 版

然後重設 secret：`firebase functions:secrets:set OPENAI_API_KEY`，再 `firebase deploy`。

---

## 想換模型／調便宜

`functions/index.js` 裡的 `model` 那行：
- 便宜夠用：`claude-haiku-4-5-20251001`（預設）
- 更聽話、貴一點：`claude-sonnet-4-6`

如果之後覺得 Haiku 的「只問不答」沒守得像原型那麼穩，先升 Sonnet 試試。
