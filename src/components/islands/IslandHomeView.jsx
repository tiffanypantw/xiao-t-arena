import { useState } from 'react';
import { ArrowUpRight, BookOpen, ChevronRight, Compass, LogOut, Settings, Trophy } from 'lucide-react';
import WorldMap from './WorldMap';
import { PLACES } from './places';
import './islands.css';

const SOCIALS = [
  ['臉書','https://www.facebook.com/ms.tiffany.finlit/'],
  ['IG','https://www.instagram.com/ms.tiffany.finlit/'],
  ['YouTube','https://www.youtube.com/@Ms.Tiffany.FinLit'],
  ['Podcast','https://reurl.cc/A3DL5Y'],
  ['電子報','https://mstiffanyfinlit.kit.com/wednesday_ai_finlit_live'],
];
export default function IslandHomeView({ name = '同學', brandName = '小 T 財商群島', stats, loading = false, error = false, onNavigate, onLogout, demo = false }) {
  const [selected, setSelected] = useState('academy');
  const place = PLACES.find(p=>p.id===selected) || PLACES[0];
  const next = !loading && !error ? stats?.next : null;
  const nav = (path) => onNavigate(path);
  return <div className="xt-home">
    {demo && <div className="xt-demo-banner">設計預覽 · 使用虛構示範進度，不會登入或讀寫 Firebase</div>}
    <header className="xt-topbar"><a href="/" onClick={e=>{e.preventDefault();nav('/');}} className="xt-wordmark"><span className="xt-logo">t<span>✦</span></span><span>小 T 財商群島<small>一點好奇，一點成長。</small></span></a><div className="xt-user-tools"><span>嗨，{name}！</span><button aria-label="個人資料" onClick={()=>nav('/Profile')}><Settings size={18}/></button><button aria-label={demo?'示範預覽，沒有登入帳號':'登出'} disabled={demo} onClick={onLogout}><LogOut size={16}/><span>登出</span></button></div></header>
    <main className="xt-home-main"><a className="xt-world-entry" href="/">🌏 今天想去哪裡？打開世界地圖，看看新的故事 →</a><section className="xt-welcome"><div><p className="xt-eyebrow">YOUR LITTLE WORLD OF BIG IDEAS</p><h1>歡迎回到你的學習基地<span>今天，想發現什麼新事情？</span></h1><p>練習做選擇，學會用金錢。每一步，都是你的成長。</p></div><div className="xt-passport-ticket"><span>我的成長護照 <BookOpen size={15}/></span><button onClick={()=>nav('/Passport')}><b>{loading||error?'—':stats?.badges??0}</b> 枚徽章 <em>·</em> <b>{loading||error?'—':stats?.cards??0}</b> 張卡片 <ChevronRight size={16}/></button><small>{loading?'正在讀取你的收藏…':error?'暫時無法讀取；到護照重新查看。':'每個收藏，都有你的故事。'}</small></div></section>
    <button className="xt-mobile-continue" onClick={()=>nav(next?.route||'/arena')}><span><small>{next?'接著你的冒險':'從這裡開始'}</small><b>{next?.title||'前往冒險學院'}</b></span><ArrowUpRight size={20}/></button>
    <div className="xt-world-layout"><section aria-label="群島探索"><WorldMap selected={selected} onSelect={setSelected} growth={!loading&&!error&&(stats?.owned??0)>0}/><div className="xt-map-legend"><span><i/> 探索你的 {PLACES.length} 個地方</span><span>你的進度，從原本的學習紀錄接續。</span></div></section>
      <aside className="xt-explore-panel" aria-label="場所清單"><p className="xt-eyebrow">LET'S GO SOMEWHERE</p><h2>下一站，去哪裡？</h2><p className="xt-panel-sub">選一個地方，展開今天的小冒險。</p><div className="xt-destinations">{PLACES.filter(p=>p.id!=='dock').map(p=><button key={p.id} onClick={()=>setSelected(p.id)} aria-pressed={selected===p.id} className={`xt-destination ${selected===p.id?'is-selected':''}`}><span className="xt-destination-icon" style={{'--place-color':p.color}}>{p.number}</span><span><b>{p.name}</b><small>{p.subtitle}</small></span><ChevronRight size={16}/></button>)}</div>
        <div className="xt-place-detail" aria-live="polite"><span className="xt-eyebrow">{place.subtitle}</span><h3>{place.name}</h3><p>{place.description}</p><button className="xt-primary" onClick={()=>nav(place.id==='lab'&&next?next.route:place.route)}>前往{place.name}<ArrowUpRight size={17}/></button></div>
      </aside></div>
    <section className="xt-next-step"><div className="xt-next-symbol"><Compass size={28}/></div><div><p className="xt-eyebrow">ONE LITTLE ADVENTURE</p><h2>{loading?'正在找回你的冒險進度…':error?'準備好，繼續探索。':next?next.title:'一個小挑戰，一次新發現。'}</h2><p>{next?next.label:loading?'請稍候，既有學習紀錄正在載入。':'到冒險學院選擇課程，練習把想法帶進生活。'}</p></div><button className="xt-primary" onClick={()=>nav(next?.route||'/arena')}>{next?'接著挑戰':'前往冒險學院'}<ArrowUpRight size={17}/></button></section>
    <section className="xt-extra-links"><a href="/leaderboard" onClick={e=>{e.preventDefault();nav('/leaderboard');}}><Trophy size={18}/><span><b>冷知識排行榜</b><small>看看大家累積的探索成果</small></span><ChevronRight size={16}/></a><a href="https://www.skool.com/next-gen-finance-7415/about" target="_blank" rel="noopener noreferrer"><BookOpen size={18}/><span><b>財富思維啟航俱樂部</b><small>每週主課 · 前往 Skool</small></span><ArrowUpRight size={16}/></a></section>
    <footer className="xt-footer"><div><b>{brandName}</b><span>goodwhale × tiffany陪孩子學財商</span><button className="xt-classic-link" onClick={()=>nav('/classic')}>回到原版首頁 ↗</button></div><div><span>找到 Tiffany 老師</span>{SOCIALS.map(([label,url])=><a key={label} href={url} target="_blank" rel="noopener noreferrer">{label} ↗</a>)}</div></footer>
    </main>
  </div>;
}
