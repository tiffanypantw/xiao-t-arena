import { useId, useState } from 'react';
import { CARD_COPYRIGHT, CARD_RATIO } from '@/data/financial-cards/model';
function ImageFace({src,alt,children,card}){
 const [failed,setFailed]=useState(false);
 return src&&!failed?<><img className="flc-artwork" src={src} alt={alt} onError={()=>setFailed(true)}/><span className="flc-image-brand-strip">{card.card_id} · More Than Tiffany<small>{CARD_COPYRIGHT}</small></span></>:<>{children}<span className="flc-placeholder-label">{src?'圖片載入失敗 · 暫用示意排版':'圖片尚未提供 · 示意排版'}</span></>;
}
export default function CardFlip({card,flipped,onFlip}){
 const description=useId();
 return <div className="flc-flip-wrap">
  <button type="button" className={`flc-flip ${flipped?'is-flipped':''}`} style={{aspectRatio:CARD_RATIO}} aria-pressed={flipped} aria-label={`${card.title_zh}，目前為${flipped?'背面':'正面'}；點擊翻至${flipped?'正面':'背面'}`} aria-describedby={description} onClick={onFlip}>
   <span className="flc-rotor">
    <span className="flc-face flc-front" aria-hidden={flipped} inert={flipped?'':undefined}>
     <ImageFace key={card.card_id+'front'} card={card} src={card.front_image} alt={`${card.title_zh}牌卡正面`}>
      <span className="flc-card-top">MORE THAN TIFFANY <span>{card.episode_id}</span></span>
      <span className="flc-card-number">{card.card_id}</span>
      <span className="flc-symbol" aria-hidden="true"><svg viewBox="0 0 140 140" fill="none"><path d="M70 21v91M38 115h64M25 49h90M40 49L23 85h34L40 49Zm60 0L83 85h34l-17-36Z" stroke="currentColor" strokeWidth="1.4"/><circle cx="70" cy="28" r="6" stroke="currentColor"/><path d="M25 86q15 20 32 0m26 0q15 20 34 0" stroke="currentColor"/></svg><small>象徵插畫待提供</small></span>
      <span className="flc-front-title">{card.title_zh}</span><span className="flc-front-en">{card.title_en}</span>
      <span className="flc-card-category">{card.category}</span><span className="flc-card-brand">More Than Tiffany</span><span className="flc-copyright">{CARD_COPYRIGHT}</span>
     </ImageFace>
    </span>
    <span className="flc-face flc-back" aria-hidden={!flipped} inert={!flipped?'':undefined}>
     <ImageFace key={card.card_id+'back'} card={card} src={card.back_image} alt={`${card.title_zh}牌卡背面`}>
      <span className="flc-card-top">MORE THAN TIFFANY <span>{card.episode_id}</span></span><span className="flc-back-title">{card.title_zh}</span><span className="flc-back-en">{card.title_en}</span>
      <span className="flc-back-copy"><b>一個概念</b><span>{card.definition_zh}</span><b>走進生活</b><span>{card.example_zh}</span>{card.challenge&&<><b>想一想</b><span>{card.challenge.prompt}</span></>}</span>
      <span className="flc-card-brand">{card.card_id} · More Than Tiffany</span><span className="flc-copyright">{CARD_COPYRIGHT}</span>
     </ImageFace>
    </span>
   </span>
  </button>
  <p id={description} className="flc-flip-hint">{flipped?'背面 · 再翻回正面':'正面 · 輕觸翻牌'}<span>也可使用 Tab 選取，按 Enter 或空白鍵翻牌</span></p>
 </div>;
}
