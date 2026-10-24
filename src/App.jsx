import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CardIsland from '@/pages/CardIsland';
import FinancialCard from '@/pages/FinancialCard';
import PublicIslands from '@/pages/PublicIslands';
// Public card routes never mount Firebase auth, brand settings, or student-data providers.
const ArenaApplication = lazy(() => import('./ArenaApplication'));
export default function App(){return <BrowserRouter><Routes>
 <Route path="/islands" element={<PublicIslands/>}/>
 <Route path="/card-island" element={<CardIsland/>}/>
 <Route path="/card-island/:episodeId/:slug" element={<FinancialCard/>}/>
 <Route path="/*" element={<Suspense fallback={<p role="status" className="p-8 text-center">正在載入小 T…</p>}><ArenaApplication/></Suspense>}/>
</Routes></BrowserRouter>;}
