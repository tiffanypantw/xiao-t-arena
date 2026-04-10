import { useAuth } from "@/lib/AuthContext";
import { motion } from "framer-motion";

export default function Login() {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-6xl mb-4">🧠</div>
          <h1 className="text-2xl font-black text-foreground tracking-tight leading-tight">
            小T的財商概念競技場
          </h1>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            請用 Google 帳號登入，追蹤孩子的學習進度
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-muted/40 border border-border rounded-2xl p-5 text-left space-y-2"
        >
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            登入後可以
          </p>
          <div className="space-y-1.5 text-sm text-foreground">
            <p>✅ 記錄每週測驗分數</p>
            <p>📊 追蹤學習進度</p>
            <p>🔓 解鎖下一週的內容</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
        >
          <button
            onClick={loginWithGoogle}
            className="w-full bg-foreground text-background font-black text-lg rounded-2xl py-5 px-8 hover:opacity-90 transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-3"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5"
            />
            用 Google 帳號登入
          </button>
          <p className="text-xs text-muted-foreground mt-3">
            我們只會儲存學習進度，不會分享你的資料
          </p>
        </motion.div>
      </div>
    </div>
  );
}
