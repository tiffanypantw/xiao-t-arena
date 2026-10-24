import { isReleased, taipeiDate, validateCard } from '../financial-cards/model.js';
export const RESOURCE_STATUSES=['draft','preview','published','archived'];
export function getResourcePath(episode){return `/resources/${episode.episode_id.toLowerCase()}`;}
export function isSheetReady(episode){
 const s=episode.exploration_sheet;
 return s?.status==='ready'&&typeof s.asset==='string'&&!!s.asset&&['image','pdf'].includes(s.format);
}
export function isConceptReady(episode,cards,now=new Date()){
 const c=cards.find(card=>card.card_id===episode.concept_card?.card_id);
 return episode.concept_card?.status==='ready'&&!!c&&isReleased(c,now)&&validateCard(c).length===0&&!!c.front_image&&!!c.back_image;
}
export function isResourcePublished(episode,cards,now=new Date()){
 return episode.status==='published'&&!!episode.release_date&&episode.release_date<=taipeiDate(now)&&isSheetReady(episode)&&isConceptReady(episode,cards,now);
}
export function isResourceVisible(episode,cards,now=new Date()){
 return episode.status==='preview'||isResourcePublished(episode,cards,now);
}
export function validateResources(episodes,cards){
 const errors=[];
 const add=(e,m)=>errors.push(`${e.episode_id||'unknown'}: ${m}`);
 for(const e of episodes){
  if(!/^EP\d{3}$/.test(e.episode_id||'')||!e.title_zh||!e.comment_keyword)add(e,'invalid episode metadata');
  if(!RESOURCE_STATUSES.includes(e.status))add(e,'invalid status');
  if(e.release_date!==null&&(!/^\d{4}-\d{2}-\d{2}$/.test(e.release_date)||Number.isNaN(Date.parse(e.release_date+'T00:00:00Z'))||new Date(e.release_date+'T00:00:00Z').toISOString().slice(0,10)!==e.release_date))add(e,'invalid release_date');
  const s=e.exploration_sheet;
  if(!s||!['pending','ready'].includes(s.status)||!s.title_zh)add(e,'invalid exploration_sheet');
  else{
   if(s.asset!==null&&(typeof s.asset!=='string'||!/^\/learning-resources\/[a-zA-Z0-9/_-]+\.(png|jpg|jpeg|webp|pdf)$/.test(s.asset)))add(e,'invalid sheet asset');
   if(s.format!==null&&!['image','pdf'].includes(s.format))add(e,'invalid sheet format');
   if(s.asset&&((s.format==='pdf')!==s.asset.endsWith('.pdf')))add(e,'asset format mismatch');
   if(s.status==='ready'&&!isSheetReady(e))add(e,'ready sheet needs an asset and format');
  }
  const c=cards.find(c=>c.card_id===e.concept_card?.card_id);
  if(!e.concept_card||!['pending','ready'].includes(e.concept_card.status)||!c||c.episode_id!==e.episode_id)add(e,'invalid concept_card reference');
  if(e.concept_card?.status==='ready'&&(!c||c.status!=='published'||validateCard(c).length>0||!c.front_image||!c.back_image))add(e,'ready concept card needs published card and two images');
  if(e.status==='published'&&(!e.release_date||!isSheetReady(e)||e.concept_card?.status!=='ready'||!c||c.status!=='published'||validateCard(c).length>0||!c.release_date||c.release_date>e.release_date||!c.front_image||!c.back_image))add(e,'both resources must be ready before publication');
 }
 if(new Set(episodes.map(e=>e.episode_id)).size!==episodes.length)errors.push('Duplicate resource episode_id');
 return errors;
}
