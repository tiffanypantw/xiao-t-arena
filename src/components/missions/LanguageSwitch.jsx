import { Link, useLocation } from "react-router-dom";
import { languageTarget } from "@/data/missions/catalog";
export default function LanguageSwitch() {
  const { pathname } = useLocation();
  const en = pathname.startsWith("/en");
  return (
    <nav aria-label="Language / 語言" className="mt-language">
      <Link
        lang="zh-TW"
        aria-current={!en ? "page" : undefined}
        to={en ? languageTarget(pathname) : pathname}
        onClick={() => {
          try {
            localStorage.setItem("mtt-language", "zh-TW");
          } catch {
            /* Preference is optional. */
          }
        }}
      >
        繁體中文
      </Link>
      <span aria-hidden="true"> | </span>
      <Link
        lang="en"
        aria-current={en ? "page" : undefined}
        to={en ? pathname : languageTarget(pathname)}
        onClick={() => {
          try {
            localStorage.setItem("mtt-language", "en");
          } catch {
            /* Preference is optional. */
          }
        }}
      >
        English
      </Link>
    </nav>
  );
}
