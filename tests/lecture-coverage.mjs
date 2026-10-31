import assert from "node:assert/strict";
import vm from "node:vm";
import {readFileSync} from "node:fs";

const context={window:{}};
for(const path of ["curriculum.js","lecture-plan.js"]){
  vm.runInNewContext(readFileSync(path,"utf8"),context,{filename:path});
}
const C=context.window.ML_CURRICULUM;
assert.equal(C.lectures.length,15,"Retain official 15-session roadmap");
assert.deepEqual(Array.from({length:15},(_,i)=>C.lectures[i].id),Array.from({length:15},(_,i)=>i+1));
assert.equal(C.lessons.length,61,"Ten Lecture 1, 18 Lecture 2, 33 Lecture 3 topics");
assert.deepEqual([1,2,3].map(n=>C.lessons.filter(l=>l.lecture===n).length),[10,18,33]);
for(let n=4;n<=15;n++){
 assert.equal(C.lessons.filter(l=>l.lecture===n).length,0,"Future lecture "+n+" must not invent professor content");
 assert.equal(C.lectures[n-1].available,false,"Future lecture "+n+" is unsourced");
}
const seen=new Set();
for(const l of C.lessons){
 assert.ok(!seen.has(l.id),"Duplicate lesson "+l.id);seen.add(l.id);
 assert.ok(l.lecture>=1&&l.lecture<=3);
 for(const prop of ["id","title","hook","simple","university","analogy","pitfall","source","sectionId","sectionTitle"]){
  assert.ok(typeof l[prop]==="string"&&l[prop].trim(),"Missing "+prop+" in "+l.id);
 }
 assert.ok(l.choices.length===3,"Expect 3 quiz options for "+l.id);
 assert.ok(Number.isInteger(l.correct)&&l.correct>=0&&l.correct<l.choices.length);
 assert.ok(["supplement","lecture"].includes(l.kind),"All topics need provenance type "+l.id);
}
assert.equal(C.coverageMatrix.length,3);
const sourceNames=["MLO_Lecture_1_Handouts.pdf","MLO_Lecture_2_Handouts.pdf","MLO_Lecture_3_Prelecture.pdf"];
C.coverageMatrix.forEach((l,i)=>{assert.equal(l.lecture,i+1);assert.equal(l.source,sourceNames[i]);assert.ok(l.outcomes.length>=4)});
const ordered=[];
for(let n=1;n<=3;n++){
 let list=[];
 for(const section of C.lectureSections[n]){
  assert.ok(section.title&&section.coverage&&section.ids.length>=3);
  for(const id of section.ids){
   const l=C.lessons.find(x=>x.id===id);
   assert.ok(l,"Missing mapped "+id);
   assert.equal(l.lecture,n);
   assert.equal(l.sectionId,section.id);
   list.push(id);
  }
 }
 assert.deepEqual(Array.from(C.lessons.filter(l=>l.lecture===n).map(l=>l.id)),list,"Lecture "+n+" does not follow declared handout order");
 ordered.push(...list);
}
assert.equal(new Set(ordered).size,61);
const mustHave={
  1:["m14","m1","m2","m9","m10","m3","m11","m12","m4","m13"],
  2:["d201","d202","d203","d204","d205","d206","d207","d208","d209","d210","d211","d212","d213","d214","m5","m6","m7","m8"],
  3:["r01","r33","r02","r03","r04","r05","r06","r07","r08","r14","r16","r19","r22","r27","r28","r30","r31"]
};
for(const [n,ids] of Object.entries(mustHave)){
 for(const id of ids)assert.ok(C.lessons.some(l=>l.id===id&&l.lecture===Number(n)),"Missing required learning topic "+id);
}
assert.ok(C.lectureSections[3][3].ids.every(id=>C.lessons.find(l=>l.id===id).kind==="supplement"),"Advanced methods must clearly be marked as supplementary");
const s=C.lectureSections[3].map(x=>x.title).join(" ");
assert.ok(s.indexOf("regression")<s.indexOf("Polynomial"));
assert.ok(s.indexOf("Polynomial")<s.indexOf("pipeline"));
console.log("Lecture coverage QA passed: 61 lessons across Lectures 1–3; complete mapped 15-session roadmap, ordered sections, provenance and 61 quizzes");
