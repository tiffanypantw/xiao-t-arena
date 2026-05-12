/**
 * BrandContext — 提供整個 app 「當前 brand 的設定」
 *
 * 從 Firestore `brandSettings/main` 讀取一次（cache 在 context 裡）。
 * Auth loaded 之後才會 fetch，避免 unauthenticated request 被 rules 擋。
 * 用法：
 *   const brand = useBrand();
 *   brand.brandName       // "小T 競技場"
 *   brand.themeColor      // "#7c3aed"
 *   brand.features.showRedeemCodes  // true / false
 *   brand.encouragementMessages.quiz // [...]
 */

import { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";

const BrandContext = createContext(null);

export function BrandProvider({ children }) {
  const { user, isLoadingAuth } = useAuth();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 等 auth ready，避免 rules 擋未登入的 read
    if (isLoadingAuth) return;
    if (!user) {
      // 未登入時不 fetch（Login 頁也用不到 brand 細節，只用 hardcoded fallback）
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "brandSettings", "main"));
        if (cancelled) return;
        if (snap.exists()) {
          setBrand(snap.data());
        } else {
          setError("brandSettings/main not found in Firestore — did you run M1.6 migration?");
        }
      } catch (e) {
        if (!cancelled) setError(e.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [user, isLoadingAuth]);

  if (isLoadingAuth || loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center space-y-3 max-w-md p-6">
          <div className="text-4xl">⚠️</div>
          <p className="font-black text-foreground">Brand settings 載入失敗</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>;
}

export function useBrand() {
  return useContext(BrandContext);
}
