import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const q=JSON.parse(readFileSync("video-production-queue.json","utf8"));
assert.equal(q.videoTotal,92);
assert.equal(q.videos.length,92);
const ids=new Set();
for(let i=0;i<q.videos.length;i++){
 const t=q.videos[i];
 assert.equal(t.order,i+1,"Queue must remain in deterministic course order");
 assert.ok(!ids.has(t.id),"Duplicate video production task "+t.id);
 ids.add(t.id);
 assert.ok(t.oneMinuteNarration.length>120 && t.oneMinuteNarration.length<1200,"Invalid one-minute narration "+t.id);
 assert.ok(t.shortWordCount>=70 && t.shortWordCount<=130,"One minute free video needs suitable narration "+t.id);
 for(const prop of ["hook","scenario","steps","plainEnglish","quiz","correctAnswer"])assert.ok(t.content[prop],"Missing video source detail "+t.id+": "+prop);
 assert.ok(t.source && t.title,"Missing source provenance "+t.id);
}
assert.equal(q.videos.filter(t=>t.kind==="curriculum").length,61);
assert.equal(q.videos.filter(t=>t.kind==="journey").length,31);
assert.deepEqual([1,2,3].map(k=>q.videos.filter(t=>t.lecture===k).length),[10,18,33]);
assert.equal(q.videos[0].id,"m14");
assert.equal(q.videos.filter(t=>t.status==="published").length,1);
assert.equal(q.videos.filter(t=>t.status==="queued").length,91);
const ui=readFileSync("video-production.html","utf8");
assert.match(ui,/video-production.js/);
assert.match(ui,/vp-list/);
assert.ok(readFileSync("index.html","utf8").includes("/video-production.html"));
assert.ok(readFileSync("video-library.html","utf8").includes("/video-production.html"));
console.log("Production queue ready: 92 topic-grounded scripts, 91 scheduled remaining, 1 confirmed published");
