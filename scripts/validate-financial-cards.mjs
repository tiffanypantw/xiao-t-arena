import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateResources} from '../src/data/learning-resources/model.js';
import {validateCatalog} from '../src/data/financial-cards/model.js';
const root=fileURLToPath(new URL('../',import.meta.url));
const directory=path.join(root,'src/data/financial-cards');
const files=fs.readdirSync(directory).filter(n=>/^EP\d{3}\.json$/.test(n));
const cards=files.map(n=>JSON.parse(fs.readFileSync(path.join(directory,n),'utf8')));
const errors=validateCatalog(cards);
for(const card of cards){
 for(const field of ['front_image','back_image']){
  if(card[field]&&!fs.existsSync(path.join(root,'public',card[field].slice(1))))errors.push(`${card.card_id}: missing asset ${field}`);
 }
 if(['published','scheduled'].includes(card.status)&&(!card.front_image||!card.back_image))errors.push(`${card.card_id}: supply both images before publication`);
}
const resourceDir=path.join(root,'src/data/learning-resources');
const episodes=fs.readdirSync(resourceDir).filter(n=>/^EP\d{3}\.json$/.test(n)).map(n=>JSON.parse(fs.readFileSync(path.join(resourceDir,n),'utf8')));
errors.push(...validateResources(episodes,cards));
for(const episode of episodes){
 const asset=episode.exploration_sheet?.asset;
 if(asset&&!fs.existsSync(path.join(root,'public',asset.slice(1))))errors.push(`${episode.episode_id}: missing exploration sheet file`);
}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`Validated ${cards.length} card(s) and ${episodes.length} episode resource page(s). Demo placeholders are explicit; published/scheduled assets must exist.`);
