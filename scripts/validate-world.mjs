import fs from 'node:fs';
import {validateStories} from '../src/data/world/model.js';
import {validateResources} from '../src/data/learning-resources/model.js';
const load=dir=>fs.readdirSync(dir).filter(f=>/^(EP\d{3}|NEWS-\d{8}-\d{2})\.json$/.test(f)).map(f=>JSON.parse(fs.readFileSync(`${dir}/${f}`,'utf8')));
const stories=load('src/data/world'),episodes=load('src/data/learning-resources'),cards=load('src/data/financial-cards');
const errors=[...validateStories(stories),...validateResources(episodes,cards)];
for(const s of stories){if(s.resource_path!==null&&!episodes.some(e=>e.episode_id===s.episode_id&&s.resource_path===`/resources/${e.episode_id.toLowerCase()}`))errors.push(`${s.id}: resource missing`);if(s.image!==null&&(!/^\/learning-resources\/[a-zA-Z0-9/_-]+\.(png|jpg|jpeg|webp)$/.test(s.image||'')||!fs.existsSync('public'+s.image)))errors.push(`${s.id}: image missing`);}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}console.log(`Validated ${stories.length} world story/stories.`);
