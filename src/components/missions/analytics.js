// Session-only aggregate counts, no visitor ID, answers, URLs or network collector.
const allowed = new Set(["visit", "start", "complete", "replay", "explore"]);
export function campaignFrom(search) {
  const p = new URLSearchParams(search);
  return p.get("campaign") === "PRICE" ? "PRICE" : null;
}
export function recordMissionEvent(event, missionId, locale, search = "") {
  if (
    !allowed.has(event) ||
    !/^\d{3}$/.test(missionId) ||
    !["en", "zh-TW"].includes(locale)
  )
    return false;
  try {
    const key = "mtt-mission-counts:v1";
    const counts = JSON.parse(sessionStorage.getItem(key) || "{}");
    const bucket = [
      missionId,
      locale,
      event,
      campaignFrom(search) || "direct",
    ].join(":");
    counts[bucket] = (Number(counts[bucket]) || 0) + 1;
    sessionStorage.setItem(key, JSON.stringify(counts));
    return true;
  } catch {
    return false;
  }
}
