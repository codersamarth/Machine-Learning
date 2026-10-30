import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {setTimeout as sleep} from "node:timers/promises";
import {chromium} from "playwright";
const port=8792,base=process.env.ML_BASE_URL||"http://127.0.0.1:"+port;
const server=process.env.ML_BASE_URL?null:spawn("python3",["-m","http.server",String(port),"--bind","127.0.0.1"],{cwd:process.cwd(),stdio:"ignore"});
let browser;
try{
 for(let i=0;i<40;i++){try{if((await fetch(base)).ok)break}catch(e){}await sleep(150)}
 browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 const ctx=await browser.newContext({viewport:{width:1366,height:860},acceptDownloads:true});
 const page=await ctx.newPage();const errors=[];page.on("pageerror",e=>errors.push(e.message));
 await page.goto(base+"/video-studio.html?topic=z01");
 assert.match(await page.title(),/Video Studio/);
 assert.equal(await page.locator("#video-topic-count").innerText(),"71");
 assert.match(await page.locator("#topic-detail h2").innerText(),/What exactly is code/);
 assert.match(await page.locator("#video-prompt").inputValue(),/detailed EXPLAINER/);
 await page.locator("#video-format").selectOption("short");
 assert.match(await page.locator("#video-prompt").inputValue(),/SHORT/);
 await page.locator("#topic-group").selectOption("regression");
 assert.match(await page.locator("#topic-results").innerText(),/32 topics found/);
 await page.locator('[data-select="r06"]').click();
 const dlPromise=page.waitForEvent("download");
 await page.locator('[data-video-act="download-source"]').click();
 assert.match((await dlPromise).suggestedFilename(),/^r06-.*\.md$/);
 await page.locator("#video-url").fill("https://notebooklm.google.com/notebook/qa-test-video");
 await page.locator("#video-link-form button[type=submit]").click();
 assert.equal(await page.locator('#topic-detail a[href="https://notebooklm.google.com/notebook/qa-test-video"]').count(),1);
 await page.reload();
 assert.equal(await page.locator('#topic-detail a[href="https://notebooklm.google.com/notebook/qa-test-video"]').count(),1);
 await page.locator('[data-video-act="remove-link"]').click();
 assert.equal(await page.locator('#topic-detail a[href="https://notebooklm.google.com/notebook/qa-test-video"]').count(),0);
 assert.deepEqual(errors,[],"No runtime JavaScript errors on desktop");
 await ctx.close();
 for(const width of [320,360,390,430,768,1024]){
  const ctx=await browser.newContext({viewport:{width,height:740},isMobile:width<=430,deviceScaleFactor:1});
  const p=await ctx.newPage();await p.goto(base+"/video-studio.html?topic=r06");
  const data=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,iw:window.innerWidth}));
  assert.ok(data.sw<=data.iw+3,"Unexpected Video Studio horizontal page overflow at "+width+"px: "+JSON.stringify(data));
  assert.match(await p.locator("#topic-detail h2").innerText(),/.+/);
  await ctx.close();
 }
 console.log("PASS Video Studio: 71 topics, prompts, source download, saved links, reload and 320–1024 px responsive layout");
}catch(e){console.error("FAIL Video Studio:",e);process.exitCode=1}
finally{if(browser)await browser.close();if(server)server.kill("SIGTERM")}
