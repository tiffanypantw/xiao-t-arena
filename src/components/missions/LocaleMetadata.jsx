import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { findMission, copy, missionPath } from "@/data/missions/catalog";
export default function LocaleMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.head
      .querySelectorAll("[data-mission-meta]")
      .forEach((n) => n.remove());
    const en = pathname.startsWith("/en");
    const locale = en ? "en" : "zh-TW";
    document.documentElement.lang = locale;
    const match = pathname.match(/^\/(?:en\/)?missions\/([^/]+)\/?$/);
    const mission = match && findMission(match[1], locale);
    const title = mission
      ? `${copy(mission.title, locale)} | ${en ? "NextGenFinance with Xiao T" : "小 T 帶你看世界"}`
      : en
        ? "NextGenFinance with Xiao T | Free Money Missions"
        : "小T財商概念競技場";
    const nodes = [];
    if (title) document.title = title;
    function add(tag, attrs) {
      const el = document.createElement(tag);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      document.head.append(el);
      nodes.push(el);
    }
    const origin = "https://xiao-t-arena.vercel.app";
    if (title) {
      const description = mission
        ? copy(mission.description, locale)
        : en
          ? "Explore money, business and economics through free interactive missions."
          : "從生活故事與免費互動任務，探索財商、商業與經濟概念。";
      add("meta", { name: "description", content: description });
      add("meta", { property: "og:title", content: title });
      add("meta", { property: "og:description", content: description });
      add("meta", { property: "og:url", content: origin + pathname });
      add("link", { rel: "canonical", href: origin + pathname });
    }
    if (mission) {
      Object.keys(mission.status)
        .filter((l) => mission.status[l] === "published")
        .forEach((l) =>
          add("link", {
            rel: "alternate",
            hreflang: l,
            href: origin + missionPath(mission, l),
          }),
        );
    } else if (pathname === "/" || pathname === "/en" || pathname === "/en/") {
      add("link", { rel: "alternate", hreflang: "en", href: origin + "/en/" });
      add("link", { rel: "alternate", hreflang: "zh-TW", href: origin + "/" });
    }
    return () => nodes.forEach((n) => n.remove());
  }, [pathname]);
  return null;
}
