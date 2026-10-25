import { Link } from "react-router-dom";
import LanguageSwitch from "./LanguageSwitch";
import "./missions.css";
export default function MissionLayout({ locale = "en", children }) {
  const en = locale === "en";
  return (
    <div className="mt-site">
      <header className="mt-header">
        <Link className="mt-brand" to={en ? "/en/" : "/"}>
          <strong>{en ? "NextGenFinance" : "小 T 帶你看世界"}</strong>
          <small>
            {en ? "with Xiao T · More Than Tiffany" : "More Than Tiffany"}
          </small>
        </Link>
        <LanguageSwitch />
      </header>
      <main className="mt-main">{children}</main>
      <footer className="mt-footer">
        <p>© 2026 More Than Tiffany. All Rights Reserved.</p>
        <p>
          {en
            ? "Free missions · No account needed. Answers reset when you leave. Anonymous event counts stay in this tab for this session; no central analytics collector is connected. Hosting providers may keep standard request logs."
            : "免費任務，免登入。離開後作答重設。匿名事件次數僅存於本分頁工作階段，未串接集中統計；主機服務商可能保留標準請求紀錄。"}
        </p>
      </footer>
    </div>
  );
}
