import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { ADMIN_EMAILS } from '@/lib/admin-config';

// 保護後台路由——只有白名單 email 才能進入
export default function AdminRoute({ children }) {
  const { user, isLoadingAuth } = useAuth();

  // 還在確認登入狀態
  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  // 沒登入 → 去登入頁
  if (!user) return <Navigate to="/admin/login" replace />;

  // 不在白名單 → 拒絕
  if (!ADMIN_EMAILS.includes(user.email)) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="text-4xl">🚫</div>
          <p className="font-black text-foreground">你沒有後台權限</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="text-sm text-muted-foreground underline"
          >
            回到首頁
          </button>
        </div>
      </div>
    );
  }

  return children;
}