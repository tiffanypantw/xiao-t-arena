import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MoneyMission, {MissionDirectory} from '@/pages/MoneyMissions';
import LocaleMetadata from '@/components/missions/LocaleMetadata';
import CardIsland from '@/pages/CardIsland';
import FinancialCard from '@/pages/FinancialCard';
import PublicIslands from '@/pages/PublicIslands';
import EpisodeResources, { ResourceIndex } from '@/pages/EpisodeResources';
import ExplorationSheet from '@/pages/ExplorationSheet';
import WorldExplorer from '@/pages/WorldExplorer';
import WorldStory from '@/pages/WorldStory';
// Public card routes never mount Firebase auth, brand settings, or student-data providers.
const ArenaApplication = lazy(() => import('./ArenaApplication'));
export default function App(){return <BrowserRouter><LocaleMetadata/><Routes>
 <Route path="/en" element={<MissionDirectory home/>}/>
 <Route path="/en/missions" element={<MissionDirectory/>}/>
 <Route path="/en/*" element={<MissionDirectory/>}/>
 <Route path="/en/missions/:missionId" element={<MoneyMission/>}/>
 <Route path="/missions" element={<MissionDirectory locale="zh-TW"/>}/>
 <Route path="/missions/:missionSlug" element={<MoneyMission locale="zh-TW"/>}/>
 <Route path="/" element={<WorldExplorer/>}/>
 <Route path="/world" element={<WorldExplorer/>}/>
 <Route path="/world/:storyId" element={<WorldStory/>}/>
 <Route path="/resources" element={<ResourceIndex/>}/>
 <Route path="/resources/:episodeId" element={<EpisodeResources/>}/>
 <Route path="/resources/:episodeId/exploration-sheet" element={<ExplorationSheet/>}/>
 <Route path="/card-island/ep001/opportunity-cost" element={<Navigate replace to="/resources/ep001"/>}/>
 <Route path="/islands" element={<PublicIslands/>}/>
 <Route path="/card-island" element={<CardIsland/>}/>
 <Route path="/card-island/:episodeId/:slug" element={<FinancialCard/>}/>
 <Route path="/*" element={<Suspense fallback={<p role="status" className="p-8 text-center">正在載入小 T…</p>}><ArenaApplication/></Suspense>}/>
</Routes></BrowserRouter>;}
