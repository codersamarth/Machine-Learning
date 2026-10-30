import assert from "node:assert/strict";
import vm from "node:vm";
import {readFileSync} from "node:fs";

const ctx={window:{}};vm.runInNewContext(readFileSync("journey-data.js","utf8"),ctx);
const {stages,lessons}=ctx.window.ML_JOURNEY;
assert.equal(stages.length,6,"Six curriculum stages expected");
assert.equal(lessons.length,31,"31 beginner micro-lessons expected");
const ids=new Set();
for(const lesson of lessons){
  assert.ok(lesson.title&&lesson.why&&lesson.plain&&lesson.source&&lesson.analogy&&lesson.takeaway,"Every lesson must have explanation and source provenance");
  assert.ok(stages.some(s=>s.id===lesson.stage),"All lessons must map to a stage");
  assert.ok(!ids.has(lesson.id),"Duplicate lesson ID: "+lesson.id);ids.add(lesson.id);
  assert.equal(lesson.steps.length,lesson.code.split("\n").length,"Every code line must have an explanation in "+lesson.id);
  assert.ok(lesson.choices.length===3,"Three quiz options expected: "+lesson.id);
  assert.ok(Number.isInteger(lesson.correct)&&lesson.correct>=0&&lesson.correct<3,"Valid quiz answer required: "+lesson.id);
  assert.ok(lesson.plain.length>100,"Beginner explanation too short: "+lesson.id);
}
assert.equal(lessons.filter(l=>l.stage==="zero").length,10);
assert.equal(lessons.filter(l=>l.stage==="python").length,13);
assert.equal(lessons.filter(l=>l.stage==="data").length,8);
const lessonById=id=>lessons.find(l=>l.id===id);
for(const id of ["z01","z05","z09","p02","p06","p10","p11","p12","d02","d08"])assert.ok(lessonById(id));
const data=readFileSync("journey.js","utf8");
new Function(data);new Function(readFileSync("cases.js","utf8"));
assert.ok(data.includes("traceDetails"),"A real Gelato code-state inspector is required");
assert.ok(data.includes("searchResults"),"Global course search is required");
assert.ok(data.includes("bookmarks"),"Bookmarks must be supported");
console.log("Journey audit: 31 lessons, valid line explanations and quizzes, stage coverage and code inspector ✓");
