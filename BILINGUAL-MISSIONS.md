# Xiao T Arena 雙語整合 — 2026-10-25

## Audit / safeguards
- Existing stack: React 18, Vite 6, React Router 7, Tailwind/Radix, Firebase Auth + Firestore, Vercel Git deployments. No new runtime dependencies. Added missing ESLint plugins and TypeScript 5.9 as development tools; removed two unused imports only.
- `/`, `/world`, `/resources`, `/card-island`, `/islands` are public React routes. Authenticated application is lazily mounted separately by `ArenaApplication.jsx`.
- Protected student routes include `/Home`, `/classic`, `/Passport`, `/Profile`, `/week/:weekNumber`, `/VDPractice`, `/money`, `/arena`, `/arena/band/:bandId`, `/arena/weeks`, `/arena/road/:themeId`, `/stop`, `/trivia`, `/leaderboard`. Admin routes remain protected by AdminRoute. Do not copy their learning content into the public mission catalog.
- Skool is an existing Chinese purchase/community flow: theme unlock codes and Firebase entitlements gate course access. No new checkout, no changes to unlock logic, AuthContext, database, rules or collection/progress writes.
- Shared: React Router, typography/palette, accessible links/buttons and public resource links. Existing member practice components depend on student state, so a small standalone public engine avoids mounting their providers or exposing member question banks.
- Safe branch: `codex/bilingual-missions`; baseline rollback commit `dc8f661` (weekly homepage). Revert the bilingual commit or redeploy that baseline through existing Vercel project if needed. Do not reset databases.

## English source inspection
- Read the public English homepage, Mission 001 HTML and its linked public `mission.js`. Retained all 001 core numbers, four initial answer feedback paths, expense breakdown, rental +$10 transfer question, completion/replay and caveats about costs/cash timing. Reimplemented with shared React components; did not claim a local or repository source checkout was found.
- No identifiable English repository/project was found in the inspected local Codex folders. Existing `https://nextgenfinance-learning-lab.vercel.app/` remains live and unmodified.
- IMPORTANT: old English `/missions/002/` currently means **The Recovery Challenge**, not Supply. New Xiao T `/en/missions/002/` is **The Vegetable Market Mystery**. Never automatically redirect old 002 here. Future migration should use explicit concept mappings, not episode numbers.
- No approved teenage Xiao T / GoodWhale master sheet is present in this repository. Related images exist in external brand folders but approval/version is unconfirmed. This MVP uses abstract globe/market graphics and text identity only. Xiao T = girl; GoodWhale = separate whale. No substitute character art generated.

## New routes
- `/en/`: NextGenFinance with Xiao T English homepage, ages 13+.
- `/en/missions/`: free English directory.
- `/en/missions/001/`: Where Did the Money Go? Revenue vs. Profit (BUS-001).
- `/en/missions/002/`: The Vegetable Market Mystery. Supply (ECON-001).
- `/missions/`: free Traditional Chinese directory.
- `/missions/vegetable-market/`: Traditional Chinese Supply mission.
- ManyChat keyword PRICE destination: `https://xiao-t-arena.vercel.app/en/missions/002/?campaign=PRICE`
- Unknown English paths remain in the public English experience, rather than invoking student login.

## Components / content
- `src/data/missions/catalog.js`: stable concept IDs, locale publication status, video/resource/paid-product references; content-driven `story`, `predict`, `decision`, `mystery` screens. `predict` and `mystery` validate objective answers. `decision` gives trade-offs with no universal winning score. Incorrect choices always receive explanations and can be retried or continued.
- `src/pages/MoneyMissions.jsx`: directory and reusable player, progress, immediate feedback, completion, replay, keyboard focus on screen changes. Decisions permit exploring all options. No user registration or persisted answers.
- `src/components/missions/`: shared responsive layout, scoped CSS, language switch, metadata and session counter.
- Existing Chinese public header gains language selector; root gains free Chinese mission entry. Existing Chinese URLs, artifacts and learning date remain unchanged.
- Concept ECON-001 is **Supply / 供給**. Existing physical duo artwork says Supply Shock on its front; it is preserved unchanged as previously supplied. No new Supply Shock vocabulary card was created. Updating that older artwork to Supply requires an approved replacement.
- Chinese video is linked as supplied. English video URL is null; English homepage transparently labels linked pilot as Mandarin audio, rather than claiming an English version exists.

