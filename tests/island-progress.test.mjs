import test from 'node:test';
import assert from 'node:assert/strict';
import { deriveIslandProgress } from '../src/components/islands/progress.js';
const road={a:{themeName:'測試航線',weeks:[{n:1,weekNumber:101,badgeId:'b1',topic:'第一關'},{n:2,weekNumber:102,badgeId:'b2',topic:'第二關'},{n:3,mystery:true}]}};
const published=[{weekNumber:101,published:true,badgeId:'b1'},{weekNumber:102,published:true,badgeId:'b2'}];
const base={roads:road,weeks:published,rewards:{b1:{type:'badge'},c1:{type:'card'}},access:{a:true}};
test('a locked course never becomes a continue destination',()=>assert.equal(deriveIslandProgress({...base,access:{}}).next,null));
test('earning a badge advances to the next published week',()=>assert.equal(deriveIslandProgress({...base,collection:{b1:{}}}).next.route,'/week/102'));
test('unpublished content is never suggested',()=>assert.equal(deriveIslandProgress({...base,weeks:[{weekNumber:101,published:false}]}).next,null));
test('an unpublished predecessor does not unlock a later island',()=>assert.equal(deriveIslandProgress({...base,weeks:[published[1]]}).next,null));
test('all released badges earned does not fabricate a new mission',()=>assert.equal(deriveIslandProgress({...base,collection:{b1:{},b2:{}}}).next,null));
test('old first-season access, release limit and badge ordering remain respected',()=>{
 const input={access:{'l1-season1':true},latestAvailableWeek:2,weeks:[{weekNumber:1,published:true,badgeId:'old1'},{weekNumber:2,published:true,badgeId:'old2'},{weekNumber:3,published:true,badgeId:'old3'}],collection:{old1:{}}};
 assert.equal(deriveIslandProgress(input).next.route,'/week/2');
 assert.equal(deriveIslandProgress({...input,collection:{old1:{},old2:{}}}).next,null);
});
test('display counts distinguish badges and cards without awarding or mutating records',()=>{
 const input={...base,collection:{b1:{unlockedAt:'unchanged'},c1:{},unknown:{}}};const before=structuredClone(input);
 const result=deriveIslandProgress(input);assert.equal(result.badges,1);assert.equal(result.cards,1);assert.equal(result.learned,1);assert.deepEqual(input,before);
});
test('no content or collection is a valid empty state',()=>{const r=deriveIslandProgress({});assert.equal(r.owned,0);assert.equal(r.next,null);});
