// Separate Vite development entry. Never imports AuthContext or Firebase.
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import IslandHomeView from '../components/islands/IslandHomeView';
import LearningRoadView from '../components/islands/LearningRoadView';
import { ROAD_THEMES } from '../data/roadThemes';
import './preview.css';

function Preview(){
  const [route,setRoute]=useState('/');
  const [message,setMessage]=useState('');
  const theme=ROAD_THEMES['l1-g1'];
  const navigate=path=>{setMessage('');setRoute(path);window.scrollTo(0,0);};
  if(route==='/')return <IslandHomeView name="小小探索家" demo stats={{badges:3,cards:2,learned:3,owned:5,next:{route:'/arena',title:'購物車守門員',label:'我的零用錢，我作主 · 示範'}}} onNavigate={navigate} onLogout={()=>setMessage('示範預覽沒有登入帳號。')}/>;
  return <div className="xt-student-shell"><div className="xt-demo-banner">設計預覽 · 所有紀錄皆為虛構，不連接 Firebase</div><header className="xt-shell-bar"><button onClick={()=>navigate('/')}>← 回到群島</button><span>此頁僅供設計驗收</span></header><main className="max-w-2xl mx-auto p-5">
    {route==='/arena'?<LearningRoadView theme={theme} statuses={theme.weeks.map((w,i)=>i===0?'done':i===1?'playable':w.mystery?'mystery':'waiting')} onStart={n=>setMessage(`這會開啟既有的 /week/${n}。預覽不提交答案或寫入進度。`)}/>:<section className="xt-road-intro"><h1 className="text-xl font-bold">原有功能入口</h1><p className="my-4">正式整合會開啟原有頁面：{route}。這個獨立預覽沒有讀取學生資料。</p><button className="xt-primary" onClick={()=>navigate('/arena')}>看看冒險航線</button></section>}
    {message&&<p className="xt-place-detail" role="status">{message}</p>}
  </main></div>;
}
createRoot(document.getElementById('root')).render(<Preview/>);
