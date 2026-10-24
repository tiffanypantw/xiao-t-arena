import LearningRoadClassic from './LearningRoadClassic';
import { BRAND } from '@/lib/firebase';
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/lib/AuthContext";
import { useWeeks } from "@/lib/hooks/useContent";
import { hasThemeAccess } from "@/api/arenaAccess";
import { getRoadTheme } from "@/data/roadThemes";
import LearningRoadView from "@/components/islands/LearningRoadView";

function LearningRoadIslands() {
  const navigate = useNavigate();
  const { themeId } = useParams();
  const { userData } = useAuth();
  const theme = getRoadTheme(themeId);
  const { data: allWeeks = [], isLoading, isError, refetch } = useWeeks();
  const bandPath = theme?.bandId ? `/arena/band/${theme.bandId}` : "/arena";
  const bandLabel = theme?.band || "冒險學院";
  const allowed = !!userData && hasThemeAccess(userData, themeId);
  useEffect(() => {
    if (userData && !hasThemeAccess(userData, themeId)) navigate(bandPath);
  }, [userData, themeId, navigate, bandPath]);
  const collection = userData?.collection || {};
  const weekDocs = {};
  allWeeks.forEach(w => { weekDocs[w.weekNumber] = w; });
  // 算每一關的狀態
  const statusOf = (w, i) => {
    if (w.mystery || !w.weekNumber) return "mystery";
    const doc = weekDocs[w.weekNumber];
    const published = !!doc && doc.published !== false;
    if (!published) return "mystery"; // 已寫進系統但還沒發佈 → 對學生就是還沒公開
    const done = w.badgeId ? !!collection[w.badgeId] : false;
    if (done) return "done";
    const prev = theme.weeks[i - 1];
    const prevDone = i === 0 ? true : prev?.badgeId ? !!collection[prev.badgeId] : false;
    return prevDone ? "playable" : "waiting";
  };

  return <div className="min-h-screen bg-background"><div className="max-w-2xl mx-auto px-4 py-6">
    <PageHeader backTo={bandPath} backLabel={bandLabel}/>
    {!theme ? <p className="py-10 text-center">找不到這條冒險航線。</p> :
      !allowed || isLoading ? <p className="py-10 text-center" role="status">正在確認課程與進度…</p> :
      isError ? <div className="py-10 text-center" role="alert"><p>暫時無法讀取關卡，進度並未重設。</p><button className="xt-primary mx-auto mt-4" onClick={()=>refetch()}>重新讀取</button></div> :
      <LearningRoadView theme={theme} statuses={theme.weeks.map(statusOf)} onStart={n=>navigate(`/week/${n}`)}/>
    }
  </div></div>;
}

export default function LearningRoad(){ return BRAND === 'tiffany' ? <LearningRoadIslands/> : <LearningRoadClassic/>; }
