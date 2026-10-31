import {chromium} from "playwright";
import {spawn} from "node:child_process";
import {setTimeout as sleep} from "node:timers/promises";

const port=8799,base=process.env.ML_BASE_URL||"http://127.0.0.1:"+port;
const server=process.env.ML_BASE_URL?null:spawn("python3",["-m","http.server",String(port),"--bind","127.0.0.1"],{cwd:process.cwd(),stdio:"ignore"});
const routes=["/","/#regression","/#lab","/#data","/#code","/#python","/#quiz","/#notes","/cases.html","/ingest.html","/video-library.html","/video-production.html","/journey.html","/journey.html#trace","/journey.html#lesson=z01"];
let browser;const fails=[];
try{
  for(let i=0;i<45;i++){try{if((await fetch(base)).ok)break}catch(e){}await sleep(130)}
  browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
  for(const width of [320,360,390,430,768,1024]){
    const context=await browser.newContext({viewport:{width,height:740},isMobile:width<=430,deviceScaleFactor:1,touchscreen:width<=430});
    const page=await context.newPage();
    page.on("pageerror",e=>fails.push({width,kind:"JS",detail:e.message}));
    for(const route of routes){
      await page.goto(base+route,{waitUntil:"domcontentloaded"});
      if(route.startsWith("/#"))await page.waitForTimeout(50);
      const metrics=await page.evaluate(()=>{
        const doc=document.documentElement,root=document.body;
        const overflow=doc.scrollWidth-innerWidth;
        const offscreen=[...document.querySelectorAll("main button,main input,main textarea,main select,.extmain button,.extmain input,.academy-main button")].filter(el=>{const r=el.getBoundingClientRect();if(r.width===0||r.height===0)return false;const cs=getComputedStyle(el);if(cs.visibility==="hidden"||cs.display==="none")return false;const tab=el.closest(".tabs");if(tab&&tab.scrollWidth>tab.clientWidth+2)return false;return r.right>innerWidth+3||r.left < -3}).slice(0,5).map(el=>({tag:el.tagName,label:(el.textContent||el.ariaLabel||"").slice(0,28),outer:el.getBoundingClientRect().right}));
        return {overflow,viewport:innerWidth,docWidth:doc.scrollWidth,buttonsOutside:offscreen};
      });
      if(metrics.overflow>3)fails.push({width,route,kind:"horizontal-scroll",metrics});
      if(metrics.buttonsOutside.length&&width<=430)fails.push({width,route,kind:"offscreen-controls",metrics});
      console.log("VIEW "+width+" "+route+" overflow="+metrics.overflow+" outside="+metrics.buttonsOutside.length);
    }
    if(width<=430){
      await page.goto(base);
      await page.locator("#menu").click();
      const drawer=await page.locator("#sidebar").evaluate(el=>({clientHeight:el.clientHeight,scrollHeight:el.scrollHeight,overflowY:getComputedStyle(el).overflowY,maxScroll:el.scrollHeight-el.clientHeight}));
      console.log("DRAWER "+width+" "+JSON.stringify(drawer));
      if(drawer.scrollHeight>drawer.clientHeight+3 && !["auto","scroll"].includes(drawer.overflowY))fails.push({width,kind:"drawer-is-not-scrollable",drawer});
      const bt=await page.locator("#menu").evaluate(el=>el.getBoundingClientRect().height);
      if(bt<43)fails.push({width,kind:"menu-touch-target",height:bt});
      if(await page.locator("#menu").getAttribute("aria-expanded")!=="true")fails.push({width,kind:"drawer-expanded-state"});
      await page.keyboard.press("Escape");
      if(await page.locator("#menu").getAttribute("aria-expanded")!=="false")fails.push({width,kind:"drawer-Escape-close"});
      await page.locator('.mobile-dock [data-route="lab"]').click();
      if(!/Gelato Regression Laboratory/.test(await page.locator("h1").first().innerText()))fails.push({width,kind:"quick-nav-broken"});
      await page.screenshot({path:"qa-mobile-"+width+".png",fullPage:true});
      await page.goto(base+"/journey.html");
      await page.locator("#toggle-menu").click();
      const a=await page.locator("#academy-side").evaluate(el=>({visible:el.classList.contains("open"),scrollable:el.scrollHeight>el.clientHeight?getComputedStyle(el).overflowY==="auto":true}));
      if(!a.visible||!a.scrollable)fails.push({width,kind:"journey-drawer-failure",drawer:a});
      await page.keyboard.press("Escape");
      if(await page.locator("#toggle-menu").getAttribute("aria-expanded")!=="false")fails.push({width,kind:"journey-menu-Escape-close"});
    }
    await context.close();
  }
  console.log("MOBILE_QA "+JSON.stringify({viewports:[320,360,390,430,768,1024],routes:routes.length,checks:6*routes.length,issues:fails},null,2));
  if(fails.length)process.exitCode=1;
}catch(e){console.error("TEST_ERROR",e);process.exitCode=1}finally{if(browser)await browser.close();if(server)server.kill("SIGTERM")}
