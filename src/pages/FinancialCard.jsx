import { useEffect,useRef,useState } from 'react';
import { Link,useParams } from 'react-router-dom';
import CardIslandLayout from '@/components/financial-cards/CardIslandLayout';
import CardFlip from '@/components/financial-cards/CardFlip';
import CardChallenge from '@/components/financial-cards/CardChallenge';
import { useCardCollection } from '@/components/financial-cards/useCardCollection';
import { emitCardEvent } from '@/components/financial-cards/analytics';
import { findVisibleCard } from '@/data/financial-cards/catalog';
import { getResourcePath } from '@/data/learning-resources/model';
import { LEARNING_RESOURCES } from '@/data/learning-resources/catalog';
import { getCardPath } from '@/data/financial-cards/model';
function CardExperience({card}){
 const [flipped,setFlipped]=useState(false);const [shareMessage,setShareMessage]=useState('');const [shareFallback,setShareFallback]=useState('');const counted=useRef(false);
 const {saved,completed,toggleSaved,complete,storageWarning}=useCardCollection();
 useEffect(()=>{if(!counted.current){emitCardEvent('enter_card',card);emitCardEvent('open_concept_card',card,{resource_type:'concept_card'});counted.current=true;}},[card]);
 useEffect(()=>{const previous=document.title;document.title=`${card.episode_id} ${card.title_zh}｜財商牌卡島`;return()=>{document.title=previous;};},[card]);
 async function share(){const url=window.location.origin+getCardPath(card);try{await navigator.clipboard.writeText(url);setShareMessage('牌卡連結已複製，可以分享給家人。');}catch{setShareFallback(url);setShareMessage('請選取下方網址後複製。');}}
 const episode=LEARNING_RESOURCES.find(e=>e.concept_card.card_id===card.card_id);
 return <><nav className="flc-breadcrumb" aria-label="返回探索"><Link to="/card-island" onClick={()=>emitCardEvent('explore_cards',card)}>← 返回牌卡圖鑑</Link><span>{card.episode_id} / {card.card_id}</span></nav>
 <div className="flc-card-layout"><section className="flc-card-stage" aria-label="互動牌卡">{card.status==='demo'&&<span className="flc-demo-badge">測試牌卡 · 非正式發布</span>}<CardFlip card={card} flipped={flipped} onFlip={()=>{const next=!flipped;setFlipped(next);emitCardEvent('flip_card',card,{face:next?'back':'front'});}}/><div className="flc-card-actions"><button onClick={()=>toggleSaved(card.card_id)} aria-pressed={saved.includes(card.card_id)}>{saved.includes(card.card_id)?'✓ 已加入本機收藏':'＋ 加入本機收藏'}</button><button onClick={share}>複製這張牌卡的連結 ↗</button></div><p role="status" className="flc-muted">{shareMessage||storageWarning}</p>{shareFallback&&<input className="flc-share-input" aria-label="可複製的牌卡網址" readOnly value={shareFallback} onFocus={e=>e.target.select()}/>}</section>
 <section className="flc-reading"><p className="flc-eyebrow">{card.category} · {card.episode_id}</p><h1>{card.title_zh}<span>{card.title_en}</span></h1><p className="flc-reading-intro">先翻牌，再想想：這個概念，曾經出現在你的生活裡嗎？</p><div className="flc-readable-copy"><h2>一個概念</h2><p>{card.definition_zh}</p><h2>走進生活</h2><p>{card.example_zh}</p></div><CardChallenge card={card} completed={completed.includes(card.card_id)} onComplete={complete}/></section></div>
 <div className="flc-bottom-explore">{episode&&<Link to={getResourcePath(episode)}>← 返回本集兩份免費資源</Link>}<span>好奇心，可以再多走一步。</span><Link to="/card-island" onClick={()=>emitCardEvent('explore_cards',card)}>探索其他牌卡 →</Link></div></>;
}
export default function FinancialCard(){const {episodeId,slug}=useParams();const card=findVisibleCard(episodeId,slug);return <CardIslandLayout>{card?<CardExperience key={card.card_id} card={card}/>:<section className="flc-empty"><h1>這張牌卡尚未開放，或網址不存在。</h1><p>未發布的牌卡不會透過直接網址開啟。</p><Link to="/card-island">返回牌卡圖鑑 →</Link></section>}</CardIslandLayout>;}
