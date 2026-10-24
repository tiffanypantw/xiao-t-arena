import HomeClassic from './HomeClassic';
import { BRAND } from '@/lib/firebase';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useBrand } from '@/lib/BrandContext';
import { useWeeks, useRewards } from '@/lib/hooks/useContent';
import { hasThemeAccess } from '@/api/arenaAccess';
import { ROAD_THEMES } from '@/data/roadThemes';
import IslandHomeView from '@/components/islands/IslandHomeView';
import { deriveIslandProgress } from '@/components/islands/progress';

function IslandsHome() {
  const navigate = useNavigate();
  const { user, userData, logout, refreshUserData } = useAuth();
  const brand = useBrand();
  const weeks = useWeeks();
  const rewards = useRewards();
  const refreshRef = useRef(refreshUserData);
  refreshRef.current = refreshUserData;
  const [refreshing, setRefreshing] = useState(true);
  const [refreshFailed, setRefreshFailed] = useState(false);
  // Re-read the existing user document on return; this does not award or save anything.
  useEffect(() => {
    let cancelled = false;
    setRefreshing(true);setRefreshFailed(false);
    Promise.resolve().then(()=>refreshRef.current()).catch(()=>{if(!cancelled)setRefreshFailed(true);}).finally(()=>{if(!cancelled)setRefreshing(false);});
    return () => {cancelled=true;};
  }, [user?.uid]);
  const access = Object.fromEntries([...Object.keys(ROAD_THEMES),'l1-season1'].map(id=>[id,hasThemeAccess(userData,id)]));
  const stats = deriveIslandProgress({collection:userData?.collection, weeks:weeks.data, rewards:rewards.data, roads:ROAD_THEMES, access, latestAvailableWeek:brand?.latestAvailableWeek??0});
  return <IslandHomeView name={userData?.displayName?.split(' ')[0]||'同學'} brandName={brand?.brandFullName||brand?.brandName||'小 T 財商群島'} stats={stats} loading={refreshing||!userData||weeks.isLoading||rewards.isLoading} error={refreshFailed||weeks.isError||rewards.isError} onNavigate={navigate} onLogout={logout}/>;
}

export default function Home(){ return BRAND === 'tiffany' ? <IslandsHome/> : <HomeClassic/>; }
