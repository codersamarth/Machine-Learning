import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
const ctx={window:{}};
for(const file of ["curriculum.js","lecture-plan.js","teaching-guides.js","journey-data.js","video-packets.js"])vm.runInNewContext(readFileSync(file,"utf8"),ctx,{filename:file});
const p=ctx.window.ML_VIDEO_PACKETS,arr=p.topics;
assert.equal(arr.length,92,"Should provide exactly one packet for each of 31 beginner and 61 course lessons");
assert.equal(new Set(arr.map(t=>t.id)).size,92,"Every topic ID must be unique");
assert.equal(arr.filter(t=>t.kind==="journey").length,31);
assert.equal(arr.filter(t=>t.kind==="curriculum").length,61);
assert.equal(arr.filter(t=>t.group==="lecture3").length,33);
for(const t of arr){
 const text=p.sourceText(t),prompt=p.steeringPrompt(t),short=p.steeringPrompt(t,"short");
 assert.ok(text.startsWith("# "+t.title),"Missing title: "+t.id);
 assert.ok(text.includes("Source provenance: "+t.source),"Source provenance missing: "+t.id);
 assert.ok(text.includes("## Beginner-friendly explanation"),"Explanation missing: "+t.id);
 if(t.kind==="curriculum")assert.ok(text.includes("## Walkthrough from a single concrete scenario"),"Missing source-grounded worked example "+t.id);
 assert.ok(text.includes("## Analogy"),"Analogy missing: "+t.id);
 assert.ok(text.includes("## Understanding check"),"Quiz missing: "+t.id);
 assert.ok(text.includes("NOT a verbatim handout"),"Rights context missing: "+t.id);
 assert.ok(text.includes("## Video accuracy rules"),"Accuracy guardrail missing: "+t.id);
 assert.ok(prompt.includes(t.title)&&prompt.includes("ONLY"),"Steering prompt must be topic-specific: "+t.id);
 assert.ok(short.includes("SHORT")&&!short.includes("detailed EXPLAINER"),"Short format should be different");
 assert.match(p.fileName(t),/\.md$/);
 if(t.kind==="journey"){
  const lines=t.lesson.code.split("\n");
  assert.equal(lines.length,t.lesson.steps.length,"Line explanations missing: "+t.id);
  lines.forEach((line,i)=>{
   assert.ok(text.includes("Line "+(i+1)+": "+line),"Line "+i+" missing from "+t.id);
   assert.ok(text.includes(t.lesson.steps[i]),"Line explanation not carried over: "+t.id);
  });
 }
}
const html=readFileSync("video-studio.html","utf8");
assert.match(html,/<meta name="viewport"/);
assert.match(html,/id="download-all"/);
assert.match(html,/video-packets\.js/);
assert.match(html,/video-studio\.js/);
assert.match(readFileSync("index.html","utf8"),/href="\/video-studio\.html"/);
for(const f of ["video-studio.js","video-map.js"])new Function(readFileSync(f,"utf8"));
console.log("Video Studio QA passed: 92 source-grounded packets, two steering prompts per topic, correct line traces, navigation and syntax.");
