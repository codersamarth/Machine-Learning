import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {setTimeout as delay} from "node:timers/promises";
import {chromium} from "playwright";
import AxeBuilder from "@axe-core/playwright";
const port=8778,base=process.env.ML_BASE_URL||"http://127.0.0.1:"+port;
const server=process.env.ML_BASE_URL?null:spawn("python3",["-m","http.server",String(port),"--bind","127.0.0.1"],{cwd:process.cwd(),stdio:"ignore"});
let browser;const failures=[];
try{
 for(let i=0;i<30;i++){try{if((await fetch(base)).ok)break}catch(e){}await delay(150)}
 browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 const ctx=await browser.newContext({viewport:{width:1366,height:900}});
 const page=await ctx.newPage();
 async function scan(path,setup){
  await page.goto(base+path);
  if(path.includes("cases"))assert.ok(await page.locator("#case-upload").count(),"Case Studio did not load");
  if(path.includes("ingest"))assert.ok(await page.locator("#file-input").count(),"Lecture Import Studio did not load");
  if(path.includes("journey"))assert.ok(await page.locator("#journey-content").count(),"Guided learning page did not load");
  if(setup)await setup();
  const report=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();
  const issue=report.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target.join(" ")).slice(0,5)}));
  if(issue.length)failures.push({path,issue});
  console.log((issue.length?"FAIL ":"PASS ")+path+" "+JSON.stringify(issue));
 }
 await scan("/");
 await scan("/#lesson=r14");
 await scan("/#lesson=r09");
 await scan("/#python");
 await scan("/cases.html");
 await scan("/ingest.html");
 await scan("/video-library.html");
 await scan("/video-library.html",async()=>{await page.locator('[data-topic="r01"]').first().click()});
 await scan("/journey.html");
 await scan("/journey.html#lesson=z01");
 await scan("/journey.html#trace");
 await scan("/journey.html#search");
 await scan("/cases.html",async()=>{
  const csv=["PassengerId,Pclass,Name,Sex,Age,SibSp,Parch,Ticket,Fare,Cabin,Embarked","1,third,Ada,female,22,0,0,T1,8,,S","2,first,Ben,male,,1,0,T2,55,C1,"].join("\n");
  await page.locator("#case-upload").setInputFiles({name:"Titanic.csv",mimeType:"text/csv",buffer:Buffer.from(csv)});
  await page.waitForFunction(()=>document.querySelector("#case-workspace")?.textContent?.includes("MISSION 1"));
 });

 const phoneContext=await browser.newContext({viewport:{width:320,height:700},isMobile:true,deviceScaleFactor:2,touchscreen:true});
 const phone=await phoneContext.newPage();
 for(const route of ["/","/#regression","/#lab","/#code","/cases.html","/ingest.html","/journey.html"]){
  await phone.goto(base+route);
  const report=await new AxeBuilder({page:phone}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();
  const issue=report.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target.join(" ")).slice(0,5)}));
  if(issue.length)failures.push({path:"mobile-320:"+route,issue});
  console.log((issue.length?"FAIL ":"PASS ")+"mobile-320:"+route+" "+JSON.stringify(issue));
 }
 await phoneContext.close();
 console.log("A11Y SUMMARY: "+JSON.stringify({scans:20,violations:failures.length}));
 if(failures.length)process.exitCode=1;
}catch(e){console.error(e);process.exitCode=1}
finally{if(browser)await browser.close();if(server)server.kill("SIGTERM")}
