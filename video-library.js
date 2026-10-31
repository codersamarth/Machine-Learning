
(function(){
"use strict";
const C=window.ML_CURRICULUM||{lessons:[]},J=window.ML_JOURNEY||{lessons:[]};
const names={zero:"Absolute basics",python:"Python foundations",data:"Understanding data",lecture1:"Lecture 1 · ML and Python",lecture2:"Lecture 2 · Data preparation",lecture3:"Lecture 3 · Regression",supplement:"Supplementary learning"};
const topics=J.lessons.map(l=>({id:l.id,area:l.stage,title:l.title,hook:l.why,plain:l.plain,advanced:"",analogy:l.analogy,formula:"",code:l.code,steps:l.steps||[],pitfall:l.takeaway,question:l.question,choices:l.choices||[],correct:l.correct,source:l.source,origin:"Guided beginner journey",teaching:{example:l.analogy,steps:l.steps||[]}})).concat(C.lessons.map(l=>({id:l.id,area:"lecture"+l.lecture,kind:l.kind||"lecture",section:l.sectionTitle||"Lecture "+l.lecture,title:l.title,hook:l.hook,plain:l.simple,advanced:l.university,analogy:l.analogy,formula:l.formula,code:l.code,steps:[],pitfall:l.pitfall,question:l.question,choices:l.choices||[],correct:l.correct,source:l.source,origin:"Lecture "+l.lecture,teaching:l.teaching||null})));
const state={query:"",area:"all",status:"all",selected:null,links:{}};
let oldFocus=null;
const el=id=>document.getElementById(id),esc=s=>String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
const notice=s=>el("status").textContent=s;
const safeName=s=>s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,58);
const filename=t=>t.id+"-"+safeName(t.title)+".md";
function validUrl(s){try{const u=new URL(s);return u.protocol==="https:"||(u.protocol==="http:"&&["localhost","127.0.0.1"].includes(u.hostname))}catch(e){return false}}
function load(){state.links={};try{const x=JSON.parse(localStorage.getItem("ml-video-links-v1"));if(x&&typeof x==="object"&&!Array.isArray(x))Object.assign(state.links,x)}catch(e){}Object.assign(state.links,window.ML_VIDEO_LINKS||{})}
function save(){try{localStorage.setItem("ml-video-links-v1",JSON.stringify(state.links))}catch(e){notice("Storage unavailable; export your links to keep them")}}
function download(name,content,mime){const blob=new Blob([content],{type:mime||"text/markdown;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200)}
function sourceFor(t){
 const out=["# "+t.title,"","Independent ML Playground source pack.","Learning area: "+names[t.area],"Curriculum: "+t.origin+" / "+(t.section||"Beginner foundations"),"Source reference label: "+(t.source||"Supplementary explanation"),"","## Teaching question",t.hook,"","## Plain-English explanation",t.plain,""];
 if(t.advanced)out.push("## Deeper explanation",t.advanced,"");
 if(t.analogy)out.push("## Everyday analogy",t.analogy,"");
 if(t.teaching){out.push("## Worked explanation",t.teaching.example||"");(t.teaching.steps||[]).forEach((step,i)=>out.push("Step "+(i+1)+": "+step));out.push("")}
 if(t.formula)out.push("## Equation",t.formula,"","Explain what each symbol means and give units where possible.","");
 if(t.code){out.push("## Example Python","    "+t.code.split("\n").join("\n    "),"","## Code commentary");if(t.steps.length)t.steps.forEach((step,i)=>out.push("Line "+(i+1)+": "+t.code.split("\n")[i],step));else out.push("For each line identify inputs, execution, output shape/type and whether fit or transform learned parameters.");out.push("")}
 if(t.pitfall)out.push("## Key takeaway / common mistake",t.pitfall,"");
 if(t.question&&t.choices.length){out.push("## Knowledge check",t.question);t.choices.forEach((v,i)=>out.push(String.fromCharCode(65+i)+". "+v));out.push("Answer: "+String.fromCharCode(65+t.correct)+" — "+t.choices[t.correct],"")}
 out.push("## Accuracy instructions","Use only the specific explanations above. Do not invent figures or code output. Source references identify summaries, not proof a particular source document is embedded here. If a slide, image or dataset row is not included, say it is unavailable. Treat this pack as a beginner study aid, not an official lecture transcript. Distinguish supplementary concepts from lecture material.","","## Suggested visual storytelling","Start with the real-world scenario, teach the three steps with one dominant graphic at a time, distinguish examples from actual dataset results, explain the mathematics and code patiently, and finish with the quiz answer.");
 return out.join("\n");
}
function promptFor(t){
 return "Produce an English beginner-friendly VIDEO OVERVIEW of the source document titled "+t.title+". Focus only on this topic; do not summarise unrelated lessons. Start by answering the opening question without jargon. Give a vivid real-world analogy, show a diagram, then teach the supplied worked example in three short logical steps, slowly enough for a complete beginner. Avoid presenting plain-English and university explanations as one dense paragraph. "+(t.formula?"Visually explain the equation "+t.formula+" and clearly label every symbol and units. ":"")+(t.code?"Walk through the example Python ONE LINE AT A TIME, identify variables, inputs, output type, shape, fit/transform/predict behaviour and common mistakes. Do not imply code was run unless outputs appear in the source. ":"Use a simple labelled thought experiment, not invented Python.")+" Build a friendly Whiteboard or Classic-style Explainer video, ideally 3–6 minutes if your account and format permit. Keep screen text large enough to read on a smartphone. The voice should be a calm, precise tutor. Finish with the source comprehension question, pause briefly, give the correct answer with a reason, and recap the key misconception. Use only the selected notebook source; do not fabricate classroom claims, dataset rows, model performance, causal statements, or copyrighted slide imagery.";
}
function statusCount(){return topics.filter(t=>!!state.links[t.id]).length}
function render(){
 const q=state.query.trim().toLowerCase();
 const filtered=topics.filter(t=>(state.area==="all"||t.area===state.area||(state.area==="supplement"&&t.kind==="supplement"))&&(state.status==="all"||(state.status==="ready"?!!state.links[t.id]:!state.links[t.id]))&&(!q||(t.title+" "+t.hook+" "+t.plain+" "+t.source).toLowerCase().includes(q)));
 notice(topics.length+" topic source packs prepared · "+statusCount()+" video links attached · "+(topics.length-statusCount())+" awaiting video generation");
 el("video-grid").innerHTML=filtered.map(t=>{const ready=!!state.links[t.id];return '<article class="video-topic"><span class="video-group">'+esc(names[t.area])+' · '+esc(t.section||"Beginner foundations")+' · '+esc(t.id.toUpperCase())+(t.kind==="supplement"?" · OPTIONAL":"")+'</span><span class="play-ico" aria-hidden="true">'+(ready?"▶️":"🎞️")+'</span><h3>'+esc(t.title)+'</h3><p>'+esc(t.hook)+'</p><div class="video-topic-bottom"><span class="video-chip '+(ready?"done":"")+'">'+(ready?"Link saved":"Source ready")+'</span><button type="button" class="btn alt small" data-topic="'+esc(t.id)+'">'+(ready?"Open video →":"Prepare video →")+'</button></div></article>'}).join("")||'<div class="card"><h3>No matching topics</h3><p>Try a different search.</p></div>';
}
function player(link){
 if(!link)return '<div class="video-preview">No video has been published for this lesson yet. The full reading and a topic-specific video source are available.</div>';
 const safe=esc(link);
 if(/\.(mp4|webm)(?:[?#]|$)/i.test(link))return '<video class="video-player" controls playsinline preload="metadata" src="'+safe+'">Video not supported.</video><p class="tiny">Play the lesson here on ML Playground without opening another website.</p>';
 return '<div class="video-preview">Video link saved. <a href="'+safe+'" target="_blank" rel="noopener noreferrer">Open the video or Gemini Notebook Overview ↗</a><p class="tiny">Notebook links may require Google sign-in and appropriate sharing access. Sharing a notebook could expose its underlying sources.</p></div>';
}
function openTopic(id){
 const t=topics.find(x=>x.id===id);if(!t)return;oldFocus=document.activeElement;state.selected=id;
 el("detail-body").innerHTML='<h2 id="detail-heading">'+esc(t.title)+'</h2><p class="lead">'+esc(t.hook)+'</p>'+player(state.links[id])+
 '<div class="video-actions"><button class="btn" id="download-source" type="button">⬇ Download lesson source</button><button class="btn alt" id="copy-video-prompt" type="button">Copy generation prompt</button><a class="btn alt" href="https://notebooklm.google.com/" target="_blank" rel="noopener noreferrer">Open Gemini Notebook ↗</a></div>'+
 '<div class="eyebrow">ATTACH THE GENERATED VIDEO</div><label for="video-link">Gemini Notebook video share URL, YouTube URL or hosted MP4 URL</label><input class="input" id="video-link" type="url" inputmode="url" placeholder="https://…" value="'+esc(state.links[id]||"")+'"><div class="row"><button class="btn small" id="save-video" type="button">Save video link</button><button class="btn alt small" id="remove-video" type="button">Remove link</button></div>'+
 '<div class="eyebrow" style="margin-top:22px">CUSTOMISED GEMINI NOTEBOOK PROMPT</div><p class="source-label">'+esc(t.source)+'</p><pre class="codebox" tabindex="0" role="region" aria-label="Scrollable Gemini Notebook generation prompt">'+esc(promptFor(t))+'</pre><p class="tiny">Always fact-check the video against the lesson, especially formulas and code. Playable videos appear directly in the ML Playground player. Only generated, reviewed videos are marked ready. External notebook links may still require separate permissions.</p>';
 el("video-detail").hidden=false;document.body.style.overflow="hidden";el("close-detail").focus();
}
function closeTopic(){el("video-detail").hidden=true;state.selected=null;document.body.style.overflow="";if(oldFocus&&oldFocus.isConnected)oldFocus.focus()}
function current(){return topics.find(t=>t.id===state.selected)}
document.addEventListener("click",e=>{
 const b=e.target.closest("[data-topic]");if(b){openTopic(b.dataset.topic);return}
 if(e.target.id==="close-detail"||e.target.id==="video-detail"){closeTopic();return}
 if(e.target.id==="download-source"){const t=current();if(t)download(filename(t),sourceFor(t));return}
 if(e.target.id==="copy-video-prompt"){const t=current();if(t&&navigator.clipboard)navigator.clipboard.writeText(promptFor(t)).then(()=>notice("Prompt copied")).catch(()=>notice("Could not copy; select the visible prompt"));return}
 if(e.target.id==="save-video"){const t=current(),link=el("video-link").value.trim();if(!t)return;if(link&&!validUrl(link)){notice("Please enter a valid HTTPS URL");el("video-link").focus();return}if(link)state.links[t.id]=link;else delete state.links[t.id];save();render();openTopic(t.id);return}
 if(e.target.id==="remove-video"){const t=current();if(t){delete state.links[t.id];save();render();openTopic(t.id)}}
});
document.addEventListener("keydown",e=>{if(el("video-detail").hidden)return;if(e.key==="Escape"){closeTopic();return}if(e.key==="Tab"){const nodes=Array.from(el("video-detail").querySelectorAll("button:not([disabled]),a[href],input:not([disabled]),video[controls]")).filter(n=>n.getClientRects().length>0);if(!nodes.length)return;const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
el("how-btn").addEventListener("click",function(){el("how").hidden=!el("how").hidden;this.setAttribute("aria-expanded",String(!el("how").hidden))});
el("search").addEventListener("input",function(){state.query=this.value;render()});
el("group").addEventListener("change",function(){state.area=this.value;render()});
el("status-filter").addEventListener("change",function(){state.status=this.value;render()});
el("export-links").addEventListener("click",()=>download("ml-playground-video-links.json",JSON.stringify({version:1,links:state.links},null,2),"application/json"));
el("import-links").addEventListener("change",function(){const f=this.files[0];if(!f)return;if(f.size>200000){notice("File too large");return}f.text().then(txt=>{try{const x=JSON.parse(txt);if(x.version!==1||!x.links||typeof x.links!=="object"||Array.isArray(x.links))throw Error("Wrong format");const accepted={};Object.entries(x.links).forEach(([id,url])=>{if(topics.some(t=>t.id===id)&&typeof url==="string"&&validUrl(url))accepted[id]=url});state.links=Object.assign({},state.links,accepted);save();render();notice("Imported "+Object.keys(accepted).length+" video links")}catch(e){notice("Invalid video backup; no data changed")}})});

el("download-all").addEventListener("click",async function(){
 if(!window.JSZip){notice("ZIP export requires internet for the JSZip library. Individual topic downloads still work.");return}
 const button=this;button.disabled=true;notice("Preparing "+topics.length+" individual Markdown lesson sources...");
 try{
  const zip=new JSZip();
  topics.forEach(t=>zip.file("topic-sources/"+filename(t),sourceFor(t)));
  zip.file("README.txt","Gemini Notebook Video Overview source pack\n\nImport ONE Markdown file per focused video. Use its specific prompt from https://coding-five-woad.vercel.app/video-library.html\n\nMaterials are independently authored beginner-level learning summaries, not copies of private INSEAD teaching documents.\n");
  const blob=await zip.generateAsync({type:"blob"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="ML-Playground-Notebook-Video-Sources.zip";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  notice("Downloaded "+topics.length+" sources. Import one at a time to avoid mixed-topic videos.");
 }catch(e){notice("Could not create ZIP: "+e.message)}finally{button.disabled=false}
});
load();render();
if(window.addEventListener)window.addEventListener("ml-videos-ready",function(){Object.assign(state.links,window.ML_VIDEO_LINKS||{});render();if(state.selected)openTopic(state.selected)});
if(location.hash){const id=decodeURIComponent(location.hash.slice(1));if(topics.some(t=>t.id===id))openTopic(id)}

})();
