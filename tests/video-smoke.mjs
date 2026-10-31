import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
const files=["curriculum.js","lecture-plan.js","journey-data.js"];
const elements=new Map(),events=new Map();
function node(id){if(!elements.has(id))elements.set(id,{innerHTML:"",textContent:"",value:"",style:{},hidden:false,setAttribute(){},addEventListener(name,fn){events.set(id+":"+name,fn)},focus(){},getClientRects(){return [{width:1}]} });return elements.get(id)}
const scope={
 window:{},location:{hash:""},navigator:{},
 localStorage:{getItem(){return null},setItem(){}},
 document:{getElementById:node,addEventListener(name,fn){events.set("document:"+name,fn)},querySelectorAll(){return []},body:{style:{}}},
 setTimeout(){},URL,console
};
for(const f of files)vm.runInNewContext(readFileSync(f,"utf8"),scope,{filename:f});
let script=readFileSync("video-library.js","utf8");
assert.ok(script.includes("load();render();"),"Video library must initialize");
script=script.replace(/\}\)\(\);\s*$/,"window.__videoTest={topics,sourceFor,promptFor,validUrl,filename,render,openTopic};})();");
vm.runInNewContext(script,scope,{filename:"video-library.js"});
const v=scope.window.__videoTest;
assert.ok(v,"Test hooks must be installed");
assert.equal(v.topics.length,92,"All 31 beginner and 61 course-aligned or supplementary topics must have dedicated video sources");
assert.equal(new Set(v.topics.map(x=>x.id)).size,71,"Topic identifiers must be unique");
assert.equal(v.topics.filter(x=>x.area==="zero").length,10);
assert.equal(v.topics.filter(x=>x.area==="python").length,13);
assert.equal(v.topics.filter(x=>x.area==="data").length,8);
assert.equal(v.topics.filter(x=>x.area==="lecture3").length,33);
assert.equal(v.topics.filter(x=>x.area==="lecture1").length,10);
assert.equal(v.topics.filter(x=>x.area==="lecture2").length,18);
for(const topic of v.topics){
 const src=v.sourceFor(topic),prompt=v.promptFor(topic);
 assert.ok(src.startsWith("# "+topic.title),"Missing title in "+topic.id);
 assert.ok(src.includes("## Plain-English explanation"),"Missing basic explanation in "+topic.id);
 assert.ok(src.includes(topic.plain),"Video source is not grounded in the lesson text");
 assert.ok(src.includes("Source reference label:"),"Missing source reference");
 assert.ok(src.includes("Accuracy instructions"),"Missing hallucination guardrails");
 assert.ok(prompt.includes(topic.title)&&prompt.includes("ONE LINE AT A TIME")===!!topic.code,"Code instruction mismatch for "+topic.id);
 assert.ok(v.filename(topic).endsWith(".md"));
 assert.ok(!src.includes("Source reference label: undefined"),"Missing provenance label for "+topic.id);
}
assert.ok(v.validUrl("https://notebooklm.google.com/notebook/abc"));
assert.ok(!v.validUrl("javascript:alert(1)"));
assert.ok(!v.validUrl("data:text/html,hello"));
assert.match(node("video-grid").innerHTML,/Prepare video/);
assert.match(node("status").textContent,/92 topic source packs prepared/);
assert.ok(events.has("download-all:click"));
console.log("Video Academy smoke tests passed: 92 sources and prompts, unique IDs, source fidelity and safe links");