import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {setTimeout as pause} from "node:timers/promises";
import {chromium} from "playwright";
const PORT=8777,base=process.env.ML_BASE_URL||"http://127.0.0.1:"+PORT;
const server=process.env.ML_BASE_URL?null:spawn("python3",["-m","http.server",String(PORT),"--bind","127.0.0.1"],{cwd:process.cwd(),stdio:"ignore"});
const failures=[],passes=[];let browser;
async function check(name,fn){try{await fn();passes.push(name);console.log("PASS "+name)}catch(e){failures.push({name,message:String(e.stack||e)});console.log("FAIL "+name+": "+e.message)}}
try{
 for(let n=0;n<40;n++){try{if((await fetch(base)).ok)break}catch(e){}await pause(150)}
 browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 const ctx=await browser.newContext({viewport:{width:1366,height:900},acceptDownloads:true});
 const p=await ctx.newPage(),errors=[];p.on("pageerror",e=>errors.push(e.message));

 await check("Guided zero-to-code navigation, glossary, bookmarks and real Gelato trace",async()=>{
   await p.goto(base+"/journey.html");
   assert.match(await p.locator("h1").first().innerText(),/Understand the code/);
   await p.locator('[data-action="stage:zero"]').first().click();
   await p.waitForURL(/#stage=zero/);
   await p.locator('[data-action="lesson:z01"]').first().click();
   await p.waitForURL(/#lesson=z01/);
   assert.match(await p.locator("h1").first().innerText(),/What exactly is code/);
   await p.locator('[data-action="bookmark:z01"]').first().click();
   await p.reload();
   assert.match(await p.locator("h1").first().innerText(),/What exactly is code/);
   await p.locator("#bookmarks-toggle").click();
   assert.match(await p.locator("#journey-content").innerText(),/What exactly is code/);
   await p.locator("#search-toggle").click();
   await p.locator("#global-search").fill("double brackets");
   await p.waitForFunction(()=>document.querySelector("#search-results")?.textContent?.includes("Pandas"));
   await p.goto(base+"/journey.html#trace");
   await p.locator('[data-action="traceline:3"]').click();
   assert.match(await p.locator("#journey-content").innerText(),/DataFrame \(13, 1\)/);
   await p.locator('[data-action="traceline:6"]').click();
   assert.match(await p.locator("#journey-content").innerText(),/Fitted LinearRegression/);
   await p.goto(base+"/journey.html#practice");
   assert.match(await p.locator("h1").first().innerText(),/Code-reading challenges/);
   await p.locator('[data-action="challengeanswer:1"]').first().click();
   assert.match(await p.locator("#journey-content").innerText(),/The second assignment reads/);
 });

 await check("Dashboard and live polynomial graph",async()=>{
  await p.goto(base);assert.match(await p.title(),/ML Playground/);
  await p.locator('[data-route="regression"]').first().click();
  assert.match(await p.locator("h1").first().innerText(),/Regression Academy/);
  await p.locator('[data-route="lab"]').first().click();
  let before=await p.locator("#trainrmse").innerText();
  await p.locator("#degree").evaluate(x=>{x.value="5";x.dispatchEvent(new Event("input",{bubbles:true}))});
  let after=await p.locator("#trainrmse").innerText();
  assert.notEqual(before,after);assert.equal(await p.locator("#degreeval").innerText(),"5");
 });
 await check("Quiz, notes, persistence and lesson diagram",async()=>{
  await p.locator('[data-route="regression"]').first().click();
  await p.locator('[data-act="lesson:r01"]').click();
  await p.locator('[data-note="r01"]').fill("Features are inputs; the label is the outcome.");
  await p.reload();assert.equal(await p.locator('[data-note="r01"]').inputValue(),"Features are inputs; the label is the outcome.");
  await p.locator('[data-route="regression"]').first().click();
  await p.locator('[data-act="lesson:r06"]').click();
  assert.ok(await p.locator("#residual-plot svg").count());
  await p.locator("#residual-pred").evaluate(x=>{x.value="130";x.dispatchEvent(new Event("input",{bubbles:true}))});
  await p.waitForFunction(()=>document.querySelector("#residual-plot")?.textContent?.includes("Residual: -10"),null,{timeout:5000});
  assert.match(await p.locator("#residual-plot").innerText(),/Residual: -10/);
 });
 await check("Titanic upload, negative fares, undo and categorical quiz",async()=>{
  await p.goto(base+"/cases.html");
  const csv=["PassengerId,Pclass,Name,Sex,Age,SibSp,Parch,Ticket,Fare,Cabin,Embarked","1,third,Ada,female,22,0,0,T1,8,,S","2,first,Ben,male,,1,0,T2,55,C1,","3,second,Cal,male,34,0,0,T3,-50,,C"].join("\n");
  assert.match(await p.locator("#upload-status").innerText(),/SYNTHETIC DEMO/);
  await p.locator("#case-upload").setInputFiles({name:"Titanic.csv",mimeType:"text/csv",buffer:Buffer.from(csv)});
  await p.waitForFunction(()=>document.querySelector("#upload-status")?.textContent?.includes("Loaded 3 rows from Titanic.csv"),null,{timeout:10000});
  await p.getByRole("button",{name:/Remove negative-fare rows/}).click();
  assert.match(await p.locator("#case-workspace").innerText(),/Current negative fares: 0/);
  await p.getByRole("button",{name:/Undo/}).first().click();
  assert.match(await p.locator("#case-workspace").innerText(),/Current negative fares: 1/);
  await p.getByRole("button",{name:/Drop Cabin column/}).click();
  await p.getByRole("button",{name:/Undo/}).first().click();
  assert.ok((await p.locator("table th").allInnerTexts()).includes("Cabin"));
  await p.locator('[data-quiz="t2"][data-value="1"]').click();
  assert.match(await p.locator("#case-workspace").innerText(),/This source file has 11 columns/);
 });
 await check("Diamond real sample prices and filters",async()=>{
  await p.locator("#tab-diamond").click();
  const csv=["ID,Carat Weight,Cut,Color,Clarity,Polish,Symmetry,Report,Price","1,1.10,Ideal,H,SI1,VG,EX,GIA,5169","2,0.83,Ideal,H,VS1,ID,ID,AGSL,3470","3,0.85,Good,F,SI1,EX,EX,GIA,3183","4,1.18,Ideal,H,SI1,VG,VG,GIA,5900","5,2.1,Fair,D,VVS1,EX,EX,GIA,21000"].join("\n");
  await p.locator("#case-upload").setInputFiles({name:"Sarah_dataset.csv",mimeType:"text/csv",buffer:Buffer.from(csv)});
  await p.waitForFunction(()=>document.querySelector("#upload-status")?.textContent?.includes("Loaded 5 rows from Sarah_dataset.csv"),null,{timeout:10000});
  await p.waitForFunction(()=>document.querySelector("#case-workspace")?.textContent?.includes("All listings"),null,{timeout:10000});
  assert.match(await p.locator("#case-workspace").innerText(),/All listings/);
  await p.locator('[data-filter="Cut"]').selectOption("Ideal");
  assert.ok(await p.locator("svg[aria-label*=diamond]").count());
  await p.locator("#weight").evaluate(x=>{x.value="1.15";x.dispatchEvent(new Event("input",{bubbles:true}));x.dispatchEvent(new Event("change",{bubbles:true}))});
  assert.equal(await p.locator("#weight").inputValue(),"1.15");
 });
 await check("Jupyter import and editable saved lesson",async()=>{
  await p.goto(base+"/ingest.html");
  const notebook={nbformat:4,nbformat_minor:5,metadata:{},cells:[{cell_type:"markdown",source:["# Decision trees\n","Trees split using conditions."]},{cell_type:"code",source:["print('hello')\n"]}]};
  await p.locator("#file-input").setInputFiles({name:"lecture4.ipynb",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(notebook))});
  await p.locator("#lecture-num").selectOption("4");await p.locator("#extract").click();
  await p.waitForFunction(()=>document.querySelector("#chunk").options.length>=2);
  await p.locator("#lesson-title").fill("Decision trees for absolute beginners");
  await p.locator("#lesson-question").fill("How does a model decide where to split?");
  await p.locator("#lesson-explanation").fill("A decision tree splits examples according to feature tests and predicts based on the resulting leaf. This is a user-reviewed exercise draft, not a claim about a future lecture.");
  await p.locator("#save-draft").click();
  assert.match(await p.locator("#save-status").innerText(),/Saved as a local custom lesson/);
  await p.goto(base);await p.locator('[data-route="learn"]').first().click();
  await p.locator('[data-act="lecture:4"]').click();
  assert.match(await p.locator("#lecturearea").innerText(),/Decision trees for absolute beginners/);
 });

 await check("PDF extraction into review-only draft",async()=>{
  const {PDFDocument,StandardFonts}=await import("pdf-lib");
  const doc=await PDFDocument.create(),p1=doc.addPage([500,600]),font=await doc.embedFont(StandardFonts.Helvetica);
  p1.drawText("Linear regression uses slope and intercept",{x:40,y:550,font,size:14});
  const bytes=await doc.save();
  await p.goto(base+"/ingest.html");
  await p.locator("#file-input").setInputFiles({name:"lecture-sample.pdf",mimeType:"application/pdf",buffer:Buffer.from(bytes)});
  await p.locator("#extract").click();
  await p.waitForFunction(()=>document.querySelector("#source-preview")?.value?.includes("Linear regression"),null,{timeout:60000});
  assert.match(await p.locator("#source-preview").inputValue(),/Linear regression/);
 });
 await check("PPTX text extraction into review-only draft",async()=>{
  const {default:JSZip}=await import("jszip");
  const zip=new JSZip();zip.file("ppt/slides/slide1.xml",'<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><a:t>Tree algorithms split data into groups</a:t></p:spTree></p:cSld></p:sld>');
  const bytes=await zip.generateAsync({type:"nodebuffer"});
  await p.goto(base+"/ingest.html");
  await p.locator("#file-input").setInputFiles({name:"lecture-sample.pptx",mimeType:"application/vnd.openxmlformats-officedocument.presentationml.presentation",buffer:bytes});
  await p.locator("#extract").click();
  await p.waitForFunction(()=>document.querySelector("#source-preview")?.value?.includes("Tree algorithms"),null,{timeout:60000});
  assert.match(await p.locator("#source-preview").inputValue(),/Tree algorithms/);
 });
 await check("Real browser Python (Pyodide)",async()=>{
  await p.goto(base);await p.locator('[data-route="python"]').first().click();
  await p.locator('[data-act="pyrun"]').click();
  await p.waitForFunction(()=>document.querySelector("#py-output")?.textContent?.trim()==="12",null,{timeout:110000});
  assert.equal(await p.locator("#py-output").innerText(),"12");
 });

 await check("Video Academy source packs, video link persistence and lesson-specific prompts",async()=>{
   await p.goto(base+"/video-library.html");
   assert.match(await p.locator("h1").first().innerText(),/video academy/i);
   assert.match(await p.locator("#status").innerText(),/92 topic source packs prepared/);
   assert.equal(await p.locator(".video-topic").count(),92);
   await p.locator("#group").selectOption("lecture3");
   assert.equal(await p.locator(".video-topic").count(),33);
   await p.locator("#group").selectOption("all");
   await p.locator('[data-topic="r06"]').first().click();
   assert.match(await p.locator("#detail-heading").innerText(),/Residuals/);
   assert.match(await p.locator("#detail-body pre").innerText(),/ONE LINE AT A TIME/);
   const downloadPromise=p.waitForEvent("download");
   await p.locator("#download-source").click();
   const download=await downloadPromise;
   assert.match(download.suggestedFilename(),/^r06-.*\.md$/);
   await p.locator("#video-link").fill("https://notebooklm.google.com/notebook/example");
   await p.locator("#save-video").click();
   assert.ok(await p.locator('#detail-body a[href*="notebooklm.google.com/notebook/example"]').count());
   await p.keyboard.press("Escape");
   await p.reload();
   await p.locator("#status-filter").selectOption("ready");
   assert.equal(await p.locator(".video-topic").count(),2);
   await p.locator('[data-topic="r06"]').click();
   assert.equal(await p.locator("#video-link").inputValue(),"https://notebooklm.google.com/notebook/example");
   await p.locator("#remove-video").click();
   await p.keyboard.press("Escape");
 });

 await check("Production tracker: live publication count and lecture filters",async()=>{
   await p.goto(base+"/video-production.html");
   await p.waitForFunction(()=>document.querySelectorAll(".vp-item").length===92,null,{timeout:10000});
   assert.equal(await p.locator("#published-count").innerText(),"1");
   assert.equal(await p.locator("#remaining-count").innerText(),"91");
   assert.equal(await p.locator(".vp-item").count(),92);
   await p.locator("#vp-group").selectOption("1");
   assert.equal(await p.locator(".vp-item").count(),10);
   await p.locator("#vp-status").selectOption("ready");
   assert.equal(await p.locator(".vp-item").count(),1);
   assert.ok(await p.locator('.vp-item a[href="/#lesson=m14"]').count());
   await p.locator("#vp-status").selectOption("pending");
   assert.equal(await p.locator(".vp-item").count(),9);
   await p.locator("#vp-group").selectOption("all");
   await p.locator("#vp-status").selectOption("all");
   await p.locator("#vp-search").fill("Target leakage");
   assert.equal(await p.locator(".vp-item").count(),1);
 });
 await check("Mobile navigation and viewport",async()=>{
  const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,deviceScaleFactor:2});
  const m=await mobile.newPage();await m.goto(base);await m.locator("#menu").click();
  await m.locator('[data-route="regression"]').first().click();
  assert.match(await m.locator("h1").first().innerText(),/Regression Academy/);
  await m.locator("#menu").click();await m.locator('[data-route="lab"]').first().click();
  const w=await m.evaluate(()=>[document.documentElement.scrollWidth,window.innerWidth]);
  assert.ok(w[0]<=w[1]+3,"Horizontal overflow: "+JSON.stringify(w));
  await m.goto(base+"/journey.html");
  await m.locator("#toggle-menu").click();
  await m.locator('[data-action="stage:python"]').first().click();
  await m.waitForURL(/#stage=python/);
  assert.match(await m.locator("h1").first().innerText(),/Read Python/);
  const journeyWidth=await m.evaluate(()=>[document.documentElement.scrollWidth,window.innerWidth]);
  assert.ok(journeyWidth[0]<=journeyWidth[1]+3,"Journey horizontal overflow: "+JSON.stringify(journeyWidth));
  await m.screenshot({path:process.env.ML_SCREENSHOT_PATH||"mobile-qa.png",fullPage:true});
  await mobile.close();
 });
 if(errors.length)failures.push({name:"Uncaught browser errors",message:errors.join("; ")});
 console.log("SUMMARY "+JSON.stringify({passes,failures}));
 if(failures.length)process.exitCode=1;
}catch(e){console.error("Browser setup error:",e);process.exitCode=1}
finally{if(browser)await browser.close();if(server)server.kill("SIGTERM")}
