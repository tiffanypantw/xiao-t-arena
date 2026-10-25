// Pre-render share metadata into static route entrypoints for crawlers without JS.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { missions, copy, missionPath } from "../src/data/missions/catalog.js";
const origin = "https://xiao-t-arena.vercel.app";
const escape = (s) =>
  s.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
const base = await readFile("dist/index.html", "utf8");
const pages = [
  {
    path: "/en/",
    locale: "en",
    title: "NextGenFinance with Xiao T | Free Money Missions",
    description:
      "Explore money, business and economics through free interactive missions.",
    alternates: { en: "/en/", "zh-TW": "/" },
  },
  {
    path: "/en/missions/",
    locale: "en",
    title: "Free Money Missions | NextGenFinance with Xiao T",
    description:
      "Explore revenue, profit and supply in free 2–3 minute missions.",
  },
  {
    path: "/missions/",
    locale: "zh-TW",
    title: "免費互動任務 | 小 T 帶你看世界",
    description: "從生活故事認識供給、價格與財商概念。",
  },
];
for (const m of missions)
  for (const locale of Object.keys(m.status).filter(
    (l) => m.status[l] === "published",
  ))
    pages.push({
      path: missionPath(m, locale),
      locale,
      title:
        copy(m.title, locale) +
        " | " +
        (locale === "en" ? "NextGenFinance with Xiao T" : "小 T 帶你看世界"),
      description: copy(m.description, locale),
      alternates: Object.fromEntries(
        Object.keys(m.status)
          .filter((l) => m.status[l] === "published")
          .map((l) => [l, missionPath(m, l)]),
      ),
    });
for (const p of pages) {
  const meta =
    `<meta data-mission-meta name="description" content="${escape(p.description)}"><meta data-mission-meta property="og:type" content="website"><meta data-mission-meta property="og:title" content="${escape(p.title)}"><meta data-mission-meta property="og:description" content="${escape(p.description)}"><meta data-mission-meta property="og:url" content="${origin + p.path}"><meta data-mission-meta property="og:locale" content="${p.locale === "en" ? "en_US" : "zh_TW"}"><link data-mission-meta rel="canonical" href="${origin + p.path}">` +
    Object.entries(p.alternates || {})
      .map(
        ([l, path]) =>
          `<link data-mission-meta rel="alternate" hreflang="${l}" href="${origin + path}">`,
      )
      .join("");
  const html = base
    .replace('lang="zh-TW"', `lang="${p.locale}"`)
    .replace(/<title>.*?<\/title>/, `<title>${escape(p.title)}</title>`)
    .replace("</head>", meta + "</head>");
  const folder = "dist" + p.path;
  await mkdir(folder, { recursive: true });
  await writeFile(folder + "index.html", html);
}
console.log(`Prepared ${pages.length} localized sharing pages.`);

await writeFile(
  "dist/index.html",
  base.replace(
    "</head>",
    '<link data-mission-meta rel="alternate" hreflang="en" href="' +
      origin +
      '/en/"><link data-mission-meta rel="alternate" hreflang="zh-TW" href="' +
      origin +
      '/"></head>',
  ),
);
