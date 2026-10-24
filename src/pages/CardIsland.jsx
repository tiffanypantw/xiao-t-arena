import { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import CardIslandLayout from '@/components/financial-cards/CardIslandLayout';
import { FINANCIAL_CARDS } from '@/data/financial-cards/catalog';
import { getCardPath,isReleased } from '@/data/financial-cards/model';
import { useCardCollection } from '@/components/financial-cards/useCardCollection';
function CardTile({card,saved}){
 const [failed,setFailed]=useState(false);
 return <Link className="flc-tile" to={getCardPath(card)}><span className="flc-tile-art">{card.front_image&&!failed?<img src={card.front_image} alt={`${card.title_zh}牌卡正面`} onError={()=>setFailed(true)}/>:<span className="flc-mini-placeholder"><span>MORE THAN TIFFANY</span><span className="flc-mini-symbol" aria-hidden="true">◇</span><b>{card.title_zh}</b><em>{card.title_en}</em><small>正面圖片待提供</small><span>{card.card_id}</span></span>}</span><span className="flc-tile-meta">{card.episode_id} · {card.status==='demo'?'測試牌卡':'已公開'} {saved?'· 已收藏':''}</span><h3>{card.title_zh}</h3><p>{card.category} <span>翻開探索 ↗</span></p></Link>;
}
export default function CardIsland(){
 useEffect(()=>{const previous=document.title;document.title='財商牌卡島｜More Than Tiffany';return()=>{document.title=previous;};},[]);
 const [query,setQuery]=useState('');const [onlySaved,setOnlySaved]=useState(false);
 const {saved,storageWarning}=useCardCollection();const now=new Date();
 const released=FINANCIAL_CARDS.filter(c=>isReleased(c,now));const demos=FINANCIAL_CARDS.filter(c=>c.status==='demo');
 const match=c=>(!onlySaved||saved.includes(c.card_id))&&[c.title_zh,c.title_en,c.category,c.episode_id].join(' ').toLowerCase().includes(query.toLowerCase().trim());
 return <CardIslandLayout><section className="flc-hero"><p className="flc-eyebrow">FINANCIAL LITERACY CARD ISLAND</p><h1>財商牌卡島<span>一張牌，一個看世界的新角度。</span></h1><p>跟著小 T，把短影音裡的財商詞彙，翻成生活裡的選擇。</p><div className="flc-hero-meta"><span>免登入探索</span><span>70 × 120 mm 比例試作</span><span>30 天系列 · 逐集擴充</span></div></section>
 <div className="flc-toolbar"><label>搜尋牌卡<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="詞彙、分類或 EP 編號"/></label><button className="flc-filter" aria-pressed={onlySaved} onClick={()=>setOnlySaved(!onlySaved)}>{onlySaved?'✓ 我的本機收藏':'查看本機收藏'}</button></div>
 <section className="flc-gallery-section"><div className="flc-section-heading"><h2>已公開牌卡</h2><span>{released.length} 張正式公開</span></div>{released.filter(match).length?<div className="flc-grid">{released.filter(match).map(c=><CardTile key={c.card_id} card={c} saved={saved.includes(c.card_id)}/>)}</div>:<p className="flc-empty">{released.length?'沒有符合條件的牌卡，試試其他關鍵字。':'正式牌卡尚未公開。先到下方測試展區，體驗翻牌與思考挑戰。'}</p>}</section>
 {!!demos.length&&<section className="flc-gallery-section"><div className="flc-section-heading"><h2>測試展區</h2><span>內容與圖像待正式確認</span></div><p className="flc-muted">EP001 是功能測試範例，不代表短影音已發布。正反面圖片尚未提供。</p>{demos.filter(match).length?<div className="flc-grid">{demos.filter(match).map(c=><CardTile key={c.card_id} card={c} saved={saved.includes(c.card_id)}/>)}</div>:<p className="flc-empty">這裡沒有符合條件的測試牌卡。</p>}</section>}
 {storageWarning&&<p role="status">{storageWarning}</p>}<aside className="flc-note"><h2>讓概念，留在生活裡</h2><p>翻一張卡、讀一個例子，再做一道小小的選擇。你的收藏保留在這個瀏覽器，不會加入學習護照或影響課程獎勵。</p><Link to="/islands">返回主群島 →</Link></aside>
 </CardIslandLayout>;
}
