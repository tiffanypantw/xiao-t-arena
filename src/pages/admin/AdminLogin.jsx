import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { ADMIN_EMAILS } from '@/lib/admin-config';

export default function AdminLogin() {
  const { user, loginWithGoogle, isLoadingAuth } = useAuth();
  const navigate = useNavigate();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');
  const handleGoogleLogin = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);setGoogleError('');
    try {
      const result = await loginWithGoogle();
      if (!result.success) setGoogleError(result.error);
    } catch { setGoogleError('Google 登入暫時無法完成，請稍後重試。'); }
    finally { setGoogleLoading(false); }
  };

  // 已登入且有權限 → 直接進後台
  useEffect(() => {
    if (user && ADMIN_EMAILS.includes(user.email)) {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 w-full max-w-sm space-y-6 text-center">
        <div>
          <div className="text-3xl mb-2">🧠</div>
          <h1 className="text-lg font-black text-slate-900">小T競技場後台</h1>
          <p className="text-sm text-slate-500 mt-1">僅限管理員登入</p>
        </div>

        {user && !ADMIN_EMAILS.includes(user.email) && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-sm text-red-600">
              {user.email} 沒有後台權限
            </p>
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          aria-busy={googleLoading}
          className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white font-bold rounded-xl py-3 hover:opacity-90 transition-all"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
          {googleLoading ? "正在開啟 Google 登入…" : "用 Google 帳號登入"}
        </button>

        {googleError && <p role="alert" className="text-sm text-red-700 leading-relaxed">{googleError}</p>}

        <a href="/" className="block text-xs text-slate-400 hover:text-slate-600">
          回到學生頁面
        </a>
      </div>
    </div>
  );
}