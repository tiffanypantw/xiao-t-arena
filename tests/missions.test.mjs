import test from "node:test";
import assert from "node:assert/strict";
import {
  missions,
  concepts,
  availableMissions,
  findMission,
  languageTarget,
  evaluateChoice,
} from "../src/data/missions/catalog.js";
import {
  campaignFrom,
  recordMissionEvent,
} from "../src/components/missions/analytics.js";
test("only published localized missions can be opened", () => {
  assert.equal(availableMissions("en").length, 2);
  assert.equal(availableMissions("zh-TW").length, 1);
  assert.equal(findMission("001", "zh-TW"), undefined);
  assert.equal(findMission("003", "en"), undefined);
});
test("switches corresponding supply activity and explains missing equivalent", () => {
  assert.equal(
    languageTarget("/en/missions/002/"),
    "/missions/vegetable-market/",
  );
  assert.equal(
    languageTarget("/missions/vegetable-market/"),
    "/en/missions/002/",
  );
  assert.equal(
    languageTarget("/en/missions/001/"),
    "/missions/?languageFallback=1",
  );
  assert.equal(languageTarget("/"), "/en/");
  assert.equal(languageTarget("/en/"), "/");
});
test("profit validation includes all costs and rental transfer", () => {
  const m = missions[0];
  assert.equal(200 - (65 + 25 + 30), 80);
  assert.equal(evaluateChoice(m.steps[0], "80").correct, true);
  assert.equal(evaluateChoice(m.steps[0], "200").correct, false);
  assert.equal(evaluateChoice(m.steps[1], "70").correct, true);
  assert.equal(evaluateChoice(m.steps[0], "injected"), null);
});
test("supply prediction validated; decisions have trade-offs not a winning answer", () => {
  const m = missions[1];
  assert.equal(evaluateChoice(m.steps[1], "up").correct, true);
  assert.equal(evaluateChoice(m.steps[1], "fixed").correct, false);
  for (const o of m.steps[2].options) {
    assert.equal(evaluateChoice(m.steps[2], o.id).correct, null);
    assert.ok(o.feedback.en && o.feedback["zh-TW"]);
  }
  assert.equal(concepts[1].concept.en, "Supply");
  assert.equal(concepts[1].videos.en, null);
});
test("privacy restricts campaign and payload, works with disabled storage", () => {
  assert.equal(campaignFrom("?campaign=PRICE"), "PRICE");
  assert.equal(campaignFrom("?campaign=child@example.com"), null);
  Object.defineProperty(globalThis, "sessionStorage", {
    configurable: true,
    writable: true,
    value: {
      getItem: () => {
        throw new Error("blocked");
      },
    },
  });
  assert.equal(recordMissionEvent("visit", "001", "en"), false);
  const values = new Map();
  globalThis.sessionStorage = {
    getItem: (k) => values.get(k),
    setItem: (k, v) => values.set(k, v),
  };
  for (const event of ["visit", "start", "complete", "replay", "explore"])
    assert.equal(
      recordMissionEvent(event, "002", "en", "?campaign=PRICE&email=secret"),
      true,
    );
  assert.equal(recordMissionEvent("answer", "002", "en"), false);
  const stored = values.values().next().value;
  assert.ok(!stored.includes("secret"));
  assert.equal(Object.keys(JSON.parse(stored)).length, 5);
  delete globalThis.sessionStorage;
});
