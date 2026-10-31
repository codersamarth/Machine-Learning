(function(){
"use strict";
var P=window.ML_VIDEO_PACKETS,publicLinks=window.ML_VIDEO_LINKS||{};
var $=function(id){return document.getElementById(id)};
var key="ml-topic-video-links-v1";
var localLinks={};try{var saved=JSON.parse(localStorage.getItem(key)||"{}");if(saved&&typeof saved==="object"&&!Array.isArray(saved))localLinks=saved}catch(e){}
function h(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}
function cleanUrl(raw){
 try{var u=new URL(String(raw).trim());if(u.protocol!=="https:")return "";if(u.href.length>1600)return "";if(u.username||u.password)return "";return u.href}catch(e){return ""}
}
function videoLink(id){return cleanUrl(localLinks[id]||publicLinks[id]||"")}
var query=new URLSearchParams(window.location.search);
var chosen=P.topics.find(function(t){return t.id===query.get("topic")})||P.topics[0];
var currentFormat="explainer";
function toast(s){var t=$("video-toast");t.textContent=s;t.style.display="block";clearTimeout(window.__videoToast);window.__videoToast=setTimeout(function(){t.style.display="none"},3500)}
function updateCounts(){
 $("video-topic-count").textContent=P.topics.length;
 $("video-saved-count").textContent=P.topics.filter(function(t){return !!videoLink(t.id)}).length;
 var published=$("public-video-count");if(published)published.textContent=P.topics.filter(function(t){return !!cleanUrl(publicLinks[t.id]||"")}).length;
}
function renderList(){
 var search=$("topic-search").value.trim().toLowerCase(),group=$("topic-group").value;
 var filtered=P.topics.filter(function(t){
  var valid=group==="all"||t.group===group||(group==="saved"&&!!videoLink(t.id));
  return valid&&(!search||(t.title+" "+t.section+" "+t.source).toLowerCase().includes(search));
 });
 $("topic-results").textContent=filtered.length+" topic"+(filtered.length===1?"":"s")+" found";
 $("topic-list").innerHTML=filtered.length?filtered.map(function(t){
  return '<button type="button" data-select="'+h(t.id)+'" class="video-topic '+(chosen.id===t.id?"active ":"")+(videoLink(t.id)?"has-video":"")+'" aria-pressed="'+(chosen.id===t.id)+'"><strong>'+h(t.title)+'</strong><small>'+h(t.section)+(videoLink(t.id)?" · ✓ Video attached":" · Source ready")+'</small></button>';
 }).join(""):'<p class="video-empty">No topics match this filter.</p>';
}
function renderDetail(){
 var t=chosen,link=videoLink(t.id),isLocal=!!cleanUrl(localLinks[t.id]||"");
 var p=P.steeringPrompt(t,currentFormat);
 $("topic-detail").innerHTML=
 '<div class="eyebrow">'+h(t.section)+' · TOPIC '+h(t.id)+'</div>'+
 '<h2>'+h(t.title)+'</h2>'+
 '<span class="video-status '+(link?"ready":"")+'">'+(link?"✓ Video link available":"Video not generated yet")+'</span>'+
 '<p>'+h(t.kind==="journey"?t.lesson.plain:t.lesson.simple)+'</p>'+(t.lesson.teaching?'<div class="video-guide-steps"><b>Understand the idea</b><p>'+h(t.lesson.teaching.example)+'</p><ol>'+t.lesson.teaching.steps.map(function(x){return '<li>'+h(x)+'</li>'}).join('')+'</ol></div>':'')+
 (link?(/\\.(mp4|webm)(?:[?#]|$)/i.test(link)?'<div class="video-actions"><video controls playsinline preload="metadata" src="'+h(link)+'" style="display:block;width:100%;aspect-ratio:16/9;background:#13243b;border-radius:16px">Your browser cannot play the video.</video></div><p class="video-note">Watch here in ML Playground; no external website required.</p>':'<div class="video-actions"><a class="video-action" target="_blank" rel="noopener noreferrer" href="'+h(link)+'">Open external notebook link ↗</a></div>'):'')+
 '<div class="video-actions">'+
 '<button type="button" class="video-action" data-video-act="download-source">↓ Download source (.md)</button>'+
 '<button type="button" class="video-action alt" data-video-act="copy-source">Copy source</button>'+
 '<a class="video-action neutral" href="https://notebooklm.google.com/" rel="noopener noreferrer" target="_blank">Open NotebookLM ↗</a></div>'+
 '<div class="video-link-box"><h3>Generate this video in NotebookLM</h3>'+
 '<label class="video-link-label" for="video-format">Choose the video format</label>'+
 '<select id="video-format"><option value="explainer" '+(currentFormat==="explainer"?"selected":"")+'>Explainer · full teaching</option><option value="short" '+(currentFormat==="short"?"selected":"")+'>Short · quick revision</option></select>'+
 '<p class="video-help">Download the Markdown source, add it as a source in NotebookLM, choose Studio → Video Overview and paste this steering prompt. Whiteboard visuals work well for equations and code.</p>'+
 '<label class="video-link-label" for="video-prompt">Custom steering prompt</label>'+
 '<textarea id="video-prompt" readonly spellcheck="false">'+h(p)+'</textarea>'+
 '<div class="video-actions"><button type="button" class="video-action alt" data-video-act="copy-prompt">Copy video prompt</button><button type="button" class="video-action neutral" data-video-act="download-prompt">Download prompt</button></div></div>'+
 '<details style="margin-top:20px"><summary style="cursor:pointer;font-weight:850">Preview the complete source packet</summary><pre id="video-source-preview" class="video-source">'+h(P.sourceText(t))+'</pre></details>'+
 '<div class="video-link-box"><h3>Attach your finished video</h3>'+
 '<p>Once the video is accurate and shareable, paste its NotebookLM or hosted video link. Your local link appears in this Video Studio, including on your phone if you use the same browser storage.</p>'+
 '<form id="video-link-form"><label class="video-link-label" for="video-url">HTTPS video share URL</label>'+
 '<input id="video-url" type="url" inputmode="url" placeholder="https://notebooklm.google.com/…" value="'+h(isLocal?localLinks[t.id]:"")+'" autocomplete="url" required>'+
 '<div class="video-actions"><button class="video-action" type="submit">Save this video link</button>'+
 (isLocal?'<button type="button" class="video-action neutral" data-video-act="remove-link">Remove saved link</button>':'')+
 '</div></form><p class="video-help">Personal browser link only. To show videos publicly to all students, edit and commit <code>video-map.js</code>. Check that the NotebookLM notebook has the right sharing permissions.</p></div>'+
 '<div class="video-actions"><a class="video-action neutral" href="'+h(t.kind==="journey"?"/journey.html#lesson="+encodeURIComponent(t.id):"/#lesson="+encodeURIComponent(t.id))+'">← Read the written lesson</a></div>';
}
function render(){renderList();renderDetail();updateCounts()}
function downloadText(filename,text,type){
 var blob=new Blob([text],{type:type||"text/markdown;charset=utf-8"}),url=URL.createObjectURL(blob);
 var a=document.createElement("a");a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url)},3000);
}
async function copy(text,target){
 try{if(!navigator.clipboard||!navigator.clipboard.writeText)throw Error("clipboard permission unavailable");await navigator.clipboard.writeText(text);toast("Copied — paste it into NotebookLM")}
 catch(e){var el=$(target);if(el&&el.select){el.focus();el.select();toast("Select and copy the highlighted text manually")}else{toast("Download the source instead; clipboard access is unavailable")}}
}
async function downloadAll(){
 var btn=$("download-all");btn.disabled=true;btn.textContent="Preparing source pack…";
 try{
  if(!window.JSZip)await new Promise(function(resolve,reject){
   var s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js";
   s.onload=resolve;s.onerror=function(){reject(Error("JSZip download unavailable"))};document.head.appendChild(s);
  });
  var zip=new window.JSZip();
  P.topics.forEach(function(t){zip.file("topics/"+P.fileName(t),P.sourceText(t));zip.file("prompts/"+t.id+"-video-prompt.txt",P.steeringPrompt(t,"explainer"))});
  zip.file("README.txt","ML Playground Video Overview source pack: "+P.topics.length+" topics.\nEach topic is an independent educational source, not an official lecture transcript.\nUpload one topic file to NotebookLM, generate a Video Overview, use the matching topic steering prompt, then check correctness and share appropriately.\nDo not publish restricted university readings or private notebook sources.\n");
  var archive=await zip.generateAsync({type:"blob",compression:"DEFLATE"});
  var url=URL.createObjectURL(archive),a=document.createElement("a");a.href=url;a.download="ML-Playground-71-NotebookLM-video-packets.zip";document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url)},3000);toast("All 71 source files and video prompts downloaded");
 }catch(e){toast("Bulk download needs internet; individual topic downloads still work")}
 finally{btn.disabled=false;btn.textContent="↓ Download all 71 topic packets (.zip)"}
}
$("topic-search").addEventListener("input",renderList);
$("topic-group").addEventListener("change",renderList);
$("download-all").addEventListener("click",downloadAll);
$("topic-list").addEventListener("click",function(e){
 var button=e.target.closest("[data-select]");if(!button)return;
 var next=P.topics.find(function(t){return t.id===button.dataset.select});if(!next)return;
 chosen=next;currentFormat="explainer";history.replaceState(null,"","?topic="+encodeURIComponent(next.id));render();
 if(window.matchMedia("(max-width:760px)").matches)$("topic-detail").scrollIntoView({block:"start",behavior:"smooth"});
});
$("topic-detail").addEventListener("change",function(e){if(e.target.id==="video-format"){currentFormat=e.target.value;renderDetail()}});
$("topic-detail").addEventListener("click",function(e){
 var b=e.target.closest("[data-video-act]");if(!b)return;
 var action=b.dataset.videoAct,t=chosen;
 if(action==="download-source")downloadText(P.fileName(t),P.sourceText(t));
 else if(action==="copy-source")copy(P.sourceText(t),"video-source-preview");
 else if(action==="copy-prompt")copy(P.steeringPrompt(t,currentFormat),"video-prompt");
 else if(action==="download-prompt")downloadText(t.id+"-"+currentFormat+"-steering-prompt.txt",P.steeringPrompt(t,currentFormat),"text/plain;charset=utf-8");
 else if(action==="remove-link"){delete localLinks[t.id];try{localStorage.setItem(key,JSON.stringify(localLinks))}catch(e){}render();toast("Local link removed")}
});
$("topic-detail").addEventListener("submit",function(e){
 if(e.target.id!=="video-link-form")return;e.preventDefault();
 var url=cleanUrl($("video-url").value);
 if(!url){toast("Enter a valid HTTPS link to a video you may share");return}
 localLinks[chosen.id]=url;
 try{localStorage.setItem(key,JSON.stringify(localLinks));render();toast("Video link saved on this browser")}catch(e){toast("Storage unavailable; the link was not saved")}
});
render();
if(window.addEventListener)window.addEventListener("ml-videos-ready",render);
})();