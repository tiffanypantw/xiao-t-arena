import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const { loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const [mode, setMode] = useState("main"); // main | login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async () => {
    if (!email || !password) { setError("請填寫電子郵件和密碼"); return; }
    setLoading(true); setError("");
    const result = await loginWithEmail(email, password);
    if (!result.success) { setError(result.error); setLoading(false); }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) { setError("請填寫所有欄位"); return; }
    if (password.length < 6) { setError("密碼至少需要 6 個字元"); return; }
    setLoading(true); setError("");
    const result = await registerWithEmail(email, password, name);
    if (!result.success) { setError(result.error); setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6 text-center">

        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-6xl mb-4">🧠</div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">
            小T的財商概念競技場
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            請登入以追蹤孩子的學習進度
          </p>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* 主選單 */}
          {mode === "main" && (
            <motion.div key="main" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
              <div className="bg-muted/40 border border-border rounded-2xl p-5 text-left space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">登入後可以</p>
                <div className="space-y-1.5 text-sm text-foreground">
                  <p>✅ 記錄每週測驗分數</p>
                  <p>📊 追蹤學習進度</p>
                  <p>🔓 解鎖下一週的內容</p>
                </div>
              </div>

              <button
                onClick={loginWithGoogle}
                className="w-full bg-foreground text-background font-black text-base rounded-2xl py-4 px-8 hover:opacity-90 transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-3"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                用 Google 帳號登入
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">或</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <button
                onClick={() => setMode("login")}
                className="w-full border-2 border-border text-foreground font-bold text-base rounded-2xl py-4 px-8 hover:bg-muted transition-all"
              >
                用電子郵件登入
              </button>

              <p className="text-xs text-muted-foreground">
                還沒有帳號？
                <button onClick={() => setMode("register")} className="text-foreground font-bold underline ml-1">
                  立即註冊
                </button>
              </p>
            </motion.div>
          )}

          {/* Email 登入 */}
          {mode === "login" && (
            <motion.div key="login" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3 text-left">
              <h2 className="text-lg font-black text-foreground text-center">電子郵件登入</h2>

              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="電子郵件"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-foreground"
                />
                <input
                  type="password"
                  placeholder="密碼"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEmailLogin()}
                  className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-foreground"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                onClick={handleEmailLogin}
                disabled={loading}
                className="w-full bg-foreground text-background font-black rounded-xl py-4 hover:opacity-90 transition-all disabled:opacity-50"
              >
                {loading ? "登入中..." : "登入"}
              </button>

              <button onClick={() => { setMode("main"); setError(""); }} className="w-full text-sm text-muted-foreground py-2">
                ← 返回
              </button>
            </motion.div>
          )}

          {/* Email 註冊 */}
          {mode === "register" && (
            <motion.div key="register" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3 text-left">
              <h2 className="text-lg font-black text-foreground text-center">建立新帳號</h2>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="你的名字"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-foreground"
                />
                <input
                  type="email"
                  placeholder="電子郵件"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-foreground"
                />
                <input
                  type="password"
                  placeholder="密碼（至少 6 個字元）"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                  className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-foreground"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-foreground text-background font-black rounded-xl py-4 hover:opacity-90 transition-all disabled:opacity-50"
              >
                {loading ? "註冊中..." : "建立帳號"}
              </button>

              <button onClick={() => { setMode("main"); setError(""); }} className="w-full text-sm text-muted-foreground py-2">
                ← 返回
              </button>
            </motion.div>
          )}

        </AnimatePresence>

        <p className="text-xs text-muted-foreground">
          我們只會儲存學習進度，不會分享你的資料
        </p>
      </div>
    </div>
  );
}