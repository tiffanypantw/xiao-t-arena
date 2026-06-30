import { useNavigate } from "react-router-dom";
import { ChevronLeft, Home } from "lucide-react";

/**
 * 統一的頁面頂部返回列。
 * - 左側：「‹ 上一層」（維持瀏覽脈絡）。第一層頁面 backTo 預設為首頁。
 * - 右側：只要 backTo 不是首頁（即第 2 層以上），就固定出現「⌂ 首頁」一鍵回家。
 *   也可傳入 right 放頁面自己的按鈕（例如學習護照），會排在首頁鈕左邊。
 *
 * @param {string}  backTo    返回目標路由，預設 "/"
 * @param {string}  backLabel 返回文字，預設 "首頁"
 * @param {ReactNode} right   右側額外按鈕（選填）
 */
export default function PageHeader({ backTo = "/", backLabel = "首頁", right = null }) {
  const navigate = useNavigate();
  const showHome = backTo !== "/" && backTo !== "/Home";

  return (
    <div className="flex items-center justify-between mb-5">
      <button
        onClick={() => navigate(backTo)}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-all"
      >
        <ChevronLeft className="w-4 h-4" /> {backLabel}
      </button>

      {(right || showHome) && (
        <div className="flex items-center gap-2">
          {right}
          {showHome && (
            <button
              onClick={() => navigate("/")}
              title="回到首頁"
              className="flex items-center gap-1 bg-violet-100 text-violet-700 text-xs font-bold px-3 py-2 rounded-xl hover:opacity-90 transition-all"
            >
              <Home className="w-3.5 h-3.5" /> 首頁
            </button>
          )}
        </div>
      )}
    </div>
  );
}
