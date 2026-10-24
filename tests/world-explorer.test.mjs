import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {dailyNews,isStoryVisible,validateStories,worldPoint,storyPath} from '../src/data/world/model.js';
const story=JSON.parse(fs.readFileSync(new URL('../src/data/world/EP001.json',import.meta.url)));
const now=new Date('2026-10-24T08:00:00Z');
test('EP001 stays evergreen and links to the original episode resource route',()=>{assert.equal(story.content_type,'evergreen');assert.equal(story.event_date,null);assert.equal(story.resource_path,'/resources/ep001');assert.equal(storyPath(story),'/world/ep001');assert.deepEqual(validateStories([story]),[]);assert.deepEqual(dailyNews([story],now),[]);});
test('drafts and future stories stay hidden with Taipei release boundary',()=>{assert.equal(isStoryVisible({...story,status:'draft'},now),false);assert.equal(isStoryVisible({...story,published_date:'2026-10-25'},now),false);assert.equal(isStoryVisible({...story,published_date:'2026-10-25'},new Date('2026-10-24T16:00:00Z')),true);});
test('daily selection excludes old news and never fabricates or exceeds three items',()=>{const news={...story,content_type:'news',event_date:'2026-10-23',sources:[{title:'Source',url:'https://example.org/news'}]};assert.equal(dailyNews([news,{...news,published_date:'2026-10-23'}],now).length,1);assert.equal(dailyNews(Array.from({length:5},(_,i)=>({...news,id:'news-'+i})),now).length,3);});
test('news requires event dates and external evidence, invalid coordinates and links are rejected',()=>{assert.ok(validateStories([{...story,content_type:'news'}]).length);assert.ok(validateStories([{...story,latitude:91}]).length);assert.ok(validateStories([{...story,sources:[{title:'bad',url:'javascript:alert(1)'}]}]).length);assert.ok(validateStories([{...story,published_date:'2026-02-30'}]).length);});
test('map pin uses geographic coordinates on the same projection as land',()=>{assert.deepEqual(worldPoint(0,0),[500,250]);const [x,y]=worldPoint(story.longitude,story.latitude);assert.ok(x>830&&x<840&&y>180&&y<190);});

test('news may publish as a knowledge story before optional worksheets are produced',()=>{const news={...story,content_type:'news',resource_path:null,image:null,event_date:'2026-10-23',sources:[{title:'Verified source',url:'https://example.org/news'}]};assert.deepEqual(validateStories([news]),[]);});
