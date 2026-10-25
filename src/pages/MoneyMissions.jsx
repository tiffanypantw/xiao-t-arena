import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowRight, Compass, Store, TrendingUp, Globe2 } from "lucide-react";
import MissionLayout from "@/components/missions/MissionLayout";
import {
  availableMissions,
  categories,
  concepts,
  copy,
  directoryPath,
  findMission,
  missionPath,
  evaluateChoice,
} from "@/data/missions/catalog";
import { recordMissionEvent } from "@/components/missions/analytics";
function MissionCard({ mission, locale }) {
  return (
    <Link className="mt-card" to={missionPath(mission, locale)}>
      <span className="mt-eyebrow">
        {mission.conceptId} · {locale === "en" ? "FREE MISSION" : "免費任務"}
      </span>
      <h3>{copy(mission.title, locale)}</h3>
      <p>{copy(mission.description, locale)}</p>
      <span className="mt-tag">
        {copy(
          concepts.find((c) => c.conceptId === mission.conceptId).concept,
          locale,
        )}{" "}
        · 2–3 min
      </span>
      <strong>
        {locale === "en" ? "Play mission" : "開始探索"} <ArrowRight size={18} />
      </strong>
    </Link>
  );
}
export function MissionDirectory({ locale = "en", home = false }) {
  const en = locale === "en";
  const location = useLocation();
  const icons = [Compass, Store, TrendingUp, Globe2];
  const BoardHeading = home ? "h2" : "h1";
  return (
    <MissionLayout locale={locale}>
      {home && (
        <section className="mt-hero">
          <div>
            <p className="mt-eyebrow">NEXTGENFINANCE WITH XIAO T · AGES 13+</p>
            <h1>
              Explore the World.
              <br />
              Understand Money.
              <br />
              <em>Think for Yourself.</em>
            </h1>
            <p>
              Explore how money, business, economics, and investing work through
              short stories, interactive challenges, and real-world decisions.
            </p>
            <div className="mt-actions">
              <a className="mt-primary" href="#missions">
                Explore Free Money Missions <ArrowRight size={18} />
              </a>
              <a
                className="mt-secondary"
                href="https://youtu.be/-bwAsQ4TwPQ"
                target="_blank"
                rel="noreferrer"
              >
                Watch Xiao T&apos;s Videos ↗
                <small>First episode · Mandarin audio</small>
              </a>
            </div>
            <p className="mt-small">
              2–3 minutes · No sign-up · Learn at your own pace
            </p>
          </div>
          <div className="mt-hero-art" aria-label="Learning journey">
            <Globe2 size={104} strokeWidth={1} />
            <span>THE WORLD IS YOUR CLASSROOM</span>
            <div>
              <b>100 → 60</b>
              <small>Fewer vegetables. What changes?</small>
            </div>
            <div>
              <b>$200 − $120</b>
              <small>Follow the money. Find the profit.</small>
            </div>
          </div>
        </section>
      )}
      <section id="missions" className="mt-directory">
        <p className="mt-eyebrow">SMALL STORIES. BIG CONNECTIONS.</p>
        <BoardHeading className={home ? "mt-section-title" : ""}>
          {en ? "Your Money Mission Board" : "免費互動任務"}
        </BoardHeading>
        {location.search.includes("languageFallback=1") && (
          <p className="mt-notice" role="status">
            {en
              ? "This activity has no English version yet. Explore the available missions below."
              : "這個任務暫無對應的中文版，先看看目前可玩的中文任務。"}
          </p>
        )}
        <p>
          {en
            ? "Choose a story. Explore a decision. Discover a concept."
            : "從一個故事出發，認識生活裡的財商概念。"}
        </p>
        {categories.map(([id, name], i) => {
          const items = availableMissions(locale).filter(
            (m) => m.category === id,
          );
          const Icon = icons[i];
          return (
            <section className="mt-category" key={id}>
              <h2>
                <Icon size={24} />
                {en
                  ? name
                  : [
                      "金錢與決策",
                      "商業與創業",
                      "投資與所有權",
                      "經濟與真實世界",
                    ][i]}
              </h2>
              {items.length ? (
                <div className="mt-grid">
                  {items.map((m) => (
                    <MissionCard key={m.id} mission={m} locale={locale} />
                  ))}
                </div>
              ) : (
                <p className="mt-empty">
                  {en
                    ? "New stories are being prepared. Explore a ready mission above or below."
                    : "新故事準備中，可以先探索已開放的任務。"}
                </p>
              )}
            </section>
          );
        })}
      </section>
      <aside className="mt-notice">
        {en
          ? "Meet our learning universe: Xiao T is our girl guide. GoodWhale is her separate blue-whale companion."
          : "小 T 是女孩嚮導，小鯨 GoodWhale 是另一位藍鯨夥伴。"}{" "}
        <Link to="/">
          {en ? "Explore the Chinese learning world →" : "返回世界地圖 →"}
        </Link>
      </aside>
    </MissionLayout>
  );
}
export default function MoneyMission({ locale = "en" }) {
  const { missionId, missionSlug } = useParams();
  const mission = findMission(missionId || missionSlug, locale);
  return mission ? (
    <MissionPlayer
      key={`${locale}:${mission.id}`}
      mission={mission}
      locale={locale}
    />
  ) : (
    <MissionLayout locale={locale}>
      <h1>{locale === "en" ? "Mission not available" : "任務尚未開放"}</h1>
      <Link to={directoryPath(locale)}>
        {locale === "en" ? "Explore available missions" : "探索已開放任務"}
      </Link>
    </MissionLayout>
  );
}
function MissionPlayer({ mission, locale }) {
  const en = locale === "en";
  const location = useLocation();
  const [stage, setStage] = useState(-1);
  const [selected, setSelected] = useState(null);
  const heading = useRef(null);
  const visited = useRef(false);
  const complete = stage === mission.steps.length;
  const step = mission.steps[stage];
  const answer = step && evaluateChoice(step, selected);
  const concept = concepts.find((c) => c.conceptId === mission.conceptId);
  const emit = (event) =>
    recordMissionEvent(event, mission.id, locale, location.search);
  useEffect(() => {
    if (!visited.current) {
      recordMissionEvent("visit", mission.id, locale, location.search);
      visited.current = true;
    }
  }, [mission.id, locale, location.search]);
  useEffect(() => {
    if (stage >= 0) heading.current?.focus();
  }, [stage]);
  function advance() {
    setSelected(null);
    if (stage === -1) emit("start");
    if (stage === mission.steps.length - 1) emit("complete");
    setStage((s) => s + 1);
  }
  function replay() {
    emit("replay");
    setSelected(null);
    setStage(-1);
  }
  return (
    <MissionLayout locale={locale}>
      <Link
        className="mt-back"
        to={directoryPath(locale)}
        onClick={() => emit("explore")}
      >
        ← {en ? "All missions" : "所有任務"}
      </Link>
      <p className="mt-eyebrow">
        {mission.conceptId} · {copy(concept.concept, locale)} · 2–3 min
      </p>
      <h1 className="mt-mission-title">{copy(mission.title, locale)}</h1>
      <div
        className="mt-progress"
        role="progressbar"
        aria-label={en ? "Mission progress" : "任務進度"}
        aria-valuemin={0}
        aria-valuemax={mission.steps.length}
        aria-valuenow={Math.max(0, stage)}
      >
        <span
          style={{
            width: `${(Math.max(0, stage) / mission.steps.length) * 100}%`,
          }}
        />
      </div>
      <section className="mt-panel">
        {stage === -1 ? (
          <>
            <p className="mt-eyebrow">
              {en ? "YOUR NEXT LITTLE DISCOVERY" : "開始一段新探索"}
            </p>
            <h2>
              {en
                ? "A small story. A useful idea."
                : "一個小故事，一個新概念。"}
            </h2>
            <p>{copy(mission.description, locale)}</p>
            <p>
              {en
                ? "Explore the situation, try a choice, and see why it matters. You can replay anytime."
                : "認識情境、試試選擇，再看看背後的原因。可以隨時重玩。"}
            </p>
            <button className="mt-primary" onClick={advance}>
              {en ? "Start mission" : "開始任務"} <ArrowRight size={18} />
            </button>
          </>
        ) : complete ? (
          <>
            <p className="mt-eyebrow">{en ? "MISSION COMPLETE" : "探索完成"}</p>
            <h2 ref={heading} tabIndex={-1}>
              {en
                ? "One more way to understand the world."
                : "又多認識世界的一個面向。"}
            </h2>
            <p>{copy(mission.takeaway, locale)}</p>
            {concept.resources[locale] && (
              <Link className="mt-secondary" to={concept.resources[locale]}>
                {en
                  ? "Explore the worksheet & concept card"
                  : "開啟學習探索單與概念牌卡"}{" "}
                →
              </Link>
            )}
            <div className="mt-actions">
              <button className="mt-primary" onClick={replay}>
                {en ? "Replay mission" : "再玩一次"} ↻
              </button>
              <Link
                className="mt-secondary"
                to={directoryPath(locale)}
                onClick={() => emit("explore")}
              >
                {en ? "Explore other missions" : "探索其他任務"} →
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="mt-eyebrow">
              {stage + 1} / {mission.steps.length} ·{" "}
              {step.type === "decision"
                ? en
                  ? "MAKE A DECISION"
                  : "做個選擇"
                : step.type === "predict"
                  ? en
                    ? "PREDICT WHAT HAPPENS"
                    : "預測會發生什麼"
                  : step.type === "mystery"
                    ? en
                      ? "SOLVE THE MYSTERY"
                      : "解開謎團"
                    : en
                      ? "EXPLORE THE STORY"
                      : "認識故事"}
            </p>
            <h2 ref={heading} tabIndex={-1}>
              {copy(step.title, locale)}
            </h2>
            <p>{copy(step.body, locale)}</p>
            {step.comparison && (
              <div className="mt-comparison">
                {[100, 60].map((n, i) => (
                  <div key={n}>
                    <span>{copy(step.comparison, locale)[i]}</span>
                    <div className="mt-boxes" aria-hidden="true">
                      {Array.from({ length: n / 10 }, (_, k) => (
                        <span key={k}>▦</span>
                      ))}
                    </div>
                    <b>
                      {n} {copy(step.comparison, locale)[2]}
                    </b>
                  </div>
                ))}
                <p>{copy(step.comparison, locale)[3]}</p>
              </div>
            )}
            {step.ledger && (
              <dl className="mt-ledger">
                {step.ledger.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>${value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {step.question && <h3>{copy(step.question, locale)}</h3>}
            {step.options && (
              <div className="mt-choices">
                {step.options.map((o) => (
                  <button
                    key={o.id}
                    aria-pressed={selected === o.id}
                    onClick={() => setSelected(o.id)}
                  >
                    {copy(o.label, locale)}
                  </button>
                ))}
              </div>
            )}
            {answer && (
              <div className="mt-feedback" role="status">
                <strong>
                  {answer.correct === null
                    ? en
                      ? "A trade-off to consider"
                      : "看看這個取捨"
                    : answer.correct
                      ? en
                        ? "You found it."
                        : "答對了。"
                      : en
                        ? "Look a little closer."
                        : "再看仔細一點。"}
                </strong>
                <p>{copy(answer.option.feedback, locale)}</p>
              </div>
            )}
            <button
              className="mt-primary"
              disabled={Boolean(step.options && !answer)}
              onClick={advance}
            >
              {en ? "Continue" : "繼續探索"} <ArrowRight size={18} />
            </button>
          </>
        )}
      </section>
      {concept.videos[locale] && (
        <p className="mt-small">
          <a href={concept.videos[locale]} target="_blank" rel="noreferrer">
            {en ? "Watch the related video" : "觀看這集影片"} ↗
          </a>
        </p>
      )}
      <p className="mt-small">
        {en
          ? "An educational scenario. No score, name or email is collected."
          : "教學情境，不蒐集分數、姓名或電子郵件。"}
      </p>
    </MissionLayout>
  );
}
