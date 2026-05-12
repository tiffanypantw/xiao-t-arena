import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import AdminRoute from '@/components/AdminRoute';
import Login from '@/pages/Login';
import Home from './pages/Home';
import Passport from './pages/Passport';
import VDPractice from './pages/VDPractice';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminQuick from './pages/admin/AdminQuick';
import AdminDeep from './pages/admin/AdminDeep';
import AdminDeepDetail from './pages/admin/AdminDeepDetail';
import AdminConversations from './pages/admin/AdminConversations';
import AdminHistory from './pages/admin/AdminHistory';
import WeekLearning from './pages/WeekLearning';
import Profile from './pages/Profile';

const StudentApp = () => {
  const { user, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return <Login />;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Passport" element={<Passport />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/week/:weekNumber" element={<WeekLearning />} />
      <Route path="/VDPractice" element={<VDPractice />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            {/* 後台路由（獨立於學生端，不需要先登入學生帳號）*/}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<div className="text-slate-500 text-sm">請選擇上方的審核功能</div>} />
              <Route path="quick" element={<AdminQuick />} />
              <Route path="deep" element={<AdminDeep />} />
              <Route path="deep/:id" element={<AdminDeepDetail />} />
              <Route path="conversations" element={<AdminConversations />} />
              <Route path="history" element={<AdminHistory />} />
            </Route>

            {/* 學生端路由 */}
            <Route path="/*" element={<StudentApp />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;