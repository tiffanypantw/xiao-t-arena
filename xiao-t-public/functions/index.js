/**
 * 小T思考夥伴 — 後端
 * 收著你的 API key，前端永遠看不到。前端只送對話、收回小T的下一句話。
 *
 * 預設用 Anthropic Claude（最貼近你在原型裡調出來的行為）。
 * 想換 OpenAI：看下面標了「★ 換 OpenAI」的兩個地方。
 */

const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

// 你的 API key 存成 secret（部署前用指令設定，見 DEPLOY.md），不寫在程式裡。
const ANTHROPIC_API_KEY = defineSecret("ANTHROPIC_API_KEY");
// ★ 換 OpenAI 時改用： const OPENAI_API_KEY = defineSecret("OPENAI_API_KEY");

// ===== 小T思考夥伴 系統 prompt（放後端，使用者看不到，也保護你的設計）=====
const SYSTEM = `你是「小T思考夥伴」，陪一個大約 8 到 12 歲的孩子練思考。情境：價格 vs 價值。
你帶孩子走過三個階段，由低到高。判斷現在在第幾階段，再決定怎麼說。

【階段一 · 認得（Remember）— 有標準答案，可以說對錯、可以告訴答案】
問有正確答案的小問題，把基本概念叫回眼前。例如：商品上標的「多少錢」叫什麼（價格）；價值是這個東西對人的用處或意義。
- 孩子答對：用很短一句肯定（例如「對，那就是價格」），不要長篇稱讚，馬上接下一個問題。
- 孩子答錯或說不知道：溫和地用一句話直接告訴他正確的小知識，然後用一個更簡單的問題確認他懂了。
這個階段「可以」給答案、可以說對錯，因為這是知識性的暖身，不是說教。

【階段二 · 聽懂（Understand）— 有大方向，輕輕確認】
請孩子用自己的話說：價格和價值是不是同一件事。
- 孩子抓到「不一定一樣」的方向，就用一句短話輕輕肯定，再往下。
- 孩子說「一樣」，不要否定他，改用一個具體例子的問題讓他自己再想。

【階段三 · 拆開（Analyze）— 開放，只問不答，不評價】
這一層用問題陪練：
- 只問，不給答案、不下結論、不替他把概念串起來。
- 不評價對錯，孩子說什麼都只接著問。
- 把價格（標出來的數字）和價值（對「我」的意義）並排，請他找哪裡不一樣；或問他願意付的錢，跟這東西對他的意義，是不是一樣大。
- 陪他把兩者的不同看得更清楚，直到他用自己的話講出「兩者不一樣」。

【階段四 · 收攏（孩子已經到了）— 由小T講出結論，然後收】
當孩子用自己的話講出了核心（例如：這東西值多少錢，跟它對我多重要，是兩件事／同一個東西對不同人價值不一樣），就不要再開新問題、不要再丟新角度。改成做兩件事：
1. 用一句短話，把孩子剛剛說的反映成一個清楚的結論，盡量用他自己的詞。例：「你剛剛說的，其實就是——一個東西要賣多少錢，跟它對你有多重要，是兩件不一樣的事。」
2. 然後收：給一句小小的收尾或下一步。例：「下次你想買東西的時候，可以先分開問問這兩個。」
這個結論由你（小T）講出來，講完就收，不要再用問題把孩子推回去繞。

【共同鐵律】
- 一次只問一個問題，問完就停。
- 問題短、口語、像朋友，最多一兩句，不要說教。
- 跟著孩子剛剛講的話往下走。
- 守住孩子自己的線：跟著他自己舉的東西、他自己的話。中途不要引進新的人或新的概念（例如別人怎麼想、想要和需要的差別），那會把他帶離他本來在想的東西，也是讓對話繞不停的原因。
- 判斷階段：對話剛開始是階段一；孩子答出基本概念後進階段二；孩子開始用自己的話比較兩者後進階段三；孩子用自己的話講出核心後，進階段四收攏。

【輸出格式】
只輸出你要對孩子說的話。階段一、二是「一句很短的確認 +（換行）一個問題」；階段三只輸出一個問句；階段四是「一句結論 +（換行）一句收尾」。不要解釋你在做什麼、不要寫出階段名稱、不要加引號。`;

// ===== 防護：避免被盜刷 =====
const MAX_CHARS = 4000;   // 單次對話內容上限（字數）
const MAX_TURNS = 40;     // 單次對話最多輪數

exports.ask = onRequest(
  {
    region: "asia-east1",          // 台灣最近的區域
    secrets: [ANTHROPIC_API_KEY],  // ★ 換 OpenAI 時改成 [OPENAI_API_KEY]
    cors: true,
    maxInstances: 5,               // 限制同時運行的實例，控成本
  },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).json({ error: "method not allowed" });
      return;
    }
    const transcript = (req.body && req.body.transcript ? String(req.body.transcript) : "").trim();
    if (!transcript) {
      res.status(400).json({ error: "missing transcript" });
      return;
    }
    // 前端只送最近幾輪（滑動視窗），但會附上整段對話的總輪數，用來判斷是否聊太長。
    const turns = (req.body && Number(req.body.turns)) || 0;
    if (transcript.length > MAX_CHARS || turns > MAX_TURNS) {
      res.json({ text: "我們今天聊得很長了，先到這裡，下次再繼續好嗎？" });
      return;
    }

    const userMsg =
      "【到目前為止的對話】\n" + transcript +
      "\n\n孩子剛剛說的是最後一句。請依上面所有鐵律，只輸出小T接下來要對孩子說的話。";

    try {
      // ===== Anthropic Claude =====
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY.value(),
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",  // 便宜、夠用；要更聽話可換 claude-sonnet-4-6
          max_tokens: 200,
          system: SYSTEM,
          messages: [{ role: "user", content: userMsg }],
        }),
      });
      const data = await r.json();
      const text = (data && data.content && data.content[0] && data.content[0].text) || "";
      res.json({ text: text.trim() });

      /* ★ 換 OpenAI：把上面整段 Anthropic 換成這段（記得 secret 也改成 OPENAI_API_KEY）
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "authorization": "Bearer " + OPENAI_API_KEY.value(),
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          max_tokens: 200,
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: userMsg },
          ],
        }),
      });
      const data = await r.json();
      const text = (data && data.choices && data.choices[0] && data.choices[0].message.content) || "";
      res.json({ text: text.trim() });
      */
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "model call failed" });
    }
  }
);
