import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";
import {resolve} from "node:path";

const pages=["index.html","journey.html","cases.html","ingest.html","video-library.html","video-studio.html","video-production.html"];
const removed=["AUDIT_MASTER_PROMPT.md","IMPROVEMENT_REPORT.md","QUALITY_AUDIT.md","NOTEBOOKLM_VIDEO_GUIDE.md","VIDEO_GENERATION_GUIDE.md"];
for(const page of pages){
 const markup=readFileSync(page,"utf8");
 assert.match(markup,/<html\s+lang="en"/i,page+" should declare English");
 assert.match(markup,/<title>[^<]+<\/title>/i,page+" missing page title");
 assert.match(markup,/<main\b/i,page+" missing main landmark");
 assert.match(markup,/<meta\s+name="viewport"/i,page+" missing responsive viewport");
 for(const m of markup.matchAll(/(?:src|href)=["']([^"']+)["']/g)){
  const raw=m[1];
  if(/^(?:https?:|mailto:|tel:|data:|#|javascript:)/i.test(raw))continue;
  const path=raw.split(/[?#]/)[0];
  if(!path||path==="/")continue;
  const disk=resolve(path.startsWith("/")?"."+path:path);
  assert.ok(existsSync(disk),page+" references missing local asset "+path);
 }
 for(const old of removed)assert.ok(!markup.includes(old),page+" links to removed obsolete guide "+old);
}
const readme=readFileSync("README.md","utf8");
for(const old of removed)assert.ok(!readme.includes(old),"README links to stale docs "+old);
for(const doc of ["LECTURE_COVERAGE.md","VIDEO_PUBLISHING.md","data/source-manifest.json"])assert.ok(existsSync(doc),"Missing critical guide: "+doc);
const production=readFileSync("video-production.html","utf8");
assert.match(production,/video-production.js/);
assert.match(production,/vp-list/);
const queue=JSON.parse(readFileSync("video-production-queue.json","utf8"));
assert.equal(queue.videos.length,92);
assert.ok(readFileSync("index.html","utf8").includes('href="/video-production.html"'));
const files=pages.length;
console.log("Site integrity: "+files+" HTML routes, local assets resolved, 92 videos, stale-doc references removed");
