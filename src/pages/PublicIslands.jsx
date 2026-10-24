import { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import WorldMap from '@/components/islands/WorldMap';
import { PLACES } from '@/components/islands/places';
import CardIslandLayout from '@/components/financial-cards/CardIslandLayout';
import '@/components/islands/islands.css';
export default function PublicIslands(){
 const [selected,setSelected]=useState('financial-cards');const place=PLACES.find(p=>p.id===selected)||PLACES[0];const navigate=useNavigate();
 return <CardIslandLayout><section className="flc-public-world"><p className="flc-eyebrow">XIAO-T ARCHIPELAGO</p><h1>小 T 的學習基地</h1><p>探索世界之後，回到熟悉的課程、金錢生活與收藏。個人功能保留原有登入與課程權限。</p><WorldMap selected={selected} onSelect={setSelected}/><div className="flc-public-selected" aria-live="polite"><h2>{place.name}</h2><p>{place.description}</p><button className="flc-primary" onClick={()=>navigate(place.route)}>前往{place.name} →</button></div><nav className="flc-public-links" aria-label="所有島嶼">{PLACES.map(p=><Link key={p.id} to={p.route}>{p.name}{p.id==='financial-cards'?' · 免登入':''}</Link>)}</nav></section></CardIslandLayout>;
}
