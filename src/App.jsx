import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import Login from '@/pages/Login';
import Home from './pages/Home';
import Passport from './pages/Passport';
import Week1Practice from './pages/Week1Practice';
import Week2Practice from './pages/Week2Practice';
import Week3Practice from './pages/Week3Practice';
import Week4Practice from './pages/Week4Practice';
import VDPractice from './pages/VDPractice';
import QuickChallenge from './pages/QuickChallenge';
import ConceptPractice from './pages/ConceptPractice';
import DailyChallenge from './pages/DailyChallenge';

const AuthenticatedApp = () => {
  const { user, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Passport" element={<Passport />} />
      <Route path="/Week1Practice" element={<Week1Practice />} />
      <Route path="/Week2Practice" element={<Week2Practice />} />
      <Route path="/Week3Practice" element={<Week3Practice />} />
      <Route path="/Week4Practice" element={<Week4Practice />} />
      <Route path="/VDPractice" element={<VDPractice />} />
      <Route path="/QuickChallenge" element={<QuickChallenge />} />
      <Route path="/ConceptPractice" element={<ConceptPractice />} />
      <Route path="/DailyChallenge" element={<DailyChallenge />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;