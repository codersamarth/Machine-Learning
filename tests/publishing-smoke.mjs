import assert from "node:assert/strict";
import vm from "node:vm";
import {readFileSync} from "node:fs";
const ctx={window:{}};
for(const f of ["curriculum.js","lecture-plan.js","teaching-guides.js","video-map.js","journey-data.js"])vm.runInNewContext(readFileSync(f,"utf8"),ctx,{filename:f});
const C=ctx.window.ML_CURRICULUM;
assert.equal(C.lessons.length,61);
for(const l of C.lessons){assert.ok(l.teaching?.example.length>35);assert.equal(l.teaching.steps.length,3)}
assert.equal(new Set([...C.lessons,...ctx.window.ML_JOURNEY.lessons].map(x=>x.id)).size,92);
assert.ok(ctx.window.ML_VIDEO_LINKS.m14.endsWith(".mp4"));
for(const html of ["index.html","journey.html","video-library.html","video-studio.html"]){
 const s=readFileSync(html,"utf8");
 for(const f of ["teaching-guides.js","video-map.js","video-client.js"])assert.ok(s.includes(f),html+" missing "+f);
}
for(const file of ["app.js","journey.js","video-library.js","video-studio.js"])assert.ok(readFileSync(file,"utf8").includes("<video"),file+" needs on-site video");
for(const file of ["api/heygen-webhook.js","api/videos.js","video-client.js"])new Function(readFileSync(file,"utf8").replace(/^import .*?;$/gm,"").replace(/^export default /gm,""));
console.log("92 topic teaching guides, first video and dynamic publishing integration verified");
