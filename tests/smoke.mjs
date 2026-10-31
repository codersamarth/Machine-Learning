import { readFileSync } from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const curriculum = readFileSync("curriculum.js", "utf8");
const app = readFileSync("app.js", "utf8");
const elMap = new Map();
function el(id) {
  if (!elMap.has(id)) elMap.set(id, {
    innerHTML: "", textContent: "", value: "", style: {},
    classList: { toggle() {}, add() {}, remove() {} },
    addEventListener() {}, scrollIntoView() {}
  });
  return elMap.get(id);
}
const context = {
  window: { scrollTo() {} }, navigator: {},
  localStorage: { getItem() { return null; }, setItem() {} },
  document: {
    querySelector: el, querySelectorAll() { return []; },
    addEventListener() {},
    body: { classList: { toggle() {} } }
  },
  setTimeout() {}, clearTimeout() {}, console, Set, Blob
};
vm.runInNewContext(curriculum, context);
vm.runInNewContext(readFileSync("lecture-plan.js","utf8"), context);
assert.equal(context.window.ML_CURRICULUM.lectures.length, 15);
assert.equal(context.window.ML_CURRICULUM.gelato.length, 13);
assert.ok(context.window.ML_CURRICULUM.lessons.filter(l => l.lecture === 3).length >= 25);
assert.equal(context.window.ML_CURRICULUM.walks.length, 8);

const source = app.replace(/\}\)\(\);\s*$/, "window.__test={fitPolynomial, modelAt, errorStats,parseCSV,tableStats,V,C,render,pageHome,pageLearn,pageRegression,pageLesson,pageLab,pageCode,pagePython,pageData,pageQuiz,pageNotes,pageStudio,residualGraphic,splitGraphic,action};})();");
assert.ok(source.includes("window.__test="), "Could not expose app testing functions");
vm.runInNewContext(source, context);
const t = context.window.__test;
const fit = t.fitPolynomial(t.C.gelato, 1);
const slope = (t.modelAt(365,fit) - t.modelAt(1,fit)) / 364;
assert.ok(Math.abs(slope - (-0.47128097)) < 0.0005, "OLS slope should match actual Gelato data");
assert.ok(Math.abs(t.modelAt(100, fit) - (205.31873487 - 0.47128097 * 100)) < 0.01);
const expected = [
  [47.993039,159.054521],[29.798964,193.555447],
  [11.027961,219.464922],[10.438705,218.023866],
  [7.551648,209.043639],[7.549271,208.986602],
  [7.407011,207.142732],[3.018546,216.657632]
];
for(let d=1;d<=8;d++){
  const fit=t.fitPolynomial(t.C.gelato.slice(0,10),d);
  const predictor=x=>t.modelAt(x,fit);
  const stats=t.errorStats(t.C.gelato.slice(0,10),predictor);
  assert.ok(Math.abs(stats.rmse-expected[d-1][0])<0.001, "Degree "+d+" must match independent NumPy OLS training RMSE");
  assert.ok(Math.abs(predictor(100)-expected[d-1][1])<0.001, "Degree "+d+" prediction must match NumPy");
}
assert.equal(t.C.lessons.length,61);
for (const lesson of t.C.lessons) {
  assert.ok(lesson.title && lesson.simple && lesson.university && lesson.pitfall && lesson.source, "Missing instructional content");
  assert.ok(lesson.choices.length >= 3, "Every lesson should include an interactive check");
  assert.ok(Number.isInteger(lesson.correct) && lesson.correct >=0 && lesson.correct<lesson.choices.length, "Invalid quiz answer index");
}

for (const key of ["pageHome", "pageLearn", "pageRegression", "pageLesson", "pageLab", "pageCode", "pagePython", "pageData", "pageQuiz", "pageNotes", "pageStudio"]) {
  const html = t[key]();
  assert.ok(html.length > 150, key + " rendered empty content");
  assert.ok(!html.includes("NaN"), key + " contains a NaN placeholder");
  assert.ok(!html.includes("undefined"), key + " shows undefined content");
}
const csv = 'Name,Age\n"Smith, Ada",21\n"Test ""Quoted""",\n';
const parsed = t.parseCSV(csv);
assert.equal(parsed.rows.length, 2);
assert.equal(parsed.rows[0][0], "Smith, Ada");
assert.equal(parsed.rows[1][0], 'Test "Quoted"');
assert.throws(()=>t.parseCSV('Name,Age\n"unclosed,12'),/Unclosed/);
assert.throws(()=>t.parseCSV('Name,Age\nAda,25,extra'),/CSV row/);
assert.equal(t.parseCSV('\uFEFFName,Age\nAda,25\n').rows.length,1);
assert.ok(t.residualGraphic(100).includes("Residual: 20"));
assert.ok(t.splitGraphic(60).includes("Test 20%"));
for(const lesson of t.C.lessons){
  t.V.lesson=lesson.id;
  const page=t.pageLesson();
  assert.ok(page.includes(lesson.title),"Lesson page must render its topic");
  assert.ok(page.includes("MICRO QUIZ"),"Lesson should include active recall");
}

console.log("ML Playground smoke tests passed");
