import assert from "node:assert/strict";
import {
  missions,
  concepts,
  copy,
  missionPath,
} from "../src/data/missions/catalog.js";
const ids = new Set(),
  routes = new Set();
for (const m of missions) {
  assert.match(m.id, /^\d{3}$/);
  assert.ok(!ids.has(m.id), "Duplicate mission ID");
  ids.add(m.id);
  assert.ok(
    concepts.some((c) => c.conceptId === m.conceptId),
    "Unknown concept",
  );
  for (const [locale, status] of Object.entries(m.status)) {
    assert.ok(["en", "zh-TW"].includes(locale));
    assert.ok(["planned", "published", "archived"].includes(status));
    if (status !== "published") continue;
    const route = missionPath(m, locale);
    assert.ok(!routes.has(route), "Duplicate localized route");
    routes.add(route);
    assert.ok(m.title[locale] && m.description[locale] && m.takeaway[locale]);
    assert.ok(m.steps.length > 0);
    for (const s of m.steps) {
      assert.ok(["story", "predict", "decision", "mystery"].includes(s.type));
      assert.ok(s.title[locale] && s.body[locale]);
      if (s.type === "story") continue;
      assert.ok(s.question[locale]);
      assert.ok(s.options.length >= 2 && s.options.length <= 4);
      assert.equal(new Set(s.options.map((o) => o.id)).size, s.options.length);
      for (const o of s.options)
        assert.ok(
          o.label[locale] && o.feedback[locale],
          `Missing ${locale} option text`,
        );
      if (s.type === "decision") assert.equal(s.correct, undefined);
      else
        assert.ok(
          s.options.some((o) => o.id === s.correct),
          "Missing correct answer",
        );
    }
    assert.ok(copy(m.title, locale));
  }
}
console.log(
  `Validated ${missions.length} missions, ${routes.size} published localized activities.`,
);