## Language / metadata
- Explicit URLs always determine language; selector saves optional `mtt-language` preference without forcing redirects or replacing Chinese root. Corresponding mission switch works in both directions. Mission 001 has no Chinese equivalent and explains fallback to Chinese directory.
- `LocaleMetadata.jsx` updates document language, title and alternate links during navigation.
- `scripts/build-mission-pages.mjs` creates static Vite entry HTML per public mission/directory, with localized title, description, canonical and Open Graph metadata for crawlers that do not execute JavaScript. No social preview image invented. Vercel explicit rewrites precede existing SPA fallback.

## Privacy and current limitations
- Mission events: visit, start, complete, replay, explore. `sessionStorage` aggregates counts by mission, language and event in this tab; no identifiers, answers, full referrers, emails, cookies or outbound analytics requests. Only allowlisted `campaign=PRICE` is retained. Storage failures do not block play.
- **No central analytics collector/dashboard exists. Counts are not sitewide traffic and should not be reported as real aggregate adoption data.** Later connect a first-party aggregate endpoint with event allowlisting, bounded retention and hosting-log review; do not attach Firebase student IDs.
- No logged-in account or paid writes are tested with real student data. Read-only regression and existing access tests cover preservation; teacher acceptance with an authorized account is still advisable.

## Add future missions
1. Add stable concept record (e.g. BUS-002); connect only actually available localized video/resource URLs. Future paid references never grant access.
2. Add mission catalog record with unique localized route and `planned` status until every screen is ready. Screens use existing types; every option needs localized feedback. Objective screens need `correct`; decision screens do not.
3. Publish only completed locale(s). Mission event IDs support three-digit mission numbers. Add Vercel rewrites for the new paths; static metadata generation reads all published catalog missions automatically.
4. Run content validators, unit tests, lint/build and browser checks including mobile, language fallback and direct links. Deploy preview first. Do not republish withdrawn news.
5. Existing Chinese exploration sheet and card upload process is unchanged; mission concept points to `/resources/ep001`, which continues to offer two separate resources.

## Migration recommendation
Keep both sites during acceptance. Link old 001 to the new tested equivalent only after approval. Audit old Recovery Challenge source and migrate it as a separate concept/mission; only then prepare a URL mapping and seek explicit approval for redirects or retirement. Do not use a blanket old `/missions/:id` redirect.

## Verification
- 40 Node tests pass, including original auth/progress/resource/card/world cases and new mission/locale/privacy cases. All three content validators pass.
- Full Vite production build and static sharing-page generation pass. `npm run lint` passes after removing two unused imports; course behavior is not changed.
- `npm run typecheck` runs after restoring its missing tool, but reports existing errors in legacy API/UI/pages (see delivered typecheck log). No errors were reported for the new mission files. This is not a clean whole-project typecheck.
- Browser checks: both English missions completed, incorrect/correct feedback, all three Supply decisions, replay, keyboard Space selection, bidirectional Supply language switching and 001 missing-language explanation. Chinese Supply completed and links to existing two-resource page.
- Mobile 390×844 and desktop layout reviewed; Chinese public header wraps navigation without clipping. Existing card keyboard flip and exploration-sheet save/print entrances remain present.
- Fourteen existing student-route entrances remain login-gated when signed out. No student login, score, reward, unlock, database migration or payment transaction was performed. In-account gameplay was not exhaustively retested.
