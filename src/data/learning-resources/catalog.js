import { FINANCIAL_CARDS } from '../financial-cards/catalog';
import { validateResources,isResourceVisible } from './model';
const modules=import.meta.glob('./EP[0-9][0-9][0-9].json',{eager:true,import:'default'});
export const LEARNING_RESOURCES=Object.values(modules).sort((a,b)=>a.episode_id.localeCompare(b.episode_id));
const errors=validateResources(LEARNING_RESOURCES,FINANCIAL_CARDS);
if(errors.length)throw new Error(errors.join('; '));
export function findResource(episodeId){return LEARNING_RESOURCES.find(e=>e.episode_id.toLowerCase()===episodeId?.toLowerCase()&&isResourceVisible(e,FINANCIAL_CARDS));}
