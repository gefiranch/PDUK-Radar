import test from 'node:test';
import assert from 'node:assert/strict';
import {createNavigation} from '../public/ui/src/services/navigation.js';
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};};
test('navigation displays the new page before a slow API and ignores an older route response',async()=>{
 const pending=[],frames=[],busy=[];let page='ranking';
 const navigation=createNavigation({render:options=>frames.push({page,...options}),refresh:()=>{const job=deferred();pending.push(job);return job.promise;},canSync:()=>true,onBusy:value=>busy.push(value)});
 const first=navigation.navigate();assert.deepEqual(frames,[{page:'ranking',animate:true}]);
 page='detail';const second=navigation.navigate();assert.equal(frames[1].page,'detail');
 pending[0].resolve(true);await first;assert.equal(frames.length,2);assert.equal(busy.at(-1),true);
 pending[1].resolve(true);await second;assert.deepEqual(frames[2],{page:'detail',animate:false});assert.equal(busy.at(-1),false);
});
test('a refresh cannot replace a draft or resurrect a screen after logout',async()=>{
 let safe=true,renders=0,job=deferred();
 const navigation=createNavigation({render:()=>renders++,refresh:()=>job.promise,canSync:()=>safe});
 const pending=navigation.sync();safe=false;job.resolve(true);await pending;assert.equal(renders,0);
 safe=true;job=deferred();const old=navigation.sync();navigation.reset();job.resolve(true);await old;assert.equal(renders,0);
});
test('failed background sync leaves the destination displayed; unchanged data does not rerender',async()=>{
 const error=Error('Offline'),errors=[];let renders=0,fail=true;
 const navigation=createNavigation({render:()=>renders++,refresh:async()=>{if(fail)throw error;return false;},canSync:()=>true,onError:e=>errors.push(e)});
 await navigation.navigate();assert.equal(renders,1);assert.deepEqual(errors,[error]);
 fail=false;await navigation.sync();assert.equal(renders,1);
});
