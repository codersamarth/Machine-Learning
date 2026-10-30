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
assert.equal(context.window.ML_CURRICULUM.lectures.length, 15);
assert.equal(context.window.ML_CURRICULUM.gelato.length, 13);
assert.ok(context.window.ML_CURRICULUM.lessons.filter(l => l.lecture === 3).length >= 25);
assert.equal(context.window.ML_CURRICULUM.walks.length, 8);

const source = app.replace(/\}\)\(\);\s*$/, "window.__test={fitPolynomial, modelAt, errorStats,parseCSV,tableStats,V,C,render,pageHome,pageLearn,pageRegression,pageLesson,pageLab,pageCode,pagePython,pageData,pageQuiz,pageNotes,pageStudio};})();");
assert.ok(source.includes("window.__test="), "Could not expose app testing functions");
vm.runInNewContext(source, context);
const t = context.window.__test;
const fit = t.fitPolynomial(t.C.gelato, 1);
const slope = fit[1] / 364;
assert.ok(Math.abs(slope - (-0.47128097)) < 0.0005, "OLS slope should match actual Gelato data");
assert.ok(Math.abs(t.modelAt(100, fit) - (205.31873487 - 0.47128097 * 100)) < 0.01);
for (const key of ["pageHome", "pageLearn", "pageRegression", "pageLesson", "pageLab", "pageCode", "pagePython", "pageData", "pageQuiz", "pageNotes", "pageStudio"]) {
  const html = t[key]();
  assert.ok(html.length > 150, key + " rendered empty content");
  assert.ok(!html.includes("NaN"), key + " contains a NaN placeholder");
}
const csv = 'Name,Age\n"Smith, Ada",21\n"Test ""Quoted""",\n';
const parsed = t.parseCSV(csv);
assert.equal(parsed.rows.length, 2);
assert.equal(parsed.rows[0][0], "Smith, Ada");
assert.equal(parsed.rows[1][0], 'Test "Quoted"');
console.log("ML Playground smoke tests passed");
