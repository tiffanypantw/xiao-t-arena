const pair = (en, zh) => ({ en, "zh-TW": zh });
export const categories = [
  ["money", "Money & Decisions"],
  ["business", "Business & Entrepreneurship"],
  ["investing", "Investing & Ownership"],
  ["economics", "Economics & The Real World"],
];
export const concepts = [
  {
    conceptId: "BUS-001",
    category: "business",
    concept: pair("Revenue vs. Profit", "營收與利潤"),
    missions: { en: "001" },
    videos: { en: null, "zh-TW": null },
    resources: {},
    paidProducts: [],
  },
  {
    conceptId: "ECON-001",
    category: "economics",
    concept: pair("Supply", "供給"),
    missions: { en: "002", "zh-TW": "vegetable-market" },
    videos: { en: null, "zh-TW": "https://youtu.be/-bwAsQ4TwPQ" },
    resources: { "zh-TW": "/resources/ep001" },
    paidProducts: [],
  },
];
export const missions = [
  {
    id: "001",
    conceptId: "BUS-001",
    category: "business",
    status: { en: "published" },
    title: pair("Where Did the Money Go?", "錢到哪裡去了？"),
    description: pair(
      "A snack stall sells $200. Follow the costs to discover what it actually earned.",
      "小攤賣出 200 元，扣掉成本後賺了多少？",
    ),
    takeaway: pair(
      "Revenue is money earned from sales. Profit is revenue minus all relevant costs for the same period. In this simplified story, $200 − $120 = $80, assuming no additional costs. Profit is different from cash in the bank: payment timing can vary.",
      "營收是銷售所得；利潤是同一期間的營收扣除相關成本。本例假設沒有其他成本，200 − 120 = 80。利潤與銀行現金也可能因收付款時間而不同。",
    ),
    steps: [
      {
        type: "mystery",
        title: pair("“We made $200!”", "「我們賣了 200 元！」"),
        body: pair(
          "Alex and Sam close their snack stall after a busy afternoon. Alex celebrates $200 in sales. Sam points out that the snacks did not make themselves. These are all the costs in this simplified mission; real businesses may also have wages, taxes and other costs.",
          "Alex 和 Sam 收攤了。Alex 開心地說賣了 200 元，Sam 提醒點心也有成本。以下是本例全部成本；真實生意還可能有薪資、稅等費用。",
        ),
        ledger: [
          ["Sales / Revenue", 200],
          ["Ingredients", 65],
          ["Supplies", 25],
          ["Stall rental", 30],
        ],
        question: pair(
          "How much profit did the stall earn after these costs?",
          "扣掉以上成本後，利潤是多少？",
        ),
        options: [
          ["200", "That is revenue, before subtracting costs."],
          [
            "120",
            "That is the total cost: $65 + $25 + $30. Subtract it from sales.",
          ],
          ["80", "Exactly. Costs total $120, so $200 − $120 = $80 profit."],
          [
            "110",
            "That leaves out the $30 stall rental. Every listed cost counts.",
          ],
        ].map(([id, f]) => ({
          id,
          label: pair("$" + id, id + " 元"),
          feedback: pair(f, f),
        })),
        correct: "80",
      },
      {
        type: "predict",
        title: pair("One more twist", "再想一步"),
        body: pair(
          "Revenue $200 − Costs $120 = Profit $80. In real businesses, include every relevant cost for the same period. Now imagine stall rental rises by $10 while sales and all other costs stay the same.",
          "營收 200 − 成本 120 = 利潤 80。真實生意須計入同一期間的相關成本。假設租金再增加 10 元，營收與其他成本不變。",
        ),
        question: pair("What happens to profit?", "利潤會如何變化？"),
        options: [
          {
            id: "70",
            label: pair("It falls to $70", "降到 70 元"),
            feedback: pair(
              "Yes. Costs rise to $130, so profit becomes $200 − $130 = $70.",
              "成本增加為 130 元，利潤變成 200 − 130 = 70 元。",
            ),
          },
          {
            id: "80",
            label: pair("It stays at $80", "維持 80 元"),
            feedback: pair(
              "Sales stay the same, but costs increase. $200 − $130 leaves $70.",
              "營收不變，但成本增加，200 − 130 只剩 70 元。",
            ),
          },
        ],
        correct: "70",
      },
    ],
  },
  {
    id: "002",
    zhSlug: "vegetable-market",
    conceptId: "ECON-001",
    category: "economics",
    status: { en: "published", "zh-TW": "published" },
    title: pair("The Vegetable Market Mystery", "颱風來了，青菜為什麼變貴？"),
    description: pair(
      "A storm leaves fewer vegetables at the market. Explore supply, price pressure and a seller’s choices.",
      "颱風過後，市場的青菜減少了。一起認識供給、價格壓力與賣家的選擇。",
    ),
    takeaway: pair(
      "Supply describes how much sellers are willing and able to offer at different prices, over a given period. A storm can disrupt supply. If supply decreases while demand remains similar, prices may rise. The exact change is not guaranteed.",
      "供給是指在一段時間內，賣方在不同價格下願意且能夠提供的商品數量。颱風可能影響供給；需求相近時，供給減少可能使價格上漲，但幅度並不確定。",
    ),
    steps: [
      {
        type: "story",
        title: pair("A storm changes the market", "颱風改變了市場"),
        body: pair(
          "A powerful typhoon damages farms and disrupts transport. Normally, 100 boxes of vegetables arrive. After the storm, only 60 arrive. Shopper demand remains approximately unchanged. This is an illustrative scenario, not a report of measured storm data.",
          "強烈颱風讓農作物受損、運輸受阻。平常到貨 100 箱，颱風後只剩 60 箱；想買菜的人需求大致不變。這是教學情境，並非特定颱風的實測數據。",
        ),
        comparison: pair(
          [
            "Before the storm",
            "After the storm",
            "boxes",
            "Shopper demand: approximately unchanged",
          ],
          ["颱風前", "颱風後", "箱", "買菜需求：大致不變"],
        ),
      },
      {
        type: "predict",
        title: pair("Predict what happens", "預測市場變化"),
        body: pair(
          "Fewer vegetables are available, while shoppers still want roughly the same amount.",
          "市場可買到的青菜變少，想買菜的需求大致一樣。",
        ),
        question: pair(
          "What pressure is likely on prices?",
          "價格比較可能受到什麼壓力？",
        ),
        correct: "up",
        options: [
          {
            id: "up",
            label: pair("Upward price pressure", "價格上漲的壓力"),
            feedback: pair(
              "Yes. Reduced supply with similar demand tends to put upward pressure on prices. The exact change depends on other conditions, such as substitutes, inventories and market rules.",
              "需求相近時，供給減少通常帶來漲價壓力。實際變化還取決於替代品、庫存與市場規則等條件。",
            ),
          },
          {
            id: "down",
            label: pair("Prices must fall", "價格一定下降"),
            feedback: pair(
              "Not necessarily. With fewer vegetables and similar demand, upward price pressure is more likely. No exact price is guaranteed.",
              "不一定。青菜變少、需求相近時，比較可能有漲價壓力，但無法保證實際價格。",
            ),
          },
          {
            id: "fixed",
            label: pair("The exact price cannot change", "價格一定不變"),
            feedback: pair(
              "Prices can change when market conditions change. Here, lower supply can put upward pressure on prices, though other factors matter too.",
              "市場條件改變時，價格可能變動。供給減少可能帶來漲價壓力，但也受其他因素影響。",
            ),
          },
        ],
      },
      {
        type: "decision",
        title: pair("You run a vegetable stall", "你是市場賣家"),
        body: pair(
          "There is no universally best choice. Explore the trade-offs before moving on; you can try all three options.",
          "每個選擇都有取捨，沒有適用所有人的最佳解。可以看看三種做法的不同影響。",
        ),
        question: pair("How might you respond?", "你可能怎麼做？"),
        options: [
          {
            id: "suppliers",
            label: pair("Look for alternative suppliers", "尋找其他供應商"),
            feedback: pair(
              "This may restore stock, but transport costs, quality, delivery time and supplier reliability need checking. New stock is not guaranteed.",
              "可能補回貨量，但要確認運費、品質、到貨時間與可靠性，也不保證一定有貨。",
            ),
          },
          {
            id: "substitutes",
            label: pair("Offer substitute vegetables", "提供替代蔬菜"),
            feedback: pair(
              "Substitutes may keep choices available. Customers may need recipes or different prices, and substitute supplies may also be affected.",
              "替代品可以增加選擇，但顧客可能需要新食譜或不同價格，替代蔬菜也可能缺貨。",
            ),
          },
          {
            id: "limited",
            label: pair(
              "Keep operating with limited inventory",
              "以有限庫存繼續營業",
            ),
            feedback: pair(
              "You avoid an uncertain new supplier, but may sell out early and lose sales. Clear communication can help shoppers plan.",
              "可避免新供應商的不確定性，但可能提早售完、減少營收。清楚告知庫存有助顧客安排。",
            ),
          },
        ],
      },
      {
        type: "story",
        title: pair("Understand supply", "認識供給"),
        body: pair(
          "Supply describes how much sellers are willing and able to offer at different prices, over a given period. The 100 and 60 boxes show availability in our story. A storm can reduce supply; similar demand can create upward price pressure, without guaranteeing a particular increase.",
          "供給指一段時間內，賣方在不同價格下願意且能夠提供的數量。故事中的 100 箱與 60 箱，是到貨量示例。颱風可能使供給減少；需求相近時可能帶來漲價壓力，並非保證漲到特定價格。",
        ),
      },
    ],
  },
];
export const copy = (value, locale) => value?.[locale] ?? value?.en ?? "";
export const missionPath = (mission, locale) =>
  locale === "en"
    ? `/en/missions/${mission.id}/`
    : `/missions/${mission.zhSlug}/`;
export const directoryPath = (locale) =>
  locale === "en" ? "/en/missions/" : "/missions/";
export const availableMissions = (locale) =>
  missions.filter((m) => m.status[locale] === "published");
export function findMission(slug, locale) {
  return availableMissions(locale).find((m) =>
    locale === "en" ? m.id === slug : m.zhSlug === slug,
  );
}
export function languageTarget(path) {
  const en = path.startsWith("/en");
  const locale = en ? "en" : "zh-TW";
  const match = path.match(/^\/(?:en\/)?missions\/([^/]+)\/?$/);
  const mission = match && findMission(match[1], locale);
  const other = en ? "zh-TW" : "en";
  if (mission && mission.status[other] === "published")
    return missionPath(mission, other);
  if (match) return `${directoryPath(other)}?languageFallback=1`;
  return en ? "/" : "/en/";
}
export function evaluateChoice(step, id) {
  const option = step.options?.find((o) => o.id === id);
  return option
    ? { option, correct: step.type === "decision" ? null : step.correct === id }
    : null;
}
