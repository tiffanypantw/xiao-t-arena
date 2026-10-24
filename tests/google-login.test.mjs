import test from 'node:test';
import assert from 'node:assert/strict';
import { runGoogleLogin } from '../src/lib/googleLogin.js';
test('opens provider synchronously in the click, not after an async delay',async()=>{
 let opened=false;const pending=runGoogleLogin(()=>{opened=true;return Promise.resolve();});
 assert.equal(opened,true);assert.deepEqual(await pending,{success:true});
});
for(const code of ['auth/unauthorized-domain','auth/popup-blocked','auth/popup-closed-by-user','auth/network-request-failed']){
 test(`${code} becomes a visible actionable result`,async()=>{
  const result=await runGoogleLogin(()=>Promise.reject({code}));
  assert.equal(result.success,false);assert.equal(result.code,code);assert.ok(result.error.length>10);
 });
}
test('unexpected exceptions do not leak provider details into the page',async()=>{
 const result=await runGoogleLogin(()=>{throw new Error('private diagnostic text');});
 assert.equal(result.success,false);assert.equal(result.error.includes('private diagnostic'),false);
});
