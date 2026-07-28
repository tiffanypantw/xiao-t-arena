import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { BrandProvider } from '@/lib/BrandContext';
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
import AdminContent from './pages/admin/AdminContent';
import AdminContentEdit from './pages/admin/AdminContentEdit';
import AdminCodes from './pages/admin/AdminCodes';
import AdminUploadW7 from './pages/admin/AdminUploadW7';
import AdminUploadW8 from './pages/admin/AdminUploadW8';
import AdminUploadW9 from './pages/admin/AdminUploadW9';
import AdminUploadW10 from './pages/admin/AdminUploadW10';
import AdminUploadW11 from './pages/admin/AdminUploadW11';
import AdminUploadL1S1W1 from './pages/admin/AdminUploadL1S1W1';
import AdminUploadL1S1W2 from './pages/admin/AdminUploadL1S1W2';
import AdminUploadL2S1W1 from './pages/admin/AdminUploadL2S1W1';
import AdminUploadL3S1W1 from './pages/admin/AdminUploadL3S1W1';
import WeekLearning from './pages/WeekLearning';
import Profile from './pages/Profile';
import MoneyJars from './pages/MoneyJars';
import ArenaPractice from './pages/ArenaPractice';
import ArenaBands from './pages/ArenaBands';
import ArenaThemes from './pages/ArenaThemes';
import LearningRoad from './pages/LearningRoad';
import StopBeforeBuying from './pages/StopBeforeBuying';
import Trivia from './pages/Trivia';
import Leaderboard from './pages/Leaderboard';

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
      <Route path="/money" element={<MoneyJars />} />
      <Route path="/arena" element={<ArenaBands />} />
      <Route path="/arena/band/:bandId" element={<ArenaThemes />} />
      <Route path="/arena/weeks" element={<ArenaPractice />} />
      <Route path="/arena/road/:themeId" element={<LearningRoad />} />
      <Route path="/stop" element={<StopBeforeBuying />} />
      <Route path="/trivia" element={<Trivia />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrandProvider>
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
              <Route path="content" element={<AdminContent />} />
              <Route path="content/:weekNumber" element={<AdminContentEdit />} />
              <Route path="codes" element={<AdminCodes />} />
              <Route path="upload-w7" element={<AdminUploadW7 />} />
              <Route path="upload-w8" element={<AdminUploadW8 />} />
              <Route path="upload-w9" element={<AdminUploadW9 />} />
              <Route path="upload-w10" element={<AdminUploadW10 />} />
              <Route path="upload-w11" element={<AdminUploadW11 />} />
              <Route path="upload-l1s1-w1" element={<AdminUploadL1S1W1 />} />
              <Route path="upload-l1s1-w2" element={<AdminUploadL1S1W2 />} />
              <Route path="upload-l2s1-w1" element={<AdminUploadL2S1W1 />} />
              <Route path="upload-l3s1-w1" element={<AdminUploadL3S1W1 />} />
            </Route>

            {/* 學生端路由 */}
            <Route path="/*" element={<StudentApp />} />
          </Routes>
          </Router>
          <Toaster />
        </QueryClientProvider>
      </BrandProvider>
    </AuthProvider>
  );
}

export default App;