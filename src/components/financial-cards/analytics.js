// Extension point only. No SDK, cookies, visitor IDs, network calls, or persisted events.
const names=new Set(['enter_card','flip_card','start_challenge','complete_challenge','explore_cards']);
let adapter=null;
export function setCardAnalyticsAdapter(next){adapter=typeof next==='function'?next:null;}
export function cardAnalyticsEnabled(){return adapter!==null;}
export function emitCardEvent(name,card,extra={}){
 if(!adapter||!names.has(name))return false;
 const payload={event:name,episode_id:card?.episode_id||null,card_id:card?.card_id||null};
 if(extra.face==='front'||extra.face==='back')payload.face=extra.face;
 try{adapter(payload);return true;}catch{return false;}
}
