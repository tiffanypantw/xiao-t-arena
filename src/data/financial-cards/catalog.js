import { validateCatalog, isDiscoverable } from './model';
const modules=import.meta.glob('./EP[0-9][0-9][0-9].json',{eager:true,import:'default'});
export const FINANCIAL_CARDS=Object.values(modules).sort((a,b)=>a.episode_id.localeCompare(b.episode_id));
const errors=validateCatalog(FINANCIAL_CARDS);
if(errors.length)throw new Error(`Invalid financial card catalog: ${errors.join('; ')}`);
export function findVisibleCard(episode,slug,now=new Date()){
 return FINANCIAL_CARDS.find(c=>c.episode_id.toLowerCase()===episode?.toLowerCase()&&c.slug===slug&&isDiscoverable(c,now));
}
