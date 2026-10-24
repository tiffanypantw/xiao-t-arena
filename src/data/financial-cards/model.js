export const CARD_RATIO = '70 / 120'; // Working physical format, 70 × 120 mm; not final print artwork.
export const CARD_COPYRIGHT = '© 2026 More Than Tiffany. All Rights Reserved.';
export const CARD_STATUSES = ['draft', 'demo', 'scheduled', 'published', 'archived'];
const required=['episode_id','card_id','slug','category','card_type','title_zh','title_en','definition_zh','example_zh','challenge','front_image','back_image','release_date','status'];
export function taipeiDate(now=new Date()) {
 return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
}
export function validateCard(card) {
 const errors=[];
 for(const key of required) if(!Object.hasOwn(card,key)) errors.push(`Missing ${key}`);
 for(const key of ['episode_id','card_id','slug','category','card_type','title_zh','title_en','definition_zh','example_zh']) if(typeof card[key]!=='string'||!card[key].trim())errors.push(`Invalid ${key}`);
 if(!/^EP\d{3}$/.test(card.episode_id||'')) errors.push('Invalid episode_id');
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.slug||'')) errors.push('Invalid slug');
 if(!CARD_STATUSES.includes(card.status))errors.push('Invalid status');
 const date=card.release_date;
 if(date!==null&&(!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(Date.parse(date+'T00:00:00Z'))||new Date(date+'T00:00:00Z').toISOString().slice(0,10)!==date))errors.push('Invalid release_date');
 if(['published','scheduled'].includes(card.status)&&!date)errors.push('Release date required');
 for(const key of ['front_image','back_image'])if(card[key]!==null&&(typeof card[key]!=='string'||!/^\/financial-cards\/[a-zA-Z0-9/_-]+\.(webp|png|jpg|jpeg|svg)$/.test(card[key])))errors.push(`Invalid ${key}`);
 if(card.challenge!==null){
  const c=card.challenge;
  if(!c||typeof c.prompt!=='string'||!Array.isArray(c.options)||c.options.length<2||!c.options.some(o=>o.id===c.correct_option_id)||!c.explanation)errors.push('Invalid challenge');
  else if(new Set(c.options.map(o=>o.id)).size!==c.options.length||c.options.some(o=>!o.id||!o.text))errors.push('Invalid challenge options');
 }
 return errors;
}
export function validateCatalog(cards){
 const errors=cards.flatMap(c=>validateCard(c).map(e=>`${c.card_id||'unknown'}: ${e}`));
 for(const key of ['episode_id','card_id','slug'])if(new Set(cards.map(c=>c[key])).size!==cards.length)errors.push(`Duplicate ${key}`);
 return errors;
}
export function isReleased(card,now=new Date()){
 return card.status==='published'&&!!card.release_date&&card.release_date<=taipeiDate(now);
}
export function isDiscoverable(card,now=new Date()){return card.status==='demo'||isReleased(card,now);}
export function getCardPath(card){return `/card-island/${card.episode_id.toLowerCase()}/${card.slug}`;}
