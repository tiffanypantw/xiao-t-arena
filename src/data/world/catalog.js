import { isStoryVisible,validateStories } from './model';
import { LEARNING_RESOURCES } from '../learning-resources/catalog';
import { FINANCIAL_CARDS } from '../financial-cards/catalog';
import { isResourcePublished } from '../learning-resources/model';
const modules=import.meta.glob('./EP[0-9][0-9][0-9].json',{eager:true,import:'default'});
export const WORLD_STORIES=Object.values(modules).sort((a,b)=>b.published_date?.localeCompare(a.published_date||'')||a.id.localeCompare(b.id));
const errors=validateStories(WORLD_STORIES);if(errors.length)throw new Error(errors.join('; '));
export function visibleStories(){return WORLD_STORIES.filter(s=>isStoryVisible(s));}
export function findStory(id){return visibleStories().find(s=>s.id===id);}

export function hasStoryResources(story){return !!story.resource_path&&LEARNING_RESOURCES.some(e=>e.episode_id===story.episode_id&&isResourcePublished(e,FINANCIAL_CARDS));}
