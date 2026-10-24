import { useEffect,useRef,useState } from 'react';
import { Link,useParams } from 'react-router-dom';
import CardIslandLayout from '@/components/financial-cards/CardIslandLayout';
import { emitCardEvent } from '@/components/financial-cards/analytics';
import { FINANCIAL_CARDS } from '@/data/financial-cards/catalog';
import { getCardPath } from '@/data/financial-cards/model';
import { findResource,LEARNING_RESOURCES } from '@/data/learning-resources/catalog';
import { getResourcePath,isConceptReady,isResourcePublished,isResourceVisible,isSheetReady } from '@/data/learning-resources/model';
import '@/components/financial-cards/resources.css';
export function ResourceIndex(){
 const list=LEARNING_RESOURCES.filter(e=>isResourceVisible(e,FINANCIAL_CARDS));
 return <CardIslandLayout><section className="flc-hero"><p className="flc-eyebrow">XIAO-T WORLD · FREE LEARNING RESOURCES</p><h1>每集免費學習資源<span>一集故事，兩種探索方法。</span></h1><p>學習探索單可以儲存、列印；數位牌卡可以翻閱。兩份教材各自開啟，不需學生帳號。</p></section><div className="flr-episode-list">{list.map(e=><Link key={e.episode_id} to={getResourcePath(e)}><span>{e.episode_id} · {isResourcePublished(e,FINANCIAL_CARDS)?'已公開':'準備中 · 尚未正式公開'}</span><h2>{e.title_zh}</h2><p>留言關鍵字：{e.comment_keyword}　→</p></Link>)}</div></CardIslandLayout>;
}
function ResourcePage({episode}){
 const card=FINANCIAL_CARDS.find(c=>c.card_id===episode.concept_card.card_id);
 const sheetReady=isSheetReady(episode),cardReady=isConceptReady(episode,FINANCIAL_CARDS),published=isResourcePublished(episode,FINANCIAL_CARDS);
 const [copied,setCopied]=useState('');const [fallback,setFallback]=useState('');const counted=useRef(false);
 useEffect(()=>{if(!counted.current){emitCardEvent('enter_resource_page',episode);counted.current=true;}const before=document.title;document.title=`${episode.episode_id} ${episode.title_zh}｜免費學習資源`;return()=>{document.title=before;};},[episode]);

 async function share(){const url=window.location.origin+getResourcePath(episode);try{await navigator.clipboard.writeText(url);setCopied('本集資源頁連結已複製，可貼入 ManyChat。');}catch{setFallback(url);setCopied('請選取下方連結後複製。');}}
 return <><nav className="flc-breadcrumb"><Link to="/resources">← 所有免費資源</Link><span>{episode.episode_id}</span></nav><section className="flc-hero flr-hero"><p className="flc-eyebrow">小 T 帶你看世界 · {episode.episode_id}</p><span className={`flr-status ${published?'is-ready':''}`}>{published?'兩項資源已公開':'準備中 · 尚未正式公開'}</span><h1>{episode.title_zh}</h1><p>同一個主題，兩份獨立教材。選擇適合今天的探索方式。</p><div className="flc-hero-meta"><span>免費 · 免學生登入</span><span>留言關鍵字：{episode.comment_keyword}</span></div></section>
 {!published&&<aside className="flr-pending" role="status">本集探索單與正式牌卡尚未全部備妥，這是準備中的資源頁，不代表教材已正式發布。</aside>}
 <div className="flr-resource-grid"><article className="flr-resource"><div className="flr-resource-number">01 <span>OPEN · SAVE · PRINT</span></div><p className="flc-eyebrow">EXPLORATION SHEET</p><h2>學習探索單</h2><h3>{episode.exploration_sheet.title_zh}</h3><p>{episode.exploration_sheet.description_zh}</p><div className="flr-format-placeholder" aria-hidden="true"><span>一頁探索單</span><b>{sheetReady?(episode.exploration_sheet.format==='pdf'?'PDF':'IMAGE'):'檔案待匯入'}</b></div>{sheetReady?<Link className="flc-primary" to={getResourcePath(episode)+'/exploration-sheet'}>開啟探索單 · 儲存與列印 →</Link>:<button className="flc-primary" disabled>探索單準備中</button>}<small>一頁圖片或 PDF · 與數位牌卡分開提供</small></article>
 <article className="flr-resource"><div className="flr-resource-number">02 <span>FLIP · READ · THINK</span></div><p className="flc-eyebrow">CONCEPT CARD</p><h2>數位財商牌卡</h2><h3>{episode.concept_card.title_zh} <span>{episode.concept_card.title_en}</span></h3><p>正面看中英文詞彙與插畫，翻到背面讀簡單定義與生活例子。</p><div className="flr-card-placeholder" aria-hidden="true"><span>{episode.episode_id}</span><b>{episode.concept_card.title_zh}</b><em>{episode.concept_card.title_en}</em><small>{cardReady?'正反面牌卡':'正式正反面圖片與內容待匯入'}</small></div>{cardReady?<Link className="flc-primary" to={getCardPath(card)}>開啟數位牌卡 · 正反翻閱 →</Link>:<><button className="flc-primary" disabled>正式牌卡準備中</button>{card.status==='demo'&&<Link className="flr-preview-link" to={getCardPath(card)}>查看翻牌版型示意（非正式教材） ↗</Link>}</>}<small>獨立數位牌卡 · 不是探索單 PDF</small></article></div>
 <section className="flr-share"><div><h2>把本集留給下一次親子對話</h2><p>每一集有固定資源網址；兩項教材備妥後，仍使用同一條連結。</p></div><button onClick={share}>複製本集資源連結 ↗</button></section><p className="flc-muted" role="status">{copied}</p>{fallback&&<input className="flc-share-input" readOnly aria-label="本集分享網址" value={fallback} onFocus={e=>e.target.select()}/>}
 </>;
}
export default function EpisodeResources(){const {episodeId}=useParams();const episode=findResource(episodeId);return <CardIslandLayout>{episode?<ResourcePage key={episode.episode_id} episode={episode}/>:<div className="flc-empty"><h1>這集資源尚未開放，或網址不存在。</h1><Link to="/resources">返回免費資源列表 →</Link></div>}</CardIslandLayout>;}
