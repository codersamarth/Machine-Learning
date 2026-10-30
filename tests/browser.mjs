import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {setTimeout as pause} from "node:timers/promises";
import {chromium} from "playwright";
const PORT=8777,base="http://127.0.0.1:"+PORT;
const server=spawn("python3",["-m","http.server",String(PORT),"--bind","127.0.0.1"],{cwd:process.cwd(),stdio:"ignore"});
const failures=[],passes=[];let browser;
async function check(name,fn){try{await fn();passes.push(name);console.log("PASS "+name)}catch(e){failures.push({name,message:String(e.stack||e)});console.log("FAIL "+name+": "+e.message)}}
try{
 for(let n=0;n<40;n++){try{if((await fetch(base)).ok)break}catch(e){}await pause(150)}
 browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 const ctx=await browser.newContext({viewport:{width:1366,height:900},acceptDownloads:true});
 const p=await ctx.newPage(),errors=[];p.on("pageerror",e=>errors.push(e.message));
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
  await p.locator('[data-act="lesson:r06"]').click();
  assert.ok(await p.locator("#residual-plot svg").count());
  await p.locator("#residual-pred").evaluate(x=>{x.value="130";x.dispatchEvent(new Event("input",{bubbles:true}))});
  assert.match(await p.locator("#residual-plot").innerText(),/Residual: -10/);
 });
 await check("Titanic upload, negative fares, undo and categorical quiz",async()=>{
  await p.goto(base+"/cases.html");
  const csv=["PassengerId,Pclass,Name,Sex,Age,SibSp,Parch,Ticket,Fare,Cabin,Embarked","1,third,Ada,female,22,0,0,T1,8,,S","2,first,Ben,male,,1,0,T2,55,C1,","3,second,Cal,male,34,0,0,T3,-50,,C"].join("\n");
  await p.locator("#case-upload").setInputFiles({name:"Titanic.csv",mimeType:"text/csv",buffer:Buffer.from(csv)});
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
 await check("Real browser Python (Pyodide)",async()=>{
  await p.goto(base);await p.locator('[data-route="python"]').first().click();
  await p.locator('[data-act="pyrun"]').click();
  await p.waitForFunction(()=>document.querySelector("#py-output")?.textContent?.trim()==="12",null,{timeout:110000});
  assert.equal(await p.locator("#py-output").innerText(),"12");
 });
 await check("Mobile navigation and viewport",async()=>{
  const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,deviceScaleFactor:2});
  const m=await mobile.newPage();await m.goto(base);await m.locator("#menu").click();
  await m.locator('[data-route="regression"]').first().click();
  assert.match(await m.locator("h1").first().innerText(),/Regression Academy/);
  await m.locator("#menu").click();await m.locator('[data-route="lab"]').first().click();
  const w=await m.evaluate(()=>[document.documentElement.scrollWidth,window.innerWidth]);
  assert.ok(w[0]<=w[1]+3,"Horizontal overflow: "+JSON.stringify(w));
  await m.screenshot({path:"/vercel/mltest/mobile-qa.png",fullPage:true});
  await mobile.close();
 });
 if(errors.length)failures.push({name:"Uncaught browser errors",message:errors.join("; ")});
 console.log("SUMMARY "+JSON.stringify({passes,failures}));
 if(failures.length)process.exitCode=1;
}catch(e){console.error("Browser setup error:",e);process.exitCode=1}
finally{if(browser)await browser.close();server.kill("SIGTERM")}
