// Read-only view model. No Firebase calls, awards, mutations, or new progress IDs.
export function deriveIslandProgress({ collection = {}, weeks = [], rewards = {}, roads = {}, access = {}, latestAvailableWeek = 0 }) {
  const ownedIds = Object.keys(collection).filter(id => !!collection[id]);
  const badges = ownedIds.filter(id => rewards[id]?.type === 'badge').length;
  const cards = ownedIds.filter(id => rewards[id]?.type === 'card').length;
  const learned = weeks.filter(w => w.badgeId && collection[w.badgeId]).length;
  let next = null;
  for (const [themeId, theme] of Object.entries(roads)) {
    if (!access[themeId]) continue;
    const row = theme.weeks.find((w, i) => {
      if (w.mystery || !w.weekNumber || collection[w.badgeId]) return false;
      const doc = weeks.find(d => Number(d.weekNumber) === Number(w.weekNumber));
      if (!doc || doc.published === false) return false;
      return i === 0 || !!collection[theme.weeks[i - 1]?.badgeId];
    });
    if (row) { next = { route: `/week/${row.weekNumber}`, title: row.topic || `第 ${row.n} 關`, label: `${theme.themeName} · W${row.n}` }; break; }
  }
  if (!next && access['l1-season1']) {
    const row = [...weeks].sort((a,b)=>a.weekNumber-b.weekNumber).find(w => {
      const n = Number(w.weekNumber);
      if(n < 1 || n > Math.min(12,latestAvailableWeek) || !w.published || collection[w.badgeId]) return false;
      const previous = weeks.find(d => Number(d.weekNumber) === n - 1);
      return n === 1 || !!collection[previous?.badgeId];
    });
    if(row)next={route:`/week/${row.weekNumber}`,title:row.title || row.topic || `第 ${row.weekNumber} 週挑戰`,label:`第一季 · W${row.weekNumber}`};
  }
  return {badges,cards,learned,owned:ownedIds.length,next};
}
