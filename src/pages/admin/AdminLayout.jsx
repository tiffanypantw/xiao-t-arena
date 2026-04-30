import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 頂部導覽列 */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-black text-slate-900">🧠 後台管理</span>
          <nav className="flex items-center gap-1">
            <NavLink
              to="/admin/quick"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              ⚡ 練習題審核
            </NavLink>
            <NavLink
              to="/admin/deep"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              📋 任務審核
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="text-xs text-slate-500 hover:text-slate-800 border border-slate-200 px-3 py-1.5 rounded-lg transition-all"
          >
            登出
          </button>
        </div>
      </header>

      {/* 主內容區 */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}