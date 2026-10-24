import { useEffect,useRef,useState } from 'react';
import { Link,useParams } from 'react-router-dom';
import CardIslandLayout from '@/components/financial-cards/CardIslandLayout';
import { emitCardEvent } from '@/components/financial-cards/analytics';
import { findResource } from '@/data/learning-resources/catalog';
import { getResourcePath,isSheetReady } from '@/data/learning-resources/model';
import '@/components/financial-cards/resources.css';
export default function ExplorationSheet(){
 const {episodeId}=useParams();const episode=findResource(episodeId);const counted=useRef(false);const [failed,setFailed]=useState(false);
 const ready=!!episode&&isSheetReady(episode);const sheet=episode?.exploration_sheet;
 useEffect(()=>{if(ready&&!counted.current){emitCardEvent('open_exploration_sheet',episode,{resource_type:'exploration_sheet'});counted.current=true;}},[episode,ready]);
 return <CardIslandLayout><section className="flr-sheet-view"><nav className="flc-breadcrumb"><Link to={episode?getResourcePath(episode):'/resources'}>← 返回本集資源</Link></nav><p className="flc-eyebrow">EXPLORATION SHEET · {episode?.episode_id}</p><h1>{sheet?.title_zh||'學習探索單'}</h1>{!ready?<div className="flc-empty"><p>探索單檔案尚未匯入，目前無法開啟、下載或列印。</p><p>檔案備妥後，會出現在同一個資源頁。</p></div>:<><div className="flr-sheet-actions"><a href={sheet.asset} target="_blank" rel="noopener noreferrer">開啟原始{sheet.format==='pdf'?' PDF':'圖片'} ↗</a><a href={sheet.asset} download>儲存探索單 ↓</a>{sheet.format==='image'?<button disabled={failed} onClick={()=>window.print()}>列印這一頁</button>:<a href={sheet.asset} target="_blank" rel="noopener noreferrer">開啟 PDF 後列印 ↗</a>}</div><p className="flc-muted">手機若未直接下載，可開啟原檔，再使用瀏覽器的儲存、分享或列印功能。</p>{sheet.format==='image'?(failed?<p role="alert" className="flc-empty">圖片暫時無法載入，請稍後重試或返回本集資源。</p>:<img className="flr-sheet-image" src={sheet.asset} alt={`${episode.episode_id} ${sheet.title_zh}`} onError={()=>setFailed(true)}/>):<div className="flr-pdf"><object data={sheet.asset} type="application/pdf" aria-label={sheet.title_zh}><p>瀏覽器未支援內嵌 PDF，請使用上方「開啟原始 PDF」。</p></object><p>若預覽空白，請開啟原始 PDF 閱讀、儲存或列印。</p></div>}</>}</section></CardIslandLayout>;
}
